import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../components/GlassCard';
import StackedFeatureCards from '../components/StackedFeatureCards';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Sparkles, ArrowRight, Play, Database, Award, Clock, Users,
  Menu, X, Globe, Video, Settings, Music, Layers, Check, 
  HelpCircle, ChevronDown, CheckCircle, Film, Type, Sliders,
  Upload, MessageSquare, Download, ChevronRight
} from 'lucide-react';

/* ─── Film Strip Component ─────────────────────────────────────────────────── */
// Renders a wavy SVG film reel strip on any of the 4 borders of the hero mockup card.
// side: "top" | "bottom" | "left" | "right"
// Design: dark purple metallic ribbon, black sprocket circles, white dashed rails,
//         subtle sine-wave warp for the cinematic film-ribbon look.
function FilmStrip({ side = "top" }) {
  const isHoriz = side === "top" || side === "bottom";

  /* ── Design constants ── */
  const STRIP   = 30;   // ribbon thickness (in the cross-axis, px)
  const AMP     = 5;    // sine-wave amplitude (px)
  const PER     = 100;  // sine-wave period (px)
  const CANVAS_T = 50;  // SVG canvas size on the thin axis
  const MID     = CANVAS_T / 2;
  const LEN     = 600;  // SVG canvas size on the long axis
  const STEPS   = 240;  // path smoothness

  /* Returns perpendicular offset following the sine wave */
  const wave = t => AMP * Math.sin((t / PER) * Math.PI * 2);

  /* Converts (t along strip, n perpendicular offset) → SVG "x,y" string */
  const pt = (t, n) =>
    isHoriz
      ? `${t.toFixed(1)},${(MID + wave(t) + n).toFixed(1)}`
      : `${(MID + wave(t) + n).toFixed(1)},${t.toFixed(1)}`;

  /* Same but returns {x,y} object for circle centres */
  const ptObj = (t, n) =>
    isHoriz
      ? { x: t, y: MID + wave(t) + n }
      : { x: MID + wave(t) + n, y: t };

  /* Sample the long axis */
  const tArr = Array.from({ length: STEPS + 1 }, (_, i) => (i / STEPS) * LEN);

  /* Closed ribbon path (top-edge sweep → bottom-edge sweep back) */
  const ribbonD = [
    `M ${pt(tArr[0], -STRIP / 2)}`,
    ...tArr.slice(1).map(t => `L ${pt(t, -STRIP / 2)}`),
    ...[...tArr].reverse().map(t => `L ${pt(t, STRIP / 2)}`),
    'Z',
  ].join(' ');

  /* Inner sprocket rail A (4 px inside edge A) */
  const railA = tArr.map((t, i) => `${i === 0 ? 'M' : 'L'} ${pt(t, -STRIP / 2 + 5)}`).join(' ');

  /* Inner sprocket rail B (4 px inside edge B) */
  const railB = tArr.map((t, i) => `${i === 0 ? 'M' : 'L'} ${pt(t, STRIP / 2 - 5)}`).join(' ');

  /* Edge A highlight line */
  const edgeA = tArr.map((t, i) => `${i === 0 ? 'M' : 'L'} ${pt(t, -STRIP / 2)}`).join(' ');

  /* Edge B highlight line */
  const edgeB = tArr.map((t, i) => `${i === 0 ? 'M' : 'L'} ${pt(t, STRIP / 2)}`).join(' ');

  /* Sprocket hole circles along the centre axis */
  const N_CIRCLES = isHoriz ? 22 : 15;
  const circles = Array.from({ length: N_CIRCLES }, (_, i) => {
    const t = 10 + (i / (N_CIRCLES - 1)) * (LEN - 20);
    return ptObj(t, 0);
  });

  /* SVG canvas dimensions */
  const [W, H] = isHoriz ? [LEN, CANVAS_T] : [CANVAS_T, LEN];

  /* Unique IDs per side to avoid SVG defs collisions */
  const gradId = `fg-${side}`;
  const glowId = `gg-${side}`;

  /* Glow colour varies per side */
  const glowColor =
    side === 'top'    ? 'rgba(167,85,247,0.25)'  :
    side === 'bottom' ? 'rgba(59,130,246,0.22)'   :
    side === 'left'   ? 'rgba(167,85,247,0.22)'   :
                        'rgba(59,130,246,0.25)';

  /* Container positioning — strip centres on its respective card edge */
  const containerStyle = isHoriz
    ? {
        position: 'absolute',
        width: '112%', left: '-6%',
        height: CANVAS_T,
        top:    side === 'top'    ? -CANVAS_T / 2 : 'auto',
        bottom: side === 'bottom' ? -CANVAS_T / 2 : 'auto',
        pointerEvents: 'none',
        zIndex: 20,
        overflow: 'visible',
      }
    : {
        position: 'absolute',
        height: '112%', top: '-6%',
        width: CANVAS_T,
        left:  side === 'left'  ? -CANVAS_T / 2 : 'auto',
        right: side === 'right' ? -CANVAS_T / 2 : 'auto',
        pointerEvents: 'none',
        zIndex: 20,
        overflow: 'visible',
      };

  return (
    <div style={containerStyle}>
      <svg
        width="100%" height="100%"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Deep purple metallic gradient — cross-axis direction */}
          <linearGradient
            id={gradId}
            x1={isHoriz ? '0%' : '0%'}  y1={isHoriz ? '0%'   : '0%'}
            x2={isHoriz ? '0%' : '100%'} y2={isHoriz ? '100%' : '0%'}
          >
            <stop offset="0%"   stopColor="#120c24" />
            <stop offset="30%"  stopColor="#2e1c5c" />
            <stop offset="50%"  stopColor="#3d2a7a" />
            <stop offset="70%"  stopColor="#2e1c5c" />
            <stop offset="100%" stopColor="#120c24" />
          </linearGradient>

          {/* Soft purple glow filter */}
          <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Glow halo behind ribbon */}
        <path d={ribbonD} fill={glowColor} filter={`url(#${glowId})`} />

        {/* Metallic dark-purple ribbon base */}
        <path d={ribbonD} fill={`url(#${gradId})`} />

        {/* Sprocket rail A — dashed, animated scroll */}
        <path
          d={railA}
          fill="none"
          stroke="white"
          strokeWidth="1.5"
          strokeDasharray="4 7"
          strokeOpacity="0.88"
          className="animate-film-sprockets"
        />

        {/* Sprocket rail B — dashed, animated scroll */}
        <path
          d={railB}
          fill="none"
          stroke="white"
          strokeWidth="1.5"
          strokeDasharray="4 7"
          strokeOpacity="0.88"
          className="animate-film-sprockets"
        />

        {/* Sprocket holes — black circles along centre axis */}
        {circles.map((c, i) => (
          <circle
            key={i}
            cx={c.x}
            cy={c.y}
            r="9"
            fill="#05050c"
            stroke="rgba(124,58,237,0.18)"
            strokeWidth="0.6"
          />
        ))}

        {/* Edge A inner highlight */}
        <path d={edgeA} fill="none" stroke="rgba(168,85,247,0.45)" strokeWidth="1" />

        {/* Edge B inner highlight */}
        <path d={edgeB} fill="none" stroke="rgba(168,85,247,0.25)" strokeWidth="1" />
      </svg>
    </div>
  );
}

