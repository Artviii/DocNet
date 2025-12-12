import React, { useState } from 'react';
import { Users, FileText, Activity, Briefcase, Shield, Building2, CheckCircle, ArrowRight, Menu, X, MessageSquare, Play, Lock, GraduationCap, Filter, Microscope, Scan, Brain, Quote, Star, HeartPulse, Stethoscope, BookOpen } from 'lucide-react';
import Logo from './Logo';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Brand Colors & Styles
  const navy = "text-[#0A2342]";
  const bgNavy = "bg-[#0A2342]";
  const teal = "text-[#1CB5B2]";
  const bgTeal = "bg-[#1CB5B2]";
  
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsMobileMenuOpen(false);
    }
  };

  // Main container needs h-screen and overflow-y-auto to scroll because body is overflow-hidden
  return (
    <div className="h-screen w-screen bg-[#F8FAFC] font-sans text-[#0A2342] selection:bg-[#1CB5B2] selection:text-white overflow-y-auto overflow-x-hidden scroll-smooth">
      
      {/* --- NAVIGATION --- */}
      <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-[#E2E8F0] shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div onClick={() => { const el = document.getElementById('hero'); if(el) el.scrollIntoView({ behavior: 'smooth' }); }} className="cursor-pointer hover:opacity-80 transition-opacity">
             <Logo />
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            <button onClick={() => scrollToSection('community')} className="text-sm font-bold text-[#0A2342] hover:text-[#1CB5B2] transition-colors">Community</button>
            <button onClick={() => scrollToSection('cases')} className="text-sm font-bold text-[#0A2342] hover:text-[#1CB5B2] transition-colors">Cases</button>
            <button onClick={() => scrollToSection('simulator')} className="text-sm font-bold text-[#0A2342] hover:text-[#1CB5B2] transition-colors">Skills & Simulator</button>
            <button onClick={() => scrollToSection('jobs')} className="text-sm font-bold text-[#0A2342] hover:text-[#1CB5B2] transition-colors">Jobs</button>
            <button onClick={() => scrollToSection('institutions')} className="text-sm font-bold text-[#0A2342] hover:text-[#1CB5B2] transition-colors">For Hospitals</button>
          </div>
          
          <div className="hidden lg:flex items-center gap-4">
            <button onClick={onStart} className="text-sm font-bold text-[#0A2342] hover:text-[#1CB5B2]">Log in</button>
            <button 
              onClick={onStart}
              className={`${bgTeal} text-white px-6 py-2.5 rounded-full text-sm font-bold hover:brightness-110 hover:shadow-lg hover:-translate-y-0.5 transition-all shadow-md shadow-teal-500/20`}
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button className="lg:hidden p-2 text-[#0A2342]" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
             {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
           <div className="lg:hidden bg-white border-b border-[#E2E8F0] px-6 py-4 space-y-4 shadow-xl absolute w-full left-0 top-20 animate-in slide-in-from-top-5">
              <button onClick={() => scrollToSection('community')} className="block w-full text-left font-bold text-[#0A2342] py-3 border-b border-slate-50">Community</button>
              <button onClick={() => scrollToSection('cases')} className="block w-full text-left font-bold text-[#0A2342] py-3 border-b border-slate-50">Cases Library</button>
              <button onClick={() => scrollToSection('simulator')} className="block w-full text-left font-bold text-[#0A2342] py-3 border-b border-slate-50">Skills & Simulator</button>
              <button onClick={() => scrollToSection('jobs')} className="block w-full text-left font-bold text-[#0A2342] py-3 border-b border-slate-50">Jobs</button>
              <button onClick={() => scrollToSection('institutions')} className="block w-full text-left font-bold text-[#0A2342] py-3">For Institutions</button>
              <div className="pt-4">
                <button onClick={onStart} className={`block w-full text-center ${bgTeal} text-white py-3 rounded-xl font-bold shadow-md`}>Join DocNet</button>
              </div>
           </div>
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <header id="hero" className="relative pt-32 pb-24 px-6 overflow-hidden scroll-mt-24">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-[#1CB5B2]/10 to-[#0A2342]/5 rounded-full blur-3xl -z-10 pointer-events-none translate-x-1/4 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-100/40 to-white rounded-full blur-3xl -z-10 pointer-events-none -translate-x-1/4 translate-y-1/4"></div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <div className="space-y-8 animate-in slide-in-from-bottom-10 duration-700 z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full shadow-sm text-xs font-bold uppercase tracking-wider text-indigo-600">
               <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
               Live Clinical Network
            </div>
            
            <h1 className={`text-5xl lg:text-7xl font-extrabold ${navy} tracking-tight leading-[1.1]`}>
              Where clinicians <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1CB5B2] to-indigo-600">practice, connect, and grow.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-500 leading-relaxed max-w-lg font-medium">
              Share real and synthetic cases, sharpen your skills with AI simulation, and build a portfolio that advances your career.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button 
                onClick={onStart}
                className={`${bgTeal} text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl shadow-teal-500/20 hover:brightness-105 hover:scale-105 transition-all flex items-center justify-center gap-2`}
              >
                Start Rounds <ArrowRight className="w-5 h-5" />
              </button>
              <button 
                onClick={() => scrollToSection('institutions')}
                className={`bg-white border-2 border-[#E2E8F0] text-[#0A2342] px-8 py-4 rounded-full font-bold text-lg hover:border-[#1CB5B2] hover:text-[#1CB5B2] transition-all`}
              >
                Partner with us
              </button>
            </div>
            
            <div className="flex items-center gap-6 pt-4">
               <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                     <img key={i} src={`https://i.pravatar.cc/100?u=${i+20}`} className="w-10 h-10 rounded-full border-2 border-white" alt="User" />
                  ))}
               </div>
               <div className="text-sm">
                  <p className="font-bold text-slate-900">Joined by 10,000+ clinicians</p>
                  <p className="text-slate-500">From students to attendings</p>
               </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative hidden lg:block animate-in slide-in-from-right-10 duration-1000 delay-200">
             <div className="relative z-10 w-full max-w-lg mx-auto">
                <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white bg-white relative aspect-[4/5] group">
                   <img 
                      src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80" 
                      alt="Doctor using digital tablet for rounds" 
                      className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                   />
                   
                   {/* Floating UI Elements */}
                   <div className="absolute top-8 right-8 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-slate-100 max-w-[200px] animate-bounce" style={{ animationDuration: '3s' }}>
                      <div className="flex items-center gap-3 mb-2">
                         <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                            <Activity className="w-5 h-5" />
                         </div>
                         <div>
                            <div className="text-[10px] uppercase font-bold text-slate-400">Status</div>
                            <div className="text-xs font-bold text-slate-900">Case Solved</div>
                         </div>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                         <div className="bg-green-500 w-full h-full rounded-full"></div>
                      </div>
                   </div>

                   <div className="absolute bottom-8 left-8 bg-[#0A2342]/95 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-slate-600 text-white max-w-[260px]">
                      <div className="flex items-center gap-2 mb-2">
                         <img src="https://i.pravatar.cc/100?u=aisha" className="w-6 h-6 rounded-full border border-white" />
                         <span className="text-xs font-bold text-indigo-300">Dr. Aisha Rahman</span>
                      </div>
                      <p className="text-sm font-medium leading-snug">"The simulation for the NSTEMI case was incredible. It really tested my timing on the lab orders."</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </header>

      {/* --- COMMUNITY SECTION --- */}
      <section id="community" className="py-24 bg-white scroll-mt-24">
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
               <div className="order-2 md:order-1 relative">
                  <div className="absolute -inset-4 bg-indigo-100 rounded-[3rem] -rotate-3"></div>
                  <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl aspect-video group">
                     <img 
                        src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=1200&q=80" 
                        alt="Medical team discussion" 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-[#0A2342]/90 to-transparent flex flex-col justify-end p-8">
                        <div className="flex -space-x-3 mb-4">
                           {[1,2,3,4].map(i => <img key={i} src={`https://i.pravatar.cc/100?u=${i+30}`} className="w-10 h-10 rounded-full border-2 border-white" />)}
                           <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold border-2 border-white">+42</div>
                        </div>
                        <p className="text-white font-bold text-lg">"Grand Rounds this morning was intense! Great discussion on the rare neuro case."</p>
                     </div>
                  </div>
               </div>

               <div className="order-1 md:order-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase mb-6">
                     <Users className="w-4 h-4" /> Global Network
                  </div>
                  <h2 className={`text-4xl font-extrabold ${navy} mb-6`}>
                     Find your medical circle.
                  </h2>
                  <p className="text-lg text-slate-500 mb-8 leading-relaxed">
                     Connect with clinicians in your specialty, join hospital alumni groups, or find study partners. DocNet is where the medical conversation happens.
                  </p>
                  
                  <div className="space-y-6">
                     <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center shrink-0">
                           <MessageSquare className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                           <h4 className="font-bold text-slate-900 text-lg">Collaborative Rounds</h4>
                           <p className="text-slate-600">Discuss differentials and treatment plans in real-time on shared cases.</p>
                        </div>
                     </div>
                     <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center shrink-0">
                           <GraduationCap className="w-6 h-6 text-teal-600" />
                        </div>
                        <div>
                           <h4 className="font-bold text-slate-900 text-lg">Mentorship & Growth</h4>
                           <p className="text-slate-600">Follow attending physicians and learn from their public case breakdowns.</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* --- NEW CASES SECTION --- */}
      <section id="cases" className="py-24 bg-[#F8FAFC] scroll-mt-24">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16 max-w-3xl mx-auto">
               <h2 className="text-sm font-bold text-teal-600 uppercase tracking-widest mb-2">The Case Library</h2>
               <h3 className={`text-4xl font-extrabold ${navy} mb-4`}>A vast library of clinical experiences</h3>
               <p className="text-lg text-slate-500">From common complaints to rare "zebras". Choose your role, specialty, and difficulty level.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
               {/* Case Card 1 */}
               <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all group cursor-pointer" onClick={onStart}>
                  <div className="flex justify-between items-start mb-4">
                     <span className="bg-red-50 text-red-600 px-2 py-1 rounded text-[10px] font-bold uppercase">Cardiology</span>
                     <span className="text-xs font-bold text-slate-400">Advanced</span>
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                     <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                        <HeartPulse className="w-6 h-6 text-red-500" />
                     </div>
                     <div>
                        <h4 className="font-bold text-slate-900 group-hover:text-teal-600 transition-colors">Acute Chest Pain</h4>
                        <p className="text-xs text-slate-500">68M • ER Presentation</p>
                     </div>
                  </div>
                  <p className="text-sm text-slate-600 mb-4">Patient presents with crushing substernal chest pain. ECG shows ST elevation. Act fast.</p>
                  <div className="flex items-center text-teal-600 text-xs font-bold">
                     Start Case <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
               </div>

               {/* Case Card 2 */}
               <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all group cursor-pointer" onClick={onStart}>
                  <div className="flex justify-between items-start mb-4">
                     <span className="bg-amber-50 text-amber-600 px-2 py-1 rounded text-[10px] font-bold uppercase">Pediatrics</span>
                     <span className="text-xs font-bold text-slate-400">Intermediate</span>
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                     <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                        <Stethoscope className="w-6 h-6 text-amber-500" />
                     </div>
                     <div>
                        <h4 className="font-bold text-slate-900 group-hover:text-teal-600 transition-colors">Fever & Rash</h4>
                        <p className="text-xs text-slate-500">8F • Urgent Care</p>
                     </div>
                  </div>
                  <p className="text-sm text-slate-600 mb-4">Child with high fever and strawberry tongue. Parents are worried. Differentiate viral vs bacterial.</p>
                  <div className="flex items-center text-teal-600 text-xs font-bold">
                     Start Case <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
               </div>

               {/* Case Card 3 */}
               <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all group cursor-pointer" onClick={onStart}>
                  <div className="flex justify-between items-start mb-4">
                     <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-[10px] font-bold uppercase">Trauma</span>
                     <span className="text-xs font-bold text-slate-400">Novice</span>
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                     <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                        <Activity className="w-6 h-6 text-blue-500" />
                     </div>
                     <div>
                        <h4 className="font-bold text-slate-900 group-hover:text-teal-600 transition-colors">Bike Accident</h4>
                        <p className="text-xs text-slate-500">25M • Field Triage</p>
                     </div>
                  </div>
                  <p className="text-sm text-slate-600 mb-4">Cyclist struck by car. Complains of hip pain. Assess stability and decide transport priority.</p>
                  <div className="flex items-center text-teal-600 text-xs font-bold">
                     Start Case <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
               </div>
            </div>

            <div className="text-center">
               <button onClick={onStart} className="bg-white border-2 border-slate-200 text-slate-600 px-8 py-3 rounded-full font-bold hover:border-teal-500 hover:text-teal-600 transition-all">
                  Browse Full Library
               </button>
            </div>
         </div>
      </section>

      {/* --- SIMULATOR SECTION --- */}
      <section id="simulator" className="py-24 bg-[#F0F9FF] scroll-mt-24 relative overflow-hidden">
         {/* Background Decoration */}
         <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
         
         <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
            <div>
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase mb-6">
                  <Brain className="w-4 h-4" /> AI Patient Simulator
               </div>
               <h2 className={`text-4xl font-extrabold ${navy} mb-6`}>
                  Don't just read about it.<br/><span className="text-indigo-600">Diagnose it.</span>
               </h2>
               <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                  Interact with AI-powered patients in real-time. Order tests, interpret lab results, and make critical decisions under pressure. It's the closest thing to real life, without the risk.
               </p>

               <div className="space-y-6">
                  <div className="flex gap-4 p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                     <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                        <MessageSquare className="w-6 h-6" />
                     </div>
                     <div>
                        <h4 className="font-bold text-slate-900">Natural Dialogue</h4>
                        <p className="text-sm text-slate-500">Interview patients using your own words. No multiple choice lists.</p>
                     </div>
                  </div>
                  <div className="flex gap-4 p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                     <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                        <Scan className="w-6 h-6" />
                     </div>
                     <div>
                        <h4 className="font-bold text-slate-900">Lab Interpretation</h4>
                        <p className="text-sm text-slate-500">View and interpret realistic ECGs, X-Rays, and comprehensive lab panels.</p>
                     </div>
                  </div>
                  <div className="flex gap-4 p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                     <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                        <CheckCircle className="w-6 h-6" />
                     </div>
                     <div>
                        <h4 className="font-bold text-slate-900">Instant Feedback</h4>
                        <p className="text-sm text-slate-500">Receive a detailed score on your accuracy, efficiency, and empathy.</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Right Visual - Simulator Mockup */}
            <div className="relative">
               <div className="absolute -inset-4 bg-indigo-500/20 blur-3xl rounded-full"></div>
               <div className="relative bg-slate-900 rounded-3xl shadow-2xl border-4 border-slate-800 overflow-hidden">
                  {/* Fake UI Header */}
                  <div className="bg-slate-800 p-4 flex justify-between items-center border-b border-slate-700">
                     <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                        <span className="text-slate-200 font-mono text-xs uppercase tracking-widest">Live Simulation: Chest Pain</span>
                     </div>
                     <Activity className="w-5 h-5 text-green-500" />
                  </div>
                  
                  {/* Chat Content */}
                  <div className="p-6 space-y-4">
                     {/* Patient Msg */}
                     <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs text-white">Pt</div>
                        <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-none text-slate-300 text-sm max-w-[80%]">
                           It feels like... like an elephant is sitting on my chest. It started about 20 minutes ago while I was gardening.
                        </div>
                     </div>
                     
                     {/* Doctor Msg */}
                     <div className="flex gap-3 flex-row-reverse">
                        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs text-white">Dr</div>
                        <div className="bg-indigo-600 p-3 rounded-2xl rounded-tr-none text-white text-sm max-w-[80%]">
                           Are you having any shortness of breath or nausea along with the pain?
                        </div>
                     </div>

                     {/* Lab Result Pop-up */}
                     <div className="mt-4 bg-white rounded-xl p-4 shadow-lg animate-bounce border-l-4 border-red-500">
                        <div className="flex justify-between items-center mb-2">
                           <span className="font-bold text-slate-900 text-xs uppercase flex items-center gap-2">
                              <Activity className="w-4 h-4 text-red-500" /> ECG Result
                           </span>
                           <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded">CRITICAL</span>
                        </div>
                        <div className="h-10 w-full bg-slate-50 relative overflow-hidden">
                           <svg className="absolute inset-0 w-full h-full stroke-slate-900 fill-none" preserveAspectRatio="none">
                              <path d="M0,20 L10,20 L15,5 L20,35 L25,20 L40,20 L50,20 L55,5 L60,35 L65,20 L100,20" strokeWidth="1.5" />
                           </svg>
                        </div>
                        <p className="text-xs text-slate-500 mt-2">ST-Elevation in Leads II, III, aVF.</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* --- JOBS SECTION --- */}
      <section id="jobs" className="py-24 bg-white scroll-mt-24">
         <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
               <div className="max-w-2xl">
                  <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-2">Careers</h2>
                  <h3 className={`text-4xl font-extrabold ${navy} mb-4`}>Jobs that see the whole you</h3>
                  <p className="text-lg text-slate-500">Your DocNet profile showcases your actual clinical reasoning skills, not just your resume. Apply to top hospitals with verified simulation badges.</p>
               </div>
               <button onClick={onStart} className="bg-white border-2 border-slate-200 text-slate-900 px-6 py-3 rounded-full font-bold hover:border-indigo-600 hover:text-indigo-600 transition-all flex items-center gap-2">
                  View Job Board <ArrowRight className="w-4 h-4" />
               </button>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
               {/* Job Card 1 */}
               <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all group">
                  <div className="flex justify-between items-start mb-4">
                     <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-bold text-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">GH</div>
                     <span className="bg-green-50 text-green-700 px-2 py-1 rounded-md text-[10px] font-bold uppercase">New</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-lg mb-1">ER Resident</h4>
                  <p className="text-slate-500 text-sm mb-4">General Hospital • New York, NY</p>
                  <div className="space-y-2 mb-6">
                     <div className="flex items-center gap-2 text-xs text-slate-600">
                        <CheckCircle className="w-3 h-3 text-teal-500" /> Matches your <strong>Trauma</strong> skills
                     </div>
                     <div className="flex items-center gap-2 text-xs text-slate-600">
                        <CheckCircle className="w-3 h-3 text-teal-500" /> Verified <strong>Triage</strong> Badge required
                     </div>
                  </div>
                  <button className="w-full py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50">View Details</button>
               </div>

               {/* Job Card 2 */}
               <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all group">
                  <div className="flex justify-between items-start mb-4">
                     <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600 font-bold text-xl group-hover:bg-rose-600 group-hover:text-white transition-colors">CC</div>
                     <span className="bg-slate-100 text-slate-500 px-2 py-1 rounded-md text-[10px] font-bold uppercase">3d ago</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-lg mb-1">Cardiology Fellow</h4>
                  <p className="text-slate-500 text-sm mb-4">City Care Clinic • Boston, MA</p>
                  <div className="space-y-2 mb-6">
                     <div className="flex items-center gap-2 text-xs text-slate-600">
                        <CheckCircle className="w-3 h-3 text-teal-500" /> Matches your <strong>Cardio</strong> skills
                     </div>
                     <div className="flex items-center gap-2 text-xs text-slate-600">
                        <CheckCircle className="w-3 h-3 text-teal-500" /> <strong>ECG Master</strong> Badge preferred
                     </div>
                  </div>
                  <button className="w-full py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50">View Details</button>
               </div>

               {/* Job Card 3 */}
               <div className="bg-indigo-600 rounded-2xl p-6 text-white hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col justify-center items-center text-center">
                  <Briefcase className="w-12 h-12 mb-4 opacity-80" />
                  <h4 className="font-bold text-xl mb-2">Hiring Clinicians?</h4>
                  <p className="text-indigo-100 text-sm mb-6">Find candidates with verified skills, not just CVs. Post your job on DocNet today.</p>
                  <button className="px-6 py-2 bg-white text-indigo-600 rounded-lg font-bold text-sm hover:bg-indigo-50">Post a Job</button>
               </div>
            </div>
         </div>
      </section>

      {/* --- FOR INSTITUTIONS --- */}
      <section id="institutions" className="py-24 bg-[#F8FAFC] scroll-mt-24">
         <div className="max-w-7xl mx-auto px-6">
            <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-xl border border-slate-200 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-teal-50 to-indigo-50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
               
               <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                  <div>
                     <h2 className="text-sm font-bold text-teal-600 uppercase tracking-widest mb-2">For Hospitals & Medical Schools</h2>
                     <h3 className={`text-4xl font-extrabold ${navy} mb-6`}>Modernize your clinical education</h3>
                     <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                        Create private simulation spaces for your residents and students. Track learning progress, identify skill gaps, and improve clinical outcomes with data-driven insights.
                     </p>
                     
                     <ul className="space-y-4 mb-8">
                        <li className="flex items-center gap-3">
                           <CheckCircle className="w-5 h-5 text-teal-500" />
                           <span className="font-medium text-slate-700">Private, HIPAA-compliant spaces</span>
                        </li>
                        <li className="flex items-center gap-3">
                           <CheckCircle className="w-5 h-5 text-teal-500" />
                           <span className="font-medium text-slate-700">Custom case libraries & protocols</span>
                        </li>
                        <li className="flex items-center gap-3">
                           <CheckCircle className="w-5 h-5 text-teal-500" />
                           <span className="font-medium text-slate-700">Advanced learner analytics</span>
                        </li>
                     </ul>

                     <button className={`${bgNavy} text-white px-8 py-4 rounded-full font-bold text-lg hover:opacity-90 transition-all shadow-lg`}>
                        Schedule a Demo
                     </button>
                  </div>

                  {/* Dashboard Graphic */}
                  <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 shadow-inner">
                     <div className="flex items-center justify-between mb-6">
                        <div className="font-bold text-slate-800">Residency Dashboard</div>
                        <div className="text-xs bg-white border border-slate-200 px-2 py-1 rounded text-slate-500">Internal Medicine</div>
                     </div>
                     <div className="space-y-4">
                        <div className="bg-white p-4 rounded-xl border border-slate-200 flex justify-between items-center">
                           <div>
                              <div className="text-xs text-slate-400 font-bold uppercase">Cases Completed</div>
                              <div className="text-2xl font-bold text-slate-900">1,248</div>
                           </div>
                           <Activity className="text-teal-500 w-8 h-8" />
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-200">
                           <div className="text-xs text-slate-400 font-bold uppercase mb-2">Top Skills Growth</div>
                           <div className="space-y-2">
                              <div>
                                 <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                                    <span>Diagnostic Accuracy</span>
                                    <span>+12%</span>
                                 </div>
                                 <div className="w-full bg-slate-100 h-2 rounded-full">
                                    <div className="bg-indigo-500 w-[78%] h-full rounded-full"></div>
                                 </div>
                              </div>
                              <div>
                                 <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                                    <span>Protocol Adherence</span>
                                    <span>+8%</span>
                                 </div>
                                 <div className="w-full bg-slate-100 h-2 rounded-full">
                                    <div className="bg-teal-500 w-[65%] h-full rounded-full"></div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* --- TESTIMONIALS (What People Say) --- */}
      <section id="testimonials" className="py-24 bg-white relative overflow-hidden">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
               <h2 className={`text-4xl font-extrabold ${navy} mb-4`}>Trusted by the best</h2>
               <p className="text-lg text-slate-500">Join thousands of clinicians who use DocNet to stay sharp.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
               
               <div className="bg-[#F8FAFC] p-8 rounded-3xl border border-slate-100 relative group hover:shadow-lg transition-all">
                  <Quote className="w-8 h-8 text-indigo-200 absolute top-6 right-6" />
                  <div className="flex items-center gap-1 mb-4 text-yellow-400">
                     {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                  <p className="text-slate-700 mb-6 italic relative z-10">
                     "As a resident, I don't always get to see rare cases. DocNet's simulator lets me practice the 'zebras' safely so I'm ready when they actually walk through the door."
                  </p>
                  <div className="flex items-center gap-4">
                     <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=150&q=80" className="w-12 h-12 rounded-full object-cover" alt="User" />
                     <div>
                        <div className="font-bold text-slate-900 text-sm">Dr. James Wilson</div>
                        <div className="text-xs text-slate-500">Internal Medicine • PGY-3</div>
                     </div>
                  </div>
               </div>

               <div className="bg-[#F8FAFC] p-8 rounded-3xl border border-slate-100 relative group hover:shadow-lg transition-all">
                  <Quote className="w-8 h-8 text-indigo-200 absolute top-6 right-6" />
                  <div className="flex items-center gap-1 mb-4 text-yellow-400">
                     {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                  <p className="text-slate-700 mb-6 italic relative z-10">
                     "The community aspect is what sold me. Discussing differentials with colleagues from other countries gives me a perspective I wouldn't get in my local hospital."
                  </p>
                  <div className="flex items-center gap-4">
                     <img src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=150&q=80" className="w-12 h-12 rounded-full object-cover" alt="User" />
                     <div>
                        <div className="font-bold text-slate-900 text-sm">Sarah Jenkins, RN</div>
                        <div className="text-xs text-slate-500">Emergency Nursing</div>
                     </div>
                  </div>
               </div>

               <div className="bg-[#F8FAFC] p-8 rounded-3xl border border-slate-100 relative group hover:shadow-lg transition-all">
                  <Quote className="w-8 h-8 text-indigo-200 absolute top-6 right-6" />
                  <div className="flex items-center gap-1 mb-4 text-yellow-400">
                     {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                  <p className="text-slate-700 mb-6 italic relative z-10">
                     "I used my DocNet portfolio when applying for fellowships. The program director was impressed by my verified simulation scores in Cardiology."
                  </p>
                  <div className="flex items-center gap-4">
                     <img src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&q=80" className="w-12 h-12 rounded-full object-cover" alt="User" />
                     <div>
                        <div className="font-bold text-slate-900 text-sm">Dr. Michael Chen</div>
                        <div className="text-xs text-slate-500">Cardiology Fellow</div>
                     </div>
                  </div>
               </div>

            </div>
         </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className={`${bgNavy} text-white py-16`}>
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-12 mb-12">
               <div className="col-span-1 md:col-span-1">
                  <Logo light />
                  <p className="text-slate-400 text-sm mt-4 leading-relaxed">
                     DocNet connects clinicians, students, and institutions around cases, skills, and careers.
                  </p>
               </div>
               
               <div>
                  <h4 className="font-bold text-sm uppercase tracking-wider text-teal-500 mb-4">Product</h4>
                  <ul className="space-y-2 text-sm text-slate-300">
                     <li><button onClick={() => scrollToSection('community')} className="hover:text-white text-left transition-colors">Community</button></li>
                     <li><button onClick={() => scrollToSection('simulator')} className="hover:text-white text-left transition-colors">Simulator</button></li>
                     <li><button onClick={() => scrollToSection('jobs')} className="hover:text-white text-left transition-colors">Jobs</button></li>
                     <li><button onClick={() => scrollToSection('institutions')} className="hover:text-white text-left transition-colors">For Institutions</button></li>
                  </ul>
               </div>

               <div>
                  <h4 className="font-bold text-sm uppercase tracking-wider text-teal-500 mb-4">Legal</h4>
                  <ul className="space-y-2 text-sm text-slate-300">
                     <li><button className="hover:text-white text-left transition-colors">Privacy</button></li>
                     <li><button className="hover:text-white text-left transition-colors">Terms</button></li>
                     <li><button className="hover:text-white text-left transition-colors">Contact</button></li>
                  </ul>
               </div>

               <div className="text-right">
                  <div className="inline-block bg-white/10 p-4 rounded-xl text-left border border-white/10">
                     <p className="text-xs text-slate-300 font-medium leading-relaxed">
                        Educational use only.<br/>
                        Not a medical device.<br/>
                        Not for patient care.
                     </p>
                  </div>
               </div>
            </div>
            <div className="border-t border-white/10 pt-8 text-center text-xs text-slate-500">
               © {new Date().getFullYear()} DocNet. All rights reserved.
            </div>
         </div>
      </footer>

    </div>
  );
};

export default LandingPage;