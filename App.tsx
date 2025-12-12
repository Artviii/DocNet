import React, { useState, useEffect, useRef } from 'react';
import { SCENARIOS, MOCK_USERS, MOCK_COMMUNITIES } from './constants';
import { ClinicalCase, Message, MessageSender, CaseCategory, Role, Difficulty, OptimalPathStep, SimulationScore, UserProfile } from './types';
import CaseCard from './components/CaseCard';
import PatientSidebar from './components/PatientSidebar';
import ChatInterface from './components/ChatInterface';
import OptimalPathViewer from './components/OptimalPathViewer';
import ScoreDashboard from './components/ScoreDashboard';
import CommunityView from './components/CommunityView';
import LeaderboardView from './components/LeaderboardView';
import LearningPathView from './components/LearningPathView';
import LandingPage from './components/LandingPage';
import CaseSetupModal from './components/CaseSetupModal';
import DoctorNotepad from './components/DoctorNotepad';
import JobsView from './components/JobsView';
import NetworkView from './components/NetworkView';
import CustomCaseBuilder from './components/CustomCaseBuilder';
import ProfileView from './components/ProfileView'; 
import MessagesView from './components/MessagesView'; 
import CaseDetailView from './components/CaseDetailView';
import { PatientSimulator } from './services/geminiService';
import { Stethoscope, Activity, Sparkles, Loader2, Search, Users, Trophy, LayoutGrid, Map, LogOut, Settings, Bell, X, Briefcase, Network, Home, MessageSquare, ChevronRight, User, BookOpen, Filter, ChevronDown, Plus, Building2 } from 'lucide-react';
import Logo from './components/Logo';

