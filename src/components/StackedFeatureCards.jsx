import React, { useRef, useLayoutEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { Music, Sparkles, ArrowRight, Play, Pause, SkipForward, Check, Scissors, Volume2, Video, Film, Sliders, Languages, Send } from 'lucide-react';

// ─── CARD DATA ────────────────────────────────────────────────────────────────
const CARDS = [
  {
    id: 'silence', emoji: '✂️', badge: 'Smart Silence Detection',
    headline: 'ELIMINATE PAUSES.\nKEEP THE MOMENTUM.',
    desc: 'Automatically detect and remove filler words, hesitation, and dead air. Keep your audience engaged with seamless, high-retention pacing.',
    bullets: ['Millisecond-precision cut engine', 'Intelligent filler word filter', 'Non-destructive original tracks'],
    insights: ['36s Dead Air Cut', 'Pacing Score: 10/10', 'AI Accuracy: 99.9%'],
    bg: 'linear-gradient(160deg, #0A1526 0%, #081120 45%, #060D18 100%)',
    glow1: 'radial-gradient(ellipse 60% 50% at 78% 22%, rgba(79, 209, 255, 0.14) 0%, transparent 60%)',
    glow2: 'radial-gradient(ellipse 50% 45% at 15% 85%, rgba(61, 90, 128, 0.16) 0%, transparent 55%)',
    border: 'rgba(61, 90, 128, 0.35)',
    shadow: '0 8px 20px rgba(0,0,0,0.5), 0 30px 70px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.09), inset 0 -1px 0 rgba(0,0,0,0.4)',
    badge_c: '#F5EFE6',
    badge_bg: 'rgba(79, 209, 255, 0.08)',
    badge_b: 'rgba(79, 209, 255, 0.25)',
    accent: '#4FD1FF',
    accentSec: '#3D5A80',
    bullet_bg: 'rgba(79, 209, 255, 0.1)',
    mockup: 'silence',
    gridCols: '4.5fr 5.5fr',
  },
  {
    id: 'captions', emoji: '💬', badge: 'Bilingual Auto Captions',
    headline: 'DYNAMIC CAPTIONS.\nANY LANGUAGE.',
    desc: 'Generate perfectly synchronized bilingual subtitles in English, Urdu, or mixed Roman-Urdu. Styled for high visibility and social retention.',
    bullets: ['Bilingual Roman-Urdu & Nastaliq support', 'Trending video overlay designs', 'Sub-millisecond audio synchronization'],
    insights: ['Nastaliq & Roman-Urdu', '98% Speech Sync Rate', 'Latency: < 12ms'],
    bg: 'linear-gradient(150deg, #17111F 0%, #100C17 50%, #0B0812 100%)',
    glow1: 'radial-gradient(ellipse 55% 45% at 80% 15%, rgba(167, 139, 250, 0.18) 0%, transparent 60%)',
    glow2: 'radial-gradient(ellipse 50% 40% at 12% 88%, rgba(124, 58, 237, 0.12) 0%, transparent 55%)',
    border: 'rgba(167, 139, 250, 0.32)',
    shadow: '0 8px 20px rgba(0,0,0,0.5), 0 30px 70px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.09), inset 0 -1px 0 rgba(0,0,0,0.4)',
    badge_c: '#F5EFE6',
    badge_bg: 'rgba(167, 139, 250, 0.12)',
    badge_b: 'rgba(167, 139, 250, 0.34)',
    accent: '#A78BFA',
    accentSec: '#7C3AED',
    bullet_bg: 'rgba(167, 139, 250, 0.12)',
    mockup: 'captions',
    gridCols: '1fr 1fr',
  },
  {
    id: 'broll', emoji: '🎬', badge: 'Smart B-Roll Matching',
    headline: 'SEMANTIC MATCHING.\nAUTO-INSERTED FOOTAGE.',
    desc: 'Thundra scans your transcript to understand your content context, then automatically sources and overlays matching high-quality B-roll clips.',
    bullets: ['Contextual script understanding', '1.5M+ high-resolution stock clips', 'Smart transitions & overlay pacing'],
    insights: ['Smart B-Roll Added', 'Context Match: 96%', 'Stock Library: Active'],
    bg: 'linear-gradient(148deg, #050F1F 0%, #081A36 45%, #030A16 100%)',
    glow1: 'radial-gradient(ellipse 60% 55% at 75% 25%, rgba(30, 110, 200, 0.13) 0%, transparent 62%)',
    glow2: 'radial-gradient(ellipse 45% 40% at 18% 82%, rgba(37, 99, 235, 0.1) 0%, transparent 55%)',
    border: 'rgba(14, 165, 233, 0.3)',
    shadow: '0 8px 20px rgba(0,0,0,0.5), 0 30px 70px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.09), inset 0 -1px 0 rgba(0,0,0,0.4)',
    badge_c: '#F5EFE6',
    badge_bg: 'rgba(14, 165, 233, 0.08)',
    badge_b: 'rgba(14, 165, 233, 0.25)',
    accent: '#0EA5E9',
    accentSec: '#14B8A6',
    bullet_bg: 'rgba(14, 165, 233, 0.1)',
    mockup: 'broll',
    gridCols: '5.5fr 4.5fr',
  },
  {
    id: 'music', emoji: '🎵', badge: 'Sound Orchestration',
    headline: 'TEMPO-MATCHED.\nBEAT-SYNCED AUDIO.',
    desc: 'Perfect the mood with copyright-free soundtracks. AI detects cuts to trigger smooth transitions, building tension and release exactly where needed.',
    bullets: ['AI beat-sync and tempo locking', 'Automatic energy-curve matching', 'Pre-cleared commercial licenses'],
    insights: ['128 BPM Auto Tempo', 'Transition Alignment: 100%', 'Copyright Cleared'],
    bg: 'linear-gradient(150deg, #1C130B 0%, #140E08 50%, #0C0906 100%)',
    glow1: 'radial-gradient(ellipse 55% 50% at 76% 20%, rgba(212, 165, 116, 0.16) 0%, transparent 60%)',
    glow2: 'radial-gradient(ellipse 50% 45% at 20% 85%, rgba(180, 100, 50, 0.09) 0%, transparent 55%)',
    border: 'rgba(212, 165, 116, 0.3)',
    shadow: '0 8px 20px rgba(0,0,0,0.5), 0 30px 70px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.09), inset 0 -1px 0 rgba(0,0,0,0.4)',
    badge_c: '#F5EFE6',
    badge_bg: 'rgba(212, 165, 116, 0.08)',
    badge_b: 'rgba(212, 165, 116, 0.25)',
    accent: '#D4A574',
    accentSec: '#101826',
    bullet_bg: 'rgba(212, 165, 116, 0.1)',
    mockup: 'music',
    gridCols: '4.8fr 5.2fr',
  },
  {
    id: 'color', emoji: '🎨', badge: 'Hollywood Grade Color',
    headline: 'CINEMATIC LOOKS.\nONE-CLICK RE-GRADE.',
    desc: 'Transform flat raw log footage into rich cinematic masterworks. Access Hollywood LUT presets tailored for tech, mood, and lifestyle vlogs.',
    bullets: ['Log-to-Rec.709 color space correction', 'Industry-standard film stock presets', 'Customizable intensity sliders'],
    insights: ['Hollywood LUT Applied', '4K HDR Color Space', 'Render Time: < 0.5s'],
    bg: 'linear-gradient(150deg, #190B15 0%, #11070E 45%, #0A0509 100%)',
    glow1: 'radial-gradient(ellipse 65% 50% at 72% 30%, rgba(244, 63, 94, 0.13) 0%, transparent 62%)',
    glow2: 'radial-gradient(ellipse 45% 40% at 15% 80%, rgba(212, 165, 116, 0.11) 0%, transparent 55%)',
    border: 'rgba(244, 63, 94, 0.3)',
    shadow: '0 8px 20px rgba(0,0,0,0.5), 0 30px 70px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.09), inset 0 -1px 0 rgba(0,0,0,0.4)',
    badge_c: '#F5EFE6',
    badge_bg: 'rgba(244, 63, 94, 0.08)',
    badge_b: 'rgba(244, 63, 94, 0.25)',
    accent: '#F43F5E',
    accentSec: '#D4A574',
    bullet_bg: 'rgba(244, 63, 94, 0.1)',
    mockup: 'color',
    gridCols: '5.2fr 4.8fr',
  },
  {
    id: 'agent', emoji: '⚡', badge: 'AI Copilot Editor',
    headline: 'PROMPT TO FINISH.\nTIMELINE ORCHESTRATION.',
    desc: 'Collaborate with Thundra Agent using conversational commands. Request edits in English or Urdu and see timeline structures update dynamically.',
    bullets: ['Natural language timeline assembly', 'Dual-language Urdu/English command model', 'Multi-layer non-destructive exports'],
    insights: ['AI Agent Auto-Mode', 'Pipeline Speed: 120 FPS', 'Multilingual Core Engine'],
    bg: 'linear-gradient(155deg, #081A12 0%, #06130D 50%, #050C09 100%)',
    glow1: 'radial-gradient(ellipse 55% 50% at 78% 18%, rgba(16, 185, 129, 0.14) 0%, transparent 60%)',
    glow2: 'radial-gradient(ellipse 45% 45% at 15% 85%, rgba(79, 209, 255, 0.1) 0%, transparent 55%)',
    border: 'rgba(16, 185, 129, 0.3)',
    shadow: '0 8px 20px rgba(0,0,0,0.5), 0 30px 70px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.09), inset 0 -1px 0 rgba(0,0,0,0.4)',
    badge_c: '#F5EFE6',
    badge_bg: 'rgba(16, 185, 129, 0.08)',
    badge_b: 'rgba(16, 185, 129, 0.25)',
    accent: '#10B981',
    accentSec: '#4FD1FF',
    bullet_bg: 'rgba(16, 185, 129, 0.1)',
    mockup: 'agent',
    gridCols: '4.5fr 5.5fr',
  },
];

const N   = CARDS.length;
const T   = N - 1;
const NAV = 72;

// ─── SCROLL TIMING ────────────────────────────────────────────────────────────
const DWELL_VH    = 20;
const SLIDE_VH    = 50;
const SEGMENT_VH  = DWELL_VH + SLIDE_VH;
const FINAL_VH    = 50;
const TOTAL_SCROLL_VH = (N - 1) * SEGMENT_VH + FINAL_VH;
const CONTAINER_VH    = TOTAL_SCROLL_VH + 100;

// ─── MOCKUPS ──────────────────────────────────────────────────────────────────
function SilenceMockup({ a, sec }) {
  const nodes = [
    { n: 'Audio Detection', side: 'l', top: '15%' },
    { n: 'Silence Detection', side: 'l', top: '50%' },
    { n: 'Breath Removal', side: 'l', top: '85%' },
    { n: 'Filler Word Filter', side: 'r', top: '15%' },
    { n: 'Noise Cleanup', side: 'r', top: '50%' },
    { n: 'Caption Sync', side: 'r', top: '85%' }
  ];
  const stats = [
    { l: 'Silence Removed', v: '36s' }, { l: 'Processing', v: '99%' },
    { l: 'Latency', v: '18ms' }, { l: 'Engine', v: 'ACTIVE', dot: true }
  ];

  // Measured symmetric routing. Left paths run node → ring; right paths run
  // ring → node, so relay particles always travel in flow direction.
  const rootRef = React.useRef(null);
  const coreRef = React.useRef(null);
  const nodeRefs = React.useRef({});
  const [net, setNet] = React.useState({ left: [], right: [], w: 0, h: 0 });

  React.useLayoutEffect(() => {
    const measure = () => {
      const root = rootRef.current, core = coreRef.current;
      if (!root || !core) return;
      const rr = root.getBoundingClientRect();
      if (!rr.width) return;
      const cr = core.getBoundingClientRect();
      const cx = cr.left + cr.width / 2 - rr.left;
      const cy = cr.top + cr.height / 2 - rr.top;
      const R = cr.width / 2 + 2;
      const ringPt = (tx, ty) => {
        const dx = tx - cx, dy = ty - cy, len = Math.hypot(dx, dy) || 1;
        return [cx + (dx / len) * R, cy + (dy / len) * R];
      };
      // Single symmetric S-curve: both control points at the horizontal midpoint.
      const curve = (x1, y1, x2, y2) => {
        const mx = (x1 + x2) / 2;
        return `M ${x1.toFixed(1)} ${y1.toFixed(1)} C ${mx.toFixed(1)} ${y1.toFixed(1)} ${mx.toFixed(1)} ${y2.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
      };
      const left = [], right = [];
      nodes.forEach(node => {
        const el = nodeRefs.current[node.n];
        if (!el) return;
        const r = el.getBoundingClientRect();
        const nx = node.side === 'l' ? r.right - rr.left + 3 : r.left - rr.left - 3;
        const ny = r.top + r.height / 2 - rr.top;
        const [ex, ey] = ringPt(nx, ny);
        if (node.side === 'l') left.push(curve(nx, ny, ex, ey));
        else right.push(curve(ex, ey, nx, ny));
      });
      setNet({ left, right, w: rr.width, h: rr.height });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (rootRef.current) ro.observe(rootRef.current);
    return () => ro.disconnect();
  }, []);

  const allPaths = [...net.left, ...net.right];

  return (
    <div ref={rootRef} className="relative w-full rounded-2xl border border-white/[0.12] bg-black/55 backdrop-blur-xl p-4 flex flex-col gap-4 overflow-hidden text-left" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.45), 0 22px 54px rgba(0,0,0,0.55), 0 0 34px rgba(79,209,255,0.06), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.4)' }}>
      {/* Subtle panning grid */}
      <div className="absolute inset-[-40px] pointer-events-none" style={{ backgroundImage: `linear-gradient(${a}0A 1px, transparent 1px), linear-gradient(90deg, ${a}0A 1px, transparent 1px)`, backgroundSize: '26px 26px', WebkitMaskImage: 'radial-gradient(62% 70% at 50% 42%, white, transparent)', maskImage: 'radial-gradient(62% 70% at 50% 42%, white, transparent)', opacity: 0.35, animation: 'sfc-drift-xy 26s cubic-bezier(0.45,0,0.55,1) infinite' }} />
      {/* Top specular hairline */}
      <div aria-hidden className="absolute top-0 left-6 right-6 h-px pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.16) 30%, rgba(79,209,255,0.2) 50%, rgba(255,255,255,0.16) 70%, transparent)' }} />
      {/* Radial scan sweep */}
      <div aria-hidden className="absolute pointer-events-none" style={{ top: '-45%', left: 0, width: '30%', height: '190%', background: `linear-gradient(to right, transparent, ${a}10 45%, rgba(255,255,255,0.03) 55%, transparent)`, animation: 'monitor-sheen 7s ease-in-out infinite' }} />
      {/* Symmetric spoke connections */}
      {net.w > 0 && (
        <svg className="absolute inset-0 pointer-events-none" width="100%" height="100%" viewBox={`0 0 ${net.w} ${net.h}`}>
          {allPaths.map((d, i) => (
            <path key={i} d={d} fill="none" stroke={a} strokeWidth="1.4" strokeOpacity="0.4" strokeLinecap="round" strokeDasharray="3.5 5.5" style={{ animation: `sfc-dash ${3 + (i % 3) * 0.5}s linear infinite` }} />
          ))}
        </svg>
      )}
      {/* Relay particles: one per path — node → core, then core → opposite node */}
      {net.left.map((d, i) => (
        <div key={'ra' + i} aria-hidden className="absolute left-0 top-0 pointer-events-none" style={{ width: 4, height: 4, borderRadius: '50%', background: a, boxShadow: `0 0 6px ${a}, 0 0 10px ${a}50`, offsetPath: `path('${d}')`, offsetRotate: '0deg', opacity: 0, animation: `sfc-relay-a 5.2s cubic-bezier(0.45,0,0.55,1) ${i * 0.45}s infinite` }} />
      ))}
      {net.right.map((d, i) => (
        <div key={'rb' + i} aria-hidden className="absolute left-0 top-0 pointer-events-none" style={{ width: 4, height: 4, borderRadius: '50%', background: a, boxShadow: `0 0 6px ${a}, 0 0 10px ${a}50`, offsetPath: `path('${d}')`, offsetRotate: '0deg', opacity: 0, animation: `sfc-relay-b 5.2s cubic-bezier(0.45,0,0.55,1) ${i * 0.45}s infinite` }} />
      ))}
      {/* Processing stage */}
      <div className="relative z-10 h-[200px]">
        {/* Floating processing nodes — equal size, mirrored, center-aligned */}
        {nodes.map((node, i) => (
          <div key={node.n} ref={el => { nodeRefs.current[node.n] = el; }} className="absolute w-[104px] -translate-y-1/2 px-2 py-[4px] rounded-md border text-[7.5px] font-mono font-bold flex items-center gap-1" style={{
            [node.side === 'l' ? 'left' : 'right']: 0,
            top: node.top,
            justifyContent: node.side === 'l' ? 'flex-start' : 'flex-end',
            color: 'rgba(255,255,255,0.8)',
            background: `linear-gradient(180deg, ${a}10, rgba(255,255,255,0.02))`,
            borderColor: `${a}30`,
            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.08), 0 2px 6px rgba(0,0,0,0.35)`,
            animation: `sfc-chip 12s cubic-bezier(0.45,0,0.55,1) ${i * 2}s infinite`
          }}>
            {node.side === 'l' && <span className="w-[5px] h-[5px] rounded-full shrink-0" style={{ background: a, boxShadow: `0 0 4px ${a}` }} />}
            <span className="truncate">{node.n}</span>
            {node.side === 'r' && <span className="w-[5px] h-[5px] rounded-full shrink-0" style={{ background: a, boxShadow: `0 0 4px ${a}` }} />}
          </div>
        ))}
        {/* AI Core */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <div ref={coreRef} className="relative w-[110px] h-[110px] flex items-center justify-center">
            {/* Pulsing scan ring */}
            <div className="absolute inset-0 rounded-full border" style={{ borderColor: `${a}38`, animation: 'sfc-pulse 4.5s cubic-bezier(0.25,0.46,0.45,0.94) infinite' }} />
            {/* Breathing outer ring — soft, no heavy glow */}
            <div className="absolute inset-0 rounded-full border" style={{ borderColor: `${a}2E`, boxShadow: `0 0 10px ${a}10, inset 0 0 8px ${a}0A`, animation: 'sfc-breathe 6s cubic-bezier(0.45,0,0.55,1) infinite' }} />
            {/* Concentric guide circle */}
            <div className="absolute inset-[10px] rounded-full border" style={{ borderColor: 'rgba(255,255,255,0.05)' }} />
            {/* Thin segmented rotating ring */}
            <svg className="absolute inset-[7px]" viewBox="0 0 74 74" style={{ animation: 'sfc-spin-slow 10s linear infinite' }}>
              <circle cx="37" cy="37" r="32" fill="none" stroke={a} strokeWidth="1.6" strokeLinecap="round" strokeDasharray="14 12" strokeOpacity="0.5" />
            </svg>
            {/* Counter-rotating inner segments */}
            <svg className="absolute inset-[18px]" viewBox="0 0 58 58" style={{ animation: 'sfc-spin-slow 16s linear infinite reverse' }}>
              <circle cx="29" cy="29" r="24" fill="none" stroke={a} strokeWidth="1" strokeLinecap="round" strokeDasharray="6 14" strokeOpacity="0.32" />
            </svg>
            {/* Core orb */}
            <div className="relative w-[46px] h-[46px] rounded-full flex items-center justify-center" style={{ background: `radial-gradient(circle at 35% 30%, ${a}42 0%, rgba(5,14,26,0.92) 70%)`, border: `1px solid ${a}4A`, boxShadow: `0 0 12px ${a}20, inset 0 1px 0 rgba(255,255,255,0.14)`, animation: 'sfc3-core 4s cubic-bezier(0.45,0,0.55,1) infinite' }}>
              <Scissors size={16} style={{ color: '#DFF3FF', filter: `drop-shadow(0 0 4px ${a})` }} />
            </div>
          </div>
          <span className="block text-[6.5px] font-mono uppercase tracking-[0.2em] mt-3 leading-none" style={{ color: `${a}AA` }}>AI Cut Engine</span>
        </div>
      </div>
      {/* Processing status bar */}
      <div className="relative z-10 grid grid-cols-4 gap-1.5 pt-2.5 border-t border-white/[0.06]">
        {stats.map((st, i) => (
          <div key={st.l} className="flex flex-col items-center gap-[3px] px-1 py-2 rounded-lg border border-white/[0.07]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.012))', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 2px 5px rgba(0,0,0,0.3)' }}>
            <span className="text-[5.5px] font-mono text-white/45 uppercase tracking-[0.14em] text-center leading-none">{st.l}</span>
            <span className="flex items-center gap-1 text-[10px] font-mono font-black leading-none" style={{ color: a, animation: `sfc-vignette ${6 + i}s cubic-bezier(0.45,0,0.55,1) ${i * 1.2}s infinite` }}>
              {st.dot && <span className="w-1 h-1 rounded-full shrink-0" style={{ background: a, boxShadow: `0 0 5px ${a}`, animation: 'sfc-breathe 2.4s ease-in-out infinite' }} />}
              {st.v}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CaptionsMockup({ a, sec }) {
  const segs = [
    { t: '00:00', txt: 'AI edits videos in minutes.', on: true },
    { t: '00:03', txt: 'Automatic Caption Generation', on: false },
    { t: '00:07', txt: 'Perfect Speech Recognition', on: false }
  ];
  return (
    <div className="relative w-full rounded-2xl border border-white/[0.1] backdrop-blur-xl p-4 flex gap-4 shadow-2xl overflow-hidden text-left" style={{ background: 'linear-gradient(160deg, rgba(22,24,32,0.92) 0%, rgba(14,16,23,0.94) 100%)' }}>
      {/* Lavender key light */}
      <div className="absolute -top-8 right-0 w-52 h-28 pointer-events-none" style={{ background: `radial-gradient(ellipse, ${a}14, transparent 65%)`, filter: 'blur(18px)' }} />
      {/* LEFT — caption studio */}
      <div className="flex-1 flex flex-col justify-between gap-2 relative z-10 min-w-0">
        {/* Header + export status */}
        <div className="flex items-center justify-between">
          <span className="text-[7.5px] font-mono text-white/55 uppercase tracking-widest">Caption Studio</span>
          <span className="flex items-center gap-1 text-[6.5px] font-mono font-bold px-1.5 py-0.5 rounded border" style={{ color: '#6EE7B7', background: 'rgba(16,185,129,0.08)', borderColor: 'rgba(16,185,129,0.25)' }}>
            <Check size={6} strokeWidth={4} /> SYNCED
          </span>
        </div>
        {/* Caption presets */}
        <div className="flex gap-1">
          {[{ n: 'Keynote', on: true }, { n: 'Minimal', on: false }, { n: 'Bold', on: false }].map((p, i) => (
            <div key={i} className="flex-1 text-center py-1 rounded-md text-[7px] font-mono font-bold border transition-colors duration-200" style={p.on
              ? { background: `${a}1C`, borderColor: `${a}48`, color: '#fff', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.09)' }
              : { background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.45)' }}>{p.n}</div>
          ))}
        </div>
        {/* Animation + font presets */}
        <div className="flex gap-1">
          {[{ n: 'Fade Up', on: true }, { n: 'Pop', on: false }, { n: 'SF Pro', on: true }, { n: 'Serif', on: false }].map((f, i) => (
            <div key={i} className="flex-1 truncate text-center py-[3px] rounded text-[6.5px] font-mono border" style={f.on
              ? { background: 'rgba(255,255,255,0.055)', borderColor: 'rgba(255,255,255,0.15)', color: '#fff' }
              : { background: 'transparent', borderColor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }}>{f.n}</div>
          ))}
        </div>
        {/* Waveform + speaker detection */}
        <div className="flex flex-col gap-1 bg-black/40 border border-white/[0.07] rounded-lg p-2" style={{ boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.45)' }}>
          <div className="flex justify-between text-[6.5px] font-mono text-white/45 uppercase tracking-wider">
            <span>Waveform · Speakers</span>
            <span className="font-bold" style={{ color: a }}>00:04.2</span>
          </div>
          <div className="flex items-end gap-[1.5px] h-4">
            {Array.from({ length: 36 }).map((_, i) => {
              const h = Math.abs(Math.sin(i * 0.55)) * 11 + 2;
              const s1 = i < 18;
              return <div key={i} className="flex-1 rounded-full" style={{ height: h, background: s1 ? `${a}B3` : 'rgba(255,255,255,0.35)', transformOrigin: 'bottom', animation: `sfc-eq 1.7s ease-in-out ${(i % 12) * 0.14}s infinite` }} />;
            })}
          </div>
          <div className="flex gap-2">
            <span className="flex items-center gap-1 text-[6px] font-mono" style={{ color: a }}><span className="w-1 h-1 rounded-full" style={{ background: a }} />Speaker 1</span>
            <span className="flex items-center gap-1 text-[6px] font-mono text-white/55"><span className="w-1 h-1 rounded-full bg-white/50" />Speaker 2</span>
          </div>
        </div>
        {/* Live caption timeline */}
        <div className="flex flex-col gap-[3px]">
          {segs.map((s, i) => (
            <div key={i} className="flex items-center gap-1.5 px-1.5 py-[3px] rounded-md border transition-colors duration-200" style={s.on
              ? { background: `${a}14`, borderColor: `${a}40`, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)' }
              : { background: 'rgba(255,255,255,0.015)', borderColor: 'rgba(255,255,255,0.05)' }}>
              <span className="text-[6px] font-mono shrink-0" style={{ color: s.on ? a : 'rgba(255,255,255,0.35)' }}>{s.t}</span>
              <span className="text-[7px] font-mono truncate" style={{ color: s.on ? '#fff' : 'rgba(255,255,255,0.5)' }}>{s.txt}</span>
            </div>
          ))}
        </div>
        {/* Confidence graph */}
        <div className="flex items-center gap-2">
          <span className="text-[6.5px] font-mono text-white/45 uppercase tracking-wider shrink-0">Confidence</span>
          <div className="flex-1 h-[3px] rounded-full bg-white/[0.07] overflow-hidden">
            <div className="h-full rounded-full" style={{ width: '99%', background: `linear-gradient(90deg, ${sec}, ${a})`, boxShadow: `0 0 4px ${a}60` }} />
          </div>
          <span className="text-[7.5px] font-mono font-black shrink-0" style={{ color: a }}>99.2%</span>
        </div>
        {/* Language selector + Export */}
        <div className="flex gap-1.5">
          <div className="flex-1 flex items-center justify-between px-2 py-1 rounded-md border border-white/[0.09] bg-white/[0.03] text-[7px] font-mono text-white/75 min-w-0">
            <span className="flex items-center gap-1 truncate"><Languages size={7} className="shrink-0" /> English (US)</span>
            <span className="text-white/35 shrink-0">▾</span>
          </div>
          <button className="flex items-center gap-1 px-2 py-1 rounded-md text-[7px] font-mono font-black border transition-transform duration-200 hover:scale-[1.03] active:scale-[0.97] shrink-0" style={{ color: '#14161F', background: `linear-gradient(135deg, #FFFFFF 0%, ${a} 100%)`, borderColor: `${a}70`, boxShadow: `0 3px 10px rgba(0,0,0,0.4), 0 0 12px ${a}20, inset 0 1px 0 rgba(255,255,255,0.4)` }}>
            <Send size={7} /> Export SRT
          </button>
        </div>
      </div>
      {/* Ambient glow pulse around the preview device */}
      <div className="absolute right-3 top-3 bottom-3 w-[43%] pointer-events-none rounded-xl" style={{ background: `radial-gradient(60% 55% at 50% 45%, ${a}14, transparent 72%)`, filter: 'blur(22px)', animation: 'sfc-breathe 8s ease-in-out infinite' }} />
      {/* RIGHT — modern phone preview */}
      <div className="w-[42%] aspect-[9/16] rounded-xl relative overflow-hidden flex flex-col justify-end p-3 shrink-0" style={{ background: 'linear-gradient(170deg, #1B1E28 0%, #13151D 55%, #0C0E14 100%)', border: '1px solid rgba(255,255,255,0.12)', boxShadow: `0 10px 26px rgba(0,0,0,0.55), 0 0 22px ${a}10, inset 0 1px 0 rgba(255,255,255,0.09)` }}>
        {/* Notch */}
        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-8 h-[3px] rounded-full bg-black/70 border border-white/[0.06] z-10" />
        {/* Screen glow — breathing */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(70% 55% at 50% 38%, ${a}0D 0%, transparent 65%)`, animation: 'sfc-breathe 7s ease-in-out infinite' }} />
        {/* Moving screen light reflection */}
        <div className="absolute pointer-events-none" style={{ top: '-45%', left: 0, width: '34%', height: '190%', background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.05) 50%, transparent)', animation: 'monitor-sheen 11s ease-in-out infinite' }} />
        {/* Status bar */}
        <div className="absolute top-4 left-2 right-2 flex justify-between items-center z-10">
          <div className="px-1.5 py-0.5 rounded bg-black/50 border border-white/[0.08] text-[6px] font-mono text-white/70 flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping" /> LIVE
          </div>
          <span className="text-[6px] font-mono text-white/40">4K · 60</span>
        </div>
        {/* Apple-keynote captions */}
        <div className="relative z-10 flex flex-col items-center gap-1.5 mb-2">
          <div className="relative overflow-hidden px-2.5 py-1.5 rounded-lg text-center max-w-full" style={{ background: 'rgba(10,11,16,0.72)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 6px 18px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)' }}>
            {/* Caption highlight shimmer */}
            <span aria-hidden className="absolute pointer-events-none" style={{ top: '-60%', left: 0, width: '30%', height: '220%', background: `linear-gradient(to right, transparent, ${a}30 50%, transparent)`, animation: 'monitor-sheen 6.5s ease-in-out infinite' }} />
            <span className="relative text-[9.5px] font-semibold text-white tracking-wide" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>AI edits videos in minutes.</span>
          </div>
          <div className="px-2 py-0.5 rounded-md" style={{ background: `${a}1F`, border: `1px solid ${a}40` }}>
            <span className="text-[6.5px] font-mono font-bold tracking-wider uppercase" style={{ color: '#EAE5FF' }}>Automatic Caption Generation</span>
          </div>
        </div>
        {/* Progress + footer */}
        <div className="relative z-10 flex flex-col gap-1.5 border-t border-white/[0.07] pt-1.5">
          <div className="w-full h-[2.5px] rounded-full bg-white/[0.08] overflow-hidden">
            <div className="h-full w-[38%] rounded-full" style={{ background: `linear-gradient(90deg, #FFFFFF, ${a})` }} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[6.5px] font-mono text-white/55">@thundra_ai</span>
            <span className="text-[6px] font-mono" style={{ color: a }}>Perfect Speech Recognition</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function BRollMockup({ a, sec }) {
  const clips = [
    { n: 'Office', e: '🏢', pct: 91, dur: '0:05', t: '18,32,58' },
    { n: 'Startup', e: '🚀', pct: 88, dur: '0:04', t: '14,28,52' },
    { n: 'Meeting', e: '🤝', pct: 93, dur: '0:06', t: '20,30,52' },
    { n: 'Podcast', e: '🎙️', pct: 90, dur: '0:07', t: '14,24,44' },
    { n: 'Laptop', e: '💻', pct: 94, dur: '0:03', t: '12,30,54' },
    { n: 'Camera', e: '🎥', pct: 89, dur: '0:05', t: '16,26,46' },
    { n: 'Coffee', e: '☕', pct: 86, dur: '0:02', t: '22,30,48' }
  ];
  const meta = [
    { n: 'Workspace', l: '4%', d: '0s' }, { n: 'Startup', l: '21%', d: '1.6s' },
    { n: 'Coding', l: '38%', d: '3.2s' }, { n: 'Meeting', l: '54%', d: '4.8s' },
    { n: 'Podcast', l: '70%', d: '6.4s' }, { n: 'Office', l: '86%', d: '8s' }
  ];
  return (
    <div className="relative w-full rounded-2xl border border-white/[0.12] backdrop-blur-xl p-4 flex flex-col gap-2.5 overflow-hidden text-left" style={{
      background: 'linear-gradient(160deg, #081527 0%, #060F1E 55%, #040A14 100%)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.45), 0 22px 54px rgba(0,0,0,0.55), 0 0 44px rgba(14,165,233,0.05), inset 0 0 0 1px rgba(255,255,255,0.025), inset 0 1px 0 rgba(255,255,255,0.09), inset 0 -1px 0 rgba(0,0,0,0.4)'
    }}>
      {/* Static glass reflection — clean top sheen */}
      <div aria-hidden className="absolute inset-[1px] rounded-2xl pointer-events-none" style={{ background: 'linear-gradient(175deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.008) 26%, transparent 48%)' }} />
      {/* Cinematic film-strip accents — very low opacity */}
      {[{ top: '30%', rot: -5 }, { top: '64%', rot: -5 }].map((st, i) => (
        <div key={i} aria-hidden className="absolute left-[-12%] w-[124%] pointer-events-none" style={{ top: st.top, transform: `rotate(${st.rot}deg)`, opacity: 0.07 }}>
          <div style={{ height: 5, backgroundColor: 'rgba(140,180,215,0.5)', backgroundImage: 'repeating-linear-gradient(90deg, transparent 0px, transparent 4px, rgba(4,9,17,0.9) 4px, rgba(4,9,17,0.9) 14px)' }} />
          <div style={{ height: 26, backgroundImage: `repeating-linear-gradient(90deg, ${a}55 0px, ${a}55 2px, ${a}12 2px, ${a}12 46px)` }} />
          <div style={{ height: 5, backgroundColor: 'rgba(140,180,215,0.5)', backgroundImage: 'repeating-linear-gradient(90deg, transparent 0px, transparent 4px, rgba(4,9,17,0.9) 4px, rgba(4,9,17,0.9) 14px)' }} />
        </div>
      ))}
      {/* Soft light streak */}
      <div aria-hidden className="absolute top-[46%] left-[4%] w-[55%] h-[2px] pointer-events-none" style={{ background: `linear-gradient(90deg, transparent, ${a}35, transparent)`, filter: 'blur(3px)', animation: 'sfc-streak 14s cubic-bezier(0.45,0,0.55,1) infinite' }} />
      {/* Top specular hairline */}
      <div aria-hidden className="absolute top-0 left-6 right-6 h-px pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.16) 30%, rgba(14,165,233,0.2) 50%, rgba(255,255,255,0.16) 70%, transparent)' }} />
      {/* Floating particles */}
      {[{ l: '12%', t: '20%', d: '0s' }, { l: '58%', t: '14%', d: '4s' }, { l: '84%', t: '30%', d: '8s' }].map((p, i) => (
        <div key={i} aria-hidden className="absolute w-[2px] h-[2px] rounded-full pointer-events-none" style={{ left: p.l, top: p.t, background: 'rgba(200,230,255,0.9)', opacity: 0.16, boxShadow: `0 0 4px ${a}60`, animation: `sfc-float 13s cubic-bezier(0.45,0,0.55,1) ${p.d} infinite` }} />
      ))}
      {/* Header: title + AI confidence meter */}
      <div className="relative z-10 flex items-center justify-between">
        <span className="text-[6.5px] font-mono text-white/45 uppercase tracking-[0.18em]">AI Match Pipeline</span>
        <div className="flex items-center gap-1.5 px-1.5 py-[3px] rounded-md border" style={{ borderColor: `${a}3A`, background: `linear-gradient(180deg, ${a}12, rgba(255,255,255,0.02))`, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 2px 6px rgba(0,0,0,0.35)' }}>
          <svg width="10" height="10" viewBox="0 0 12 12" className="-rotate-90">
            <circle cx="6" cy="6" r="5" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.6" />
            <circle cx="6" cy="6" r="5" fill="none" stroke={a} strokeWidth="1.6" strokeLinecap="round" strokeDasharray="30.2 31.4" style={{ animation: 'sfc-breathe 5s cubic-bezier(0.45,0,0.55,1) infinite' }} />
          </svg>
          <span className="text-[6px] font-mono font-black leading-none" style={{ color: a }}>AI 96%</span>
        </div>
      </div>
      {/* Floating metadata chips */}
      <div className="relative z-10 h-[22px]">
        {meta.map(m => (
          <span key={m.n + m.l} className="absolute top-0 px-1.5 py-[2px] rounded-full border text-[5.5px] font-mono font-bold" style={{ left: m.l, color: 'rgba(255,255,255,0.78)', background: `${a}10`, borderColor: `${a}33`, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.09), 0 2px 5px rgba(0,0,0,0.3)', animation: `sfc-float-soft ${9 + (parseFloat(m.d) % 3) * 2}s cubic-bezier(0.45,0,0.55,1) ${m.d} infinite` }}>{m.n}</span>
        ))}
      </div>
      {/* Pipeline lane — clips flow left → right through scan gates */}
      <div className="relative z-10 overflow-hidden rounded-[10px] border border-white/[0.09]" style={{ background: 'linear-gradient(180deg, rgba(7,14,26,0.92), rgba(4,9,17,0.9))', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.025), inset 0 1px 0 rgba(255,255,255,0.07), inset 0 2px 8px rgba(0,0,0,0.4), 0 6px 16px rgba(0,0,0,0.35), 0 0 22px rgba(14,165,233,0.05)' }}>
        <div className="flex gap-2 p-2 w-max" style={{ animation: 'sfc-strip-conv 42s linear infinite' }}>
          {[...clips, ...clips].map((cl, k) => (
            <div key={k} className="relative w-16 rounded-[7px] border p-1 flex flex-col gap-[3px] shrink-0" style={{
              background: 'linear-gradient(180deg, rgba(13,24,42,0.94), rgba(7,14,26,0.92))',
              borderColor: 'rgba(255,255,255,0.11)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.09), inset 0 -1px 0 rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.35), 0 4px 10px rgba(0,0,0,0.4)',
              animation: `sfc-chip 14s cubic-bezier(0.45,0,0.55,1) ${(k % 7) * 2}s infinite`
            }}>
              <div className="relative h-[26px] rounded-[4px] overflow-hidden flex items-center justify-center" style={{ background: `linear-gradient(150deg, rgba(${cl.t},0.95) 0%, rgba(6,12,22,0.96) 100%)`, border: '1px solid rgba(255,255,255,0.07)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -4px 6px rgba(0,0,0,0.45)' }}>
                <span className="text-[9px] leading-none select-none" style={{ filter: 'saturate(0.7) brightness(0.95)' }}>{cl.e}</span>
                <span aria-hidden className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.06), transparent 40%, rgba(0,0,0,0.3))' }} />
                <span className="absolute bottom-[1px] right-[2px] text-[4px] font-mono text-white/60 leading-none" style={{ animation: `sfc-vignette ${8 + (k % 3)}s cubic-bezier(0.45,0,0.55,1) ${(k % 5) * 0.8}s infinite` }}>{cl.dur}</span>
              </div>
              <div className="flex items-center justify-between leading-none px-[1px]">
                <span className="text-[4.5px] font-mono text-white/60 uppercase truncate">{cl.n}</span>
                <span className="text-[4.5px] font-mono font-black shrink-0" style={{ color: `${a}CC`, animation: `sfc-vignette ${7 + (k % 4)}s cubic-bezier(0.45,0,0.55,1) ${(k % 6) * 0.7}s infinite` }}>{cl.pct}%</span>
              </div>
            </div>
          ))}
        </div>
        {/* AI scan-pulse gates over the lane */}
        {['26%', '52%', '78%'].map((l, i) => (
          <div key={i} aria-hidden className="absolute inset-y-1 pointer-events-none" style={{ left: l, width: 2, background: `linear-gradient(180deg, transparent, ${a}66, transparent)`, filter: 'blur(0.8px)', boxShadow: `0 0 7px ${a}35`, animation: `sfc-breathe ${2.6 + i * 0.5}s cubic-bezier(0.45,0,0.55,1) ${i * 0.9}s infinite` }} />
        ))}
      </div>
      {/* Bottom: semantic analysis bar + Selected Best Match */}
      <div className="relative z-10 flex items-end gap-3">
        <div className="flex-1 flex flex-col gap-1 pb-0.5">
          <div className="flex items-center justify-between">
            <span className="text-[5.5px] font-mono text-white/45 uppercase tracking-[0.16em]">Semantic Analysis</span>
            <span className="text-[5.5px] font-mono font-black" style={{ color: a, animation: 'sfc-vignette 7s cubic-bezier(0.45,0,0.55,1) infinite' }}>Matching…</span>
          </div>
          <div className="h-[5px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.055)', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(255,255,255,0.02)' }}>
            <div className="h-full rounded-full" style={{ width: '96%', transformOrigin: 'left', background: `linear-gradient(90deg, ${sec || a}, ${a})`, backgroundSize: '200% 100%', boxShadow: `0 0 5px ${a}45`, animation: 'sfc-bar-smooth 10s cubic-bezier(0.45,0,0.55,1) infinite, progress-shimmer 2.4s linear infinite' }} />
          </div>
          <div className="flex items-center justify-between text-[4.5px] font-mono text-white/35">
            <span>1.5M clips scanned</span><span>7 candidates</span><span>1 selected</span>
          </div>
        </div>
        {/* Selected Best Match — enlarged */}
        <div className="relative shrink-0" style={{ animation: 'sfc-hl 6s cubic-bezier(0.45,0,0.55,1) infinite' }}>
          {/* Ambient backlight behind the selected clip */}
          <div aria-hidden className="absolute -inset-3 rounded-full pointer-events-none" style={{ background: `radial-gradient(ellipse, ${a}16, transparent 70%)`, filter: 'blur(12px)', animation: 'sfc-breathe 7s cubic-bezier(0.45,0,0.55,1) infinite' }} />
          <div className="relative w-[92px] rounded-[9px] p-1 flex flex-col gap-[3px] overflow-hidden" style={{
            background: `linear-gradient(180deg, ${a}14, rgba(7,14,26,0.95))`,
            border: `1px solid ${a}`,
            boxShadow: `0 0 10px ${a}30, 0 2px 6px rgba(0,0,0,0.45), 0 10px 22px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.14)`
          }}>
            {/* moving scan lines across the selected card */}
            <span aria-hidden className="absolute pointer-events-none" style={{ top: '-40%', left: 0, width: '26%', height: '180%', background: `linear-gradient(to right, transparent, ${a}45 50%, transparent)`, animation: 'monitor-sheen 5.5s cubic-bezier(0.45,0,0.55,1) infinite' }} />
            <span aria-hidden className="absolute inset-x-0 h-[1.5px] pointer-events-none" style={{ top: 0, background: `linear-gradient(90deg, transparent, ${a}80, transparent)`, animation: 'sfc-sweep-y 4.6s linear infinite' }} />
            <div className="relative h-[36px] rounded-[5px] overflow-hidden flex items-center justify-center" style={{ background: 'linear-gradient(150deg, rgba(12,26,48,0.95) 0%, rgba(6,12,22,0.96) 100%)', border: '1px solid rgba(255,255,255,0.09)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -5px 8px rgba(0,0,0,0.45)' }}>
              <span className="text-[13px] leading-none select-none" style={{ filter: 'saturate(0.75)' }}>⌨️</span>
              <span aria-hidden className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.07), transparent 40%, rgba(0,0,0,0.32))' }} />
              <span className="absolute bottom-[2px] right-[3px] text-[4.5px] font-mono text-white/60 leading-none">0:08</span>
            </div>
            <div className="flex items-center justify-between leading-none px-[1px]">
              <span className="text-[5px] font-mono text-white/75 uppercase tracking-wide">Coding</span>
              <span className="text-[6px] font-mono font-black" style={{ color: a, animation: 'sfc-vignette 6s cubic-bezier(0.45,0,0.55,1) infinite' }}>98%</span>
            </div>
          </div>
          <span className="absolute -top-[8px] left-1/2 -translate-x-1/2 px-1.5 rounded-[2px] text-[4.5px] font-mono font-black uppercase whitespace-nowrap leading-[8px]" style={{ color: '#06121F', background: a, boxShadow: `0 0 6px ${a}60` }}>✓ Selected Best Match</span>
        </div>
      </div>
      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(85% 80% at 50% 46%, transparent 58%, rgba(3,7,14,0.5) 100%)' }} />
    </div>
  );
}

function MusicMockup({ a, sec }) {
  return (
    <div className="relative w-full rounded-2xl border border-white/[0.1] bg-black/55 backdrop-blur-xl p-4 flex gap-4 shadow-2xl overflow-hidden text-left">
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:14px_14px] pointer-events-none" />
      <div className="flex-1 flex flex-col justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest mb-1">AI MUSIC SELECTIONS</span>
          {[
            { n: 'Sunset Drive', active: true, bpm: 128, mood: 'Synthwave' },
            { n: 'Midnight Chill', active: false, bpm: 84, mood: 'Lo-Fi Beat' },
            { n: 'Future Electro', active: false, bpm: 140, mood: 'High Energy' }
          ].map((t, idx) => (
            <div key={idx} className="p-2 rounded-lg border flex items-center justify-between transition-all duration-300" style={{ background: t.active ? `${a}15` : 'rgba(255,255,255,0.01)', borderColor: t.active ? `${a}40` : 'rgba(255,255,255,0.03)', opacity: t.active ? 1 : 0.6 }}>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: t.active ? a : 'rgba(255,255,255,0.2)' }} />
                <div className="flex flex-col text-left">
                  <span className="text-[9px] font-mono font-bold text-white leading-none">{t.n}</span>
                  <span className="text-[7px] text-white/30 font-mono mt-0.5">{t.mood}</span>
                </div>
              </div>
              <span className="text-[7.5px] font-mono font-bold" style={{ color: t.active ? a : 'rgba(255,255,255,0.3)' }}>{t.bpm} BPM</span>
            </div>
          ))}
        </div>
        <div className="bg-black/30 border border-white/[0.04] p-2 rounded-lg flex flex-col gap-1.5">
          <span className="text-[7px] font-mono text-white/30 uppercase tracking-wider">BEAT SYNCHRONIZATION</span>
          <div className="flex items-center justify-between">
            <span className="text-[7.5px] font-mono text-white/50">Tempo Lock Status</span>
            <span className="px-1.5 py-0.5 rounded border text-[7px] font-mono font-black" style={{ background: `${a}20`, borderColor: `${a}30`, color: a }}>100% BEAT SYNCED</span>
          </div>
        </div>
      </div>
      <div className="flex-1 bg-black/50 border border-white/[0.04] rounded-xl p-3 flex flex-col gap-3 justify-between shadow-inner">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg relative overflow-hidden bg-slate-900 border border-white/10 flex items-center justify-center flex-shrink-0 animate-[spin_10s_linear_infinite]">
            <div className="absolute inset-0 opacity-60" style={{ background: `linear-gradient(to top right, ${a}, ${sec})` }} />
            <div className="w-2.5 h-2.5 rounded-full bg-black border border-white/20 z-10" />
          </div>
          <div className="flex flex-col text-left min-w-0">
            <span className="text-[9px] font-mono font-bold text-white truncate">Sunset Drive</span>
            <span className="text-[7px] font-mono font-bold" style={{ color: a }}>Track Rating: 9.8/10</span>
          </div>
        </div>
        <div className="h-10 flex items-end justify-between gap-[2px] bg-black/40 rounded border border-white/[0.03] px-2 py-1">
          {Array.from({ length: 18 }).map((_, i) => {
            const h = Math.max(3, Math.sin(i * 0.4) * 22 + 8 + (i % 3 === 0 ? 4 : 0));
            return (
              <div key={i} style={{
                flex: 1,
                height: `${h}px`,
                background: `linear-gradient(to top, ${a}, ${sec})`,
                borderRadius: 1,
              }} />
            );
          })}
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-[7px] font-mono text-white/40">
            <span>01:14</span>
            <span style={{ color: a }} className="font-bold">{128} BPM</span>
            <span>03:42</span>
          </div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: '38%', background: a }} />
          </div>
          <div className="flex justify-center items-center gap-4 text-white/60">
            <Pause size={10} className="hover:text-white cursor-pointer" />
            <Play size={10} className="hover:text-white cursor-pointer" />
            <SkipForward size={10} className="hover:text-white cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ColorMockup({ a, sec }) {
  return (
    <div className="relative w-full rounded-2xl border border-white/[0.1] bg-black/55 backdrop-blur-xl p-4 flex gap-4 shadow-2xl overflow-hidden text-left" style={{ animation: 'sfc-depth 26s ease-in-out infinite' }}>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:11px_11px] pointer-events-none" />
      <div className="flex-[0.9] flex flex-col justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest mb-1">LUT LIBRARY</span>
          {[
            { n: 'Hollywood Teal', active: true, desc: 'Teal & orange grading' },
            { n: 'Fuji Astia', active: false, desc: 'Vintage warm tones' },
            { n: 'Cyberpunk Red', active: false, desc: 'Neon blue & red tint' }
          ].map((lut, idx) => (
            <div key={idx} className="relative overflow-hidden p-2 rounded-lg border text-left transition-all duration-300" style={{ background: lut.active ? `${a}15` : 'rgba(255,255,255,0.01)', borderColor: lut.active ? `${a}40` : 'rgba(255,255,255,0.03)', opacity: lut.active ? 1 : 0.6, animation: lut.active ? 'sfc-breathe-scale 8s ease-in-out infinite' : 'none' }}>
              {lut.active && (
                <span aria-hidden className="absolute pointer-events-none" style={{ top: '-50%', left: 0, width: '32%', height: '200%', background: `linear-gradient(to right, transparent, ${a}1C 50%, transparent)`, animation: 'monitor-sheen 9s ease-in-out infinite' }} />
              )}
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: `linear-gradient(to top right, ${a}, ${sec})` }} />
                <span className="text-[9px] font-mono font-bold text-white leading-none">{lut.n}</span>
              </div>
              <span className="text-[6.5px] text-white/40 font-mono mt-0.5 block">{lut.desc}</span>
            </div>
          ))}
        </div>
        <div className="border p-2 rounded-lg flex items-center justify-between" style={{ background: `${a}20`, borderColor: `${a}30` }}>
          <span className="text-[7.5px] font-mono text-white/50">COLOR PROFILE</span>
          <span className="px-1.5 py-0.5 rounded text-[7.5px] font-mono font-black" style={{ color: a }}>REC.709 ACTIVE</span>
        </div>
      </div>
      <div className="flex-[1.1] flex flex-col gap-3">
        <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">CINEMATIC PREVIEW SLIDER</span>
        <div className="relative aspect-[16/10] bg-slate-900 border border-white/10 rounded-xl overflow-hidden shadow-lg">
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom right, ${a}40, ${sec}20, #070B12)` }} />
          <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded border border-white/20 text-[6px] font-mono font-bold text-white z-10" style={{ background: a }}>AFTER (GRADED)</div>
          {/* BEFORE window — full-width layer slid left; inner counter-slides so content stays fixed */}
          <div className="absolute inset-y-0 left-0 w-full bg-slate-950 border-r border-white/50 z-0 overflow-hidden" style={{ animation: 'sfc-cmp-win 24s ease-in-out infinite' }}>
            <div className="absolute inset-0" style={{ animation: 'sfc-cmp-in 24s ease-in-out infinite' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 opacity-80" />
              <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/60 border border-white/[0.08] text-[6px] font-mono text-white/60">BEFORE (RAW LOG)</div>
            </div>
          </div>
          {/* Handle rail — same window motion keeps the handle on the divider */}
          <div className="absolute inset-0 z-20 pointer-events-none" style={{ animation: 'sfc-cmp-win 24s ease-in-out infinite' }}>
            <div className="absolute left-full top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white text-black flex items-center justify-center shadow-lg border border-white/50 text-[7px] font-black cursor-ew-resize">
              ↔
            </div>
          </div>
        </div>
        <div className="bg-white/[0.02] border border-white/[0.04] p-2.5 rounded-lg flex flex-col gap-2">
          {[
            { n: 'Contrast', val: '+45', pct: '72%' },
            { n: 'Saturation', val: '+20', pct: '60%' }
          ].map((slider, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-[7.5px] font-mono text-white/50 w-14 text-left">{slider.n}</span>
              <div className="flex-1 h-1.5 bg-black/40 rounded-full overflow-hidden relative">
                <div className="h-full rounded-full" style={{ width: slider.pct, background: a, transformOrigin: 'left', animation: `sfc-bar 12s ease-in-out ${i * 0.6}s infinite` }} />
              </div>
              <span className="text-[7.5px] font-mono font-bold w-6 text-right" style={{ color: a }}>{slider.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AgentMockup({ a, sec }) {
  return (
    <div className="relative w-full rounded-2xl border border-white/[0.1] bg-black/55 backdrop-blur-xl p-4 flex gap-4 shadow-2xl overflow-hidden text-left">
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:13px_13px] pointer-events-none" />
      <div className="flex-1 flex flex-col justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest mb-1">PIPELINE EXECUTION</span>
          {[
            { t: 'Audio Silence Clean', status: 'done', c: sec },
            { t: 'Bilingual Captions Sync', status: 'done', c: a },
            { t: 'B-Roll Footage Inject', status: 'done', c: a },
            { t: 'LUT Grading (Fuji Warm)', status: 'active', c: sec }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: item.status === 'done' ? `${item.c}20` : 'rgba(255,255,255,0.05)', border: `1px solid ${item.status === 'done' ? item.c : 'rgba(255,255,255,0.1)'}` }}>
                {item.status === 'done' ? (
                  <Check size={8} color={item.c} strokeWidth={4} />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: a }} />
                )}
              </div>
              <span className={`text-[8.5px] font-mono truncate ${item.status === 'done' ? 'text-white/50' : 'text-white font-bold'}`}>{item.t}</span>
            </div>
          ))}
        </div>
        <div className="bg-black/30 border border-white/[0.04] p-2 rounded-lg flex flex-col gap-1">
          <div className="flex justify-between text-[7px] font-mono text-white/40">
            <span>EXPORT SPEED</span>
            <span className="font-bold" style={{ color: a }}>120 FPS</span>
          </div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: '88%', background: a }} />
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-between gap-3">
        <div className="flex flex-col gap-2">
          <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">CONVERSATION</span>
          <div className="flex justify-end">
            <div className="max-w-[90%] border px-2 py-1.5 rounded-xl rounded-tr-none text-[8.5px] font-mono text-white text-right leading-tight shadow-md" style={{ background: `linear-gradient(to right, ${sec}, ${a})`, borderColor: `${a}20` }}>
              "Clean audio pauses and make it look warm."
            </div>
          </div>
          <div className="flex justify-start">
            <div className="max-w-[95%] bg-black/60 border border-white/[0.06] px-2 py-1.5 rounded-xl rounded-tl-none text-[8.5px] font-mono text-white/80 leading-normal shadow-lg flex gap-1.5 items-start">
              <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[7px] font-bold text-white flex-shrink-0 shadow-md" style={{ background: a }}>AI</div>
              <div className="text-left">
                Executing edits... 
                <span className="font-bold block mt-0.5" style={{ color: a }}>LUT graded + pauses cut!</span>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white/[0.02] border border-white/[0.04] p-2 rounded-lg grid grid-cols-2 gap-1.5 text-left">
          <div>
            <div className="text-[6.5px] font-mono text-white/30">OUTPUT FORMAT</div>
            <div className="text-[8px] font-mono text-white font-black">ProRes 422 HQ</div>
          </div>
          <div>
            <div className="text-[6.5px] font-mono text-white/30">RESOLUTION</div>
            <div className="text-[8px] font-mono text-white font-black">4K Ultra HD</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function renderMockup(type, a, sec) {
  switch(type) {
    case 'silence':  return <SilenceMockup a={a} sec={sec}/>;
    case 'captions': return <CaptionsMockup a={a} sec={sec}/>;
    case 'broll':    return <BRollMockup a={a} sec={sec}/>;
    case 'music':    return <MusicMockup a={a} sec={sec}/>;
    case 'color':    return <ColorMockup a={a} sec={sec}/>;
    case 'agent':    return <AgentMockup a={a} sec={sec}/>;
    default:         return null;
  }
}

// Helper function to render different patterns and design in each card's background
function renderCardPatterns(card, isAlt) {
  switch (card.id) {
    case 'silence':
      return (
        <>
          {/* Frequency line field — breathing */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: `repeating-linear-gradient(180deg, transparent 0px, transparent 26px, ${card.accent}0B 26px, ${card.accent}0B 27px)`,
            WebkitMaskImage: `radial-gradient(70% 85% at ${isAlt ? '30%' : '70%'} 50%, white, transparent)`,
            maskImage: `radial-gradient(70% 85% at ${isAlt ? '30%' : '70%'} 50%, white, transparent)`,
            animation: 'sfc1-breathe 7s cubic-bezier(0.45,0,0.55,1) infinite'
          }} />
          {/* Slow volumetric audio glow — deep layer */}
          <div style={{
            position: 'absolute', width: 420, height: 300,
            right: isAlt ? 'auto' : '4%', left: isAlt ? '4%' : 'auto', top: '20%',
            background: `radial-gradient(ellipse, ${card.accent}16, transparent 65%)`,
            filter: 'blur(36px)', pointerEvents: 'none',
            animation: 'sfc1-breathe 11s cubic-bezier(0.45,0,0.55,1) 2s infinite'
          }} />
          {/* Moving waveform trails */}
          <svg viewBox="0 0 600 200" preserveAspectRatio="none" style={{
            position: 'absolute', width: 620, height: 200,
            right: isAlt ? 'auto' : '-4%', left: isAlt ? '-4%' : 'auto', top: '24%',
            opacity: 0.3, pointerEvents: 'none', animation: 'sfc1-drift 14s cubic-bezier(0.45,0,0.55,1) infinite'
          }}>
            <path d="M0 100 Q 25 30 50 100 T 100 100 T 150 100 T 200 100 T 250 100 T 300 100 T 350 100 T 400 100 T 450 100 T 500 100 T 550 100 T 600 100" fill="none" stroke={card.accent} strokeWidth="1.5" />
          </svg>
          <svg viewBox="0 0 600 200" preserveAspectRatio="none" style={{
            position: 'absolute', width: 620, height: 260,
            right: isAlt ? 'auto' : '-6%', left: isAlt ? '-6%' : 'auto', top: '30%',
            opacity: 0.15, filter: 'blur(1.5px)', pointerEvents: 'none', animation: 'sfc1-drift 19s cubic-bezier(0.45,0,0.55,1) infinite reverse'
          }}>
            <path d="M0 100 Q 40 10 80 100 T 160 100 T 240 100 T 320 100 T 400 100 T 480 100 T 560 100 T 600 100" fill="none" stroke={card.accent} strokeWidth="2" />
          </svg>
          {/* Spectrum bars */}
          <div style={{
            position: 'absolute',
            right: isAlt ? 'auto' : '-8%', left: isAlt ? '-8%' : 'auto',
            top: '22%', width: '560px', height: '220px', opacity: 0.16, pointerEvents: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px'
          }}>
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} style={{
                flex: 1,
                height: `${Math.max(4, Math.sin(i * 0.4) * 150 + 56)}px`,
                background: `linear-gradient(to top, transparent, ${card.accent}, transparent)`,
                borderRadius: '2px',
                transformOrigin: 'center',
                animation: `sfc1-eq 3.4s cubic-bezier(0.45,0,0.55,1) ${(i % 8) * 0.22}s infinite`
              }} />
            ))}
          </div>
          {/* Pulse rings */}
          <div style={{
            position: 'absolute', width: 190, height: 190, borderRadius: '50%',
            border: `1px solid ${card.accent}50`,
            right: isAlt ? 'auto' : '14%', left: isAlt ? '14%' : 'auto', top: '28%',
            pointerEvents: 'none', animation: 'sfc1-pulse 4.5s cubic-bezier(0.25,0.46,0.45,0.94) infinite'
          }} />
          <div style={{
            position: 'absolute', width: 190, height: 190, borderRadius: '50%',
            border: `1px solid ${card.accent}38`,
            right: isAlt ? 'auto' : '14%', left: isAlt ? '14%' : 'auto', top: '28%',
            pointerEvents: 'none', animation: 'sfc1-pulse 4.5s cubic-bezier(0.25,0.46,0.45,0.94) 2.2s infinite'
          }} />
          {/* Studio vignette */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: `radial-gradient(95% 80% at ${isAlt ? '35%' : '65%'} 45%, transparent 55%, rgba(2,6,14,0.5) 100%)`
          }} />
        </>
      );

    case 'captions':
      return (
        <>
          {/* Text baseline guides */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: 'repeating-linear-gradient(180deg, transparent 0px, transparent 34px, rgba(255,255,255,0.022) 34px, rgba(255,255,255,0.022) 35px)',
            WebkitMaskImage: 'linear-gradient(180deg, transparent 4%, white 28%, white 76%, transparent 96%)',
            maskImage: 'linear-gradient(180deg, transparent 4%, white 28%, white 76%, transparent 96%)'
          }} />
          {/* Large ultra-soft purple aurora — slow moving */}
          <div style={{
            position: 'absolute', inset: '-18%', pointerEvents: 'none',
            background: `radial-gradient(55% 48% at 68% 30%, ${card.accent}14 0%, transparent 68%), radial-gradient(48% 42% at 28% 78%, rgba(124,58,237,0.12) 0%, transparent 68%)`,
            filter: 'blur(30px)',
            animation: 'sfc-drift-xy 22s ease-in-out infinite'
          }} />
          {/* Drifting violet mesh gradient — deep layer */}
          <div style={{
            position: 'absolute', inset: '-10%', pointerEvents: 'none',
            background: `radial-gradient(42% 38% at 74% 24%, ${card.accent}12 0%, transparent 70%), radial-gradient(38% 34% at 22% 72%, rgba(124,58,237,0.1) 0%, transparent 70%)`,
            animation: 'sfc-drift-xy 16s ease-in-out infinite reverse'
          }} />
          {/* Floating horizontal light bands */}
          {[
            { t: '26%', h: 22, d: '0s', dur: '17s' }, { t: '48%', h: 16, d: '4s', dur: '21s' }, { t: '68%', h: 26, d: '8s', dur: '19s' }
          ].map((b, i) => (
            <div key={`band-${i}`} style={{
              position: 'absolute', left: '-6%', right: '-6%', top: b.t, height: b.h,
              background: `linear-gradient(90deg, transparent, ${card.accent}12 45%, rgba(255,255,255,0.05) 55%, transparent)`,
              filter: 'blur(8px)', opacity: 0.65, pointerEvents: 'none',
              animation: `sfc-drift-x ${b.dur} ease-in-out ${b.d} infinite`
            }} />
          ))}
          {/* Tiny glowing particles drifting upward */}
          {[
            { s: '12%', t: '78%', d: '0s', sz: 2.5 }, { s: '26%', t: '85%', d: '2.5s', sz: 2 },
            { s: '38%', t: '80%', d: '5s', sz: 3 }, { s: '18%', t: '90%', d: '7.5s', sz: 2 },
            { s: '32%', t: '92%', d: '10s', sz: 2.5 }
          ].map((p, i) => (
            <div key={`rise-${i}`} style={{
              position: 'absolute', width: p.sz, height: p.sz, borderRadius: '50%',
              right: isAlt ? 'auto' : p.s, left: isAlt ? p.s : 'auto', top: p.t,
              background: card.accent, boxShadow: `0 0 6px ${card.accent}90`, opacity: 0,
              pointerEvents: 'none', animation: `sfc-rise 12s linear ${p.d} infinite`
            }} />
          ))}
          {/* Lavender key light + white fill light */}
          <div style={{
            position: 'absolute', right: '-6%', top: '-12%', width: 480, height: 320,
            background: `radial-gradient(ellipse, ${card.accent}18, transparent 65%)`,
            filter: 'blur(28px)', pointerEvents: 'none',
            animation: 'sfc-breathe 9s ease-in-out infinite'
          }} />
          <div style={{
            position: 'absolute', left: '6%', bottom: '-14%', width: 380, height: 240,
            background: 'radial-gradient(ellipse, rgba(255,255,255,0.055), transparent 60%)',
            filter: 'blur(26px)', pointerEvents: 'none'
          }} />
          {/* Floating ghost caption plates — violet glass */}
          <div style={{
            position: 'absolute', right: isAlt ? 'auto' : '13%', left: isAlt ? '13%' : 'auto', top: '22%',
            width: 230, height: 36, borderRadius: 10,
            background: `${card.accent}12`, border: `1px solid ${card.accent}30`,
            backdropFilter: 'blur(6px)', boxShadow: `0 12px 28px rgba(0,0,0,0.35), 0 0 16px ${card.accent}14`,
            pointerEvents: 'none', animation: 'sfc-float 9s ease-in-out infinite'
          }} />
          <div style={{
            position: 'absolute', right: isAlt ? 'auto' : '24%', left: isAlt ? '24%' : 'auto', top: '40%',
            width: 170, height: 28, borderRadius: 8,
            background: `${card.accent}14`, border: `1px solid ${card.accent}30`,
            backdropFilter: 'blur(6px)', boxShadow: '0 10px 22px rgba(0,0,0,0.3)',
            pointerEvents: 'none', animation: 'sfc-float 11s ease-in-out 2s infinite'
          }} />
          <div style={{
            position: 'absolute', right: isAlt ? 'auto' : '9%', left: isAlt ? '9%' : 'auto', bottom: '18%',
            width: 120, height: 22, borderRadius: 7,
            background: 'rgba(196,181,253,0.05)', border: `1px solid ${card.accent}20`,
            pointerEvents: 'none', animation: 'sfc-float 13s ease-in-out 4s infinite'
          }} />
          {/* Violet ambient particles */}
          {[
            { s: '16%', t: '30%', d: '0s', sz: 4 }, { s: '34%', t: '18%', d: '1.8s', sz: 3 },
            { s: '10%', t: '58%', d: '3.4s', sz: 5 }, { s: '30%', t: '66%', d: '5s', sz: 3 },
            { s: '22%', t: '46%', d: '2.6s', sz: 3.5 }
          ].map((p, i) => (
            <div key={i} style={{
              position: 'absolute', width: p.sz, height: p.sz, borderRadius: '50%',
              right: isAlt ? 'auto' : p.s, left: isAlt ? p.s : 'auto', top: p.t,
              background: card.accent, opacity: 0.4, boxShadow: `0 0 8px ${card.accent}90`,
              pointerEvents: 'none', animation: `sfc-float 7.5s ease-in-out ${p.d} infinite`
            }} />
          ))}
          {/* Graphite vignette — soft breathing */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'radial-gradient(90% 85% at 50% 40%, transparent 58%, rgba(6,7,11,0.55) 100%)',
            animation: 'sfc-vignette 13s ease-in-out infinite'
          }} />
        </>
      );

    case 'broll':
      return (
        <>
          {/* Holographic vision grid — slow drift */}
          <div style={{
            position: 'absolute', inset: '-40px', pointerEvents: 'none',
            backgroundImage: `linear-gradient(${card.accent}09 1px, transparent 1px), linear-gradient(90deg, ${card.accent}09 1px, transparent 1px)`,
            backgroundSize: '34px 34px',
            WebkitMaskImage: `radial-gradient(55% 70% at ${isAlt ? '32%' : '68%'} 45%, white, transparent)`,
            maskImage: `radial-gradient(55% 70% at ${isAlt ? '32%' : '68%'} 45%, white, transparent)`,
            animation: 'sfc-drift-xy 30s ease-in-out infinite reverse, sfc-breathe 34s ease-in-out infinite'
          }} />
          {/* Subtle moving sapphire gradient behind the strips */}
          <div style={{
            position: 'absolute', inset: '-12%', pointerEvents: 'none',
            background: 'radial-gradient(46% 40% at 30% 68%, rgba(30, 110, 200, 0.08) 0%, transparent 68%), radial-gradient(40% 36% at 72% 40%, rgba(37, 99, 235, 0.06) 0%, transparent 68%)',
            filter: 'blur(26px)',
            animation: 'sfc-drift-xy 28s ease-in-out infinite'
          }} />
          {/* Film strip #2 — deeper layer, smaller, offset, slower, reverse drift */}
          <div style={{
            position: 'absolute', bottom: '46%', left: '-20%', width: '140%', height: 46,
            transform: 'rotate(-6deg)', transformOrigin: 'center', opacity: 0.06,
            pointerEvents: 'none', overflow: 'hidden',
            filter: 'drop-shadow(0 0 6px rgba(30,110,200,0.3))'
          }}>
            <div style={{
              position: 'absolute', top: 0, bottom: 0, left: '-66%', width: '166%',
              display: 'flex', flexDirection: 'column',
              animation: 'sfc-strip-slide 27s linear infinite reverse'
            }}>
              <div style={{
                height: 8, flexShrink: 0,
                backgroundColor: 'rgba(5,12,22,0.85)',
                backgroundImage: 'repeating-linear-gradient(90deg, rgba(130,170,210,0.4) 0px, rgba(130,170,210,0.4) 6px, transparent 6px, transparent 22px)',
                borderBottom: '1px solid rgba(30,110,200,0.3)'
              }} />
              <div style={{
                flex: 1,
                backgroundImage: `repeating-linear-gradient(90deg, ${card.accent}45 0px, ${card.accent}45 2px, ${card.accent}0A 2px, ${card.accent}0A 66px)`
              }} />
              <div style={{
                height: 8, flexShrink: 0,
                backgroundColor: 'rgba(5,12,22,0.85)',
                backgroundImage: 'repeating-linear-gradient(90deg, rgba(130,170,210,0.4) 0px, rgba(130,170,210,0.4) 6px, transparent 6px, transparent 22px)',
                borderTop: '1px solid rgba(30,110,200,0.3)'
              }} />
            </div>
          </div>
          {/* Soft ambient blue light between the two strips */}
          <div style={{
            position: 'absolute', bottom: '34%', left: '10%', width: '64%', height: 100,
            background: 'radial-gradient(ellipse, rgba(56, 140, 255, 0.07), transparent 70%)',
            filter: 'blur(28px)', transform: 'rotate(-7deg)', pointerEvents: 'none',
            animation: 'sfc-breathe 16s ease-in-out infinite'
          }} />
          {/* Extra dim particles between the strips */}
          {[
            { l: '20%', b: '40%', d: '1.5s', sz: 2 }, { l: '48%', b: '46%', d: '5.5s', sz: 2.5 }, { l: '66%', b: '38%', d: '9.5s', sz: 2 }
          ].map((p, i) => (
            <div key={`mid-p-${i}`} style={{
              position: 'absolute', width: p.sz, height: p.sz, borderRadius: '50%',
              left: p.l, bottom: p.b,
              background: card.accent, opacity: 0.16, boxShadow: `0 0 4px ${card.accent}50`,
              pointerEvents: 'none', animation: `sfc-float 14s ease-in-out ${p.d} infinite`
            }} />
          ))}
          {/* Cinematic diagonal film strip — hero design language, bottom-left → upper-right */}
          <div style={{
            position: 'absolute', bottom: '26%', left: '-24%', width: '150%', height: 72,
            transform: 'rotate(-8deg)', transformOrigin: 'center', opacity: 0.12,
            pointerEvents: 'none', overflow: 'hidden',
            filter: 'drop-shadow(0 0 8px rgba(14,165,233,0.35))'
          }}>
            {/* Conveyor track — slides one full pattern period, seamless linear loop */}
            <div style={{
              position: 'absolute', top: 0, bottom: 0, left: 0, width: '166%',
              display: 'flex', flexDirection: 'column',
              animation: 'sfc-strip-slide 22s linear infinite'
            }}>
              <div style={{
                height: 11, flexShrink: 0,
                backgroundColor: 'rgba(6,14,24,0.85)',
                backgroundImage: 'repeating-linear-gradient(90deg, rgba(148,190,220,0.45) 0px, rgba(148,190,220,0.45) 6px, transparent 6px, transparent 22px)',
                borderBottom: '1px solid rgba(14,165,233,0.35)'
              }} />
              <div style={{
                flex: 1,
                backgroundImage: `repeating-linear-gradient(90deg, ${card.accent}55 0px, ${card.accent}55 2px, ${card.accent}0E 2px, ${card.accent}0E 66px)`
              }} />
              <div style={{
                height: 11, flexShrink: 0,
                backgroundColor: 'rgba(6,14,24,0.85)',
                backgroundImage: 'repeating-linear-gradient(90deg, rgba(148,190,220,0.45) 0px, rgba(148,190,220,0.45) 6px, transparent 6px, transparent 22px)',
                borderTop: '1px solid rgba(14,165,233,0.35)'
              }} />
            </div>
            {/* Occasional traveling glow along the strip */}
            <div style={{
              position: 'absolute', top: 0, bottom: 0, left: 0, width: '18%',
              background: 'linear-gradient(90deg, transparent, rgba(79,209,255,0.4), transparent)',
              opacity: 0, animation: 'sfc-strip-glow 18s linear infinite'
            }} />
          </div>
          {/* Soft blue under-glow beneath the strip */}
          <div style={{
            position: 'absolute', bottom: '20%', left: '4%', width: '72%', height: 90,
            background: 'radial-gradient(ellipse, rgba(14,165,233,0.07), transparent 70%)',
            filter: 'blur(24px)', transform: 'rotate(-8deg)', pointerEvents: 'none'
          }} />
          {/* Tiny particles along the stripe */}
          {[
            { l: '12%', b: '30%', d: '0s', sz: 2.5 }, { l: '34%', b: '35%', d: '3s', sz: 2 },
            { l: '56%', b: '40%', d: '6s', sz: 3 }, { l: '76%', b: '45%', d: '9s', sz: 2 }
          ].map((p, i) => (
            <div key={`strip-p-${i}`} style={{
              position: 'absolute', width: p.sz, height: p.sz, borderRadius: '50%',
              left: p.l, bottom: p.b,
              background: card.accent, opacity: 0.25, boxShadow: `0 0 5px ${card.accent}60`,
              pointerEvents: 'none', animation: `sfc-float 13s ease-in-out ${p.d} infinite`
            }} />
          ))}
          {/* AI data connection flow — ultra-thin paths with travelling light packets */}
          <svg viewBox="0 0 520 420" style={{
            position: 'absolute',
            right: isAlt ? 'auto' : '-4%', left: isAlt ? '-4%' : 'auto', top: '12%',
            width: '520px', height: '420px', opacity: 0.5, pointerEvents: 'none'
          }}>
            <path d="M 40 90 L 210 90 L 210 200 L 420 200" fill="none" stroke={card.accent} strokeWidth="0.8" opacity="0.22" />
            <path d="M 80 330 L 260 330 L 260 250 L 470 250" fill="none" stroke={card.accent} strokeWidth="0.8" opacity="0.18" />
            <path d="M 470 110 L 320 110 L 320 160 L 120 160" fill="none" stroke={card.accent} strokeWidth="0.8" opacity="0.15" />
          </svg>
          {[
            { p: "M 40 90 L 210 90 L 210 200 L 420 200", dur: '11s', del: '0s' },
            { p: "M 80 330 L 260 330 L 260 250 L 470 250", dur: '14s', del: '4s' },
            { p: "M 470 110 L 320 110 L 320 160 L 120 160", dur: '12s', del: '8s' }
          ].map((f, i) => (
            <div key={`pkt-${i}`} style={{
              position: 'absolute',
              right: isAlt ? 'auto' : '-4%', left: isAlt ? '-4%' : 'auto', top: '12%',
              width: '520px', height: '420px', pointerEvents: 'none'
            }}>
              <div style={{
                width: 3.5, height: 3.5, borderRadius: '50%',
                background: card.accent, boxShadow: `0 0 6px ${card.accent}, 0 0 10px ${card.accent}60`,
                offsetPath: `path('${f.p}')`, offsetRotate: '0deg', opacity: 0,
                animation: `sfc-packet ${f.dur} linear ${f.del} infinite`
              }} />
            </div>
          ))}
          {/* Floating ambient particles */}
          {[
            { s: '16%', t: '28%', d: '0s', sz: 2.5 }, { s: '34%', t: '20%', d: '2.5s', sz: 2 },
            { s: '10%', t: '52%', d: '5s', sz: 3 }, { s: '28%', t: '66%', d: '7.5s', sz: 2 },
            { s: '42%', t: '44%', d: '10s', sz: 2.5 }, { s: '22%', t: '80%', d: '12.5s', sz: 2 }
          ].map((p, i) => (
            <div key={`amb-${i}`} style={{
              position: 'absolute', width: p.sz, height: p.sz, borderRadius: '50%',
              right: isAlt ? 'auto' : p.s, left: isAlt ? p.s : 'auto', top: p.t,
              background: card.accent, opacity: 0.2, boxShadow: `0 0 5px ${card.accent}50`,
              pointerEvents: 'none', animation: `sfc-float 15s ease-in-out ${p.d} infinite`
            }} />
          ))}
          {/* Camera tracking brackets */}
          {[
            { t: '26%', s: '10%', bt: true, bl: true }, { t: '26%', s: '38%', bt: true, bl: false },
            { t: '62%', s: '10%', bt: false, bl: true }, { t: '62%', s: '38%', bt: false, bl: false }
          ].map((b, i) => (
            <div key={i} style={{
              position: 'absolute', width: 16, height: 16, top: b.t,
              right: isAlt ? 'auto' : b.s, left: isAlt ? b.s : 'auto',
              borderTop: b.bt ? `1.5px solid ${card.accent}55` : 'none',
              borderBottom: !b.bt ? `1.5px solid ${card.accent}55` : 'none',
              borderLeft: b.bl ? `1.5px solid ${card.accent}55` : 'none',
              borderRight: !b.bl ? `1.5px solid ${card.accent}55` : 'none',
              pointerEvents: 'none'
            }} />
          ))}
          {/* Vision scanner sweep */}
          <div style={{
            position: 'absolute', top: '24%', height: '42%', width: 2,
            right: isAlt ? 'auto' : '40%', left: isAlt ? '10%' : 'auto',
            background: `linear-gradient(180deg, transparent, ${card.accent}66, transparent)`,
            boxShadow: `0 0 12px ${card.accent}40`,
            pointerEvents: 'none', animation: 'sfc-scan 9s ease-in-out infinite'
          }} />
          {/* Cinematic blue depth vignette */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: `radial-gradient(90% 80% at ${isAlt ? '35%' : '65%'} 45%, transparent 52%, rgba(2,8,16,0.55) 100%)`
          }} />
        </>
      );

    case 'music':
      return (
        <>
          {/* Vinyl record rings */}
          <div style={{
            position: 'absolute',
            right: isAlt ? 'auto' : '-14%', left: isAlt ? '-14%' : 'auto', top: '-16%',
            width: 640, height: 640, borderRadius: '50%', pointerEvents: 'none',
            background: `repeating-radial-gradient(circle, transparent 0px, transparent 24px, ${card.accent}0C 24px, ${card.accent}0C 25px)`,
            WebkitMaskImage: 'radial-gradient(circle, white 30%, transparent 72%)',
            maskImage: 'radial-gradient(circle, white 30%, transparent 72%)'
          }} />
          {/* Rotating tonearm light sweep over the vinyl */}
          <div style={{
            position: 'absolute',
            right: isAlt ? 'auto' : '-14%', left: isAlt ? '-14%' : 'auto', top: '-16%',
            width: 640, height: 640, borderRadius: '50%', pointerEvents: 'none',
            background: `conic-gradient(from 0deg, transparent 0deg, transparent 322deg, ${card.accent}1E 340deg, transparent 358deg)`,
            animation: 'sfc-spin-slow 20s linear infinite'
          }} />
          {/* Counter-rotating deep sweep — parallax layer */}
          <div style={{
            position: 'absolute',
            right: isAlt ? 'auto' : '-18%', left: isAlt ? '-18%' : 'auto', top: '-20%',
            width: 720, height: 720, borderRadius: '50%', pointerEvents: 'none',
            background: `conic-gradient(from 180deg, transparent 0deg, transparent 330deg, ${card.accent}0E 345deg, transparent 359deg)`,
            animation: 'sfc-spin-slow 34s linear infinite reverse'
          }} />
          {/* Equalizer glow — bottom */}
          <div style={{
            position: 'absolute', bottom: 0, height: 90,
            right: isAlt ? 'auto' : '8%', left: isAlt ? '8%' : 'auto',
            width: '44%', display: 'flex', alignItems: 'flex-end', gap: 5,
            opacity: 0.3, pointerEvents: 'none'
          }}>
            {Array.from({ length: 14 }).map((_, i) => (
              <div key={i} style={{
                flex: 1, height: `${Math.abs(Math.sin(i * 0.7)) * 62 + 18}px`,
                background: `linear-gradient(to top, ${card.accent}, transparent)`,
                borderRadius: '2px 2px 0 0', transformOrigin: 'bottom',
                animation: `sfc-eq 2.6s ease-in-out ${(i % 7) * 0.28}s infinite`
              }} />
            ))}
          </div>
          {/* Floating sound particles */}
          {[
            { s: '18%', t: '26%', d: '0s', sz: 4 }, { s: '30%', t: '40%', d: '1.6s', sz: 3 },
            { s: '12%', t: '55%', d: '3.1s', sz: 5 }, { s: '38%', t: '20%', d: '4.4s', sz: 3 },
            { s: '26%', t: '64%', d: '2.2s', sz: 4 }
          ].map((p, i) => (
            <div key={i} style={{
              position: 'absolute', width: p.sz, height: p.sz, borderRadius: '50%',
              right: isAlt ? 'auto' : p.s, left: isAlt ? p.s : 'auto', top: p.t,
              background: card.accent, opacity: 0.42, boxShadow: `0 0 8px ${card.accent}90`,
              pointerEvents: 'none', animation: `sfc-float 8s ease-in-out ${p.d} infinite`
            }} />
          ))}
          {/* BPM tag */}
          <div style={{
            position: 'absolute', top: '18%',
            right: isAlt ? 'auto' : '30%', left: isAlt ? '30%' : 'auto',
            fontFamily: 'monospace', fontSize: 7.5, fontWeight: 800, letterSpacing: '0.12em',
            color: `${card.accent}CC`, padding: '2px 6px',
            background: 'rgba(16,10,5,0.8)', border: `1px solid ${card.accent}40`, borderRadius: 4,
            boxShadow: `0 0 10px ${card.accent}20`, pointerEvents: 'none'
          }}>128 BPM · LOCKED</div>
          {/* Warm studio vignette */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: `radial-gradient(95% 85% at ${isAlt ? '32%' : '68%'} 40%, transparent 50%, rgba(10,6,3,0.55) 100%)`
          }} />
        </>
      );

    case 'color':
      return (
        <>
          {/* Soft horizontal light beam — slow drift behind the UI */}
          <div style={{
            position: 'absolute', top: '44%', left: '-10%', right: '-10%', height: 60,
            background: 'linear-gradient(90deg, transparent, rgba(245,239,230,0.045) 40%, rgba(244,63,94,0.03) 60%, transparent)',
            filter: 'blur(14px)', pointerEvents: 'none',
            animation: 'sfc-drift-x 30s ease-in-out infinite'
          }} />
          {/* Cinematic volumetric light sweep */}
          <div style={{
            position: 'absolute', top: '-45%', left: 0, width: '32%', height: '190%',
            background: `linear-gradient(to right, transparent, ${card.accent}14 40%, rgba(245,239,230,0.065) 55%, transparent)`,
            pointerEvents: 'none', animation: 'monitor-sheen 21s ease-in-out infinite'
          }} />
          {/* Slow glass reflection pass */}
          <div style={{
            position: 'absolute', top: '-45%', left: 0, width: '22%', height: '190%',
            background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.035) 50%, transparent)',
            pointerEvents: 'none', animation: 'monitor-sheen 29s ease-in-out 8s infinite'
          }} />
          {/* Large blurred red cinematic glow — drifting */}
          <div style={{
            position: 'absolute', top: '32%', width: 380, height: 300,
            right: isAlt ? 'auto' : '2%', left: isAlt ? '2%' : 'auto',
            background: `radial-gradient(ellipse, ${card.accent}16, transparent 66%)`,
            filter: 'blur(40px)', pointerEvents: 'none',
            animation: 'sfc-drift-xy 24s ease-in-out infinite'
          }} />
          {/* Floating cinema dust */}
          {[
            { s: '14%', t: '30%', d: '0s', sz: 2.5, c: 'rgba(245,239,230,0.9)' },
            { s: '30%', t: '48%', d: '2.8s', sz: 2, c: 'rgba(245,239,230,0.8)' },
            { s: '20%', t: '64%', d: '5.6s', sz: 3, c: `${card.accent}CC` },
            { s: '36%', t: '24%', d: '8.4s', sz: 2, c: `${card.accent}AA` },
            { s: '10%', t: '82%', d: '4.2s', sz: 2.5, c: 'rgba(245,239,230,0.7)' }
          ].map((p, i) => (
            <div key={`dust-${i}`} style={{
              position: 'absolute', width: p.sz, height: p.sz, borderRadius: '50%',
              right: isAlt ? 'auto' : p.s, left: isAlt ? p.s : 'auto', top: p.t,
              background: p.c, boxShadow: `0 0 5px ${card.accent}50`, opacity: 0,
              pointerEvents: 'none', animation: `sfc-rise 24s linear ${p.d} infinite`
            }} />
          ))}
          {/* Soft lens glow — slow breathing */}
          <div style={{
            position: 'absolute', top: '24%', width: 120, height: 120, borderRadius: '50%',
            right: isAlt ? 'auto' : '22%', left: isAlt ? '22%' : 'auto',
            background: `radial-gradient(circle, rgba(245,239,230,0.1) 0%, ${card.accent}0A 40%, transparent 70%)`,
            filter: 'blur(14px)', pointerEvents: 'none',
            animation: 'sfc-breathe 26s ease-in-out 5s infinite'
          }} />
          {/* LUT strip ambient — faint moving gradient + cinematic sweep (12s, phase-locked with bars) */}
          <div style={{
            position: 'absolute', bottom: '7%', height: 110,
            right: isAlt ? 'auto' : '4%', left: isAlt ? '4%' : 'auto', width: '48%',
            background: `linear-gradient(90deg, transparent, ${card.accent}0A 40%, rgba(245,239,230,0.03) 60%, transparent)`,
            filter: 'blur(16px)', pointerEvents: 'none',
            animation: 'sfc-drift-x 12s ease-in-out infinite'
          }} />
          {/* LUT strip ambient glow — breathing (18s, phase-locked with bloom) */}
          <div style={{
            position: 'absolute', bottom: '9%', width: 250, height: 90,
            right: isAlt ? 'auto' : '10%', left: isAlt ? '10%' : 'auto',
            background: `radial-gradient(ellipse, ${card.accent}09, transparent 68%)`,
            filter: 'blur(22px)', pointerEvents: 'none',
            animation: 'sfc-breathe 18s ease-in-out infinite'
          }} />
          {/* Micro particles around the LUT section */}
          {[
            { s: '13%', b: '11%', d: '0s', sz: 2 }, { s: '30%', b: '19%', d: '3.5s', sz: 2.5 }, { s: '22%', b: '8%', d: '7s', sz: 2 }
          ].map((p, i) => (
            <div key={`lut-p-${i}`} style={{
              position: 'absolute', width: p.sz, height: p.sz, borderRadius: '50%',
              right: isAlt ? 'auto' : p.s, left: isAlt ? p.s : 'auto', bottom: p.b,
              background: 'rgba(245,239,230,0.85)', opacity: 0.18, boxShadow: `0 0 4px ${card.accent}50`,
              pointerEvents: 'none', animation: `sfc-float 11s ease-in-out ${p.d} infinite`
            }} />
          ))}
          {/* LUT swatch strip */}
          <div style={{
            position: 'absolute', bottom: '14%',
            right: isAlt ? 'auto' : '12%', left: isAlt ? '12%' : 'auto',
            display: 'flex', alignItems: 'center', gap: 5, pointerEvents: 'none'
          }}>
            {['#F43F5E', '#D4A574', '#14B8A6', '#3B82F6', '#F5EFE6'].map((c, i) => (
              <div key={i} style={{
                width: 14, height: 14, borderRadius: 3, background: `${c}30`,
                border: `1px solid ${c}50`, boxShadow: `0 0 8px ${c}40`,
                animation: `sfc-swatch 5s ease-in-out ${i * 1}s infinite`
              }} />
            ))}
            <span style={{
              fontFamily: 'monospace', fontSize: 7, fontWeight: 800, letterSpacing: '0.1em',
              color: 'rgba(245,239,230,0.5)', marginLeft: 4,
              animation: 'sfc-vignette 8s ease-in-out infinite'
            }}>LUT 09 · KODAK 2383</span>
          </div>
          {/* Grading curves */}
          <svg style={{
            position: 'absolute',
            right: isAlt ? 'auto' : '6%', left: isAlt ? '6%' : 'auto',
            top: '18%', width: '320px', height: '170px', opacity: 0.18, pointerEvents: 'none'
          }}>
            <path d="M 0 140 Q 80 15 160 120 T 310 30" fill="none" stroke={card.accent} strokeWidth="2.5" />
            <path d="M 0 120 Q 100 50 190 95 T 310 60" fill="none" stroke={card.accentSec || '#D4A574'} strokeWidth="1.5" strokeDasharray="3 3" />
          </svg>
          {/* Cinematic bloom — radial pulse behind preview panel */}
          <div style={{
            position: 'absolute', top: '20%', width: 340, height: 260,
            right: isAlt ? 'auto' : '10%', left: isAlt ? '10%' : 'auto',
            background: `radial-gradient(ellipse, ${card.accent}14, transparent 65%)`,
            filter: 'blur(34px)', pointerEvents: 'none',
            animation: 'sfc-breathe 18s ease-in-out infinite'
          }} />
          {/* Heavy film grain — animated jitter (oversized layer, transform-only) */}
          <div style={{
            position: 'absolute', inset: '-20px', opacity: 0.03, pointerEvents: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`,
            animation: 'sfc-grain 0.9s steps(2) infinite'
          }} />
          {/* Exposure vignette — very slow breathing */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'radial-gradient(85% 75% at 50% 45%, transparent 48%, rgba(8,4,7,0.65) 100%)',
            animation: 'sfc-vignette 28s ease-in-out infinite'
          }} />
        </>
      );

    case 'agent':
      return (
        <>
          {/* Large moving emerald aurora */}
          <div style={{
            position: 'absolute', inset: '-16%', pointerEvents: 'none',
            background: `radial-gradient(52% 46% at 72% 26%, ${card.accent}12 0%, transparent 66%), radial-gradient(44% 40% at 24% 76%, rgba(79,209,255,0.08) 0%, transparent 66%)`,
            filter: 'blur(28px)',
            animation: 'sfc-drift-xy 20s ease-in-out infinite'
          }} />
          {/* Floating blurred green light blobs */}
          <div style={{
            position: 'absolute', width: 200, height: 160, top: '18%',
            right: isAlt ? 'auto' : '30%', left: isAlt ? '30%' : 'auto',
            background: `radial-gradient(ellipse, ${card.accent}14, transparent 65%)`,
            filter: 'blur(26px)', pointerEvents: 'none',
            animation: 'sfc-float 12s ease-in-out infinite'
          }} />
          <div style={{
            position: 'absolute', width: 150, height: 130, bottom: '22%',
            right: isAlt ? 'auto' : '8%', left: isAlt ? '8%' : 'auto',
            background: `radial-gradient(ellipse, ${card.accent}10, transparent 65%)`,
            filter: 'blur(22px)', pointerEvents: 'none',
            animation: 'sfc-float 15s ease-in-out 3s infinite'
          }} />
          {/* Digital blueprint grid — slow parallax */}
          <div style={{
            position: 'absolute', inset: '-44px', pointerEvents: 'none',
            backgroundImage: `linear-gradient(${card.accent}08 1px, transparent 1px), linear-gradient(90deg, ${card.accent}08 1px, transparent 1px)`,
            backgroundSize: '44px 44px',
            WebkitMaskImage: `radial-gradient(60% 75% at ${isAlt ? '32%' : '68%'} 40%, white, transparent)`,
            maskImage: `radial-gradient(60% 75% at ${isAlt ? '32%' : '68%'} 40%, white, transparent)`,
            animation: 'sfc-drift-xy 26s ease-in-out infinite reverse, sfc-breathe 30s ease-in-out infinite'
          }} />
          {/* Subtle digital fog — very slow drift */}
          <div style={{
            position: 'absolute', inset: '-12%', pointerEvents: 'none',
            background: `radial-gradient(48% 40% at 60% 55%, rgba(255,255,255,0.025) 0%, transparent 70%), radial-gradient(40% 36% at 30% 30%, ${card.accent}08 0%, transparent 70%)`,
            filter: 'blur(24px)',
            animation: 'sfc-drift-xy 32s ease-in-out infinite'
          }} />
          {/* Soft cyan glow — breathing */}
          <div style={{
            position: 'absolute', bottom: '10%', width: 260, height: 200,
            right: isAlt ? 'auto' : '34%', left: isAlt ? '34%' : 'auto',
            background: 'radial-gradient(ellipse, rgba(79,209,255,0.09), transparent 66%)',
            filter: 'blur(28px)', pointerEvents: 'none',
            animation: 'sfc-breathe 24s ease-in-out 4s infinite'
          }} />
          {/* AI network paths + slow moving nodes */}
          <svg style={{
            position: 'absolute',
            right: isAlt ? 'auto' : '4%', left: isAlt ? '4%' : 'auto',
            bottom: '20%', width: 340, height: 180, opacity: 0.32, pointerEvents: 'none',
            animation: 'sfc-float-soft 22s ease-in-out infinite'
          }}>
            <path d="M 20 140 L 90 140 L 90 70 L 180 70" fill="none" stroke={card.accent} strokeWidth="1.2" strokeDasharray="5 6" style={{ animation: 'sfc-dash 3.2s linear infinite' }} />
            <path d="M 180 70 L 250 70 L 250 120 L 320 120" fill="none" stroke={card.accent} strokeWidth="1.2" strokeDasharray="5 6" style={{ animation: 'sfc-dash 3.8s linear infinite' }} />
            <circle cx="20" cy="140" r="4" fill={`${card.accent}30`} stroke={card.accent} strokeWidth="1" />
            <circle cx="90" cy="70" r="3" fill={`${card.accent}25`} stroke={card.accent} strokeWidth="1" />
            <circle cx="180" cy="70" r="5" fill={`${card.accent}35`} stroke={card.accent} strokeWidth="1.2" />
            <circle cx="250" cy="120" r="3" fill={`${card.accent}25`} stroke={card.accent} strokeWidth="1" />
            <circle cx="320" cy="120" r="4" fill={`${card.accent}30`} stroke={card.accent} strokeWidth="1" />
          </svg>
          {/* Soft pulse around execution node */}
          <div style={{
            position: 'absolute', top: '13.5%', width: 54, height: 54, borderRadius: '50%',
            right: isAlt ? 'auto' : 'calc(6% + 22px)', left: isAlt ? 'calc(6% + 340px)' : 'auto',
            border: `1px solid ${card.accent}45`,
            pointerEvents: 'none', animation: 'sfc-pulse 5.5s ease-out infinite'
          }} />
          {/* Tiny glowing data dots */}
          {[
            { s: '24%', t: '36%', d: '0s', sz: 2 }, { s: '40%', t: '60%', d: '3s', sz: 2.5 }, { s: '12%', t: '46%', d: '6s', sz: 2 }
          ].map((p, i) => (
            <div key={`data-${i}`} style={{
              position: 'absolute', width: p.sz, height: p.sz, borderRadius: '50%',
              right: isAlt ? 'auto' : p.s, left: isAlt ? p.s : 'auto', top: p.t,
              background: card.accent, opacity: 0.35, boxShadow: `0 0 5px ${card.accent}80`,
              pointerEvents: 'none', animation: `sfc-float 11s ease-in-out ${p.d} infinite`
            }} />
          ))}
          {/* Soft light sweep across the panel */}
          <div style={{
            position: 'absolute', top: '-45%', left: 0, width: '26%', height: '190%',
            background: `linear-gradient(to right, transparent, ${card.accent}10 45%, rgba(255,255,255,0.04) 55%, transparent)`,
            pointerEvents: 'none', animation: 'monitor-sheen 14s ease-in-out 2s infinite'
          }} />
          {/* AI pipeline flow diagram */}
          <svg style={{
            position: 'absolute',
            right: isAlt ? 'auto' : '6%', left: isAlt ? '6%' : 'auto',
            top: '12%', width: 420, height: 90, opacity: 0.52, pointerEvents: 'none'
          }}>
            {[0, 1, 2, 3].map(i => (
              <rect key={i} x={10 + i * 110} y={28} width={64} height={30} rx={7}
                fill={`${card.accent}10`} stroke={`${card.accent}55`} strokeWidth="1.2" />
            ))}
            {[0, 1, 2].map(i => (
              <line key={i} x1={74 + i * 110} y1={43} x2={120 + i * 110} y2={43}
                stroke={card.accent} strokeWidth="1.4" strokeDasharray="4 4"
                style={{ animation: `sfc-dash ${1.2 + i * 0.4}s linear infinite` }} />
            ))}
            {/* Pipeline progress glow travelling */}
            <circle cx={0} cy={43} r={3.2} fill={card.accent} style={{ animation: 'sfc-flow 4.6s linear infinite', filter: `drop-shadow(0 0 5px ${card.accent})` }} />
            <text x={24} y={47} fontFamily="monospace" fontSize="8" fontWeight="800" fill={`${card.accent}CC`}>INPUT</text>
            <text x={134} y={47} fontFamily="monospace" fontSize="8" fontWeight="800" fill={`${card.accent}CC`}>PARSE</text>
            <text x={241} y={47} fontFamily="monospace" fontSize="8" fontWeight="800" fill={`${card.accent}CC`}>EDIT</text>
            <text x={348} y={47} fontFamily="monospace" fontSize="8" fontWeight="800" fill={`${card.accent}CC`}>RENDER</text>
          </svg>
          {/* Terminal window */}
          <div style={{
            position: 'absolute',
            right: isAlt ? 'auto' : '8%', left: isAlt ? '8%' : 'auto',
            top: '30%', width: '400px',
            border: `1px solid ${card.accent}25`, borderRadius: '14px', padding: '14px',
            background: 'rgba(3,10,7,0.55)', backdropFilter: 'blur(4px)',
            display: 'flex', flexDirection: 'column', gap: '10px',
            boxShadow: `0 14px 34px rgba(0,0,0,0.4), 0 0 22px ${card.accent}0D, inset 0 1px 0 rgba(255,255,255,0.05)`,
            opacity: 0.85, pointerEvents: 'none',
            animation: 'sfc-float-soft 12s ease-in-out infinite'
          }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <div style={{ width: '45px', height: '12px', background: `${card.accent}25`, borderRadius: '4px', animation: 'sfc-breathe 3.4s ease-in-out infinite' }} />
              <div style={{ width: '80px', height: '12px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px', animation: 'sfc-breathe 3.4s ease-in-out 1.7s infinite' }} />
            </div>
            <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.06)' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', fontFamily: 'monospace', fontSize: '9px', color: `${card.accent}BB` }}>
              <span>{`thundra_agent >> init_pipeline()`}</span>
              <span style={{ color: 'rgba(255,255,255,0.4)' }}>{`[INFO] loading workflow settings...`}</span>
              <span style={{ color: '#ffffff' }}>{`[SUCCESS] 6 layers structured`}</span>
              <span>
                {`thundra_agent >> compile_and_render()`}
                <span style={{ display: 'inline-block', width: 6, height: 10, marginLeft: 4, background: card.accent, verticalAlign: 'middle', animation: 'sfc-blink 1.1s steps(1) infinite' }} />
              </span>
            </div>
          </div>
          {/* Processing particles flowing along a rail */}
          <div style={{
            position: 'absolute', bottom: '16%', height: 1, width: 300,
            right: isAlt ? 'auto' : '10%', left: isAlt ? '10%' : 'auto',
            background: `linear-gradient(90deg, transparent, ${card.accent}30, transparent)`,
            pointerEvents: 'none'
          }}>
            {[0, 1, 2, 3].map(i => (
              <div key={i} style={{
                position: 'absolute', top: -2, left: 0, width: 5, height: 5, borderRadius: '50%',
                background: card.accent, boxShadow: `0 0 8px ${card.accent}90`,
                animation: `sfc-flow 5.5s linear ${i * 1.4}s infinite`
              }} />
            ))}
          </div>
          {/* Soft digital dust — deep layer */}
          {[
            { s: '14%', t: '24%', d: '0s', sz: 3 }, { s: '36%', t: '52%', d: '2.4s', sz: 2.5 },
            { s: '20%', t: '70%', d: '4.8s', sz: 3.5 }
          ].map((p, i) => (
            <div key={`dust-${i}`} style={{
              position: 'absolute', width: p.sz, height: p.sz, borderRadius: '50%',
              right: isAlt ? 'auto' : p.s, left: isAlt ? p.s : 'auto', top: p.t,
              background: card.accent, opacity: 0.28, boxShadow: `0 0 6px ${card.accent}60`,
              pointerEvents: 'none', animation: `sfc-float 10s ease-in-out ${p.d} infinite`
            }} />
          ))}
          {/* Terminal glow — breathing */}
          <div style={{
            position: 'absolute', bottom: '-8%', width: 320, height: 200,
            right: isAlt ? 'auto' : '20%', left: isAlt ? '20%' : 'auto',
            background: `radial-gradient(ellipse, ${card.accent}12, transparent 65%)`,
            filter: 'blur(30px)', pointerEvents: 'none',
            animation: 'sfc-breathe 8s ease-in-out infinite'
          }} />
          <div style={{
            position: 'absolute',
            right: isAlt ? 'auto' : '25%', left: isAlt ? '25%' : 'auto',
            bottom: '6%', fontFamily: 'monospace', fontSize: '110px', fontWeight: 'bold',
            color: `${card.accent}08`, pointerEvents: 'none', userSelect: 'none'
          }}>
            {"{ }"}
          </div>
          {/* OS vignette */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: `radial-gradient(90% 80% at ${isAlt ? '35%' : '65%'} 42%, transparent 52%, rgba(2,8,5,0.55) 100%)`
          }} />
        </>
      );

    default:
      return null;
  }
}

// ─── FEATURE CARD ─────────────────────────────────────────────────────────────
function FeatureCard({ card, index, scrollYProgress }) {
  const isFirst = index === 0;
  const isLast  = index === N - 1;
  const isAlt   = index % 2 === 1;

  const slideStartVh = isFirst ? 0 : index * SEGMENT_VH - SLIDE_VH;
  const slideEndVh   = isFirst ? 0 : index * SEGMENT_VH;
  const slideStart   = slideStartVh / TOTAL_SCROLL_VH;
  const slideEnd     = slideEndVh   / TOTAL_SCROLL_VH;
  const safeSlideEnd = Math.max(slideStart + 0.0001, slideEnd);

  const scaleStartVh = (index + 1) * SEGMENT_VH - SLIDE_VH;
  const scaleEndVh   = (index + 1) * SEGMENT_VH;
  const scaleStart   = Math.min(0.9999, scaleStartVh / TOTAL_SCROLL_VH);
  const scaleEnd     = Math.min(1.0,    scaleEndVh   / TOTAL_SCROLL_VH);
  const safeScaleEnd = Math.max(scaleStart + 0.0001, scaleEnd);

  const yNum    = useTransform(
    scrollYProgress,
    [slideStart, safeSlideEnd, scaleStart, safeScaleEnd],
    isFirst ? [0, 0, 0, -20] : [120, 0, 0, -20],
  );
  const yPct    = useTransform(yNum, v => `${v.toFixed(3)}%`);

  const scale = useTransform(
    scrollYProgress,
    [slideStart, safeSlideEnd, scaleStart, safeScaleEnd],
    isFirst ? [1.0, 1.0, 1.0, 0.98] : [0.97, 1.0, 1.0, 0.98]
  );

  // First card must be visible at rest (progress 0) — it sits in normal flow
  // right below the section intro. Others fade in as they slide up.
  const opacity = useTransform(
    scrollYProgress,
    [slideStart, safeSlideEnd, scaleStart, safeScaleEnd],
    isFirst ? [1.0, 1.0, 1.0, 0.0] : [0.0, 1.0, 1.0, 0.0]
  );
  const filter     = 'none';

  return (
    <motion.div
      className="stacked-card-frame"
      style={{
        position:       'absolute',
        left:           '5%',
        right:          '5%',
        top:            'calc((100% - min(74vh, 530px)) / 2)',
        height:         'min(74vh, 530px)',
        maxWidth:       '1120px',
        margin:         '0 auto',
        y:              yPct,
        scale:          isLast ? 1 : scale,
        opacity:        isLast ? 1 : opacity,
        filter:         'none',
        transformOrigin:'top center',
        zIndex:         index + 1,
        willChange:     'transform, opacity',
        pointerEvents:  'none',
      }}
    >
      {/* Inner Hover-Elevating Wrapper Container */}
      <motion.div
        whileHover={{
          scale: 1.008,
          y: -4,
          borderColor: card.accent,
          boxShadow: `0 30px 70px rgba(0,0,0,0.85), 0 0 24px ${card.accent}1E`
        }}
        transition={{ type: 'spring', stiffness: 180, damping: 24 }}
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 28,
          overflow: 'hidden',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'rgba(255, 255, 255, 0.12)',
          boxShadow: card.shadow,
          display: 'grid',
          gridTemplateColumns: card.gridCols || '1fr 1fr',
          height: '100%',
          cursor: 'pointer',
          pointerEvents: 'auto'
        }}
        className="stacked-card-shell group animate-[fadeIn_0.5s_ease-out]"
      >
        {/* Backgrounds & Ambient Lighting */}
        <div style={{position:'absolute',inset:0,background:card.bg}}/>
        <div style={{position:'absolute',inset:0,background:card.glow1,mixBlendMode:'screen',opacity:0.19}}/>
        <div style={{position:'absolute',inset:0,background:card.glow2,mixBlendMode:'screen',opacity:0.16}}/>
        <div style={{
          position: 'absolute',
          top: '10%',
          right: '15%',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${card.accent}0A 0%, transparent 70%)`,
          filter: 'blur(50px)',
          pointerEvents: 'none'
        }} />
        
        {/* Dynamic Card-Specific Background Atmospheres */}
        {renderCardPatterns(card, isAlt)}
        
        {/* Top Border Reflection Highlight */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15) 20%, rgba(255,255,255,0.15) 80%, transparent)'
        }} />
        
        {/* Fine Noise Overlay for Premium Film Grain Texture */}
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.012,
          pointerEvents: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }} />

        <div className="stacked-card-text-panel" style={{
          position:'relative',
          zIndex:10,
          display:'flex',
          flexDirection:'column',
          justifyContent:'center',
          padding:'30px 40px',
          gap:14,
          order: isAlt ? 2 : 1,
          textAlign: 'left'
        }}>
          <div style={{
            display:'inline-flex',
            alignItems:'center',
            gap:8,
            padding:'6px 14px',
            borderRadius:999,
            background:card.badge_bg,
            border:`1px solid ${card.badge_b}`,
            color:card.badge_c,
            fontSize:10,
            fontWeight:700,
            textTransform:'uppercase',
            letterSpacing:'.12em',
            width:'fit-content',
            backdropFilter: 'blur(10px)',
            boxShadow: `0 2px 8px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.1), 0 0 14px ${card.accent}14`
          }}>
            <span style={{fontSize:15}}>{card.emoji}</span>
            <span>{card.badge}</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <h2 style={{
              fontFamily:"'Sora', sans-serif",
              fontSize:'clamp(26px, 2.8vw, 40px)',
              fontWeight: 950,
              color: '#fff',
              lineHeight: 1.05,
              letterSpacing: '-.04em',
              whiteSpace: 'pre-line',
              margin: 0,
              textTransform: 'uppercase',
              background: `linear-gradient(135deg, #ffffff 70%, ${card.accent} 100%)`,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: 'none',
            }}>
              {card.headline}
            </h2>
            <p style={{
              fontSize: 14.5,
              color: '#f1f5f9',
              lineHeight: 1.55,
              maxWidth: 380,
              margin: 0,
              fontFamily: "'Sora', sans-serif",
              fontWeight: 400
            }}>
              {card.desc}
            </p>
          </div>

          <div style={{
            display: 'flex',
            gap: 6,
            flexWrap: 'wrap',
          }}>
            {card.insights.map((ins, idx) => (
              <div key={idx} style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '4px 10px',
                borderRadius: 8,
                background: `${card.accent}16`,
                border: `1px solid ${card.accent}38`,
                color: '#ffffff',
                fontSize: 10.5,
                fontWeight: 700,
                fontFamily: 'monospace',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 2px 6px rgba(0,0,0,0.3)'
              }}>
                <span style={{ color: card.accent }}>✓</span>
                <span>{ins}</span>
              </div>
            ))}
          </div>

          <ul style={{listStyle:'none',padding:0,margin:0,display:'flex',flexDirection:'column',gap:7}}>
            {card.bullets.map((b,i) => (
              <li key={i} style={{display:'flex',alignItems:'center',gap:9,fontSize:14,color:'#ffffff',fontWeight:500}}>
                <div style={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  border: `1.5px solid ${card.accent}60`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Check size={9} color={card.accent} strokeWidth={4} />
                </div>
                <span style={{fontFamily:"'Sora', sans-serif", fontWeight: 400}}>{b}</span>
              </li>
            ))}
          </ul>

          <button style={{
            display:'inline-flex',
            alignItems:'center',
            gap:8,
            fontSize:13,
            fontWeight:700,
            color:card.accent,
            background:'none',
            border:'none',
            cursor:'pointer',
            padding:0,
            transition: 'color 0.2s ease',
            width: 'fit-content',
            marginTop: 4
          }}>
            <span style={{ position: 'relative' }}>
              Learn more
              <span 
                className="scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left absolute -bottom-0.5 left-0 w-full h-[1.5px]" 
                style={{ background: card.accent }} 
              />
            </span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>

        <div className="stacked-card-mockup-panel" style={{
          position:'relative',
          display:'flex',
          alignItems:'center',
          justifyContent:'center',
          padding:'36px 44px',
          order: isAlt ? 1 : 2
        }}>
          <div style={{position:'absolute',inset:0,background:`radial-gradient(ellipse 65% 55% at 50% 50%,${card.accent}0C,transparent 75%)`}}/>
          <div style={{position:'relative',zIndex:10,width:'100%',maxWidth:440}}>
            {renderMockup(card.mockup, card.accent, card.accentSec)}
          </div>
        </div>

      </motion.div>
    </motion.div>
  );
}

