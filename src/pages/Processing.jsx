import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Film, MessageSquare, Image, Layers, Music, CheckCircle, Terminal, RefreshCw, AlertCircle } from 'lucide-react';

const STEPS = [
  { id: 1, name: "Analyzing Prompt", icon: Cpu, desc: "Reading user prompt semantics and context intent." },
  { id: 2, name: "Generating Script", icon: MessageSquare, desc: "Formulating viral hooks, main narrative voiceover, and CTA." },
  { id: 3, name: "Detecting Scenes", icon: Film, desc: "Segmenting timestamps and calculating scene durations." },
  { id: 4, name: "Creating Captions", icon: MessageSquare, desc: "Generating stylized subtitles and typography presets." },
  { id: 5, name: "Finding B-Roll", icon: Image, desc: "Querying Pexels/Mixkit stock CDN databases for visual matches." },
  { id: 6, name: "Adding Transitions", icon: Layers, desc: "Injecting motion blur cuts and timeline animations." },
  { id: 7, name: "Syncing Audio", icon: Music, desc: "Detecting beats per minute and aligning audio waveform cuts." },
  { id: 8, name: "Finalizing Edit", icon: CheckCircle, desc: "Applying LUT color profiles and packaging the draft editor project." }
];

const MOCK_LOGS = [
  "🚀 Initializing Thundra AI core engine v3.0...",
  "⚙️ Orchestration models initialized successfully.",
  "🧠 Evaluating prompt semantic vector mappings...",
  "📡 Prompt received: [USER_QUERY]",
  "📝 Parsing script voiceover: Hook generated (Duration: 5s)",
  "🎨 Color grading: Applying Cinematic Teal-Gold LUTs...",
  "📐 Timestamps mapped: 4 core timeline scenes calculated...",
  "⚡ Scene 1 (0s-5s) -> Hook: 'Creating content that commands attention starts here.'",
  "⚡ Scene 2 (5s-10s) -> 'Keep the cuts fast, the captions bold, and hook them early.'",
  "⚡ Scene 3 (10s-15s) -> 'Synchronize visuals to the beat of viral soundtrack styles.'",
  "⚡ Scene 4 (15s-20s) -> 'Hit publish and watch the algorithm do its magic.'",
  "🎬 Fetching high-quality B-roll overlays from Pexels CDN...",
  "🔗 Resolved asset URLs: 4 matching video timelines loaded.",
  "💬 Formatting subtitles: generating English & Urdu font nodes...",
  "🎵 Analyzing soundtrack: loading 120 BPM audio master file...",
  "🎛️ Mixing frequencies: aligning video cuts to audio beat markers...",
  "🚀 All tracks synced. Packaging editor metadata structure...",
  "✅ Processing pipeline complete! Launching editing workspace..."
];

