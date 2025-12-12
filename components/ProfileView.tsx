import React, { useState } from 'react';
import { UserProfile } from '../types';
import { MOCK_POSTS } from '../constants';
import { MapPin, Link as LinkIcon, MessageCircle, UserPlus, MoreHorizontal, Award, Check } from 'lucide-react';

interface ProfileViewProps {
  user: UserProfile;
  currentUser: UserProfile;
  onNavigateMessage: (userId: string) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, currentUser, onNavigateMessage }) => {
  const [isConnected, setIsConnected] = useState(currentUser.connections.includes(user.id));

  // Filter posts for this user
  const userPosts = MOCK_POSTS.filter(p => p.userId === user.id);

  const handleConnect = () => {
    setIsConnected(!isConnected);
  };

  return (
    <div className="h-full bg-slate-50 overflow-y-auto">
      <div className="max-w-5xl mx-auto py-8 px-6">
        
        <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-[#0A2342]">Profile</h1>
            <div className="flex gap-2">
                <button className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><MessageCircle className="w-5 h-5" /></button>
                <button className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><BellIcon className="w-5 h-5" /></button>
            </div>
        </div>

        {/* --- PROFILE HEADER CARD --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
           {/* Purple Gradient Banner */}
           <div className="h-32 bg-gradient-to-r from-[#6366f1] to-[#a855f7]"></div>
           
           <div className="px-8 pb-8 relative">
              {/* Avatar overlapping banner */}
              <div className="absolute -top-12 left-8">
                 <img src={user.avatar} className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-white object-cover" alt={user.name} />
              </div>

              {/* Actions Top Right */}
              <div className="flex justify-end pt-4 gap-2 mb-2">
                 {user.id !== currentUser.id && (
                    <>
                       <button 
                          onClick={() => onNavigateMessage(user.id)}
                          className="px-4 py-1.5 border border-[#6366f1] text-[#6366f1] font-bold rounded-full text-xs hover:bg-indigo-50 transition-colors flex items-center gap-2"
                       >
                          <MessageCircle className="w-3 h-3" /> Message
                       </button>
                       <button 
                          onClick={handleConnect}
                          className={`px-4 py-1.5 font-bold rounded-full text-xs transition-colors flex items-center gap-2 ${isConnected ? 'bg-slate-100 text-slate-600 border border-slate-200' : 'bg-[#6366f1] text-white hover:bg-indigo-600'}`}
                       >
                          {isConnected ? <Check className="w-3 h-3" /> : <UserPlus className="w-3 h-3" />}
                          {isConnected ? 'Connected' : 'Connect'}
                       </button>
                    </>
                 )}
                 <button className="w-8 h-8 flex items-center justify-center text-slate-400 hover:bg-slate-100 rounded-full border border-slate-200">
                    <MoreHorizontal className="w-4 h-4" />
                 </button>
              </div>

              {/* Text Info */}
              <div className="mt-4">
                 <h1 className="text-2xl font-bold text-[#0A2342] mb-1">
                    {user.name} 
                 </h1>
                 <p className="text-slate-900 font-medium text-sm mb-2">{user.headline || user.role}</p>
                 
                 <div className="flex items-center gap-4 text-xs text-slate-500 mb-6">
                    {user.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {user.location}</span>}
                    <span className="flex items-center gap-1 text-[#6366f1] font-bold cursor-pointer hover:underline"><LinkIcon className="w-3 h-3" /> {user.connections.length + (isConnected ? 1 : 0)} connections</span>
                 </div>

                 {/* Grey Stats Box */}
                 <div className="bg-[#F8FAFC] rounded-xl border border-slate-100 p-4 flex gap-12">
                    <div>
                       <div className="text-lg font-bold text-[#0A2342]">{user.totalScore.toLocaleString()}</div>
                       <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">XP Score</div>
                    </div>
                    <div>
                       <div className="text-lg font-bold text-[#0A2342]">{user.casesCompleted}</div>
                       <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Cases Solved</div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* --- GRID LAYOUT --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           
           {/* LEFT COLUMN */}
           <div className="space-y-6">
              
              {/* About */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                 <h3 className="font-bold text-[#0A2342] mb-3 text-sm">About</h3>
                 <p className="text-slate-600 text-sm leading-relaxed">
                    {user.about || "Medical professional focused on clinical excellence and continuous learning."}
                 </p>
              </div>

              {/* Experience */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                 <h3 className="font-bold text-[#0A2342] mb-4 text-sm">Experience</h3>
                 <div className="space-y-4">
                    {user.experience && user.experience.length > 0 ? user.experience.map((exp, i) => (
                       <div key={exp.id} className="pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                          <h4 className="font-bold text-slate-900 text-xs mb-0.5">{exp.title}</h4>
                          <p className="text-xs text-slate-500">{exp.institution}</p>
                          <p className="text-[10px] text-slate-400 italic mt-1">{exp.startYear} - {exp.endYear}</p>
                       </div>
                    )) : <p className="text-slate-400 text-xs italic">No experience listed.</p>}
                 </div>
              </div>

              {/* Activity */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                 <h3 className="font-bold text-[#0A2342] mb-4 text-sm">Activity</h3>
                 <div className="space-y-4">
                    {userPosts.length > 0 ? userPosts.map(post => (
                       <div key={post.id} className="bg-[#F8FAFC] p-3 rounded-lg border border-slate-100">
                          <p className="text-[10px] text-slate-500 mb-2">
                             <span className="font-bold text-slate-900">{user.name}</span> posted this • {new Date(post.timestamp).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-slate-700 line-clamp-3">{post.content}</p>
                       </div>
                    )) : <p className="text-slate-400 text-xs italic">No recent activity.</p>}
                 </div>
              </div>

           </div>

           {/* RIGHT COLUMN */}
           <div className="space-y-6">
              
              {/* Badges */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                 <h3 className="font-bold text-[#0A2342] mb-4 text-sm">Badges</h3>
                 <div className="flex flex-wrap gap-2">
                    {user.badges.length > 0 ? user.badges.map(badge => (
                       <span key={badge} className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#FFFBEB] text-[#B45309] border border-[#FEF3C7] rounded-full text-xs font-bold shadow-sm">
                          <Award className="w-3 h-3" /> {badge}
                       </span>
                    )) : <p className="text-slate-400 text-xs italic">No badges earned yet.</p>}
                 </div>
              </div>

              {/* Skills */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                 <h3 className="font-bold text-[#0A2342] mb-4 text-sm">Skills</h3>
                 <div className="flex flex-wrap gap-2">
                    {user.skills && user.skills.length > 0 ? user.skills.map(skill => (
                       <span key={skill} className="px-3 py-1.5 bg-[#F1F5F9] text-slate-600 rounded-full text-xs font-bold border border-slate-200">
                          {skill}
                       </span>
                    )) : <p className="text-slate-400 text-xs italic">No skills listed.</p>}
                 </div>
              </div>

              {/* Education */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                 <h3 className="font-bold text-[#0A2342] mb-4 text-sm">Education</h3>
                 <div className="space-y-3">
                    {user.education && user.education.length > 0 ? user.education.map((edu, i) => (
                       <div key={i} className="">
                          <h4 className="font-bold text-slate-900 text-xs">{edu.school}</h4>
                          <p className="text-xs text-slate-500">{edu.degree}, {edu.year}</p>
                       </div>
                    )) : <p className="text-slate-400 text-xs italic">No education listed.</p>}
                 </div>
              </div>

           </div>

        </div>
      </div>
    </div>
  );
};

// Helper Icon for header
const BellIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
);

export default ProfileView;