/* ─── Background Atmospheric Film Strip ──────────────────────────────────────── */
// Low-opacity, fixed-position film strip purely for cinematic page atmosphere.
// Placed behind all content with a drift animation — never interferes with UI.
function BgFilmStrip({ top, left, right, bottom, rotate = 0, opacity = 0.065, blur = 0, animDelay = '0s', reversed = false }) {
  const W = 900, H = 56;
  const STRIP = 26, AMP = 6, PER = 115, MID = H / 2, STEPS = 180;
  const wave = t => AMP * Math.sin(((reversed ? -t : t) / PER) * Math.PI * 2);
  const tArr = Array.from({ length: STEPS + 1 }, (_, i) => (i / STEPS) * W);
  const pt = (t, n) => `${t.toFixed(1)},${(MID + wave(t) + n).toFixed(1)}`;
  const ribbonD = [
    `M ${pt(tArr[0], -STRIP / 2)}`,
    ...tArr.slice(1).map(t => `L ${pt(t, -STRIP / 2)}`),
    ...[...tArr].reverse().map(t => `L ${pt(t, STRIP / 2)}`),
    'Z',
  ].join(' ');
  const railA = tArr.map((t, i) => `${i === 0 ? 'M' : 'L'} ${pt(t, -STRIP / 2 + 4)}`).join(' ');
  const railB = tArr.map((t, i) => `${i === 0 ? 'M' : 'L'} ${pt(t, STRIP / 2 - 4)}`).join(' ');
  const N = 19;
  const circles = Array.from({ length: N }, (_, i) => {
    const t = 10 + (i / (N - 1)) * (W - 20);
    return { x: t, y: MID + wave(t) };
  });
  const uid = `bg-${rotate}-${reversed}`;
  return (
    <div style={{
      position: 'fixed', pointerEvents: 'none', zIndex: 2,
      opacity, filter: blur > 0 ? `blur(${blur}px)` : undefined,
      top, left, right, bottom,
      transform: `rotate(${rotate}deg)`,
      transformOrigin: '50% 50%',
      animation: `bg-film-drift 28s ease-in-out infinite`,
      animationDelay: animDelay,
    }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id={`bgr-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#070B12" />
            <stop offset="35%"  stopColor="#1A2436" />
            <stop offset="50%"  stopColor="#3D5A80" />
            <stop offset="65%"  stopColor="#1A2436" />
            <stop offset="100%" stopColor="#070B12" />
          </linearGradient>
          <filter id={`bggl-${uid}`} x="-10%" y="-40%" width="120%" height="180%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {/* Subtle smoky blue glow behind ribbon */}
        <path d={ribbonD} fill="rgba(61,90,128,0.25)" filter={`url(#bggl-${uid})`} />
        {/* Metallic ribbon */}
        <path d={ribbonD} fill={`url(#bgr-${uid})`} />
        {/* Sprocket rails */}
        <path d={railA} fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1" strokeDasharray="3.5 8" className="animate-film-sprockets" />
        <path d={railB} fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1" strokeDasharray="3.5 8" className="animate-film-sprockets" />
        {/* Sprocket holes */}
        {circles.map((c, i) => (
          <circle key={i} cx={c.x} cy={c.y} r="7" fill="#070B12" stroke="rgba(61,90,128,0.2)" strokeWidth="0.4" />
        ))}
      </svg>
    </div>
  );
}

/* ─── Premium Video Editing Background System ─── */
function VideoEditingBgSystem() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden select-none opacity-[0.055]">
      {/* Rule of Thirds Editing Grid / Alignment overlay */}
      <div className="absolute top-[10%] left-[5%] w-[38%] aspect-[16/10] border border-[#3D5A80]/20 rounded-xl relative overflow-hidden animate-float" style={{ animationDuration: '14s' }}>
        <div className="absolute top-[33.3%] left-0 right-0 h-[0.5px] bg-[#3D5A80]/15" />
        <div className="absolute top-[66.6%] left-0 right-0 h-[0.5px] bg-[#3D5A80]/15" />
        <div className="absolute left-[33.3%] top-0 bottom-0 w-[0.5px] bg-[#3D5A80]/15" />
        <div className="absolute left-[66.6%] top-0 bottom-0 w-[0.5px] bg-[#3D5A80]/15" />
        <span className="absolute top-2 left-2 text-[7px] font-mono text-[#F5EFE6]/60">GUIDE // GRID_3x3</span>
        <span className="absolute bottom-2 right-2 text-[7px] font-mono text-[#4FD1FF]/60">1.78:1 WIDESCREEN</span>
        {/* Focusing corners */}
        <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-[#4FD1FF]" />
        <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-[#4FD1FF]" />
        <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-[#4FD1FF]" />
        <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-[#4FD1FF]" />
      </div>

      {/* Floating Waveform Sound wave */}
      <svg className="absolute bottom-[28%] left-[10%] w-[320px] h-[60px] animate-float" style={{ animationDuration: '10s', animationDelay: '-2s' }} viewBox="0 0 320 60" fill="none">
        <path d="M0,30 Q40,5 80,30 T160,30 T240,30 T320,30" stroke="#4FD1FF" strokeWidth="1" opacity="0.7" />
        <path d="M0,30 Q40,55 80,30 T160,30 T240,30 T320,30" stroke="#3D5A80" strokeWidth="0.8" opacity="0.4" />
        <text x="5" y="10" fill="#F5EFE6" fontSize="6.5" fontFamily="monospace" letterSpacing="0.08em">WAVEFORM_PREVIEW // Ch_01</text>
      </svg>

      {/* Timeline track and Keyframe Diamond ruler */}
      <svg className="absolute top-[32%] right-[8%] w-[360px] h-[45px] animate-float" style={{ animationDuration: '16s', animationDelay: '-4s' }} viewBox="0 0 360 45" fill="none">
        <line x1="0" y1="25" x2="360" y2="25" stroke="#3D5A80" strokeWidth="0.8" strokeDasharray="3 5" />
        {/* Keyframe diamonds */}
        <rect x="60" y="21.5" width="6" height="6" transform="rotate(45 63 25)" fill="#4FD1FF" stroke="#3D5A80" strokeWidth="0.8" />
        <rect x="180" y="21.5" width="6" height="6" transform="rotate(45 183 25)" fill="#D4A574" stroke="#3D5A80" strokeWidth="0.8" />
        <rect x="300" y="21.5" width="6" height="6" transform="rotate(45 303 25)" fill="#4FD1FF" stroke="#3D5A80" strokeWidth="0.8" />
        <text x="60" y="14" fill="#F5EFE6" fontSize="6" fontFamily="monospace">CUT_POINT_A</text>
        <text x="180" y="14" fill="#D4A574" fontSize="6" fontFamily="monospace">MUSIC_SYNC</text>
        <text x="300" y="14" fill="#F5EFE6" fontSize="6" fontFamily="monospace">GRAD_APPLY</text>
      </svg>

      {/* Modern Timecode indicator HUD */}
      <div className="absolute top-[48%] left-[2%] font-mono text-[8px] text-[#F5EFE6] tracking-widest bg-secondaryBg/40 border border-white/[0.04] px-2.5 py-1.5 rounded-lg shadow-xl animate-float" style={{ animationDuration: '12s', animationDelay: '-1s' }}>
        <div className="text-[6.5px] text-[#3D5A80] font-black uppercase mb-0.5">CURRENT TIMECODE</div>
        <span className="text-[#4FD1FF]">00:18:42:15</span> / <span className="opacity-60">29.97 FPS</span>
      </div>

      {/* Bottom Technical Frame Ruler */}
      <svg className="absolute bottom-[8%] right-[15%] w-[480px] h-[25px] animate-float" style={{ animationDuration: '18s', animationDelay: '-6s' }} viewBox="0 0 480 25" fill="none">
        <line x1="0" y1="12" x2="480" y2="12" stroke="#3D5A80" strokeWidth="0.8" />
        {Array.from({ length: 49 }).map((_, i) => (
          <line 
            key={i} 
            x1={i * 10} 
            y1={i % 8 === 0 ? "2" : i % 4 === 0 ? "5" : "8"} 
            x2={i * 10} 
            y2="12" 
            stroke="#3D5A80" 
            strokeWidth="0.6" 
            opacity={i % 4 === 0 ? 0.8 : 0.4} 
          />
        ))}
        <text x="5" y="22" fill="#F5EFE6" fontSize="6.5" fontFamily="monospace" letterSpacing="0.05em">FRAME_RULER // SEQ_LENG_480F</text>
      </svg>
    </div>
  );
}

/* ─── HUD Corner Bracket ─────────────────────────────────────────────────────── */
// One L-shaped cinematic HUD bracket for a card corner.
// pos: "tl" | "tr" | "bl" | "br"
function CornerBracket({ pos }) {
  const isTop  = pos[0] === 't';
  const isLeft = pos[1] === 'l';
  const ARM = 12; // compact and elegant arm length
  
  // Calculate L-path inside a safe bounding box
  const pathData = isLeft
    ? (isTop
      ? `M ${ARM},1.5 L 1.5,1.5 L 1.5,${ARM}`           // top-left
      : `M ${ARM},${ARM - 0.5} L 1.5,${ARM - 0.5} L 1.5,1.5`) // bottom-left
    : (isTop
      ? `M 1.5,1.5 L ${ARM - 0.5},1.5 L ${ARM - 0.5},${ARM}` // top-right
      : `M 1.5,${ARM - 0.5} L ${ARM - 0.5},${ARM - 0.5} L ${ARM - 0.5},1.5`); // bottom-right

  return (
    <div style={{
      position: 'absolute',
      top:    isTop  ? -1.5 : 'auto',
      bottom: isTop  ? 'auto' : -1.5,
      left:   isLeft ? -1.5 : 'auto',
      right:  isLeft ? 'auto' : -1.5,
      pointerEvents: 'none',
    }}>
      <svg width={ARM + 2} height={ARM + 2} viewBox={`0 0 ${ARM + 2} ${ARM + 2}`} fill="none">
        <path 
          d={pathData} 
          stroke="rgba(79,209,255,0.3)" 
          strokeWidth="1.5"
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        {/* Sleek corner vertex accent */}
        <circle
          cx={isLeft ? 1.5 : ARM - 0.5} 
          cy={isTop ? 1.5 : ARM - 0.5}
          r="1.2" 
          fill="rgba(79,209,255,0.4)"
        />
      </svg>
    </div>
  );
}

/* ─── Premium Card HUD Frame ─────────────────────────────────────────────────── */
// Cinematic SaaS-style editor frame overlay for the hero mockup card.
// Provides: glowing gradient border and HUD corner brackets.
function CardHUDFrame() {
  return (
    <div className="absolute inset-0 pointer-events-none rounded-3xl" style={{ zIndex: 22 }}>
      {/* ── HUD Corner Brackets ── */}
      <CornerBracket pos="tl" />
      <CornerBracket pos="tr" />
      <CornerBracket pos="bl" />
      <CornerBracket pos="br" />
    </div>
  );
}

/* ─── HUD Ruler & Status Bar ─── */
function HUDRulerBar() {
  const ticks = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  const keyframes = [18, 38, 62, 82];

  return (
    <div 
      className="flex items-center justify-between px-3.5 py-1 bg-slate-950/45 border-b border-white/[0.04] text-[8px] font-mono text-slate-400 select-none relative -mx-3.5 md:-mx-4 z-10"
      style={{ marginTop: 0 }}
    >
      {/* Left HUD Label */}
      <div className="flex items-center gap-1 shrink-0 opacity-70">
        <span className="w-1.5 h-1.5 rounded-sm bg-purpleLight/75 border border-purpleLight/40" />
        <span className="tracking-widest uppercase font-bold text-[7px] text-slate-400">STUDIO // PRV</span>
      </div>

      {/* Center: Ruler ticks and keyframe diamonds */}
      <div className="flex-1 max-w-[180px] md:max-w-[220px] mx-4 relative h-3.5 flex items-center">
        {/* Horizontal rail line */}
        <div className="absolute left-0 right-0 h-[1px] bg-white/[0.06]" />

        {/* Ticks */}
        {ticks.map((t) => (
          <div
            key={t}
            className="absolute bottom-0 w-[1px] bg-white/20"
            style={{
              left: `${t}%`,
              height: t % 20 === 0 ? '5px' : '3px',
              opacity: t % 20 === 0 ? 0.5 : 0.25,
            }}
          />
        ))}

        {/* Keyframe diamonds */}
        {keyframes.map((kf) => (
          <div
            key={kf}
            className="absolute w-1.5 h-1.5 bg-[#4FD1FF] rotate-45 -translate-y-1/2 top-1/2 shadow-[0_0_6px_rgba(79,209,255,0.7)] border border-[#3D5A80]"
            style={{ left: `${kf}%` }}
          />
        ))}
      </div>

      {/* Right HUD Label (Live badge) */}
      <div className="flex items-center gap-1 shrink-0">
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
        </span>
        <span className="text-[7px] font-bold tracking-widest text-slate-350 uppercase">LIVE</span>
      </div>
    </div>
  );
}

/* ─── Waveform Divider Accent ─── */
function WaveformDivider() {
  return (
    <div className="flex items-center justify-center gap-2 h-4 my-1 select-none opacity-60">
      <div className="h-[1px] bg-gradient-to-r from-transparent to-purpleTheme/35 flex-1" />
      <svg viewBox="0 0 120 10" className="w-24 h-2.5 text-purpleLight" preserveAspectRatio="none">
        {Array.from({ length: 24 }).map((_, i) => {
          const h = Math.abs(Math.sin(i * 0.5) * 4.5 + Math.cos(i * 0.25) * 1.8) + 0.5;
          return (
            <rect
              key={i}
              x={i * 5}
              y={(10 - h) / 2}
              width="2"
              height={h}
              rx="0.5"
              fill="currentColor"
              opacity={0.3 + (Math.sin(i * 0.2) + 1) * 0.35}
            />
          );
        })}
      </svg>
      <div className="h-[1px] bg-gradient-to-r from-purpleTheme/35 to-transparent flex-1" />
    </div>
  );
}

const FAQ_ITEMS = [
  {
    q: "How does Thundra AI edit my video?",
    a: "Thundra AI uses speech-to-text models and visual segmentation to transcribe voiceovers, detect silences, match context-appropriate B-Roll clips from CDN libraries, select background music tracks, and color grade your footage based on your simple text instructions."
  },
  {
    q: "Do I need professional editing skills?",
    a: "Not at all. Thundra AI is built for creators, marketers, and business owners with zero editing experience. You simply upload your video, chat with the AI assistant in plain English or Urdu, and export the finished video."
  },
  {
    q: "What languages are supported for captions?",
    a: "We support both Urdu and English caption transcribing. Our AI transcribes Urdu speech and generates stylized TikTok-style overlays automatically."
  },
  {
    q: "What video formats and durations are supported?",
    a: "We support standard formats including MP4, MOV, and AVI. Currently, our system is optimized for short-form video sequences up to 60 seconds (reels, shorts, TikToks)."
  },
  {
    q: "Can I refine edits after the AI finishes?",
    a: "Yes. In the Preview Studio, you can continue chatting with the AI Editor assistant to adjust subtitle styles, swap recommended B-Roll clips, change the background music, or alter transition speeds."
  }
];

const PIPELINE_STEPS = [
  { id: "01", name: "Video Upload", desc: "Ingest & transcode footage", icon: Upload },
  { id: "02", name: "Speech Transcribe", desc: "Sync Whisper AI transcribe", icon: Type },
  { id: "03", name: "Silence Cuts", desc: "Trim silent dead-zones", icon: Film },
  { id: "04", name: "Captioning", desc: "Generate kinetic typography", icon: MessageSquare },
  { id: "05", name: "B-Roll Matching", desc: "Inject visual stock overlays", icon: Video },
  { id: "06", name: "Beat Syncing", desc: "Align cuts to tempo & beats", icon: Music },
  { id: "07", name: "LUT Color Grade", desc: "Map professional color profile", icon: Sliders },
  { id: "08", name: "Final Export", desc: "Compile ultra-fast 4K render", icon: Download }
];

export default function Home() {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState(-1);
  const [isAnnual, setIsAnnual] = useState(false);
  const [sliderPos, setSliderPos] = useState(50);
  const canvasRef = useRef(null);
  
  // Interactive Comparison video player states and refs
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0.0);
  const [isMuted, setIsMuted] = useState(true); // default to muted to comply with browser autoplay policies
  const timelineRef = useRef(null);
  const videoBeforeRef = useRef(null);
  const videoAfterRef = useRef(null);
  const sectionRef = useRef(null);

  const masterPlayPromiseRef = useRef(null);
  const slavePlayPromiseRef = useRef(null);

  // Synchronize play/pause states from the React isPlaying state to the master video (videoAfterRef)
  useEffect(() => {
    const vAfter = videoAfterRef.current;
    if (!vAfter) return;

    if (isPlaying) {
      masterPlayPromiseRef.current = vAfter.play();
      if (masterPlayPromiseRef.current !== undefined) {
        masterPlayPromiseRef.current.catch((err) => {
          if (err.name !== 'AbortError') {
            console.warn("videoAfter play failed (scroll/click):", err);
          }
          // Autoplay/play blocked, update state to match actual playback
          setIsPlaying(false);
        });
      }
    } else {
      try {
        if (masterPlayPromiseRef.current !== null) {
          masterPlayPromiseRef.current.then(() => {
            vAfter.pause();
          }).catch(() => {
            vAfter.pause();
          });
        } else {
          vAfter.pause();
        }
      } catch (e) {}
    }
  }, [isPlaying]);

  // Lock-step synchronization of the slave video (videoBeforeRef) to the master video (videoAfterRef)
  useEffect(() => {
    const vBefore = videoBeforeRef.current;
    const vAfter = videoAfterRef.current;
    if (!vBefore || !vAfter) return;

    const handleMasterPlay = () => {
      try {
        if (vBefore.readyState >= 1) {
          vBefore.playbackRate = 1.0;
        }
        if (vBefore.readyState >= 1 && vAfter.readyState >= 1) {
          vBefore.currentTime = vAfter.currentTime;
        }
      } catch (e) {
        console.warn("Sync on master play failed:", e);
      }
      
      slavePlayPromiseRef.current = vBefore.play();
      if (slavePlayPromiseRef.current !== undefined) {
        slavePlayPromiseRef.current.catch((err) => {
          if (err.name !== 'AbortError') {
            console.warn("videoBefore play-sync failed:", err);
          }
        });
      }
    };

    const handleMasterPause = () => {
      try {
        if (slavePlayPromiseRef.current !== null) {
          slavePlayPromiseRef.current.then(() => {
            vBefore.pause();
          }).catch(() => {
            vBefore.pause();
          });
        } else {
          vBefore.pause();
        }
      } catch (e) {}
    };

    const handleMasterSeeking = () => {
      try {
        if (vBefore.readyState >= 1 && vAfter.readyState >= 1) {
          vBefore.currentTime = vAfter.currentTime;
        }
      } catch (e) {}
    };

    const handleBeforeLoadedMetadata = () => {
      try {
        if (!vAfter.paused) {
          vBefore.currentTime = vAfter.currentTime;
          slavePlayPromiseRef.current = vBefore.play();
          if (slavePlayPromiseRef.current !== undefined) {
            slavePlayPromiseRef.current.catch(() => {});
          }
        }
      } catch (e) {}
    };

    // Attach master playback listeners to drive slave video
    vAfter.addEventListener("play", handleMasterPlay);
    vAfter.addEventListener("pause", handleMasterPause);
    vAfter.addEventListener("seeking", handleMasterSeeking);
    vBefore.addEventListener("loadedmetadata", handleBeforeLoadedMetadata);

    // Initial setup on mount
    if (vBefore.readyState >= 1) {
      vBefore.muted = true;
    }

    return () => {
      vAfter.removeEventListener("play", handleMasterPlay);
      vAfter.removeEventListener("pause", handleMasterPause);
      vAfter.removeEventListener("seeking", handleMasterSeeking);
      vBefore.removeEventListener("loadedmetadata", handleBeforeLoadedMetadata);
    };
  }, []);

  // Synchronize mute/unmute states of both videos (raw video is always 100% muted to prevent audio echo/doubling)
  useEffect(() => {
    if (videoBeforeRef.current) {
      videoBeforeRef.current.muted = true;
    }
    if (videoAfterRef.current) {
      videoAfterRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Intersection Observer to play when the section is in view, and pause when scrolled away
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsPlaying(entry.isIntersecting);
      },
      {
        threshold: 0.08, // trigger when 8% of the section is visible for immediate response
      }
    );

    const currentSection = sectionRef.current;
    if (currentSection) {
      observer.observe(currentSection);
    }

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection);
      }
    };
  }, []);

  // Simple English subtitle overlay track
  const getSubtitles = (time) => {
    if (time < 3.5) return "Importing raw camera footage...";
    if (time < 7.5) return "Applying AI cinematic color grading (Rec. 709)...";
    if (time < 11.5) return "Synchronizing sound design and audio level curves...";
    return "Final output rendered in 4K resolution.";
  };

  // Natively update timeline playhead and keep both videos synchronized and looped together
  const handleTimeUpdate = () => {
    const vBefore = videoBeforeRef.current;
    const vAfter = videoAfterRef.current;
    if (!vBefore || !vAfter) return;

    // Guard against uninitialized metadata to prevent InvalidStateError
    if (vBefore.readyState < 1 || vAfter.readyState < 1) return;

    try {
      const masterDuration = vAfter.duration || 15.0;
      let curr = vAfter.currentTime;
      
      // Since raw.mp4 is longer than the edited.mp4, if it exceeds master duration we loop both programmatically
      if (curr >= masterDuration - 0.1) {
        vBefore.currentTime = 0;
        vAfter.currentTime = 0;
        vBefore.playbackRate = 1.0;
        curr = 0;
      }
      
      setCurrentTime(curr);

      // Frame-accurate smooth alignment using playbackRate (speed adjustments)
      // Adjusts the speed of the raw video between 0.92x and 1.08x to catch up/slow down smoothly,
      // which gives perfect lip sync without any visual jitter or audio stutters.
      const diff = curr - vBefore.currentTime;
      if (diff > 0.04) {
        vBefore.playbackRate = 1.08; // Lagging: speed up
      } else if (diff < -0.04) {
        vBefore.playbackRate = 0.92; // Ahead: slow down
      } else {
        vBefore.playbackRate = 1.0;  // Synchronized: normal speed
      }

      // Hard seek sync only if drift is really large (e.g. > 0.25s)
      if (Math.abs(diff) > 0.25) {
        vBefore.currentTime = curr;
      }
    } catch (e) {
      console.warn("handleTimeUpdate sync error:", e);
    }
  };
  // Scroll handler removed as it is now managed inside Navbar component

  // Mockup dashboard animation states
  const [mockupState, setMockupState] = useState('typing'); // 'typing', 'processing', 'preview'
  const [typedText, setTypedText] = useState('');
  const [processProgress, setProcessProgress] = useState(0);
  const [mockupTime, setMockupTime] = useState(0);

  useEffect(() => {
    let timer;
    if (mockupState === 'typing') {
      const fullText = "✂️ Cut silence, add Urdu subtitles, and sync with synthwave beats...";
      let charIndex = 0;
      setTypedText('');
      setMockupTime(0);
      
      const type = () => {
        if (charIndex < fullText.length) {
          setTypedText(fullText.substring(0, charIndex + 1));
          charIndex++;
          timer = setTimeout(type, 45);
        } else {
          timer = setTimeout(() => {
            setMockupState('processing');
            setProcessProgress(0);
          }, 1200);
        }
      };
      timer = setTimeout(type, 500);
    } else if (mockupState === 'processing') {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 4;
        setProcessProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          timer = setTimeout(() => {
            setMockupState('preview');
          }, 500);
        }
      }, 70);
      return () => clearInterval(interval);
    } else if (mockupState === 'preview') {
      // Sweep timeline playhead (20 seconds simulated time over 10 seconds real time)
      let start;
      const step = (timestamp) => {
        if (!start) start = timestamp;
        const elapsed = (timestamp - start) / 1000; // in seconds
        const simulatedTime = elapsed * 2; // 20s over 10s
        if (simulatedTime >= 20) {
          setMockupState('typing');
        } else {
          setMockupTime(simulatedTime);
          timer = requestAnimationFrame(step);
        }
      };
      timer = requestAnimationFrame(step);
      return () => cancelAnimationFrame(timer);
    }
    return () => clearTimeout(timer);
  }, [mockupState]);

  const getMockupCaption = (time) => {
    if (time < 5) return "Edit videos, not timelines. ⚡";
    if (time < 11) return "Pakistan's first AI video agent. 🇵🇰";
    if (time < 16) return "Automatic cuts, transcribes & beat sync! 🎵";
    return "Hit publish and go viral now! 🚀";
  };

  // ── Premium Neural Graph Background Canvas ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let t = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // ─ Node class (glowing network dots) ─
    class Node {
      constructor() { this.init(); }
      init() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.baseX = this.x;
        this.baseY = this.y;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.r = Math.random() * 2.2 + 0.8;
        this.pulse = Math.random() * Math.PI * 2;
        // color: Warm Ivory, Cyan, Copper Gold, Smoky Blue
        const palette = [
          [245, 239, 230],  // Warm Ivory
          [79, 209, 255],   // Soft Electric Cyan
          [212, 165, 116],  // Premium Copper Gold
          [61, 90, 128],    // Smoky Blue
        ];
        this.rgb = palette[Math.floor(Math.random() * palette.length)];
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.pulse += 0.018;
        // Wrap
        if (this.x < -50) this.x = canvas.width + 50;
        if (this.x > canvas.width + 50) this.x = -50;
        if (this.y < -50) this.y = canvas.height + 50;
        if (this.y > canvas.height + 50) this.y = -50;
      }
      draw() {
        const alpha = (0.35 + 0.25 * Math.sin(this.pulse)) * 0.3;
        const glow = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r * 3);
        glow.addColorStop(0, `rgba(${this.rgb[0]},${this.rgb[1]},${this.rgb[2]},${alpha})`);
        glow.addColorStop(1, `rgba(${this.rgb[0]},${this.rgb[1]},${this.rgb[2]},0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r * 3, 0, Math.PI * 2);
        ctx.fill();
        // solid core
        ctx.fillStyle = `rgba(${this.rgb[0]},${this.rgb[1]},${this.rgb[2]},${alpha + 0.04})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const LINK_DIST = 160;
    const nodeCount = Math.min(12, Math.floor((canvas.width * canvas.height) / 80000));
    const nodes = Array.from({ length: nodeCount }, () => new Node());

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.008;

      // Draw edges between close nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DIST) {
            const alpha = (1 - dist / LINK_DIST) * 0.05;
            // Animated data pulse along edge
            const pulseAlpha = alpha + 0.03 * Math.abs(Math.sin(t * 1.8 + i * 0.5));
            ctx.strokeStyle = `rgba(61, 90, 128, ${pulseAlpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();

            // Travelling data packet dot along edge
            if (Math.abs(Math.sin(t * 2.5 + i * 0.7 + j * 0.3)) > 0.98) {
              const prog = (Math.sin(t * 2.5 + i * 0.7) * 0.5 + 0.5);
              const px = nodes[i].x + (nodes[j].x - nodes[i].x) * prog;
              const py = nodes[i].y + (nodes[j].y - nodes[i].y) * prog;
              ctx.fillStyle = `rgba(79, 209, 255, 0.15)`;
              ctx.beginPath();
              ctx.arc(px, py, 1.0, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      }

      // Draw nodes
      nodes.forEach(n => { n.update(); n.draw(); });

      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-transparent text-slate-100 font-body flex flex-col justify-between select-none overflow-x-hidden">

      {/* Layer 1 – Neural graph canvas (animated, interactive nodes + edges) */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[1]" />

      {/* Layer 2 – Large soft radial glow orbs for atmospheric depth */}
      {/* Primary: top-left Smoky Blue mega-orb */}
      <div className="fixed top-[-15%] left-[-8%] w-[700px] h-[700px] rounded-full pointer-events-none z-[2] animate-drift-slow"
        style={{ background: 'radial-gradient(circle, rgba(61,90,128,0.014) 0%, rgba(61,90,128,0.004) 45%, transparent 70%)' }}
      />
      {/* Secondary: bottom-right Soft Cyan mega-orb */}
      <div className="fixed bottom-[-20%] right-[-10%] w-[750px] h-[750px] rounded-full pointer-events-none z-[2] animate-drift-slower"
        style={{ background: 'radial-gradient(circle, rgba(79,209,255,0.008) 0%, rgba(79,209,255,0.002) 50%, transparent 72%)' }}
      />
      {/* Accent: center-right Copper Gold aurora */}
      <div className="fixed top-[30%] right-[5%] w-[420px] h-[420px] rounded-full pointer-events-none z-[2] animate-drift-slow"
        style={{ background: 'radial-gradient(circle, rgba(212,165,116,0.005) 0%, transparent 65%)', animationDelay: '8s' }}
      />
      {/* Accent: lower-left Warm Ivory reflection */}
      <div className="fixed bottom-[15%] left-[8%] w-[350px] h-[350px] rounded-full pointer-events-none z-[2] animate-drift-slower"
        style={{ background: 'radial-gradient(circle, rgba(245,239,230,0.004) 0%, transparent 65%)', animationDelay: '4s' }}
      />

      {/* NAVBAR */}
      <Navbar />

      {/* SECTION 1: HERO SECTION */}
      <header className="relative z-10 px-6 md:px-[6%] pt-[90px] pb-6 md:pt-[105px] md:pb-8 lg:pt-[80px] lg:pb-0 lg:h-[calc(100vh-80px)] lg:min-h-[580px] grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 xl:gap-14 items-center max-w-7xl mx-auto w-full">
        {/* Left Side: Copywriting */}
        <div className="space-y-4 lg:space-y-5 text-left">
          <div className="group inline-flex items-center gap-2 bg-gradient-to-r from-[#4FD1FF]/12 via-[#6FA8FF]/10 to-[#3D5A80]/12 border border-[#4FD1FF]/35 rounded-full px-4.5 py-1.5 text-[10px] md:text-[11px] font-bold tracking-wider uppercase shadow-[0_3px_10px_rgba(0,0,0,0.4)] backdrop-blur-md select-none cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:-translate-y-0.5 hover:border-[#4FD1FF]/50 hover:shadow-[0_0_12px_rgba(79,209,255,0.12)] active:scale-[0.98]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4FD1FF] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-gradient-to-br from-[#4FD1FF] to-[#3D5A80]"></span>
            </span>
            <span className="bg-gradient-to-r from-[#4FD1FF] via-[#6FA8FF] to-[#3D5A80] bg-clip-text text-transparent font-black transition-all duration-300 group-hover:tracking-wider">⚡ Pakistan's First AI Video Agent</span>
          </div>

          <h1 
            className="font-heading text-3xl md:text-5xl lg:text-[2.85rem] xl:text-[3.5rem] font-black tracking-tight leading-[1.08] text-white"
            style={{ textShadow: '0 4px 18px rgba(0, 0, 0, 0.95), 0 2px 4px rgba(0, 0, 0, 0.85)' }}
          >
            Edit Videos. <br />
            <span 
              className="bg-gradient-to-r from-[#4FD1FF] via-[#F5EFE6] to-[#4FD1FF] bg-clip-text text-transparent animate-shimmer-edge"
              style={{ textShadow: 'none', WebkitTextFillColor: 'transparent' }}
            >
              Not Timelines.
            </span>
          </h1>

          <p className="text-sm md:text-base text-slate-400 leading-relaxed max-w-lg font-body font-medium">
            Upload your footage, tell AI what you want, and get a professionally edited video with captions, music, B-roll, transitions, and color grading.
          </p>

          <div className="flex flex-wrap gap-3 pt-1">
            <button
              onClick={() => navigate('/editor')}
              className="group bg-gradient-to-r from-purpleTheme to-blueTheme px-6 py-3 rounded-xl font-bold font-heading text-xs uppercase tracking-wider text-white shadow-lg shadow-black/30 transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_4px_15px_rgba(79,209,255,0.18)] active:scale-[0.98] flex items-center gap-2 border border-blueTheme/20"
            >
              <span>Start Editing</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            <button
              onClick={() => navigate('/editor')}
              className="bg-[#101826]/80 border border-white/[0.06] hover:border-blueTheme/30 px-6 py-3 rounded-xl font-bold font-heading text-xs uppercase tracking-wider text-slate-300 hover:text-white transition-all"
            >
              Watch Demo
            </button>
          </div>
        </div>

        {/* Right Side: Mockup Dashboard Preview */}
        <div className="relative flex items-center justify-center">
          {/* Ambient halo behind mockup */}
          <div 
            className="absolute w-[500px] h-[350px] rounded-full blur-[100px] pointer-events-none" 
            style={{ backgroundColor: 'rgba(79, 209, 255, 0.06)' }}
          />

          {/* Wrapper container for floating and HUD frame */}
          <div className="w-full max-w-[470px] lg:max-w-[490px] xl:max-w-[530px] relative z-10 transition-all duration-300 animate-float">
            {/* Premium HUD cinematic frame overlay (sitting outside the overflow-hidden boundaries of the card content) */}
            <CardHUDFrame />

            {/* Inner Dashboard Container */}
            <div 
              className="w-full rounded-3xl p-3 md:p-3.5 space-y-2.5 backdrop-blur-md overflow-hidden relative"
              style={{
                backgroundColor: '#0B1220',
                border: '1px solid rgba(79, 209, 255, 0.12)',
                boxShadow: '0 25px 80px rgba(0, 0, 0, 0.45)'
              }}
            >
              {/* Inner border and top highlight overlay */}
              <div 
                className="absolute inset-0 pointer-events-none rounded-[23px]"
                style={{
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: 'rgba(245, 239, 230, 0.04)',
                  borderTopColor: 'rgba(245, 239, 230, 0.08)',
                  margin: '1px',
                  zIndex: 5
                }}
              />
              {/* macOS bar */}
              <div className="flex items-center justify-between -mx-3 -mt-3 md:-mx-3.5 md:-mt-3.5 px-4 py-1.5 bg-slate-950/70 rounded-t-3xl border-b border-white/[0.05]">
                {/* Traffic lights */}
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]/90 border border-[#ef4444]/40 shadow-[0_0_6px_rgba(239,68,68,0.2)] transition-colors hover:bg-[#ff5f56]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]/90 border border-[#f59e0b]/40 shadow-[0_0_6px_rgba(245,158,11,0.2)] transition-colors hover:bg-[#ffbd2e]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]/90 border border-[#10b981]/40 shadow-[0_0_6px_rgba(16,185,129,0.2)] transition-colors hover:bg-[#27c93f]" />
                </div>
                
                {/* File / Project Path Breadcrumbs */}
                <div className="flex items-center gap-1 text-[9px] font-mono font-medium tracking-wide">
                  <span className="text-slate-500 hover:text-slate-400 cursor-pointer transition-colors">projects</span>
                  <span className="text-slate-700">/</span>
                  <div className="flex items-center gap-1 bg-purpleTheme/15 border border-purpleTheme/35 rounded-md px-1.5 py-0.5 text-purpleLight shadow-sm">
                    <Film className="w-2.5 h-2.5 text-purpleLight shrink-0" />
                    <span className="font-semibold text-purple-200">thundra_ai_intro.proj</span>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[8.5px] bg-gradient-to-r from-pinkTheme/15 via-purpleTheme/10 to-blueTheme/15 border border-pinkTheme/35 text-pinkTheme px-2 py-0.5 rounded-full font-mono font-bold tracking-wide shadow-[0_0_10px_rgba(212,165,116,0.15)] flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-pinkTheme animate-pulse" />
                    1080P
                  </span>
                  <span className="text-[8.5px] bg-gradient-to-r from-blueTheme/15 to-purpleTheme/15 border border-blueTheme/35 text-blueTheme px-2 py-0.5 rounded-full font-mono font-bold tracking-wide shadow-[0_0_10px_rgba(79,209,255,0.15)] flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-blueTheme animate-pulse" />
                    30FPS
                  </span>
                </div>
              </div>

              {/* HUD Ruler & Status Bar */}
              <HUDRulerBar />


            {/* Main Panel: Media Bin + Video Preview */}
            <div className="flex gap-3">
              {/* Media Bin */}
              <div className="w-[120px] bg-[#0c0c16]/90 border border-white/[0.06] rounded-xl p-2 space-y-1.5 shrink-0 hidden sm:block shadow-inner backdrop-blur-md">
                <p className="text-[7.5px] font-bold tracking-widest text-slate-400 uppercase">MEDIA BIN</p>
                <div className="space-y-1">
                  {[
                    { name: "raw_intro.mp4", size: "42MB", type: "video", active: true, icon: Film, bgClass: "bg-[rgba(244,63,94,0.08)] border-[rgba(244,63,94,0.25)] text-[#F5EFE6] shadow-[0_2px_8px_rgba(244,63,94,0.08)]" },
                    { name: "lofi_beat.wav", size: "4MB", type: "audio", active: true, icon: Music, bgClass: "bg-blueTheme/10 border-blueTheme/45 text-blue-400 shadow-[0_2px_8px_rgba(59,130,246,0.12)]" },
                    { name: "broll_laser.mp4", size: "12MB", type: "video", active: mockupState === 'preview', icon: Film, bgClass: "bg-[rgba(245,239,230,0.08)] border-[rgba(245,239,230,0.35)] text-[#F5EFE6] shadow-[0_2px_8px_rgba(245,239,230,0.08)]" }
                  ].map((file, i) => {
                    const FileIcon = file.icon;
                    return (
                      <div key={i} className={`p-1 px-1.5 rounded-lg border text-[8.5px] flex flex-col gap-0.5 transition-all duration-300 ${
                        file.active 
                          ? file.bgClass 
                          : 'border-slate-800/60 bg-slate-950/20 text-slate-550'
                      }`}>
                        <div className="flex items-center gap-1.5 min-w-0">
                          <FileIcon className={`w-3 h-3 shrink-0 ${file.active ? 'opacity-100 animate-pulse' : 'opacity-35'}`} />
                          <span className="font-mono truncate block font-semibold">{file.name}</span>
                        </div>
                        <div className="flex items-center justify-between font-mono text-[7px] leading-none">
                          <span className="opacity-60">{file.size}</span>
                          {file.active && (
                            <span className="flex items-center gap-1 bg-green-950/80 border border-green-550/45 rounded px-1 py-0.5 leading-none">
                              <span className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
                              <span className="text-[5.5px] text-green-400 uppercase tracking-wide font-extrabold font-mono">READY</span>
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Video Preview Studio */}
              <div className="flex-1 min-w-0">
                <div className="relative aspect-[21/10] rounded-xl overflow-hidden bg-slate-950 border border-white/[0.05] flex items-center justify-center shadow-inner">
                  {/* Background gradient indicator overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 z-10 pointer-events-none" />
                  
                  {mockupState === 'typing' && (
                    <div className="text-center space-y-2 text-slate-500 z-10">
                      <Film className="w-8 h-8 mx-auto animate-pulse text-purpleLight/40" />
                      <p className="text-[10px] font-mono tracking-wider">Awaiting AI Prompt...</p>
                    </div>
                  )}

                  {mockupState === 'processing' && (
                    <div className="text-center space-y-3.5 z-10 w-[80%]">
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-purpleLight animate-ping" />
                          <span>AI Rendering Studio...</span>
                        </span>
                        <span>{processProgress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/[0.05]">
                        <div className="h-full bg-gradient-to-r from-purpleTheme to-blueTheme rounded-full transition-all duration-100" style={{ width: `${processProgress}%` }} />
                      </div>
                    </div>
                  )}

                  {mockupState === 'preview' && (
                    <>
                      <video 
                        src="https://assets.mixkit.co/videos/preview/mixkit-abstract-laser-lights-background-41712-large.mp4" 
                        muted autoPlay loop playsInline 
                        className="absolute inset-0 w-full h-full object-cover opacity-70" 
                      />
                      
                      {/* Realtime Caption overlays */}
                      <div className="absolute bottom-4 left-3 right-3 z-20 text-center">
                        <span className="bg-gradient-to-r from-pinkTheme via-purpleTheme to-blueTheme text-white px-3.5 py-1.5 rounded-lg text-[10px] md:text-xs font-black tracking-wide shadow-[0_8px_24px_rgba(124,58,237,0.35)] uppercase inline-block font-heading max-w-[90%] transition-all duration-300 transform scale-102 border border-purpleLight/40">
                          {getMockupCaption(mockupTime)}
                        </span>
                      </div>

                      {/* Timecode overlay */}
                      <div className="absolute top-2 right-2 bg-slate-950/80 border border-white/[0.08] backdrop-blur-sm px-2.5 py-1 rounded-full text-[8.5px] font-mono font-bold text-slate-300 z-20 shadow-md">
                        TCR: 00:00:{Math.floor(mockupTime).toString().padStart(2, '0')}:{Math.floor((mockupTime % 1) * 30).toString().padStart(2, '0')}
                      </div>

                      {/* Active Render Badge */}
                      <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500/20 via-pink-500/15 to-purple-500/20 border border-red-500/40 px-2.5 py-1 rounded-full text-[8px] font-bold font-mono text-white tracking-wide z-20 flex items-center gap-1.5 shadow-[0_0_12px_rgba(239,68,68,0.25)]">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                        </span>
                        <span className="uppercase text-red-200 font-extrabold tracking-wider">LIVE PREVIEW</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Timeline Tracks Section */}
            <div className="space-y-1.5 pt-0.5 border-t border-white/[0.03]">
              <div className="flex items-center justify-between text-[8px] font-mono text-slate-500 border-b border-white/[0.03] pb-0.5">
                <span className="tracking-wider">TIMELINE TRACKS</span>
                <div className="flex gap-3.5">
                  <span>00:00</span>
                  <span>00:05</span>
                  <span>00:10</span>
                  <span>00:15</span>
                  <span>00:20</span>
                </div>
              </div>

              {/* Tracks Container */}
              <div className="relative border border-white/[0.03] bg-slate-950/50 rounded-xl p-1.5 space-y-1 overflow-hidden shadow-inner">
                {/* V1 Track (Video Blocks) */}
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-slate-900 border border-slate-800 rounded flex items-center justify-center text-slate-500 shrink-0">
                    <Film className="w-2 h-2" />
                  </div>
                  <div className="flex-1 h-4 relative" style={{ display: 'grid', gridTemplateColumns: 'repeat(20, minmax(0, 1fr))', gap: '2px' }}>
                    {/* Block 1: Intro (0-5s, spans 5 cols) */}
                    <div className={`col-span-5 rounded border transition-all duration-300 text-[7.5px] font-mono flex items-center justify-center truncate px-0.5 ${
                      mockupState === 'preview' && mockupTime < 5
                        ? 'bg-gradient-to-r from-blueTheme/25 via-blueTheme/35 to-purpleTheme/25 border-blueTheme/45 text-blue-400 shadow-sm shadow-blueTheme/10 scale-[1.02] -translate-y-[0.5px]'
                        : 'bg-[#101622]/60 border-white/[0.04] text-slate-400'
                    }`}>
                      Intro A-Roll
                    </div>
                    {/* Block 2: B-Roll overlay (5-12s, spans 7 cols) */}
                    <div className={`col-span-7 rounded border transition-all duration-300 text-[7.5px] font-mono flex items-center justify-center truncate px-0.5 ${
                      mockupState === 'preview' && mockupTime >= 5 && mockupTime < 12
                        ? 'bg-gradient-to-r from-purpleTheme/25 via-purpleTheme/35 to-blueTheme/25 border-purpleLight/45 text-purpleLight shadow-sm shadow-purpleTheme/10 scale-[1.02] -translate-y-[0.5px]'
                        : 'bg-[#101622]/60 border-white/[0.04] text-slate-400'
                    }`}>
                      B-Roll Laser
                    </div>
                    {/* Block 3: Outro (12-20s, spans 8 cols) */}
                    <div className={`col-span-8 rounded border transition-all duration-300 text-[7.5px] font-mono flex items-center justify-center truncate px-0.5 ${
                      mockupState === 'preview' && mockupTime >= 12
                        ? 'bg-gradient-to-r from-blueTheme/25 via-blueTheme/35 to-purpleTheme/25 border-blueTheme/45 text-blue-400 shadow-sm shadow-blueTheme/10 scale-[1.02] -translate-y-[0.5px]'
                        : 'bg-[#101622]/60 border-white/[0.04] text-slate-400'
                    }`}>
                      Outro A-Roll
                    </div>
                  </div>
                </div>

                {/* T1 Track (Subtitle Text Blocks) */}
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-slate-900 border border-slate-800 rounded flex items-center justify-center text-slate-500 shrink-0">
                    <MessageSquare className="w-2 h-2" />
                  </div>
                  <div className="flex-1 h-3 relative" style={{ display: 'grid', gridTemplateColumns: 'repeat(20, minmax(0, 1fr))', gap: '2px' }}>
                    {/* Captions Blocks */}
                    <div className={`col-span-5 rounded border text-[6.5px] font-mono flex items-center justify-center truncate px-0.5 transition-all duration-300 ${
                      mockupState === 'preview' && mockupTime < 5 ? 'bg-pinkTheme/20 border-pinkTheme/40 text-pinkTheme shadow-sm shadow-pinkTheme/10' : 'bg-slate-900/30 border-slate-800/20 text-slate-600'
                    }`}>
                      "Edit..."
                    </div>
                    <div className={`col-span-6 rounded border text-[6.5px] font-mono flex items-center justify-center truncate px-0.5 transition-all duration-300 ${
                      mockupState === 'preview' && mockupTime >= 5 && mockupTime < 11 ? 'bg-pinkTheme/20 border-pinkTheme/40 text-pinkTheme shadow-sm shadow-pinkTheme/10' : 'bg-slate-900/30 border-slate-800/20 text-slate-600'
                    }`}>
                      "Pak..."
                    </div>
                    <div className={`col-span-5 rounded border text-[6.5px] font-mono flex items-center justify-center truncate px-0.5 transition-all duration-300 ${
                      mockupState === 'preview' && mockupTime >= 11 && mockupTime < 16 ? 'bg-pinkTheme/20 border-pinkTheme/40 text-pinkTheme shadow-sm shadow-pinkTheme/10' : 'bg-slate-900/30 border-slate-800/20 text-slate-600'
                    }`}>
                      "Auto..."
                    </div>
                    <div className={`col-span-4 rounded border text-[6.5px] font-mono flex items-center justify-center truncate px-0.5 transition-all duration-300 ${
                      mockupState === 'preview' && mockupTime >= 16 ? 'bg-pinkTheme/20 border-pinkTheme/40 text-pinkTheme shadow-sm shadow-pinkTheme/10' : 'bg-slate-900/30 border-slate-800/20 text-slate-600'
                    }`}>
                      "Viral..."
                    </div>
                  </div>
                </div>

                {/* A1 Track (Audio Waveform) */}
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-slate-900 border border-slate-800 rounded flex items-center justify-center text-slate-500 shrink-0">
                    <Music className="w-2 h-2" />
                  </div>
                  <div className="flex-1 bg-slate-900/30 border border-slate-800/30 rounded h-3 relative overflow-hidden flex items-center px-1">
                    {/* Animated visualizer representation */}
                    <div className="flex items-center gap-[1px] w-full h-[6px]">
                      {Array.from({ length: 190 }).map((_, i) => {
                        const h = Math.sin(i * 0.15) * 2 + 3 + Math.random() * 1;
                        return (
                          <div 
                            key={i} 
                            className={`w-[1px] rounded-full transition-all duration-350 ${
                              mockupState === 'preview' ? 'bg-blueTheme/55' : 'bg-slate-700/55'
                            }`}
                            style={{ height: `${h}px` }} 
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Moving Playhead Indicator */}
                {mockupState === 'preview' && (
                  <div 
                    className="absolute top-0 bottom-0 w-[1.5px] bg-gradient-to-b from-red-500 to-red-600/40 z-30 pointer-events-none"
                    style={{ 
                      left: `calc(32px + (100% - 40px) * ${mockupTime / 20})`,
                      boxShadow: '0 0 10px rgba(239,68,68,0.6), 0 0 4px rgba(239,68,68,0.3)' 
                    }}
                  >
                    {/* Playhead Pin Handle */}
                    <div 
                      className="absolute top-0 -left-[5.25px] w-[12px] h-[12px] rotate-45 shadow-[0_2px_6px_rgba(239,68,68,0.4)] border border-red-400/50"
                      style={{
                        background: 'radial-gradient(circle at 35% 35%, #ff6b6b 0%, #ef4444 60%, #bd1c1c 100%)',
                        borderRadius: '0 50% 50% 50%'
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Waveform divider accent */}
            <WaveformDivider />

            {/* Prompt Input Bar (similar to Fiesta AI input prompt box) */}
            <div className="border border-purpleTheme/20 bg-[#101826]/90 shadow-md backdrop-blur-md rounded-xl p-2 flex items-center justify-between gap-2 relative z-10 transition-all duration-300 hover:border-purpleLight/20 hover:shadow-lg">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                {/* Glowing Sparkles badge */}
                <div className="w-5.5 h-5.5 rounded-lg bg-gradient-to-br from-purpleLight via-purpleTheme to-blueTheme flex items-center justify-center text-white shrink-0 shadow-sm">
                  <Sparkles className="w-3 h-3 text-white animate-pulse" />
                </div>
                <div className="text-[10px] md:text-[10.5px] min-w-0 truncate font-mono flex items-center gap-1.5">
                  <span className="bg-gradient-to-r from-purpleLight to-blueTheme bg-clip-text text-transparent font-extrabold tracking-wide">ai_prompt:</span>
                  <span className="text-slate-100 font-semibold truncate block">{typedText}</span>
                  {mockupState === 'typing' && (
                    <span className="w-1.5 h-3.5 bg-blueTheme shadow-[0_0_3px_rgba(79, 209, 255, 0.2)] animate-pulse inline-block rounded-sm" />
                  )}
                </div>
              </div>
              
              <button className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all shrink-0 ${
                mockupState === 'typing' 
                  ? 'bg-slate-800/80 border border-slate-700/60 text-slate-400' 
                  : 'bg-gradient-to-r from-purpleLight via-purpleTheme to-blueTheme text-white shadow-sm scale-105 animate-pulse hover:scale-110'
              }`}>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

      {/* SECTION 3: STACKED SCROLL FEATURE CARDS */}
      <StackedFeatureCards navigate={navigate} />

      {/* SECTION 4: BEFORE VS AFTER COMPARISON */}
      <section 
        ref={sectionRef}
        className="relative z-10 px-6 md:px-[6%] py-16 md:py-24 max-w-4xl mx-auto w-full text-center space-y-10 border-t border-purpleTheme/10"
        style={{ background: 'radial-gradient(circle at 50% 0%, rgba(61,90,128,0.06) 0%, transparent 60%)' }}
      >
        <div className="space-y-2">
          <span className="text-xs font-bold text-purpleLight uppercase tracking-widest">Visual Evidence</span>
          <h2 className="text-2xl md:text-4xl font-extrabold font-heading text-white">Compare the AI Transformation</h2>
          <p className="text-xs md:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            Drag the comparison slider left and right to reveal the raw original footage vs the color-graded, captioned AI edit.
          </p>
        </div>

        {/* Professional Video Player Container - Wide aspect-[4/3] optimized */}
        <div className="relative w-full max-w-2xl mx-auto rounded-3xl overflow-hidden border border-purpleTheme/10 bg-[#090915]/95 shadow-2xl backdrop-blur-md p-1 md:p-1.5 animate-[fadeIn_0.6s_ease-out] hover:border-purpleLight/20 hover:shadow-3xl transition-all duration-500">
          
          {/* Top window controls */}
          <div className="flex items-center justify-between px-3 py-2 bg-slate-950/60 rounded-t-2xl border-b border-white/[0.04] text-[10px] font-mono">
            {/* macOS traffic dots */}
            <div className="flex items-center gap-1 select-none">
              <span className="w-2 h-2 rounded-full bg-[#ef4444]/80" />
              <span className="w-2 h-2 rounded-full bg-[#f59e0b]/80" />
              <span className="w-2 h-2 rounded-full bg-[#10b981]/80" />
            </div>
            {/* Sequence Title */}
            <div className="flex items-center gap-1 text-slate-400 font-semibold text-[9px] md:text-[10px] truncate max-w-[140px]">
              <span className="w-1 h-1 bg-purpleLight rounded-full animate-pulse" />
              <span>thundra_render.mp4</span>
            </div>
            {/* Status tag */}
            <div className="flex items-center gap-1">
              <span className="px-1.5 py-0.5 rounded bg-purpleTheme/20 border border-purpleLight/30 text-[7px] text-purpleLight font-bold">MODE: DUAL_PLAY</span>
            </div>
          </div>

          {/* Main Visual Slider (aspect-[4/3] - Wider and less tall) */}
          <div className="relative w-full aspect-[4/3] bg-[#05050a] overflow-hidden select-none">
            
            {/* 1. BEFORE LAYER (Bottom) - RAW camera feed */}
            <div className="absolute inset-0 select-none">
              <video 
                ref={videoBeforeRef}
                src="/raw.mp4"
                className="w-full h-full object-contain pointer-events-none"
                style={{ filter: 'none' }}
                muted={true}
                playsInline
                preload="auto"
              />
            </div>

            {/* 2. AFTER LAYER (Top clipped to the right side) - AI Edited & Graded */}
            <div 
              className="absolute inset-y-0 left-0 right-0 overflow-hidden select-none pointer-events-none"
              style={{ clipPath: `polygon(${sliderPos}% 0%, 100% 0%, 100% 100%, ${sliderPos}% 100%)` }}
            >
              <video 
                ref={videoAfterRef}
                src="/edited.mp4"
                className="w-full h-full object-contain pointer-events-none"
                style={{ filter: 'none' }}
                muted={isMuted}
                playsInline
                preload="auto"
                onTimeUpdate={handleTimeUpdate}
              />
            </div>

            {/* 3. STATIC ALWAYS-VISIBLE OVERLAY CORNER BADGES (Compact to avoid overlap) */}
            <div className="absolute top-3.5 left-3.5 bg-slate-950/80 border border-white/10 px-2 py-0.5 rounded text-[8px] font-mono text-slate-355 font-medium tracking-wide shadow backdrop-blur-sm z-20 pointer-events-none select-none">
              📷 RAW
            </div>
            <div className="absolute top-3.5 right-3.5 bg-purpleTheme/80 border border-purpleLight/30 px-2 py-0.5 rounded text-[8px] font-mono text-white font-bold tracking-wide shadow-[0_0_10px_rgba(124,58,237,0.35)] backdrop-blur-sm z-20 pointer-events-none select-none">
              ✨ GRADED
            </div>

            {/* 4. DYNAMIC SUBTITLES OVERLAY (Centered, simple glass capsule) */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[90%] text-center pointer-events-none z-20 select-none">
              <span className="bg-slate-950/85 text-slate-100 font-medium text-[10px] md:text-xs px-3.5 py-1.5 rounded-full border border-white/[0.06] shadow-xl backdrop-blur-md tracking-wide">
                {getSubtitles(currentTime)}
              </span>
            </div>

            {/* 5. DRAG HANDLE SEPARATOR LINE (z-index 20) */}
            <div 
              className="absolute inset-y-0 w-[2px] bg-gradient-to-b from-purpleLight via-purpleTheme to-blueTheme pointer-events-none z-20"
              style={{ 
                left: `${sliderPos}%`,
                boxShadow: '0 0 10px rgba(167, 139, 250, 0.8), 0 0 20px rgba(167, 139, 250, 0.4)' 
              }}
            >
              {/* Drag Handle Circle */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-slate-950 border border-purpleLight flex items-center justify-center text-white text-[10px] shadow-lg cursor-ew-resize select-none active:scale-110 active:border-blueTheme transition-transform">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="text-purpleLight">
                  <path d="m18 17 5-5-5-5M6 7l-5 5 5 5"/>
                </svg>
              </div>
            </div>

            {/* Hidden Input range for slider controls overlay */}
            <input 
              type="range"
              min="0"
              max="100"
              value={sliderPos}
              onChange={(e) => setSliderPos(parseFloat(e.target.value))}
              className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-20"
            />
          </div>

          {/* Bottom video player controls - Ultra Clean & Narrow Optimized */}
          <div className="flex items-center justify-between px-3 py-2 bg-[#07070e] rounded-b-2xl border-t border-white/[0.04]">
            {/* Play/Pause controls & Scrubber timeline bar */}
            <div className="flex items-center gap-2 flex-1 min-w-0 pr-2">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-350 hover:text-white hover:bg-slate-800 hover:border-slate-700 transition-all active:scale-95 shrink-0"
                title={isPlaying ? "Pause Video" : "Play Video"}
              >
                {isPlaying ? (
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor" className="text-purpleLight">
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                ) : (
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor" className="text-purpleLight ml-[1px]">
                    <polygon points="6 3 20 12 6 21 6 3"/>
                  </svg>
                )}
              </button>
              
              {/* Interactive Timeline Scrubber (Clickable) */}
              <div 
                ref={timelineRef}
                onClick={(e) => {
                  if (!timelineRef.current) return;
                  try {
                    const rect = timelineRef.current.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
                    const masterDuration = videoAfterRef.current?.duration || 15.0;
                    const newTime = percentage * masterDuration;
                    setCurrentTime(newTime);
                    
                    if (videoAfterRef.current) {
                      videoAfterRef.current.currentTime = newTime;
                    }
                    if (videoBeforeRef.current && videoBeforeRef.current.readyState >= 1) {
                      videoBeforeRef.current.currentTime = newTime;
                    }
                  } catch (err) {
                    console.warn("Timeline seek error:", err);
                  }
                }}
                className="flex-grow h-1.5 bg-slate-950 border border-white/[0.03] rounded-full overflow-hidden relative flex items-center cursor-pointer group"
                title="Seek Video"
              >
                <div 
                  className="h-full bg-gradient-to-r from-purpleTheme via-purpleLight to-blueTheme rounded-full transition-all duration-75" 
                  style={{ width: `${(currentTime / (videoAfterRef.current?.duration || 15.0)) * 100}%` }} 
                />
              </div>
              
              <span className="font-mono text-[9px] text-slate-550 select-none shrink-0">
                00:{Math.floor(currentTime).toString().padStart(2, '0')}
              </span>
            </div>

            {/* Right side speaker volume toggle */}
            <div className="flex items-center gap-1 select-none font-mono text-[9px] text-slate-400">
              <button 
                onClick={() => setIsMuted(!isMuted)}
                className="text-slate-500 hover:text-slate-350 transition-colors p-1"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-red-400">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                    <line x1="23" y1="9" x2="17" y2="15"/>
                    <line x1="17" y1="9" x2="23" y2="15"/>
                  </svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-purpleLight">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 5: AI PROCESSING PIPELINE FLOW CHART */}
      <section 
        className="relative z-10 px-6 md:px-[6%] py-16 md:py-24 max-w-7xl mx-auto w-full text-center space-y-12 border-t border-purpleTheme/10"
        style={{ background: 'radial-gradient(circle at 50% 0%, rgba(79,209,255,0.06) 0%, transparent 60%)' }}
      >
        <div className="space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold text-[#4FD1FF] bg-[#4FD1FF]/10 border border-[#4FD1FF]/20 uppercase tracking-wider mb-2 font-mono">
            Under The Hood
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold font-heading text-white">The AI Processing Pipeline</h2>
          <p className="text-xs md:text-sm text-slate-400 max-w-md mx-auto leading-relaxed font-body">
            Our pipeline structures raw visual assets into H.264 formats through a sequence of intelligent steps.
          </p>
        </div>

        {/* Pipeline horizontal workflow chart */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:flex lg:flex-nowrap items-stretch justify-center gap-3 w-full max-w-7xl mx-auto">
          {PIPELINE_STEPS.map((step, idx, arr) => {
            const Icon = step.icon;
            return (
              <React.Fragment key={idx}>
                <div className="group relative flex-1 min-w-[120px] flex flex-col justify-between p-4 rounded-xl border border-white/[0.04] bg-[#0a0f1d]/40 backdrop-blur-md hover:bg-[#0c1326]/60 hover:border-[#4FD1FF]/30 hover:shadow-[0_0_20px_rgba(79,209,255,0.08)] transition-all duration-300 transform hover:-translate-y-1 text-center">
                  
                  {/* Ambient inner glow */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-[#4FD1FF]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  
                  <div>
                    {/* Step number and subtle hover effect */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[9px] font-mono text-slate-500 font-bold bg-white/[0.02] border border-white/[0.04] px-1.5 py-0.5 rounded">
                        {step.id}
                      </span>
                      {/* Visual active indicator dot */}
                      <div className="w-1 h-1 rounded-full bg-[#4FD1FF]/0 group-hover:bg-[#4FD1FF] group-hover:shadow-[0_0_8px_#4FD1FF] transition-all duration-300" />
                    </div>

                    {/* Icon with circular micro-gradient */}
                    <div className="mx-auto w-10 h-10 mb-3 flex items-center justify-center rounded-lg bg-[#4FD1FF]/[0.03] border border-[#4FD1FF]/[0.08] text-[#4FD1FF] group-hover:bg-[#4FD1FF]/10 group-hover:border-[#4FD1FF]/25 group-hover:scale-110 transition-all duration-300">
                      <Icon className="w-4.5 h-4.5" />
                    </div>

                    {/* Step Title */}
                    <h3 className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors mb-1 font-heading">
                      {step.name}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-[9px] text-slate-500 leading-normal group-hover:text-slate-400 transition-colors mt-1 font-body">
                    {step.desc}
                  </p>
                </div>

                {/* Connecting indicators (horizontal on desktop, hidden on mobile/tablet) */}
                {idx < arr.length - 1 && (
                  <div className="hidden lg:flex items-center justify-center shrink-0 text-[#4FD1FF]/30">
                    <ArrowRight className="w-4 h-4 animate-pulse" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </section>

      {/* SECTION 6: WHY THUNDRA AI - COMPARISON TABLE */}
      <section 
        className="relative z-10 px-6 md:px-[6%] py-16 md:py-24 max-w-4xl mx-auto w-full text-center space-y-12 border-t border-purpleTheme/10"
        style={{ background: 'radial-gradient(circle at 50% 0%, rgba(79,209,255,0.05) 0%, transparent 60%)' }}
      >
        <div className="space-y-2">
          <span className="text-xs font-bold text-purpleLight uppercase tracking-widest">Efficiency Metrics</span>
          <h2 className="text-2xl md:text-4xl font-extrabold font-heading text-white">Thundra vs Traditional Editing</h2>
          <p className="text-xs md:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            See how Thundra AI compares against standard manual timeline software.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-purpleTheme/15 bg-[#090915]/60 backdrop-blur-md">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="border-b border-purpleTheme/10 bg-black/40 font-heading">
                <th className="p-4 font-bold text-slate-400 uppercase tracking-wider">Metrics</th>
                <th className="p-4 font-bold text-red-400 uppercase tracking-wider">Traditional Editing</th>
                <th className="p-4 font-bold text-purpleLight uppercase tracking-wider bg-purpleTheme/5">Thundra AI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purpleTheme/10 font-body">
              {[
                { metric: "⏱ Production Speed", trad: "Hours/Days of manual cuts", thun: "Processed in 60 seconds" },
                { metric: "💬 Captions/Subtitles", trad: "Manual transcribing & syncing", thun: "Transcribed in Urdu/English instantly" },
                { metric: "🎬 Stock Footage Search", trad: "Hours searching stock libraries", thun: "Contextual B-roll matched by AI" },
                { metric: "🛠 Software Complexity", trad: "Steep learning curve (Premiere/DaVinci)", thun: "Easy chat workspace" },
                { metric: "💰 Monthly Cost", trad: "$150+/month for software & stock subscriptions", thun: "$19/month starting" }
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-900/30 transition-colors">
                  <td className="p-4 font-bold text-slate-200">{row.metric}</td>
                  <td className="p-4 text-slate-400">{row.trad}</td>
                  <td className="p-4 text-white font-semibold bg-purpleTheme/5">{row.thun}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 7: PRICING PLANS */}
      <section 
        id="pricing" 
        className="relative z-10 px-6 md:px-[6%] py-24 md:py-32 max-w-6xl mx-auto w-full text-center space-y-12 border-t border-purpleTheme/10"
        style={{ 
          backgroundColor: '#060913',
          backgroundImage: `
            radial-gradient(circle at 50% 30%, rgba(79, 209, 255, 0.08) 0%, transparent 65%),
            linear-gradient(rgba(255, 255, 255, 0.012) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.012) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 44px 44px, 44px 44px',
          backgroundPosition: 'center top'
        }}
      >
        <div className="space-y-4">
          <span className="text-xs font-bold text-[#4FD1FF] uppercase tracking-widest bg-[#4FD1FF]/10 border border-[#4FD1FF]/20 px-3.5 py-1.5 rounded-full inline-block">
            Flexible pricing
          </span>
          <h2 className="text-3xl md:text-5xl font-black font-heading text-white tracking-tight">
            One Plan. Unlimited Power.
          </h2>
          <p className="text-xs md:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed font-body">
            Stop paying for 5 separate editing services. Get a complete professional AI production studio under a single premium subscription.
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto pt-6">
          {/* Main Versus Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-stretch relative">
            
            {/* Left Column: Traditional Production (Pain Points) */}
            <div 
              className="rounded-3xl p-8 flex flex-col justify-between h-full transition-all duration-500 hover:-translate-y-1.5 border relative backdrop-blur-xl group overflow-hidden text-left"
              style={{
                backgroundColor: '#0E0E11',
                borderColor: 'rgba(255, 255, 255, 0.05)',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)'
              }}
            >
              {/* Top subtle red indicator bar */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-500/20 via-red-500/40 to-red-500/20" />

              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="text-[9px] font-mono font-bold text-red-400 tracking-widest uppercase bg-red-950/20 border border-red-500/15 px-2.5 py-0.5 rounded-md inline-block">
                    Individual Subscriptions
                  </span>
                  <h3 className="text-xl font-bold text-white font-heading tracking-tight">Traditional Production</h3>
                  <p className="text-xs text-slate-400">What you pay separately for basic creator tools every month</p>
                </div>

                <div className="flex items-baseline gap-1.5 py-1">
                  <span className="text-4xl lg:text-5xl font-black text-red-500 font-heading">$114</span>
                  <span className="text-xs text-slate-500 font-mono">/ month</span>
                  <span className="text-[10px] text-red-450/90 font-bold ml-3 bg-red-950/30 border border-red-500/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    ~ PKR 32,000/mo
                  </span>
                </div>

                <ul className="space-y-2 pt-5 border-t border-white/[0.05]">
                  {[
                    { icon: <Film className="w-4 h-4 text-slate-500 shrink-0" />, name: "Adobe Premiere Pro (Editing Suite)", price: "$24/mo" },
                    { icon: <Database className="w-4 h-4 text-slate-500 shrink-0" />, name: "Premium Stock Video Platform", price: "$30/mo" },
                    { icon: <MessageSquare className="w-4 h-4 text-slate-500 shrink-0" />, name: "AI Auto-Captioner Utility", price: "$15/mo" },
                    { icon: <Music className="w-4 h-4 text-slate-500 shrink-0" />, name: "AI Voice-Over & Audio Enhancer", price: "$20/mo" },
                    { icon: <Sparkles className="w-4 h-4 text-slate-500 shrink-0" />, name: "Cinematic LUTs & Preset Packs", price: "$25/mo" },
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center justify-between text-xs text-slate-350 py-3 border-b border-white/[0.04] last:border-0">
                      <div className="flex items-center gap-3 min-w-0">
                        {item.icon}
                        <span className="truncate text-slate-300 font-medium">{item.name}</span>
                      </div>
                      <span className="font-mono text-red-400 font-semibold shrink-0 ml-4">{item.price}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3.5 pt-6 mt-6 border-t border-white/[0.05]">
                <div className="flex items-start gap-3 text-xs text-red-400/90 font-medium">
                  <div className="w-4.5 h-4.5 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <X className="w-2.5 h-2.5 text-red-400 stroke-[3]" />
                  </div>
                  <span>Multiple separate service renewals to keep track of</span>
                </div>
                <div className="flex items-start gap-3 text-xs text-red-400/90 font-medium">
                  <div className="w-4.5 h-4.5 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <X className="w-2.5 h-2.5 text-red-400 stroke-[3]" />
                  </div>
                  <span>Constant tab switching, manual asset importing, and render lag</span>
                </div>
                <div className="flex items-start gap-3 text-xs text-red-400/90 font-medium">
                  <div className="w-4.5 h-4.5 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <X className="w-2.5 h-2.5 text-red-400 stroke-[3]" />
                  </div>
                  <span>Steep software complexity and heavy learning curve</span>
                </div>
              </div>
            </div>

            {/* Middle VS Badge (Desktop) */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:flex items-center justify-center z-30 pointer-events-none">
              <div className="relative">
                {/* Glowing aura rings */}
                <div className="absolute -inset-5 bg-[#4FD1FF] rounded-full blur-xl opacity-35 animate-pulse" />
                <div className="absolute -inset-1 bg-[#4FD1FF] rounded-full blur-sm opacity-50" />
                {/* Outer ring */}
                <div className="w-14 h-14 rounded-full bg-[#131b24] border border-[#4FD1FF]/40 flex items-center justify-center shadow-[0_0_25px_rgba(79,209,255,0.35)]">
                  <span className="font-heading font-black text-sm text-[#4FD1FF] tracking-widest pl-[2px]">VS</span>
                </div>
              </div>
            </div>

            {/* Mobile VS Badge (Stacks in flow) */}
            <div className="lg:hidden flex items-center justify-center py-4 pointer-events-none">
              <div className="relative">
                <div className="absolute -inset-4 bg-[#4FD1FF] rounded-full blur-lg opacity-35 animate-pulse" />
                <div className="w-11 h-11 rounded-full bg-[#131b24] border border-[#4FD1FF]/30 flex items-center justify-center shadow-[0_0_15px_rgba(79,209,255,0.25)]">
                  <span className="font-heading font-black text-xs text-[#4FD1FF]">VS</span>
                </div>
              </div>
            </div>

            {/* Right Column: Thundra Premium Plan */}
            <div 
              className="rounded-3xl p-8 flex flex-col justify-between h-full transition-all duration-500 hover:-translate-y-1.5 border relative overflow-hidden group text-left"
              style={{
                backgroundColor: '#0B1220',
                borderColor: 'rgba(79, 209, 255, 0.25)',
                boxShadow: '0 25px 65px rgba(79, 209, 255, 0.15), 0 0 45px rgba(79, 209, 255, 0.04)'
              }}
            >
              {/* Cyan Neon Edge Lightbar Reflection */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[220px] h-[3px] bg-gradient-to-r from-[#4FD1FF] via-[#3D5A80] to-[#4FD1FF] rounded-b-full shadow-[0_1px_15px_rgba(79,209,255,0.85)]" />

              <div className="space-y-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {/* Pulsing Thundra Logo Icon */}
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#3D5A80] to-[#4FD1FF] flex items-center justify-center shadow-[inset_0_1px_4px_rgba(255,255,255,0.3)]">
                      <Sparkles className="w-4.5 h-4.5 text-white animate-pulse" />
                    </div>
                    <span className="font-heading font-extrabold text-xl text-white tracking-tight">Thundra AI</span>
                  </div>

                  <span className="bg-[#4FD1FF]/10 border border-[#4FD1FF]/30 text-[#4FD1FF] text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-md shadow-sm">
                    ⚡ Unified Suite
                  </span>
                </div>

                {/* Subtitle description */}
                <p className="text-xs text-slate-400">Everything you need for viral video production, combined under a single state-of-the-art AI workspace.</p>

                {/* Interactive Billing Cards Selector */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                  
                  {/* Monthly Tab Selection Card */}
                  <div 
                    onClick={() => setIsAnnual(false)}
                    className={`cursor-pointer rounded-2xl p-4 border transition-all duration-300 text-left relative flex flex-col justify-between h-[85px] select-none ${
                      !isAnnual 
                        ? 'bg-[#101b2b]/95 border-[#4FD1FF] shadow-[0_0_18px_rgba(79,209,255,0.2)]' 
                        : 'bg-[#15202b]/40 border-white/[0.04] hover:border-white/[0.08] hover:bg-[#15202b]/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-black text-white font-heading">
                        $19<span className="text-[10px] text-slate-450 font-normal font-sans tracking-normal">/mo</span>
                      </span>
                      {/* Check radio indicator */}
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
                        !isAnnual ? 'bg-white text-slate-950 shadow-sm' : 'border border-[#4FD1FF]/30'
                      }`}>
                        {!isAnnual && <Check className="w-3 h-3 stroke-[3] text-slate-950" />}
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Monthly Billing</span>
                  </div>

                  {/* Yearly Tab Selection Card */}
                  <div 
                    onClick={() => setIsAnnual(true)}
                    className={`cursor-pointer rounded-2xl p-4 border transition-all duration-300 text-left relative flex flex-col justify-between h-[85px] select-none ${
                      isAnnual 
                        ? 'bg-[#101b2b]/95 border-[#4FD1FF] shadow-[0_0_18px_rgba(79,209,255,0.2)]' 
                        : 'bg-[#15202b]/40 border-white/[0.04] hover:border-white/[0.08] hover:bg-[#15202b]/60'
                    }`}
                  >
                    {/* Floating popular banner */}
                    <span className="absolute -top-2.5 right-4 bg-[#4FD1FF] border border-[#4FD1FF]/40 text-slate-950 text-[7px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded shadow-sm leading-none">
                      Best Value
                    </span>
                    
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xs text-slate-500 line-through font-mono font-bold">$228</span>
                        <span className="text-lg font-black text-white font-heading">
                          $15<span className="text-[10px] text-slate-450 font-normal font-sans tracking-normal">/mo</span>
                        </span>
                      </div>
                      {/* Check radio indicator */}
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
                        isAnnual ? 'bg-white text-slate-950 shadow-sm' : 'border border-[#4FD1FF]/30'
                      }`}>
                        {isAnnual && <Check className="w-3 h-3 stroke-[3] text-slate-950" />}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-[8px] font-bold tracking-tight">
                      <span className="text-[#4FD1FF] uppercase">Save 20% (Billed Yearly)</span>
                      <span className="text-[#4FD1FF] bg-[#4FD1FF]/12 border border-[#4FD1FF]/20 px-1.5 py-0.2 rounded font-extrabold">+ Free Presets</span>
                    </div>
                  </div>
                </div>

                {/* Ultimate Presets Present Highlight Banner */}
                <div className="bg-black/60 border border-[#4FD1FF]/15 rounded-full py-2 px-4 flex items-center justify-center gap-2.5 shadow-[inset_0_1px_8px_rgba(79,209,255,0.06)]">
                  <span className="text-xs">🎁</span>
                  <span className="text-[9.5px] font-black text-[#4FD1FF] uppercase tracking-widest font-heading select-none text-center">
                    Ultimate Presets, LUTs, & Cinematic Sound Pack Included
                  </span>
                </div>

                {/* Premium Features List with Checkmarks and ToolBadges */}
                <ul className="space-y-0.5 pt-2 border-t border-[#4FD1FF]/15">
                  <li className="flex items-center justify-between text-xs text-slate-200 font-semibold border-b border-[#1c2a37] py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#4FD1FF]/15 border border-[#4FD1FF]/30 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-[#4FD1FF] stroke-[3]" />
                      </div>
                      <span>All Premium AI Editing Models & Tools</span>
                    </div>
                    {/* Compact logo badges of the suite tools */}
                    <div className="flex items-center -space-x-1.5 bg-slate-950/80 border border-white/[0.06] p-1 rounded-lg select-none">
                      <div className="w-4 h-4 rounded-full bg-slate-900 flex items-center justify-center border border-slate-750" title="AI Video Cutter">
                        <Film className="w-2.5 h-2.5 text-[#4FD1FF]" />
                      </div>
                      <div className="w-4 h-4 rounded-full bg-slate-900 flex items-center justify-center border border-slate-750" title="Audio Beat Sync">
                        <Music className="w-2.5 h-2.5 text-[#4FD1FF]" />
                      </div>
                      <div className="w-4 h-4 rounded-full bg-slate-900 flex items-center justify-center border border-slate-750" title="Urdu/English Captions">
                        <MessageSquare className="w-2.5 h-2.5 text-[#4FD1FF]" />
                      </div>
                      <div className="w-4.5 h-4.5 rounded-full bg-slate-900 flex items-center justify-center border border-slate-750" title="AI Special Effects">
                        <Sparkles className="w-2.5 h-2.5 text-[#4FD1FF]" />
                      </div>
                    </div>
                  </li>

                  <li className="flex items-center gap-3 text-xs text-slate-200 font-semibold border-b border-[#1c2a37] py-3.5">
                    <div className="w-5 h-5 rounded-full bg-[#4FD1FF]/15 border border-[#4FD1FF]/30 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-[#4FD1FF] stroke-[3]" />
                    </div>
                    <span>Side-by-side comparison & rendering validation</span>
                  </li>

                  <li className="flex items-center gap-3 text-xs text-slate-200 font-semibold border-b border-[#1c2a37] py-3.5">
                    <div className="w-5 h-5 rounded-full bg-[#4FD1FF]/15 border border-[#4FD1FF]/30 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-[#4FD1FF] stroke-[3]" />
                    </div>
                    <span>Unlimited video edits & 4K production exports</span>
                  </li>

                  <li className="flex items-center gap-3 text-xs text-slate-200 font-semibold border-b border-[#1c2a37] py-3.5">
                    <div className="w-5 h-5 rounded-full bg-[#4FD1FF]/15 border border-[#4FD1FF]/30 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-[#4FD1FF] stroke-[3]" />
                    </div>
                    <span>Instant contextual B-Roll matching & auto silence cuts</span>
                  </li>

                  <li className="flex items-center gap-3 text-xs text-slate-200 font-semibold border-b border-[#1c2a37] py-3.5">
                    <div className="w-5 h-5 rounded-full bg-[#4FD1FF]/15 border border-[#4FD1FF]/30 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-[#4FD1FF] stroke-[3]" />
                    </div>
                    <span>Urdu, Roman Urdu, & English auto captions generator</span>
                  </li>

                  <li className="flex items-center gap-3 text-xs text-slate-200 font-semibold py-3.5">
                    <div className="w-5 h-5 rounded-full bg-[#4FD1FF]/15 border border-[#4FD1FF]/30 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-[#4FD1FF] stroke-[3]" />
                    </div>
                    <span>Add-on features: Voice-cloning & team workspace nodes</span>
                  </li>
                </ul>
              </div>

              {/* Get Started Now CTA Button */}
              <div className="pt-8 relative z-10">
                <button 
                  onClick={() => navigate('/editor')}
                  className="w-full py-4 rounded-full bg-gradient-to-r from-[#2f4b75] via-[#2563eb] to-[#4FD1FF] premium-btn-glow active:scale-[0.99] hover:scale-[1.01] text-white font-heading font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 border border-[#4FD1FF]/30 shadow-md"
                >
                  <span>Get Started Now</span>
                  <ArrowRight className="w-4.5 h-4.5 animate-pulse" />
                </button>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* SECTION 8: FAQ SECTION */}
      <section 
        className="relative z-10 px-6 md:px-[6%] py-16 md:py-24 max-w-3xl mx-auto w-full text-center space-y-10 border-t border-purpleTheme/10"
        style={{ background: 'radial-gradient(circle at 50% 0%, rgba(245,239,230,0.04) 0%, transparent 60%)' }}
      >
        <div className="space-y-2">
          <span className="text-xs font-bold text-purpleLight uppercase tracking-widest font-heading">Help Desk</span>
          <h2 className="text-2xl md:text-4xl font-extrabold font-heading text-white">Frequently Asked Questions</h2>
          <p className="text-xs md:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            Need answers? Find info regarding transcribing, grading, and rendering.
          </p>
        </div>

        <div className="space-y-3.5 text-left">
          {FAQ_ITEMS.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div 
                key={idx}
                className="rounded-2xl border border-purpleTheme/10 bg-[#0c0c16]/50 overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? -1 : idx)}
                  className="w-full px-5 py-4 flex items-center justify-between gap-4 text-xs md:text-sm font-bold text-white hover:text-purpleLight transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-purpleLight' : ''}`} />
                </button>
                
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-5 pb-5 pt-1 text-xs text-slate-400 leading-relaxed font-body">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 9: FINAL CALL TO ACTION */}
      <section 
        className="relative z-10 px-6 md:px-[6%] py-16 md:py-24 max-w-7xl mx-auto w-full text-center border-t border-purpleTheme/10"
        style={{ background: 'radial-gradient(circle at 50% 0%, rgba(61,90,128,0.06) 0%, transparent 70%)' }}
      >
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-purpleTheme/15 via-[#080811] to-blueTheme/5 border border-purpleTheme/20 p-8 md:p-16 rounded-3xl relative overflow-hidden space-y-6">
          <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-purpleTheme/5 rounded-full blur-[80px]" />
          
          <div className="space-y-3 relative z-10">
            <h2 className="text-3xl md:text-5xl font-black font-heading text-white tracking-tight">
              Ready to Edit Videos Smarter?
            </h2>
            <p className="text-xs md:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
              Let Thundra AI handle the tedious timeline cuts, transcribing, and grades while you focus entirely on creating great content.
            </p>
          </div>

          <div className="pt-2 relative z-10">
            <button
              onClick={() => navigate('/editor')}
              className="bg-gradient-to-r from-purpleTheme to-blueTheme px-8 py-4 rounded-xl font-bold font-heading text-xs uppercase tracking-wider text-white shadow-lg shadow-black/40 hover:shadow-[0_4px_20px_rgba(79,209,255,0.12)] hover:scale-[1.03] transition-all inline-flex items-center gap-2"
            >
              <span>Start Editing Now ⚡</span>
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />

    </div>
  );
}
