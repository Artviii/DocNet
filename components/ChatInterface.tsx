import React, { useState, useRef, useEffect } from 'react';
import { Message, MessageSender, ClinicalCase } from '../types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import PatientSidebar from './PatientSidebar';
import { Send, User, Bot, Loader2, ArrowLeft, Beaker, FileText, X, Droplet, Activity, Heart, Image, GraduationCap, Plus, Mic, MicOff, Volume2, VolumeX, Zap, Stethoscope, Sparkles, ChevronRight, Info, LogOut, Clock, Scan, ArrowRight, ZoomIn } from 'lucide-react';

interface ChatInterfaceProps {
  messages: Message[];
  patientName: string;
  activeCase: ClinicalCase;
  onSendMessage: (text: string) => void;
  onOrderTest: (testName: string) => void;
  onEndSession: () => void;
  onInterpretResult: (resultText: string) => void;
  onAskTutor: (question: string) => Promise<string>;
  onAutoPlay: () => void;
  loadingMessage: string | null;
  isSessionActive: boolean;
  currentCost: number;
  isLabProcessing?: boolean;
  onExitNoScore: () => void;
  isAutoPilotRunning: boolean;
}

const QUICK_TESTS = [
  { name: 'CBC', id: 'cbc', icon: Droplet, color: 'text-red-600 border-red-200 bg-red-50' },
  { name: 'BMP', id: 'bmp', icon: Beaker, color: 'text-blue-600 border-blue-200 bg-blue-50' },
  { name: 'ECG', id: 'ecg', icon: Activity, color: 'text-emerald-600 border-emerald-200 bg-emerald-50' },
  { name: 'CXR', id: 'cxr', icon: Image, color: 'text-slate-600 border-slate-200 bg-slate-50' },
  { name: 'Trop', id: 'trop', icon: Heart, color: 'text-rose-600 border-rose-200 bg-rose-50' },
];

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  messages, 
  patientName,
  activeCase,
  onSendMessage, 
  onOrderTest,
  onEndSession,
  onInterpretResult,
  onAskTutor,
  onAutoPlay,
  loadingMessage,
  isSessionActive,
  currentCost,
  isLabProcessing = false,
  onExitNoScore,
  isAutoPilotRunning
}) => {
  const [input, setInput] = useState('');
  const [showCustomOrder, setShowCustomOrder] = useState(false);
  const [testInput, setTestInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // For lightbox
  
  // Voice State
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Time Pressure State
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-Speak Effect
  useEffect(() => {
    if (voiceEnabled && messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.sender === MessageSender.Patient) {
        speak(lastMsg.text);
      }
    }
  }, [messages, voiceEnabled]);

  // Timer Effect
  useEffect(() => {
    if (isSessionActive && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [isSessionActive, timeLeft]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loadingMessage, isLabProcessing]);

  // --- Voice Handlers ---
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Browser does not support voice input. Try Chrome.");
      return;
    }
    const SpeechRecognition = (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop previous
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loadingMessage || !isSessionActive) return;
    onSendMessage(input);
    setInput('');
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testInput.trim()) return;
    onOrderTest(testInput);
    setTestInput('');
    setShowCustomOrder(false);
  };

  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] overflow-hidden font-sans">
      
      {/* 1. LEFT PANEL (Fixed) */}
      <PatientSidebar activeCase={activeCase} />

      {/* 2. CENTER STAGE (Main Content) */}
      <div className="flex-1 flex flex-col h-full relative min-w-0">
          
          {/* 2.1 Top Encounter Bar */}
          <header className="h-16 bg-white border-b border-slate-200 flex justify-between items-center px-6 shrink-0 z-20 shadow-sm">
              <div className="flex items-center gap-4">
                  <button onClick={onExitNoScore} className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 transition-colors text-xs font-bold uppercase tracking-wide">
                      <LogOut className="w-4 h-4" /> Exit
                  </button>
                  <div className="h-6 w-px bg-slate-200"></div>
                  <div>
                      <h1 className="text-lg font-bold text-[#0A2342] leading-tight">Clinical Encounter</h1>
                      <div className="inline-flex items-center gap-1 border border-rose-200 bg-rose-50 text-rose-600 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                          Simulation · Not for real patient care
                      </div>
                  </div>
              </div>

              <div className="flex items-center gap-6">
                  {/* Timer */}
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-bold ${timeLeft < 300 ? 'bg-amber-100 text-amber-800 animate-pulse' : 'bg-slate-100 text-slate-600'}`}>
                      <Clock className="w-3 h-3" />
                      {formatTime(timeLeft)} remaining
                  </div>

                  {/* Mode Indicator */}
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider hidden md:block" title="Manual: You control the conversation. Auto-Pilot: AI plays the doctor.">
                      Mode: <span className={isAutoPilotRunning ? "text-purple-600" : "text-slate-600"}>{isAutoPilotRunning ? "Auto-Pilot" : "Manual"}</span>
                  </div>

                  <button 
                      onClick={onEndSession}
                      className="bg-[#0A2342] text-white px-5 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-[#152e52] transition-colors flex items-center gap-2"
                  >
                      Finish Rounds <ArrowRight className="w-4 h-4" />
                  </button>
              </div>
          </header>

          {/* 2.2 Chat & Diagnostic Stage */}
          <div className="flex-1 overflow-y-auto p-6 md:p-12 scrollbar-hide relative bg-[#F8FAFC]">
              
              {/* Messages */}
              <div className="space-y-8 max-w-4xl mx-auto">
                  {messages.map((msg) => {
                      const isUser = msg.sender === MessageSender.User;
                      const isAutoPilot = msg.sender === MessageSender.AutoPilot;
                      const isSystem = msg.sender === MessageSender.System;
                      
                      // DIAGNOSTIC CARD (System/Lab)
                      if (isSystem) {
                          const isLab = msg.type === 'lab_result';
                          const isInterpretation = msg.type === 'interpretation';

                          return (
                              <div key={msg.id} className="flex justify-center w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
                                  <div className={`bg-white rounded-xl border border-slate-200 shadow-sm w-full max-w-2xl overflow-hidden group ${isInterpretation ? 'border-l-4 border-l-purple-400' : ''}`}>
                                      {/* Header */}
                                      <div className={`px-4 py-2 flex justify-between items-center border-b ${isInterpretation ? 'bg-purple-50 border-purple-100' : 'bg-blue-50/50 border-blue-100'}`}>
                                          <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wide ${isInterpretation ? 'text-purple-700' : 'text-[#0A2342]'}`}>
                                              {isLab ? <Scan className="w-4 h-4 text-blue-500" /> : isInterpretation ? <GraduationCap className="w-4 h-4 text-purple-500" /> : <Info className="w-4 h-4" />}
                                              {isLab ? 'Diagnostic Result' : isInterpretation ? 'Clinical Interpretation' : 'System Notification'}
                                          </div>
                                          <span className="text-[10px] font-mono text-slate-400">{new Date(msg.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                                      </div>
                                      {/* Content */}
                                      <div className="p-5">
                                          {msg.imageUrl && (
                                              <div className="mb-4 rounded-lg overflow-hidden border border-slate-200 bg-black flex justify-center max-h-64 relative group/img cursor-pointer" onClick={() => setSelectedImage(msg.imageUrl || null)}>
                                                  <img src={msg.imageUrl} className="h-full object-contain" alt="Medical Scan" />
                                                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                                      <span className="text-white text-xs font-bold flex items-center gap-2 bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm"><ZoomIn className="w-4 h-4" /> Expand View</span>
                                                  </div>
                                              </div>
                                          )}
                                          <div className={`prose prose-sm max-w-none ${isInterpretation ? 'text-xs text-slate-600 font-normal leading-relaxed' : 'text-slate-700'}`}>
                                              <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                                          </div>
                                          {isLab && (
                                              <div className="mt-4 pt-3 border-t border-slate-50 flex justify-end">
                                                  <button onClick={() => onInterpretResult(msg.text)} className="text-xs font-bold text-[#1CB5B2] hover:bg-teal-50 px-3 py-1.5 rounded transition-colors flex items-center gap-1.5">
                                                      <GraduationCap className="w-3 h-3" /> Interpret Findings
                                                  </button>
                                              </div>
                                          )}
                                      </div>
                                  </div>
                              </div>
                          );
                      }

                      // AUTO-PILOT BUBBLE
                      if (isAutoPilot) {
                          return (
                              <div key={msg.id} className="flex justify-end w-full animate-in fade-in slide-in-from-right-4">
                                  <div className="relative max-w-[80%] md:max-w-[60%]">
                                      <div className="bg-purple-600 text-white p-4 rounded-2xl rounded-tr-none shadow-md border border-purple-500 relative group">
                                          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-purple-500/30">
                                              <Sparkles className="w-4 h-4 text-purple-200" />
                                              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-100">AI Auto-Pilot</span>
                                              <Info className="w-3 h-3 ml-auto text-purple-300 opacity-0 group-hover:opacity-100 transition-opacity cursor-help" title="AI is taking clinical actions based on guidelines." />
                                          </div>
                                          <div className="prose prose-sm prose-invert leading-relaxed">
                                              <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          );
                      }

                      // USER (DOCTOR)
                      if (isUser) {
                          return (
                              <div key={msg.id} className="flex justify-end w-full animate-in slide-in-from-bottom-2">
                                  <div className="max-w-[75%] flex flex-row-reverse gap-3">
                                      {/* <div className="w-8 h-8 rounded-full bg-[#0A2342] flex items-center justify-center text-white shrink-0 shadow-sm border-2 border-white ring-1 ring-slate-100">
                                          <Stethoscope className="w-4 h-4" />
                                      </div> */}
                                      <div className="flex flex-col items-end">
                                          <div className="bg-[#eff6ff] border border-blue-100 text-[#0A2342] p-3 rounded-2xl rounded-tr-none shadow-sm text-sm font-medium leading-relaxed">
                                              {msg.text}
                                          </div>
                                          <span className="text-[10px] text-slate-400 mt-1 font-bold mr-1">You</span>
                                      </div>
                                  </div>
                              </div>
                          );
                      }

                      // PATIENT
                      return (
                          <div key={msg.id} className="flex justify-start w-full animate-in slide-in-from-left-2">
                              <div className="max-w-[75%] flex gap-3">
                                  <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                                      <User className="w-4 h-4 text-slate-400" />
                                  </div>
                                  <div className="flex flex-col items-start">
                                      <div className="bg-white border border-slate-200 text-slate-700 p-3 rounded-2xl rounded-tl-none shadow-sm text-sm leading-relaxed relative">
                                          {msg.text}
                                      </div>
                                      <span className="text-[10px] text-slate-400 mt-1 ml-1">Patient</span>
                                  </div>
                              </div>
                          </div>
                      );
                  })}

                  {/* Loaders */}
                  {isLabProcessing && (
                      <div className="flex justify-center py-4">
                          <div className="bg-blue-50 border border-blue-100 text-blue-800 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-sm animate-pulse">
                              <Loader2 className="w-3 h-3 animate-spin" /> Processing Order...
                          </div>
                      </div>
                  )}
                  {loadingMessage && !isLabProcessing && (
                      <div className="flex justify-start items-center gap-2 text-xs font-bold text-slate-400 pl-12 animate-pulse">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce" />
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce delay-75" />
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce delay-150" />
                          {loadingMessage}
                      </div>
                  )}
                  <div ref={messagesEndRef} className="h-4" />
              </div>
          </div>

          {/* 2.3 Bottom Strip (Control Panel) */}
          <div className="bg-white border-t border-slate-200 p-4 md:px-8 md:py-6 z-20 shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
              <div className="max-w-4xl mx-auto space-y-4">
                  
                  {/* Row 1: Orders */}
                  <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide shrink-0">Tests & Orders:</span>
                      {QUICK_TESTS.map(t => {
                          const Icon = t.icon;
                          return (
                              <button 
                                  key={t.id}
                                  onClick={() => onOrderTest(t.name)}
                                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase transition-all shadow-sm hover:-translate-y-0.5 hover:shadow-md ${t.color} bg-white hover:bg-opacity-50`}
                              >
                                  <Icon className="w-3 h-3" />
                                  {t.name}
                              </button>
                          )
                      })}
                      <button 
                          onClick={() => setShowCustomOrder(!showCustomOrder)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 text-[10px] font-bold uppercase hover:bg-slate-50 hover:text-slate-700 transition-all"
                      >
                          <Plus className="w-3 h-3" /> Other
                      </button>
                  </div>

                  {/* Custom Order Popover */}
                  {showCustomOrder && (
                      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-xl border border-slate-200 p-4 w-80 animate-in slide-in-from-bottom-2 z-50">
                          <div className="flex justify-between items-center mb-3">
                              <h3 className="text-xs font-bold text-[#0A2342] uppercase tracking-wider">Custom Order</h3>
                              <button onClick={() => setShowCustomOrder(false)}><X className="w-3 h-3 text-slate-400 hover:text-slate-600" /></button>
                          </div>
                          <form onSubmit={handleOrderSubmit} className="relative">
                              <input 
                                  autoFocus
                                  className="w-full text-sm bg-slate-50 border border-slate-300 rounded-lg pl-3 pr-10 py-2.5 outline-none focus:border-[#1CB5B2] focus:ring-1 focus:ring-[#1CB5B2]"
                                  placeholder="e.g. CT Head, Lipid Panel..."
                                  value={testInput}
                                  onChange={e => setTestInput(e.target.value)}
                              />
                              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-[#1CB5B2] text-white rounded-md hover:bg-teal-600">
                                  <ArrowRight className="w-3 h-3" />
                              </button>
                          </form>
                      </div>
                  )}

                  {/* Row 2: Input & Controls */}
                  <div className="flex gap-4 items-center">
                      {/* Voice */}
                      <div className="flex items-center gap-1">
                          <button onClick={() => setVoiceEnabled(!voiceEnabled)} className={`p-2 rounded-full transition-colors ${voiceEnabled ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400 hover:bg-slate-100'}`}>
                              {voiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                          </button>
                          <button onMouseDown={startListening} onMouseUp={stopListening} className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'text-slate-400 hover:bg-slate-100'}`}>
                              {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                          </button>
                      </div>

                      {/* Text Input */}
                      <form onSubmit={handleSubmit} className="flex-1 relative">
                          <input 
                              value={input}
                              onChange={(e) => setInput(e.target.value)}
                              placeholder="Dialogue / Interview (e.g. 'Can you describe the pain?')"
                              className="w-full bg-[#F1F5F9] border border-transparent focus:bg-white focus:border-[#1CB5B2] focus:ring-2 focus:ring-[#1CB5B2]/20 rounded-2xl pl-5 pr-14 py-3 text-sm outline-none transition-all placeholder:text-slate-400"
                              disabled={!!loadingMessage || isLabProcessing}
                          />
                          <button 
                              type="submit" 
                              disabled={!input.trim()}
                              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-[#1CB5B2] text-white rounded-full hover:bg-teal-600 disabled:bg-slate-300 transition-colors shadow-sm"
                          >
                              <Send className="w-4 h-4 ml-0.5" />
                          </button>
                      </form>

                      {/* Auto-Pilot Toggle */}
                      <button 
                          onClick={onAutoPlay}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all border ${isAutoPilotRunning ? 'bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-500/20' : 'bg-white border-purple-200 text-purple-600 hover:bg-purple-50'}`}
                      >
                          <Zap className={`w-3 h-3 ${isAutoPilotRunning ? 'fill-current' : ''}`} />
                          <span className="hidden sm:inline">Auto-Pilot</span>
                          <span className={`w-2 h-2 rounded-full ${isAutoPilotRunning ? 'bg-white animate-pulse' : 'bg-purple-200'}`}></span>
                      </button>
                  </div>
              </div>
          </div>

          {/* 3. LIGHTBOX MODAL */}
          {selectedImage && (
              <div 
                  className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in" 
                  onClick={() => setSelectedImage(null)}
              >
                  <button className="absolute top-6 right-6 text-white hover:text-slate-300 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                      <X className="w-8 h-8" />
                  </button>
                  
                  <div className="max-w-5xl max-h-[85vh] w-full flex flex-col items-center">
                      <img 
                          src={selectedImage} 
                          className="max-w-full max-h-[80vh] object-contain rounded-md shadow-2xl border border-white/10 bg-black" 
                          onClick={(e) => e.stopPropagation()} 
                      />
                      <div className="mt-4 flex gap-4">
                          <span className="text-white text-sm font-medium bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                              Diagnostic View
                          </span>
                      </div>
                  </div>
              </div>
          )}

      </div>
    </div>
  );
};

export default ChatInterface;