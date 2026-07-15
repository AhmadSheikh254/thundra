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
      animation: `bg-film-drift 28s ease-in-out ${animDelay} infinite`,
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


const HeroMockup = React.memo(({ navigate }) => {
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

  return (
    <div className="w-full max-w-[470px] lg:max-w-[490px] xl:max-w-[530px] relative z-10 animate-float mx-auto" style={{ perspective: '1200px' }}>
      <div className="hero-studio-tilt w-full relative">
        <div aria-hidden className="hero-studio-backplate" />
        <CardHUDFrame />
        <div 
          className="w-full rounded-[24px] p-3 md:p-3.5 space-y-2.5 overflow-hidden relative"
          style={{
            background: 'linear-gradient(155deg, rgba(26,37,56,0.92) 0%, rgba(19,30,48,0.94) 40%, rgba(15,23,38,0.96) 75%, rgba(11,18,31,0.97) 100%)',
            backdropFilter: 'blur(24px) saturate(150%)',
            WebkitBackdropFilter: 'blur(24px) saturate(150%)',
            border: '1px solid rgba(255,255,255,0.09)',
            boxShadow: [
              '0 0 0 1px rgba(255,255,255,0.03)',
              '0 2px 4px rgba(0,0,0,0.4)',
              '0 8px 16px rgba(0,0,0,0.45)',
              '0 24px 48px rgba(0,0,0,0.5)',
              '0 48px 80px rgba(0,0,0,0.4)',
              'inset 0 1px 0 rgba(255,255,255,0.07)',
              'inset 0 -1px 0 rgba(0,0,0,0.3)',
              'inset 12px 0 32px rgba(79,209,255,0.025)',
              'inset -12px 0 32px rgba(168,85,247,0.03)',
              'inset 0 -14px 36px rgba(244,63,94,0.02)'
            ].join(', ')
          }}
        >
          <div className="absolute top-0 left-0 w-56 h-32 pointer-events-none rounded-tl-[24px]" style={{ background: 'radial-gradient(ellipse at 10% 10%, rgba(79,209,255,0.055) 0%, rgba(61,90,128,0.03) 40%, transparent 70%)', zIndex: 1 }} />
          <div className="absolute top-0 left-12 right-12 h-[1px] pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 30%, rgba(79,209,255,0.15) 50%, rgba(255,255,255,0.12) 70%, transparent 100%)', zIndex: 8 }} />
          <div className="absolute top-8 left-0 w-[1px] h-24 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(79,209,255,0.08) 0%, transparent 100%)', zIndex: 8 }} />
          <div className="absolute bottom-0 right-0 w-48 h-28 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 90% 90%, rgba(0,0,0,0.45) 0%, transparent 60%)', zIndex: 1 }} />
          <div className="absolute inset-[1px] pointer-events-none rounded-[23px]" style={{ background: 'linear-gradient(175deg, rgba(255,255,255,0.032) 0%, rgba(255,255,255,0.008) 25%, transparent 50%)', zIndex: 2 }} />
          <div aria-hidden className="hero-studio-aurora absolute inset-0 pointer-events-none rounded-[24px]" style={{ zIndex: 1 }} />
          <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none rounded-b-[24px]" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.25) 0%, transparent 100%)', zIndex: 3 }} />
          <div aria-hidden className="hero-studio-glare absolute inset-0 pointer-events-none rounded-[24px]" style={{ zIndex: 9 }} />
          <div aria-hidden className="hero-studio-edgeglow" style={{ zIndex: 8 }} />
          
          <div className="flex items-center justify-between -mx-3 -mt-3 md:-mx-3.5 md:-mt-3.5 px-4 py-2 rounded-t-[23px] border-b relative z-10"
            style={{
              background: 'linear-gradient(180deg, rgba(8,12,22,0.92) 0%, rgba(10,15,24,0.85) 100%)',
              backdropFilter: 'blur(16px)',
              borderColor: 'rgba(255,255,255,0.045)',
              boxShadow: '0 1px 0 rgba(255,255,255,0.04) inset, 0 1px 8px rgba(0,0,0,0.2)'
            }}
          >
            <div className="flex items-center gap-1.5">
              {[
                { bg: '#ff5f57', glow: '239,68,68' },
                { bg: '#febc2e', glow: '245,158,11' },
                { bg: '#28c840', glow: '16,185,129' }
              ].map((dot, i) => (
                <span key={i} className="w-[9px] h-[9px] rounded-full cursor-pointer transition-all duration-200 hover:scale-110 relative block" style={{
                  background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.4) 0%, ${dot.bg} 45%)`,
                  boxShadow: `0 1px 3px rgba(0,0,0,0.5), 0 0 0 0.5px rgba(0,0,0,0.2)`
                }} />
              ))}
            </div>
            
            <div className="flex items-center gap-1 text-[9px] font-mono font-medium tracking-wide">
              <span className="cursor-pointer transition-colors duration-200" style={{ color: 'rgba(148,163,184,0.7)' }}>projects</span>
              <span style={{ color: 'rgba(100,116,139,0.25)', margin: '0 2px' }}>/</span>
              <div className="flex items-center gap-1 rounded-md px-1.5 py-0.5" style={{ background: 'rgba(61,90,128,0.15)', border: '1px solid rgba(61,90,128,0.28)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)' }}>
                <Film className="w-2.5 h-2.5 shrink-0" style={{ color: 'rgba(192,170,255,0.8)' }} />
                <span className="font-semibold tracking-tight" style={{ color: 'rgba(216,200,255,0.85)' }}>thundra_ai_intro.proj</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[7.5px] px-2 py-[3px] rounded-full font-mono font-bold tracking-wider flex items-center gap-1" style={{
                background: 'linear-gradient(135deg, rgba(212,165,116,0.12) 0%, rgba(212,165,116,0.06) 100%)',
                border: '1px solid rgba(212,165,116,0.2)',
                color: '#D4A574',
                boxShadow: '0 2px 6px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.05) inset'
              }}>
                <span className="w-[5px] h-[5px] rounded-full" style={{ background: '#D4A574', boxShadow: '0 0 4px rgba(212,165,116,0.9)' }} />
                1080P
              </span>
              <span className="text-[7.5px] px-2 py-[3px] rounded-full font-mono font-bold tracking-wider flex items-center gap-1" style={{
                background: 'linear-gradient(135deg, rgba(79,209,255,0.1) 0%, rgba(79,209,255,0.04) 100%)',
                border: '1px solid rgba(79,209,255,0.18)',
                color: '#4FD1FF',
                boxShadow: '0 2px 6px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.05) inset'
              }}>
                <span className="w-[5px] h-[5px] rounded-full" style={{ background: '#4FD1FF', boxShadow: '0 0 4px rgba(79,209,255,0.9)' }} />
                30FPS
              </span>
            </div>
          </div>

          <HUDRulerBar />

          <div className="flex gap-3">
            <div className="w-[120px] shrink-0 hidden sm:block rounded-xl p-2 space-y-1.5 relative z-10" style={{
              background: 'linear-gradient(160deg, rgba(20,30,50,0.95) 0%, rgba(14,22,38,0.9) 100%)',
              border: '1px solid rgba(255,255,255,0.07)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.3), 0 8px 20px rgba(0,0,0,0.35), 0 1px 0 rgba(255,255,255,0.06) inset'
            }}>
              <div className="absolute top-0 left-2 right-2 h-px rounded-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)' }} />
              <p className="text-[6.5px] font-bold tracking-[0.2em] uppercase relative z-10" style={{ color: 'rgba(148,163,184,0.85)', letterSpacing: '0.18em' }}>Media Bin</p>
              <div className="space-y-[5px] relative z-10">
                {[
                  { name: "raw_intro.mp4", size: "42MB", active: true, icon: Film, color: 'rgba(252,100,120,0.95)', borderColor: 'rgba(244,63,94,0.18)', bg: 'linear-gradient(135deg, rgba(244,63,94,0.09), rgba(244,63,94,0.04))' },
                  { name: "lofi_beat.wav", size: "4MB", active: true, icon: Music, color: 'rgba(79,209,255,0.95)', borderColor: 'rgba(79,209,255,0.18)', bg: 'linear-gradient(135deg, rgba(79,209,255,0.09), rgba(79,209,255,0.04))' },
                  { name: "broll_laser.mp4", size: "12MB", active: mockupState === 'preview', icon: Film, color: 'rgba(196,160,255,0.95)', borderColor: 'rgba(168,85,247,0.22)', bg: 'linear-gradient(135deg, rgba(168,85,247,0.1), rgba(168,85,247,0.04))' }
                ].map((file, i) => {
                  const FileIcon = file.icon;
                  return (
                    <div key={i} className="media-card p-1 px-1.5 rounded-lg flex flex-col gap-0.5 cursor-pointer" style={{
                      background: file.active ? file.bg : 'rgba(255,255,255,0.015)',
                      border: `1px solid ${file.active ? file.borderColor : 'rgba(255,255,255,0.035)'}`,
                      boxShadow: file.active ? '0 1px 3px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.04) inset' : '0 1px 2px rgba(0,0,0,0.15)'
                    }}>
                      <div className="flex items-center gap-1.5 min-w-0">
                        <FileIcon className="w-3 h-3 shrink-0" style={{ color: file.active ? file.color : 'rgba(100,116,139,0.35)' }} />
                        <span className="font-mono truncate block font-semibold text-[8px]" style={{ color: file.active ? 'rgba(238,246,255,0.96)' : 'rgba(148,163,184,0.6)' }}>{file.name}</span>
                      </div>
                      <div className="flex items-center justify-between font-mono text-[6.5px] leading-none">
                        <span style={{ color: 'rgba(148,163,184,0.68)' }}>{file.size}</span>
                        {file.active && (
                          <span className="flex items-center gap-0.5 rounded px-[5px] py-0.5 leading-none" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)' }}>
                            <span className="w-[4px] h-[4px] rounded-full animate-pulse" style={{ background: '#34d399', boxShadow: '0 0 4px rgba(52,211,153,0.9)' }} />
                            <span className="text-[5px] uppercase tracking-widest font-black" style={{ color: '#34d399' }}>READY</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex-1 min-w-0 relative z-10">
              <div className="relative aspect-[21/10] rounded-xl overflow-hidden flex items-center justify-center" style={{
                background: 'linear-gradient(145deg, #0a1120 0%, #06090f 100%)',
                border: '1px solid rgba(255,255,255,0.045)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04), inset 0 -1px 0 rgba(0,0,0,0.3)'
              }}>
                <div className="absolute top-0 left-0 w-16 h-8 pointer-events-none z-10" style={{ background: 'radial-gradient(ellipse at 5% 5%, rgba(79,209,255,0.04) 0%, transparent 75%)' }} />
                <div className="absolute top-0 right-0 w-12 h-6 pointer-events-none z-10" style={{ background: 'radial-gradient(ellipse at 90% 5%, rgba(255,255,255,0.02) 0%, transparent 75%)' }} />
                <div aria-hidden className="hero-monitor-glow z-[4]" />
                <div aria-hidden className="hero-monitor-reflection z-[6]" />
                <div className="absolute inset-0 pointer-events-none z-10" style={{ background: 'radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(0,0,0,0.6) 100%)' }} />
                <div className="absolute inset-0 pointer-events-none z-[5] opacity-[0.02]" style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.5) 0px, rgba(255,255,255,0.5) 1px, transparent 1px, transparent 3px)' }} />
                
                {mockupState === 'typing' && (
                  <div className="text-center z-20 flex flex-col items-center gap-2.5">
                    <div className="relative flex items-center justify-center">
                      <div className="absolute w-16 h-16 rounded-full animate-ping" style={{ background: 'transparent', border: '1px solid rgba(79,209,255,0.06)', animationDuration: '3s' }} />
                      <div className="absolute w-12 h-12 rounded-full animate-ping" style={{ background: 'transparent', border: '1px solid rgba(79,209,255,0.09)', animationDuration: '2.2s', animationDelay: '0.4s' }} />
                      <div className="relative w-9 h-9 rounded-full flex items-center justify-center" style={{
                        background: 'radial-gradient(circle at 35% 30%, rgba(100,180,255,0.15) 0%, rgba(61,90,128,0.1) 50%, rgba(0,0,0,0.2) 100%)',
                        border: '1px solid rgba(79,209,255,0.14)',
                        boxShadow: '0 0 0 3px rgba(79,209,255,0.03), 0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)'
                      }}>
                        <Sparkles className="w-3.5 h-3.5" style={{ color: 'rgba(79,209,255,0.55)' }} />
                      </div>
                    </div>
                    <p className="text-[8.5px] font-mono tracking-[0.14em]" style={{ color: 'rgba(148,163,184,0.8)', letterSpacing: '0.12em' }}>awaiting prompt</p>
                  </div>
                )}

                {mockupState === 'processing' && (
                  <div className="text-center z-20 w-[78%] flex flex-col items-center gap-2.5">
                    <div className="relative w-11 h-11">
                      <div className="absolute inset-0 rounded-full animate-spin" style={{ background: 'conic-gradient(from 0deg, rgba(79,209,255,0.9) 0%, rgba(61,90,128,0.25) 50%, rgba(79,209,255,0.9) 100%)', animationDuration: '1.8s', padding: '1.5px' }}>
                        <div className="w-full h-full rounded-full" style={{ background: '#06090f' }} />
                      </div>
                      <div className="absolute inset-[3px] rounded-full flex items-center justify-center" style={{
                        background: 'radial-gradient(circle at 40% 35%, rgba(79,209,255,0.12) 0%, rgba(0,0,0,0.4) 100%)',
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)'
                      }}>
                        <Sparkles className="w-3 h-3" style={{ color: 'rgba(79,209,255,0.8)' }} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between w-full text-[8.5px] font-mono" style={{ color: 'rgba(148,163,184,0.75)' }}>
                      <span className="flex items-center gap-1.5">
                        <span className="w-[5px] h-[5px] rounded-full animate-pulse" style={{ background: '#4FD1FF', boxShadow: '0 0 5px rgba(79,209,255,0.8)' }} />
                        AI Rendering...
                      </span>
                      <span className="font-bold tabular-nums" style={{ color: '#4FD1FF' }}>{processProgress}%</span>
                    </div>
                    <div className="w-full h-[3px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.4)' }}>
                      <div className="progress-fill-shimmer h-full rounded-full transition-all duration-100" style={{
                        width: `${processProgress}%`,
                        background: 'linear-gradient(90deg, rgba(61,90,128,0.9), rgba(79,209,255,1), rgba(168,85,247,0.9), rgba(79,209,255,1))',
                        backgroundSize: '200% 100%',
                        boxShadow: '0 0 8px rgba(79,209,255,0.55), 0 0 1px rgba(255,255,255,0.6)'
                      }} />
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
                    <div className="absolute bottom-3 left-3 right-3 z-20 text-center">
                      <span className="text-white px-3 py-1 rounded-lg text-[9px] font-black tracking-wide uppercase inline-block font-heading max-w-[90%] transition-all duration-300" style={{
                        background: 'linear-gradient(90deg, rgba(212,165,116,0.88), rgba(61,90,128,0.88), rgba(79,209,255,0.88))',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(8px)'
                      }}>
                        {getMockupCaption(mockupTime)}
                      </span>
                    </div>
                    <div className="absolute top-2 right-2 px-2 py-[3px] rounded-md text-[7.5px] font-mono font-bold z-20" style={{ background: 'rgba(5,8,15,0.8)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(203,213,225,0.8)', backdropFilter: 'blur(8px)' }}>
                      TCR: 00:{Math.floor(mockupTime).toString().padStart(2,'0')}:{Math.floor((mockupTime%1)*30).toString().padStart(2,'0')}
                    </div>
                    <div className="absolute top-2 left-2 px-2 py-[3px] rounded-md text-[7px] font-bold font-mono text-white tracking-wide z-20 flex items-center gap-1.5" style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.2), rgba(239,68,68,0.1))', border: '1px solid rgba(239,68,68,0.35)', backdropFilter: 'blur(8px)', boxShadow: '0 0 12px rgba(239,68,68,0.18), inset 0 1px 0 rgba(255,255,255,0.08)' }}>
                      <span className="relative flex h-[5px] w-[5px]">
                        <span className="animate-ping absolute inset-0 rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative rounded-full h-[5px] w-[5px] bg-red-500"></span>
                      </span>
                      <span className="uppercase text-red-300 font-extrabold">LIVE</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-1.5 pt-1 relative z-10" style={{ borderTop: '1px solid rgba(255,255,255,0.035)' }}>
            <div className="flex items-center justify-between pb-1" style={{ borderBottom: '1px solid rgba(255,255,255,0.025)' }}>
              <span className="text-[6.5px] font-bold tracking-[0.2em] uppercase" style={{ color: 'rgba(148,163,184,0.85)', letterSpacing: '0.2em' }}>Timeline</span>
              <div className="flex gap-3 text-[6.5px] font-mono" style={{ color: 'rgba(148,163,184,0.6)' }}>
                {['00:00','00:05','00:10','00:15','00:20'].map(t => <span key={t}>{t}</span>)}
              </div>
            </div>

            <div className="relative rounded-xl overflow-hidden" style={{
              background: 'linear-gradient(180deg, rgba(4,6,12,0.7) 0%, rgba(6,9,16,0.65) 100%)',
              border: '1px solid rgba(255,255,255,0.03)',
              boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.5), inset 0 1px 0 rgba(0,0,0,0.3)',
              padding: '5px 6px',
              display: 'flex',
              flexDirection: 'column',
              gap: '5px'
            }}>
              <div className="flex items-center gap-1.5">
                <div className="w-[14px] h-[14px] rounded-[4px] flex items-center justify-center shrink-0" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                  <Film className="w-2 h-2" style={{ color: 'rgba(100,116,139,0.5)' }} />
                </div>
                <div className="flex-1 h-[18px]" style={{ display: 'grid', gridTemplateColumns: 'repeat(20, minmax(0,1fr))', gap: '2px' }}>
                  {[
                    { span: 5, label: 'Intro A-Roll', isActive: mockupState==='preview'&&mockupTime<5, activeColor: 'rgba(79,209,255,0.95)', activeBg: 'linear-gradient(135deg,rgba(79,209,255,0.2),rgba(61,90,128,0.24))', activeBorder: 'rgba(79,209,255,0.35)', idleColor: 'rgba(79,209,255,0.45)', idleBg: 'linear-gradient(135deg,rgba(79,209,255,0.05),rgba(79,209,255,0.02))', idleBorder: 'rgba(79,209,255,0.12)' },
                    { span: 7, label: 'B-Roll Laser', isActive: mockupState==='preview'&&mockupTime>=5&&mockupTime<12, activeColor: 'rgba(251,191,36,0.95)', activeBg: 'linear-gradient(135deg,rgba(245,158,11,0.18),rgba(61,90,128,0.2))', activeBorder: 'rgba(245,158,11,0.32)', idleColor: 'rgba(245,158,11,0.45)', idleBg: 'linear-gradient(135deg,rgba(245,158,11,0.045),rgba(245,158,11,0.02))', idleBorder: 'rgba(245,158,11,0.12)' },
                    { span: 8, label: 'Outro A-Roll', isActive: mockupState==='preview'&&mockupTime>=12, activeColor: 'rgba(196,160,255,0.95)', activeBg: 'linear-gradient(135deg,rgba(168,85,247,0.18),rgba(61,90,128,0.22))', activeBorder: 'rgba(168,85,247,0.34)', idleColor: 'rgba(168,85,247,0.5)', idleBg: 'linear-gradient(135deg,rgba(168,85,247,0.05),rgba(168,85,247,0.02))', idleBorder: 'rgba(168,85,247,0.13)' }
                  ].map((clip,i) => (
                    <div key={i} className="timeline-clip rounded-[4px] text-[6.5px] font-mono font-semibold flex items-center justify-center truncate px-0.5" style={{
                      gridColumn: `span ${clip.span} / span ${clip.span}`,
                      background: clip.isActive ? clip.activeBg : clip.idleBg,
                      border: `1px solid ${clip.isActive ? clip.activeBorder : clip.idleBorder}`,
                      color: clip.isActive ? clip.activeColor : clip.idleColor,
                      boxShadow: clip.isActive
                        ? '0 1px 4px rgba(0,0,0,0.4), 0 0 10px rgba(79,209,255,0.1), 0 1px 0 rgba(255,255,255,0.06) inset'
                        : '0 1px 2px rgba(0,0,0,0.2)'
                    }}>{clip.label}</div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <div className="w-[14px] h-[14px] rounded-[4px] flex items-center justify-center shrink-0" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                  <MessageSquare className="w-2 h-2" style={{ color: 'rgba(100,116,139,0.5)' }} />
                </div>
                <div className="flex-1 h-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(20, minmax(0,1fr))', gap: '2px' }}>
                  {[
                    { span: 5, label: '"Edit..."', active: mockupState==='preview'&&mockupTime<5 },
                    { span: 6, label: '"Pak..."', active: mockupState==='preview'&&mockupTime>=5&&mockupTime<11 },
                    { span: 5, label: '"Auto..."', active: mockupState==='preview'&&mockupTime>=11&&mockupTime<16 },
                    { span: 4, label: '"Viral..."', active: mockupState==='preview'&&mockupTime>=16 }
                  ].map((b,i) => (
                    <div key={i} className="timeline-clip rounded-[3px] text-[6px] font-mono flex items-center justify-center truncate px-0.5" style={{
                      gridColumn: `span ${b.span} / span ${b.span}`,
                      background: b.active ? 'linear-gradient(135deg,rgba(212,165,116,0.14),rgba(212,165,116,0.06))' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${b.active ? 'rgba(212,165,116,0.22)' : 'rgba(255,255,255,0.035)'}`,
                      color: b.active ? 'rgba(212,165,116,0.85)' : 'rgba(100,116,139,0.35)',
                      boxShadow: b.active ? '0 1px 3px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)' : '0 1px 1px rgba(0,0,0,0.15)'
                    }}>{b.label}</div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <div className="w-[14px] h-[14px] rounded-[4px] flex items-center justify-center shrink-0" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                  <Music className="w-2 h-2" style={{ color: 'rgba(100,116,139,0.5)' }} />
                </div>
                <div className="flex-1 h-3 rounded-[3px] relative overflow-hidden flex items-center px-1" style={{ background: 'rgba(255,255,255,0.018)', border: '1px solid rgba(255,255,255,0.035)', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
                  <div className="flex items-center gap-[1px] w-full h-[6px]">
                    {Array.from({length:360}).map((_,i)=>{
                      const h = Math.sin(i*0.15)*2+3+Math.random()*1;
                      return <div key={i} className={`w-[1px] rounded-full ${mockupState==='preview' ? 'waveform-bar' : ''}`} style={{ height:`${h}px`, background: mockupState==='preview'?'rgba(52,211,153,0.55)':'rgba(100,116,139,0.2)', animationDelay: `${(i%24)*75}ms` }} />;
                    })}
                  </div>
                </div>
              </div>

              {mockupState === 'preview' && (
                <div className="absolute top-0 bottom-0 pointer-events-none z-30" style={{
                  left: `calc(22px + (100% - 28px) * ${mockupTime/20})`,
                  width: '1px',
                  background: 'linear-gradient(180deg, rgba(255,120,120,1) 0%, rgba(239,68,68,0.85) 30%, rgba(239,68,68,0.12) 100%)',
                  boxShadow: '0 0 6px rgba(239,68,68,0.55), 0 0 14px rgba(239,68,68,0.2)'
                }}>
                  <div style={{
                    position:'absolute', top:0, left:'-3.5px',
                    width:'8px', height:'8px',
                    background:'radial-gradient(circle at 40% 35%,#ffa3a3,#ef4444)',
                    borderRadius:'0 50% 50% 50%',
                    transform:'rotate(45deg)',
                    boxShadow:'0 1px 5px rgba(239,68,68,0.7), 0 0 10px rgba(239,68,68,0.35), inset 0 1px 0 rgba(255,255,255,0.25)'
                  }} />
                </div>
              )}
            </div>
          </div>

          <WaveformDivider />

          <div className="rounded-xl p-[7px] flex items-center justify-between gap-2 relative z-10 transition-all duration-300 group" style={{
            background: 'linear-gradient(180deg, rgba(26,38,60,0.98) 0%, rgba(17,26,44,0.97) 100%)',
            border: '1px solid rgba(79,209,255,0.28)',
            backdropFilter: 'blur(24px) saturate(140%)',
            boxShadow: [
              '0 2px 4px rgba(0,0,0,0.45)',
              '0 6px 20px rgba(0,0,0,0.5)',
              '0 12px 32px rgba(0,0,0,0.35)',
              '0 0 18px rgba(79,209,255,0.07)',
              'inset 0 1px 0 rgba(255,255,255,0.1)',
              'inset 0 -1px 0 rgba(0,0,0,0.25)'
            ].join(', ')
          }}>
            <div className="absolute top-0 left-8 right-8 h-px pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08) 30%, rgba(79,209,255,0.1) 50%, rgba(255,255,255,0.08) 70%, transparent)' }} />
            <div className="prompt-border-breathe absolute inset-0 rounded-xl pointer-events-none" style={{ borderRadius: 'inherit' }} />
            <div className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ boxShadow: '0 0 0 1px rgba(79,209,255,0.18), 0 0 18px rgba(79,209,255,0.08)', borderRadius: 'inherit' }} />
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 relative" style={{
                background: 'radial-gradient(circle at 35% 30%, rgba(130,190,255,0.4) 0%, rgba(70,110,170,0.7) 60%, rgba(38,62,110,0.85) 100%)',
                border: '1px solid rgba(79,209,255,0.35)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.55), 0 0 10px rgba(79,209,255,0.2), 0 1px 0 rgba(255,255,255,0.14) inset'
              }}>
                <Sparkles className="w-[11px] h-[11px]" style={{ color: '#CDEBFF', filter: 'drop-shadow(0 0 3px rgba(79,209,255,0.6))' }} />
              </div>
              <div className="text-[9.5px] md:text-[10px] min-w-0 truncate font-mono flex items-center gap-1">
                <span className="font-bold tracking-wide shrink-0" style={{ background: 'linear-gradient(90deg, rgba(255,251,244,1), rgba(122,222,255,1))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ai_prompt:</span>
                <span className="truncate" style={{ color: 'rgba(226,236,248,0.92)', fontWeight: 500 }}>
                  <span className="mr-0.5" style={{ color: 'rgba(212,165,116,0.7)', fontSize: '8px' }}>✦</span>
                  {typedText}
                </span>
                {mockupState === 'typing' && (
                  <span className="w-[2px] h-[11px] inline-block rounded-sm animate-pulse" style={{ background: 'rgba(79,209,255,0.8)', boxShadow: '0 0 5px rgba(79,209,255,0.5)', marginLeft: '1px', flexShrink: 0 }} />
                )}
              </div>
            </div>
            <button
              onClick={() => navigate('/editor')}
              className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-200 shrink-0 hover:scale-105 active:scale-95 ${mockupState !== 'typing' ? 'prompt-send-glow' : ''}`}
              style={{
                background: mockupState === 'typing'
                  ? 'rgba(255,255,255,0.04)'
                  : 'linear-gradient(135deg, rgba(61,90,128,0.9) 0%, rgba(79,209,255,0.85) 100%)',
                border: mockupState === 'typing' ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(79,209,255,0.2)',
                boxShadow: mockupState !== 'typing'
                  ? '0 1px 4px rgba(0,0,0,0.4), 0 2px 8px rgba(79,209,255,0.2), inset 0 1px 0 rgba(255,255,255,0.12)'
                  : '0 1px 2px rgba(0,0,0,0.2)'
              }}
            >
              <ArrowRight className="w-3 h-3" style={{ color: mockupState === 'typing' ? 'rgba(100,116,139,0.5)' : 'rgba(255,255,255,0.95)' }} />
            </button>
          </div>
        </div>
        <div aria-hidden className="hero-studio-ring" />
      </div>
    </div>
  );
});

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



  // ── Premium Neural Graph Background Canvas ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let t = 0;

    let currentScrollY = window.scrollY;
    let scrollTicking = false;
    const handleScroll = () => {
      if (!scrollTicking) {
        window.requestAnimationFrame(() => {
          currentScrollY = window.scrollY;
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    let resizeTimeout;
    const resize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (canvas) {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
        }
      }, 150);
    };
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
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

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const drawStatic = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DIST) {
            const alpha = (1 - dist / LINK_DIST) * 0.05;
            ctx.strokeStyle = `rgba(61, 90, 128, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }
      nodes.forEach(n => { n.draw(); });
    };

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (currentScrollY > window.innerHeight + 100) return;

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
    };

    if (prefersReducedMotion) {
      drawStatic();
    } else {
      animate();
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', resize);
      clearTimeout(resizeTimeout);
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-transparent text-slate-100 font-body flex flex-col justify-between select-none overflow-x-clip">

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
        {/* Hero-scoped radial depth lighting */}
        <div className="absolute inset-0 pointer-events-none z-0" style={{ background: 'radial-gradient(52% 62% at 26% 42%, rgba(79,209,255,0.045) 0%, transparent 68%), radial-gradient(46% 56% at 78% 52%, rgba(61,90,128,0.06) 0%, transparent 70%)' }} />

        {/* Left Side: Copywriting */}
        <div className="space-y-5 lg:space-y-6 text-left relative z-10 animate-[fadeIn_0.7s_ease-out]">
          <div className="hero-badge-wrap">
            <span aria-hidden className="hero-badge-shadow" />
            <div
              className="hero-badge-3d group inline-flex items-center gap-2 bg-gradient-to-r from-[#4FD1FF]/20 via-[#6FA8FF]/14 to-[#3D5A80]/18 border border-[#4FD1FF]/50 rounded-full px-4.5 py-1.5 text-[10px] md:text-[11px] font-bold tracking-wider uppercase select-none cursor-pointer"
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                const px = (e.clientX - r.left) / r.width - 0.5;
                const py = (e.clientY - r.top) / r.height - 0.5;
                e.currentTarget.style.setProperty('--rx', `${(-py * 16).toFixed(2)}deg`);
                e.currentTarget.style.setProperty('--ry', `${(px * 20).toFixed(2)}deg`);
                e.currentTarget.style.setProperty('--mx', `${((px + 0.5) * 100).toFixed(1)}%`);
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.setProperty('--rx', '0deg');
                e.currentTarget.style.setProperty('--ry', '0deg');
              }}
            >
              <span aria-hidden className="hero-badge-glass" />
              <span className="relative flex h-2 w-2" style={{ transform: 'translateZ(22px)' }}>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4FD1FF] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-gradient-to-br from-[#4FD1FF] to-[#3D5A80] shadow-[0_0_6px_rgba(79,209,255,0.8)]"></span>
              </span>
              <span className="bg-gradient-to-r from-[#4FD1FF] via-[#6FA8FF] to-[#3D5A80] bg-clip-text text-transparent font-black transition-all duration-300 group-hover:tracking-wider" style={{ transform: 'translateZ(28px)' }}>⚡ Pakistan's First AI Video Agent</span>
            </div>
          </div>

          <h1
            className="font-heading font-black leading-[1.05] text-white"
            style={{ fontSize: 'clamp(2rem, 5.5vw, 4rem)', letterSpacing: '-0.025em', textShadow: '0 4px 24px rgba(0, 0, 0, 0.95), 0 2px 4px rgba(0, 0, 0, 0.85)' }}
          >
            Edit Videos. <br />
            <span
              className="bg-gradient-to-r from-[#7ADEFF] via-[#F5EFE6] to-[#6FA8FF] bg-clip-text text-transparent animate-shimmer-edge"
              style={{ textShadow: 'none', WebkitTextFillColor: 'transparent' }}
            >
              Not Timelines.
            </span>
          </h1>

          <p className="text-[15px] md:text-base text-slate-300/90 max-w-[540px] font-body font-medium pt-1" style={{ lineHeight: 1.7 }}>
            Upload your footage, tell AI what you want, and get a professionally edited video with captions, music, B-roll, transitions, and color grading.
          </p>

          <div className="flex flex-wrap gap-4 pt-2 animate-[fadeIn_0.6s_ease-out]">
            <button
              onClick={() => navigate('/editor')}
              className="group relative h-[54px] px-7 rounded-2xl overflow-hidden border-2 border-[#3D6FA6] bg-slate-900 text-white text-[13px] font-bold uppercase tracking-[0.02em] flex items-center gap-2 transform transition-all duration-500 hover:scale-105 hover:border-[#6DD6FF] hover:text-[#BDE9FF] active:scale-[0.98] before:absolute before:w-10 before:h-10 before:content-[''] before:right-2 before:top-2 before:z-10 before:bg-[#4A6CF7] before:rounded-full before:blur-lg before:opacity-70 before:transition-all before:duration-500 after:absolute after:z-10 after:w-16 after:h-16 after:content-[''] after:bg-[#57C7FF] after:right-6 after:top-4 after:rounded-full after:blur-lg after:opacity-70 after:transition-all after:duration-500 hover:before:right-10 hover:before:-bottom-4 hover:before:blur hover:after:-right-6 hover:after:scale-110"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <span className="relative z-20">Start Editing</span>
              <ArrowRight className="relative z-20 w-4 h-4 group-hover:translate-x-1 transition-transform duration-500" />
            </button>
            <button
              onClick={() => navigate('/editor')}
              className="group relative h-[54px] px-7 rounded-2xl overflow-hidden border-2 border-white/15 bg-slate-900 text-white text-[13px] font-bold uppercase tracking-[0.02em] flex items-center gap-2 transform transition-all duration-500 hover:scale-105 hover:border-[#57C7FF]/60 hover:text-[#BDE9FF] active:scale-[0.98] before:absolute before:w-10 before:h-10 before:content-[''] before:right-2 before:top-2 before:z-10 before:bg-[#4A6CF7] before:rounded-full before:blur-lg before:opacity-0 before:transition-all before:duration-500 after:absolute after:z-10 after:w-16 after:h-16 after:content-[''] after:bg-[#57C7FF] after:right-6 after:top-4 after:rounded-full after:blur-lg after:opacity-0 after:transition-all after:duration-500 hover:before:right-10 hover:before:-bottom-4 hover:before:blur hover:before:opacity-70 hover:after:-right-6 hover:after:scale-110 hover:after:opacity-70"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <span className="relative z-20">Watch Demo</span>
            </button>
          </div>
        </div>

        {/* Right Side: Mockup Dashboard Preview */}
        <div className="relative flex items-center justify-center">
          {/* ── Depth ambient lighting system ── */}
          {/* Primary cool-blue ambient — top-left light source */}
          <div className="absolute pointer-events-none" style={{ width: '420px', height: '280px', top: '-60px', left: '-40px', background: 'radial-gradient(ellipse at 20% 20%, rgba(79,209,255,0.07) 0%, transparent 65%)', filter: 'blur(40px)' }} />
          {/* Secondary warm reflection — bottom-right */}
          <div className="absolute pointer-events-none" style={{ width: '300px', height: '200px', bottom: '-40px', right: '-20px', background: 'radial-gradient(ellipse at 80% 80%, rgba(212,165,116,0.05) 0%, transparent 60%)', filter: 'blur(30px)' }} />
          <HeroMockup navigate={navigate} />
        </div>
      </header>

      {/* SECTION 3: STACKED SCROLL FEATURE CARDS */}
      <StackedFeatureCards navigate={navigate} />

      {/* SECTION 4: BEFORE VS AFTER COMPARISON */}
      <section 
        ref={sectionRef}
        className="relative z-10 px-6 md:px-[6%] py-10 md:py-16 max-w-4xl mx-auto w-full text-center space-y-10 border-t border-purpleTheme/10"
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
                preload="metadata"
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
                preload="metadata"
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
        className="relative z-10 px-6 md:px-[6%] py-10 md:py-16 max-w-7xl mx-auto w-full text-center space-y-12 border-t border-purpleTheme/10"
        style={{ background: 'radial-gradient(circle at 50% 0%, rgba(79,209,255,0.06) 0%, transparent 60%)' }}
      >
        {/* Technical blueprint backdrop — extremely low opacity */}
        <div aria-hidden className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(79,209,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(79,209,255,0.05) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
          WebkitMaskImage: 'radial-gradient(60% 70% at 50% 55%, white, transparent)',
          maskImage: 'radial-gradient(60% 70% at 50% 55%, white, transparent)',
          opacity: 0.5
        }} />
        <div aria-hidden className="absolute inset-x-[10%] top-[58%] h-px pointer-events-none" style={{
          background: 'linear-gradient(90deg, transparent, rgba(79,209,255,0.1) 20%, rgba(79,209,255,0.1) 80%, transparent)',
          animation: 'sfc-breathe 9s ease-in-out infinite'
        }}>
          {/* Data packets travelling the execution rail */}
          {[0, 1].map(i => (
            <span key={i} className="absolute top-1/2 -translate-y-1/2 left-0 w-[3px] h-[3px] rounded-full bg-[#4FD1FF]" style={{ boxShadow: '0 0 6px #4FD1FF, 0 0 10px rgba(79,209,255,0.5)', opacity: 0, animation: `sfc-flow 7s linear ${i * 3.5}s infinite` }} />
          ))}
        </div>
        <div className="space-y-3 relative">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold text-[#4FD1FF] bg-[#4FD1FF]/10 border border-[#4FD1FF]/20 uppercase tracking-wider mb-2 font-mono">
            Under The Hood
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold font-heading text-white">The AI Processing Pipeline</h2>
          <p className="text-xs md:text-sm text-slate-400 max-w-md mx-auto leading-relaxed font-body">
            Our pipeline structures raw visual assets into H.264 formats through a sequence of intelligent steps.
          </p>
        </div>

        {/* Pipeline horizontal workflow chart */}
        <div className="grid grid-cols-2 sm:grid-cols-4 items-stretch justify-center gap-3 md:gap-4 w-full max-w-5xl mx-auto relative">
          {PIPELINE_STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <React.Fragment key={idx}>
                <div className="group relative w-full flex flex-col justify-between p-4 rounded-xl border border-white/[0.08] backdrop-blur-md hover:border-[#4FD1FF]/40 transition-all duration-500 ease-out transform hover:scale-[1.02] hover:-translate-y-0.5 text-center" style={{
                  background: 'linear-gradient(170deg, rgba(13,20,36,0.75) 0%, rgba(8,13,24,0.7) 100%)',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.35), 0 10px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.07), inset 0 -1px 0 rgba(0,0,0,0.3)'
                }}>
                  {/* Top specular hairline */}
                  <div className="absolute top-0 left-4 right-4 h-px pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1) 40%, rgba(79,209,255,0.12) 60%, transparent)' }} />
                  {/* Ambient inner glow */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-[#4FD1FF]/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  {/* Hover halo */}
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ boxShadow: '0 0 24px rgba(79,209,255,0.1), inset 0 0 0 1px rgba(79,209,255,0.08)' }} />

                  <div>
                    {/* Step number + execution status */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[9px] font-mono text-slate-500 font-bold px-1.5 py-0.5 rounded border border-white/[0.06]" style={{ background: 'rgba(255,255,255,0.03)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)' }}>
                        {step.id}
                      </span>
                      {/* Execution status indicator */}
                      <div className="w-1.5 h-1.5 rounded-full bg-[#4FD1FF]/70 shadow-[0_0_6px_rgba(79,209,255,0.6)] group-hover:bg-[#4FD1FF] group-hover:shadow-[0_0_10px_#4FD1FF] transition-all duration-500" style={{ animation: `sfc-breathe 3.6s ease-in-out ${idx * 0.6}s infinite` }} />
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

              </React.Fragment>
            );
          })}
        </div>
      </section>

      {/* SECTION 6: WHY THUNDRA AI - COMPARISON TABLE */}
      <section
        className="relative z-10 px-6 md:px-[6%] py-10 md:py-16 max-w-5xl mx-auto w-full text-center space-y-14 border-t border-purpleTheme/10"
        style={{ background: 'radial-gradient(circle at 50% 0%, rgba(79,209,255,0.05) 0%, transparent 60%)' }}
      >
        <div className="space-y-2">
          <span className="text-xs font-bold text-purpleLight uppercase tracking-widest">Efficiency Metrics</span>
          <h2 className="text-2xl md:text-4xl font-extrabold font-heading text-white">Thundra vs Traditional Editing</h2>
          <p className="text-xs md:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            See how Thundra AI compares against standard manual timeline software.
          </p>
        </div>

        {(() => {
          const rows = [
            { Icon: Clock,         label: 'Production Speed',    trad: 'Hours or days of manual cuts',            thun: 'Fully processed in ~60 seconds' },
            { Icon: MessageSquare, label: 'Captions & Subtitles', trad: 'Manual transcribing & syncing',           thun: 'Instant Urdu / English transcription' },
            { Icon: Film,          label: 'Stock Footage',       trad: 'Hours searching stock libraries',         thun: 'Contextual B-roll matched by AI' },
            { Icon: Settings,      label: 'Software Complexity', trad: 'Steep Premiere / DaVinci curve',          thun: 'Simple conversational workspace' },
            { Icon: Database,      label: 'Monthly Cost',        trad: '$150+ for software & stock',              thun: 'From $19 / month, all-in-one' },
          ];
          return (
            <div className="relative max-w-5xl mx-auto">
              {/* ── Premium split comparison ── */}
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 md:gap-0 items-stretch text-left relative">

                {/* ── Traditional side — clean, simple, muted ── */}
                <motion.div
                  initial={{ opacity: 0, x: -18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="relative rounded-2xl border border-white/[0.06] p-5 md:p-6 flex flex-col overflow-hidden"
                  style={{
                    background: 'linear-gradient(165deg, rgba(18,16,18,0.85) 0%, rgba(10,9,11,0.92) 100%)',
                    boxShadow: '0 3px 8px rgba(0,0,0,0.4), 0 18px 40px -12px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(16px)'
                  }}
                >
                  <div className="absolute top-0 left-6 right-6 h-px pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent, rgba(239,68,68,0.14), transparent)' }} />
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center border border-red-500/15" style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.08), rgba(20,16,18,0.6))', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)' }}>
                      <Layers className="w-4 h-4 text-red-400/60" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-200 tracking-tight font-heading">Traditional Editing</h3>
                      <span className="text-[9px] text-red-400/45 uppercase tracking-[0.14em] font-semibold">Manual · Fragmented</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 flex-1">
                    {rows.map((r, i) => (
                      <div key={i} className="group/tr flex items-start gap-2.5 min-h-[52px] px-2.5 py-2 rounded-xl border border-transparent transition-all duration-300 hover:border-red-500/[0.08] hover:bg-red-500/[0.015]">
                        <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-px border border-red-500/10 bg-red-500/[0.03]">
                          <X className="w-2.5 h-2.5 text-red-400/45 stroke-[2.5]" />
                        </div>
                        <div className="min-w-0">
                          <span className="block text-[10px] uppercase tracking-[0.1em] text-slate-500 font-semibold mb-0.5">{r.label}</span>
                          <span className="block text-[12px] text-slate-400 leading-snug">{r.trad}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* ── Center VS — premium animated ── */}
                <div className="relative flex md:flex-col items-center justify-center py-1 md:py-0 md:px-5 z-20">
                  <div className="hidden md:block absolute top-8 bottom-8 w-px" style={{ background: 'linear-gradient(180deg, transparent, rgba(79,209,255,0.16), transparent)' }} />
                  <div className="relative" style={{ animation: 'vs-float-inline 5s infinite ease-in-out' }}>
                    <div className="absolute -inset-2 rounded-full blur-[6px] opacity-20 bg-[#4FD1FF]" style={{ animation: 'vs-breathe 5s infinite ease-in-out' }} />
                    <div className="absolute -inset-1.5 rounded-full border border-[#4FD1FF]/20" style={{ animation: 'sfc-spin-slow 14s linear infinite' }}>
                      <span className="absolute -top-[3px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#4FD1FF]" style={{ boxShadow: '0 0 6px #4FD1FF' }} />
                    </div>
                    <div className="w-11 h-11 rounded-full flex items-center justify-center border border-[#4FD1FF]/30" style={{
                      background: 'linear-gradient(135deg, rgba(22,30,46,0.98) 0%, rgba(10,14,22,0.99) 100%)',
                      boxShadow: '0 6px 18px -4px rgba(0,0,0,0.65), 0 0 18px rgba(79,209,255,0.18), inset 0 1px 1px rgba(255,255,255,0.12), inset 0 -2px 4px rgba(0,0,0,0.5)',
                      backdropFilter: 'blur(8px)'
                    }}>
                      <span className="font-extrabold text-[11px] text-[#4FD1FF] tracking-[0.12em] pl-[1px]" style={{ fontFamily: 'Inter, sans-serif' }}>VS</span>
                    </div>
                  </div>
                </div>

                {/* ── Thundra AI side — intelligent, futuristic ── */}
                <motion.div
                  initial={{ opacity: 0, x: 18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
                  className="relative rounded-2xl border p-5 md:p-6 flex flex-col overflow-hidden group/thun"
                  style={{
                    background: 'linear-gradient(165deg, rgba(10,20,38,0.86) 0%, rgba(6,12,24,0.95) 100%)',
                    borderColor: 'rgba(79,209,255,0.28)',
                    boxShadow: '0 3px 8px rgba(0,0,0,0.45), 0 20px 46px -12px rgba(0,0,0,0.65), 0 0 38px rgba(79,209,255,0.07), inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.3)',
                    backdropFilter: 'blur(20px)'
                  }}
                >
                  {/* ambient corner light + top edge glow + glass sweep */}
                  <div aria-hidden className="absolute -top-16 right-0 w-56 h-32 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 70% 20%, rgba(79,209,255,0.1), transparent 68%)', filter: 'blur(20px)' }} />
                  <div className="absolute top-0 left-6 right-6 h-px pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent, rgba(79,209,255,0.3), transparent)' }} />
                  <div aria-hidden className="absolute pointer-events-none opacity-70" style={{ top: '-45%', left: 0, width: '22%', height: '190%', background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.03) 50%, transparent)', animation: 'monitor-sheen 15s ease-in-out infinite' }} />
                  <div className="relative z-10 flex items-center gap-2.5 mb-4">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center border border-[#4FD1FF]/20" style={{ background: 'linear-gradient(135deg, rgba(61,90,128,0.5), rgba(79,209,255,0.28))', boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.14), 0 0 12px rgba(79,209,255,0.12)' }}>
                      <Sparkles className="w-4 h-4 text-white/95" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white tracking-tight font-heading">Thundra AI</h3>
                      <span className="text-[9px] text-[#4FD1FF]/70 uppercase tracking-[0.14em] font-semibold">Autonomous · Unified</span>
                    </div>
                  </div>
                  <div className="relative z-10 flex flex-col gap-1.5 flex-1">
                    {rows.map((r, i) => (
                      <div key={i} className="group/tr flex items-start gap-2.5 min-h-[52px] px-2.5 py-2 rounded-xl border border-transparent transition-all duration-300 hover:border-[#4FD1FF]/20 hover:bg-[#4FD1FF]/[0.04] hover:shadow-[inset_0_0_0_1px_rgba(79,209,255,0.05),0_4px_14px_rgba(79,209,255,0.06)]">
                        <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-px border border-[#4FD1FF]/15 bg-[#4FD1FF]/[0.06] transition-all duration-300 group-hover/tr:bg-[#4FD1FF]/[0.12] group-hover/tr:shadow-[0_0_8px_rgba(79,209,255,0.25)]">
                          <r.Icon className="w-2.5 h-2.5 text-[#4FD1FF]" strokeWidth={2.4} />
                        </div>
                        <div className="min-w-0">
                          <span className="block text-[10px] uppercase tracking-[0.1em] text-[#4FD1FF]/60 font-semibold mb-0.5">{r.label}</span>
                          <span className="block text-[12px] text-white font-medium leading-snug">{r.thun}</span>
                        </div>
                        <Check className="w-3 h-3 text-[#4FD1FF]/50 shrink-0 ml-auto mt-1 opacity-0 -translate-x-1 transition-all duration-300 group-hover/tr:opacity-100 group-hover/tr:translate-x-0" strokeWidth={3} />
                      </div>
                    ))}
                  </div>
                </motion.div>

              </div>
            </div>
          );
        })()}
      </section>

      {/* SECTION 7: PRICING PLANS */}
      <section 
        id="pricing" 
        className="relative z-10 px-6 md:px-[6%] py-10 md:py-16 max-w-6xl mx-auto w-full text-center border-t border-white/[0.04] overflow-hidden"
        style={{
          background: '#040711',
          backgroundImage: `
            radial-gradient(ellipse 65% 55% at 50% 10%, rgba(13,22,41,0.5) 0%, transparent 60%),
            radial-gradient(ellipse 55% 45% at 50% 60%, rgba(79,209,255,0.02) 0%, transparent 50%),
            linear-gradient(rgba(255, 255, 255, 0.006) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.006) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 100% 100%, 48px 48px, 48px 48px',
          backgroundPosition: 'center top'
        }}
      >
        {/* Soft vignette and cinematic noise */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(4,7,17,0.7) 100%)'
        }} />

        {/* ── Section Header ── */}
        <div className="relative z-10 space-y-4 mb-10 md:mb-14">
          <span className="inline-flex items-center gap-1.5 text-[9px] font-semibold text-[#4FD1FF] uppercase tracking-[0.2em] px-2.5 py-1 rounded-full border border-white/[0.04] bg-white/[0.02]" style={{
            backdropFilter: 'blur(10px)',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
          }}>
            <Sparkles className="w-2.5 h-2.5 text-[#4FD1FF]" />
            Pricing
          </span>
          <h2 className="text-3xl md:text-[2.6rem] font-extrabold text-white tracking-[-0.03em] leading-[1.1]" style={{ fontFamily: 'Inter, sans-serif' }}>
            One Plan. Unlimited Power.
          </h2>
          <p className="text-xs md:text-sm text-slate-405 max-w-[580px] mx-auto leading-relaxed">
            Stop paying for 5 separate editing services. Get a complete professional AI production studio under a single premium subscription.
          </p>
        </div>

        <div
          className="relative max-w-[1000px] mx-auto"
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            e.currentTarget.style.setProperty('--ppx', ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
            e.currentTarget.style.setProperty('--ppy', ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
          }}
          onMouseLeave={(e) => { e.currentTarget.style.setProperty('--ppx', '0'); e.currentTarget.style.setProperty('--ppy', '0'); }}
        >
          {/* ── Premium showcase background ── */}
          {/* Animated grid, radially masked, subtle mouse parallax */}
          <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden rounded-[32px]" style={{ WebkitMaskImage: 'radial-gradient(72% 82% at 50% 45%, black, transparent)', maskImage: 'radial-gradient(72% 82% at 50% 45%, black, transparent)' }}>
            <div className="price-parallax-soft absolute inset-[-48px]" style={{ backgroundImage: 'linear-gradient(rgba(79,209,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(79,209,255,0.035) 1px, transparent 1px)', backgroundSize: '48px 48px', animation: 'price-grid-pan 26s linear infinite' }} />
          </div>
          {/* Soft radial spotlight behind the flagship plan */}
          <div aria-hidden className="price-parallax absolute left-[58%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] h-[440px] pointer-events-none" style={{ background: 'radial-gradient(ellipse 55% 55% at 50% 45%, rgba(79,209,255,0.08) 0%, rgba(61,90,128,0.045) 45%, transparent 72%)', filter: 'blur(34px)', animation: 'price-spot-pulse 8s ease-in-out infinite' }} />
          {/* Floating particles */}
          {[{ l: '13%', t: '20%', d: '0s' }, { l: '88%', t: '28%', d: '3s' }, { l: '22%', t: '80%', d: '6s' }, { l: '80%', t: '74%', d: '9s' }, { l: '50%', t: '10%', d: '4.5s' }].map((p, i) => (
            <div key={i} aria-hidden className="absolute w-[3px] h-[3px] rounded-full bg-[#4FD1FF] pointer-events-none" style={{ left: p.l, top: p.t, opacity: 0.2, boxShadow: '0 0 5px rgba(79,209,255,0.6)', animation: `sfc-float 13s cubic-bezier(0.45,0,0.55,1) ${p.d} infinite` }} />
          ))}
          {/* ── Pricing Cards Grid — asymmetric, flagship-dominant ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[0.82fr_1.18fr] gap-6 lg:gap-7 items-stretch relative z-10">
            
            {/* ── Left Card: Traditional Production ── */}
            <div 
              className="rounded-[18px] p-4 md:p-4.5 flex flex-col h-full transition-all duration-500 ease-out hover:-translate-y-1 border relative text-left group"
              style={{
                background: 'linear-gradient(165deg, rgba(17,17,21,0.9) 0%, rgba(9,9,12,0.96) 100%)',
                borderColor: 'rgba(255,255,255,0.08)',
                boxShadow: '0 2px 5px rgba(0,0,0,0.4), 0 10px 22px -8px rgba(0,0,0,0.5), 0 22px 48px -14px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.02), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.4)',
                backdropFilter: 'blur(20px)'
              }}
            >
              {/* Subtle top accent */}
              <div className="absolute top-0 left-6 right-6 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(239,68,68,0.08), transparent)' }} />

              <div className="space-y-3 flex-1">
                <div className="space-y-1">
                  <span className="inline-flex items-center text-[8px] font-semibold text-red-400/50 uppercase tracking-[0.1em] bg-red-500/[0.02] border border-red-500/10 px-2 py-0.5 rounded">
                    Individual Subscriptions
                  </span>
                  <h3 className="text-sm font-bold text-white/90 tracking-[-0.01em]" style={{ fontFamily: 'Inter, sans-serif' }}>Traditional Production</h3>
                  <p className="text-[9.5px] text-slate-500 leading-relaxed">What you pay separately for basic creator tools every month</p>
                </div>

                <div className="flex items-baseline gap-1.5 py-0.5">
                  <span className="text-2xl lg:text-3xl font-extrabold text-red-400/60 tracking-[-0.02em]" style={{ fontFamily: 'Inter, sans-serif' }}>$114</span>
                  <span className="text-[9.5px] text-slate-500 font-medium">/ month</span>
                  <span className="text-[8px] text-red-400/40 font-semibold ml-2 bg-red-500/[0.02] border border-red-500/[0.04] px-2 py-0.5 rounded-full tracking-wide">
                    ~ PKR 32,000/mo
                  </span>
                </div>

                <ul className="space-y-0.5 pt-2.5 border-t border-white/[0.03]">
                  {[
                    { icon: <Film className="w-3 h-3 text-slate-500 shrink-0" />, name: "Adobe Premiere Pro (Editing Suite)", price: "$24/mo" },
                    { icon: <Database className="w-3 h-3 text-slate-500 shrink-0" />, name: "Premium Stock Video Platform", price: "$30/mo" },
                    { icon: <MessageSquare className="w-3 h-3 text-slate-500 shrink-0" />, name: "AI Auto-Captioner Utility", price: "$15/mo" },
                    { icon: <Music className="w-3 h-3 text-slate-500 shrink-0" />, name: "AI Voice-Over & Audio Enhancer", price: "$20/mo" },
                    { icon: <Sparkles className="w-3 h-3 text-slate-500 shrink-0" />, name: "Cinematic LUTs & Preset Packs", price: "$25/mo" },
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center justify-between text-[10.5px] py-[5px] border-b border-white/[0.015] last:border-0 transition-colors duration-200 hover:bg-white/[0.015] rounded px-1 -mx-1 group/row">
                      <div className="flex items-center gap-2 min-w-0">
                        {item.icon}
                        <span className="truncate text-slate-400 font-medium">{item.name}</span>
                      </div>
                      <span className="font-mono text-red-400/40 font-semibold shrink-0 ml-3 text-[9.5px]">{item.price}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-1.5 pt-3 mt-3 border-t border-white/[0.03]">
                {[
                  "Multiple separate service renewals to keep track of",
                  "Constant tab switching, manual asset importing, and render lag",
                  "Steep software complexity and heavy learning curve"
                ].map((text, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-[9.5px] text-slate-550 font-medium">
                    <div className="w-3.5 h-3.5 rounded-full bg-red-500/[0.01] border border-red-500/[0.04] flex items-center justify-center shrink-0 mt-0.5">
                      <X className="w-1.5 h-1.5 text-red-400/30 stroke-[2]" />
                    </div>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right Card: Thundra AI (Flagship, floating) ── */}
            <div className="relative h-full price-float">
              {/* Rotating conic glow border */}
              <div aria-hidden className="price-hero-ring" />
              {/* Close flagship glow */}
              <div aria-hidden className="absolute -inset-3 rounded-[26px] pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 35%, rgba(79,209,255,0.06), transparent 68%)', filter: 'blur(8px)' }} />
            <div
              className="rounded-[18px] p-4 md:p-4.5 flex flex-col h-full transition-all duration-500 ease-out hover:-translate-y-1 border relative overflow-hidden group text-left z-10"
              style={{
                background: 'linear-gradient(165deg, rgba(11,21,40,0.86) 0%, rgba(5,11,23,0.96) 100%)',
                borderColor: 'rgba(79, 209, 255, 0.32)',
                boxShadow: '0 2px 5px rgba(0,0,0,0.45), 0 12px 26px -8px rgba(0,0,0,0.55), 0 24px 52px -14px rgba(0, 0, 0, 0.68), 0 0 40px 0px rgba(79, 209, 255, 0.08), inset 0 0 0 1px rgba(79,209,255,0.04), inset 0 1px 0 rgba(255, 255, 255, 0.15), inset 0 -1px 0 rgba(0,0,0,0.3)',
                backdropFilter: 'blur(20px)'
              }}
            >
              {/* Premium glass reflection overlay */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-700" />
              {/* Soft top edge glow */}
              <div className="absolute top-0 left-8 right-8 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(79,209,255,0.25), transparent)' }} />
              {/* Ambient radial behind card */}
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[300px] h-[200px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(79,209,255,0.02) 0%, transparent 70%)' }} />

              <div className="space-y-3 relative z-10 flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5.5 h-5.5 rounded-md flex items-center justify-center" style={{
                      background: 'linear-gradient(135deg, rgba(61,90,128,0.5) 0%, rgba(79,209,255,0.3) 100%)',
                      boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.1)'
                    }}>
                      <Sparkles className="w-3 h-3 text-white/90" />
                    </div>
                    <span className="font-extrabold text-sm text-white tracking-[-0.01em]" style={{ fontFamily: 'Inter, sans-serif' }}>Thundra AI</span>
                  </div>

                  <span className="inline-flex items-center text-[7.5px] font-semibold text-[#4FD1FF]/85 uppercase tracking-[0.1em] px-2 py-0.5 rounded border border-[#4FD1FF]/10" style={{
                    background: 'linear-gradient(135deg, rgba(79,209,255,0.04) 0%, rgba(61,90,128,0.02) 100%)'
                  }}>
                    ⚡ Unified Suite
                  </span>
                </div>

                <p className="text-[10px] text-slate-400 leading-relaxed">Everything you need for viral video production, combined under a single state-of-the-art AI workspace.</p>

                {/* ── Billing Toggle Cards ── */}
                <div className="grid grid-cols-2 gap-2.5">
                  {/* Monthly */}
                  <div 
                    onClick={() => setIsAnnual(false)}
                    className={`cursor-pointer rounded-xl p-2.5 border transition-all duration-300 text-left relative select-none hover:-translate-y-[1px] ${
                      !isAnnual 
                        ? 'border-[#4FD1FF]/35' 
                        : 'border-white/[0.04] hover:border-white/[0.08]'
                    }`}
                    style={{
                      background: !isAnnual 
                        ? 'linear-gradient(135deg, rgba(79, 209, 255, 0.08) 0%, rgba(20, 30, 50, 0.8) 100%)' 
                        : 'rgba(255, 255, 255, 0.015)',
                      boxShadow: !isAnnual 
                        ? '0 6px 18px -3px rgba(79, 209, 255, 0.15), inset 0 1px 1px 0px rgba(255, 255, 255, 0.08)' 
                        : '0 4px 12px -2px rgba(0, 0, 0, 0.3), inset 0 1px 1px 0px rgba(255, 255, 255, 0.02)'
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-extrabold text-white tracking-[-0.01em]" style={{ fontFamily: 'Inter, sans-serif' }}>
                        $19<span className="text-[9.5px] text-slate-500 font-normal tracking-normal">/mo</span>
                      </span>
                      <div className={`w-3 h-3 rounded-full flex items-center justify-center transition-all duration-200 ${
                        !isAnnual 
                          ? 'bg-gradient-to-br from-[#4FD1FF] to-[#3D5A80] shadow-[0_0_6px_rgba(79,209,255,0.3)] text-slate-950' 
                          : 'border border-white/20 bg-white/[0.01]'
                      }`}>
                        {!isAnnual && <Check className="w-2 h-2 stroke-[3] text-slate-950" />}
                      </div>
                    </div>
                    <span className="text-[7.5px] font-semibold text-slate-550 uppercase tracking-[0.1em]">Monthly</span>
                  </div>

                  {/* Annual */}
                  <div 
                    onClick={() => setIsAnnual(true)}
                    className={`cursor-pointer rounded-xl p-2.5 border transition-all duration-300 text-left relative select-none hover:-translate-y-[1px] ${
                      isAnnual 
                        ? 'border-[#4FD1FF]/35' 
                        : 'border-white/[0.04] hover:border-white/[0.08]'
                    }`}
                    style={{
                      background: isAnnual 
                        ? 'linear-gradient(135deg, rgba(79, 209, 255, 0.08) 0%, rgba(20, 30, 50, 0.8) 100%)' 
                        : 'rgba(255, 255, 255, 0.015)',
                      boxShadow: isAnnual 
                        ? '0 6px 18px -3px rgba(79, 209, 255, 0.15), inset 0 1px 1px 0px rgba(255, 255, 255, 0.08)' 
                        : '0 4px 12px -2px rgba(0, 0, 0, 0.3), inset 0 1px 1px 0px rgba(255, 255, 255, 0.02)'
                    }}
                  >
                    {/* Best Value badge */}
                    <span className="absolute -top-2 right-2 text-[6.5px] font-bold uppercase tracking-[0.1em] px-2 py-0.2 rounded-full border border-[#4FD1FF]/15" style={{
                      background: 'linear-gradient(135deg, rgba(79, 209, 255, 0.12) 0%, rgba(79, 209, 255, 0.04) 100%)',
                      color: '#4FD1FF',
                      backdropFilter: 'blur(4px)',
                      boxShadow: '0 1px 6px rgba(79,209,255,0.05)'
                    }}>
                      Best Value
                    </span>
                    
                    <div className="flex items-center justify-between mb-1 mt-0.5">
                      <div className="flex items-baseline gap-1">
                        <span className="text-[9.5px] text-slate-550 line-through font-mono font-medium">$228</span>
                        <span className="text-sm font-extrabold text-white tracking-[-0.01em]" style={{ fontFamily: 'Inter, sans-serif' }}>
                          $15<span className="text-[9.5px] text-slate-500 font-normal tracking-normal">/mo</span>
                        </span>
                      </div>
                      <div className={`w-3 h-3 rounded-full flex items-center justify-center transition-all duration-200 ${
                        isAnnual 
                          ? 'bg-gradient-to-br from-[#4FD1FF] to-[#3D5A80] shadow-[0_0_6px_rgba(79,209,255,0.3)] text-slate-950' 
                          : 'border border-white/20 bg-white/[0.01]'
                      }`}>
                        {isAnnual && <Check className="w-2 h-2 stroke-[3] text-slate-950" />}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[7.5px] font-semibold">
                      <span className="text-[#4FD1FF]/60 uppercase tracking-[0.08em]">Save 20%</span>
                      <span className="text-[#4FD1FF]/50 bg-[#4FD1FF]/[0.03] border border-[#4FD1FF]/10 px-1 rounded">+ Free Presets</span>
                    </div>
                  </div>
                </div>

                {/* Bonus banner */}
                <div className="flex items-center justify-center gap-1 py-1 px-2.5 rounded-lg border border-[#4FD1FF]/[0.05]" style={{
                  background: 'linear-gradient(135deg, rgba(79,209,255,0.02) 0%, rgba(0,0,0,0.15) 100%)'
                }}>
                  <span className="text-[10px]">🎁</span>
                  <span className="text-[8px] font-semibold text-[#4FD1FF]/55 uppercase tracking-[0.1em] text-center">
                    Ultimate Presets, LUTs, & Cinematic Sound Pack Included
                  </span>
                </div>

                {/* ── Feature List ── */}
                <ul className="space-y-0.5 pt-2.5 border-t border-white/[0.04]">
                  <li className="flex items-center justify-between text-[11px] text-slate-300 font-medium py-[5px] border-b border-white/[0.02] transition-colors duration-200 hover:bg-white/[0.01] rounded px-1 -mx-1">
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-full bg-[#4FD1FF]/[0.06] flex items-center justify-center shrink-0 border border-[#4FD1FF]/08">
                        <Check className="w-2.2 h-2.2 text-[#4FD1FF]/80 stroke-[2.5]" />
                      </div>
                      <span>All Premium AI Editing Models & Tools</span>
                    </div>
                    <div className="flex items-center -space-x-1 bg-white/[0.01] border border-white/[0.03] p-0.5 rounded select-none">
                      <div className="w-3.2 h-3.2 rounded-full bg-slate-900/80 flex items-center justify-center border border-white/[0.04]" title="AI Video Cutter">
                        <Film className="w-1.8 h-1.8 text-[#4FD1FF]/70" />
                      </div>
                      <div className="w-3.2 h-3.2 rounded-full bg-slate-900/80 flex items-center justify-center border border-white/[0.04]" title="Audio Beat Sync">
                        <Music className="w-1.8 h-1.8 text-[#4FD1FF]/70" />
                      </div>
                      <div className="w-3.2 h-3.2 rounded-full bg-slate-900/80 flex items-center justify-center border border-white/[0.04]" title="Urdu/English Captions">
                        <MessageSquare className="w-1.8 h-1.8 text-[#4FD1FF]/70" />
                      </div>
                      <div className="w-3.2 h-3.2 rounded-full bg-slate-900/80 flex items-center justify-center border border-white/[0.04]" title="AI Special Effects">
                        <Sparkles className="w-1.8 h-1.8 text-[#4FD1FF]/70" />
                      </div>
                    </div>
                  </li>

                  {[
                    "Side-by-side comparison & rendering validation",
                    "Unlimited video edits & 4K production exports",
                    "Instant contextual B-Roll matching & auto silence cuts",
                    "Urdu, Roman Urdu, & English auto captions generator",
                    "Add-on features: Voice-cloning & team workspace nodes"
                  ].map((feature, idx) => (
                    <li key={idx} className={`flex items-center gap-2 text-[11px] text-slate-300 font-medium py-[5px] ${idx < 4 ? 'border-b border-white/[0.02]' : ''} transition-colors duration-200 hover:bg-white/[0.01] rounded px-1 -mx-1`}>
                      <div className="w-3.5 h-3.5 rounded-full bg-[#4FD1FF]/[0.06] flex items-center justify-center shrink-0 border border-[#4FD1FF]/08">
                        <Check className="w-2.2 h-2.2 text-[#4FD1FF]/80 stroke-[2.5]" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* ── CTA Button ── */}
              <div className="pt-4 relative z-10">
                <button
                  onClick={() => navigate('/editor')}
                  className="group/btn relative w-full h-[54px] rounded-2xl overflow-hidden border-2 border-[#3D6FA6] bg-slate-900 text-white text-xs font-bold uppercase tracking-[0.02em] flex items-center justify-center gap-1.5 transform transition-all duration-500 hover:scale-[1.02] hover:border-[#6DD6FF] hover:text-[#BDE9FF] active:scale-[0.98] before:absolute before:w-10 before:h-10 before:content-[''] before:right-2 before:top-2 before:z-10 before:bg-[#4A6CF7] before:rounded-full before:blur-lg before:opacity-70 before:transition-all before:duration-500 after:absolute after:z-10 after:w-16 after:h-16 after:content-[''] after:bg-[#57C7FF] after:right-6 after:top-4 after:rounded-full after:blur-lg after:opacity-70 after:transition-all after:duration-500 hover:before:right-10 hover:before:-bottom-4 hover:before:blur hover:after:-right-6 hover:after:scale-110"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <span className="relative z-20">Get Started Now</span>
                  <ArrowRight className="relative z-20 w-3.5 h-3.5 transition-transform duration-500 group-hover/btn:translate-x-1" />
                </button>
              </div>

            </div>
            </div>

          </div>
        </div>
      </section>
      {/* SECTION 8: FAQ SECTION */}
      <section 
        className="relative z-10 px-6 md:px-[6%] py-10 md:py-16 max-w-3xl mx-auto w-full text-center space-y-10 border-t border-purpleTheme/10"
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
                className={`relative rounded-2xl border overflow-hidden transition-all duration-500 ease-out group/faq ${isOpen ? 'border-[#4FD1FF]/25' : 'border-white/[0.07] hover:border-white/[0.14]'}`}
                style={{
                  background: isOpen
                    ? 'linear-gradient(170deg, rgba(13,20,36,0.8) 0%, rgba(8,12,22,0.85) 100%)'
                    : 'linear-gradient(170deg, rgba(12,12,22,0.6) 0%, rgba(8,9,16,0.65) 100%)',
                  boxShadow: isOpen
                    ? '0 4px 12px rgba(0,0,0,0.35), 0 12px 30px rgba(0,0,0,0.3), 0 0 22px rgba(79,209,255,0.06), inset 0 1px 0 rgba(255,255,255,0.08)'
                    : '0 2px 6px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)'
                }}
              >
                {/* Hover lighting */}
                <div aria-hidden className="absolute inset-0 pointer-events-none opacity-0 group-hover/faq:opacity-100 transition-opacity duration-500" style={{ background: 'radial-gradient(60% 100% at 50% 0%, rgba(79,209,255,0.035), transparent 70%)' }} />
                <button
                  onClick={() => setActiveFaq(isOpen ? -1 : idx)}
                  className="relative w-full px-5 py-4 flex items-center justify-between gap-4 text-xs md:text-sm font-bold text-white hover:text-purpleLight transition-colors duration-400"
                >
                  <span>{faq.q}</span>
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center border shrink-0 transition-all duration-500 ease-out ${isOpen ? 'border-[#4FD1FF]/30 bg-[#4FD1FF]/[0.08]' : 'border-white/[0.08] bg-white/[0.03] group-hover/faq:border-white/[0.16]'}`} style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.07)' }}>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-500 ease-out ${isOpen ? 'rotate-180 text-[#4FD1FF]' : 'text-slate-500'}`} />
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
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


      {/* FOOTER */}
      <Footer />

    </div>
  );
}
