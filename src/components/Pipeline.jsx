import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Film, MessageSquare, Image, Music, Layers, CheckCircle, Terminal } from 'lucide-react';

const STEPS = [
  { id: 1, name: "Analyzing Script & Hook", icon: Cpu, desc: "Evaluating prompt semantics and generating transcript narrative." },
  { id: 2, name: "Extracting Scene Timestamps", icon: Film, desc: "Segmenting timeline chapters and setting scene cuts." },
  { id: 3, name: "Generating Captions & Overlays", icon: MessageSquare, desc: "Formatting typography and generating stylized Urdu/English captions." },
  { id: 4, name: "Matching B-Roll Clips", icon: Image, desc: "Querying asset database for direct video match hooks." },
  { id: 5, name: "Adding Transitions & Syncing", icon: Layers, desc: "Structuring timeline tracks and fading scene layers." },
  { id: 6, name: "Mastering Music Beats & Glow", icon: Music, desc: "Analyzing soundtrack frequencies and applying color grading." }
];

const MOCK_LOGS = [
  "Initialize Thundra Core v2.4.0...",
  "Loading neural orchestrator model...",
  "Parsing user prompt semantics...",
  "Prompt matched: custom theme preset selected.",
  "Segmenting video plan: 4 scene divisions detected.",
  "Scene 1: 0s - 5s -> Generating bold captions...",
  "Scene 2: 5s - 10s -> Matching B-Roll: 'developer workspace'...",
  "Scene 3: 10s - 15s -> Setting up network connection lines...",
  "Scene 4: 15s - 20s -> Matching visual: 'sunset running'...",
  "Fetching video overlays from stock CDN (Mixkit direct MP4 links)...",
  "Resolving asset: 1080p, H.264 high profile encoder...",
  "Generating subtitles SRT track...",
  "Extracting audio frequency map...",
  "Syncing beat triggers to scene cuts...",
  "Applying purple-blue cinematic LUT color grade...",
  "Pipeline rendering finished. Packaging edit timeline..."
];

export default function Pipeline({ prompt, onComplete }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);
  const logContainerRef = useRef(null);

  useEffect(() => {
    // Scroll logs to bottom when updated
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  useEffect(() => {
    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        // Increment progress faster or slower randomly
        const increment = Math.floor(Math.random() * 8) + 4;
        return Math.min(prev + increment, 100);
      });
    }, 250);

    return () => clearInterval(progressInterval);
  }, []);

  useEffect(() => {
    // Map progress to steps
    const stepRatio = 100 / STEPS.length;
    const currentStep = Math.floor(progress / stepRatio);
    if (currentStep < STEPS.length && currentStep !== currentStepIndex) {
      setCurrentStepIndex(currentStep);
    }
  }, [progress, currentStepIndex]);

  useEffect(() => {
    // Console logs animation
    let logIndex = 0;
    const logInterval = setInterval(() => {
      if (logIndex < MOCK_LOGS.length) {
        const timestamp = (performance.now() / 1000).toFixed(2);
        setLogs(prev => [...prev, `[${timestamp}s] ${MOCK_LOGS[logIndex]}`]);
        logIndex++;
      } else {
        clearInterval(logInterval);
      }
    }, 450);

    return () => clearInterval(logInterval);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      // Delay slightly at 100% to let user see completion
      const timeout = setTimeout(() => {
        onComplete();
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [progress, onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#07070F]/95 backdrop-blur-md p-4 overflow-y-auto">
      {/* Glow effects in background */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purpleTheme/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blueTheme/10 rounded-full blur-[100px]" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl glass-panel p-6 md:p-8 rounded-2xl relative border border-purpleTheme/20 shadow-2xl"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-borderTheme pb-6">
          <div>
            <h2 className="text-2xl font-bold font-heading flex items-center gap-2 text-white">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purpleLight opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-purpleTheme"></span>
              </span>
              AI Editing Pipeline Simulation
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Analyzing prompt: <span className="text-purpleLight font-medium">"{prompt}"</span>
            </p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-bold font-heading text-blueTheme bg-blueTheme/10 px-4 py-1 rounded-lg border border-blueTheme/20">
              {progress}%
            </span>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden mb-8 p-[1px] border border-borderTheme">
          <motion.div 
            className="h-full bg-gradient-to-r from-purpleTheme via-purpleLight to-blueTheme rounded-full"
            style={{ width: `${progress}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "easeOut" }}
          />
        </div>

        {/* Two column layout: Left pipeline steps, Right real-time compiler logs */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Pipeline Steps (Col 1-3) */}
          <div className="lg:col-span-3 space-y-4">
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isCompleted = idx < currentStepIndex || progress === 100;
              const isCurrent = idx === currentStepIndex && progress < 100;
              
              return (
                <div 
                  key={step.id} 
                  className={`flex items-start gap-4 p-3 rounded-xl border transition-all duration-300 ${
                    isCurrent 
                      ? "bg-purpleTheme/10 border-purpleTheme/40 shadow-md shadow-purpleTheme/5" 
                      : isCompleted 
                        ? "bg-slate-950/40 border-green-500/20 opacity-80" 
                        : "bg-slate-950/20 border-borderTheme/50 opacity-40"
                  }`}
                >
                  <div className={`p-2.5 rounded-lg flex-shrink-0 ${
                    isCompleted 
                      ? "bg-green-500/10 text-green-400" 
                      : isCurrent 
                        ? "bg-purpleTheme/20 text-purpleLight" 
                        : "bg-slate-900 text-slate-500"
                  }`}>
                    {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className={`w-5 h-5 ${isCurrent ? 'animate-pulse' : ''}`} />}
                  </div>
                  <div>
                    <h3 className={`font-semibold text-sm ${isCurrent ? 'text-purpleLight' : isCompleted ? 'text-slate-300' : 'text-slate-500'}`}>
                      {step.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Compiler Terminal logs (Col 4-5) */}
          <div className="lg:col-span-2 flex flex-col h-full min-h-[300px]">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 px-3 py-2 bg-slate-950 rounded-t-xl border-t border-x border-borderTheme">
              <Terminal className="w-3.5 h-3.5 text-purpleLight" />
              <span>LOG_STREAM.sh</span>
            </div>
            <div 
              ref={logContainerRef}
              className="flex-1 p-3 bg-black/90 font-mono text-[10px] md:text-xs text-green-400 border border-borderTheme rounded-b-xl overflow-y-auto max-h-[330px] space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800"
            >
              {logs.map((log, index) => (
                <div key={index} className="leading-relaxed whitespace-pre-wrap">
                  <span className="text-purpleLight">❯</span> {log}
                </div>
              ))}
              {progress < 100 && (
                <div className="flex items-center gap-1.5 text-slate-400">
                  <span className="inline-block w-1.5 h-3 bg-green-400 animate-pulse" />
                  <span>Compiling timeline nodes...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
