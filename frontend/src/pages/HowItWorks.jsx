import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, MessageSquare, Sparkles, Download, ArrowRight, 
  Database, Menu, X, ChevronRight, CheckCircle2, Film, Music, Check, Settings
} from 'lucide-react';
import GlassCard from '../components/GlassCard';
import ThundraLogo from '../components/ThundraLogo';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function HowItWorks() {
  const navigate = useNavigate();
  const [activeStepTab, setActiveStepTab] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);

  // Prompt typing simulation state for Step 2 tab
  const [typedPrompt, setTypedPrompt] = useState('');
  const [typingIndex, setTypingIndex] = useState(0);

  const stepsList = [
    {
      step: "01",
      title: "Upload Video",
      desc: "Drag and drop your raw footage files into the interface. We analyze your voiceover tracks.",
      icon: Upload,
      accent: "#8B5CF6",
      accentBg: "rgba(139, 92, 246, 0.12)",
      accentBorder: "rgba(139, 92, 246, 0.3)"
    },
    {
      step: "02",
      title: "Tell AI What To Do",
      desc: "Type instructions or click quick suggestions like 'Remove Silences' or 'Add Urdu Captions'.",
      icon: MessageSquare,
      accent: "#D4A574",
      accentBg: "rgba(212, 165, 116, 0.12)",
      accentBorder: "rgba(212, 165, 116, 0.3)"
    },
    {
      step: "03",
      title: "AI Edits Automatically",
      desc: "Our speech detection, color grading, B-Roll matching, and audio sync pipelines run automatically.",
      icon: Sparkles,
      accent: "#4FD1FF",
      accentBg: "rgba(79, 209, 255, 0.12)",
      accentBorder: "rgba(79, 209, 255, 0.3)"
    },
    {
      step: "04",
      title: "Export Final Video",
      desc: "Select 1080p, 2K, or 4K resolutions and MP4/MOV formats. Download instantly.",
      icon: Download,
      accent: "#F5EFE6",
      accentBg: "rgba(245, 239, 230, 0.12)",
      accentBorder: "rgba(245, 239, 230, 0.3)"
    }
  ];

  // Scroll handler removed as it is now managed inside Navbar component

  // Auto play stepping simulation
  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(() => {
      setActiveStepTab((prev) => (prev + 1) % 4);
    }, 8000);
    return () => clearInterval(interval);
  }, [autoPlay]);

  // Prompt typing animation for Step 2
  useEffect(() => {
    if (activeStepTab !== 1) {
      setTypedPrompt('');
      setTypingIndex(0);
      return;
    }

    const fullPrompt = "Cut out awkward pauses, add Urdu subtitles, and mix ambient lofi beats...";
    let timer;
    
    if (typingIndex < fullPrompt.length) {
      timer = setTimeout(() => {
        setTypedPrompt(fullPrompt.substring(0, typingIndex + 1));
        setTypingIndex(prev => prev + 1);
      }, 50);
    } else {
      timer = setTimeout(() => {
        setTypedPrompt('');
        setTypingIndex(0);
      }, 5000);
    }

    return () => clearTimeout(timer);
  }, [activeStepTab, typingIndex]);

  // Logo handler removed as it is now managed inside Navbar component

  return (
    <div className="min-h-screen bg-transparent text-[#F8F8FF] overflow-x-hidden font-body relative flex flex-col justify-between">
      <div>
        {/* NAVBAR */}
        <Navbar />

        {/* MAIN CONTAINER */}
        <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24 space-y-20">
          
          {/* Header Title */}
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purpleTheme/10 border border-purpleTheme/35 text-purpleLight text-[10px] font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Full Orchestration Guide</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black font-heading text-white leading-none tracking-tight">
              How <span className="bg-gradient-to-r from-purpleLight via-blueTheme to-pinkTheme bg-clip-text text-transparent">Thundra AI</span> Works
            </h1>
            <p className="text-sm md:text-base text-slate-400 leading-relaxed font-body">
              Go from raw camera footage to a fully polished, short-form viral clip with automatic silence removal, subtitles, sound design, and LUT grades. Explore the 4-step workflow below.
            </p>
          </div>

          {/* Responsive Layout: Grid for Mobile/Tablet, Node-Graph for Desktop */}
          <div className="w-full">
            {/* ── MOBILE / TABLET GRID LAYOUT ── */}
            <div className="block lg:hidden grid grid-cols-1 md:grid-cols-2 gap-6">
              {stepsList.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <GlassCard 
                    key={idx} 
                    delay={idx * 0.15}
                    hover={true}
                    onClick={() => {
                      setActiveStepTab(idx);
                      setAutoPlay(false);
                    }}
                    style={{
                      borderColor: item.accent,
                      borderWidth: '2px',
                      boxShadow: `0 0 10px ${item.accent}05`,
                    }}
                    className="space-y-5 text-left transition-all duration-300 relative group cursor-pointer bg-[#0d0d1c]/90 opacity-100 hover:scale-[1.02]"
                  >
                    <div className="flex justify-between items-center">
                      <div 
                        className="p-3.5 rounded-xl border flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                        style={{ 
                          background: item.accentBg, 
                          borderColor: item.accent,
                          color: item.accent
                        }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span 
                        className="font-mono text-2xl font-black select-none transition-colors duration-300"
                        style={{ color: item.accent }}
                      >
                        {item.step}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-base font-black text-white uppercase tracking-wider">{item.title}</h3>
                      <p className="text-xs font-semibold text-slate-300 leading-relaxed font-body">{item.desc}</p>
                    </div>
                  </GlassCard>
                );
              })}
            </div>

            {/* ── DESKTOP NODE GRAPH LAYOUT (AI FIESTA STYLE) ── */}
            <div className="hidden lg:block relative w-[1060px] h-[380px] mx-auto select-none overflow-visible">

              {/* Connecting glowing laser paths */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 1060 380">
                <defs>
                  <filter id="glow-laser" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur1" />
                    <feGaussianBlur stdDeviation="6" result="blur2" />
                    <feMerge>
                      <feMergeNode in="blur2" />
                      <feMergeNode in="blur1" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Background Radar & Orbits Grid */}
                <circle cx="530" cy="190" r="130" fill="none" stroke="rgba(255,255,255,0.01)" strokeWidth="1" strokeDasharray="4 8" />
                <circle cx="530" cy="190" r="185" fill="none" stroke="rgba(255,255,255,0.006)" strokeWidth="1.2" />
                <circle cx="530" cy="190" r="240" fill="none" stroke="rgba(255,255,255,0.005)" strokeWidth="1" strokeDasharray="16 32" />

                {/* Faint cosmic star field background - Cleaned and Reduced by 75% */}
                <g fill="#ffffff">
                  <circle cx="530" cy="80" r="0.6" opacity="0.15" />
                  <circle cx="420" cy="190" r="0.5" opacity="0.1" />
                  <circle cx="640" cy="190" r="0.6" opacity="0.15" />
                  <circle cx="460" cy="270" r="0.5" opacity="0.1" />
                  <circle cx="600" cy="260" r="0.5" opacity="0.15" />
                </g>
                
                {/* Tech alignment grid crosses - Lower opacity */}
                <g stroke="rgba(255,255,255,0.03)" strokeWidth="0.8">
                  {/* Center Left */}
                  <path d="M 145 190 L 155 190 M 150 185 L 150 195" opacity="0.15" />
                  {/* Center Right */}
                  <path d="M 905 190 L 915 190 M 910 185 L 910 195" opacity="0.15" />
                  {/* Center Top */}
                  <path d="M 525 40 L 535 40 M 530 35 L 530 45" opacity="0.15" />
                  {/* Center Bottom */}
                  <path d="M 525 340 L 535 340 M 530 335 L 530 345" opacity="0.15" />
                  {/* Corner mini dots */}
                  <circle cx="30" cy="25" r="1.2" fill="rgba(255,255,255,0.02)" />
                  <circle cx="1030" cy="25" r="1.2" fill="rgba(255,255,255,0.02)" />
                  <circle cx="30" cy="355" r="1.2" fill="rgba(255,255,255,0.02)" />
                  <circle cx="1030" cy="355" r="1.2" fill="rgba(255,255,255,0.02)" />
                </g>

                {/* Faint technical HUD metrics */}
                <g fill="rgba(255,255,255,0.08)" fontSize="8" fontFamily="monospace" letterSpacing="2">
                  <text x="25" y="185" opacity="0.15">[ NODE_INPUT_STREAM ]</text>
                  <text x="1035" y="185" textAnchor="end" opacity="0.15">[ SYSTEM_OUTPUT_COMPILED ]</text>
                  <text x="530" y="28" textAnchor="middle" opacity="0.2">THUNDRA NEURAL PIPELINE V2.0</text>
                  <text x="530" y="362" textAnchor="middle" opacity="0.1">[ FPS: 120 // STATUS: OPERATIONAL ]</text>
                </g>
                
                {stepsList.map((item, idx) => {
                  const isActive = true; // All connections glow simultaneously
                  let d = "";
                  if (idx === 0) d = "M 350 90 C 400 90, 415 165, 455 165";
                  if (idx === 1) d = "M 350 290 C 400 290, 415 215, 455 215";
                  if (idx === 2) d = "M 710 90 C 660 90, 645 165, 605 165";
                  if (idx === 3) d = "M 710 290 C 660 290, 645 215, 605 215";
                  
                  return (
                    <g key={idx} className="transition-all duration-500">
                      {/* Laser shadow glow */}
                      <path 
                        d={d} 
                        fill="none" 
                        stroke={item.accent} 
                        strokeWidth={3.5}
                        className="transition-all duration-500"
                        filter="url(#glow-laser)"
                        opacity={0.85}
                      />
                      {/* Flowing animated signal dot */}
                      <path 
                        d={d} 
                        fill="none" 
                        stroke="#ffffff" 
                        strokeWidth={2.2}
                        className="glow-line-pulse"
                        opacity={0.95}
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Central Glowing Logo Circle */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] h-[180px] flex items-center justify-center z-10">
                <div 
                  className="absolute inset-0 rounded-full blur-[40px] opacity-[0.38] scale-105 pointer-events-none animate-pulse"
                  style={{
                    background: `radial-gradient(circle, #4FD1FF 0%, rgba(139,92,246,0.1) 45%, transparent 80%)`,
                    animationDuration: '3s'
                  }}
                />
                
                {/* Outer rotating neon orbits (Detailed astrolabe style) */}
                <div 
                  className="absolute w-[200px] h-[200px] rounded-full border border-dotted border-white/[0.02] animate-[spin_24s_linear_infinite]" 
                  style={{ 
                    borderTopColor: 'rgba(79, 209, 255, 0.25)', 
                    borderBottomColor: 'rgba(79, 209, 255, 0.25)',
                    borderWidth: '1.5px'
                  }}
                />
                <div 
                  className="absolute w-[170px] h-[170px] rounded-full border border-white/[0.04] animate-[spin_16s_linear_infinite]" 
                  style={{ 
                    borderTopColor: 'rgba(139, 92, 246, 0.35)', 
                    borderBottomColor: 'rgba(139, 92, 246, 0.35)',
                    borderWidth: '2.0px' 
                  }}
                />
                <div 
                  className="absolute w-[145px] h-[145px] rounded-full border border-dashed border-white/[0.03] animate-[spin_10s_linear_infinite_reverse]" 
                  style={{ 
                    borderLeftColor: 'rgba(79, 209, 255, 0.25)', 
                    borderRightColor: 'rgba(79, 209, 255, 0.25)',
                    borderWidth: '1.5px' 
                  }}
                />
                
                {/* Center Core Logo container */}
                <div 
                  className="w-[130px] h-[130px] rounded-full bg-gradient-to-br from-[#060814] via-[#0b0f24] to-[#03040a] border flex items-center justify-center relative group transition-all duration-500 hover:scale-105"
                  style={{ 
                    borderColor: 'rgba(79, 209, 255, 0.65)',
                    borderWidth: '2.5px',
                    boxShadow: '0 0 20px rgba(79, 209, 255, 0.35), inset 0 0 15px rgba(79, 209, 255, 0.15), 0 25px 60px rgba(0,0,0,0.95)'
                  }}
                >
                  {/* Concentric inner orbital rings & tech ticks */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 130 130">
                    <defs>
                      <filter id="glow-sparkle" x="-30%" y="-30%" width="160%" height="160%">
                        <feGaussianBlur stdDeviation="0.1" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>
                    
                    <circle cx="65" cy="65" r="46" fill="none" stroke="rgba(255,255,255,0.035)" strokeWidth="1" />
                    <circle cx="65" cy="65" r="54" fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="1.2" strokeDasharray="4 8" />
 
                    {/* Precision compass tick marks */}
                    <path d="M 65,4 L 65,11 M 65,119 L 65,126 M 4,65 L 11,65 M 119,65 L 126,65" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" opacity="0.6" />
 
                    {/* Orbiting sparkles / stars with dedicated glows */}
                    {/* Top-Left Star (Purple Theme) */}
                    <path 
                      d="M 32,26 Q 32,32 38,32 Q 32,32 32,38 Q 32,32 26,32 Q 32,32 32,26 Z" 
                      fill={stepsList[0].accent} 
                      className="animate-pulse" 
                      style={{ animationDuration: '3s' }}
                      filter="url(#glow-sparkle)"
                      opacity="0.1"
                    />
                    {/* Bottom-Right Star (Orange Theme) */}
                    <path 
                      d="M 98,98 Q 98,104 104,104 Q 98,104 98,110 Q 98,104 92,104 Q 98,104 98,98 Z" 
                      fill={stepsList[1].accent} 
                      className="animate-pulse" 
                      style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}
                      filter="url(#glow-sparkle)"
                      opacity="0.1"
                    />
                    {/* Bottom-Left Star (Cyan Theme) */}
                    <path 
                      d="M 28,96 Q 28,102 34,102 Q 28,102 28,108 Q 28,102 22,102 Q 28,102 28,96 Z" 
                      fill={stepsList[2].accent} 
                      className="animate-pulse" 
                      style={{ animationDuration: '3.5s', animationDelay: '1s' }}
                      filter="url(#glow-sparkle)"
                      opacity="0.1"
                    />
                    {/* Top-Right Star (Green Theme) */}
                    <path 
                      d="M 102,28 Q 102,34 108,34 Q 102,34 102,40 Q 102,34 96,34 Q 102,34 102,28 Z" 
                      fill={stepsList[3].accent} 
                      className="animate-pulse" 
                      style={{ animationDuration: '4s', animationDelay: '1.5s' }}
                      filter="url(#glow-sparkle)"
                      opacity="0.1"
                    />
                  </svg>
                  
                  {/* Glowing central Thundra logo icon */}
                  <ThundraLogo className="w-16 h-16 animate-[spin_20s_linear_infinite] drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)] relative z-10" />
                </div>
              </div>

              {/* Connected Steps Cards */}
              {stepsList.map((item, idx) => {
                const Icon = item.icon;
                const isActive = true; // All cards glow simultaneously
                
                let cardPosition = {};
                if (idx === 0) cardPosition = { left: '10px', top: '15px' };
                if (idx === 1) cardPosition = { left: '10px', top: '215px' };
                if (idx === 2) cardPosition = { right: '10px', top: '15px' };
                if (idx === 3) cardPosition = { right: '10px', top: '215px' };
                
                return (
                  <div 
                    key={idx}
                    style={{ ...cardPosition, position: 'absolute', width: '340px', height: '150px' }}
                    className="z-20 scale-100 hover:scale-[1.02] transition-transform duration-300"
                  >
                    <div 
                      style={{
                        borderColor: item.accent,
                        borderWidth: '2.5px',
                        boxShadow: `0 0 22px ${item.accent}35, inset 0 0 12px ${item.accent}15`,
                        background: '#0c0c1e'
                      }}
                      className="w-full h-full rounded-2xl border p-5 flex flex-col justify-between text-left transition-all duration-300 group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="p-3 rounded-2xl border flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
                            style={{ 
                              background: item.accentBg, 
                              borderColor: item.accent,
                              color: item.accent
                            }}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="text-left">
                            <h3 className="text-sm md:text-base font-black text-white uppercase tracking-wider">{item.title}</h3>
                            <span 
                              className="inline-block mt-1 px-1.5 py-0.5 rounded-md text-[8px] font-bold tracking-wider uppercase border font-mono transition-all duration-300"
                              style={{
                                background: item.accentBg,
                                borderColor: `${item.accent}35`,
                                color: item.accent
                              }}
                            >
                              {idx === 0 && '01: INPUT SOURCE'}
                              {idx === 1 && '02: USER PROMPT'}
                              {idx === 2 && '03: ORCHESTRATOR'}
                              {idx === 3 && '04: PRODUCTION'}
                            </span>
                          </div>
                        </div>
                        
                        <span 
                          className="font-mono text-3xl font-black select-none transition-all duration-300"
                          style={{ 
                            color: item.accent,
                            textShadow: `0 0 10px ${item.accent}40`
                          }}
                        >
                          {item.step}
                        </span>
                      </div>
                      
                      <p className="text-xs md:text-[13px] leading-relaxed font-body line-clamp-2 text-slate-100 font-bold">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SaaS Mockup Simulator */}
          <div className="space-y-6 pt-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-left space-y-1">
                <h2 className="text-xl md:text-2xl font-bold font-heading text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-purpleLight animate-[spin_8s_linear_infinite]" />
                  <span>Interactive Pipeline Simulator</span>
                </h2>
                <p className="text-xs text-slate-400 font-body">
                  Select a card above or toggle the steps below to simulate each step inside the Thundra AI workspace dashboard.
                </p>
              </div>

              <button 
                onClick={() => setAutoPlay(!autoPlay)}
                className={`px-3 py-1.5 rounded-lg border text-[10px] font-mono font-bold flex items-center gap-1.5 transition-colors ${
                  autoPlay 
                    ? 'bg-purpleTheme/10 border-purpleTheme/40 text-purpleLight' 
                    : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${autoPlay ? 'bg-purpleLight animate-pulse' : 'bg-slate-600'}`} />
                <span>{autoPlay ? 'AUTOPLAY ACTIVE' : 'AUTOPLAY PAUSED'}</span>
              </button>
            </div>

            <div className="border border-[#3D5A80]/20 bg-[#101826]/90 rounded-3xl overflow-hidden shadow-2xl p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[460px] relative backdrop-blur-md">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#3D5A80]/40 to-[#4FD1FF]/40" />

              {/* Left Column: Navigator Tabs */}
              <div className="lg:col-span-4 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 border-b lg:border-b-0 lg:border-r border-[#3D5A80]/15 pr-0 lg:pr-4 select-none scrollbar-none shrink-0">
                {stepsList.map((st, idx) => {
                  const isActive = activeStepTab === idx;
                  return (
                    <div 
                      key={idx}
                      onClick={() => {
                        setActiveStepTab(idx);
                        setAutoPlay(false);
                      }}
                      className={`flex-1 lg:flex-none flex items-center gap-3.5 p-3 rounded-xl border text-left cursor-pointer transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-r from-[#3D5A80]/10 to-[#4FD1FF]/5 border-[#3D5A80]/35 shadow-md'
                          : 'border-transparent hover:bg-white/[0.02]'
                      }`}
                    >
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-mono font-black"
                        style={{ 
                          background: isActive ? st.accentBg : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${isActive ? st.accentBorder : 'rgba(255,255,255,0.05)'}`,
                          color: isActive ? st.accent : 'rgba(255,255,255,0.4)'
                        }}
                      >
                        {st.step}
                      </div>
                      <div className="hidden sm:block">
                        <div className={`text-xs font-bold font-heading ${isActive ? 'text-white' : 'text-slate-400'}`}>
                          {st.title}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                          {idx === 0 && 'Upload bin'}
                          {idx === 1 && 'Text instruction'}
                          {idx === 2 && 'Automatic editor'}
                          {idx === 3 && 'ProRes / H.264 export'}
                        </div>
                      </div>
                      {isActive && <ChevronRight className="hidden lg:block w-4 h-4 ml-auto text-purpleLight" />}
                    </div>
                  );
                })}
              </div>

              {/* Right Column: Dynamic Mockup Display */}
              <div className="lg:col-span-8 flex flex-col justify-center relative min-h-[300px]">
                <AnimatePresence mode="wait">
                  {/* Step 1: Upload Mockup */}
                  {activeStepTab === 0 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.35 }}
                      className="space-y-4 w-full"
                    >
                      <div className="border border-dashed border-[#3D5A80]/40 rounded-2xl bg-black/40 p-8 flex flex-col items-center justify-center text-center space-y-4 shadow-inner">
                        <div className="w-12 h-12 rounded-full bg-[#3D5A80]/10 border border-[#3D5A80]/30 flex items-center justify-center text-[#F5EFE6] animate-bounce">
                          <Upload className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-white">Drag & drop your files here</p>
                          <p className="text-xs text-slate-500">Supports raw MP4, MOV, WAV voice recordings up to 500MB</p>
                        </div>
                        <div className="h-1 w-28 bg-[#3D5A80]/20 rounded-full overflow-hidden font-sans">
                          <div className="h-full bg-[#4FD1FF]" style={{ width: '40%' }} />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3.5">
                        <div className="bg-slate-950/60 border border-white/[0.05] rounded-xl p-3 flex items-center justify-between text-left">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Film className="w-4 h-4 text-purpleLight shrink-0" />
                            <span className="font-mono text-xs text-slate-350 truncate">raw_footage_01.mp4</span>
                          </div>
                          <span className="text-[10px] text-emerald-400 font-mono font-bold">100% READY</span>
                        </div>
                        <div className="bg-slate-950/60 border border-white/[0.05] rounded-xl p-3 flex items-center justify-between text-left">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Music className="w-4 h-4 text-blue-400 shrink-0" />
                            <span className="font-mono text-xs text-slate-350 truncate">voiceover_mic.wav</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                            <span className="text-[10px] text-amber-400 font-mono font-bold">92% UPLOADING</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Prompt Input Mockup */}
                  {activeStepTab === 1 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.35 }}
                      className="space-y-4 w-full text-left"
                    >
                      <div className="bg-black/60 border border-purpleTheme/20 rounded-2xl p-5 space-y-4 shadow-xl">
                        <div className="flex items-center gap-2 border-b border-white/[0.05] pb-3">
                          <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                            <MessageSquare className="w-4 h-4" />
                          </div>
                          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider font-bold">Thundra Prompt Editor</span>
                        </div>

                        <div className="space-y-3.5">
                          <div className="flex justify-end">
                            <div className="max-w-[85%] bg-amber-500/15 border border-amber-500/35 px-4.5 py-3 rounded-2xl rounded-tr-none text-sm font-mono text-amber-100 flex items-center gap-2.5 shadow-md">
                              <span>{typedPrompt}</span>
                              <span className="w-1.5 h-4 bg-amber-400 shadow-[0_0_8px_#f59e0b] animate-pulse inline-block" />
                            </div>
                          </div>

                          {typingIndex >= 25 && (
                            <motion.div 
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex justify-start items-start gap-2.5"
                            >
                              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purpleTheme to-blueTheme flex items-center justify-center text-[10px] font-black text-white shrink-0 shadow-md">AI</div>
                              <div className="bg-slate-900 border border-white/[0.06] px-4.5 py-3 rounded-2xl rounded-tl-none text-xs text-slate-300 leading-relaxed max-w-[80%]">
                                prompt acknowledged. Setting color profile to warm lofi, trimming silences, and overlaying Urdu captions.
                                <span className="block mt-1.5 text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">✔ PIPELINE LOCK</span>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        {['✂️ Remove pause silent zones', '💬 English subtitle presets', '🎨 Warm cinematic LUT', '🎵 Dynamic tempo beat sync'].map((sg, idx) => (
                          <div key={idx} className="px-3 py-1.5 rounded-lg bg-slate-950 border border-white/[0.03] text-[10px] font-mono text-slate-500 hover:border-amber-500/40 hover:text-amber-400 transition-colors cursor-pointer select-none">
                            {sg}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Auto-Edit Mockup */}
                  {activeStepTab === 2 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.35 }}
                      className="space-y-4 w-full text-left"
                    >
                      <div className="bg-black/50 border border-purpleTheme/15 rounded-2xl p-4.5 space-y-4 shadow-xl">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
                            AI PIPELINE PROCESSING
                          </span>
                          <span className="text-slate-500">Timeline edit: 20s segment</span>
                        </div>

                        <div className="space-y-2">
                          {[
                            { task: "Transcribing speech & alignment", status: "done" },
                            { task: "Trimming silences & pauses (32 pauses cut)", status: "done" },
                            { task: "Searching stock B-rolls & matching semantic tags", status: "active" },
                            { task: "Applying 3D LUT grading profile (Rec. 709)", status: "pending" }
                          ].map((tk, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-2 bg-slate-950/40 border border-white/[0.03] rounded-lg">
                              <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border ${
                                tk.status === 'done' 
                                  ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400' 
                                  : tk.status === 'active'
                                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-400 animate-pulse'
                                    : 'border-slate-800 text-slate-700'
                              }`}>
                                {tk.status === 'done' ? <Check size={10} strokeWidth={4} /> : tk.status === 'active' ? '•' : ''}
                              </div>
                              <span className={`text-[11px] font-mono truncate ${
                                tk.status === 'done' ? 'text-slate-500 line-through' : tk.status === 'active' ? 'text-white font-bold' : 'text-slate-600'
                              }`}>
                                {tk.task}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="h-10 bg-slate-950 rounded-xl border border-white/[0.04] p-2 flex items-center gap-1.5 overflow-hidden">
                        <div className="text-[8px] font-mono text-cyan-400 shrink-0">WAVEFORM:</div>
                        <div className="flex-1 flex items-end justify-between h-full px-1">
                          {Array.from({ length: 42 }).map((_, i) => {
                            const isSilent = i > 12 && i < 18;
                            const h = isSilent ? 2 : Math.max(3, Math.abs(Math.sin(i * 0.3)) * 20 + 3);
                            return (
                              <div key={i} style={{
                                width: 3,
                                height: `${h}px`,
                                background: isSilent ? '#ef4444' : 'linear-gradient(to top, #06B6D4, #3B82F6)',
                                opacity: isSilent ? 0.3 : 0.8,
                                borderRadius: 1
                              }} />
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 4: Export Mockup */}
                  {activeStepTab === 3 && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.35 }}
                      className="space-y-4 w-full"
                    >
                      <div className="bg-[#0b1a13]/40 border border-emerald-500/25 rounded-2xl p-6 text-center space-y-5 shadow-2xl relative">
                        <div className="absolute top-3 right-3 bg-emerald-500/20 border border-emerald-500/40 text-[9px] font-mono text-emerald-400 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Finished
                        </div>

                        <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                          <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                        </div>
                        
                        <div className="space-y-1">
                          <h3 className="text-base font-extrabold text-white">Video export ready!</h3>
                          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                            Timeline processed at 120 FPS. Captions synced, audio equalized, and color grading applied successfully.
                          </p>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-left max-w-xs mx-auto border-t border-emerald-500/10 pt-4 text-[10px] font-mono text-slate-400">
                          <div>
                            <span className="text-slate-600 block text-[8px] uppercase">Format</span>
                            <span className="font-bold text-slate-200">MP4 (H.264)</span>
                          </div>
                          <div>
                            <span className="text-slate-600 block text-[8px] uppercase">Resolution</span>
                            <span className="font-bold text-slate-200">4K Ultra HD</span>
                          </div>
                          <div>
                            <span className="text-slate-600 block text-[8px] uppercase">File size</span>
                            <span className="font-bold text-slate-200">18.4 MB</span>
                          </div>
                        </div>

                        <button 
                          onClick={() => navigate('/projects')}
                          className="w-full max-w-xs mx-auto flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white shadow-lg shadow-emerald-500/20 hover:scale-[1.03] transition-transform"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download final video</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

        </main>
      </div>

      {/* COMPREHENSIVE FOOTER */}
      <Footer />
    </div>
  );
}
