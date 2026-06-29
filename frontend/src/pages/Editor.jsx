import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, Download, Sparkles, Upload, FileVideo, 
  MessageSquare, Layers, Check,
  ArrowRight, RefreshCw, Maximize, 
  Clock, Trash, Plus, CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import ThundraLogo from '../components/ThundraLogo';



const SUGGESTIONS = [
  "✂️ Remove Silences",
  "💬 Add Urdu Captions",
  "💬 Add English Captions",
  "🎥 Make Video Cinematic",
  "📱 Create Instagram Reel",
  "🎵 Add Background Music",
  "🎬 Add B-roll Footage",
  "✨ Improve Video Quality",
  "🎞️ Add Smooth Transitions",
  "🔥 Make Video More Engaging"
];

const PROCESSING_STEPS = [
  "Analyzing Video...",
  "Detecting Speech...",
  "Finding Silent Sections...",
  "Creating Edit Plan...",
  "Generating Captions...",
  "Selecting Music...",
  "Adding B-roll...",
  "Applying Effects...",
  "Finalizing Video..."
];

const MOCK_ASSETS_RECOMMENDED = {
  broll: [
    { name: "Camera Tripod Setup", category: "B-roll", duration: "5s", img: "https://assets.mixkit.co/videos/preview/mixkit-hands-setting-up-a-camera-tripod-40898-large.mp4" },
    { name: "Keyboard Typing Glow", category: "B-roll", duration: "5s", img: "https://assets.mixkit.co/videos/preview/mixkit-hands-typing-on-computer-keyboard-40613-large.mp4" }
  ],
  music: [
    { name: "Cyberpunk Synthwave", category: "Music", mood: "Futuristic" },
    { name: "Lofi Chill Cafe", category: "Music", mood: "Relaxed" }
  ],
  captions: [
    { name: "🔥 Viral Yellow", category: "Subtitles" },
    { name: "🔳 Clean Box", category: "Subtitles" }
  ]
};

