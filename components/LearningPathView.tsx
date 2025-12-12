import React, { useState } from 'react';
import { ClinicalCase, Difficulty } from '../types';
import { Trophy, Target, TrendingUp, BookOpen, CheckCircle, Lock, Building2, ChevronDown, Clock, Play, Check, ArrowRight } from 'lucide-react';

interface LearningPathViewProps {
  cases: ClinicalCase[];
  completedCases: Record<string, number>; // Map of caseId -> score
  onSelectCase: (scenario: ClinicalCase) => void;
}

const TRACKS = [
  { id: 't1', name: 'Medical Student – Level 1', owner: 'University Hospital – Med School 2025', description: 'Focuses on basic history taking, red flags, and communication for early medical students.', level: 1, requiredCount: 5 },
  { id: 't2', name: 'EM Internship Prep', owner: 'General Hospital', description: 'High-acuity cases focusing on triage, rapid assessment, and stabilization.', level: 2, requiredCount: 8 },
];

const LearningPathView: React.FC<LearningPathViewProps> = ({ cases, completedCases, onSelectCase }) => {
  const [selectedTrackId, setSelectedTrackId] = useState('t1');
  const [isTrackDropdownOpen, setIsTrackDropdownOpen] = useState(false);

  const currentTrack = TRACKS.find(t => t.id === selectedTrackId) || TRACKS[0];

  // --- ANALYTICS ---
  const completedCount = Object.keys(completedCases).length;
  const scores = Object.values(completedCases) as number[];
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  
  // Fake metrics for the "Performance Overview" based on real progress
  const accuracyMetric = Math.min(100, Math.round(avgScore * 0.95));
  const efficiencyMetric = Math.min(100, Math.round(avgScore * 1.05)); // Mock
  const coverageMetric = Math.min(100, Math.round((completedCount / currentTrack.requiredCount) * 100));

  // --- CONTENT FILTERING ---
  // Simple logic: Track 1 = Novice/Intermediate, Track 2 = Intermediate/Advanced
  const trackCases = cases.filter(c => {
      if (selectedTrackId === 't1') return c.difficulty === Difficulty.Novice || (c.difficulty === Difficulty.Intermediate && c.category === 'Cardiology');
      return c.difficulty !== Difficulty.Novice;
  });

  const foundations = trackCases.filter(c => c.difficulty === Difficulty.Novice);
  const coreRotations = trackCases.filter(c => c.difficulty !== Difficulty.Novice);

  const renderModuleCard = (c: ClinicalCase, isLocked: boolean, index: number) => {
    const score = completedCases[c.id];
    const isCompleted = score !== undefined;
    const isAssigned = index % 2 === 0; // Mock assignment

    return (
        <div 
            key={c.id}
            className={`relative p-4 rounded-xl border transition-all ${
                isLocked 
                ? 'bg-slate-50 border-slate-200 opacity-70' 
                : 'bg-white border-slate-200 hover:shadow-md hover:border-[#1CB5B2] cursor-pointer'
            }`}
            onClick={() => !isLocked && onSelectCase(c)}
        >
            <div className="flex justify-between items-start mb-2">
                <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center gap-2 mb-1">
                        {isLocked && <Lock className="w-3 h-3 text-slate-400" />}
                        <h4 className={`text-sm font-bold truncate ${isLocked ? 'text-slate-500' : 'text-[#0A2342]'}`}>
                            {c.patientName} - {c.chiefComplaint}
                        </h4>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
                        <span>{c.category}</span>
                        <span>·</span>
                        <span className={isAssigned ? 'text-[#1CB5B2] font-medium' : ''}>
                            {isAssigned ? 'Assigned by Org' : 'Recommended'}
                        </span>
                    </div>
                </div>
                
                {/* Status / Action */}
                <div className="shrink-0">
                    {isCompleted ? (
                        <div className="flex items-center gap-1 text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">
                            <Check className="w-3 h-3" /> Done
                        </div>
                    ) : isLocked ? (
                        <div className="text-[10px] font-bold text-slate-400 border border-slate-200 px-2 py-1 rounded">
                            Locked
                        </div>
                    ) : (
                        <button className="text-xs font-bold bg-white border border-[#1CB5B2] text-[#1CB5B2] px-3 py-1 rounded hover:bg-[#1CB5B2] hover:text-white transition-colors">
                            Start
                        </button>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    {isAssigned && <Clock className="w-3 h-3" />}
                    {isAssigned ? 'Due: Dec 24' : 'Optional'}
                </div>
                {isCompleted && (
                    <span className="text-[10px] font-bold text-emerald-600">Score: {score}</span>
                )}
            </div>
        </div>
    );
  };

  return (
    <div className="h-full bg-[#F8FAFC] p-6 md:p-8 overflow-y-auto font-sans">
        <div className="max-w-[1120px] mx-auto space-y-8">
            
            {/* --- PAGE HEADER --- */}
            <div>
                <h1 className="text-3xl font-bold text-[#0A2342]">Curriculum</h1>
                <p className="text-[#64748B] text-sm mt-1">Structured learning tracks built from your cases and simulations.</p>
            </div>

            {/* --- TOP TRACK CARD --- */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_8px_24px_rgba(0,0,0,0.04)] p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-8">
                    
                    {/* Left: Info & Progress */}
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-[#E0F7F6] text-[#1CB5B2] text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Track</span>
                            <h2 className="text-lg font-bold text-[#0A2342]">{currentTrack.name}</h2>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs text-[#64748B] mb-6">
                            <Building2 className="w-3 h-3 text-[#1CB5B2]" />
                            <span>Track owner: {currentTrack.owner}</span>
                        </div>

                        <div className="mb-2 flex justify-between items-end text-xs font-bold">
                            <span className="text-[#64748B]">Progress to next rank</span>
                            <span className="text-[#0A2342]">{Math.min(completedCount, currentTrack.requiredCount)} of {currentTrack.requiredCount} completed</span>
                        </div>
                        <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden mb-2">
                            <div 
                                className="bg-[#1CB5B2] h-full rounded-full transition-all duration-1000" 
                                style={{ width: `${(Math.min(completedCount, currentTrack.requiredCount) / currentTrack.requiredCount) * 100}%` }}
                            ></div>
                        </div>
                        <p className="text-xs text-[#94A3B8]">Complete {currentTrack.requiredCount} core cases to unlock Level {currentTrack.level + 1}.</p>
                        
                        <p className="text-sm text-[#64748B] mt-6 leading-relaxed max-w-xl">
                            {currentTrack.description}
                        </p>
                    </div>

                    {/* Right: Switcher */}
                    <div className="md:text-right flex flex-col md:items-end">
                        <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-2 block">Switch track</label>
                        <div className="relative inline-block w-full md:w-64">
                            <button 
                                onClick={() => setIsTrackDropdownOpen(!isTrackDropdownOpen)}
                                className="w-full flex items-center justify-between bg-white border border-[#1CB5B2] text-[#1CB5B2] px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-[#E0F7F6] transition-all"
                            >
                                <span className="truncate">{currentTrack.name}</span>
                                <ChevronDown className="w-4 h-4 ml-2" />
                            </button>
                            
                            {isTrackDropdownOpen && (
                                <div className="absolute top-full right-0 mt-2 w-full bg-white border border-[#E2E8F0] rounded-xl shadow-xl z-20 overflow-hidden">
                                    {TRACKS.map(t => (
                                        <button
                                            key={t.id}
                                            onClick={() => { setSelectedTrackId(t.id); setIsTrackDropdownOpen(false); }}
                                            className="w-full text-left px-4 py-3 text-sm hover:bg-[#F8FAFC] text-[#0A2342] border-b border-[#F1F5F9] last:border-0"
                                        >
                                            <div className="font-bold">{t.name}</div>
                                            <div className="text-xs text-[#64748B] truncate">{t.owner}</div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button className="text-xs font-bold text-[#1CB5B2] mt-3 hover:underline">View all tracks →</button>
                    </div>
                </div>
            </div>

            {/* --- PERFORMANCE OVERVIEW --- */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                <h3 className="font-bold text-[#0A2342] mb-6">Performance in this track</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    {/* Metric 1 */}
                    <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="32" cy="32" r="28" stroke="#E2E8F0" strokeWidth="4" fill="transparent" />
                                <circle cx="32" cy="32" r="28" stroke="#1CB5B2" strokeWidth="4" fill="transparent" strokeDasharray={175} strokeDashoffset={175 - (accuracyMetric/100)*175} strokeLinecap="round" />
                            </svg>
                            <span className="absolute text-sm font-bold text-[#0A2342]">{accuracyMetric}%</span>
                        </div>
                        <div>
                            <div className="font-bold text-[#0A2342] text-sm">Clinical Accuracy</div>
                            <div className="text-xs text-[#64748B]">Based on diagnosis correctness</div>
                        </div>
                    </div>

                    {/* Metric 2 */}
                    <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="32" cy="32" r="28" stroke="#E2E8F0" strokeWidth="4" fill="transparent" />
                                <circle cx="32" cy="32" r="28" stroke="#6366F1" strokeWidth="4" fill="transparent" strokeDasharray={175} strokeDashoffset={175 - (efficiencyMetric/100)*175} strokeLinecap="round" />
                            </svg>
                            <span className="absolute text-sm font-bold text-[#0A2342]">{efficiencyMetric}%</span>
                        </div>
                        <div>
                            <div className="font-bold text-[#0A2342] text-sm">Diagnostic Efficiency</div>
                            <div className="text-xs text-[#64748B]">Cost & ordering logic</div>
                        </div>
                    </div>

                    {/* Metric 3 */}
                    <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="32" cy="32" r="28" stroke="#E2E8F0" strokeWidth="4" fill="transparent" />
                                <circle cx="32" cy="32" r="28" stroke="#F43F5E" strokeWidth="4" fill="transparent" strokeDasharray={175} strokeDashoffset={175 - (coverageMetric/100)*175} strokeLinecap="round" />
                            </svg>
                            <span className="absolute text-sm font-bold text-[#0A2342]">{coverageMetric}%</span>
                        </div>
                        <div>
                            <div className="font-bold text-[#0A2342] text-sm">Curriculum Coverage</div>
                            <div className="text-xs text-[#64748B]">Cases completed vs total</div>
                        </div>
                    </div>

                </div>
            </div>

            {/* --- TRACK CONTENT --- */}
            <div>
                <div className="mb-6">
                    <h3 className="font-bold text-[#0A2342] text-lg">Track Content</h3>
                    <p className="text-[#64748B] text-xs">Assigned by your institution and recommended by RoundsNet.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Column 1: Foundations */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-[#0A2342] mb-2 flex items-center gap-2">
                            <span className="bg-[#E0F7F6] text-[#1CB5B2] w-6 h-6 rounded flex items-center justify-center text-xs">1</span>
                            Foundations (Novice)
                        </h4>
                        {foundations.map((c, i) => renderModuleCard(c, false, i))}
                    </div>

                    {/* Column 2: Core Rotations */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-[#0A2342] mb-2 flex items-center gap-2">
                            <span className="bg-indigo-50 text-indigo-600 w-6 h-6 rounded flex items-center justify-center text-xs">2</span>
                            Core Rotations (Intermediate)
                        </h4>
                        {coreRotations.map((c, i) => {
                            // Simple lock logic: Lock if less than 2 foundations are done
                            const foundationsDone = foundations.filter(f => completedCases[f.id]).length;
                            const isLocked = foundationsDone < 2;
                            return renderModuleCard(c, isLocked, i);
                        })}
                    </div>

                </div>
            </div>

        </div>
    </div>
  );
};

export default LearningPathView;