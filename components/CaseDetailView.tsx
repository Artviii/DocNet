import React, { useState } from 'react';
import { ClinicalCase, Difficulty, UserProfile } from '../types';
import { Activity, Building2, Globe, Bookmark, Share2, MessageSquare, Play, Heart, MoreHorizontal, Shield, ChevronDown, CheckCircle, AlertTriangle, FileText, Image as ImageIcon, Send, Clock, User, ArrowLeft, Lock, Eye } from 'lucide-react';

interface CaseDetailViewProps {
  scenario: ClinicalCase;
  currentUser: UserProfile;
  onBack: () => void;
  onPractice: () => void;
  isCompleted: boolean;
}

const CaseDetailView: React.FC<CaseDetailViewProps> = ({ scenario, currentUser, onBack, onPractice, isCompleted }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [visibility, setVisibility] = useState<'org' | 'global'>(scenario.visibility === 'public' ? 'global' : 'org');
  const [revealSpoilers, setRevealSpoilers] = useState(false);
  
  // Discussion State
  const [commentInput, setCommentInput] = useState('');
  const [comments, setComments] = useState([
    { id: 1, user: 'Dr. Sarah Chen', role: 'EM Resident', avatar: 'https://i.pravatar.cc/150?u=u1', text: 'The timeline of symptoms is critical here. Don\'t miss the nausea!', time: '2 hours ago', likes: 12 },
    { id: 2, user: 'Nurse Mike', role: 'Triage Nurse', avatar: 'https://i.pravatar.cc/150?u=u2', text: 'Also watch the BP. It drops faster than you expect in the second half.', time: '5 hours ago', likes: 8 }
  ]);

  const handlePostComment = () => {
      if(!commentInput.trim()) return;
      setComments([{
          id: Date.now(),
          user: currentUser.name,
          role: currentUser.role,
          avatar: currentUser.avatar,
          text: commentInput,
          time: 'Just now',
          likes: 0
      }, ...comments]);
      setCommentInput('');
  };

  const diffColors = {
      [Difficulty.Novice]: 'bg-emerald-50 text-emerald-700',
      [Difficulty.Intermediate]: 'bg-[#EDE9FE] text-purple-700',
      [Difficulty.Advanced]: 'bg-rose-50 text-rose-700',
  };

  const isUnlocked = isCompleted || revealSpoilers;

  return (
    <div className="h-full bg-[#F8FAFC] p-6 md:p-8 overflow-y-auto font-sans">
      <div className="max-w-[1120px] mx-auto">
        
        {/* --- BREADCRUMB --- */}
        <button onClick={onBack} className="flex items-center gap-1 text-slate-400 hover:text-slate-600 text-xs font-bold mb-4 uppercase tracking-wide transition-colors">
            <ArrowLeft className="w-3 h-3" /> Back to Library
        </button>

        {/* --- 2. HEADER CARD --- */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 mb-8 relative">
            <div className="flex flex-col md:flex-row justify-between gap-6">
                
                {/* Left: Identity */}
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-[#0A2342] mb-3">{scenario.patientName} – {scenario.chiefComplaint}</h1>
                    
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        {/* Specialty Pill */}
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#E0F7F6] text-[#1CB5B2] text-xs font-bold uppercase tracking-wide">
                            <Activity className="w-3 h-3" /> {scenario.category}
                        </span>
                        
                        {/* Difficulty Pill */}
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide ${diffColors[scenario.difficulty]}`}>
                            {scenario.difficulty}
                        </span>

                        {/* Owner */}
                        <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md">
                            <Building2 className="w-3 h-3" /> Owned by: General Hospital Residents
                        </span>

                        {/* Status */}
                        {isCompleted && (
                            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                                <CheckCircle className="w-3 h-3" /> Case Completed
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                        <Shield className="w-3 h-3 text-[#1CB5B2]" /> Simulation case based on de-identified clinical data.
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex flex-col items-end gap-3 shrink-0">
                    <button 
                        onClick={onPractice}
                        className="bg-[#1CB5B2] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-teal-500/20 hover:brightness-105 hover:-translate-y-0.5 transition-all w-full md:w-auto justify-center"
                    >
                        <Play className="w-4 h-4 fill-current" /> {isCompleted ? 'Practice Again' : 'Start Simulation'}
                    </button>
                    
                    <div className="flex gap-2 w-full md:w-auto">
                        <button 
                            onClick={() => setIsSaved(!isSaved)}
                            className={`flex-1 md:flex-none px-4 py-2 border rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors ${isSaved ? 'bg-slate-50 border-slate-300 text-slate-700' : 'bg-white border-[#1CB5B2] text-[#1CB5B2] hover:bg-teal-50'}`}
                        >
                            <Bookmark className={`w-3 h-3 ${isSaved ? 'fill-current' : ''}`} />
                            {isSaved ? 'Saved' : 'Save case'}
                        </button>
                        
                        <div className="relative">
                            <button 
                                onClick={() => setShowShareMenu(!showShareMenu)}
                                className="px-4 py-2 bg-white border border-[#1CB5B2] text-[#1CB5B2] rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-teal-50 transition-colors"
                            >
                                Share <ChevronDown className="w-3 h-3" />
                            </button>
                            {showShareMenu && (
                                <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden animate-in fade-in slide-in-from-top-2">
                                    <button className="w-full text-left px-4 py-3 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                                        <Share2 className="w-3 h-3" /> Copy case link
                                    </button>
                                    <div className="h-px bg-slate-100 mx-2"></div>
                                    <div className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Share to Feed</div>
                                    <button className="w-full text-left px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 hover:text-[#1CB5B2]">
                                        General Hospital Residents
                                    </button>
                                    <button className="w-full text-left px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 hover:text-[#1CB5B2]">
                                        All Network
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* --- 3. MAIN BODY GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20">
            
            {/* LEFT COLUMN: CLINICAL CONTENT (~65%) */}
            <div className="lg:col-span-8 space-y-6">
                
                {/* --- SAFE SECTION: TRIAGE INFO --- */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8">
                    
                    {/* Header Label */}
                    <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-3">
                        <FileText className="w-5 h-5 text-slate-400" />
                        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wide">Triage / Admission Context</h2>
                    </div>

                    {/* Chief Complaint */}
                    <div className="mb-8">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Chief Complaint</h3>
                        <p className="text-lg font-medium text-slate-800">
                            "{scenario.chiefComplaint}"
                        </p>
                    </div>

                    {/* Patient Context / Triage Note */}
                    <div className="mb-8">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Triage Note</h3>
                        <div className="prose prose-sm text-slate-600 leading-relaxed max-w-none">
                            <p>{scenario.description}</p>
                            <p className="mt-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                <strong>Demographics:</strong> {scenario.age}-year-old {scenario.gender}.<br/>
                                <strong>Setting:</strong> {scenario.role === 'Paramedic' ? 'Pre-hospital scene.' : 'Emergency Department presentation.'}
                            </p>
                        </div>
                    </div>

                    {/* Triage Vitals */}
                    <div className="mb-2">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Triage Vitals</h3>
                        
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
                                <div className="text-[10px] font-bold text-slate-400 uppercase">BP</div>
                                <div className="text-sm font-bold text-[#0A2342]">{scenario.initialVitals.bp}</div>
                            </div>
                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
                                <div className="text-[10px] font-bold text-slate-400 uppercase">HR</div>
                                <div className={`text-sm font-bold ${scenario.initialVitals.hr > 100 ? 'text-rose-600' : 'text-[#0A2342]'}`}>{scenario.initialVitals.hr}</div>
                            </div>
                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
                                <div className="text-[10px] font-bold text-slate-400 uppercase">RR</div>
                                <div className="text-sm font-bold text-[#0A2342]">{scenario.initialVitals.rr}</div>
                            </div>
                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
                                <div className="text-[10px] font-bold text-slate-400 uppercase">SpO2</div>
                                <div className={`text-sm font-bold ${scenario.initialVitals.o2 < 94 ? 'text-rose-600' : 'text-[#0A2342]'}`}>{scenario.initialVitals.o2}%</div>
                            </div>
                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
                                <div className="text-[10px] font-bold text-slate-400 uppercase">Temp</div>
                                <div className="text-sm font-bold text-[#0A2342]">{scenario.initialVitals.temp}°C</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- SPOILER SECTION: ANSWERS --- */}
                <div className="relative">
                    
                    {/* Locked Overlay */}
                    {!isUnlocked && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-md z-10 flex flex-col items-center justify-center rounded-xl border border-slate-200">
                            <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 text-center max-w-sm">
                                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                                    <Lock className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-[#0A2342] text-lg mb-2">Restricted Access</h3>
                                <p className="text-sm text-slate-500 mb-6">
                                    Diagnostic findings and learning points are hidden to prevent spoilers during simulation.
                                </p>
                                <div className="space-y-3">
                                    <button 
                                        onClick={onPractice}
                                        className="w-full bg-[#1CB5B2] text-white py-2.5 rounded-lg font-bold text-sm shadow-md hover:brightness-105"
                                    >
                                        Start Simulation
                                    </button>
                                    <button 
                                        onClick={() => {
                                            if(confirm("Revealing this information will spoil the diagnosis for the simulation. Are you sure you want to study this case as a textbook example?")) {
                                                setRevealSpoilers(true);
                                            }
                                        }}
                                        className="w-full bg-white border border-slate-200 text-slate-500 py-2.5 rounded-lg font-bold text-xs hover:bg-slate-50 flex items-center justify-center gap-2"
                                    >
                                        <Eye className="w-3 h-3" /> Reveal for Study (Spoilers)
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-8 ${!isUnlocked ? 'opacity-50 select-none' : ''}`}>
                        
                        {/* Header Label */}
                        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wide">Diagnostic Findings & Resolution</h2>
                        </div>

                        {/* Labs & Imaging (Mock) */}
                        <div>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Labs & Imaging</h3>
                            
                            <div className="mb-4">
                                <h4 className="text-xs font-bold text-slate-700 mb-2">Key Abnormalities</h4>
                                <div className="border rounded-lg overflow-hidden border-slate-200">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                                            <tr>
                                                <th className="px-4 py-2">Test</th>
                                                <th className="px-4 py-2">Result</th>
                                                <th className="px-4 py-2">Flag</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            <tr>
                                                <td className="px-4 py-2 font-medium text-[#0A2342]">Troponin I</td>
                                                <td className="px-4 py-2 text-slate-600">0.04 ng/mL</td>
                                                <td className="px-4 py-2 text-amber-500 font-bold">Elevated</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-2 font-medium text-[#0A2342]">ECG</td>
                                                <td className="px-4 py-2 text-slate-600">Sinus Tach, ST depression V4-V6</td>
                                                <td className="px-4 py-2 text-rose-500 font-bold">Abnormal</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-24 h-24 bg-slate-100 rounded-lg border border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-200 transition-colors">
                                    <ImageIcon className="w-6 h-6 text-slate-400 mb-1" />
                                    <span className="text-[10px] font-bold text-slate-500">ECG Snapshot</span>
                                </div>
                                <div className="w-24 h-24 bg-slate-100 rounded-lg border border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-200 transition-colors">
                                    <ImageIcon className="w-6 h-6 text-slate-400 mb-1" />
                                    <span className="text-[10px] font-bold text-slate-500">CXR PA View</span>
                                </div>
                            </div>
                        </div>

                        {/* Final Diagnosis */}
                        <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                            <h3 className="text-xs font-bold text-green-800 uppercase tracking-wider mb-2">Final Diagnosis</h3>
                            <p className="text-lg font-bold text-green-900">{scenario.diagnosis}</p>
                        </div>

                        {/* Key Learning Points */}
                        <div>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Key Learning Points</h3>
                            <ul className="space-y-2">
                                <li className="flex items-start gap-2 text-sm text-slate-700">
                                    <CheckCircle className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                                    Recognize chest pain red flags requiring urgent workup.
                                </li>
                                <li className="flex items-start gap-2 text-sm text-slate-700">
                                    <CheckCircle className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                                    Use focused history to differentiate ACS from non-cardiac causes.
                                </li>
                                <li className="flex items-start gap-2 text-sm text-slate-700">
                                    <CheckCircle className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                                    Understand initial management priorities in suspected ACS.
                                </li>
                            </ul>
                        </div>

                        {/* Footer Note */}
                        <div className="pt-4 border-t border-slate-100 text-xs text-slate-400 italic">
                            This simulation emphasizes consideration of ACS. In real practice, always follow local protocols and supervisors. Created as a teaching case by General Hospital.
                        </div>
                    </div>
                </div>

            </div>

            {/* RIGHT COLUMN: STATS & DISCUSSION (~35%) */}
            <div className="lg:col-span-4 space-y-6">
                
                {/* Stats Panel */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                    <h3 className="font-bold text-[#0A2342] mb-4 text-sm border-b border-slate-100 pb-2">Case Stats</h3>
                    
                    <div className="space-y-4">
                        <div>
                            <div className="text-xs text-slate-500 font-bold uppercase mb-1">Times Practiced</div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-[#0A2342]">142</span>
                                <span className="text-xs text-slate-400">in last 30 days</span>
                            </div>
                        </div>

                        <div>
                            <div className="text-xs text-slate-500 font-bold uppercase mb-1">Average Score</div>
                            <div className="flex items-baseline gap-2 mb-1">
                                <span className="text-2xl font-bold text-[#0A2342]">8.3</span>
                                <span className="text-xs text-slate-400">/ 10</span>
                            </div>
                            <div className="w-full h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                                <div className="bg-[#1CB5B2] h-full w-[83%] rounded-full"></div>
                            </div>
                        </div>

                        <div>
                            <div className="text-xs text-slate-500 font-bold uppercase mb-1">Discussion Activity</div>
                            <div className="flex items-center gap-2 text-sm text-slate-700 font-bold">
                                <MessageSquare className="w-4 h-4 text-[#1CB5B2]" /> 23 comments
                            </div>
                        </div>
                    </div>
                </div>

                {/* Discussion Thread */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden h-[600px]">
                    <div className="p-4 border-b border-slate-100">
                        <h3 className="font-bold text-[#0A2342] text-sm">Discussion</h3>
                        <p className="text-[10px] text-slate-400 mt-0.5">Share insights. No patient identifiers.</p>
                    </div>

                    {/* Composer */}
                    <div className="p-4 bg-slate-50 border-b border-slate-100">
                        <div className="flex gap-3">
                            <img src={currentUser.avatar} className="w-8 h-8 rounded-full" />
                            <div className="flex-1">
                                <textarea 
                                    value={commentInput}
                                    onChange={e => setCommentInput(e.target.value)}
                                    className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 outline-none focus:border-[#1CB5B2] resize-none h-16"
                                    placeholder="Add a comment..."
                                />
                                <div className="flex justify-end mt-2">
                                    <button 
                                        onClick={handlePostComment}
                                        disabled={!commentInput.trim()}
                                        className="bg-[#1CB5B2] text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:brightness-105 disabled:opacity-50"
                                    >
                                        Comment
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Comment List */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {comments.map(c => (
                            <div key={c.id} className="flex gap-3">
                                <img src={c.avatar} className="w-8 h-8 rounded-full border border-slate-100 shrink-0" />
                                <div>
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span className="text-xs font-bold text-[#0A2342]">{c.user}</span>
                                        <span className="text-[10px] text-slate-400">{c.role}</span>
                                        <span className="text-[10px] text-slate-300">• {c.time}</span>
                                    </div>
                                    <p className="text-xs text-slate-700 leading-relaxed">{c.text}</p>
                                    <div className="flex gap-3 mt-1.5">
                                        <button className="text-[10px] font-bold text-slate-400 hover:text-slate-600">Like ({c.likes})</button>
                                        <button className="text-[10px] font-bold text-slate-400 hover:text-slate-600">Reply</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Admin Controls */}
                <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                    <h3 className="font-bold text-[#0A2342] text-xs mb-3 flex items-center gap-2">
                        <Shield className="w-3 h-3" /> Admin Controls
                    </h3>
                    
                    <div className="space-y-3">
                        <p className="text-xs text-slate-500">Current visibility: <strong>{visibility === 'org' ? 'Org Only' : 'Global'}</strong></p>
                        
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="vis" 
                                    checked={visibility === 'org'} 
                                    onChange={() => setVisibility('org')}
                                    className="text-[#1CB5B2] focus:ring-[#1CB5B2]" 
                                />
                                <span className="text-xs text-slate-700">Internal only (General Hospital)</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="vis" 
                                    checked={visibility === 'global'} 
                                    onChange={() => setVisibility('global')}
                                    className="text-[#1CB5B2] focus:ring-[#1CB5B2]" 
                                />
                                <span className="text-xs text-slate-700">Global Network (Anonymized)</span>
                            </label>
                        </div>

                        {visibility === 'global' && (
                            <div className="bg-amber-50 p-2 rounded border border-amber-100 text-[10px] text-amber-800 flex gap-2">
                                <AlertTriangle className="w-3 h-3 shrink-0" />
                                Ensure no patient identifiers are present before saving.
                            </div>
                        )}

                        <button className="w-full border border-slate-300 bg-white text-slate-600 text-xs font-bold py-1.5 rounded hover:bg-slate-50">
                            Update Settings
                        </button>
                    </div>
                </div>

            </div>

        </div>
      </div>
    </div>
  );
};

export default CaseDetailView;