function StackedFeatureCards({ navigate }) {
  // Sticky deck runs on ALL viewports — mobile/tablet adapt via .stacked-card-* CSS
  const isMobile = false;

  const scrollZoneRef = useRef(null);
  const { scrollY } = useScroll();
  const sectionTopMV = useMotionValue(9999999);

  useLayoutEffect(() => {
    const update = () => {
      if (scrollZoneRef.current) {
        let top = 0;
        let el = scrollZoneRef.current;
        while (el) { top += el.offsetTop; el = el.offsetParent; }
        sectionTopMV.set(top);
      }
    };
    update();
    // Layout above this section settles after mount (media/fonts) — track it,
    // otherwise sectionTop goes stale and the deck fades in far too late.
    window.addEventListener('resize', update);
    window.addEventListener('load', update);
    window.addEventListener('scroll', update, { passive: true });
    const t1 = setTimeout(update, 300);
    const t2 = setTimeout(update, 1200);
    const ro = new ResizeObserver(update);
    ro.observe(document.body);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('load', update);
      window.removeEventListener('scroll', update);
      clearTimeout(t1); clearTimeout(t2);
      ro.disconnect();
    };
  }, [sectionTopMV]);

  const scrollYProgress = useTransform(
    [scrollY, sectionTopMV],
    ([sy, st]) => {
      const vh            = window.innerHeight || 900;
      const totalScrollPx = (TOTAL_SCROLL_VH / 100) * vh;
      return Math.max(0, Math.min(1, (sy - st) / totalScrollPx));
    },
  );



  if (isMobile) {
    return (
      <section
        id="features"
        className="relative z-10 px-4 sm:px-6 py-10 border-t border-purpleTheme/10 max-w-5xl mx-auto w-full text-center space-y-8"
      >
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@500;700;900&display=swap" rel="stylesheet" />
        
        <div className="space-y-2">
          <span className="text-xs font-bold text-blueTheme uppercase tracking-widest block mb-2 font-heading">
            Powerful Capabilities
          </span>
          <h2 className="font-heading text-2xl md:text-4xl font-extrabold text-white">
            Features Built for Creators
          </h2>
          <p className="text-xs md:text-sm text-slate-400 max-w-md mx-auto leading-relaxed font-body">
            Eliminate hours of manual editing. Let AI orchestrate every layer.
          </p>
        </div>
        
        <div className="space-y-8 text-left max-w-md sm:max-w-xl mx-auto">
          {CARDS.map((card) => (
            <div 
              key={card.id} 
              className="rounded-3xl border border-white/[0.06] p-4 sm:p-6 md:p-8 flex flex-col gap-5 relative overflow-hidden before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent shadow-xl transition-all duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.01] hover:border-white/15 active:scale-[0.99] cursor-pointer hover:shadow-2xl"
              style={{ background: card.bg }}
            >
              {/* Content */}
              <div className="space-y-3.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold" style={{ color: card.badge_c, background: card.badge_bg, borderColor: card.badge_b, borderWidth: '1px' }}>
                  <span>{card.emoji}</span>
                  <span>{card.badge}</span>
                </span>
                
                <h3 className="font-heading text-lg sm:text-xl md:text-2xl font-black text-white leading-tight whitespace-pre-line">
                  {card.headline}
                </h3>
                
                <p className="text-[11.5px] sm:text-xs md:text-sm text-slate-450 leading-relaxed font-body font-medium">
                  {card.desc}
                </p>
                
                <ul className="space-y-2 pt-3 border-t border-white/[0.04] text-[11px] sm:text-xs text-slate-350">
                  {card.bullets.map((b, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-full border border-white/20 flex items-center justify-center shrink-0" style={{ borderColor: `${card.accent}60` }}>
                        <Check size={8} color={card.accent} strokeWidth={4} />
                      </div>
                      <span className="font-body font-medium">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Mockup Preview Wrapper */}
              <div className="w-full relative rounded-2xl border border-white/[0.06] bg-[#05050c]/85 p-3 sm:p-4 overflow-hidden min-h-[240px] flex flex-col justify-between shadow-inner">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:14px_14px] pointer-events-none" />
                
                {/* Insights header */}
                <div className="flex justify-between border-b border-white/[0.04] pb-2 text-[8px] font-mono text-slate-500 uppercase font-bold tracking-wider">
                  <span>ANALYSIS // MODE</span>
                  <span>STATUS</span>
                </div>
                
                {/* Embedded mockup */}
                <div className="flex-1 flex items-center justify-center py-4 relative overflow-hidden min-h-[140px]">
                  <div className="w-full h-full flex items-center justify-center mobile-mockup-wrapper" style={{ transformOrigin: 'center' }}>
                    {renderMockup(card.mockup, card.accent, card.accentSec)}
                  </div>
                </div>
                
                {/* Insights Footer */}
                <div className="grid grid-cols-3 gap-1.5 text-center text-[7px] sm:text-[7.5px] font-mono text-slate-450 pt-2 border-t border-white/[0.03]">
                  {card.insights.map((ins, i) => (
                    <div key={i} className="bg-white/[0.02] border border-white/[0.04] p-1 rounded-md font-bold">{ins}</div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      id="features"
      data-anim-section
      style={{ flex:'none', width:'100%', position:'relative', zIndex:10 }}
    >
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@500;700;900&display=swap" rel="stylesheet" />
      
      <div style={{ textAlign:'center', padding:'50px 24px 10px' }}>
        <span style={{ fontSize:11, fontWeight:700, color:'#4FD1FF', textTransform:'uppercase', letterSpacing:'.14em', fontFamily:"'Space Grotesk',sans-serif", display:'block', marginBottom:14 }}>
          Powerful Capabilities
        </span>
        <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'clamp(28px,4vw,52px)', fontWeight:900, color:'#fff', margin:'0 0 16px', letterSpacing:'-.025em' }}>
          Features Built for Creators
        </h2>
        <p style={{ fontSize:16, color:'rgba(148,163,184,.9)', maxWidth:440, margin:'0 auto', lineHeight:1.65 }}>
          Eliminate hours of manual editing. Let AI orchestrate every layer.
        </p>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginTop:32, color:'rgba(255,255,255,.22)' }}>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:3 }}>
            <div style={{ width:1, height:24, background:'linear-gradient(to bottom,transparent,rgba(255,255,255,.3))' }}/>
            <div style={{ width:5, height:5, borderRadius:'50%', background:'rgba(255,255,255,.38)' }}/>
          </div>
          <span style={{ fontFamily:'monospace', fontSize:9, letterSpacing:'.12em', textTransform:'uppercase' }}>Scroll to explore</span>
        </div>
      </div>

      <div
        ref={scrollZoneRef}
        className="sfc-zone"
        style={{ height:`${CONTAINER_VH}vh`, position: 'relative' }}
      >
        <div
          style={{
            position: 'sticky',
            top:      `${NAV}px`,
            height:   `calc(100vh - ${NAV}px)`,
            zIndex:   40,
            overflow: 'hidden',   /* clips cards at y=100% (below panel) */
            pointerEvents: 'none',
          }}
        >
          {/* Card deck: all cards absolutely stacked inside the fixed panel */}
          <div style={{ position:'relative', height:'100%', margin:'0 20px' }}>
            {CARDS.map((card, i) => (
              <FeatureCard
                key={card.id}
                card={card}
                index={i}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>
        </div>
      </div>

      <div style={{ height:20 }}/>
    </section>
  );
}

// Memoized: parent re-renders (e.g. video timeupdate state) must not reconcile this subtree.
export default React.memo(StackedFeatureCards);
