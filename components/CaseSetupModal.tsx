import React, { useState } from 'react';
import { ClinicalCase, Difficulty } from '../types';
import { Settings, FileText, Upload, ChevronRight, X, Shield, ShieldAlert, ShieldCheck } from 'lucide-react';

interface CaseSetupModalProps {
  scenario: ClinicalCase;
  onStart: (updatedDifficulty: Difficulty, protocolFile: { data: string, mime: string } | null) => void;
  onCancel: () => void;
}

const CaseSetupModal: React.FC<CaseSetupModalProps> = ({ scenario, onStart, onCancel }) => {
  const [selectedDiff, setSelectedDiff] = useState<Difficulty>(scenario.difficulty);
  const [activeTab, setActiveTab] = useState<'difficulty' | 'protocol'>('difficulty');
  const [uploadedFile, setUploadedFile] = useState<{ name: string, data: string, mime: string } | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setUploadedFile({
            name: file.name,
            data: base64String,
            mime: file.type
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const diffConfig = {
    [Difficulty.Novice]: { 
      icon: ShieldCheck, 
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      title: 'Novice (Easy)',
      desc: 'Patient is straightforward, cooperative, and gives clear history. Great for learning basic patterns.' 
    },
    [Difficulty.Intermediate]: { 
      icon: Shield, 
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      title: 'Intermediate (Realistic)',
      desc: 'Patient provides information but may need specific prompting. Standard anxiety levels.' 
    },
    [Difficulty.Advanced]: { 
      icon: ShieldAlert, 
      color: 'text-rose-600 bg-rose-50 border-rose-200',
      title: 'Advanced (Complex)',
      desc: 'Patient is vague, anxious, uncooperative, or contradicts themselves. Requires careful interviewing.' 
    },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
           <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                 <Settings className="w-5 h-5 text-indigo-500" /> Case Configuration
              </h2>
              <p className="text-xs text-slate-500">Customize the simulation for {scenario.patientName}</p>
           </div>
           <button onClick={onCancel} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
           </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100">
           <button 
             onClick={() => setActiveTab('difficulty')}
             className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'difficulty' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:bg-slate-50'}`}
           >
             Difficulty
           </button>
           <button 
             onClick={() => setActiveTab('protocol')}
             className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'protocol' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:bg-slate-50'}`}
           >
             Hospital Protocol
           </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
           {activeTab === 'difficulty' ? (
              <div className="space-y-3">
                 <p className="text-sm text-slate-600 mb-2">Select tone and complexity:</p>
                 {Object.values(Difficulty).map((diff) => {
                    const Config = diffConfig[diff];
                    const Icon = Config.icon;
                    const isSelected = selectedDiff === diff;
                    return (
                       <button
                          key={diff}
                          onClick={() => setSelectedDiff(diff)}
                          className={`w-full flex items-start gap-4 p-4 rounded-xl border text-left transition-all ${isSelected ? `ring-2 ring-indigo-500 ring-offset-1 ${Config.color}` : 'bg-white border-slate-200 hover:border-indigo-300'}`}
                       >
                          <div className={`p-2 rounded-lg bg-white/50 shrink-0`}>
                             <Icon className="w-6 h-6" />
                          </div>
                          <div>
                             <h3 className="font-bold text-sm mb-1">{Config.title}</h3>
                             <p className="text-xs opacity-80 leading-relaxed">{Config.desc}</p>
                          </div>
                       </button>
                    );
                 })}
              </div>
           ) : (
              <div className="space-y-6">
                 <div className="flex items-start gap-3 bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                    <FileText className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-indigo-800 leading-relaxed">
                       Upload your specific hospital guidelines (PDF/TXT). The AI will evaluate your adherence to these protocols.
                    </p>
                 </div>
                 
                 <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors">
                    <Upload className="w-8 h-8 text-slate-400 mb-3" />
                    <p className="text-sm font-bold text-slate-700">
                        {uploadedFile ? uploadedFile.name : 'Click to upload protocol'}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">Supports PDF, TXT</p>
                    <input 
                        type="file" 
                        accept=".pdf,.txt" 
                        onChange={handleFileUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                 </div>
              </div>
           )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
           <button onClick={onCancel} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-200 rounded-lg text-sm">Cancel</button>
           <button 
             onClick={() => onStart(selectedDiff, uploadedFile)}
             className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 shadow-md flex items-center gap-2 text-sm"
           >
              Start Simulation <ChevronRight className="w-4 h-4" />
           </button>
        </div>

      </div>
    </div>
  );
};

export default CaseSetupModal;