export default function Processing() {
  const location = useLocation();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [progress, setProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [logs, setLogs] = useState([]);
  const canvasRef = useRef(null);
  const logContainerRef = useRef(null);
  const API_BASE_URL = 'http://localhost:5000/api';

  useEffect(() => {
    // Read prompt from location state
    if (location.state && location.state.prompt) {
      setPrompt(location.state.prompt);
    } else {
      setPrompt("Make a viral 60s TikTok about AI revolutions");
    }
  }, [location]);

  // Floating background particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 50;
        this.size = Math.random() * 2.5 + 0.8;
        this.speedY = -(Math.random() * 1.8 + 0.4);
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.alpha = Math.random() * 0.5 + 0.15;
        const colors = ['#3D5A80', '#4FD1FF', '#D4A574'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }
      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        if (this.y < -10) this.reset();
      }
      draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.shadowBlur = this.size * 0.5;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    const particles = Array.from({ length: 40 }, () => new Particle());

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  // Animate progress bar (0 to 100)
  useEffect(() => {
    const durationMs = 6500; // 6.5 seconds simulation
    const steps = 100;
    const intervalMs = durationMs / steps;

    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        // Random incremental speed
        const jitter = Math.random() > 0.7 ? 2 : 1;
        return Math.min(prev + jitter, 100);
      });
    }, intervalMs);

    return () => clearInterval(progressTimer);
  }, []);

  // Update current step index based on progress
  useEffect(() => {
    const stepRatio = 100 / STEPS.length;
    const currentStep = Math.floor(progress / stepRatio);
    if (currentStep < STEPS.length && currentStep !== currentStepIndex) {
      setCurrentStepIndex(currentStep);
    }
  }, [progress, currentStepIndex]);

  // Feed terminal compiler logs
  useEffect(() => {
    if (!prompt) return;

    let logIndex = 0;
    const logInterval = setInterval(() => {
      if (logIndex < MOCK_LOGS.length) {
        const timestamp = (performance.now() / 1000).toFixed(2);
        const logLine = MOCK_LOGS[logIndex].replace("[USER_QUERY]", `"${prompt}"`);
        setLogs(prev => [...prev, `[${timestamp}s] ${logLine}`]);
        logIndex++;
      } else {
        clearInterval(logInterval);
      }
    }, 320);

    return () => clearInterval(logInterval);
  }, [prompt]);

  // Scroll terminal logs container to bottom
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Complete processing and navigate to editor
  useEffect(() => {
    if (progress === 100) {
      const navigateTimer = setTimeout(async () => {
        // Try calling the backend generate, if unavailable fallback to local generation
        try {
          const response = await fetch(`${API_BASE_URL}/generate-plan`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
          });
          if (response.ok) {
            const projectPlan = await response.json();
            sessionStorage.setItem('currentProjectPlan', JSON.stringify(projectPlan));
            navigate('/editor', { state: { projectPlan } });
          } else {
            throw new Error();
          }
        } catch {
          const localMock = generateLocalMockPlan(prompt);
          sessionStorage.setItem('currentProjectPlan', JSON.stringify(localMock));
          navigate('/editor', { state: { projectPlan: localMock } });
        }
      }, 800);

      return () => clearTimeout(navigateTimer);
    }
  }, [progress, prompt, navigate]);

  // Fallback Local Generator
  const generateLocalMockPlan = (usrPrompt) => {
    const lower = usrPrompt.toLowerCase();
    let title = "Viral AI Marketing Short";
    let musicStyle = "Trending Phonk Beats";
    let broll = ["Workspace coding", "Abstract matrix", "AI screen glow", "Hand typing"];
    
    let scenes = [
      {
        id: 1,
        timeStart: 0,
        timeEnd: 5,
        text: "Creating content that commands attention starts here.",
        brollSuggestion: "Camera tripod setup in a beautifully lit creator studio",
        mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-hands-setting-up-a-camera-tripod-40898-large.mp4"
      },
      {
        id: 2,
        timeStart: 5,
        timeEnd: 10,
        text: "Keep the cuts fast, the captions bold, and hook them early.",
        brollSuggestion: "Keyboard typing inside a stylized dark glowing room",
        mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-hands-typing-on-computer-keyboard-40613-large.mp4"
      },
      {
        id: 3,
        timeStart: 10,
        timeEnd: 15,
        text: "Synchronize visuals to the beat of viral soundtrack styles.",
        brollSuggestion: "Neon particle light flow synced to rhythm",
        mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-abstract-laser-lights-background-41712-large.mp4"
      },
      {
        id: 4,
        timeStart: 15,
        timeEnd: 20,
        text: "Hit publish and watch the algorithm do its magic.",
        brollSuggestion: "Glow cyber space lines connecting networks",
        mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-network-connection-lines-and-dots-41613-large.mp4"
      }
    ];

    let captions = [
      { id: 1, timeStart: 0, timeEnd: 3, text: "Creating viral content..." },
      { id: 2, timeStart: 3, timeEnd: 5, text: "...starts right here." },
      { id: 3, timeStart: 5, timeEnd: 8, text: "Keep the cuts fast..." },
      { id: 4, timeStart: 8, timeEnd: 10, text: "...and hook them early!" },
      { id: 5, timeStart: 10, timeEnd: 13, text: "Sync the visuals..." },
      { id: 6, timeStart: 13, timeEnd: 15, text: "...to trending beats." },
      { id: 7, timeStart: 15, timeEnd: 18, text: "Hit publish..." },
      { id: 8, timeStart: 18, timeEnd: 20, text: "...watch the algorithm!" }
    ];

    if (lower.includes("ai") || lower.includes("intelligence") || lower.includes("tech") || lower.includes("robot") || lower.includes("code")) {
      title = "AI Revolutions & Future Tech";
      musicStyle = "Futuristic Cyberpunk Synthwave";
      scenes = [
        {
          id: 1,
          timeStart: 0,
          timeEnd: 5,
          text: "AI is reshaping our world faster than anyone predicted.",
          brollSuggestion: "Animated laser lights representing AI networks",
          mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-abstract-laser-lights-background-41712-large.mp4"
        },
        {
          id: 2,
          timeStart: 5,
          timeEnd: 10,
          text: "From self-writing code to generative design tools.",
          brollSuggestion: "Developer typing lines of code in a dark room",
          mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-hands-typing-on-computer-keyboard-40613-large.mp4"
        },
        {
          id: 3,
          timeStart: 10,
          timeEnd: 15,
          text: "Those who adapt now will build the future.",
          brollSuggestion: "Network connections connecting global servers",
          mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-network-connection-lines-and-dots-41613-large.mp4"
        },
        {
          id: 4,
          timeStart: 15,
          timeEnd: 20,
          text: "Are you ready for the next level of human evolution?",
          brollSuggestion: "Glow particle stream in cyber space",
          mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-background-1611-large.mp4"
        }
      ];
      captions = [
        { id: 1, timeStart: 0, timeEnd: 3, text: "AI is reshaping our world..." },
        { id: 2, timeStart: 3, timeEnd: 5, text: "...faster than anyone predicted!" },
        { id: 3, timeStart: 5, timeEnd: 8, text: "From self-writing code..." },
        { id: 4, timeStart: 8, timeEnd: 10, text: "...to generative design tools." },
        { id: 5, timeStart: 10, timeEnd: 13, text: "Those who adapt now..." },
        { id: 6, timeStart: 13, timeEnd: 15, text: "...will build the future." },
        { id: 7, timeStart: 15, timeEnd: 18, text: "Are you ready..." },
        { id: 8, timeStart: 18, timeEnd: 20, text: "...for human evolution?" }
      ];
    } else if (lower.includes("food") || lower.includes("cook") || lower.includes("recipe") || lower.includes("biryani") || lower.includes("tea")) {
      title = "Perfect Kitchen Masterpieces";
      musicStyle = "Chill Acoustic Beats";
      scenes = [
        {
          id: 1,
          timeStart: 0,
          timeEnd: 5,
          text: "Good food is the foundation of genuine happiness.",
          brollSuggestion: "Fresh vegetables being cut and prepared for cooking",
          mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-preparing-delicious-fresh-vegetable-salad-40621-large.mp4"
        },
        {
          id: 2,
          timeStart: 5,
          timeEnd: 10,
          text: "Hear that? The sound of fresh ingredients meeting heat.",
          brollSuggestion: "Sizzling meat cooking on a hot grill pan",
          mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-sizzling-meat-on-a-hot-grill-42247-large.mp4"
        },
        {
          id: 3,
          timeStart: 10,
          timeEnd: 15,
          text: "A dash of spices, a pinch of love, and perfect timing.",
          brollSuggestion: "Chef mixing and stirring in a pan",
          mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-chef-stirring-food-in-a-pan-40535-large.mp4"
        },
        {
          id: 4,
          timeStart: 15,
          timeEnd: 20,
          text: "Ready to take your taste buds on a wild journey?",
          brollSuggestion: "Warm soup or dish being served elegantly",
          mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-pouring-hot-sauce-over-delicious-cooked-meal-40541-large.mp4"
        }
      ];
      captions = [
        { id: 1, timeStart: 0, timeEnd: 3, text: "Good food is..." },
        { id: 2, timeStart: 3, timeEnd: 5, text: "...the foundation of happiness." },
        { id: 3, timeStart: 5, timeEnd: 8, text: "Hear that sizzling sound?" },
        { id: 4, timeStart: 8, timeEnd: 10, text: "Fresh ingredients on heat." },
        { id: 5, timeStart: 10, timeEnd: 13, text: "A dash of spices..." },
        { id: 6, timeStart: 13, timeEnd: 15, text: "...and a pinch of love." },
        { id: 7, timeStart: 15, timeEnd: 18, text: "Ready for a..." },
        { id: 8, timeStart: 18, timeEnd: 20, text: "...wild taste journey?" }
      ];
    } else if (lower.includes("travel") || lower.includes("vlog") || lower.includes("mountain") || lower.includes("explore")) {
      title = "Escape to the Wild Unknown";
      musicStyle = "Indie Folk Soundtrack";
      scenes = [
        {
          id: 1,
          timeStart: 0,
          timeEnd: 5,
          text: "We travel not to escape life, but for life not to escape us.",
          brollSuggestion: "Aerial view of lush green forest and massive mountain ranges",
          mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-thick-forest-and-mountains-41221-large.mp4"
        },
        {
          id: 2,
          timeStart: 5,
          timeEnd: 10,
          text: "There is something magical about exploring uncharted territories.",
          brollSuggestion: "Scenic view of a coastal road next to the sea",
          mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-coastal-road-aerial-shot-with-crashing-waves-41584-large.mp4"
        },
        {
          id: 3,
          timeStart: 10,
          timeEnd: 15,
          text: "Every trail leads to a new story waiting to be told.",
          brollSuggestion: "Hiker looking out over a gorgeous canyon view",
          mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-hiker-standing-on-top-of-mountain-enjoying-view-41228-large.mp4"
        },
        {
          id: 4,
          timeStart: 15,
          timeEnd: 20,
          text: "Pack your bags. The world is calling.",
          brollSuggestion: "Epic sunset over a beautiful tropical ocean beach",
          mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-running-on-the-beach-at-sunset-12185-large.mp4"
        }
      ];
      captions = [
        { id: 1, timeStart: 0, timeEnd: 3, text: "We travel not to escape..." },
        { id: 2, timeStart: 3, timeEnd: 5, text: "...but for life to stay with us." },
        { id: 3, timeStart: 5, timeEnd: 8, text: "Something magical about..." },
        { id: 4, timeStart: 8, timeEnd: 10, text: "...exploring uncharted lands." },
        { id: 5, timeStart: 10, timeEnd: 13, text: "Every trail leads to..." },
        { id: 6, timeStart: 13, timeEnd: 15, text: "...a brand new story." },
        { id: 7, timeStart: 15, timeEnd: 18, text: "Pack your bags..." },
        { id: 8, timeStart: 18, timeEnd: 20, text: "...the world is calling!" }
      ];
    }

    return {
      prompt: usrPrompt,
      title,
      musicStyle,
      scenes,
      captions,
      broll
    };
  };

  return (
    <div className="relative min-h-screen bg-transparent text-slate-100 flex items-center justify-center p-4 overflow-hidden select-none">
      {/* Background dynamic canvas particles */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      {/* Main card panel */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-5xl rounded-3xl border border-[#3D5A80]/20 bg-[#101826]/85 backdrop-blur-xl p-6 md:p-10 relative z-10 shadow-2xl shadow-blueTheme/5 space-y-8"
      >
        {/* Header section with progress indicator */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#3D5A80]/10 pb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-black font-heading tracking-wide flex items-center gap-2.5 text-white">
              <span className="relative flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F5EFE6] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#3D5A80]"></span>
              </span>
              <span>Thundra Orchestrator Pipeline</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-lg truncate font-medium">
              Prompt context: <span className="text-[#F5EFE6] italic">"{prompt}"</span>
            </p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-extrabold font-heading text-[#F5EFE6] bg-[#3D5A80]/10 px-4 py-1.5 rounded-xl border border-[#3D5A80]/20 shadow-inner">
              {progress}%
            </span>
          </div>
        </div>

        {/* Big glowing progress bar */}
        <div className="w-full h-3.5 bg-slate-950 rounded-full overflow-hidden p-[2px] border border-[#3D5A80]/10 shadow-inner">
          <motion.div 
            className="h-full bg-gradient-to-r from-[#3D5A80] via-[#F5EFE6] to-blueTheme rounded-full"
            style={{ width: `${progress}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "easeOut" }}
          />
        </div>

        {/* Two Column details: left steps, right compiler logs */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* Pipeline active steps column (Col 1-3) */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 text-[#F5EFE6] animate-spin" />
              <span>Compilation Steps</span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {STEPS.map((step, idx) => {
                const Icon = step.icon;
                const isCompleted = idx < currentStepIndex || progress === 100;
                const isCurrent = idx === currentStepIndex && progress < 100;

                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all duration-300 ${
                      isCurrent
                        ? "bg-[#3D5A80]/10 border-[#3D5A80] shadow-[0_0_15px_rgba(79,209,255,0.15)]"
                        : isCompleted
                          ? "bg-[#101826]/40 border-green-500/20 opacity-80"
                          : "bg-slate-950/15 border-slate-900 opacity-35"
                    }`}
                  >
                    <div className={`p-2 rounded-lg shrink-0 ${
                      isCompleted
                        ? "bg-green-500/10 text-green-400 border border-green-500/20"
                        : isCurrent
                          ? "bg-[#3D5A80]/20 text-[#F5EFE6] border border-[#3D5A80]/30"
                          : "bg-slate-900 text-slate-500 border border-slate-800"
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Icon className={`w-4 h-4 ${isCurrent ? 'animate-pulse' : ''}`} />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className={`text-xs font-bold truncate ${
                        isCurrent ? 'text-[#F5EFE6] font-heading' : isCompleted ? 'text-slate-350' : 'text-slate-500'
                      }`}>
                        {step.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">{step.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Compiler logging Terminal (Col 4-5) */}
          <div className="lg:col-span-2 flex flex-col min-h-[340px]">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 px-3.5 py-2.5 bg-[#0b0b14] rounded-t-xl border-t border-x border-[#3D5A80]/15">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-[#F5EFE6]" />
                <span>thundra_pipeline_run.log</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e] animate-pulse" />
            </div>
            
            <div 
              ref={logContainerRef}
              className="flex-1 p-4 bg-black/90 font-mono text-[10px] md:text-xs text-green-400 border border-[#3D5A80]/15 rounded-b-xl overflow-y-auto max-h-[300px] space-y-2.5 scrollbar-thin scrollbar-thumb-slate-800"
            >
              {logs.map((log, index) => (
                <div key={index} className="leading-relaxed whitespace-pre-wrap break-all">
                  <span className="text-[#F5EFE6]">❯</span> {log}
                </div>
              ))}
              {progress < 100 && (
                <div className="flex items-center gap-1.5 text-slate-400">
                  <span className="inline-block w-1.5 h-3.5 bg-green-400 animate-pulse" />
                  <span>Synthesizing plan assets...</span>
                </div>
              )}
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
