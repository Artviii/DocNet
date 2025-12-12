import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Briefcase, MapPin, CheckCircle, Lock, TrendingUp, ChevronDown, ChevronUp, Search, Filter, Stethoscope, Building2, Bookmark, Share2, Play, AlertTriangle } from 'lucide-react';

interface JobsViewProps {
  currentUser: UserProfile;
  onPlayScenario: (caseId: string) => void;
}

interface Job {
  id: string;
  title: string;
  roleType: string;
  institution: string;
  location: string;
  salary: string;
  postedDate: string;
  applicantsCount: number;
  description: string;
  requirements: string[];
  preferred: string[];
  skillsMatch: { category: string; percent: number }[];
  recommendedSims: { id: string; title: string; category: string }[];
  badges: string[];
  matchScore: number; // 0-100
}

const MOCK_JOBS: Job[] = [
  { 
    id: '1', 
    title: 'ER Resident', 
    roleType: 'Resident',
    institution: 'General Hospital', 
    location: 'New York, NY', 
    salary: '$65k - $75k', 
    postedDate: '3 days ago',
    applicantsCount: 23,
    description: 'Join our high-paced Level 1 Trauma Center. You will be responsible for initial triage, stabilization of trauma patients, and managing acute medical emergencies. Requires strong skills in ATLS protocols and rapid decision making.',
    requirements: ['1-3 years EM experience or equivalent training', 'Comfort managing chest pain, dyspnea, and trauma', 'Eligible for NY license'],
    preferred: ['Experience with simulation-based training', 'Strong communication and teamwork'],
    skillsMatch: [
        { category: 'Emergency Medicine', percent: 90 },
        { category: 'Cardiology', percent: 80 },
        { category: 'Trauma', percent: 65 }
    ],
    recommendedSims: [
        { id: 'trauma-001', title: 'Unstable Pelvis Trauma', category: 'Trauma' },
        { id: 'cardio-001', title: 'Acute Chest Pain', category: 'Cardiology' }
    ],
    badges: ['Night shifts', 'Level 1 Trauma'],
    matchScore: 85
  },
  { 
    id: '2', 
    title: 'Cardiology Fellow', 
    roleType: 'Fellow',
    institution: 'Heart Institute', 
    location: 'Boston, MA', 
    salary: '$80k - $90k', 
    postedDate: '1 week ago',
    applicantsCount: 15,
    description: 'Advanced fellowship program focusing on interventional cardiology. You will manage complex STEMI cases, heart failure exacerbations, and arrhythmias. Research opportunities available.',
    requirements: ['Internal Medicine Residency completed', 'Strong research background'],
    preferred: ['Advanced ECG interpretation skills', 'Simulation portfolio in Cardiology'],
    skillsMatch: [
        { category: 'Cardiology', percent: 45 },
        { category: 'ECG Interpretation', percent: 60 }
    ],
    recommendedSims: [
        { id: 'cardio-003', title: 'Syncope at Gym', category: 'Cardiology' },
        { id: 'cardio-002', title: 'CHF Exacerbation', category: 'Cardiology' }
    ],
    badges: ['Research track', 'Interventional'],
    matchScore: 52 
  },
  { 
    id: '3', 
    title: 'Triage Nurse', 
    roleType: 'Nurse',
    institution: 'City Care', 
    location: 'Chicago, IL', 
    salary: '$90k', 
    postedDate: '2 days ago',
    applicantsCount: 40,
    description: 'Front-line role determining acuity of incoming patients. Must have excellent pattern recognition for respiratory distress and sepsis. 12-hour shifts, night differential available.',
    requirements: ['BSN required', '2+ years ED experience'],
    preferred: ['Triage certification', 'Bilingual'],
    skillsMatch: [
        { category: 'Triage', percent: 95 },
        { category: 'Respiratory', percent: 88 }
    ],
    recommendedSims: [
        { id: 'resp-003', title: 'Anaphylaxis', category: 'Respiratory' }
    ],
    badges: ['12h Shifts', 'Urgent Care'],
    matchScore: 92
  },
];

const JobsView: React.FC<JobsViewProps> = ({ currentUser, onPlayScenario }) => {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [matchMode, setMatchMode] = useState<'skills' | 'all'>('skills');
  const [filters, setFilters] = useState({ location: 'Any', specialty: 'All', role: 'All' });

  const selectedJob = MOCK_JOBS.find(j => j.id === selectedJobId);

  // Simple filter logic (mocked)
  const filteredJobs = MOCK_JOBS.filter(job => {
      if (matchMode === 'skills' && job.matchScore < 60) return false;
      return true;
  });

  return (
    <div className="h-full flex flex-col bg-[#F8FAFC] font-sans overflow-hidden">
      
      {/* --- HEADER --- */}
      <div className="bg-[#F8FAFC] border-b border-[#E2E8F0] px-6 py-6 shrink-0 z-20">
         <div className="max-w-[1120px] mx-auto w-full">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-[#0A2342]">Jobs</h1>
                    <p className="text-[#64748B] text-sm mt-1">Jobs that match your clinical skills and simulation performance.</p>
                </div>
                <div className="hidden md:block text-xs font-bold text-[#64748B] uppercase tracking-widest">
                    Career Hub
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                    {/* Location */}
                    <div className="relative group">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <select 
                            className="pl-9 pr-8 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm font-medium text-[#0A2342] hover:border-[#1CB5B2] focus:ring-1 focus:ring-[#1CB5B2] appearance-none cursor-pointer outline-none shadow-sm transition-all"
                            value={filters.location}
                            onChange={(e) => setFilters({...filters, location: e.target.value})}
                        >
                            <option>Location: Any</option>
                            <option>New York, NY</option>
                            <option>Remote</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                    </div>

                    {/* Specialty */}
                    <div className="relative group">
                        <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <select 
                            className="pl-9 pr-8 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm font-medium text-[#0A2342] hover:border-[#1CB5B2] focus:ring-1 focus:ring-[#1CB5B2] appearance-none cursor-pointer outline-none shadow-sm transition-all"
                            value={filters.specialty}
                            onChange={(e) => setFilters({...filters, specialty: e.target.value})}
                        >
                            <option>Specialty: All</option>
                            <option>Emergency Medicine</option>
                            <option>Cardiology</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                    </div>

                    {/* Role Level */}
                    <div className="relative group">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <select 
                            className="pl-9 pr-8 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm font-medium text-[#0A2342] hover:border-[#1CB5B2] focus:ring-1 focus:ring-[#1CB5B2] appearance-none cursor-pointer outline-none shadow-sm transition-all"
                            value={filters.role}
                            onChange={(e) => setFilters({...filters, role: e.target.value})}
                        >
                            <option>Role: All</option>
                            <option>Resident</option>
                            <option>Fellow</option>
                            <option>Attending</option>
                            <option>Nurse</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                    </div>
                </div>

                {/* Match Mode Toggle */}
                <div className="bg-white p-1 rounded-lg border border-[#E2E8F0] flex shadow-sm shrink-0">
                    <button 
                        onClick={() => setMatchMode('skills')}
                        className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${matchMode === 'skills' ? 'bg-[#1CB5B2] text-white shadow-sm' : 'text-[#64748B] hover:text-[#0A2342]'}`}
                    >
                        Match my skills
                    </button>
                    <button 
                        onClick={() => setMatchMode('all')}
                        className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${matchMode === 'all' ? 'bg-[#1CB5B2] text-white shadow-sm' : 'text-[#64748B] hover:text-[#0A2342]'}`}
                    >
                        All jobs
                    </button>
                </div>
            </div>
         </div>
      </div>

      {/* --- MAIN CONTENT COLUMNS --- */}
      <div className="flex-1 overflow-hidden relative">
         <div className="h-full overflow-y-auto px-6 py-6">
            <div className="max-w-[1120px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
               
               {/* --- LEFT COLUMN: JOB LIST (~60%) --- */}
               <div className="lg:col-span-7 space-y-4 pb-20">
                  {filteredJobs.map(job => {
                      const isSelected = selectedJobId === job.id;
                      const isHighMatch = job.matchScore >= 70;
                      
                      return (
                          <div 
                             key={job.id}
                             onClick={() => setSelectedJobId(job.id)}
                             className={`group bg-white rounded-xl border p-5 cursor-pointer transition-all hover:shadow-md relative overflow-hidden ${isSelected ? 'border-[#1CB5B2] ring-1 ring-[#1CB5B2] shadow-md' : 'border-[#E2E8F0]'}`}
                          >
                             {/* Selection Indicator Bar */}
                             {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#1CB5B2]"></div>}

                             <div className="flex flex-col sm:flex-row gap-4">
                                 {/* Job Info Area */}
                                 <div className="flex-1">
                                     <div className="flex items-start justify-between mb-1">
                                         <div className="flex items-center gap-2">
                                             <h3 className="font-bold text-[#0A2342] text-lg">{job.title}</h3>
                                             <span className="px-2 py-0.5 bg-[#E0F7F6] text-[#1CB5B2] text-[10px] font-bold uppercase rounded">{job.roleType}</span>
                                         </div>
                                     </div>
                                     
                                     <div className="flex items-center gap-2 text-sm text-[#64748B] mb-2">
                                         <Building2 className="w-3 h-3" />
                                         <span>{job.institution}</span>
                                         <span>•</span>
                                         <span>{job.location}</span>
                                     </div>

                                     <div className="text-xs text-[#64748B] mb-4">
                                         {job.salary} • Full time
                                     </div>

                                     {/* Skills Match Bar */}
                                     <div>
                                         <div className="flex justify-between items-end mb-1">
                                             <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wide">
                                                 {isHighMatch ? 'Skills Match' : 'Eligibility'}
                                             </span>
                                             <span className={`text-xs font-bold ${isHighMatch ? 'text-[#0A2342]' : 'text-amber-600'}`}>
                                                 {job.matchScore}%
                                             </span>
                                         </div>
                                         <div className="w-full h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                                             <div 
                                                className={`h-full rounded-full transition-all duration-500 ${isHighMatch ? 'bg-[#1CB5B2]' : 'bg-amber-400'}`} 
                                                style={{ width: `${job.matchScore}%` }}
                                             ></div>
                                         </div>
                                         {!isHighMatch && (
                                             <div className="flex items-center gap-1 mt-1 text-[10px] text-amber-600 font-medium">
                                                 <AlertTriangle className="w-3 h-3" /> Strengthen skills for better match
                                             </div>
                                         )}
                                     </div>
                                 </div>

                                 {/* Action Area */}
                                 <div className="sm:text-right flex flex-row sm:flex-col justify-between sm:items-end min-w-[120px]">
                                     <span className="text-[10px] text-[#94A3B8] font-medium block mb-2 sm:mb-0">Posted {job.postedDate}</span>
                                     <div className="flex sm:flex-col gap-2">
                                         <button 
                                            className={`text-xs font-bold px-4 py-2 rounded-lg transition-all ${isSelected ? 'bg-[#1CB5B2] text-white shadow-sm' : 'text-[#1CB5B2] hover:bg-[#E0F7F6]'}`}
                                         >
                                             {isSelected ? 'Apply Now' : 'View Details'}
                                         </button>
                                     </div>
                                 </div>
                             </div>
                          </div>
                      );
                  })}
               </div>

               {/* --- RIGHT COLUMN: JOB DETAIL PANEL (~40%) --- */}
               <div className="hidden lg:block lg:col-span-5 relative">
                  <div className="sticky top-0 h-full max-h-[calc(100vh-200px)] overflow-y-auto pr-2 pb-20 scrollbar-hide">
                      {selectedJob ? (
                          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-lg overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
                              
                              {/* Header */}
                              <div className="p-6 border-b border-[#F1F5F9]">
                                  <div className="flex justify-between items-start mb-4">
                                      <div>
                                          <h2 className="text-2xl font-bold text-[#0A2342] mb-1">{selectedJob.title}</h2>
                                          <p className="text-[#64748B] text-sm">{selectedJob.institution} • {selectedJob.location}</p>
                                      </div>
                                      <div className="flex gap-2">
                                          <button className="p-2 text-[#94A3B8] hover:text-[#1CB5B2] hover:bg-[#F8FAFC] rounded-full transition-colors"><Bookmark className="w-5 h-5" /></button>
                                          <button className="p-2 text-[#94A3B8] hover:text-[#1CB5B2] hover:bg-[#F8FAFC] rounded-full transition-colors"><Share2 className="w-5 h-5" /></button>
                                      </div>
                                  </div>
                                  
                                  <div className="flex flex-wrap gap-2 mb-2">
                                      {selectedJob.badges.map(b => (
                                          <span key={b} className="px-2 py-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded text-[10px] font-bold text-[#64748B] uppercase tracking-wide">{b}</span>
                                      ))}
                                  </div>
                                  <p className="text-[10px] text-[#94A3B8]">23 applicants so far</p>
                              </div>

                              {/* Skills Match Box */}
                              <div className="bg-[#E0F7F6] p-5 border-b border-[#F1F5F9]">
                                  <h3 className="text-sm font-bold text-[#0A2342] mb-1 flex items-center gap-2">
                                      <TrendingUp className="w-4 h-4 text-[#1CB5B2]" /> How you match this role
                                  </h3>
                                  <p className="text-xs text-[#58817F] mb-4">Based on your simulations and case history.</p>
                                  
                                  <div className="space-y-3">
                                      {selectedJob.skillsMatch.map((skill, i) => (
                                          <div key={i}>
                                              <div className="flex justify-between text-xs font-bold text-[#0A2342] mb-1">
                                                  <span>{skill.category} exposure</span>
                                                  <span>{skill.percent}%</span>
                                              </div>
                                              <div className="w-full h-1.5 bg-white/60 rounded-full overflow-hidden">
                                                  <div className="h-full bg-[#1CB5B2] rounded-full" style={{ width: `${skill.percent}%` }}></div>
                                              </div>
                                          </div>
                                      ))}
                                  </div>
                              </div>

                              {/* Description & Content */}
                              <div className="p-6 space-y-6">
                                  
                                  <div>
                                      <h4 className="text-sm font-bold text-[#0A2342] mb-2 uppercase tracking-wide">Role Description</h4>
                                      <p className="text-sm text-[#334155] leading-relaxed">
                                          {selectedJob.description}
                                      </p>
                                  </div>

                                  <div>
                                      <h4 className="text-sm font-bold text-[#0A2342] mb-2 uppercase tracking-wide">Requirements</h4>
                                      <ul className="list-disc list-inside text-sm text-[#334155] space-y-1">
                                          {selectedJob.requirements.map((r, i) => <li key={i}>{r}</li>)}
                                      </ul>
                                  </div>

                                  {/* Recommended Practice */}
                                  <div className="bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-4">
                                      <h4 className="text-sm font-bold text-[#0A2342] mb-1">Recommended practice</h4>
                                      <p className="text-xs text-[#64748B] mb-3">Simulations to warm up for this specific role.</p>
                                      
                                      <div className="space-y-2">
                                          {selectedJob.recommendedSims.map(sim => (
                                              <div key={sim.id} className="flex justify-between items-center bg-white p-3 rounded-lg border border-[#E2E8F0] shadow-sm">
                                                  <div>
                                                      <div className="font-bold text-[#0A2342] text-xs">{sim.title}</div>
                                                      <div className="text-[10px] text-[#64748B]">{sim.category}</div>
                                                  </div>
                                                  <button 
                                                      onClick={() => onPlayScenario(sim.id)}
                                                      className="p-1.5 text-[#1CB5B2] hover:bg-[#E0F7F6] rounded-md transition-colors"
                                                      title="Start Simulation"
                                                  >
                                                      <Play className="w-4 h-4 fill-current" />
                                                  </button>
                                              </div>
                                          ))}
                                      </div>
                                      <button 
                                          onClick={() => onPlayScenario(selectedJob.recommendedSims[0]?.id)}
                                          className="w-full mt-3 bg-white border border-[#1CB5B2] text-[#1CB5B2] text-xs font-bold py-2 rounded-lg hover:bg-[#E0F7F6] transition-colors"
                                      >
                                          Start Recommended Practice Pack
                                      </button>
                                  </div>

                                  {/* Application Actions */}
                                  <div className="pt-2">
                                      <button 
                                          onClick={() => alert("Application Submitted!")}
                                          className="w-full bg-[#1CB5B2] text-white font-bold py-3 rounded-xl shadow-lg shadow-teal-500/20 hover:brightness-105 hover:-translate-y-0.5 transition-all mb-3"
                                      >
                                          Apply with Profile
                                      </button>
                                      <button className="w-full bg-white border border-[#E2E8F0] text-[#64748B] font-bold py-3 rounded-xl hover:bg-[#F8FAFC] transition-all text-sm">
                                          Apply with CV only
                                      </button>
                                      <p className="text-[10px] text-[#94A3B8] text-center mt-3 flex items-center justify-center gap-1">
                                          <CheckCircle className="w-3 h-3" /> Simulation results are used as an extra signal, not for automatic rejection.
                                      </p>
                                  </div>

                              </div>
                          </div>
                      ) : (
                          <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-[#E2E8F0] rounded-xl text-[#94A3B8]">
                              <Briefcase className="w-12 h-12 mb-3 opacity-20" />
                              <p className="font-bold text-lg">Select a job to view details</p>
                              <p className="text-xs mt-1">Browse the list on the left.</p>
                          </div>
                      )}
                  </div>
               </div>

            </div>
         </div>
      </div>
    </div>
  );
};

export default JobsView;