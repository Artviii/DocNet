import React, { useState } from 'react';
import { UserProfile } from '../types';
import { MOCK_USERS } from '../constants';
import { Trophy, Medal, User, FileText, Activity, Building2, ChevronDown, Smile, Info } from 'lucide-react';

interface LeaderboardViewProps {
  currentUser: UserProfile;
}

const LeaderboardView: React.FC<LeaderboardViewProps> = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState<'Global' | 'Hospital' | 'Class'>('Global');
  
  // Combine all users including current, removing duplicate ID from mocks if present
  const allUsers = [...MOCK_USERS.filter(u => u.id !== currentUser.id), currentUser].sort((a, b) => b.totalScore - a.totalScore);

  const getFilteredUsers = () => {
      if (activeTab === 'Hospital') {
          // Filter by institution (mock logic: match ID or random subset)
          return allUsers.filter(u => u.institutionId === 'inst-1' || u.id === currentUser.id || u.role === 'Nurse'); 
      }
      if (activeTab === 'Class') {
          return allUsers.filter((u, i) => i % 2 === 0); // Mock subset
      }
      return allUsers; // Global
  };

  const filteredUsers = getFilteredUsers();

  const getRankBadge = (rank: number) => {
    if (rank === 0) return <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-300 border border-yellow-400 flex items-center justify-center text-yellow-800 font-bold text-sm shadow-sm">1</div>;
    if (rank === 1) return <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-100 to-slate-300 border border-slate-400 flex items-center justify-center text-slate-800 font-bold text-sm shadow-sm">2</div>;
    if (rank === 2) return <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-100 to-orange-300 border border-orange-400 flex items-center justify-center text-orange-800 font-bold text-sm shadow-sm">3</div>;
    return <span className="text-slate-400 font-bold text-sm ml-2">#{rank + 1}</span>;
  };

  // Mock Specialties logic
  const getSpecialties = (role: string) => {
      if(role === 'Doctor') return ['Cardiology', 'Internal Med'];
      if(role === 'Nurse') return ['Triage', 'Emergency'];
      return ['Trauma', 'Field Med'];
  };

  return (
    <div className="bg-[#F8FAFC] h-full p-6 md:p-8 overflow-y-auto font-sans">
       <div className="max-w-[1120px] mx-auto">
          
          {/* --- PAGE HEADER --- */}
          <div className="flex justify-between items-end mb-6">
             <div>
                <h1 className="text-3xl font-bold text-[#0A2342]">Leaderboards</h1>
                <p className="text-[#64748B] text-sm mt-1">See who is most active in simulations and case solving.</p>
             </div>
             <button className="hidden md:flex items-center gap-2 text-xs font-bold text-[#64748B] bg-white border border-[#E2E8F0] px-3 py-2 rounded-lg hover:border-[#1CB5B2]">
                This week <ChevronDown className="w-3 h-3" />
             </button>
          </div>

          {/* --- TABS --- */}
          <div className="flex border-b border-[#E2E8F0] mb-8">
             {['Global', 'Hospital', 'Class'].map((tab) => (
                 <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`pb-3 px-6 text-sm font-medium transition-all relative ${activeTab === tab ? 'text-[#0A2342] font-bold' : 'text-[#64748B] hover:text-[#0A2342]'}`}
                 >
                    {tab === 'Global' ? 'Global' : tab === 'Hospital' ? 'My Hospital' : 'My Class / Program'}
                    {activeTab === tab && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#1CB5B2] rounded-t-full"></span>}
                 </button>
             ))}
          </div>

          {/* --- LEADERBOARD CARD --- */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_8px_24px_rgba(0,0,0,0.04)] overflow-hidden">
             
             {/* Optional Sub-header for context */}
             {activeTab !== 'Global' && (
                 <div className="px-6 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center gap-2 text-xs text-[#64748B]">
                     <Building2 className="w-3 h-3" />
                     {activeTab === 'Hospital' ? 'Leaderboard for: General Hospital' : 'Leaderboard for: Med School 2025 - Internal Medicine'}
                 </div>
             )}

             {/* Table Header */}
             <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0] text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                 <div className="col-span-1 text-center">Rank</div>
                 <div className="col-span-4">Name & Role</div>
                 <div className="col-span-2 text-center">Cases Solved</div>
                 <div className="col-span-3">Skill Index</div>
                 <div className="col-span-2 text-right">Main Specialties</div>
             </div>

             {/* Table Rows */}
             <div className="divide-y divide-slate-50">
                 {filteredUsers.map((user, idx) => {
                     const isMe = user.id === currentUser.id;
                     const specialties = getSpecialties(user.role);
                     
                     return (
                         <div 
                            key={user.id} 
                            className={`grid grid-cols-12 gap-4 px-6 py-4 items-center transition-colors hover:bg-[#EFF6FF] group ${isMe ? 'bg-[#F0F9FF]' : ''}`}
                         >
                             {/* Rank */}
                             <div className="col-span-1 flex justify-center">
                                 {getRankBadge(idx)}
                             </div>

                             {/* Name & Role */}
                             <div className="col-span-4 flex items-center gap-3">
                                 <img src={user.avatar} className="w-10 h-10 rounded-full border border-slate-100 object-cover" />
                                 <div className="min-w-0">
                                     <div className="flex items-center gap-2">
                                         <span className={`text-sm font-bold truncate ${isMe ? 'text-[#1CB5B2]' : 'text-[#0A2342]'}`}>{user.name}</span>
                                         {isMe && <span className="bg-[#1CB5B2] text-white text-[9px] px-1.5 rounded font-bold uppercase">You</span>}
                                     </div>
                                     <div className="text-xs text-[#64748B] truncate">{user.role} · General Hospital</div>
                                 </div>
                             </div>

                             {/* Cases Solved */}
                             <div className="col-span-2 text-center">
                                 <div className="inline-flex flex-col items-center">
                                     <span className="text-sm font-bold text-[#0A2342]">{user.casesCompleted}</span>
                                     <span className="text-[9px] text-[#94A3B8] font-bold uppercase">Cases</span>
                                 </div>
                             </div>

                             {/* Skill Index */}
                             <div className="col-span-3">
                                 <div className="flex justify-between text-xs mb-1">
                                     <span className="font-bold text-[#64748B]">Score</span>
                                     <span className="font-bold text-[#0A2342]">{user.totalScore.toLocaleString()}</span>
                                 </div>
                                 <div className="w-full h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                                     <div 
                                        className="h-full bg-[#1CB5B2] rounded-full" 
                                        style={{ width: `${Math.min(100, (user.totalScore / 20000) * 100)}%` }}
                                     ></div>
                                 </div>
                             </div>

                             {/* Specialties */}
                             <div className="col-span-2 flex justify-end gap-1 flex-wrap">
                                 {specialties.map(s => (
                                     <span key={s} className="px-2 py-1 bg-[#F1F5F9] text-[#475569] rounded text-[10px] font-bold whitespace-nowrap">
                                         {s}
                                     </span>
                                 ))}
                             </div>
                         </div>
                     );
                 })}
             </div>
          </div>

          {/* --- FRIENDLY FOOTER --- */}
          <div className="mt-8 text-center max-w-lg mx-auto">
              <p className="text-sm text-[#64748B] flex items-center justify-center gap-2 mb-2">
                  <Smile className="w-4 h-4 text-[#1CB5B2]" />
                  Leaderboards are for learning motivation only.
              </p>
              <p className="text-xs text-[#94A3B8]">
                  They do not replace formal evaluations from your educators or supervisors. Focus on your own growth!
              </p>
          </div>

       </div>
    </div>
  );
};

export default LeaderboardView;