import React, { useState } from 'react';
import { Clipboard, ArrowRight, Loader2, FileText, CheckCircle, AlertTriangle, X, PenTool } from 'lucide-react';

interface DoctorNotepadProps {
  onAnalyze: (notes: string) => Promise<{ structuredNote: string; feedback: string; missingInfo: string[] }>;
}

const DoctorNotepad: React.FC<DoctorNotepadProps> = ({ onAnalyze }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rawNotes, setRawNotes] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{ structuredNote: string; feedback: string; missingInfo: string[] } | null>(null);

  const handleAnalyze = async () => {
    if (!rawNotes.trim()) return;
    setIsAnalyzing(true);
    try {
      const data = await onAnalyze(rawNotes);
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed top-24 right-4 z-40 bg-white border border-slate-200 shadow-xl p-3 rounded-full text-[#0A2342] hover:text-[#1CB5B2] hover:scale-105 transition-all"
        title="Open Clinical Note"
      >
        <PenTool className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed top-0 right-0 z-[60] h-full w-96 bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right-10 duration-300 font-sans">
      
      {/* Header */}
      <div className="bg-[#0A2342] px-6 py-4 flex justify-between items-center text-white shrink-0">
        <div>
            <h3 className="font-bold text-lg flex items-center gap-2"><FileText className="w-5 h-5 text-[#1CB5B2]" /> Documentation</h3>
            <p className="text-xs text-slate-300 opacity-80">SOAP Note Builder</p>
        </div>
        <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-full transition-colors"><X className="w-5 h-5" /></button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
        {!result ? (
          <>
            <div className="mb-4">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Scratchpad</label>
                <textarea 
                value={rawNotes}
                onChange={(e) => setRawNotes(e.target.value)}
                className="w-full h-96 p-4 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1CB5B2] outline-none resize-none font-mono leading-relaxed shadow-sm text-slate-700"
                placeholder="- Pt states pain is 8/10&#10;- Onset 2h ago&#10;- Denies nausea&#10;- Plan: ECG, Trop, ASA"
                />
            </div>
            
            <button 
              onClick={handleAnalyze}
              disabled={isAnalyzing || !rawNotes.trim()}
              className="w-full bg-[#1CB5B2] text-white py-3 rounded-xl font-bold text-sm hover:brightness-105 disabled:opacity-50 flex items-center justify-center gap-2 shadow-md transition-all"
            >
              {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              Generate Structured Note (AI)
            </button>
            <p className="text-[10px] text-slate-400 text-center mt-3">
                AI will organize your scratchpad into standard SOAP format.
            </p>
          </>
        ) : (
          <div className="space-y-6">
             <div className="flex justify-between items-center">
                <h4 className="font-bold text-[#0A2342] text-sm uppercase tracking-wide">Structured Output</h4>
                <button onClick={() => setResult(null)} className="text-xs font-bold text-[#1CB5B2] hover:underline">Edit Raw</button>
             </div>
             
             <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs font-mono whitespace-pre-wrap shadow-sm text-slate-700 leading-relaxed">
                {result.structuredNote}
             </div>

             <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                <h5 className="font-bold text-amber-800 text-xs mb-2 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Documentation Feedback</h5>
                <p className="text-xs text-amber-700 leading-relaxed">{result.feedback}</p>
             </div>

             {result.missingInfo.length > 0 && (
                <div className="bg-rose-50 p-4 rounded-xl border border-rose-100">
                   <h5 className="font-bold text-rose-800 text-xs mb-2">Missing Critical Info</h5>
                   <ul className="list-disc list-inside text-xs text-rose-700 space-y-1">
                      {result.missingInfo.map((info, i) => <li key={i}>{info}</li>)}
                   </ul>
                </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorNotepad;