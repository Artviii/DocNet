import React, { useState } from 'react';
import { SocialPost, ClinicalCase, Role, UserProfile, Difficulty, CaseCategory } from '../types';
import { MOCK_POSTS, MOCK_USERS, MOCK_COMMUNITIES } from '../constants';
import { MessageSquare, Heart, Share2, Plus, UserPlus, Filter, Hash, User, Users, MoreHorizontal, Send, Activity, Play, ArrowRight, Check, Bell, Briefcase, Building2, Globe, ChevronDown, Stethoscope, FileText, CheckCircle, ArrowLeft, Calendar, Shield, Info, Lock, Clock, Search as SearchIcon } from 'lucide-react';
import CaseCard from './CaseCard';

interface CommunityViewProps {
  cases: ClinicalCase[];
  currentUser: UserProfile;
  onPlayScenario: (caseId: string) => void;
  onNavigateProfile: (userId: string) => void;
  onNavigateJobs: () => void;
  selectedCommunityId?: string | null;
  onNavigateCommunity: (id: string | null) => void;
}

const CommunityView: React.FC<CommunityViewProps> = ({ cases, currentUser, onPlayScenario, onNavigateProfile, onNavigateJobs, selectedCommunityId, onNavigateCommunity }) => {
  const [posts, setPosts] = useState<SocialPost[]>(MOCK_POSTS);
  
  // Home Feed State
  const [scope, setScope] = useState<'network' | 'communities'>('network');
  const [selectedCommunityFilter, setSelectedCommunityFilter] = useState<string>('All communities');
  const [feedFilter, setFeedFilter] = useState<'relevant' | 'recent'>('relevant');
  const [showFilters, setShowFilters] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState<string[]>([]); // Right sidebar state

  // Community Page State
  const [activeTab, setActiveTab] = useState<'Feed' | 'Cases' | 'Assignments' | 'Members' | 'About'>('Feed');
  
  // Composer State
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [postType, setPostType] = useState<'update' | 'case' | 'reflection' | 'article'>('update');
  const [audience, setAudience] = useState('All network');
  const [audienceDropdownOpen, setAudienceDropdownOpen] = useState(false);
  const [caseTitle, setCaseTitle] = useState('');
  const [caseSpecialty, setCaseSpecialty] = useState<CaseCategory>('Cardiology');
  const [caseDifficulty, setCaseDifficulty] = useState<Difficulty>(Difficulty.Intermediate);

  // Comment State
  const [commentInput, setCommentInput] = useState<Record<string, string>>({}); 
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});

  const communities = ['General Hospital Residents', 'Emergency Medicine Interest', 'Med School 2025'];
  const activeCommunity = selectedCommunityId ? MOCK_COMMUNITIES.find(c => c.id === selectedCommunityId) : null;

  // --- Handlers ---

  const handleConnect = (userId: string) => {
      if (connectedUsers.includes(userId)) {
          setConnectedUsers(connectedUsers.filter(id => id !== userId));
      } else {
          setConnectedUsers([...connectedUsers, userId]);
      }
  };

  const handleCreatePost = () => {
    if (!postContent.trim()) return;

    const newPost: SocialPost = {
      id: `new-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      userRole: currentUser.role,
      content: postContent,
      type: postType,
      topic: 'General',
      visibility: activeCommunity ? 'community' : (audience === 'All network' ? 'network' : 'community'),
      targetCommunity: activeCommunity ? activeCommunity.name : (audience !== 'All network' ? audience : undefined),
      likes: 0,
      comments: [],
      timestamp: new Date(),
      caseTitle: postType === 'case' ? caseTitle : undefined,
      caseDifficulty: postType === 'case' ? caseDifficulty : undefined,
      caseCategory: postType === 'case' ? caseSpecialty : undefined,
      caseDescription: postType === 'case' ? "A new community case simulation." : undefined,
      caseId: postType === 'case' ? 'custom-case-1' : undefined
    };

    setPosts([newPost, ...posts]);
    setPostContent('');
    setIsComposerOpen(false);
    setPostType('update');
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, likes: post.isLiked ? post.likes - 1 : post.likes + 1, isLiked: !post.isLiked } : post
    ));
  };

  const toggleComments = (postId: string) => {
      setExpandedComments(prev => ({...prev, [postId]: !prev[postId]}));
  };

  const handleAddComment = (postId: string) => {
      const text = commentInput[postId];
      if(!text?.trim()) return;

      setPosts(posts.map(post => {
          if(post.id === postId) {
              return {
                  ...post,
                  comments: [...post.comments, {
                      id: `c-${Date.now()}`,
                      userId: currentUser.id,
                      userName: currentUser.name,
                      userAvatar: currentUser.avatar,
                      text: text,
                      timestamp: new Date()
                  }]
              };
          }
          return post;
      }));
      setCommentInput(prev => ({...prev, [postId]: ''}));
      setExpandedComments(prev => ({...prev, [postId]: true}));
  };

  // --- Render Helpers ---

  const renderPost = (post: SocialPost) => (
    <div key={post.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow">
       <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
             <img src={post.userAvatar} className="w-10 h-10 rounded-full cursor-pointer" onClick={() => onNavigateProfile(post.userId)} />
             <div>
                <div className="flex items-center gap-2">
                   <span className="font-bold text-[#0A2342] text-sm cursor-pointer hover:underline" onClick={() => onNavigateProfile(post.userId)}>{post.userName}</span>
                   <span className="text-xs text-slate-400">• {new Date(post.timestamp).getHours()}h ago</span>
                </div>
                <div className="text-xs text-slate-500">{post.userRole} {post.institutionId && '• General Hospital'}</div>
             </div>
          </div>
          <button className="text-slate-300 hover:text-slate-600"><MoreHorizontal className="w-5 h-5" /></button>
       </div>

       <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 mb-3">
          {post.visibility === 'network' ? <Globe className="w-3 h-3" /> : <Building2 className="w-3 h-3" />}
          Visible to: {post.targetCommunity || 'All network'}
       </div>

       <div className="text-sm text-slate-800 leading-relaxed mb-4 whitespace-pre-wrap">
          {post.content}
       </div>

       {(post.caseTitle || post.caseId) && (
          <div className="bg-[#F8FAFC] border border-slate-200 rounded-lg p-4 mb-4 group cursor-pointer hover:border-[#1CB5B2] transition-colors" onClick={() => post.caseId && onPlayScenario(post.caseId)}>
             <div className="flex justify-between items-start mb-2">
                <span className="bg-[#1CB5B2]/10 text-[#1CB5B2] text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                   <Stethoscope className="w-3 h-3" /> Simulation Case
                </span>
             </div>
             <h3 className="font-bold text-[#0A2342] text-base mb-1 group-hover:text-[#1CB5B2] transition-colors">
                {post.caseTitle || "Clinical Scenario"}
             </h3>
             <p className="text-xs text-slate-500 mb-3 line-clamp-2">
                {post.caseDescription || "Test your diagnostic skills with this interactive patient case."}
             </p>
             <div className="flex items-center justify-between">
                <div className="flex gap-2">
                   {post.caseCategory && <span className="text-[10px] bg-white border border-slate-200 px-2 py-1 rounded text-slate-600 font-bold">{post.caseCategory}</span>}
                   {post.caseDifficulty && <span className="text-[10px] bg-white border border-slate-200 px-2 py-1 rounded text-slate-600 font-bold">{post.caseDifficulty}</span>}
                </div>
                <div className="flex gap-2">
                   <button className="text-xs font-bold text-[#1CB5B2] hover:bg-[#1CB5B2]/10 px-3 py-1.5 rounded transition-colors">Open case</button>
                   <button className="text-xs font-bold bg-[#1CB5B2] text-white px-3 py-1.5 rounded hover:brightness-110 shadow-sm transition-colors">Practice</button>
                </div>
             </div>
          </div>
       )}

       <div className="flex items-center justify-between pt-3 border-t border-slate-50">
          <div className="flex gap-4">
             <button onClick={() => handleLike(post.id)} className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${post.isLiked ? 'text-rose-500' : 'text-slate-500 hover:text-slate-700'}`}>
                <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} /> {post.likes} Likes
             </button>
             <button onClick={() => toggleComments(post.id)} className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors">
                <MessageSquare className="w-4 h-4" /> {post.comments.length} Comments
             </button>
          </div>
          <button className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#1CB5B2] transition-colors">
             Share <Share2 className="w-4 h-4" />
          </button>
       </div>

       {expandedComments[post.id] && (
          <div className="mt-4 pt-4 border-t border-slate-100 animate-in fade-in">
             <div className="flex gap-2">
                <input 
                   className="flex-1 bg-[#F1F5F9] rounded-full px-4 py-2 text-xs outline-none focus:bg-white focus:ring-1 focus:ring-[#1CB5B2]" 
                   placeholder="Write a comment..." 
                   value={commentInput[post.id] || ''}
                   onChange={e => setCommentInput(prev => ({...prev, [post.id]: e.target.value}))}
                   onKeyDown={e => e.key === 'Enter' && handleAddComment(post.id)}
                />
             </div>
          </div>
       )}
    </div>
  );

  // --- VIEW: COMMUNITY PROFILE PAGE ---
  if (activeCommunity) {
      // Filter Logic for Community
      const communityPosts = posts.filter(p => p.targetCommunity === activeCommunity.name);
      // Mock Filtering for cases
      const communityCases = cases.filter((_, i) => i % 2 === 0); // Mock: every other case
      const isMember = activeCommunity.isJoined;

      const ASSIGNMENTS = [
        { id: 'a1', title: 'Chest Pain Foundations Pack', assignedTo: 'Med School 2025 – EM Rotation', dueDate: 'Dec 24, 2025', items: 5, completed: 2 },
        { id: 'a2', title: 'Sepsis Protocol Simulation', assignedTo: 'This community', dueDate: 'Jan 10, 2026', items: 1, completed: 0 }
      ];

      return (
        <div className="h-full bg-[#F8FAFC] overflow-y-auto font-sans">
            <div className="max-w-[1120px] mx-auto p-6 md:p-8">
                
                {/* 1. Header Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 mb-6 relative overflow-hidden">
                    {/* Header Bg decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-teal-50 to-transparent rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                    
                    <div className="flex flex-col md:flex-row justify-between gap-6 relative z-10">
                        {/* Left Identity */}
                        <div className="flex-1">
                            <button onClick={() => onNavigateCommunity(null)} className="flex items-center gap-1 text-slate-400 hover:text-slate-600 text-xs font-bold mb-4">
                                <ArrowLeft className="w-4 h-4" /> Back to Network
                            </button>
                            
                            <div className="flex items-start gap-4">
                                <div className="w-20 h-20 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shadow-sm shrink-0">
                                    <img src={activeCommunity.image} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-[#0A2342] leading-tight">{activeCommunity.name}</h1>
                                    <div className="flex flex-wrap items-center gap-3 mt-2">
                                        <span className="inline-flex items-center gap-1 bg-[#E0F7F6] text-[#1CB5B2] px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                                            <Building2 className="w-3 h-3" /> {activeCommunity.type} Community
                                        </span>
                                        <span className="text-slate-500 text-xs font-medium">{activeCommunity.memberCount.toLocaleString()} members</span>
                                        <span className="text-slate-400 text-xs">• Admins: Dr. Sarah Chen, Dr. Alex</span>
                                    </div>
                                    <div className="mt-4 text-xs text-slate-500 flex items-center gap-1">
                                        Part of: <span className="font-bold text-slate-700">General Hospital · Emergency Medicine</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Actions */}
                        <div className="flex flex-col items-end gap-3 pt-8">
                            {isMember ? (
                                <div className="flex items-center gap-2">
                                    <button className="px-4 py-2 bg-white border border-[#1CB5B2] text-[#1CB5B2] text-xs font-bold rounded-lg hover:bg-teal-50 transition-all">
                                        Leave community
                                    </button>
                                    <button className="px-4 py-2 bg-[#1CB5B2] text-white text-xs font-bold rounded-lg hover:brightness-105 shadow-sm flex items-center gap-1">
                                        <UserPlus className="w-4 h-4" /> Invite members
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <button className="px-6 py-2.5 bg-[#1CB5B2] text-white font-bold text-sm rounded-lg hover:brightness-105 shadow-md">
                                        Request Access
                                    </button>
                                    <p className="text-[10px] text-slate-400 mt-2 text-right">Requires approval from admins.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 2. Tabs */}
                <div className="flex border-b border-[#E2E8F0] mb-6 overflow-x-auto scrollbar-hide">
                    {['Feed', 'Cases', 'Assignments', 'Members', 'About'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-6 py-3 text-sm font-medium transition-all whitespace-nowrap relative ${activeTab === tab ? 'text-[#0A2342] font-bold' : 'text-[#64748B] hover:text-[#0A2342]'}`}
                        >
                            {tab}
                            {activeTab === tab && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#1CB5B2] rounded-t-full"></span>}
                        </button>
                    ))}
                </div>

                {/* 3. Content Area */}
                <div className="min-h-[400px]">
                    
                    {/* FEED TAB */}
                    {activeTab === 'Feed' && (
                        <div className="max-w-[700px]">
                            {/* Composer */}
                            {isMember && (
                                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-6">
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="text-xs font-bold text-slate-400">
                                            Posting in: <span className="text-[#0A2342]">{activeCommunity.name}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-[10px] text-slate-400 bg-slate-50 px-2 py-1 rounded">
                                            <Lock className="w-3 h-3" /> Visible to community
                                        </div>
                                    </div>
                                    <div className="flex gap-4 mb-4">
                                        <img src={currentUser.avatar} className="w-10 h-10 rounded-full" />
                                        <input 
                                            onClick={() => setIsComposerOpen(true)}
                                            value={postContent}
                                            onChange={(e) => setPostContent(e.target.value)}
                                            className="flex-1 bg-[#F1F5F9] rounded-lg px-4 py-3 text-sm outline-none hover:bg-slate-100 transition-colors"
                                            placeholder={`Share a case or update with ${activeCommunity.name}...`}
                                        />
                                    </div>
                                    {isComposerOpen && (
                                        <div className="animate-in fade-in slide-in-from-top-1 pt-2 border-t border-slate-100 flex justify-end gap-2">
                                            <button onClick={() => setIsComposerOpen(false)} className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-lg">Cancel</button>
                                            <button onClick={handleCreatePost} className="px-6 py-2 bg-[#1CB5B2] text-white font-bold text-xs rounded-lg hover:brightness-105">Post</button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Posts */}
                            <div className="space-y-4">
                                {communityPosts.length > 0 ? communityPosts.map(renderPost) : (
                                    <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                        <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                                        <p className="text-slate-500 text-sm font-medium">No posts in this community yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* CASES TAB */}
                    {activeTab === 'Cases' && (
                        <div>
                            <div className="flex flex-wrap items-center gap-4 mb-6">
                                <div className="relative">
                                    <select className="appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs font-bold text-[#0A2342] focus:border-[#1CB5B2] outline-none">
                                        <option>Specialty: All</option>
                                        <option>Cardiology</option>
                                        <option>Trauma</option>
                                    </select>
                                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                                </div>
                                <div className="relative">
                                    <select className="appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs font-bold text-[#0A2342] focus:border-[#1CB5B2] outline-none">
                                        <option>Difficulty: All</option>
                                        <option>Novice</option>
                                        <option>Advanced</option>
                                    </select>
                                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                                </div>
                                <div className="flex bg-slate-100 rounded-lg p-1 ml-auto">
                                    <button className="px-3 py-1.5 bg-white shadow-sm rounded text-xs font-bold text-[#0A2342]">Org Only</button>
                                    <button className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-700">All</button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {communityCases.map(c => (
                                    <CaseCard key={c.id} scenario={c} onSelect={onPlayScenario} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ASSIGNMENTS TAB */}
                    {activeTab === 'Assignments' && (
                        <div className="max-w-[800px]">
                            <h3 className="text-[#0A2342] font-bold text-lg mb-6">Active Assignments</h3>
                            <div className="space-y-4">
                                {ASSIGNMENTS.map(assign => (
                                    <div key={assign.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                                        <div className="flex-1">
                                            <h4 className="font-bold text-[#0A2342] text-base mb-1">{assign.title}</h4>
                                            <p className="text-xs text-slate-500 mb-4">Assigned to: {assign.assignedTo}</p>
                                            
                                            <div className="flex items-center gap-6 text-xs text-slate-600">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="w-4 h-4 text-slate-400" />
                                                    Due: <span className="font-bold">{assign.dueDate}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <FileText className="w-4 h-4 text-slate-400" />
                                                    Includes: <span className="font-bold">{assign.items} items</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="w-full sm:w-48 shrink-0">
                                            <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                                                <span>Progress</span>
                                                <span>{assign.completed}/{assign.items}</span>
                                            </div>
                                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
                                                <div 
                                                    className="h-full bg-[#1CB5B2] rounded-full transition-all" 
                                                    style={{ width: `${(assign.completed / assign.items) * 100}%` }}
                                                ></div>
                                            </div>
                                            <button className="w-full py-2 bg-slate-50 border border-slate-200 text-[#1CB5B2] text-xs font-bold rounded-lg hover:bg-teal-50 hover:border-teal-200 transition-colors">
                                                {assign.completed > 0 ? 'Continue' : 'Start Pack'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* MEMBERS TAB */}
                    {activeTab === 'Members' && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <div className="relative w-64">
                                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-xs font-bold focus:border-[#1CB5B2] outline-none" placeholder="Search members..." />
                                </div>
                                <select className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-[#0A2342] outline-none">
                                    <option>Role: All</option>
                                    <option>Attending</option>
                                    <option>Resident</option>
                                </select>
                            </div>

                            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                                {MOCK_USERS.map((u, i) => (
                                    <div key={u.id} className="p-4 flex items-center justify-between border-b border-slate-50 last:border-0 hover:bg-[#F8FAFC]">
                                        <div className="flex items-center gap-3">
                                            <img src={u.avatar} className="w-10 h-10 rounded-full border border-slate-100" />
                                            <div>
                                                <h4 className="font-bold text-[#0A2342] text-sm flex items-center gap-2">
                                                    {u.name}
                                                    {i === 0 && <span className="bg-teal-100 text-teal-700 text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider">Admin</span>}
                                                </h4>
                                                <p className="text-xs text-slate-500">{u.role} · Joined Mar 2024</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase">{u.role}</span>
                                            <button className="p-2 text-slate-400 hover:text-[#1CB5B2] hover:bg-teal-50 rounded-full transition-colors">
                                                <MessageSquare className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ABOUT TAB */}
                    {activeTab === 'About' && (
                        <div className="max-w-[700px] bg-white rounded-xl border border-slate-200 p-8">
                            <section className="mb-8">
                                <h3 className="font-bold text-[#0A2342] text-lg mb-4">About this community</h3>
                                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                                    This is the official simulation and discussion group for General Hospital Emergency Medicine Residents. 
                                    We use this space to share interesting cases from rounds, coordinate on curriculum assignments, and practice simulation scenarios relevant to our ED protocols.
                                </p>
                                <div className="flex gap-4">
                                    <div className="bg-[#F8FAFC] p-3 rounded-lg border border-slate-100 flex items-center gap-3">
                                        <Building2 className="w-5 h-5 text-slate-400" />
                                        <div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase">Institution</div>
                                            <div className="text-xs font-bold text-[#0A2342]">General Hospital</div>
                                        </div>
                                    </div>
                                    <div className="bg-[#F8FAFC] p-3 rounded-lg border border-slate-100 flex items-center gap-3">
                                        <Users className="w-5 h-5 text-slate-400" />
                                        <div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase">Department</div>
                                            <div className="text-xs font-bold text-[#0A2342]">Emergency Medicine</div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h3 className="font-bold text-[#0A2342] text-lg mb-4">Guidelines</h3>
                                <ul className="space-y-3">
                                    {[
                                        'De-identify all patient information before posting case descriptions.',
                                        'Be respectful and constructive in clinical disagreements.',
                                        'Simulations are for educational purposes only.',
                                        'Adhere to the institution\'s social media policy.'
                                    ].map((rule, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                                            <CheckCircle className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                                            {rule}
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        </div>
                    )}

                </div>
            </div>
        </div>
      );
  }

  // --- VIEW: HOME FEED (DEFAULT) ---
  const filteredPosts = posts.filter(post => {
      // Scope filtering for Global Feed
      if (scope === 'communities' && post.visibility === 'network') return false;
      if (selectedCommunityFilter !== 'All communities' && post.targetCommunity !== selectedCommunityFilter && post.visibility !== 'network') return false;
      return true;
  });

  return (
    <div className="h-full bg-[#F8FAFC] flex justify-center overflow-y-auto overflow-x-hidden">
      
      {/* --- MIDDLE COLUMN: FEED --- */}
      <div className="w-full max-w-[760px] py-8 px-4 flex flex-col gap-6">
         
         <div>
            <h1 className="text-2xl font-bold text-[#0A2342] mb-4">Home Feed</h1>
            <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-2 rounded-xl border border-slate-200 shadow-sm gap-3">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wide ml-2">View:</span>
                    <div className="flex bg-[#F1F5F9] rounded-lg p-1">
                        <button 
                            onClick={() => setScope('network')} 
                            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${scope === 'network' ? 'bg-[#1CB5B2] text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            All Network
                        </button>
                        <button 
                            onClick={() => setScope('communities')}
                            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${scope === 'communities' ? 'bg-[#1CB5B2] text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            My Communities
                        </button>
                    </div>
                </div>

                <div className="relative w-full sm:w-auto">
                    <button className="flex items-center justify-between w-full sm:w-48 gap-2 text-xs font-bold text-[#0A2342] bg-white border border-slate-200 px-3 py-2 rounded-lg hover:border-[#1CB5B2]">
                        <span>{selectedCommunityFilter}</span>
                        <ChevronDown className="w-3 h-3 text-slate-400" />
                    </button>
                </div>
            </div>
         </div>

         {/* Composer */}
         <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 transition-all">
            <div className="flex gap-4 mb-4">
               <img src={currentUser.avatar} className="w-10 h-10 rounded-full" />
               <div className="flex-1">
                  <input 
                     onClick={() => setIsComposerOpen(true)}
                     value={postContent}
                     onChange={(e) => setPostContent(e.target.value)}
                     className={`w-full bg-[#F1F5F9] rounded-lg px-4 py-3 text-sm outline-none transition-all ${isComposerOpen ? 'bg-white ring-1 ring-[#1CB5B2]' : 'hover:bg-slate-100'}`}
                     placeholder="Share a case, reflection, or article..."
                  />
               </div>
            </div>

            {isComposerOpen && (
               <div className="animate-in slide-in-from-top-2 space-y-4">
                  {/* Type Selector */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                     <span className="text-xs font-bold text-slate-400 mr-2">Type:</span>
                     {['update', 'case', 'reflection', 'article'].map(type => (
                        <button 
                           key={type}
                           onClick={() => setPostType(type as any)}
                           className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize border transition-colors ${postType === type ? 'bg-[#1CB5B2] text-white border-[#1CB5B2]' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                        >
                           {type}
                        </button>
                     ))}
                  </div>

                  {/* Conditional Fields */}
                  {postType === 'case' && (
                     <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input className="col-span-1 sm:col-span-3 bg-white border border-slate-200 rounded px-3 py-2 text-xs outline-none" placeholder="Case Title" value={caseTitle} onChange={e => setCaseTitle(e.target.value)} />
                        <select className="bg-white border border-slate-200 rounded px-2 py-2 text-xs outline-none" value={caseSpecialty} onChange={e => setCaseSpecialty(e.target.value as any)}>
                           <option>Cardiology</option><option>Trauma</option><option>Pediatrics</option>
                        </select>
                        <select className="bg-white border border-slate-200 rounded px-2 py-2 text-xs outline-none" value={caseDifficulty} onChange={e => setCaseDifficulty(e.target.value as any)}>
                           <option value={Difficulty.Novice}>Novice</option><option value={Difficulty.Intermediate}>Intermediate</option><option value={Difficulty.Advanced}>Advanced</option>
                        </select>
                     </div>
                  )}

                  <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                     <div className="relative">
                        <button 
                           onClick={() => setAudienceDropdownOpen(!audienceDropdownOpen)}
                           className={`flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#0A2342]`}
                        >
                           <Globe className="w-3 h-3" /> Posting to: {audience} <ChevronDown className="w-3 h-3" />
                        </button>
                        {audienceDropdownOpen && (
                           <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-xl z-50 py-1">
                              <button onClick={() => {setAudience('All network'); setAudienceDropdownOpen(false)}} className="block w-full text-left px-4 py-2 text-xs hover:bg-slate-50">All network</button>
                              <div className="border-t border-slate-100 my-1"></div>
                              {communities.map(c => (
                                 <button key={c} onClick={() => {setAudience(c); setAudienceDropdownOpen(false)}} className="block w-full text-left px-4 py-2 text-xs hover:bg-slate-50">{c}</button>
                              ))}
                           </div>
                        )}
                     </div>
                     
                     <div className="flex gap-2">
                        <button onClick={() => setIsComposerOpen(false)} className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-lg">Cancel</button>
                        <button 
                           onClick={handleCreatePost}
                           className="px-6 py-2 bg-[#1CB5B2] text-white font-bold text-xs rounded-lg hover:brightness-110 shadow-sm"
                        >
                           Post
                        </button>
                     </div>
                  </div>
               </div>
            )}
         </div>

         {/* Feed Filters */}
         <div className="flex justify-between items-center px-2">
            <div className="flex gap-4 text-sm font-bold">
               <button onClick={() => setFeedFilter('relevant')} className={`${feedFilter === 'relevant' ? 'text-[#0A2342] border-b-2 border-[#1CB5B2]' : 'text-slate-400'} pb-1 transition-colors`}>Relevant</button>
               <button onClick={() => setFeedFilter('recent')} className={`${feedFilter === 'recent' ? 'text-[#0A2342] border-b-2 border-[#1CB5B2]' : 'text-slate-400'} pb-1 transition-colors`}>Recent</button>
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-[#1CB5B2]">
               <Filter className="w-3 h-3" /> Filter
            </button>
         </div>

         {/* Posts Feed */}
         <div className="space-y-4 pb-20">
            {filteredPosts.length > 0 ? filteredPosts.map(renderPost) : (
                <div className="text-center py-10">
                    <div className="inline-block p-4 rounded-full bg-slate-50 mb-3">
                        <MessageSquare className="w-8 h-8 text-slate-300" />
                    </div>
                    <h3 className="text-slate-900 font-bold text-sm">No posts yet</h3>
                    <p className="text-slate-500 text-xs mt-1">Be the first to share something.</p>
                </div>
            )}
         </div>

      </div>

      {/* --- RIGHT SIDEBAR --- */}
      <div className="hidden xl:block w-[320px] p-8 shrink-0 space-y-6">
         
         {/* Job Highlights */}
         <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h4 className="font-bold text-[#0A2342] text-sm mb-4 flex items-center gap-2">
               <Briefcase className="w-4 h-4 text-[#1CB5B2]" /> Job Highlights
            </h4>
            <div className="space-y-4">
               {[1, 2].map(i => (
                  <div key={i} className="group cursor-pointer" onClick={onNavigateJobs}>
                     <h5 className="font-bold text-slate-900 text-sm group-hover:text-[#1CB5B2] transition-colors">ER Resident</h5>
                     <p className="text-xs text-slate-500 mb-2">General Hospital • NY</p>
                     
                     <div className="flex items-center gap-2 mb-1">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                           <div className="h-full bg-[#1CB5B2] w-[85%] rounded-full"></div>
                        </div>
                        <span className="text-[10px] font-bold text-[#1CB5B2]">85%</span>
                     </div>
                     <p className="text-[10px] text-slate-400">Skills match based on your cases</p>
                  </div>
               ))}
            </div>
            <button onClick={onNavigateJobs} className="w-full mt-4 flex items-center justify-center gap-1 text-xs font-bold text-[#1CB5B2] hover:underline">
               View all jobs <ArrowRight className="w-3 h-3" />
            </button>
         </div>

         {/* New in Communities */}
         <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h4 className="font-bold text-[#0A2342] text-sm mb-4 flex items-center gap-2">
               <Building2 className="w-4 h-4 text-[#1CB5B2]" /> New in your communities
            </h4>
            <div className="space-y-3">
               {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-start gap-3 pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                     <div className="mt-1 w-2 h-2 bg-[#1CB5B2] rounded-full shrink-0"></div>
                     <div>
                        <h5 className="font-bold text-slate-800 text-xs hover:text-[#1CB5B2] cursor-pointer" onClick={() => onPlayScenario('trauma-001')}>Unstable Pelvis Trauma</h5>
                        <p className="text-[10px] text-slate-500 mb-1">General Hospital Residents</p>
                        <div className="flex gap-2">
                           <button onClick={() => onPlayScenario('trauma-001')} className="text-[10px] font-bold text-[#1CB5B2] cursor-pointer hover:underline">Practice</button>
                           <span className="text-[10px] text-slate-300">• 3h ago</span>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* People You May Know */}
         <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h4 className="font-bold text-[#0A2342] text-sm mb-4">People you may know</h4>
            <div className="space-y-4">
               {MOCK_USERS.slice(1, 4).map(u => {
                  const isConnected = connectedUsers.includes(u.id);
                  return (
                    <div key={u.id} className="flex items-center gap-3">
                        <img src={u.avatar} className="w-9 h-9 rounded-full cursor-pointer" onClick={() => onNavigateProfile(u.id)} />
                        <div className="flex-1 min-w-0">
                            <div className="font-bold text-slate-900 text-xs truncate cursor-pointer hover:underline" onClick={() => onNavigateProfile(u.id)}>{u.name}</div>
                            <div className="text-[10px] text-slate-500 truncate">{u.role}</div>
                        </div>
                        <button 
                            onClick={() => handleConnect(u.id)}
                            className={`text-[10px] font-bold px-2 py-1 rounded transition-colors border ${isConnected ? 'bg-slate-100 text-slate-500 border-slate-200' : 'border-[#1CB5B2] text-[#1CB5B2] hover:bg-[#1CB5B2] hover:text-white'}`}
                        >
                            {isConnected ? 'Sent' : 'Connect'}
                        </button>
                    </div>
                  );
               })}
            </div>
         </div>

      </div>

    </div>
  );
};

export default CommunityView;