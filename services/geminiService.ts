import { GoogleGenAI, Chat, Schema, Type } from "@google/genai";
import { ClinicalCase, Difficulty, SimulationScore, MessageSender, NoteAnalysis, DiagnosticAsset, Message, MessageType } from "../types";

let aiClient: GoogleGenAI | null = null;

const getClient = (): GoogleGenAI => {
  if (!aiClient) {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable is not set.");
    }
    aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return aiClient;
};

export class PatientSimulator {
  private chatSession: Chat | null = null;
  private currentCase: ClinicalCase | null = null;
  private turnCount: number = 0;

  constructor() {}

  public async startSession(clinicalCase: ClinicalCase): Promise<string> {
    this.currentCase = clinicalCase;
    this.turnCount = 0;
    const ai = getClient();
    
    let difficultyInstruction = "";
    if (clinicalCase.difficulty === Difficulty.Novice) {
      difficultyInstruction = "You are a 'Straightforward Historian'. Answer clearly.";
    } else if (clinicalCase.difficulty === Difficulty.Intermediate) {
        difficultyInstruction = "You are a 'Realistic Historian'. Normal anxiety.";
    } else if (clinicalCase.difficulty === Difficulty.Advanced) {
      difficultyInstruction = "You are a 'Difficult Historian'. Vague, anxious, or contradictory.";
    }

    const fullInstruction = `
      ${clinicalCase.systemInstruction}
      [SIMULATION RULES]
      ${difficultyInstruction}
      - CRITICAL: You are the PATIENT (${clinicalCase.patientName}).
      - CRITICAL: The user is the ${clinicalCase.role}. Do NOT act as a medical professional.
      - Keep responses under 40 words unless telling a specific story.
    `;
    
    this.chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: { systemInstruction: fullInstruction, temperature: 0.9 },
    });

    try {
      const response = await this.chatSession.sendMessage({
        message: `[SYSTEM EVENT: START_SIMULATION]
        CONTEXT: The ${clinicalCase.role} has just entered the room.
        YOUR ACTION: Speak first as the patient. State your chief complaint ("${clinicalCase.chiefComplaint}") in your own words based on your persona.
        DO NOT greet them as a colleague. You are the patient.`
      });
      return response.text || "*Patient looks at you*";
    } catch { return "I don't feel well."; }
  }

  public async sendMessage(message: string): Promise<string> {
    if (!this.chatSession) throw new Error("No session");
    const response = await this.chatSession.sendMessage({ message });
    return response.text || "...";
  }

  // --- AUTO-PILOT ---
  public async getAutoPilotAction(history: string): Promise<{ type: 'message' | 'order' | 'diagnosis', content: string, reasoning: string }> {
      const ai = getClient();
      
      const schema: Schema = {
          type: Type.OBJECT,
          properties: {
              type: { type: Type.STRING, enum: ['message', 'order', 'diagnosis'] },
              content: { type: Type.STRING },
              reasoning: { type: Type.STRING }
          },
          required: ['type', 'content', 'reasoning']
      };

      const prompt = `
        You are an Expert AI Physician interacting with a patient simulation.
        Your goal is to efficiently diagnose the patient by asking questions and ordering relevant tests.

        Current Patient: ${this.currentCase?.age} ${this.currentCase?.gender}, CC: ${this.currentCase?.chiefComplaint}
        
        Transcript Protocol:
        - [AUTOPILOT]: You (The Doctor)
        - [PATIENT]: The Patient
        - [SYSTEM]: Lab Results / Vitals
        
        Session History:
        ${history}
        
        INSTRUCTIONS:
        1. Analyze the history.
        2. If you have enough info, 'diagnosis'.
        3. If you need objective data (labs/imaging) and haven't ordered it yet, 'order'.
        4. Otherwise, ask a relevant clinical question ('message').
        
        CONSTRAINTS:
        - Do not repeat questions.
        - Do not re-order tests already present in [SYSTEM].
        - If the last message was a Lab Result, INTERPRET it in your next 'message' or 'diagnosis'.
        
        OUTPUT JSON ONLY.
      `;

      try {
          const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: prompt,
              config: { 
                  responseMimeType: 'application/json', 
                  responseSchema: schema,
              }
          });
          
          let rawText = response.text || "{}";
          rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
          
          return JSON.parse(rawText);
      } catch (e) {
          console.error("AutoPilot Logic Error:", e);
          return { type: 'message', content: "Can you describe your symptoms again?", reasoning: "Error recovery" };
      }
  }

  // Diagnostic Lab System
  public async runDiagnosticTest(testName: string): Promise<{ text: string; imageUrl?: string }> {
    if (!this.currentCase) {
      throw new Error("No active case.");
    }

    if (this.currentCase.assets) {
        const matchedAsset = this.currentCase.assets.find(a => 
            a.name.toLowerCase().includes(testName.toLowerCase()) || 
            testName.toLowerCase().includes(a.name.toLowerCase())
        );
        if (matchedAsset) {
            return {
                text: matchedAsset.description,
                imageUrl: matchedAsset.url 
            };
        }
    }

    const ai = getClient();
    
    // 1. Generate the Text Report
    const prompt = `
      Act as a Laboratory Information System (LIS).
      
      Patient: ${this.currentCase.patientName}, ${this.currentCase.age} ${this.currentCase.gender}.
      Diagnosis (Ground Truth): ${this.currentCase.diagnosis}
      Doctor Order: "${testName}".
      
      INSTRUCTIONS:
      1. ALWAYS provide a full, realistic report. NEVER just say "Normal limits" or "Unremarkable".
      2. If values are normal, generate a full table with normal values.
      3. IF QUANTITATIVE LAB (e.g. CBC, BMP, Trop): OUTPUT A MARKDOWN TABLE with columns: | Component | Result | Ref Range | Flag |.
      4. IF IMAGING/PROCEDURAL (e.g. X-Ray, CT, ECG): Provide a formal report sectioned by "TECHNIQUE", "FINDINGS", and "IMPRESSION".
         
      Do NOT write a preamble. Just output the report/table.
    `;

    let reportText = "Test unavailable.";
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      reportText = response.text || "Test unavailable.";
    } catch (error) {
      console.error("Diagnostic Text Error:", error);
      return { text: "Error: Lab system offline. Please retry." };
    }

    // 2. Generate the Medical Image (if applicable)
    const visualKeywords = ['ecg', 'ekg', 'x-ray', 'cxr', 'ct', 'mri', 'ultrasound', 'scan', 'us', 'echo', 'imaging', 'derm', 'skin', 'rash', 'lesion', 'angio'];
    const isVisual = visualKeywords.some(k => testName.toLowerCase().includes(k));
    
    let imageUrl: string | undefined;

    if (isVisual) {
      try {
        let stylePrompt = "High quality medical image.";
        const lowerTest = testName.toLowerCase();

        // Specific Prompt Engineering for Medical Types to avoid "Document Headers"
        if (lowerTest.includes('ecg') || lowerTest.includes('ekg')) {
            stylePrompt = `
                TYPE: 12-Lead ECG Rhythm Strip.
                VISUALS: Close-up macro view of the pink grid paper and black waveform lines only. 
                CONTENT: Show distinct P-waves, QRS complexes, and T-waves.
                NEGATIVE PROMPT: Do NOT show a document header, do not show text, do not show a hospital logo. Just the waves.
            `;
        } else if (lowerTest.includes('x-ray') || lowerTest.includes('cxr')) {
            stylePrompt = `
                TYPE: Chest X-Ray (CXR) or skeletal radiograph.
                VISUALS: High contrast, black and white DICOM style image.
                CONTENT: Clear lung fields, heart shadow, or bone structure.
                NEGATIVE PROMPT: No text annotations, no yellow labels.
            `;
        } else if (lowerTest.includes('derm') || lowerTest.includes('skin')) {
            stylePrompt = `
                TYPE: Clinical Macro Photography.
                VISUALS: Realistic skin texture, professional medical lighting.
                CONTENT: Close up of the lesion/rash.
            `;
        } else if (lowerTest.includes('ct') || lowerTest.includes('mri')) {
            stylePrompt = `
                TYPE: Axial CT or MRI Slice.
                VISUALS: Grayscale medical scan.
                CONTENT: Anatomical cross-section.
                NEGATIVE PROMPT: No phantom artifacts, no text overlay.
            `;
        }

        const imagePrompt = `
          Generate a RAW MEDICAL DIAGNOSTIC IMAGE.
          
          ${stylePrompt}
          
          PATIENT CONTEXT:
          Age/Sex: ${this.currentCase.age} ${this.currentCase.gender}
          Pathology to illustrate: ${this.currentCase.diagnosis}
          Specific Findings based on report: ${reportText.slice(0, 300)}
          
          CRITICAL: Do not generate a picture of a paper report. Generate the scan/image itself.
        `;

        const imageResponse = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: { parts: [{ text: imagePrompt }] },
        });

        for (const part of imageResponse.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData) {
            imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            break;
          }
        }
      } catch (error) {
        console.error("Image Gen Error:", error);
      }
    }

    return { text: reportText, imageUrl };
  }

  public async interpretDiagnosticResult(text: string): Promise<string> {
      const ai = getClient();
      const prompt = `
        You are a senior attending physician teaching a resident.
        Analyze the following diagnostic result:
        "${text}"

        Your Task:
        1. Explain the key abnormal findings.
        2. Explain the clinical significance (pathophysiology).
        3. CRITICAL RULE: DO NOT state the final diagnosis or the name of the disease. Keep it as an "interpretation of findings" only to let the learner figure out the diagnosis.
        4. Keep it concise (under 3 sentences).
      `;
      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt
      });
      return response.text || "Findings consistent with pathology.";
  }

  public async analyzeClinicalNotes(rawNotes: string, protocolContext?: string): Promise<NoteAnalysis> {
    return { structuredNote: rawNotes, feedback: "Good", missingInfo: [] };
  }

  public async askClinicalTutor(q: string, h: string): Promise<string> {
      const ai = getClient();
      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `Tutor this student based on diagnosis ${this.currentCase?.diagnosis}. Question: ${q}`
      });
      return response.text || "I can't answer that right now.";
  }
  
  public async submitDiagnosticResult(r: string) {
      if(this.chatSession) await this.chatSession.sendMessage({ message: `[SYSTEM] ${r}`});
  }

  public async generateReflectionPrompt(history: string): Promise<string> {
    const ai = getClient();
    const prompt = `
      Act as a Clinical Educator. 
      Review this chat history: ${history.slice(-1000)}.
      Ask the student ONE thoughtful, open-ended question to help them reflect on a potential gap or a good move they made.
      Do not give the answer yet. Just ask the question.
    `;
    const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
    return response.text || "How do you think that went?";
  }

  public async evaluateSession(
      messages: Message[], 
      handoverNote: string, 
      protocolFileBase64?: string, 
      protocolMimeType?: string
  ): Promise<SimulationScore> {
    
    if (!this.currentCase) throw new Error("No active case");
    const ai = getClient();

    // Prepare Transcript
    const transcript = messages.map(m => {
        const senderLabel = m.sender === MessageSender.User ? "USER_DOCTOR" : m.sender === MessageSender.AutoPilot ? "AI_AUTOPILOT" : m.sender.toUpperCase();
        return `[${senderLabel}]: ${m.text}`;
    }).join('\n');

    const parts: any[] = [];
    
    const textPrompt = `
      You are a Medical Board Examiner. Evaluate this clinical session.
      
      Patient Case: ${this.currentCase.patientName} (${this.currentCase.diagnosis})
      
      FULL TRANSCRIPT:
      ${transcript}

      USER HANDOVER NOTE (SBAR):
      "${handoverNote}"
      
      EVALUATION RULES:
      1. IGNORE actions taken by [AI_AUTOPILOT]. They do NOT count towards the user's score.
      2. EVALUATE ONLY the [USER_DOCTOR] moves.
      3. If the user ordered tests, check if they were NECESSARY (High Value Care) or WASTEFUL.
      4. If the user did very little (e.g. mostly AutoPilot), give a neutral/low score and note it.
      
      TASK:
      1. Score (0-100) based strictly on User performance.
      2. Create a 'billBreakdown' list of tests specifically ordered by the USER. Mark if they were necessary.
      3. Provide specific feedback on User's choices.

      Output JSON Schema.
    `;
    parts.push({ text: textPrompt });

    if (protocolFileBase64 && protocolMimeType) {
        parts.push({
            inlineData: {
                mimeType: protocolMimeType,
                data: protocolFileBase64
            }
        });
    }

    const schema: Schema = {
      type: Type.OBJECT,
      properties: {
        totalScore: { type: Type.INTEGER },
        diagnosisCorrect: { type: Type.BOOLEAN },
        userDiagnosis: { type: Type.STRING },
        actualDiagnosis: { type: Type.STRING },
        accuracyScore: { type: Type.INTEGER },
        efficiencyScore: { type: Type.INTEGER },
        communicationScore: { type: Type.INTEGER },
        empathyFeedback: { type: Type.STRING },
        handoverScore: { type: Type.INTEGER },
        handoverFeedback: { type: Type.STRING },
        totalBill: { type: Type.NUMBER },
        billBreakdown: { 
            type: Type.ARRAY, 
            items: { 
                type: Type.OBJECT, 
                properties: { 
                    item: {type:Type.STRING}, 
                    cost:{type:Type.NUMBER}, 
                    isNecessary:{type:Type.BOOLEAN}, 
                    notes:{type:Type.STRING}
                }
            }
        },
        feedbackSummary: { type: Type.STRING },
        keyTakeaway: { type: Type.STRING },
        missedCriticalSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
        nextRecommendedSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
        timelineAnalysis: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    turnIndex: { type: Type.INTEGER },
                    type: { type: Type.STRING, enum: ['good', 'bad', 'neutral', 'critical'] },
                    comment: { type: Type.STRING },
                    originalMessage: { type: Type.STRING }
                }
            }
        }
      },
      required: ['totalScore', 'diagnosisCorrect', 'billBreakdown', 'nextRecommendedSteps']
    };

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts }, 
        config: {
          responseMimeType: 'application/json',
          responseSchema: schema
        }
      });
      return JSON.parse(response.text || "{}") as SimulationScore;
    } catch (e) {
      console.error(e);
      return {
          totalScore: 0, diagnosisCorrect: false, userDiagnosis: "Error", actualDiagnosis: "Error",
          accuracyScore: 0, efficiencyScore: 0, communicationScore: 0, empathyFeedback: "Error",
          handoverScore: 0, handoverFeedback: "Error", totalBill: 0, billBreakdown: [],
          feedbackSummary: "Evaluation Failed", keyTakeaway: "Error", missedCriticalSteps: [],
          timelineAnalysis: [], nextRecommendedSteps: []
      };
    }
  }

  public async analyzeUploadedAsset(asset: DiagnosticAsset): Promise<string> {
      const ai = getClient();
      const base64Data = asset.url.split(',')[1] || asset.url;
      try {
          const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: {
                  parts: [
                      { text: "Analyze this medical asset. Describe findings." },
                      { inlineData: { mimeType: asset.mimeType, data: base64Data } }
                  ]
              }
          });
          return response.text || "Could not interpret asset.";
      } catch (e) {
          console.error(e);
          return "Error analyzing asset.";
      }
  }

  public async createCustomCase(userDescription: string, files: DiagnosticAsset[]): Promise<ClinicalCase> {
      const ai = getClient();
      const parts: any[] = [{ text: `Generate a ClinicalCase based on: "${userDescription}". Output JSON.` }];
      try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts },
            config: { responseMimeType: 'application/json' }
        });
        const data = JSON.parse(response.text || "{}");
        return { 
            id: `custom-${Date.now()}`, 
            avatarUrl: 'https://i.pravatar.cc/150?u=custom', 
            ...data,
            assets: files 
        } as ClinicalCase;
      } catch {
          throw new Error("Failed to create case");
      }
  }
  
  public async generateClinicalCase(role: any, diff: any, cat: any): Promise<ClinicalCase> {
      return this.createCustomCase(`Generate a ${diff} ${cat} case for a ${role}`, []);
  }

  public endSession() {
    this.chatSession = null;
    this.currentCase = null;
    this.turnCount = 0;
  }
}