# DocNet (HelloPatient Engine)

**The Professional Clinical Network & AI Simulation Platform**

DocNet is a next-generation medical education and professional networking platform. It bridges the gap between theoretical medical knowledge and clinical practice by combining a **social career network** with a high-fidelity **AI Patient Simulator**.

---

## 🏥 What is this?

DocNet is a React-based single-page application (SPA) powered by Google's **Gemini 2.5 Flash** models. It serves three distinct user groups:
1.  **Learners (Students/Residents):** To practice clinical reasoning in a risk-free environment.
2.  **Professionals (Doctors/Nurses):** To maintain skills, mentor others, and find jobs.
3.  **Institutions (Hospitals):** To train staff and recruit talent based on verified clinical skills.

### Core Philosophy
Traditional medical recruiting relies on resumes and prestige. DocNet introduces **"Proof of Skill"**: users earn badges and scores by diagnosing AI patients, which directly qualify them for job postings on the platform.

---

## 🚀 Key Features

### 1. AI Patient Simulator (`/chat`)
The core engine of the app. It uses **Gemini 2.5 Flash** to roleplay patients with specific medical conditions.
*   **Natural Dialogue:** Users interview patients using natural language (voice or text).
*   **Dynamic Physiology:** The AI tracks the patient's hidden state.
*   **Diagnostic Orders:** Users can order labs (CBC, BMP, Troponin) and Imaging.
*   **Generative Medical Imaging:** Using **Gemini 2.5 Flash Image**, the app generates *unique, case-specific* raw medical images (ECGs with specific waveforms, X-Rays with pathologies, Dermatological rashes) on the fly.
*   **Auto-Pilot Mode:** Users can watch an "AI Doctor" interview the patient to learn ideal questioning techniques.

### 2. The Clinical Network (`/community`)
A LinkedIn-style social feed tailored for medicine.
*   **Case Sharing:** Users can publish interesting cases (real or synthetic) to the community.
*   **Privacy First:** Built-in features to de-identify patient data before posting.
*   **Discussion:** threaded comments and "likes" on clinical decisions.

### 3. Skill-Based Job Board (`/jobs`)
A recruiting platform that matches candidates based on their simulation performance.
*   **Skill Matching:** A job posting for a "Cardiologist" will check if the user has the "ECG Master" badge.
*   **Verified Stats:** Recruiters see a candidate's diagnostic accuracy and empathy scores, not just their CV.

### 4. Custom Case Builder (`/create`)
A "No-Code" tool for educators.
*   **AI Drafting:** Users provide a one-line prompt (e.g., "60M with chest pain"), and the AI generates a full patient persona, history, and vital signs.
*   **Asset Upload:** Doctors can upload real de-identified lab results or images to attach to the case.

---

## 🛠 Technical Architecture

The application is built with a modern frontend stack and relies on client-side AI integration.

*   **Frontend Framework:** React 19 + TypeScript.
*   **Styling:** Tailwind CSS with a custom "Medical Clean" aesthetic (Glassmorphism + Slate/Teal palette).
*   **Icons:** Lucide React.
*   **AI Integration:** `@google/genai` SDK.
    *   **Text/Logic:** `gemini-2.5-flash` (Optimized for speed and complex instruction following).
    *   **Visuals:** `gemini-2.5-flash-image` (Used for generating medical scans and editing images).
*   **State Management:** React Context & Local State (Simulated backend for this demo).

### Directory Structure
*   `components/`: Reusable UI blocks (CaseCards, ChatInterface, Sidebars).
*   `services/`: Direct integration with Gemini API (`geminiService.ts`).
*   `types.ts`: TypeScript definitions for the clinical data models.
*   `constants.ts`: Mock data for the social network and case library.

---

## 🌟 Why is this important?

### 1. The "Clinical Gap"
Medical students often memorize facts but struggle to apply them when a patient is yelling, vague, or presenting with atypical symptoms. DocNet provides infinite, randomized practice scenarios.

### 2. High-Stakes vs. Low-Stakes
Practicing on real patients is high-stakes. DocNet allows learners to make critical mistakes (e.g., missing a stroke diagnosis) in a simulation, receiving immediate feedback without harming a human.

### 3. Generative AI in Medicine
This project demonstrates the **multimodal** capabilities of Gemini. It doesn't just chat; it looks at images, generates images (ECGs), analyzes doctor notes, and simulates complex human behaviors (anxiety, confusion, pain) simultaneously.

---

## ⚡ Getting Started

### Prerequisites
*   Node.js (v18+)
*   A Google Cloud Project with the **Gemini API** enabled.

### Installation

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Set your API Key:
    *   Create a `.env` file in the root.
    *   Add: `API_KEY=your_google_gemini_api_key`
    *   *Note: In the provided code structure, the key is accessed via `process.env.API_KEY`. Ensure your bundler (Vite/Webpack) exposes this.*

4.  Run the development server:
    ```bash
    npm start
    ```

---

## ⚖️ Disclaimer

**DocNet is an educational simulation tool.**
The diagnostic results, patient interactions, and medical imagery are generated by Artificial Intelligence. While designed to be realistic, they may contain inaccuracies. This tool should **never** be used for real-world medical diagnosis or treatment decisions. Always verify information with standard medical literature and supervision.