type ViewMode = 'landing' | 'community' | 'network' | 'jobs' | 'dashboard' | 'chat' | 'optimal_path' | 'score' | 'leaderboard' | 'learning_path' | 'create_case' | 'profile' | 'messages' | 'case_detail';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('landing');
  const [activeCase, setActiveCase] = useState<ClinicalCase | null>(null);
  const [caseList, setCaseList] = useState<ClinicalCase[]>(SCENARIOS || []); 
  
  // Navigation State
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [selectedMessageUserId, setSelectedMessageUserId] = useState<string | null>(null);
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | null>(null);
  const [selectedCaseDetail, setSelectedCaseDetail] = useState<ClinicalCase | null>(null);

  // Setup States
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [pendingCase, setPendingCase] = useState<ClinicalCase | null>(null);
  const [customProtocolFile, setCustomProtocolFile] = useState<{data: string, mime: string} | null>(null);
  
  // Filters
  const [filterRole, setFilterRole] = useState<Role | 'All'>('All');
  const [filterDifficulty, setFilterDifficulty] = useState<Difficulty | 'All'>('All');
  const [filterCategory, setFilterCategory] = useState<CaseCategory | 'All'>('All');
  const [filterView, setFilterView] = useState<'Assigned' | 'Communities' | 'Global' | 'MyCreated'>('Assigned');

  // Simulation State
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const [isLabProcessing, setIsLabProcessing] = useState(false);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [currentSessionCost, setCurrentSessionCost] = useState(0);
  const [optimalPath, setOptimalPath] = useState<OptimalPathStep[]>([]);
  const [scoreData, setScoreData] = useState<SimulationScore | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAutoPilotRunning, setIsAutoPilotRunning] = useState(false);
  
  // Handover State
  const [showHandover, setShowHandover] = useState(false);
  const [handoverNote, setHandoverNote] = useState('');
  
  // User Data
  const [completedCases, setCompletedCases] = useState<Record<string, number>>({});
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    id: 'u1', 
    name: 'Dr. Sarah Chen',
    headline: 'Chief Resident, Internal Medicine',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80',
    role: 'Doctor',
    totalScore: 12500,
    casesCompleted: 140,
    connections: ['u2', 'u3'],
    badges: ['Cardiology Expert'],
    communities: ['comm-1', 'comm-2'],
    experience: [],
    education: [],
    skills: []
  });

  const simulatorRef = useRef<PatientSimulator>(new PatientSimulator());
  
  useEffect(() => {
    const savedScores = localStorage.getItem('docNet_scores');
    if (savedScores) {
      try {
        const parsed = JSON.parse(savedScores);
        setCompletedCases(parsed);
        const scores = Object.values(parsed) as number[];
        const total = scores.reduce((a, b) => a + b, 0);
        setCurrentUser(prev => ({ ...prev, totalScore: total, casesCompleted: scores.length }));
      } catch (e) {
        console.error("Failed to load scores", e);
      }
    }
  }, []);

  // --- NEW AUTO PILOT LOGIC (REACTIVE) ---
  useEffect(() => {
      if (!isAutoPilotRunning || !isSessionActive) return;
      if (loadingMessage || isLabProcessing) return; 

      const lastMsg = messages[messages.length - 1];
      const shouldAiRespond = !lastMsg || lastMsg.sender === MessageSender.Patient || lastMsg.sender === MessageSender.System;

      if (shouldAiRespond) {
          executeAutoPilotTurn();
      }
  }, [messages, isAutoPilotRunning, isSessionActive, loadingMessage, isLabProcessing]);

  const executeAutoPilotTurn = async () => {
      setLoadingMessage("AI Doctor is thinking...");
      
      try {
          const historyText = messages.map(m => `[${m.sender.toUpperCase()}]: ${m.text}`).join('\n');
          const action = await simulatorRef.current.getAutoPilotAction(historyText);
          
          if (action.type === 'message') {
              await handleSendMessage(action.content, MessageSender.AutoPilot);
          
          } else if (action.type === 'order') {
              await handleOrderTest(action.content); 
          
          } else if (action.type === 'diagnosis') {
              setMessages(prev => [...prev, {
                  id: 'ai-doc-diag-' + Date.now(),
                  sender: MessageSender.AutoPilot,
                  text: `**FINAL DIAGNOSIS:** ${action.content}\n\n**REASONING:** ${action.reasoning}`,
                  timestamp: new Date()
              }]);
              setIsAutoPilotRunning(false);
              setIsSessionActive(false);
          }
      } catch (e) {
          console.error("AutoPilot Execution Error", e);
          setIsAutoPilotRunning(false);
          alert("Auto-Pilot stopped due to an error.");
      } finally {
          setLoadingMessage(null);
      }
  };

  const filteredCases = caseList.filter(scenario => {
    const roleMatch = filterRole === 'All' || scenario.role === filterRole;
    const diffMatch = filterDifficulty === 'All' || scenario.difficulty === filterDifficulty;
    const catMatch = filterCategory === 'All' || scenario.category === filterCategory;
    
    let viewMatch = true;
    if (filterView === 'MyCreated') viewMatch = scenario.authorId === currentUser.id;
    if (filterView === 'Communities') viewMatch = scenario.visibility === 'institution' || scenario.visibility === undefined; 
    if (filterView === 'Global') viewMatch = scenario.visibility === 'public';

    return roleMatch && diffMatch && catMatch && viewMatch;
  });

  const handleCaseClick = (scenario: ClinicalCase) => {
    setSelectedCaseDetail(scenario);
    setViewMode('case_detail');
  };

  const handlePracticeFromDetail = () => {
      if (selectedCaseDetail) {
          setPendingCase(selectedCaseDetail);
          setShowSetupModal(true);
      }
  };

  const handlePlayScenarioFromFeed = (caseId: string) => {
      const scenario = caseList.find(c => c.id === caseId);
      if (scenario) {
          handleCaseClick(scenario);
      } else {
          if (caseId === 'trauma-001') {
             const traumaCase = caseList.find(c => c.category === 'Trauma');
             if(traumaCase) handleCaseClick(traumaCase);
          } else {
             alert("This case is currently archived or unavailable.");
          }
      }
  };

  const handleNavigateProfile = (userId: string) => {
      setSelectedProfileId(userId);
      setViewMode('profile');
  };

  const handleNavigateCommunity = (communityId: string | null) => {
      setSelectedCommunityId(communityId);
      setViewMode('community');
  };

  const handleNavigateMessages = (userId?: string) => {
      if(userId) setSelectedMessageUserId(userId);
      setViewMode('messages');
  };

  const handleStartSession = async (difficulty: Difficulty, protocolFile: { data: string, mime: string } | null) => {
    if (!pendingCase) return;
    
    const configuredCase = { ...pendingCase, difficulty };
    setActiveCase(configuredCase);
    setCustomProtocolFile(protocolFile);
    
    setMessages([]);
    setOptimalPath([]);
    setScoreData(null);
    setCurrentSessionCost(0);
    setIsSessionActive(true);
    setIsAutoPilotRunning(false);
    setHandoverNote('');
    setShowHandover(false);
    setShowSetupModal(false);
    setViewMode('chat');
    setLoadingMessage("Initializing patient simulation...");
    
    try {
      const openingText = await simulatorRef.current.startSession(configuredCase);
      setMessages([{
        id: 'start-' + Date.now(),
        sender: MessageSender.Patient,
        text: openingText,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error(error);
      alert("Failed to start session.");
      setViewMode('dashboard');
    } finally {
      setLoadingMessage(null);
    }
  };

  const handleCreateCustomCase = async (desc: string, files: any[], vis: any) => {
      setIsGenerating(true);
      try {
          const newCase = await simulatorRef.current.createCustomCase(desc, files);
          newCase.visibility = vis;
          newCase.authorId = currentUser.id;
          setCaseList(prev => [newCase, ...prev]);
          alert(`Scenario created successfully! Added to your library.`);
          setViewMode('dashboard');
      } catch {
          alert("Failed to generate custom case.");
      } finally {
          setIsGenerating(false);
      }
  };

  const handleEndSessionTrigger = () => {
    setIsAutoPilotRunning(false); 
    setShowHandover(true);
  };

  const handleExitNoScore = () => {
      setIsAutoPilotRunning(false);
      setIsSessionActive(false);
      simulatorRef.current.endSession();
      setViewMode('dashboard');
  };

  const handleFinishHandover = async () => {
    setShowHandover(false);
    setIsSessionActive(false);
    
    setLoadingMessage("Expert AI is reasoning about your performance...");
    
    try {
        const score = await simulatorRef.current.evaluateSession(
            messages, 
            handoverNote, 
            customProtocolFile?.data,
            customProtocolFile?.mime
        );
        setScoreData(score);
        setViewMode('score');
        
        if (activeCase) {
           const newScores = { ...completedCases, [activeCase.id]: score.totalScore };
           setCompletedCases(newScores);
           localStorage.setItem('docNet_scores', JSON.stringify(newScores));
           const scoresArr = Object.values(newScores) as number[];
           setCurrentUser(prev => ({
             ...prev,
             totalScore: scoresArr.reduce((a, b) => a + b, 0),
             casesCompleted: scoresArr.length
           }));
        }
    } catch (e) {
        console.error(e);
        alert("Scoring failed.");
    } finally {
        setLoadingMessage(null);
    }
  };

  const handleSendMessage = async (text: string, sender: MessageSender = MessageSender.User) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      sender: sender,
      text: text,
      timestamp: new Date()
    }]);
    setLoadingMessage("Patient typing...");

    try {
      const responseText = await simulatorRef.current.sendMessage(text);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: MessageSender.Patient,
        text: responseText,
        timestamp: new Date()
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: MessageSender.System,
        text: "Connection lost.",
        timestamp: new Date()
      }]);
    } finally {
      setLoadingMessage(null);
    }
  };

  const toggleAutoPilot = () => {
      setIsAutoPilotRunning(!isAutoPilotRunning);
  };

  const handleOrderTest = async (testName: string) => {
    const cost = testName.toLowerCase().includes('ct') || testName.toLowerCase().includes('mri') ? 1200 : 150;
    setCurrentSessionCost(prev => prev + cost);

    const sender = isAutoPilotRunning ? MessageSender.AutoPilot : MessageSender.User;

    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      sender: sender, 
      text: `Ordering ${testName}...`,
      timestamp: new Date()
    }]);
    
    setIsLabProcessing(true);

    try {
      const { text, imageUrl } = await simulatorRef.current.runDiagnosticTest(testName);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: MessageSender.System,
        text: text,
        timestamp: new Date(),
        type: 'lab_result',
        imageUrl: imageUrl
      }]);
      await simulatorRef.current.submitDiagnosticResult(`Diagnostic Test: ${testName}\nResult: ${text}`);
    } finally {
      setIsLabProcessing(false);
    }
  };

  const handleAskTutor = async (question: string) => {
     const history = messages.map(m => `${m.sender}: ${m.text}`).join('\n');
     return await simulatorRef.current.askClinicalTutor(question, history);
  };

  const handleInterpretResult = async (result: string) => {
     setLoadingMessage("AI Doctor is thinking about findings...");
     const analysis = await simulatorRef.current.interpretDiagnosticResult(result);
     setMessages(prev => [...prev, {
        id: 'interp-' + Date.now(),
        sender: MessageSender.System,
        text: analysis,
        timestamp: new Date(),
        type: 'interpretation'
     }]);
     setLoadingMessage(null);
  };

  const handleNoteAnalysis = async (notes: string) => {
     return await simulatorRef.current.analyzeClinicalNotes(notes, customProtocolFile?.data);
  };

  const handleReflection = async (text: string) => {
      const history = messages.map(m => `${m.sender}: ${m.text}`).join('\n');
      return await simulatorRef.current.generateReflectionPrompt(history + `\nStudent Reflection: ${text}`);
  };

  // --- RENDER ---
  if (viewMode === 'landing') return <LandingPage onStart={() => setViewMode('community')} />;

  const myCommunities = MOCK_COMMUNITIES.filter(c => currentUser.communities?.includes(c.id));

  return (
    <div className="flex h-screen w-screen bg-[#F8FAFC] text-slate-900 overflow-hidden font-sans">
      
      {/* Sidebar Dock (Visible in App Mode, Hidden in Simulation) */}
      {viewMode !== 'chat' && (
        <aside className="hidden md:flex flex-col w-[280px] bg-[#020817] text-slate-300 transition-all duration-300 ease-in-out z-50 shadow-2xl overflow-hidden shrink-0">
          <div className="h-20 flex items-center px-6 transition-all border-b border-white/5">
             <div className="cursor-pointer flex items-center gap-3" onClick={() => { setViewMode('community'); setSelectedCommunityId(null); }}>
               <Logo className="w-8 h-8 text-[#1CB5B2]" light />
             </div>
          </div>

          <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto overflow-x-hidden scrollbar-hide">
            <div className="px-2 pb-2 pt-1 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Career & Network
            </div>
            <NavItem active={viewMode === 'community' && !selectedCommunityId} onClick={() => { setViewMode('community'); setSelectedCommunityId(null); }} icon={Home} label="Home Feed" />
            <NavItem active={viewMode === 'network'} onClick={() => setViewMode('network')} icon={Network} label="My Network" />
            <NavItem active={viewMode === 'jobs'} onClick={() => setViewMode('jobs')} icon={Briefcase} label="Jobs" />
            <NavItem active={viewMode === 'messages'} onClick={() => handleNavigateMessages()} icon={MessageSquare} label="Messages" />
            
            <div className="w-full h-px bg-[#1E293B] my-4 mx-2"></div>

            {myCommunities.length > 0 && (
                <>
                    <div className="px-2 pb-2 pt-1 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                        Your Communities
                    </div>
                    {myCommunities.map(comm => (
                        <NavItem 
                            key={comm.id}
                            active={viewMode === 'community' && selectedCommunityId === comm.id} 
                            onClick={() => handleNavigateCommunity(comm.id)} 
                            icon={Building2} 
                            label={comm.name} 
                        />
                    ))}
                    <div className="w-full h-px bg-[#1E293B] my-4 mx-2"></div>
                </>
            )}

            <div className="px-2 pt-1 pb-2 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
               Clinical Tools
            </div>
            
            <NavItem active={viewMode === 'dashboard'} onClick={() => setViewMode('dashboard')} icon={Stethoscope} label="Case Simulator" />
            <NavItem active={viewMode === 'learning_path'} onClick={() => setViewMode('learning_path')} icon={BookOpen} label="Curriculum" />
            <NavItem active={viewMode === 'leaderboard'} onClick={() => setViewMode('leaderboard')} icon={Trophy} label="Rankings" />
          </nav>

          <div className="p-4">
             <div className="bg-[#020B1A] rounded-t-xl p-4 border-t border-white/5 cursor-pointer hover:bg-white/5 transition-colors group" onClick={() => handleNavigateProfile(currentUser.id)}>
                <div className="flex items-center gap-3 mb-3">
                   <img src={currentUser.avatar} className="w-10 h-10 rounded-full border border-white/10 object-cover" />
                   <div className="overflow-hidden">
                      <div className="text-sm font-bold text-white truncate">{currentUser.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{currentUser.headline || currentUser.role}</div>
                   </div>
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-400 mb-2">
                   <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {currentUser.connections.length} Connections</span>
                   <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {currentUser.casesCompleted} Cases</span>
                </div>
                <div className="text-xs text-[#1CB5B2] font-bold group-hover:underline">View profile →</div>
             </div>
          </div>
        </aside>
      )}

      {/* Content Render Logic */}
      {viewMode === 'chat' && activeCase ? (
         <>
           <div className="flex-1 h-full w-full relative overflow-hidden flex flex-col bg-[#F8FAFC]">
              <ChatInterface 
                  messages={messages} 
                  patientName={activeCase.patientName}
                  activeCase={activeCase}
                  onSendMessage={(txt) => handleSendMessage(txt, MessageSender.User)}
                  onOrderTest={handleOrderTest}
                  onEndSession={handleEndSessionTrigger}
                  onInterpretResult={handleInterpretResult}
                  onAskTutor={handleAskTutor}
                  onAutoPlay={toggleAutoPilot}
                  loadingMessage={loadingMessage}
                  isSessionActive={isSessionActive}
                  currentCost={currentSessionCost}
                  isLabProcessing={isLabProcessing}
                  onExitNoScore={handleExitNoScore}
                  isAutoPilotRunning={isAutoPilotRunning}
              />
           </div>
         </>
      ) : (
         <main className="flex-1 h-full relative overflow-hidden flex flex-col bg-[#F8FAFC]">
            {viewMode !== 'community' && (
                <div className="h-16 bg-white border-b border-slate-200 flex justify-between items-center px-8 sticky top-0 z-30 shrink-0">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-bold text-[#0A2342] capitalize flex items-center gap-2">
                        {viewMode === 'profile' ? 'Profile' : viewMode === 'dashboard' ? 'Simulator' : viewMode.replace('_', ' ')}
                    </h2>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={() => handleNavigateMessages()} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full relative">
                        <MessageSquare className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-[#F97362] rounded-full border-2 border-white"></span>
                    </button>
                </div>
                </div>
            )}

            <div className="flex-1 overflow-hidden relative">
                {viewMode === 'community' && (
                    <CommunityView 
                        cases={caseList} 
                        currentUser={currentUser} 
                        onPlayScenario={handlePlayScenarioFromFeed}
                        onNavigateProfile={handleNavigateProfile}
                        onNavigateJobs={() => setViewMode('jobs')}
                        selectedCommunityId={selectedCommunityId}
                        onNavigateCommunity={handleNavigateCommunity}
                    />
                )}
                {viewMode === 'network' && (
                    <NetworkView 
                        currentUser={currentUser} 
                        onNavigateCommunity={handleNavigateCommunity}
                    />
                )}
                {viewMode === 'jobs' && (
                    <JobsView 
                        currentUser={currentUser} 
                        onPlayScenario={handlePlayScenarioFromFeed}
                    />
                )}
                {viewMode === 'messages' && <MessagesView currentUser={currentUser} initialSelectedUserId={selectedMessageUserId || undefined} />}
                
                {viewMode === 'profile' && selectedProfileId && (
                    <ProfileView 
                        user={MOCK_USERS.find(u => u.id === selectedProfileId) || currentUser} 
                        currentUser={currentUser} 
                        onNavigateMessage={handleNavigateMessages}
                    />
                )}

                {viewMode === 'case_detail' && selectedCaseDetail && (
                    <CaseDetailView 
                        scenario={selectedCaseDetail} 
                        currentUser={currentUser}
                        onBack={() => setViewMode('dashboard')}
                        onPractice={handlePracticeFromDetail}
                        isCompleted={!!completedCases[selectedCaseDetail.id]} 
                    />
                )}

                {viewMode === 'dashboard' && (
                  <Dashboard 
                      cases={filteredCases} 
                      completedCases={completedCases}
                      onSelect={handleCaseClick}
                      onCreate={() => setViewMode('create_case')}
                      filters={{
                        role: filterRole, setRole: setFilterRole,
                        diff: filterDifficulty, setDiff: setFilterDifficulty,
                        cat: filterCategory, setCat: setFilterCategory,
                        view: filterView, setView: setFilterView
                      }}
                  />
                )}
                {viewMode === 'score' && scoreData && (
                   <ScoreDashboard 
                      scoreData={scoreData} 
                      onExit={() => {simulatorRef.current.endSession(); setViewMode('community');}} 
                      onReflect={handleReflection} 
                   />
                )}
                {viewMode === 'leaderboard' && <LeaderboardView currentUser={currentUser} />}
                {viewMode === 'learning_path' && <LearningPathView cases={caseList} completedCases={completedCases} onSelectCase={handleCaseClick} />}
                {viewMode === 'create_case' && <CustomCaseBuilder onGenerate={handleCreateCustomCase} onCancel={() => setViewMode('dashboard')} isGenerating={isGenerating} />}
            </div>
         </main>
      )}

      {showSetupModal && pendingCase && (
        <CaseSetupModal 
          scenario={pendingCase} 
          onStart={handleStartSession} 
          onCancel={() => setShowSetupModal(false)} 
        />
      )}

      {showHandover && (
        <div className="fixed inset-0 z-[60] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
           <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95">
              <div className="bg-[#0A2342] px-6 py-4 flex justify-between items-center text-white">
                 <h2 className="text-lg font-bold flex items-center gap-2"><Activity className="w-5 h-5" /> Case Summary</h2>
                 <button onClick={() => setShowHandover(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6">
                 <p className="text-slate-600 mb-4 text-sm">
                   Summarize the case for the next doctor (SBAR format).
                 </p>
                 <textarea 
                   className="w-full h-48 border border-slate-300 rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#1CB5B2] outline-none resize-none bg-slate-50"
                   placeholder="Situation, Background, Assessment, Recommendation..."
                   value={handoverNote}
                   onChange={(e) => setHandoverNote(e.target.value)}
                 />
                 <div className="mt-6 flex justify-between items-center">
                    <button onClick={handleFinishHandover} className="text-slate-500 hover:text-[#1CB5B2] text-sm font-bold">Skip & Get Score</button>
                    <div className="flex gap-3">
                        <button onClick={() => setShowHandover(false)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg">Resume</button>
                        <button 
                        onClick={handleFinishHandover}
                        disabled={handoverNote.length < 5}
                        className="px-6 py-2 bg-[#1CB5B2] text-white font-bold rounded-lg hover:brightness-95 disabled:opacity-50"
                        >
                        Submit Report
                        </button>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

const NavItem = ({ active, onClick, icon: Icon, label }: any) => (
  <button onClick={onClick} className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${active ? 'bg-[#0B1730] border-l-4 border-[#1CB5B2] text-white shadow-md' : 'text-[#CBD5F5] hover:bg-[#0B1730] hover:text-white border-l-4 border-transparent'}`}>
     <Icon className={`w-5 h-5 shrink-0 ${active ? 'text-[#1CB5B2]' : 'text-slate-400'}`} />
     <span className="ml-3 font-medium text-sm truncate">{label}</span>
  </button>
);

const Dashboard = ({ cases, completedCases, onSelect, onCreate, filters }: any) => (
  <div className="h-full overflow-y-auto p-8 bg-[#F8FAFC]">
     <div className="max-w-[1120px] mx-auto">
        
        <div className="flex justify-between items-start mb-6">
            <div>
                <h1 className="text-3xl font-bold text-[#0A2342]">Case Simulator</h1>
                <p className="text-[#64748B] text-sm mt-1">Select a patient scenario to begin practice.</p>
            </div>
            <button 
                onClick={onCreate}
                className="bg-[#1CB5B2] text-white px-6 py-3 rounded-xl font-bold hover:brightness-105 transition-all shadow-md shadow-teal-500/20 flex items-center gap-2"
            >
                <Plus className="w-5 h-5" /> Create Scenario
            </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8 py-3 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#64748B]">View:</span>
                <div className="relative">
                    <select 
                        value={filters.view}
                        onChange={(e) => filters.setView(e.target.value)}
                        className="appearance-none bg-white border border-[#1CB5B2] text-[#1CB5B2] text-xs font-bold rounded-lg pl-3 pr-8 py-2 cursor-pointer focus:ring-2 focus:ring-teal-100 outline-none"
                    >
                        <option value="Assigned">Assigned to me</option>
                        <option value="Communities">My communities</option>
                        <option value="Global">Global library</option>
                        <option value="MyCreated">My created scenarios</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#1CB5B2] pointer-events-none" />
                </div>
            </div>

            <div className="h-8 w-px bg-[#E2E8F0] hidden md:block"></div>

            <div className="flex flex-wrap gap-3">
                <select value={filters.role} onChange={(e) => filters.setRole(e.target.value)} className="bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs font-bold text-[#0A2342] focus:border-[#1CB5B2] outline-none">
                    <option value="All">All roles</option>
                    <option value="Doctor">Doctor</option>
                    <option value="Nurse">Nurse</option>
                    <option value="Paramedic">Paramedic</option>
                </select>
                <select value={filters.cat} onChange={(e) => filters.setCat(e.target.value)} className="bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs font-bold text-[#0A2342] focus:border-[#1CB5B2] outline-none">
                    <option value="All">All specialties</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Trauma">Trauma</option>
                    <option value="Infectious Disease">Infectious Disease</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="Rheumatology">Rheumatology</option>
                </select>
                <select value={filters.diff} onChange={(e) => filters.setDiff(e.target.value)} className="bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs font-bold text-[#0A2342] focus:border-[#1CB5B2] outline-none">
                    <option value="All">All levels</option>
                    <option value="Novice">Novice</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                </select>
            </div>
            
            <button 
                onClick={() => { filters.setRole('All'); filters.setCat('All'); filters.setDiff('All'); }}
                className="ml-auto text-xs font-bold text-[#1CB5B2] hover:underline"
            >
                Reset filters
            </button>
        </div>

        {cases.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 pb-20">
                {cases.map((c: ClinicalCase) => (
                    <CaseCard 
                        key={c.id} 
                        scenario={c} 
                        onSelect={onSelect} 
                        highScore={completedCases[c.id]} 
                    />
                ))}
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-[#E2E8F0] rounded-2xl bg-slate-50">
                <Search className="w-8 h-8 text-slate-300 mb-4" />
                <h3 className="text-[#0A2342] font-bold text-lg">No scenarios found</h3>
                <p className="text-[#64748B] text-sm mt-1">Try adjusting your filters or create a new scenario.</p>
                <button onClick={onCreate} className="mt-4 text-[#1CB5B2] font-bold text-sm hover:underline">Create Scenario</button>
            </div>
        )}
     </div>
  </div>
);

export default App;