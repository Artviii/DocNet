import React, { useState, useEffect, useRef } from 'react';
import { OptimalPathStep } from '../types';
import { Brain, Play, Pause, FastForward, CheckCircle2, User, Stethoscope, Beaker, FileText, Bot, ArrowRight, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface OptimalPathViewerProps {
  steps: OptimalPathStep[];
  onComplete: () => void;
}

const OptimalPathViewer: React.FC<OptimalPathViewerProps> = ({ steps, onComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new steps are revealed
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentStepIndex]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying && currentStepIndex < steps.length) {
      // Dynamic timing: Read speed based on text length, but faster
      const currentStep = steps[currentStepIndex];
      const readTime = Math.max(1500, (currentStep?.content.length || 0) * 15); 
      
      interval = setInterval(() => {
        setCurrentStepIndex(prev => prev + 1);
      }, readTime);
    } else if (currentStepIndex >= steps.length) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStepIndex, steps]);

  const visibleSteps = steps.slice(0, currentStepIndex + 1);
  const isFinished = currentStepIndex >= steps.length;

  return (
    <div className="flex flex-col h-full bg-slate-950 relative overflow-hidden font-sans">
      
      {/* Header: AI Simulation Mode */}
      <div className="bg-slate-900 border-b border-slate-800 h-16 flex justify-between items-center px-6 shadow-md z-10">
        <div className="flex items-center gap-3">
           <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
             <Bot className="w-5 h-5 text-indigo-400" />
           </div>
           <div>
             <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
               AI Simulation Mode <span className="animate-pulse w-2 h-2 rounded-full bg-indigo-500"></span>
             </h2>
             <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Optimized Clinical Path</p>
           </div>
        </div>

        <div className="flex items-center gap-2">
           {!isFinished && (
             <button 
               onClick={() => setIsPlaying(!isPlaying)}
               className="text-slate-400 hover:text-white transition-colors p-2"
             >
               {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
             </button>
           )}
           <button 
             onClick={() => setCurrentStepIndex(steps.length)} // Skip to end
             className="text-indigo-400 text-xs font-bold hover:text-indigo-300 transition-colors uppercase tracking-wider px-3 py-1 border border-indigo-500/30 rounded-full"
           >
             {isFinished ? 'Simulation Complete' : 'Skip Forward'}
           </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scrollbar-hide">
        {visibleSteps.map((step, idx) => {
          
          // Render Logic based on Step Type
          switch (step.type) {
            case 'thought':
              return (
                <div key={idx} className="flex justify-center w-full animate-in fade-in slide-in-from-bottom-2">
                  <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl max-w-2xl w-full flex gap-4">
                    <div className="mt-1">
                      <Brain className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">Clinical Reasoning</p>
                      <p className="text-slate-300 text-sm italic leading-relaxed">
                        {step.content}
                      </p>
                      {step.reasoning && (
                         <div className="mt-2 text-xs text-slate-500 border-t border-slate-800 pt-2">
                           Logic: {step.reasoning}
                         </div>
                      )}
                    </div>
                  </div>
                </div>
              );

            case 'question': // AI Doctor Speaking
              return (
                <div key={idx} className="flex w-full justify-end animate-in fade-in slide-in-from-right-2">
                  <div className="flex max-w-[85%] md:max-w-[70%] gap-3 flex-row-reverse">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm bg-indigo-600 border border-indigo-500 text-white">
                      <Stethoscope className="w-5 h-5" />
                    </div>
                    <div className="bg-indigo-600/90 text-white p-4 rounded-2xl rounded-tr-none shadow-sm relative">
                       <span className="text-[10px] font-bold uppercase tracking-wider absolute -top-5 right-1 text-slate-500">AI Doctor</span>
                       <p className="text-sm md:text-base leading-relaxed">{step.content}</p>
                    </div>
                  </div>
                </div>
              );

            case 'patient_answer': // Patient Response
              return (
                <div key={idx} className="flex w-full justify-start animate-in fade-in slide-in-from-left-2">
                  <div className="flex max-w-[85%] md:max-w-[70%] gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm bg-slate-800 border border-slate-700 text-slate-400">
                      <User className="w-5 h-5" />
                    </div>
                    <div className="bg-slate-800 text-slate-200 border border-slate-700 p-4 rounded-2xl rounded-tl-none shadow-sm relative">
                       <span className="text-[10px] font-bold uppercase tracking-wider absolute -top-5 left-1 text-slate-500">Patient</span>
                       <p className="text-sm md:text-base leading-relaxed">{step.content}</p>
                    </div>
                  </div>
                </div>
              );

            case 'order_test':
              return (
                <div key={idx} className="flex justify-center w-full animate-in zoom-in-95">
                   <div className="flex items-center gap-2 bg-teal-900/30 text-teal-300 border border-teal-800/50 px-4 py-2 rounded-full text-sm font-medium">
                      <Beaker className="w-4 h-4" />
                      Ordered: {step.content}
                   </div>
                </div>
              );

            case 'test_result':
              return (
                 <div key={idx} className="flex justify-center my-4 w-full px-2 animate-in fade-in slide-in-from-bottom-4">
                   <div className="rounded-lg p-5 max-w-2xl w-full bg-slate-900 border border-l-4 border-slate-800 border-l-teal-500">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-400 mb-3">
                         <FileText className="w-4 h-4" />
                         Diagnostic Result
                      </div>
                      <div className="prose prose-sm prose-invert max-w-none font-mono text-slate-300">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{step.content}</ReactMarkdown>
                      </div>
                   </div>
                 </div>
              );

            case 'diagnosis':
              return (
                <div key={idx} className="flex justify-center w-full my-6 animate-in zoom-in-95">
                  <div className="bg-green-900/20 border border-green-500/50 p-6 rounded-xl max-w-lg w-full text-center">
                    <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg shadow-green-900/50">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h3 className="text-green-400 font-bold text-lg mb-2">Final Diagnosis</h3>
                    <p className="text-white text-xl font-bold">{step.content}</p>
                  </div>
                </div>
              );
              
            default:
              return null;
          }
        })}
        
        {/* Footer Actions */}
        {isFinished && (
           <div className="flex justify-center py-8 pb-12">
             <button 
               onClick={onComplete}
               className="bg-white hover:bg-slate-200 text-slate-900 px-8 py-3 rounded-full font-bold shadow-xl shadow-indigo-900/20 flex items-center gap-2 transition-all transform hover:scale-105 animate-bounce"
             >
               View Final Score Report <ArrowRight className="w-5 h-5" />
             </button>
           </div>
        )}
        <div ref={scrollRef} />
      </div>
    </div>
  );
};

export default OptimalPathViewer;
