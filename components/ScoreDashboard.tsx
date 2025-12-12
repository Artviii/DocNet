import React, { useState } from 'react';
import { SimulationScore, TimelineEvent } from '../types';
import { BADGES } from '../constants';
import { TrendingUp, AlertCircle, Check, X, Award, Stethoscope, Heart, ClipboardCheck, ArrowRight, Brain, RotateCcw, Share2, Zap, Search, Beaker, Info, ShieldCheck } from 'lucide-react';

interface ScoreDashboardProps {
  scoreData: SimulationScore;
  onExit: () => void;
  onReflect: (response: string) => Promise<string>;
}

const ScoreDashboard: React.FC<ScoreDashboardProps> = ({ scoreData, onExit, onReflect }) => {
  const [step, setStep] = useState<'reflection' | 'score'>('reflection');
  
  // Reflection State
  const [reflectionInput, setReflectionInput] = useState('');
  const [reflectionChat, setReflectionChat] = useState<{sender: 'ai'|'user', text: string}[]>([
      { sender: 'ai', text: "Great work completing the case. Before we see the results, how do you think that went? What was your biggest challenge?" }
  ]);
  const [reflectionDone, setReflectionDone] = useState(false);

  const handleSendReflection = async () => {
      if(!reflectionInput.trim()) return;
      const userText = reflectionInput;
      setReflectionChat(prev => [...prev, { sender: 'user', text: userText }]);
      setReflectionInput('');
      
      // Simulate generic encouraging response for speed, or call API
      setTimeout(() => {
          setReflectionChat(prev => [...prev, { sender: 'ai', text: "Thanks for sharing. Self-reflection is key to clinical growth. Let's look at your objective performance now." }]);
          setReflectionDone(true);
      }, 800);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-500 border-emerald-500';
    if (score >= 70) return 'text-amber-500 border-amber-500';
    return 'text-rose-500 border-rose-500';
  };

  // Only award badges based on actual performance
  const earnedBadges = BADGES.filter(b => {
      // Logic for earning badges
      if (b.id === 'b1' && scoreData.accuracyScore > 90) return true; // Master Diagnostician
      if (b.id === 'b2' && scoreData.communicationScore > 95) return true; // Empathy Expert
      if (b.id === 'b5' && scoreData.efficiencyScore > 90) return true; // Cost Saver
      // Add other conditions as needed
      return false;
  });

  // --- STEP 1: REFLECTION COACH (DARK MODE) ---
  if (step === 'reflection') {
      return (
          <div className="fixed inset-0 z-50 bg-[#020617] flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                  {/* Header */}
                  <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                              <Brain className="w-4 h-4" />
                          </div>
                          <h2 className="text-lg font-bold text-[#0A2342]">Reflection Coach</h2>
                      </div>
                      <button onClick={() => setStep('score')} className="text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors">
                          Skip to results
                      </button>
                  </div>
                  
                  {/* Chat Area */}
                  <div className="p-6 h-80 overflow-y-auto space-y-4 bg-slate-50">
                      {reflectionChat.map((msg, i) => (
                          <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[85%] p-3 rounded-xl text-sm leading-relaxed ${
                                  msg.sender === 'ai' 
                                  ? 'bg-white border border-slate-200 text-slate-700 rounded-tl-none' 
                                  : 'bg-indigo-600 text-white rounded-tr-none'
                              }`}>
                                  {msg.text}
                              </div>
                          </div>
                      ))}
                  </div>

                  {/* Input Footer */}
                  <div className="p-4 bg-white border-t border-slate-100">
                      {!reflectionDone ? (
                          <div className="flex gap-2">
                              <input 
                                 value={reflectionInput} 
                                 onChange={e => setReflectionInput(e.target.value)}
                                 onKeyDown={e => e.key === 'Enter' && handleSendReflection()}
                                 className="flex-1 border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                                 placeholder="Type your thoughts..."
                                 autoFocus
                              />
                              <button onClick={handleSendReflection} className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors">Send</button>
                          </div>
                      ) : (
                          <button 
                              onClick={() => setStep('score')} 
                              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 shadow-lg transition-all animate-in fade-in slide-in-from-bottom-2"
                          >
                              See Performance Report <ArrowRight className="w-4 h-4" />
                          </button>
                      )}
                      <p className="text-[10px] text-center text-slate-400 mt-3">Reflections are private by default.</p>
                  </div>
              </div>
          </div>
      );
  }

  // --- STEP 2: PERFORMANCE REPORT (APP LAYOUT) ---
  return (
    <div className="h-full bg-[#F8FAFC] p-6 md:p-10 overflow-y-auto font-sans">
      <div className="max-w-[1120px] mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end pb-6 border-b border-slate-200">
           <div>
             <h1 className="text-3xl font-bold text-[#0A2342]">Performance Report</h1>
             <p className="text-[#64748B] text-sm mt-1 flex items-center gap-2">
                Session ID: #{Math.floor(Date.now() / 1000)} <span className="w-1 h-1 rounded-full bg-slate-300"></span> Educational Simulation
             </p>
           </div>
           <button 
             onClick={onExit}
             className="mt-4 md:mt-0 bg-[#0A2342] text-white px-6 py-2.5 rounded-lg font-bold hover:bg-[#152e52] transition-colors text-sm shadow-md"
           >
             Back to Cases
           </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT COLUMN (Scores & Analysis) */}
            <div className="lg:col-span-2 space-y-8">
                
                {/* 1. Score Summary Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col md:flex-row items-center gap-10">
                    {/* Donut */}
                    <div className={`relative w-40 h-40 rounded-full border-[8px] flex items-center justify-center shrink-0 ${getScoreColor(scoreData.totalScore)}`}>
                        <div className="text-center">
                            <span className={`text-5xl font-black block leading-none ${getScoreColor(scoreData.totalScore).split(' ')[0]}`}>
                                {scoreData.totalScore}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Total Score</span>
                        </div>
                    </div>

                    {/* Bars */}
                    <div className="flex-1 w-full space-y-5">
                        {[
                            { label: 'Diagnostic Knowledge', score: scoreData.accuracyScore, color: 'bg-emerald-500' },
                            { label: 'Efficiency & Cost', score: scoreData.efficiencyScore, color: 'bg-indigo-500' },
                            { label: 'Empathy & Bedside', score: scoreData.communicationScore, color: 'bg-rose-500' }
                        ].map((metric, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between items-center mb-1.5">
                                    <span className="text-sm font-bold text-[#0A2342] flex items-center gap-1.5">
                                        {metric.label} <Info className="w-3 h-3 text-slate-300 cursor-help" />
                                    </span>
                                    <span className="text-sm font-bold text-slate-600">{metric.score}%</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                    <div className={`h-full rounded-full ${metric.color}`} style={{ width: `${metric.score}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. Diagnosis & Handover */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Diagnosis */}
                    <div className={`p-6 rounded-2xl border flex items-start gap-4 ${scoreData.diagnosisCorrect ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
                        <div className={`mt-1 p-2 rounded-full shrink-0 ${scoreData.diagnosisCorrect ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                            {scoreData.diagnosisCorrect ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                        </div>
                        <div>
                            <h3 className={`font-bold text-sm uppercase tracking-wider mb-2 ${scoreData.diagnosisCorrect ? 'text-emerald-800' : 'text-rose-800'}`}>
                                {scoreData.diagnosisCorrect ? 'Correct Diagnosis' : 'Incorrect Diagnosis'}
                            </h3>
                            <div className="space-y-1 text-sm">
                                <p className="text-slate-600">Your Dx: <strong className="text-slate-900">{scoreData.userDiagnosis}</strong></p>
                                <p className="text-slate-600">Correct: <strong className="text-slate-900">{scoreData.actualDiagnosis}</strong></p>
                            </div>
                        </div>
                    </div>

                    {/* Handover */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200">
                        <div className="flex items-center gap-2 mb-3">
                            <ClipboardCheck className="w-5 h-5 text-indigo-500" />
                            <h3 className="font-bold text-[#0A2342] text-sm uppercase tracking-wide">Handover Feedback</h3>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed italic">"{scoreData.handoverFeedback}"</p>
                        <div className="mt-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Simulation Feedback · Not Graded</div>
                    </div>
                </div>

                {/* 3. Diagnostic Order Analysis */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-[#0A2342] flex items-center gap-2">
                            <Beaker className="w-5 h-5 text-[#1CB5B2]" /> Diagnostic Order Analysis
                        </h3>
                        <span className="text-xs font-mono font-bold text-slate-500">Total Bill: ${scoreData.totalBill.toLocaleString()}</span>
                    </div>
                    
                    {scoreData.billBreakdown && scoreData.billBreakdown.length > 0 ? (
                        <div className="space-y-4">
                            {scoreData.billBreakdown.map((item, idx) => (
                                <div key={idx} className={`flex items-start gap-4 p-4 rounded-xl border ${item.isNecessary ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
                                    <div className={`p-2 rounded-full shrink-0 ${item.isNecessary ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                                        {item.isNecessary ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between">
                                            <span className={`font-bold text-sm ${item.isNecessary ? 'text-emerald-900' : 'text-rose-900'}`}>{item.item}</span>
                                            <span className="text-xs font-mono text-slate-500 font-bold">${item.cost}</span>
                                        </div>
                                        <p className={`text-xs mt-1 leading-relaxed ${item.isNecessary ? 'text-emerald-700' : 'text-rose-700'}`}>
                                            {item.notes || (item.isNecessary ? "This test was clinically indicated." : "This test was unnecessary or low-value for this presentation.")}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 bg-slate-50 rounded-xl border border-slate-200 border-dashed text-slate-400 text-sm">
                            No manual test orders were recorded for you.
                        </div>
                    )}
                </div>

                {/* 4. Recommended Next Steps */}
                <div className="bg-[#1CB5B2] rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-teal-400 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none opacity-20"></div>
                    
                    <h3 className="font-bold text-lg mb-6 flex items-center gap-2 relative z-10">
                        <TrendingUp className="w-5 h-5 text-white"/> Recommended Next Steps
                    </h3>
                    
                    <div className="space-y-4 relative z-10">
                        {scoreData.nextRecommendedSteps?.map((step, i) => (
                            <div key={i} className="flex gap-4 items-start group cursor-pointer">
                                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-white/30 text-white">
                                    {i+1}
                                </div>
                                <p className="text-sm text-white/90 group-hover:text-white transition-colors leading-relaxed font-medium">
                                    {step}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* RIGHT COLUMN (Badges & Context) */}
            <div className="space-y-8">
                
                {/* Badges Card */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <h3 className="font-bold text-[#0A2342] mb-6 flex items-center gap-2 text-sm uppercase tracking-wide">
                        <Award className="w-4 h-4 text-amber-500"/> Badges Earned
                    </h3>
                    
                    {earnedBadges.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4 mb-6">
                            {earnedBadges.map(badge => (
                                <div key={badge.id} className="flex items-center gap-4 p-4 bg-[#FFFBEB] rounded-xl border border-[#FEF3C7]">
                                    <div className="text-3xl">{badge.icon}</div>
                                    <div>
                                        <div className="font-bold text-sm text-[#92400E]">{badge.name}</div>
                                        <div className="text-[10px] text-[#B45309] font-medium uppercase tracking-wide">{badge.condition}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-6 bg-slate-50 rounded-xl border border-slate-100 text-slate-400 text-xs italic mb-4">
                            No badges earned this round. Improve your score to unlock achievements!
                        </div>
                    )}

                    <button 
                        onClick={() => earnedBadges.length > 0 && alert("Shared to Feed!")} 
                        disabled={earnedBadges.length === 0}
                        className="w-full bg-[#F8FAFC] text-[#1CB5B2] border border-[#1CB5B2] py-3 rounded-xl font-bold text-sm hover:bg-[#E0F7F6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                        <Share2 className="w-4 h-4" /> Share to Feed
                    </button>
                </div>

                {/* Badge Directory */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <h3 className="font-bold text-slate-400 mb-4 text-xs uppercase tracking-wider">Badge Directory</h3>
                    <div className="space-y-4">
                        {BADGES.map(badge => (
                            <div key={badge.id} className="flex items-start gap-3 opacity-60 hover:opacity-100 transition-opacity">
                                <div className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full text-lg grayscale">{badge.icon}</div>
                                <div>
                                    <div className="text-xs font-bold text-slate-700">{badge.name}</div>
                                    <div className="text-[10px] text-slate-400 leading-tight mt-0.5">{badge.description}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

        </div>

        {/* Safety Footer */}
        <div className="text-center pt-8 border-t border-slate-200 mt-8">
            <p className="text-xs text-slate-400 font-medium flex items-center justify-center gap-2">
                <ShieldCheck className="w-3 h-3" /> Performance reports are for educational purposes only. Not for clinical certification.
            </p>
        </div>

      </div>
    </div>
  );
};

export default ScoreDashboard;