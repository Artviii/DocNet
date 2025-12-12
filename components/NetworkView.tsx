import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Users, UserPlus, MessageCircle, Building2, Check, Search, MoreHorizontal, FileText, ArrowRight, Plus } from 'lucide-react';
import { MOCK_USERS, MOCK_COMMUNITIES } from '../constants';

interface NetworkViewProps {
  currentUser: UserProfile;
  onNavigateCommunity: (id: string | null) => void;
}

const NetworkView: React.FC<NetworkViewProps> = ({ currentUser, onNavigateCommunity }) => {
  const [activeTab, setActiveTab] = useState<'people' | 'communities'>('people');
  const [connectedUsers, setConnectedUsers] = useState<string[]>([]);
  const [joinedCommunities, setJoinedCommunities] = useState<string[]>(['comm-1', 'comm-2']);
  const [searchQuery, setSearchQuery] = useState('');

  const handleConnect = (userId: string) => {
      if (connectedUsers.includes(userId)) return;
      setConnectedUsers([...connectedUsers, userId]);
  };

  const handleJoinCommunity = (id: string) => {
      setJoinedCommunities([...joinedCommunities, id]);
  };

  const isCommunityJoined = (id: string) => joinedCommunities.includes(id);

  return (
    <div className="h-full bg-[#F8FAFC] p-6 md:p-8 overflow-y-auto font-sans">
      <div className="max-w-[1120px] mx-auto">
        
        {/* --- 1. PAGE HEADER & TABS --- */}
        <div className="mb-8">
           <div className="flex justify-between items-end mb-6">
              <div>
                 <h1 className="text-3xl font-bold text-[#0A2342]">My Network</h1>
                 <p className="text-[#64748B] text-sm mt-1">Manage your connections and communities.</p>
              </div>
              <button className="hidden md:flex items-center gap-1 text-[#1CB5B2] text-sm font-bold hover:underline">
                 Invite colleagues <ArrowRight className="w-4 h-4" />
              </button>
           </div>

           {/* Tab Bar */}
           <div className="flex border-b border-[#E2E8F0]">
              <button 
                 onClick={() => setActiveTab('people')}
                 className={`pb-3 pr-6 text-sm font-medium transition-all relative ${activeTab === 'people' ? 'text-[#0A2342] font-bold' : 'text-[#64748B] hover:text-[#0A2342]'}`}
              >
                 People
                 {activeTab === 'people' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#1CB5B2] rounded-t-full"></span>}
              </button>
              <button 
                 onClick={() => setActiveTab('communities')}
                 className={`pb-3 px-6 text-sm font-medium transition-all relative ${activeTab === 'communities' ? 'text-[#0A2342] font-bold' : 'text-[#64748B] hover:text-[#0A2342]'}`}
              >
                 Communities & Orgs
                 {activeTab === 'communities' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#1CB5B2] rounded-t-full"></span>}
              </button>
           </div>
        </div>

        {/* --- 2. MAIN CONTENT GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           
           {/* --- LEFT COLUMN (Profile & Inst) - Always Visible --- */}
           <div className="lg:col-span-4 space-y-6">
              
              {/* Profile Summary Card */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-5">
                 <div className="flex items-center gap-4 mb-6">
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-16 h-16 rounded-full border border-slate-100 shadow-sm" />
                    <div>
                       <h3 className="text-[#0A2342] font-bold text-lg leading-tight">{currentUser.name}</h3>
                       <p className="text-[#64748B] text-xs mt-1">{currentUser.role}</p>
                    </div>
                 </div>
                 
                 <div className="flex justify-between items-center mb-6 px-2">
                    <div className="text-center">
                       <div className="text-[#1CB5B2] flex justify-center mb-1"><Users className="w-4 h-4" /></div>
                       <div className="text-[#0A2342] font-bold text-sm">45</div>
                       <div className="text-[#64748B] text-[10px] uppercase font-bold">Connections</div>
                    </div>
                    <div className="w-px h-8 bg-slate-100"></div>
                    <div className="text-center">
                       <div className="text-[#1CB5B2] flex justify-center mb-1"><Building2 className="w-4 h-4" /></div>
                       <div className="text-[#0A2342] font-bold text-sm">{joinedCommunities.length}</div>
                       <div className="text-[#64748B] text-[10px] uppercase font-bold">Communities</div>
                    </div>
                    <div className="w-px h-8 bg-slate-100"></div>
                    <div className="text-center">
                       <div className="text-[#1CB5B2] flex justify-center mb-1"><FileText className="w-4 h-4" /></div>
                       <div className="text-[#0A2342] font-bold text-sm">{currentUser.casesCompleted}</div>
                       <div className="text-[#64748B] text-[10px] uppercase font-bold">Cases</div>
                    </div>
                 </div>

                 <button className="w-full bg-[#1CB5B2] text-white font-bold py-2.5 rounded-lg hover:bg-[#17a3a0] transition-colors text-sm shadow-sm">
                    View full profile
                 </button>
              </div>

              {/* My Institution Card */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-5">
                 <div className="flex items-center gap-2 mb-3">
                    <Building2 className="w-4 h-4 text-[#1CB5B2]" />
                    <span className="text-[#0A2342] font-medium text-sm">My Institution</span>
                 </div>
                 <div className="mb-4">
                    <h4 className="font-bold text-[#0A2342]">General Hospital</h4>
                    <p className="text-[#64748B] text-xs">1.2k members · Teaching hospital</p>
                 </div>
                 <button 
                    onClick={() => onNavigateCommunity('comm-1')}
                    className="w-full bg-white border border-[#1CB5B2] text-[#1CB5B2] font-bold py-2 rounded-lg hover:bg-[#1CB5B2] hover:text-white transition-colors text-sm"
                 >
                    View org page
                 </button>
              </div>

           </div>

           {/* --- RIGHT COLUMN (Contextual) --- */}
           <div className="lg:col-span-8">
              
              {/* --- TAB CONTENT: PEOPLE --- */}
              {activeTab === 'people' && (
                 <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    
                    {/* Search Bar */}
                    <div className="relative group">
                       <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B] w-5 h-5 group-focus-within:text-[#1CB5B2] transition-colors" />
                       <input 
                          type="text" 
                          placeholder="Search clinicians, students, or recruiters" 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-white border border-[#E2E8F0] rounded-xl pl-12 pr-4 py-3 text-sm outline-none focus:border-[#1CB5B2] focus:ring-1 focus:ring-[#1CB5B2] transition-all shadow-sm text-[#0A2342]" 
                       />
                    </div>

                    {/* Recommended Connections */}
                    <div>
                       <div className="flex justify-between items-center mb-4">
                          <h2 className="text-[#0A2342] font-medium text-lg">Recommended connections</h2>
                          <button className="text-[#1CB5B2] text-sm font-bold hover:underline">See all</button>
                       </div>

                       <div className="space-y-3">
                          {MOCK_USERS.filter(u => u.id !== currentUser.id).map(user => {
                             const isConnected = connectedUsers.includes(user.id);
                             return (
                                <div key={user.id} className="bg-white border border-[#E2E8F0] rounded-xl p-4 flex flex-col sm:flex-row items-center sm:items-start gap-4 hover:bg-[#F8FAFC] transition-colors shadow-sm group">
                                   <img src={user.avatar} className="w-12 h-12 rounded-full border border-slate-100" alt={user.name} />
                                   
                                   <div className="flex-1 text-center sm:text-left">
                                      <h3 className="text-[#0A2342] font-bold text-base">{user.name}</h3>
                                      <p className="text-[#64748B] text-xs mb-2">{user.role} · General Hospital</p>
                                      <span className="inline-block bg-[#E0F7F6] text-[#1CB5B2] text-[10px] font-bold px-2 py-0.5 rounded-full">
                                         {user.totalScore.toLocaleString()} XP
                                      </span>
                                   </div>

                                   <div className="flex items-center gap-2 mt-2 sm:mt-0">
                                      <button className="p-2 text-[#64748B] hover:text-[#0A2342] hover:bg-slate-100 rounded-full transition-colors">
                                         <MessageCircle className="w-5 h-5" />
                                      </button>
                                      <button 
                                         onClick={() => handleConnect(user.id)}
                                         disabled={isConnected}
                                         className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                                            isConnected 
                                            ? 'bg-transparent border border-[#E2E8F0] text-[#94A3B8] cursor-not-allowed' 
                                            : 'bg-[#1CB5B2] text-white hover:brightness-105 shadow-sm'
                                         }`}
                                      >
                                         {isConnected ? 'Requested' : 'Connect'}
                                      </button>
                                      <button className="p-2 text-[#64748B] hover:text-[#0A2342] rounded-full">
                                         <MoreHorizontal className="w-5 h-5" />
                                      </button>
                                   </div>
                                </div>
                             );
                          })}
                       </div>
                    </div>
                 </div>
              )}

              {/* --- TAB CONTENT: COMMUNITIES --- */}
              {activeTab === 'communities' && (
                 <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    
                    {/* My Communities */}
                    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
                       <div className="p-5 border-b border-slate-50 flex items-center gap-2">
                          <Users className="w-5 h-5 text-[#0A2342]" />
                          <h2 className="text-[#0A2342] font-medium">My communities</h2>
                       </div>
                       
                       <div className="divide-y divide-slate-50">
                          {MOCK_COMMUNITIES.filter(c => isCommunityJoined(c.id)).map(comm => (
                             <div key={comm.id} className="p-4 flex items-center justify-between hover:bg-[#F8FAFC] transition-colors">
                                <div className="flex items-center gap-3">
                                   <img src={comm.image} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                                   <div>
                                      <h4 className="text-[#0A2342] font-bold text-sm">{comm.name}</h4>
                                      <p className="text-[#64748B] text-xs">{comm.type} · {comm.memberCount.toLocaleString()} members</p>
                                   </div>
                                </div>
                                <button 
                                   onClick={() => onNavigateCommunity(comm.id)}
                                   className="text-xs font-bold text-[#1CB5B2] border border-[#1CB5B2] px-3 py-1.5 rounded-lg hover:bg-[#1CB5B2] hover:text-white transition-all"
                                >
                                   Go to community
                                </button>
                             </div>
                          ))}
                          <div className="p-3 text-center">
                             <button className="text-[#1CB5B2] text-xs font-bold hover:underline flex items-center justify-center gap-1 mx-auto">
                                View all communities <ArrowRight className="w-3 h-3" />
                             </button>
                          </div>
                       </div>
                    </div>

                    {/* Suggested Communities */}
                    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
                       <div className="p-5 border-b border-slate-50">
                          <div className="flex items-center gap-2 mb-1">
                             <Plus className="w-5 h-5 text-[#0A2342]" />
                             <h2 className="text-[#0A2342] font-medium">Suggested communities & orgs</h2>
                          </div>
                          <p className="text-[#64748B] text-xs pl-7">Based on your role and interests.</p>
                       </div>

                       <div className="divide-y divide-slate-50">
                          {MOCK_COMMUNITIES.filter(c => !isCommunityJoined(c.id)).map((comm, idx) => {
                             return (
                                <div key={comm.id} className="p-4 flex items-center justify-between hover:bg-[#F8FAFC] transition-colors">
                                   <div className="flex items-center gap-3">
                                      <img src={comm.image} className="w-10 h-10 rounded-full object-cover border border-slate-200 grayscale opacity-80" />
                                      <div>
                                         <h4 className="text-[#0A2342] font-bold text-sm">{comm.name}</h4>
                                         <p className="text-[#64748B] text-xs">{comm.type} · {comm.memberCount.toLocaleString()} members</p>
                                         {comm.access === 'approval' && <span className="text-[10px] text-slate-400 italic mt-0.5 block">Approval required</span>}
                                      </div>
                                   </div>
                                   
                                   {comm.access === 'open' ? (
                                      <button 
                                         onClick={() => handleJoinCommunity(comm.id)}
                                         className="bg-[#1CB5B2] text-white text-xs font-bold px-4 py-2 rounded-lg hover:brightness-105 transition-all shadow-sm"
                                      >
                                         Join
                                      </button>
                                   ) : (
                                      <button className="bg-white border border-[#1CB5B2] text-[#1CB5B2] text-xs font-bold px-4 py-2 rounded-lg hover:bg-slate-50 transition-all">
                                         Request access
                                      </button>
                                   )}
                                </div>
                             );
                          })}
                          <div className="p-3 text-center">
                             <button className="text-[#1CB5B2] text-xs font-bold hover:underline flex items-center justify-center gap-1 mx-auto">
                                Browse all communities <ArrowRight className="w-3 h-3" />
                             </button>
                          </div>
                       </div>
                    </div>

                 </div>
              )}

           </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkView;