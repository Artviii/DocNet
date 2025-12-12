import React from 'react';
import { ClinicalCase } from '../types';
import { Clock, Shield, FileText, AlertCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface PatientSidebarProps {
  activeCase: ClinicalCase;
}

const PatientSidebar: React.FC<PatientSidebarProps> = ({ activeCase }) => {
  const { initialVitals, patientName, age, gender, avatarUrl } = activeCase;

  // Mock trend logic for visual demonstration
  const getTrendIcon = (param: string) => {
      if (param === 'hr') return <TrendingUp className="w-3 h-3 text-emerald-400" />;
      if (param === 'bp') return <Minus className="w-3 h-3 text-slate-400" />;
      return <TrendingDown className="w-3 h-3 text-amber-400" />;
  };

  return (
    <div className="w-[280px] bg-white h-full border-r border-slate-200 shadow-xl flex flex-col font-sans shrink-0 z-30">
      
      {/* 1. Patient Identity Header */}
      <div className="p-6 pb-4 flex flex-col items-center text-center border-b border-slate-50">
         <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-md mb-3 ring-1 ring-slate-100">
            <img src={avatarUrl} className="w-full h-full object-cover" />
         </div>
         <h2 className="text-lg font-bold text-[#0A2342] leading-tight">{patientName}</h2>
         <div className="flex items-center gap-1 text-xs text-slate-500 mt-1 font-medium uppercase tracking-wide">
            <span>{age}Y</span>
            <span className="text-slate-300">•</span>
            <span>{gender}</span>
            <span className="text-slate-300">•</span>
            <span>ID: {activeCase.id.split('-')[1] || '8921'}</span>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
         
         {/* 2. Chief Complaint Card */}
         <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 shadow-sm">
            <div className="text-[9px] font-bold text-rose-400 uppercase tracking-wider mb-1 flex items-center gap-1">
               <AlertCircle className="w-3 h-3" /> Chief Complaint
            </div>
            <p className="text-rose-900 font-bold text-sm leading-snug">
               "{activeCase.chiefComplaint}"
            </p>
         </div>

         {/* 3. Triage Info */}
         <div className="space-y-2.5 px-1">
            <div className="flex items-center gap-3">
               <div className="w-6 h-6 rounded bg-slate-50 text-slate-400 flex items-center justify-center shrink-0"><Clock className="w-3 h-3" /></div>
               <div>
                  <div className="text-[9px] font-bold text-slate-400 uppercase">Arrival</div>
                  <div className="text-xs font-bold text-slate-700">08:42 AM</div>
               </div>
            </div>
            <div className="flex items-center gap-3">
               <div className="w-6 h-6 rounded bg-slate-50 text-slate-400 flex items-center justify-center shrink-0"><Shield className="w-3 h-3" /></div>
               <div>
                  <div className="text-[9px] font-bold text-slate-400 uppercase">Code</div>
                  <div className="text-xs font-bold text-slate-700">Full Code</div>
               </div>
            </div>
            <div className="flex items-center gap-3">
               <div className="w-6 h-6 rounded bg-slate-50 text-slate-400 flex items-center justify-center shrink-0"><FileText className="w-3 h-3" /></div>
               <div>
                  <div className="text-[9px] font-bold text-slate-400 uppercase">Allergies</div>
                  <div className="text-xs font-bold text-slate-700">NKA</div>
               </div>
            </div>
         </div>

         <div className="h-px bg-slate-100 w-full"></div>

         {/* 4. Live Telemetry Widget */}
         <div>
            <div className="flex justify-between items-center mb-2 px-1">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Live Telemetry</h3>
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
            </div>
            
            <div className="bg-[#0f172a] rounded-xl p-3 shadow-inner border border-slate-800 relative overflow-hidden">
               {/* Scanline overlay */}
               <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 pointer-events-none bg-[length:100%_4px,6px_100%] opacity-50"></div>
               
               {/* ECG Wave */}
               <div className="h-10 mb-3 border-b border-slate-800/50 relative">
                  <svg className="absolute inset-0 w-full h-full stroke-emerald-500 fill-none stroke-[1.5]" viewBox="0 0 300 50" preserveAspectRatio="none">
                     <path d="M0,25 L20,25 L25,10 L30,40 L35,25 L50,25 L60,25 L65,15 L70,35 L75,25 L100,25" vectorEffect="non-scaling-stroke" className="animate-[flow_2s_linear_infinite]" strokeDasharray="300" strokeDashoffset="300">
                        <animate attributeName="stroke-dashoffset" from="300" to="0" dur="2s" repeatCount="indefinite" />
                     </path>
                  </svg>
               </div>

               <div className="grid grid-cols-2 gap-y-3 gap-x-2 relative z-20">
                  {/* HR */}
                  <div className="flex justify-between items-end">
                     <div>
                        <div className="text-emerald-500 text-[9px] font-bold uppercase mb-0.5">HR</div>
                        <div className="text-2xl font-mono font-bold text-emerald-400 leading-none">{initialVitals.hr}</div>
                     </div>
                     <div className="mb-1">{getTrendIcon('hr')}</div>
                  </div>
                  {/* BP */}
                  <div className="flex justify-between items-end">
                     <div>
                        <div className="text-yellow-400 text-[9px] font-bold uppercase mb-0.5">NIBP</div>
                        <div className="text-xl font-mono font-bold text-yellow-400 leading-none">{initialVitals.bp}</div>
                     </div>
                     <div className="mb-1">{getTrendIcon('bp')}</div>
                  </div>
                  {/* SpO2 */}
                  <div className="flex justify-between items-end">
                     <div>
                        <div className="text-sky-400 text-[9px] font-bold uppercase mb-0.5">SpO2</div>
                        <div className="text-2xl font-mono font-bold text-sky-400 leading-none">{initialVitals.o2}%</div>
                     </div>
                     <div className="mb-1">{getTrendIcon('spo2')}</div>
                  </div>
                  {/* RR */}
                  <div className="flex justify-between items-end">
                     <div>
                        <div className="text-cyan-300 text-[9px] font-bold uppercase mb-0.5">RR</div>
                        <div className="text-xl font-mono font-bold text-cyan-300 leading-none">{initialVitals.rr}</div>
                     </div>
                     <div className="mb-1">{getTrendIcon('rr')}</div>
                  </div>
               </div>
            </div>
         </div>

      </div>

      {/* 5. Footer Status Chip */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
         <div className="w-full py-1.5 bg-white border border-emerald-200 rounded-lg shadow-sm flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Patient Stable</span>
         </div>
      </div>
    </div>
  );
};

export default PatientSidebar;