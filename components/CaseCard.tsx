import React from 'react';
import { ClinicalCase, Difficulty } from '../types';
import { User, ChevronRight, Activity, Globe, Building2, Play, AlertTriangle, Eye } from 'lucide-react';

interface CaseCardProps {
  scenario: ClinicalCase;
  onSelect: (scenario: ClinicalCase) => void;
  highScore?: number;
}

const CaseCard: React.FC<CaseCardProps> = ({ scenario, onSelect, highScore }) => {
  const isCompleted = highScore !== undefined;
  
  const difficultyConfig = {
    [Difficulty.Novice]: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Novice' },
    [Difficulty.Intermediate]: { bg: 'bg-sky-50', text: 'text-sky-700', label: 'Intermediate' },
    [Difficulty.Advanced]: { bg: 'bg-purple-50', text: 'text-purple-700', label: 'Advanced' },
  };

  const diffStyle = difficultyConfig[scenario.difficulty] || difficultyConfig[Difficulty.Intermediate];

  const isGlobal = scenario.visibility === 'public';

  const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      onSelect(scenario);
  };

  return (
    <div 
      onClick={handleClick}
      className="group bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md hover:border-[#1CB5B2] transition-all cursor-pointer flex flex-col h-full relative overflow-hidden"
    >
      {/* Top Row: Level & Visibility */}
      <div className="flex justify-between items-center mb-3">
        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${diffStyle.bg} ${diffStyle.text}`}>
           {diffStyle.label}
        </span>
        
        <div className={`flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${isGlobal ? 'bg-slate-100 text-slate-500' : 'bg-teal-50 text-[#1CB5B2]'}`}>
           {isGlobal ? <Globe className="w-3 h-3" /> : <Building2 className="w-3 h-3" />}
           {isGlobal ? 'Global' : 'Org Only'}
        </div>
      </div>

      {/* Patient & Role */}
      <div className="mb-2">
         <div className="flex items-center gap-2">
            <h3 className="font-bold text-[#0A2342] text-lg leading-tight group-hover:text-[#1CB5B2] transition-colors">
               {scenario.patientName}
            </h3>
            <span className="text-[10px] font-bold text-slate-400 border border-slate-200 px-1.5 rounded bg-slate-50">
               {scenario.role}
            </span>
         </div>
         <p className="text-xs text-slate-500 mt-1">
            {scenario.age}yo {scenario.gender}
         </p>
      </div>

      {/* CC & Summary */}
      <div className="mb-4 flex-1">
         <div className="text-xs font-medium text-slate-700 italic mb-1.5 line-clamp-1">
            "CC: {scenario.chiefComplaint}"
         </div>
         <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
            {scenario.description}
         </p>
      </div>

      {/* Owner Line */}
      <div className="flex items-center gap-1.5 mb-4 pb-4 border-b border-slate-50">
         <Building2 className="w-3 h-3 text-slate-400" />
         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
            Owned by: {scenario.institutionId ? 'General Hospital' : 'DocNet Global'}
         </span>
      </div>

      {/* Bottom Row: Tags & CTA */}
      <div className="flex justify-between items-center mt-auto">
         <span className="text-[10px] font-bold text-[#1CB5B2] bg-[#E0F7F6] px-2 py-1 rounded flex items-center gap-1">
            <Activity className="w-3 h-3" /> {scenario.category}
         </span>

         {isCompleted ? (
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
               High Score: {highScore}
            </div>
         ) : (
            <div className="flex gap-2">
                <button 
                    className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-[#1CB5B2] transition-colors"
                    onClick={handleClick}
                >
                    Details
                </button>
                <button 
                    className="flex items-center gap-1 text-xs font-bold text-[#1CB5B2] border border-[#1CB5B2] px-3 py-1.5 rounded-full group-hover:bg-[#1CB5B2] group-hover:text-white transition-colors"
                    onClick={handleClick}
                >
                    Open <ChevronRight className="w-3 h-3" />
                </button>
            </div>
         )}
      </div>
    </div>
  );
};

export default CaseCard;