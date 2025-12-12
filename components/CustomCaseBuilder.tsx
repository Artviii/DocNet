import React, { useState } from 'react';
import { Upload, Mic, FileImage, Save, ArrowLeft, Loader2, Sparkles, ChevronRight, Check, AlertCircle, FileText, X, Microscope, Eye } from 'lucide-react';
import { Difficulty, CaseCategory, Role, DiagnosticAsset } from '../types';
import { PatientSimulator } from '../services/geminiService';

interface CustomCaseBuilderProps {
  onGenerate: (description: string, assets: DiagnosticAsset[], visibility: 'public'|'private') => Promise<void>;
  onCancel: () => void;
  isGenerating: boolean;
}

const CustomCaseBuilder: React.FC<CustomCaseBuilderProps> = ({ onGenerate, onCancel, isGenerating }) => {
  const [step, setStep] = useState(1);
  
  // Form State
  const [title, setTitle] = useState('');
  const [role, setRole] = useState<Role>('Doctor');
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Intermediate);
  const [specialty, setSpecialty] = useState<CaseCategory>('Cardiology');
  
  // Step 2 Content
  const [patientContext, setPatientContext] = useState(''); // "Brief background..."
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [keyFindings, setKeyFindings] = useState('');
  const [fullDraft, setFullDraft] = useState(''); // The AI generated or user edited combined text
  const [isDrafting, setIsDrafting] = useState(false);

  // Step 3 Diagnostics
  const [assets, setAssets] = useState<DiagnosticAsset[]>([]);
  const [isAnalyzingAsset, setIsAnalyzingAsset] = useState<string | null>(null); // ID of asset being analyzed

  // Step 4 Sharing
  const [visibility, setVisibility] = useState<'public' | 'private'>('private');
  const [ownerCommunity, setOwnerCommunity] = useState('General Hospital Residents');
  const [linkCase, setLinkCase] = useState(false);

  const handleDraftWithAI = async () => {
      setIsDrafting(true);
      // Simulate AI Draft generation
      setTimeout(() => {
          const draft = `Patient: ${title || 'Unnamed Patient'}\nRole: ${role}\nContext: ${patientContext}\nCC: ${chiefComplaint}\n\nFindings: ${keyFindings}\n\n[System Note: AI has fleshed out the vitals and initial script based on your inputs.]`;
          setFullDraft(draft);
          setIsDrafting(false);
      }, 1500);
  };

  const handleFinalSave = () => {
      // Combine all inputs into a master description string for the actual generator
      const masterDesc = `
        Title: ${title}
        Role: ${role}
        Difficulty: ${difficulty}
        Specialty: ${specialty}
        Visibility: ${visibility}
        Draft Content: ${fullDraft || patientContext + " " + chiefComplaint}
        Diagnostics Summary: ${assets.map(a => `${a.name}: ${a.description}`).join('; ')}
      `;
      onGenerate(masterDesc, assets, visibility);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              const base64Data = reader.result as string; // Data URL
              const newAsset: DiagnosticAsset = {
                  id: `asset-${Date.now()}`,
                  name: file.name.split('.')[0],
                  type: file.type.includes('image') ? 'Image' : 'Document',
                  url: base64Data,
                  description: '', // To be filled by AI or user
                  mimeType: file.type
              };
              setAssets(prev => [...prev, newAsset]);
          };
          reader.readAsDataURL(file);
      }
  };

  const handleAnalyzeAsset = async (asset: DiagnosticAsset) => {
      setIsAnalyzingAsset(asset.id);
      try {
          const sim = new PatientSimulator(); // Temp instance for analysis
          const analysis = await sim.analyzeUploadedAsset(asset);
          
          setAssets(prev => prev.map(a => a.id === asset.id ? { ...a, description: analysis } : a));
          
          // Optionally append to Key Findings if in Step 2, or just let the user see it
          setKeyFindings(prev => prev ? `${prev}\n\n[Asset Analysis: ${asset.name}]\n${analysis}` : `[Asset Analysis: ${asset.name}]\n${analysis}`);
      } catch (e) {
          console.error(e);
          alert("Failed to analyze asset.");
      } finally {
          setIsAnalyzingAsset(null);
      }
  };

  const removeAsset = (id: string) => {
      setAssets(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* --- HEADER --- */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
            <div>
                <h2 className="text-xl font-bold text-[#0A2342]">Create New Scenario</h2>
                <p className="text-xs text-slate-500">Draft a patient case for training.</p>
            </div>
            <button onClick={onCancel} className="text-slate-400 hover:text-slate-600"><ArrowLeft className="w-5 h-5" /></button>
        </div>

        {/* --- STEPPER --- */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {[1, 2, 3, 4].map(s => (
                <div key={s} className="flex items-center gap-2 shrink-0">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${step === s ? 'bg-[#1CB5B2] text-white' : step > s ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                        {step > s ? <Check className="w-3 h-3" /> : s}
                    </div>
                    <span className={`text-xs font-bold ${step === s ? 'text-[#0A2342]' : 'text-slate-400'} mr-4`}>
                        {s === 1 ? 'Basics' : s === 2 ? 'Clinical' : s === 3 ? 'Diagnostics' : 'Sharing'}
                    </span>
                </div>
            ))}
        </div>

        {/* --- BODY CONTENT --- */}
        <div className="flex-1 overflow-y-auto p-8">
            
            {/* STEP 1: BASICS */}
            {step === 1 && (
                <div className="space-y-6 animate-in slide-in-from-right-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Scenario Title</label>
                        <input 
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="w-full text-sm border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-[#1CB5B2] focus:ring-1 focus:ring-[#1CB5B2]"
                            placeholder="Example: 68M with acute chest pain on exertion"
                            autoFocus
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Target Role</label>
                            <select 
                                value={role} 
                                onChange={e => setRole(e.target.value as Role)}
                                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 outline-none focus:border-[#1CB5B2]"
                            >
                                <option>Doctor</option>
                                <option>Nurse</option>
                                <option>Paramedic</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Specialty</label>
                            <select 
                                value={specialty} 
                                onChange={e => setSpecialty(e.target.value as CaseCategory)}
                                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 outline-none focus:border-[#1CB5B2]"
                            >
                                <option>Cardiology</option>
                                <option>Trauma</option>
                                <option>Pediatrics</option>
                                <option>Respiratory</option>
                                <option>Neurology</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Difficulty</label>
                        <div className="flex gap-3">
                            {Object.values(Difficulty).map(d => (
                                <button
                                    key={d}
                                    onClick={() => setDifficulty(d)}
                                    className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${difficulty === d ? 'bg-[#1CB5B2] text-white border-[#1CB5B2]' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* STEP 2: CLINICAL CONTENT */}
            {step === 2 && (
                <div className="space-y-6 animate-in slide-in-from-right-4">
                    <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex gap-3">
                        <Sparkles className="w-5 h-5 text-indigo-600 shrink-0" />
                        <div className="text-xs text-indigo-800">
                            <p className="font-bold mb-1">AI Copilot Active</p>
                            <p>Fill in the key points below, and I'll draft the full patient persona, vitals, and initial dialogue for you.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Patient Background</label>
                            <textarea 
                                value={patientContext}
                                onChange={e => setPatientContext(e.target.value)}
                                className="w-full h-20 text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-[#1CB5B2] resize-none"
                                placeholder="e.g. 45M, history of heavy alcohol use, recent travel to..."
                            />
                        </div>
                        <div className="col-span-1">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Chief Complaint</label>
                            <input 
                                value={chiefComplaint}
                                onChange={e => setChiefComplaint(e.target.value)}
                                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-[#1CB5B2]"
                                placeholder='e.g. "My stomach hurts"'
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Key Findings (Positives/Negatives)</label>
                            <textarea 
                                value={keyFindings}
                                onChange={e => setKeyFindings(e.target.value)}
                                className="w-full h-20 text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-[#1CB5B2] resize-none"
                                placeholder="e.g. Hypotensive, Tachycardic. Denies chest pain. History of varices."
                            />
                        </div>
                    </div>

                    {!fullDraft ? (
                        <button 
                            onClick={handleDraftWithAI}
                            disabled={!patientContext || isDrafting}
                            className="w-full py-3 border border-dashed border-[#1CB5B2] text-[#1CB5B2] bg-teal-50/50 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-teal-50 transition-colors"
                        >
                            {isDrafting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                            Use AI to draft full scenario
                        </button>
                    ) : (
                        <div className="animate-in fade-in">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1 flex justify-between">
                                Generated Draft <span className="text-[#1CB5B2] cursor-pointer hover:underline" onClick={() => setFullDraft('')}>Reset</span>
                            </label>
                            <textarea 
                                value={fullDraft}
                                onChange={e => setFullDraft(e.target.value)}
                                className="w-full h-40 text-sm bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 outline-none focus:bg-white focus:border-[#1CB5B2]"
                            />
                        </div>
                    )}
                </div>
            )}

            {/* STEP 3: DIAGNOSTICS (NEW) */}
            {step === 3 && (
                <div className="space-y-6 animate-in slide-in-from-right-4">
                    <div className="bg-white border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors relative group">
                        <Upload className="w-10 h-10 text-slate-300 mb-3 group-hover:text-[#1CB5B2] transition-colors" />
                        <p className="text-sm font-bold text-slate-700">
                            Upload Diagnostic Results
                        </p>
                        <p className="text-xs text-slate-400 mt-1 max-w-xs">
                            Images (X-Ray, ECG, Derm) or Documents (PDF Reports). AI can interpret these for you.
                        </p>
                        <input 
                            type="file" 
                            accept="image/*,application/pdf"
                            onChange={handleFileUpload}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                    </div>

                    <div className="space-y-3">
                        {assets.map((asset) => (
                            <div key={asset.id} className="bg-white border border-slate-200 rounded-xl p-4 flex gap-4 animate-in fade-in shadow-sm">
                                {/* Preview Thumbnail */}
                                <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center shrink-0 overflow-hidden border border-slate-100">
                                    {asset.type === 'Image' ? (
                                        <img src={asset.url} className="w-full h-full object-cover" />
                                    ) : (
                                        <FileText className="w-8 h-8 text-slate-400" />
                                    )}
                                </div>

                                {/* Details & Actions */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <input 
                                                value={asset.name}
                                                onChange={(e) => setAssets(prev => prev.map(a => a.id === asset.id ? { ...a, name: e.target.value } : a))}
                                                className="font-bold text-sm text-[#0A2342] border-b border-transparent focus:border-[#1CB5B2] outline-none bg-transparent"
                                                placeholder="Asset Name (e.g. CXR)"
                                            />
                                            <p className="text-xs text-slate-400">{asset.type}</p>
                                        </div>
                                        <button onClick={() => removeAsset(asset.id)} className="text-slate-400 hover:text-red-500"><X className="w-4 h-4" /></button>
                                    </div>

                                    {/* Description / AI Analysis Result */}
                                    <textarea 
                                        value={asset.description}
                                        onChange={(e) => setAssets(prev => prev.map(a => a.id === asset.id ? { ...a, description: e.target.value } : a))}
                                        placeholder="Findings description..."
                                        className="w-full mt-2 text-xs text-slate-600 bg-slate-50 rounded p-2 outline-none focus:bg-white border border-transparent focus:border-slate-200 resize-none h-16"
                                    />

                                    {/* AI Action */}
                                    <div className="mt-2 flex gap-2">
                                        <button 
                                            onClick={() => handleAnalyzeAsset(asset)}
                                            disabled={!!isAnalyzingAsset}
                                            className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded hover:bg-indigo-100 transition-colors"
                                        >
                                            {isAnalyzingAsset === asset.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Eye className="w-3 h-3" />}
                                            Interpret with AI
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* STEP 4: SHARING */}
            {step === 4 && (
                <div className="space-y-8 animate-in slide-in-from-right-4">
                    
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Owner Community</label>
                        <select 
                            value={ownerCommunity}
                            onChange={e => setOwnerCommunity(e.target.value)}
                            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 outline-none focus:border-[#1CB5B2]"
                        >
                            <option>General Hospital Residents</option>
                            <option>Internal Medicine Interest</option>
                            <option>Med School 2025</option>
                        </select>
                        <p className="text-[10px] text-slate-400 mt-1">The scenario will be listed under this community page.</p>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-3">Visibility</label>
                        <div className="space-y-3">
                            <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${visibility === 'private' ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-500' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
                                <input type="radio" className="mt-1" checked={visibility === 'private'} onChange={() => setVisibility('private')} />
                                <div>
                                    <span className="block text-sm font-bold text-[#0A2342]">Org Only</span>
                                    <span className="block text-xs text-slate-500 mt-1">Visible only to members of {ownerCommunity} and your institution.</span>
                                </div>
                            </label>

                            <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${visibility === 'public' ? 'bg-teal-50 border-teal-200 ring-1 ring-[#1CB5B2]' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
                                <input type="radio" className="mt-1" checked={visibility === 'public'} onChange={() => setVisibility('public')} />
                                <div>
                                    <span className="block text-sm font-bold text-[#0A2342]">Share Anonymized to Global</span>
                                    <span className="block text-xs text-slate-500 mt-1">Visible in the global library. Identifying details must be removed.</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    {visibility === 'public' && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-2 items-start">
                            <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                            <p className="text-xs text-amber-800">
                                <strong>De-identification Check:</strong> We will automatically scan for PHI before publishing to the global library.
                            </p>
                        </div>
                    )}

                    <label className="flex items-center gap-2 p-3 hover:bg-slate-50 rounded-lg cursor-pointer">
                        <input type="checkbox" checked={linkCase} onChange={e => setLinkCase(e.target.checked)} className="rounded text-[#1CB5B2] focus:ring-[#1CB5B2]" />
                        <span className="text-sm font-medium text-slate-700">Also create a static teaching Case page</span>
                    </label>

                </div>
            )}

        </div>

        {/* --- FOOTER --- */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
            {step > 1 ? (
                <button onClick={() => setStep(s => s - 1)} className="px-4 py-2 text-slate-500 text-sm font-bold hover:text-slate-700">Back</button>
            ) : (
                <button onClick={onCancel} className="px-4 py-2 text-slate-500 text-sm font-bold hover:text-slate-700">Cancel</button>
            )}

            {step < 4 ? (
                <button 
                    onClick={() => setStep(s => s + 1)} 
                    disabled={step === 1 && !title}
                    className="px-6 py-2 bg-[#1CB5B2] text-white rounded-lg text-sm font-bold hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                    Next <ChevronRight className="w-4 h-4" />
                </button>
            ) : (
                <button 
                    onClick={handleFinalSave}
                    disabled={isGenerating}
                    className="px-6 py-2 bg-[#1CB5B2] text-white rounded-lg text-sm font-bold hover:brightness-105 shadow-md flex items-center gap-2"
                >
                    {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Scenario
                </button>
            )}
        </div>

      </div>
    </div>
  );
};

export default CustomCaseBuilder;