export default function Editor() {
  const navigate = useNavigate();
  const location = useLocation();

  // Workflow state
  const [activeMenu, setActiveMenu] = useState('upload');
  const [workflowStep, setWorkflowStep] = useState(1);

  // Upload state
  const [uploadFile, setUploadFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // AI Chat state
  const [chatMessages, setChatMessages] = useState([
    { sender: 'ai', text: "Hi! I'm your Thundra AI Editor assistant. Upload a raw video and tell me how you'd like me to edit it (e.g. 'remove silences and add Urdu captions')." }
  ]);
  const [userInput, setUserInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [activeProcessingIndex, setActiveProcessingIndex] = useState(0);

  // Preview state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [previewMode, setPreviewMode] = useState('after');
  const duration = 20;

  // Asset selections
  const [selectedMusic, setSelectedMusic] = useState("Lofi Chill Cafe Beats");
  const [selectedCaptionStyle, setSelectedCaptionStyle] = useState("viral-yellow");

  // Export state
  const [exportQuality, setExportQuality] = useState('1080p');
  const [exportFormat, setExportFormat] = useState('MP4');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStep, setExportStep] = useState(0);
  const [exportComplete, setExportComplete] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState(null);

  // Refs
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const chatBottomRef = useRef(null);
  const playPromiseRef = useRef(null);

  // Load project from router state
  useEffect(() => {
    if (location.state && location.state.projectPlan) {
      const plan = location.state.projectPlan;
      setUploadFile({
        name: `${plan.title.replace(/\s+/g, "_")}_raw.mp4`,
        size: "42.8 MB",
        duration: "20s",
        resolution: "1080p",
        thumbnail: plan.scenes?.[0]?.mediaUrl
      });
      setChatMessages(prev => [
        ...prev,
        { sender: 'user', text: plan.prompt },
        { sender: 'ai', text: `Loaded editing plan: ${plan.title}. I've processed your edits. Let's preview the final studio!` }
      ]);
      setWorkflowStep(4);
      setActiveMenu('ai-editor');
    }
  }, [location]);

  // Chat scroll sync
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handlePlayPause = () => setIsPlaying(!isPlaying);

  useEffect(() => {
    if (!videoRef.current) return;
    if (isPlaying) {
      playPromiseRef.current = videoRef.current.play();
      if (playPromiseRef.current !== undefined) {
        playPromiseRef.current.catch((err) => {
          if (err.name !== 'AbortError') {
            console.warn("Video playback error:", err);
          }
          setIsPlaying(false);
        });
      }
    } else {
      try {
        if (playPromiseRef.current !== null) {
          playPromiseRef.current.then(() => {
            videoRef.current?.pause();
          }).catch(() => {
            videoRef.current?.pause();
          });
        } else {
          videoRef.current.pause();
        }
      } catch (e) {}
    }
  }, [isPlaying]);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        if (videoRef.current) {
          const t = videoRef.current.currentTime;
          if (t >= duration) {
            videoRef.current.currentTime = 0;
            setCurrentTime(0);
          } else {
            setCurrentTime(t);
          }
        }
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Upload handlers
  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e) => {
    e.preventDefault();
    if (isUploading) return;
    const file = e.dataTransfer.files[0];
    if (file) startMockUpload(file.name);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) startMockUpload(file.name);
  };

  const startMockUpload = (fileName) => {
    setIsUploading(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadFile({
            name: fileName,
            size: "34.5 MB",
            duration: "20s",
            resolution: "1080p",
            thumbnail: "https://assets.mixkit.co/videos/preview/mixkit-hands-typing-on-computer-keyboard-40613-large.mp4"
          });
          setChatMessages(prevMsgs => [
            ...prevMsgs,
            { sender: 'ai', text: `Successfully uploaded: **${fileName}**. Now tell me what cuts or edits you'd like me to make!` }
          ]);
          setWorkflowStep(2);
          setActiveMenu('ai-editor');
          showToast("🎥 Video uploaded successfully!");
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  // Prompt/chat handler
  const handleSendPrompt = (textToSend) => {
    const text = textToSend || userInput;
    if (!text.trim()) return;
    setChatMessages(prev => [...prev, { sender: 'user', text }]);
    setUserInput("");
    setTimeout(() => {
      setIsProcessing(true);
      setWorkflowStep(3);
      setProcessingProgress(0);
      setActiveProcessingIndex(0);
    }, 500);
  };

  // Processing simulation
  useEffect(() => {
    if (isProcessing) {
      const timer = setInterval(() => {
        setProcessingProgress(prev => {
          const next = prev + (100 / PROCESSING_STEPS.length);
          const activeIndex = Math.min(Math.floor(next / (100 / PROCESSING_STEPS.length)), PROCESSING_STEPS.length - 1);
          setActiveProcessingIndex(activeIndex);
          if (next >= 100) {
            clearInterval(timer);
            setIsProcessing(false);
            setWorkflowStep(4);
            setChatMessages(prevMsgs => [
              ...prevMsgs,
              { sender: 'ai', text: "Edits compiled! I've removed silences, added Urdu captions, synced background lofi beats, and color graded. Preview the studio below." }
            ]);
            showToast("✨ AI Editing completed successfully!");
            return 100;
          }
          return next;
        });
      }, 600);
      return () => clearInterval(timer);
    }
  }, [isProcessing]);

  // Export simulation
  const handleRunExport = () => {
    setIsExporting(true);
    setExportProgress(0);
    setExportStep(0);
    setExportComplete(false);
    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setExportComplete(true);
          confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
          return 100;
        }
        const step = Math.min(Math.floor(prev / 33), 2);
        setExportStep(step);
        return prev + 5;
      });
    }, 150);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDownloadVideoMock = () => showToast("⬇️ Video Preview download initiated!");
  const handleDownloadReport = () => showToast("⬇️ Downloaded project edit list report!");

  const handleResetProject = () => {
    setUploadFile(null);
    setWorkflowStep(1);
    setActiveMenu('upload');
    setChatMessages([{ sender: 'ai', text: "Hi! I'm your Thundra AI Editor assistant. Upload a raw video and tell me how you'd like me to edit it." }]);
    setIsExporting(false);
    setExportComplete(false);
  };

  // Timeline playhead
  const playheadPct = duration > 0 ? (currentTime / duration) * 100 : 0;

  /* ─────────────────────────────────────────────────── */
  /*  RENDER                                             */
  /* ─────────────────────────────────────────────────── */
  return (
    <div className="flex flex-col h-screen bg-transparent text-slate-100 font-body select-none overflow-hidden">

      {/* ═══════════════════════════════════════════════ */}
      {/* TOP WINDOW / TITLE BAR                         */}
      {/* ═══════════════════════════════════════════════ */}
      <header className="h-[44px] bg-[#080c14]/80 backdrop-blur-md border-b border-white/[0.05] flex items-center justify-between px-4 shrink-0 z-30 relative shadow-sm">
        {/* macOS window dots */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57] hover:opacity-75 cursor-pointer shadow-[0_0_6px_rgba(255,95,87,0.5)] transition-opacity" />
            <div className="w-3 h-3 rounded-full bg-[#FEBC2E] hover:opacity-75 cursor-pointer shadow-[0_0_5px_rgba(254,188,46,0.4)] transition-opacity" />
            <div className="w-3 h-3 rounded-full bg-[#28C840] hover:opacity-75 cursor-pointer shadow-[0_0_5px_rgba(40,200,64,0.4)] transition-opacity" />
          </div>
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500">
            <button onClick={() => navigate('/projects')} className="hover:text-slate-300 transition-colors">projects</button>
            <span className="text-slate-700">/</span>
            <h1 className="flex items-center gap-1.5 text-slate-200 font-semibold">
              <div className="w-4 h-4 rounded-sm bg-purpleTheme/70 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 10 10" className="w-2.5 h-2.5" fill="none">
                  <rect x="1" y="1" width="3.5" height="3.5" rx="0.5" fill="white" opacity="0.9"/>
                  <rect x="5.5" y="1" width="3.5" height="3.5" rx="0.5" fill="white" opacity="0.5"/>
                  <rect x="1" y="5.5" width="3.5" height="3.5" rx="0.5" fill="white" opacity="0.5"/>
                  <rect x="5.5" y="5.5" width="3.5" height="3.5" rx="0.5" fill="white" opacity="0.7"/>
                </svg>
              </div>
              <span>{uploadFile ? uploadFile.name.replace(/\.[^.]+$/, '.proj') : 'thundra_new.proj'}</span>
            </h1>
          </div>
        </div>

        {/* Center status badge */}
        <div className="hidden md:block absolute left-1/2 -translate-x-1/2">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${
            workflowStep >= 4 ? 'bg-green-500/10 border-green-500/30 text-green-400'
            : workflowStep >= 3 ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
            : 'bg-purpleTheme/10 border-purpleTheme/30 text-purpleLight'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              workflowStep >= 4 ? 'bg-green-400 shadow-[0_0_5px_#4ade80]'
              : workflowStep >= 3 ? 'bg-amber-400 animate-ping'
              : 'bg-blueTheme shadow-[0_0_5px_rgba(79,209,255,0.8)] animate-pulse'
            }`} />
            {workflowStep >= 5 ? 'Export Ready'
              : workflowStep >= 4 ? 'Render Complete'
              : workflowStep >= 3 ? 'AI Processing'
              : workflowStep >= 2 ? 'Awaiting Prompt'
              : 'Awaiting Upload'}
          </div>
        </div>

        {/* Right: badges */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 text-[10px] font-mono text-green-400 bg-black/30 border border-green-500/15 px-2.5 py-1 rounded-lg">
            <span className="text-slate-600 mr-0.5">SAVED</span>
            <span className="font-black">4h 21m</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-mono text-purpleLight bg-purpleTheme/10 border border-purpleTheme/25 px-2.5 py-1 rounded-lg font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-purpleLight shrink-0 animate-pulse" />
            {exportQuality}
          </div>
          <div className="flex items-center gap-1 text-[10px] font-mono text-blueTheme bg-blueTheme/10 border border-blueTheme/20 px-2.5 py-1 rounded-lg font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-blueTheme shrink-0" />
            30fps
          </div>
        </div>
      </header>


      {/* ═══════════════════════════════════════════════ */}
      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* ── COL A: ICON NAV RAIL (48px) ── */}
        <aside className="w-12 bg-[#080c14]/85 backdrop-blur-md border-r border-white/[0.04] flex flex-col items-center py-3 gap-1 shrink-0 z-20 shadow-sm">
          <Link to="/" className="mb-3">
            <ThundraLogo className="w-7 h-7 hover:rotate-6 transition-transform duration-300" />
          </Link>
          {[
            { id: 'upload', Icon: Upload, tip: 'Upload', step: 1 },
            { id: 'ai-editor', Icon: MessageSquare, tip: 'AI Chat', step: 2 },
            { id: 'assets', Icon: Layers, tip: 'Assets', step: 4 },
            { id: 'export', Icon: Download, tip: 'Export', step: 5 },
          ].map(({ id, Icon, tip, step }) => {
            const isActive = activeMenu === id;
            const isLocked = step && workflowStep < step;
            return (
              <button
                key={id} title={tip}
                disabled={isLocked}
                onClick={() => setActiveMenu(id)}
                className={`relative w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 ${
                  isActive ? 'bg-gradient-to-r from-purpleTheme to-blueTheme text-white shadow-lg shadow-blueTheme/15'
                  : isLocked ? 'opacity-20 cursor-not-allowed text-slate-700'
                  : 'text-slate-500 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {workflowStep > step && step > 1 && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-green-400 border border-[#080c14] shadow-[0_0_4px_#4ade80]" />
                )}
              </button>
            );
          })}
          <div className="flex-1" />
          <button title="Projects" onClick={() => navigate('/projects')} className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-600 hover:text-white hover:bg-white/[0.05] transition-all">
            <Clock className="w-3.5 h-3.5" />
          </button>
        </aside>

        {/* ── COL B: MEDIA BIN (212px) ── */}
        <aside className="hidden lg:flex w-[212px] bg-secondaryBg/40 backdrop-blur-md border-r border-white/[0.04] flex-col shrink-0 overflow-hidden">
          {/* Header */}
          <div className="px-3 py-2.5 border-b border-white/[0.04] flex items-center justify-between shrink-0">
            <span className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-500">Media Bin</span>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-5 h-5 rounded-md bg-blueTheme/15 border border-blueTheme/25 flex items-center justify-center text-blueTheme hover:bg-blueTheme/30 transition-colors"
              title="Import file"
            >
              <Plus className="w-3 h-3" />
            </button>
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} accept="video/*" />
          </div>

          {/* File list */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {/* Uploaded file card */}
            {uploadFile ? (
              <div
                className="group rounded-xl border border-white/[0.05] bg-secondaryBg/80 p-2.5 cursor-pointer hover:border-blueTheme/30 transition-all relative overflow-hidden before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent"
                onClick={() => setActiveMenu('ai-editor')}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purpleTheme/20 border border-purpleTheme/35 flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none">
                      <rect x="1" y="1" width="10" height="13" rx="1.5" fill="#3D5A80" opacity="0.5"/>
                      <path d="M5.5 6.5l5 2.5-5 2.5V6.5z" fill="white" opacity="0.85"/>
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold text-white truncate">{uploadFile.name}</p>
                    <p className="text-[9px] text-slate-500 font-mono">{uploadFile.size} · {uploadFile.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-2 pt-1.5 border-t border-white/[0.04]">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_4px_#4ade80]" />
                  <span className="text-[8px] font-black text-green-400 uppercase tracking-wider">READY</span>
                  <div className="ml-auto flex items-center gap-1">
                    <span className="text-[8px] font-mono text-slate-600">{uploadFile.resolution}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="rounded-xl border border-white/[0.06] bg-white/[0.01] p-5 text-center cursor-pointer hover:border-blueTheme/30 hover:bg-blueTheme/[0.02] transition-all space-y-2"
              >
                <div className="w-8 h-8 mx-auto rounded-full bg-blueTheme/15 flex items-center justify-center">
                  <Upload className="w-4 h-4 text-blueTheme" />
                </div>
                <p className="text-[9px] text-slate-600 leading-relaxed">Drop video or click<br/>to import</p>
              </div>
            )}

            {/* Stock assets */}
            {[
              { name: 'lofi_beat.wav', size: '4MB', type: 'audio', color: '#4FD1FF' },
              { name: 'broll_laser.mp4', size: '12MB', type: 'video', color: '#D4A574' },
              { name: 'broll_keyboard.mp4', size: '8MB', type: 'video', color: '#4FD1FF' },
              { name: 'caption_urdu.srt', size: '24KB', type: 'caption', color: '#F5EFE6' },
            ].map((asset, i) => (
              <div
                key={i}
                className="group rounded-xl border border-white/[0.04] bg-white/[0.015] p-2.5 cursor-pointer hover:border-white/[0.08] hover:bg-white/[0.03] transition-all"
                onClick={() => showToast(`✅ Added ${asset.name} to timeline`)}
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all" style={{ background: `${asset.color}15`, border: `1px solid ${asset.color}35` }}>
                    {asset.type === 'audio' ? (
                      <svg viewBox="0 0 12 12" className="w-3.5 h-3.5" fill="none" stroke={asset.color} strokeWidth="1.5"><path d="M6 1v7M4 3v3M8 3v3M2 5v1M10 5v1" strokeLinecap="round"/></svg>
                    ) : asset.type === 'caption' ? (
                      <svg viewBox="0 0 12 12" className="w-3.5 h-3.5" fill="none" stroke={asset.color} strokeWidth="1.5"><path d="M2 3h8M2 6h5M2 9h7" strokeLinecap="round"/></svg>
                    ) : (
                      <svg viewBox="0 0 12 12" className="w-3.5 h-3.5" fill="none">
                        <rect x="1" y="2" width="8" height="8" rx="1" fill={asset.color} opacity="0.35"/>
                        <path d="M4.5 5l4 2-4 2V5z" fill={asset.color}/>
                      </svg>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-semibold text-slate-300 truncate">{asset.name}</p>
                    <p className="text-[9px] text-slate-600 font-mono">{asset.size}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Workflow tracker */}
            <div className="pt-3 mt-1 border-t border-white/[0.04] space-y-1">
              <p className="text-[8px] font-black uppercase tracking-[0.18em] text-slate-700 px-0.5">Workflow</p>
              {[
                { step: 1, label: 'Upload' },
                { step: 2, label: 'Prompt' },
                { step: 3, label: 'Processing' },
                { step: 4, label: 'Preview' },
                { step: 5, label: 'Export' },
              ].map((item, idx, arr) => {
                const isDone = workflowStep > item.step;
                const isActive = workflowStep === item.step;
                const isLast = idx === arr.length - 1;
                return (
                  <div key={item.step} className="flex gap-2">
                    <div className="flex flex-col items-center shrink-0">
                      <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border transition-all ${
                        isDone ? 'bg-green-500 border-green-400 shadow-[0_0_5px_rgba(74,222,128,0.4)]'
                        : isActive ? 'bg-purpleTheme border-purpleLight shadow-[0_0_6px_rgba(79,209,255,0.4)] animate-pulse'
                        : 'bg-transparent border-slate-700'
                      }`}>
                        {isDone && <svg viewBox="0 0 8 8" className="w-2 h-2"><polyline points="1,4 3,6 7,2" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>}
                        {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      {!isLast && <div className={`w-px h-4 mt-0.5 ${isDone ? 'bg-green-500/30' : 'bg-slate-800'}`} />}
                    </div>
                    <div className="pb-3">
                      <span className={`text-[9px] font-semibold leading-none ${isDone ? 'text-green-400' : isActive ? 'text-white' : 'text-slate-600'}`}>{item.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* ── COL C: CENTER — VIDEO PREVIEW + TIMELINE ── */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

          {/* CENTER TOP: WORKFLOW / VIDEO CONTENT */}
          <div className="flex-1 min-h-0 overflow-hidden relative bg-transparent">

            <AnimatePresence mode="wait">

              {/* STAGE 1: UPLOAD */}
              {activeMenu === 'upload' && (
                <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center p-6 space-y-6 relative z-10">
                  {!uploadFile ? (
                    <div
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`relative border-2 border-dashed rounded-3xl w-full max-w-lg aspect-video flex flex-col items-center justify-center cursor-pointer transition-all ${
                        isUploading ? 'border-blueTheme bg-blueTheme/[0.04]'
                        : 'border-white/[0.08] hover:border-blueTheme/30 hover:bg-blueTheme/[0.02]'
                      }`}
                    >
                      {isUploading ? (
                        <div className="space-y-4 text-center px-8 w-full">
                          <RefreshCw className="w-10 h-10 text-blueTheme animate-spin mx-auto" />
                          <p className="text-sm font-bold text-white">Uploading raw footage...</p>
                          <div className="w-full max-w-xs mx-auto space-y-1">
                            <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-purpleTheme to-blueTheme rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
                            </div>
                            <span className="text-xs text-slate-500 font-mono">{uploadProgress}%</span>
                          </div>
                        </div>
                      ) : (
                        <>
                          {/* Film strip icon */}
                          <div className="mb-4 opacity-[0.18]">
                            <svg viewBox="0 0 80 56" className="w-20 h-14" fill="none">
                              <rect x="2" y="2" width="76" height="52" rx="4" stroke="white" strokeWidth="2"/>
                              {[0,1,2,3].map(i => <rect key={i} x={8 + i * 18} y="8" width="10" height="8" rx="1" fill="white" opacity="0.4"/>)}
                              {[0,1,2,3].map(i => <rect key={i} x={8 + i * 18} y="40" width="10" height="8" rx="1" fill="white" opacity="0.4"/>)}
                              <path d="M32 22l16 6-16 6V22z" fill="white" opacity="0.5"/>
                            </svg>
                          </div>
                          <p className="text-sm font-bold text-slate-400 font-mono tracking-wide">Awaiting AI Prompt...</p>
                          <p className="text-xs text-slate-600 mt-1">Drop a video file here or click to browse</p>
                          <div className="absolute bottom-4 text-[9px] font-mono text-slate-700">MP4 · MOV · AVI · WebM</div>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="w-full max-w-lg space-y-3">
                      <div className="relative rounded-2xl overflow-hidden border border-white/[0.05] bg-black aspect-video shadow-[0_8px_30px_rgb(7,11,18,0.7)]">
                        <video src={uploadFile.thumbnail} muted loop className="w-full h-full object-cover opacity-60" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent" />
                        <div className="absolute bottom-3 left-3 flex items-center gap-2">
                          <span className="text-[9px] font-mono bg-black/70 text-slate-400 px-2 py-0.5 rounded">RAW</span>
                          <span className="text-[9px] font-mono text-white font-bold truncate max-w-[200px]">{uploadFile.name}</span>
                        </div>
                        <span className="absolute top-3 right-3 text-[9px] font-mono bg-green-500/15 border border-green-500/35 text-green-400 px-2 py-0.5 rounded-full">● READY</span>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setUploadFile(null)} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-500 hover:text-red-400 transition-colors">
                          <Trash className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => { setActiveMenu('ai-editor'); setWorkflowStep(2); }}
                          className="flex-1 bg-gradient-to-r from-purpleTheme to-blueTheme px-5 py-2.5 rounded-xl font-bold text-xs text-white flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-blueTheme/15 transition-all"
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>Next: Ask AI Editor</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* STAGE 2: AI CHAT / PROCESSING / PREVIEW */}
              {activeMenu === 'ai-editor' && (
                <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col relative z-10">

                  {/* ── PROCESSING STATE ── */}
                  {isProcessing ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-6 text-center">
                      <div className="space-y-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold text-blueTheme bg-blueTheme/10 border border-blueTheme/20 uppercase animate-pulse">
                          <Sparkles className="w-3 h-3" /> AI Compiling Edits
                        </span>
                        <h2 className="text-xl font-black text-white">Thundra is editing your video...</h2>
                        <p className="text-xs text-slate-500 max-w-xs mx-auto">Speech detection · Caption sync · Beat matching · Color grading</p>
                      </div>
                      <div className="relative w-24 h-24 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90">
                          <circle cx="48" cy="48" r="40" stroke="rgba(61,90,128,0.12)" strokeWidth="6" fill="transparent"/>
                          <circle cx="48" cy="48" r="40" stroke="url(#pg)" strokeWidth="7" fill="transparent"
                            strokeDasharray={251.2}
                            strokeDashoffset={251.2 - (251.2 * processingProgress) / 100}
                            strokeLinecap="round"
                          />
                          <defs><linearGradient id="pg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#3D5A80"/><stop offset="100%" stopColor="#4FD1FF"/></linearGradient></defs>
                        </svg>
                        <span className="absolute text-xl font-black text-white">{Math.round(processingProgress)}%</span>
                      </div>
                      <div className="bg-secondaryBg/80 border border-white/[0.05] rounded-2xl p-4 w-full max-w-sm space-y-2 font-mono text-xs">
                        {PROCESSING_STEPS.map((step, idx) => {
                          const isCur = idx === activeProcessingIndex;
                          const isDone = idx < activeProcessingIndex;
                          return (
                            <div key={idx} className={`flex items-center justify-between gap-2 transition-colors ${isCur ? 'text-blueTheme' : isDone ? 'text-green-400 opacity-60' : 'text-slate-700'}`}>
                              <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full border flex items-center justify-center shrink-0 ${isCur ? 'border-blueTheme bg-blueTheme/10 animate-pulse' : isDone ? 'border-green-500 bg-green-500/15' : 'border-slate-800'}`}>
                                  {isDone && <svg viewBox="0 0 8 8" className="w-2 h-2"><polyline points="1,4 3,6 7,2" stroke="#4ade80" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>}
                                  {isCur && <div className="w-1.5 h-1.5 rounded-full bg-blueTheme" />}
                                </div>
                                <span className={`text-[10px] ${isCur ? 'font-bold' : ''}`}>{step}</span>
                              </div>
                              <span className="text-[9px] shrink-0">{isCur ? 'Running...' : isDone ? 'Done' : '—'}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                  ) : workflowStep < 4 ? (
                    /* ── CHAT MODE ── */
                    <div className="flex-1 flex flex-col min-h-0 p-4 space-y-3">
                      <div className="flex-1 overflow-y-auto space-y-3 min-h-0 pr-1">
                        {chatMessages.map((msg, idx) => (
                          <div key={idx} className={`flex items-start gap-2.5 max-w-[88%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                            {msg.sender === 'ai' && (
                              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purpleTheme to-blueTheme flex items-center justify-center shrink-0 text-[8px] font-black text-white shadow-md shadow-purpleTheme/10">AI</div>
                            )}
                            <div className={`px-3 py-2 rounded-xl text-xs leading-relaxed ${
                              msg.sender === 'user'
                                ? 'bg-purpleTheme text-white shadow shadow-purpleTheme/20'
                                : 'bg-secondaryBg/80 border border-white/[0.05] text-slate-300'
                            }`}>
                              {msg.text}
                            </div>
                          </div>
                        ))}
                        <div ref={chatBottomRef} />
                      </div>
                      {/* Suggestion chips */}
                      <div className="flex flex-wrap gap-1.5 shrink-0">
                        {SUGGESTIONS.slice(0, 6).map((s) => (
                          <button key={s} onClick={() => handleSendPrompt(s)}
                            className="text-[10px] px-3 py-1.5 rounded-full border border-purpleTheme/15 bg-purpleTheme/[0.04] text-slate-400 hover:border-purpleTheme/35 hover:text-white hover:bg-purpleTheme/[0.08] transition-all">
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                  ) : (
                    /* ── PREVIEW STUDIO ── */
                    <div className="flex-1 flex flex-col min-h-0 p-3 space-y-2.5">
                      {/* Before/After bar */}
                      <div className="flex items-center justify-between bg-black/40 border border-white/[0.05] rounded-xl p-2 shrink-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] text-slate-600 font-mono uppercase">Preview</span>
                          <div className="flex bg-black/60 p-0.5 rounded-lg border border-white/[0.05]">
                            {['before', 'after'].map((mode) => (
                              <button key={mode} onClick={() => { setPreviewMode(mode); showToast(`Swapped to ${mode === 'before' ? 'Raw' : 'AI Edited'}`); }}
                                className={`px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider transition-all ${
                                  previewMode === mode
                                    ? mode === 'after' ? 'bg-blueTheme text-black shadow font-bold' : 'bg-slate-800 text-white'
                                    : 'text-slate-600 hover:text-slate-400'
                                }`}>
                                {mode === 'before' ? 'Before' : 'After ✨'}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-slate-500">{currentTime.toFixed(1)}s / {duration}s</span>
                          <button onClick={handlePlayPause} className="p-1.5 rounded-lg bg-blueTheme/15 border border-blueTheme/25 text-blueTheme hover:bg-blueTheme/25 transition-colors">
                            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-blueTheme" />}
                          </button>
                          <button onClick={() => { if (videoRef.current) { if (document.fullscreenElement) document.exitFullscreen(); else videoRef.current.requestFullscreen().catch(() => {}); } }} className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors">
                            <Maximize className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Video player */}
                      <div className="flex-1 min-h-0 rounded-2xl overflow-hidden border border-white/[0.05] bg-black relative group shadow-[0_8px_30px_rgba(7,11,18,0.8)]">
                        <video ref={videoRef}
                          src={previewMode === 'after'
                            ? "https://assets.mixkit.co/videos/preview/mixkit-abstract-laser-lights-background-41712-large.mp4"
                            : "https://assets.mixkit.co/videos/preview/mixkit-hands-typing-on-computer-keyboard-40613-large.mp4"}
                          muted loop playsInline
                          onTimeUpdate={() => { if (videoRef.current) setCurrentTime(videoRef.current.currentTime); }}
                          className="w-full h-full object-cover opacity-85"
                        />
                        {previewMode === 'after' && (
                          <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none">
                            <motion.span
                              animate={{ scale: [0.98, 1.02, 0.98] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="text-yellow-400 font-extrabold uppercase tracking-widest text-base md:text-xl drop-shadow-[0_4px_8px_rgba(0,0,0,0.95)] font-heading px-4 text-center"
                            >
                              {currentTime < 5 && "Creating content that commands attention..."}
                              {currentTime >= 5 && currentTime < 10 && "Keep the cuts fast, and hook them early!"}
                              {currentTime >= 10 && currentTime < 15 && "Sync matching B-Rolls automatically..."}
                              {currentTime >= 15 && "Watch the algorithm do its magic!"}
                            </motion.span>
                          </div>
                        )}
                        <div onClick={handlePlayPause} className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer bg-black/15">
                          <div className="p-3 rounded-full bg-black/70 border border-white/10">
                            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
                          </div>
                        </div>
                        <span className="absolute top-2.5 left-2.5 text-[8px] font-mono bg-black/60 text-slate-300 px-1.5 py-0.5 rounded border border-white/[0.08]">
                          {previewMode === 'before' ? '📷 RAW LOG' : '✨ AI GRADED'}
                        </span>
                      </div>

                      {/* 4 metric cards */}
                      <div className="grid grid-cols-4 gap-2 shrink-0">
                        {[
                          { num: '32', label: 'Silences Cut', sub: '+78% efficiency', c: '#3D5A80', border: 'border-[#3D5A80]/20' },
                          { num: '6', label: 'B-Rolls Added', sub: '93% match score', c: '#4FD1FF', border: 'border-[#4FD1FF]/20' },
                          { num: '98%', label: 'Caption Acc.', sub: 'Urdu auto-detect', c: '#F5EFE6', border: 'border-[#F5EFE6]/20' },
                          { num: '97%', label: 'Beat Sync', sub: 'Audio optimized', c: '#D4A574', border: 'border-[#D4A574]/20' },
                        ].map((card, i) => (
                          <div key={i} className={`p-2.5 rounded-xl border ${card.border} bg-secondaryBg/40 backdrop-blur-md space-y-1.5 relative overflow-hidden before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent`}>
                            <div className="text-base font-black leading-none" style={{ color: card.c }}>{card.num}</div>
                            <div className="text-[9px] font-bold text-white leading-tight">{card.label}</div>
                            <div className="text-[8px] text-slate-600">{card.sub}</div>
                          </div>
                        ))}
                      </div>

                      {/* Export CTA */}
                      <div className="flex justify-end shrink-0">
                        <button onClick={() => { setActiveMenu('export'); setWorkflowStep(5); }}
                          className="bg-gradient-to-r from-purpleTheme to-blueTheme px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white shadow shadow-blueTheme/15 flex items-center gap-2 hover:scale-[1.02] transition-transform">
                          <span>Next: Export Video</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* STAGE 3: ASSETS */}
              {activeMenu === 'assets' && (
                <motion.div key="assets" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full overflow-y-auto p-4 space-y-4 relative z-10">
                  <div className="space-y-2">
                    <p className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-500">Recommended B-Roll Clips</p>
                    <div className="grid grid-cols-2 gap-3">
                      {MOCK_ASSETS_RECOMMENDED.broll.map((item, i) => (
                        <div key={i} className="bg-secondaryBg/60 border border-white/[0.05] rounded-2xl overflow-hidden shadow-lg">
                          <video src={item.img} muted className="w-full h-24 object-cover opacity-70" />
                          <div className="p-3 flex justify-between items-center">
                            <div><p className="text-[10px] font-bold text-white">{item.name}</p><p className="text-[9px] text-slate-500 font-mono">{item.duration}</p></div>
                            <button onClick={() => showToast(`🎬 Added: ${item.name}`)} className="px-2.5 py-1 bg-purpleTheme text-white text-[9px] font-bold rounded-lg hover:bg-purpleTheme/80 transition-colors">Apply</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-500">Music Tracks</p>
                      {MOCK_ASSETS_RECOMMENDED.music.map((item, i) => (
                        <div key={i} className="p-3 bg-secondaryBg/40 border border-white/[0.05] rounded-xl flex justify-between items-center">
                          <div><p className="text-[10px] font-bold text-white">{item.name}</p><p className="text-[9px] text-slate-500">{item.mood}</p></div>
                          <button onClick={() => { setSelectedMusic(item.name); showToast(`🎵 Applied: ${item.name}`); }} className={`px-2.5 py-1 text-[9px] font-bold rounded-lg border transition-colors ${selectedMusic === item.name ? 'bg-blueTheme border-blueTheme text-black' : 'border-slate-800 text-slate-500 hover:text-white'}`}>{selectedMusic === item.name ? 'Applied' : 'Select'}</button>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <p className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-500">Caption Presets</p>
                      {MOCK_ASSETS_RECOMMENDED.captions.map((item, i) => (
                        <div key={i} className="p-3 bg-secondaryBg/40 border border-white/[0.05] rounded-xl flex justify-between items-center">
                          <div><p className="text-[10px] font-bold text-white">{item.name}</p><p className="text-[9px] text-slate-500">{item.category}</p></div>
                          <button onClick={() => { setSelectedCaptionStyle(item.name.toLowerCase().includes('yellow') ? 'viral-yellow' : 'glass-box'); showToast(`💬 Set: ${item.name}`); }} className={`px-2.5 py-1 text-[9px] font-bold rounded-lg border transition-colors ${(selectedCaptionStyle === 'viral-yellow' && item.name.toLowerCase().includes('yellow')) || (selectedCaptionStyle === 'glass-box' && item.name.toLowerCase().includes('box')) ? 'bg-blueTheme border-blueTheme text-black' : 'border-slate-800 text-slate-500 hover:text-white'}`}>
                            {(selectedCaptionStyle === 'viral-yellow' && item.name.toLowerCase().includes('yellow')) || (selectedCaptionStyle === 'glass-box' && item.name.toLowerCase().includes('box')) ? 'Applied' : 'Select'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STAGE 4: EXPORT */}
              {activeMenu === 'export' && (
                <motion.div key="export" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex items-center justify-center p-6 relative z-10">
                  {isExporting ? (
                    !exportComplete ? (
                      <div className="space-y-6 text-center max-w-xs w-full">
                        <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                          <svg className="w-full h-full -rotate-90">
                            <circle cx="48" cy="48" r="40" stroke="rgba(61,90,128,0.12)" strokeWidth="6" fill="transparent"/>
                            <circle cx="48" cy="48" r="40" stroke="url(#eg)" strokeWidth="7" fill="transparent" strokeDasharray={251.2} strokeDashoffset={251.2 - (251.2 * exportProgress) / 100} strokeLinecap="round"/>
                            <defs><linearGradient id="eg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#3D5A80"/><stop offset="100%" stopColor="#4FD1FF"/></linearGradient></defs>
                          </svg>
                          <span className="absolute text-xl font-black text-white">{Math.round(exportProgress)}%</span>
                        </div>
                        <h2 className="text-lg font-black text-white">Rendering Final Video...</h2>
                        <div className="space-y-2 font-mono text-xs text-left bg-secondaryBg/80 border border-white/[0.05] rounded-xl p-3">
                          {['Packing footage frames', 'Mastering audio', 'Compressing MP4'].map((s, i) => (
                            <div key={i} className={`flex justify-between transition-colors ${exportStep >= i ? 'text-blueTheme font-bold' : 'text-slate-700'}`}>
                              <span>{exportStep > i ? '✓' : exportStep === i ? '⚡' : '○'} {s}</span>
                              <span>{exportStep > i ? 'Done' : exportStep === i ? 'Running' : '—'}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-5 text-center max-w-xs w-full">
                        <div className="w-16 h-16 mx-auto bg-green-500/10 border-2 border-green-500/40 rounded-full flex items-center justify-center shadow-lg shadow-green-500/10">
                          <Check className="w-8 h-8 text-green-400 animate-bounce" />
                        </div>
                        <div>
                          <h2 className="text-xl font-black text-white">Your Video Is Ready!</h2>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed max-w-[240px] mx-auto">Compiled in {exportQuality} {exportFormat}. Download or start a new project.</p>
                        </div>
                        <div className="space-y-2">
                          <button onClick={handleDownloadVideoMock} className="w-full py-3 bg-gradient-to-r from-purpleTheme to-blueTheme text-xs font-bold uppercase tracking-wider rounded-xl text-white flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-blueTheme/15 transition-all">
                            <Download className="w-4 h-4" /> Download Final Video
                          </button>
                          <button onClick={handleDownloadReport} className="w-full py-2.5 bg-slate-900 border border-slate-800 text-xs font-bold rounded-xl text-slate-400 hover:text-white transition-colors">Download Project Report</button>
                          <button onClick={handleResetProject} className="w-full py-2 text-xs font-bold text-blueTheme hover:underline">Start New Project</button>
                        </div>
                      </motion.div>
                    )
                  ) : (
                    <div className="w-full max-w-sm space-y-4">
                      <div className="text-center">
                        <h2 className="text-base font-black text-white">Export Configuration</h2>
                        <p className="text-xs text-slate-500 mt-1">Choose quality and format, then render.</p>
                      </div>
                      <div className="bg-secondaryBg/60 border border-white/[0.05] rounded-2xl p-4 space-y-4 shadow-xl">
                        <div className="space-y-2">
                          <p className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-500">Resolution</p>
                          <div className="grid grid-cols-4 gap-1.5">
                            {['720p', '1080p', '2K', '4K'].map((r) => (
                              <button key={r} onClick={() => setExportQuality(r)} className={`py-2 rounded-lg border text-[10px] font-bold font-mono transition-colors ${exportQuality === r ? 'bg-purpleTheme/20 border-purpleTheme text-purpleLight' : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'}`}>{r}</button>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-500">Format</p>
                          <div className="flex gap-2">
                            {['MP4', 'MOV'].map((f) => (
                              <button key={f} onClick={() => setExportFormat(f)} className={`flex-1 py-2 rounded-lg border text-[10px] font-bold font-mono transition-colors ${exportFormat === f ? 'bg-purpleTheme/20 border-purpleTheme text-purpleLight' : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'}`}>{f}</button>
                            ))}
                          </div>
                        </div>
                        <button onClick={handleRunExport} className="w-full py-3 bg-gradient-to-r from-purpleTheme to-blueTheme font-black text-xs uppercase tracking-wider rounded-xl text-white shadow shadow-blueTheme/15 hover:scale-[1.01] transition-transform">
                          Start Rendering
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* ─────────────────────────────────── */}
          {/* TIMELINE TRACKS                     */}
          {/* ─────────────────────────────────── */}
          <div className="h-[168px] bg-darkBg border-t border-white/[0.05] shrink-0 flex flex-col overflow-hidden">
            {/* Time ruler */}
            <div className="h-7 border-b border-white/[0.04] flex items-center px-3 gap-3 shrink-0 bg-[#080c14]">
              <span className="text-[8px] font-black uppercase tracking-[0.15em] text-slate-700 w-[68px] shrink-0">TIMELINE</span>
              <div className="flex-1 relative flex items-center h-full">
                {['00:00', '00:05', '00:10', '00:15', '00:20'].map((t, i) => (
                  <div key={i} className="absolute flex flex-col items-center" style={{ left: `${i * 25}%` }}>
                    <span className="text-[8px] font-mono text-slate-700">{t}</span>
                  </div>
                ))}
                {/* Playhead */}
                <div className="absolute top-0 bottom-0 flex flex-col items-center z-10 transition-all duration-100" style={{ left: `${playheadPct}%` }}>
                  <div className="w-2 h-2 rounded-full bg-blueTheme shadow-[0_0_6px_rgba(79,209,255,0.8)] -mt-1" />
                  <div className="w-px flex-1 bg-blueTheme/60" />
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={handlePlayPause} className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purpleTheme/15 border border-purpleTheme/25 text-purpleLight text-[9px] font-bold hover:bg-purpleTheme/25 transition-colors">
                  {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-purpleLight" />}
                  {isPlaying ? 'Pause' : 'Play'}
                </button>
                <span className="text-[9px] font-mono text-slate-600">{currentTime.toFixed(1)}s</span>
              </div>
            </div>

            {/* Track rows */}
            <div className="flex-1 overflow-hidden">

              {/* Row 1: Video */}
              <div className="flex h-[44px] border-b border-white/[0.03]">
                <div className="w-[68px] px-2 flex items-center gap-1.5 border-r border-white/[0.04] shrink-0 bg-[#090e18]/60">
                  <svg viewBox="0 0 12 12" className="w-3 h-3 text-slate-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="2" width="10" height="8" rx="1"/><path d="M4 2v8M8 2v8" strokeOpacity="0.4"/></svg>
                  <span className="text-[8px] font-bold text-slate-600 uppercase">Video</span>
                </div>
                <div className="flex-1 flex items-center h-full px-1.5 gap-1.5 overflow-hidden">
                  {workflowStep >= 4 ? (
                    <>
                      <div className="flex-[3] h-[30px] rounded-md bg-gradient-to-r from-purpleTheme/30 to-purpleTheme/15 border border-purpleTheme/35 flex items-center px-2.5 gap-1.5 overflow-hidden">
                        <div className="w-1 h-5 rounded-sm bg-purpleTheme/60 shrink-0" />
                        <span className="text-[9px] font-bold text-purpleLight truncate">Intro A-Roll</span>
                      </div>
                      <div className="flex-[2] h-[30px] rounded-md bg-gradient-to-r from-blueTheme/25 to-blueTheme/10 border border-blueTheme/30 flex items-center px-2.5 gap-1.5 overflow-hidden">
                        <div className="w-1 h-5 rounded-sm bg-blueTheme/60 shrink-0" />
                        <span className="text-[9px] font-bold text-blueTheme truncate">B-Roll Laser</span>
                      </div>
                      <div className="flex-[3] h-[30px] rounded-md bg-gradient-to-r from-purpleTheme/30 to-purpleTheme/15 border border-purpleTheme/35 flex items-center px-2.5 gap-1.5 overflow-hidden">
                        <div className="w-1 h-5 rounded-sm bg-purpleTheme/60 shrink-0" />
                        <span className="text-[9px] font-bold text-purpleLight truncate">Outro A-Roll</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 h-[30px] rounded-md border border-dashed border-white/[0.05] flex items-center justify-center">
                      <span className="text-[8px] text-slate-700 font-mono">awaiting upload...</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Row 2: Captions */}
              <div className="flex h-[34px] border-b border-white/[0.03]">
                <div className="w-[68px] px-2 flex items-center gap-1.5 border-r border-white/[0.04] shrink-0 bg-[#090e18]/60">
                  <svg viewBox="0 0 12 12" className="w-3 h-3 text-slate-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 3h8M2 6h5M2 9h7" strokeLinecap="round"/></svg>
                  <span className="text-[8px] font-bold text-slate-600 uppercase">Caps</span>
                </div>
                <div className="flex-1 flex items-center h-full px-1.5 gap-1 overflow-hidden">
                  {workflowStep >= 4 ? (
                    ['Edit...', 'Pak...', 'Auto...', 'Viral...'].map((t, i) => (
                      <div key={i} className="flex-1 h-[22px] rounded bg-pinkTheme/10 border border-pinkTheme/20 flex items-center justify-center overflow-hidden">
                        <span className="text-[8px] text-pinkTheme font-mono font-bold truncate px-1">"{t}"</span>
                      </div>
                    ))
                  ) : (
                    <div className="flex-1 h-[22px] rounded border border-dashed border-white/[0.04]" />
                  )}
                </div>
              </div>

              {/* Row 3: Audio waveform */}
              <div className="flex h-[38px]">
                <div className="w-[68px] px-2 flex items-center gap-1.5 border-r border-white/[0.04] shrink-0 bg-[#090e18]/60">
                  <svg viewBox="0 0 12 12" className="w-3 h-3 text-slate-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 1v10M4 3v6M8 3v6M2 5v2M10 5v2" strokeLinecap="round"/></svg>
                  <span className="text-[8px] font-bold text-slate-600 uppercase">Audio</span>
                </div>
                <div className="flex-1 h-full flex items-center px-1.5">
                  <div className="flex-1 h-[24px] rounded bg-cyan-500/[0.07] border border-cyan-500/15 overflow-hidden flex items-center px-1">
                    <div className="flex items-end gap-px h-full py-1 w-full">
                      {Array.from({ length: 100 }).map((_, i) => {
                        const h = workflowStep >= 2
                          ? Math.max(1.5, Math.abs(Math.sin(i * 0.38 + 0.4) * 12 + Math.cos(i * 0.18) * 4) + 1.5)
                          : 1.5;
                        return (
                          <div key={i} style={{ height: `${h}px`, minWidth: '1.5px', flex: '1', background: 'linear-gradient(to top, var(--color-blueTheme), var(--color-purpleTheme))', borderRadius: '1px', opacity: 0.65 }} />
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>{/* end center col */}

        {/* ── COL D: RIGHT AI PANEL (268px) ── */}
        <aside className="hidden xl:flex w-[268px] bg-[#090f18]/75 backdrop-blur-md border-l border-white/[0.04] flex-col shrink-0 overflow-hidden z-20 shadow-sm">
          {/* Header */}
          <div className="px-3 py-2.5 border-b border-white/[0.04] flex items-center justify-between shrink-0">
            <span className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-500">AI Inspector</span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_5px_#4ade80] animate-pulse" />
              <span className="text-[9px] text-green-400 font-mono font-bold">ONLINE</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">

            {/* AI AGENT CARD */}
            <div className="relative rounded-2xl border border-white/[0.05] bg-gradient-to-b from-secondaryBg/90 to-darkBg p-3.5 space-y-3 overflow-hidden shadow-lg before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent">
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-purpleTheme/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between">
                <p className="text-[8px] font-black uppercase tracking-[0.18em] text-purpleLight">THUNDRA AI AGENT</p>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-[8px] font-bold text-green-400">ONLINE</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-purpleTheme to-blueTheme flex items-center justify-center shrink-0 shadow-lg shadow-purpleTheme/15">
                  <Sparkles className="w-4 h-4 text-white" />
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-[#090f18] shadow-[0_0_4px_#4ade80]" />
                </div>
                <div>
                  <div className="text-[11px] font-black text-white">Thundra Editor AI</div>
                  <div className="text-[8px] text-purpleLight/70 font-mono">v3.0 · Pakistan Node</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { icon: '🎬', l: 'Analyzed', v: '20s video' },
                  { icon: '✂️', l: 'Detected', v: '32 pauses' },
                  { icon: '🎥', l: 'B-Roll', v: '6 clips' },
                  { icon: '💬', l: 'Captions', v: 'Urdu + EN' },
                ].map((s, i) => (
                  <div key={i} className="bg-black/25 border border-white/[0.04] rounded-xl p-2">
                    <div className="text-[8px] text-slate-600">{s.icon} {s.l}</div>
                    <div className="text-[10px] font-bold text-white mt-0.5">{s.v}</div>
                  </div>
                ))}
              </div>
              <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border ${workflowStep >= 4 ? 'bg-green-500/[0.07] border-green-500/20 text-green-400' : 'bg-blueTheme/[0.07] border-blueTheme/20 text-blueTheme'}`}>
                <span className={`w-2 h-2 rounded-full shrink-0 ${workflowStep >= 4 ? 'bg-green-400' : 'bg-blueTheme animate-ping'}`} />
                <span className="text-[9px] font-bold">{workflowStep >= 5 ? 'Export Ready ✓' : workflowStep >= 4 ? 'Ready for Export' : workflowStep >= 3 ? 'Editing...' : 'Awaiting Prompt'}</span>
              </div>
            </div>

            {/* AI EDIT HISTORY */}
            <div className="space-y-2">
              <p className="text-[8px] font-black uppercase tracking-[0.18em] text-slate-500">AI EDIT HISTORY</p>
              {workflowStep >= 4 ? (
                <div>
                  {[
                    { title: 'Silence Removed', ts: '0:04s', dot: 'bg-green-400', line: 'bg-green-500/20', tag: 'bg-green-500/10 border-green-500/20 text-green-300', desc: 'Trimmed 2.3s gap' },
                    { title: 'Urdu Captions', ts: '0:10s', dot: 'bg-purpleLight', line: 'bg-purpleTheme/20', tag: 'bg-purpleTheme/10 border-purpleTheme/20 text-purpleLight', desc: 'Auto-transcribed' },
                    { title: 'B-Roll Matched', ts: '0:18s', dot: 'bg-blueTheme', line: 'bg-blueTheme/20', tag: 'bg-blueTheme/10 border-blueTheme/20 text-blueTheme', desc: 'Keyboard insert' },
                    { title: 'Music Synced', ts: '0:29s', dot: 'bg-pinkTheme', line: 'bg-pinkTheme/20', tag: 'bg-pinkTheme/10 border-pinkTheme/20 text-pinkTheme', desc: 'Lofi beats 120BPM' },
                    { title: 'Color Grade', ts: '0:42s', dot: 'bg-pinkTheme', line: 'bg-pinkTheme/20', tag: 'bg-pinkTheme/10 border-pinkTheme/20 text-pinkTheme', desc: 'Rec.709 LUT' },
                    { title: 'Export Ready', ts: '0:58s', dot: 'bg-green-400', line: '', tag: 'bg-green-500/10 border-green-500/20 text-green-300', desc: 'Packaged H.264 4K' },
                  ].map((item, idx, arr) => (
                    <motion.div key={idx} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.07 }} className="flex gap-2">
                      <div className="flex flex-col items-center shrink-0">
                        <div className={`w-2.5 h-2.5 rounded-full ${item.dot} border-2 border-[#090f18] mt-1`} />
                        {idx < arr.length - 1 && <div className={`w-px flex-1 min-h-[20px] mt-0.5 ${item.line}`} />}
                      </div>
                      <div className="pb-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[9px] font-black text-white">{item.title}</span>
                          <span className={`text-[7px] font-mono px-1 py-0.5 rounded border ${item.tag}`}>{item.ts}</span>
                        </div>
                        <p className="text-[8px] text-slate-600 mt-0.5">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center bg-black/20 rounded-xl border border-dashed border-slate-800 space-y-1.5">
                  <Clock className="w-5 h-5 mx-auto text-slate-700" />
                  <p className="text-[9px] text-slate-600">Complete editing to see history</p>
                </div>
              )}
            </div>

            {/* AI CONFIDENCE */}
            <div className="rounded-2xl border border-white/[0.05] bg-secondaryBg/40 p-3 space-y-2.5 relative overflow-hidden before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent">
              <div className="flex items-center justify-between">
                <p className="text-[8px] font-black uppercase tracking-[0.18em] text-slate-500">AI CONFIDENCE</p>
                <span className="text-[8px] font-mono text-purpleLight bg-purpleTheme/10 px-1.5 py-0.5 rounded border border-purpleTheme/15">LIVE</span>
              </div>
              {[
                { label: 'Captions', pct: 98, color: 'from-purpleTheme to-purpleLight' },
                { label: 'B-Roll Match', pct: 93, color: 'from-blueTheme to-blueTheme/60' },
                { label: 'Audio Sync', pct: 97, color: 'from-pinkTheme to-pinkTheme/60' },
                { label: 'Color Grade', pct: 95, color: 'from-pinkTheme to-purpleTheme' },
              ].map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-[9px] text-slate-400">{item.label}</span>
                    <span className="text-[9px] font-black text-white">{item.pct}%</span>
                  </div>
                  <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.pct}%` }}
                      transition={{ delay: 0.3 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                      className={`h-full bg-gradient-to-r ${item.color} rounded-full`}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* REFINE CHAT */}
            {workflowStep >= 4 && (
              <div className="space-y-2">
                <p className="text-[8px] font-black uppercase tracking-[0.18em] text-slate-500">REFINE WITH AI</p>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    placeholder="Ask AI to refine..."
                    className="flex-1 bg-darkBg border border-white/[0.06] rounded-lg px-2.5 py-2 text-[10px] text-white placeholder-slate-600 focus:outline-none focus:border-blueTheme/40"
                    onKeyDown={(e) => { if (e.key === 'Enter' && e.target.value.trim()) { showToast(`💬 Refining: "${e.target.value}"`); e.target.value = ''; } }}
                  />
                  <button onClick={() => showToast('💬 AI refining...')} className="px-2.5 py-2 bg-blueTheme/15 border border-blueTheme/25 text-blueTheme rounded-lg text-[9px] font-bold hover:bg-blueTheme/25 transition-colors">Go</button>
                </div>
              </div>
            )}
          </div>

          {/* Node footer */}
          <div className="px-3 py-2 border-t border-white/[0.04] flex justify-between text-[8px] font-mono text-slate-700 shrink-0">
            <span>THUNDRA NODE: ASIA-PK</span>
            <span className="text-green-700">● ONLINE v3.0</span>
          </div>
        </aside>

      </div>{/* end main body */}


      {/* ═══════════════════════════════════════════════ */}
      {/* BOTTOM AI PROMPT BAR                           */}
      {/* ═══════════════════════════════════════════════ */}
      <div className="h-[62px] bg-[#080d1a] border-t border-white/[0.06] flex items-center px-4 gap-3 shrink-0 relative shadow-2xl">
        {/* Top glow line */}
        <div className="absolute top-0 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-blueTheme/20 to-transparent pointer-events-none" />

        {/* AI avatar */}
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purpleTheme to-blueTheme flex items-center justify-center shrink-0 shadow-lg shadow-blueTheme/15">
          <Sparkles className="w-4 h-4 text-white" />
        </div>

        {/* Prompt input */}
        <div className="flex-1 flex items-center bg-darkBg border border-white/[0.06] rounded-xl px-4 h-[38px] gap-2.5 hover:border-blueTheme/20 focus-within:border-blueTheme/40 transition-colors">
          <span className="text-blueTheme font-mono text-[11px] font-bold shrink-0">ai_prompt:</span>
          <span className="text-pink-400 font-mono text-[11px] shrink-0">✂</span>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (workflowStep >= 2) { handleSendPrompt(); setActiveMenu('ai-editor'); }
                else showToast('⚠️ Upload a video first!');
              }
            }}
            placeholder="Type AI editing instructions... (e.g. remove silences, add Urdu captions)"
            className="flex-1 bg-transparent text-[11px] text-slate-300 placeholder-slate-700 font-mono focus:outline-none"
          />
          {userInput && <span className="w-0.5 h-4 bg-blueTheme animate-pulse shrink-0" />}
        </div>

        {/* Quick chips */}
        <div className="hidden xl:flex items-center gap-1.5 shrink-0">
          {['✂️ Silences', '💬 Captions', '🎵 Music'].map((s) => (
            <button key={s} onClick={() => {
              if (workflowStep >= 2) { handleSendPrompt(s); setActiveMenu('ai-editor'); }
              else showToast('⚠️ Upload first!');
            }} className="text-[9px] px-2.5 py-1.5 rounded-lg border border-purpleTheme/12 bg-purpleTheme/[0.04] text-slate-500 hover:text-slate-300 hover:border-purpleTheme/25 transition-all font-mono">
              {s}
            </button>
          ))}
        </div>

        {/* Send */}
        <button
          onClick={() => {
            if (workflowStep >= 2) { handleSendPrompt(); setActiveMenu('ai-editor'); }
            else showToast('⚠️ Upload a video first!');
          }}
          className="w-9 h-9 rounded-xl bg-gradient-to-br from-purpleTheme to-blueTheme flex items-center justify-center text-white shadow-lg shadow-blueTheme/15 hover:scale-105 hover:shadow-blueTheme/30 transition-all shrink-0"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* ═══════════════════════════════════════════════ */}
      {/* TOAST                                          */}
      {/* ═══════════════════════════════════════════════ */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 15, x: '-50%' }}
            className="fixed bottom-20 left-1/2 z-50 bg-[#0d0d1a]/95 border border-green-500/40 text-green-400 text-xs px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span className="font-semibold">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
