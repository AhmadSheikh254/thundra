import React, { useEffect, useRef } from 'react';

/* ─── Background Atmospheric Film Strip ──────────────────────────────────────── */
// Low-opacity, absolute-position film strip purely for cinematic page atmosphere.
// Placed behind all content with a drift animation — never interferes with UI.
function BgFilmStrip({ top, left, right, bottom, rotate = 0, opacity = 0.15, blur = 0.5, reversed = false, height = 80, animDuration = 50 }) {
  const W = 3200, H = 400;
  const STRIP_HEIGHT = height;
  const AMP = 85; // long sweeping wave amplitude
  const PER = 3000; // long cinematic period
  const MID = H / 2;
  const STEPS = 120; // number of segments for ribbon path

  // Wave function
  const wave = t => AMP * Math.sin(((reversed ? -t : t) / PER) * Math.PI * 2);

  // Sampling points along the wave
  const tArr = Array.from({ length: STEPS + 1 }, (_, i) => (i / STEPS) * W);
  
  // Point generator
  const pt = (t, n) => `${t.toFixed(1)},${(MID + wave(t) + n).toFixed(1)}`;

  // Ribbon path: top edge sweep -> bottom edge sweep back -> close
  const ribbonD = [
    `M ${pt(tArr[0], -STRIP_HEIGHT / 2)}`,
    ...tArr.slice(1).map(t => `L ${pt(t, -STRIP_HEIGHT / 2)}`),
    ...[...tArr].reverse().map(t => `L ${pt(t, STRIP_HEIGHT / 2)}`),
    'Z',
  ].join(' ');

  // Inner boundaries of the top and bottom rails
  const innerRailTopD = tArr.map((t, i) => `${i === 0 ? 'M' : 'L'} ${pt(t, -STRIP_HEIGHT * 0.35)}`).join(' ');
  const innerRailBottomD = tArr.map((t, i) => `${i === 0 ? 'M' : 'L'} ${pt(t, STRIP_HEIGHT * 0.35)}`).join(' ');

  // Generate sprocket holes and frame lines
  const sprocketHoles = [];
  const frameLines = [];

  const pw = 3.6;  // sprocket hole width (vertical orientation)
  const ph = 5.5;  // sprocket hole height (vertical orientation)
  const rx = 0.8;  // sprocket hole corner radius
  const sprocketInterval = 28; // tight, realistic interval
  const frameInterval = 190; // widescreen frame proportions

  // Slope / derivative calculation to rotate elements to match curve direction
  const getAngle = x => {
    const freq = ((reversed ? -1 : 1) / PER) * Math.PI * 2;
    const dy_dx = AMP * freq * Math.cos(((reversed ? -x : x) / PER) * Math.PI * 2);
    return (Math.atan(dy_dx) * 180) / Math.PI;
  };

  // Generate sprocket holes along the strip
  for (let x = 30; x <= W - 30; x += sprocketInterval) {
    const y = MID + wave(x);
    const angle = getAngle(x);
    
    // Top sprocket hole
    sprocketHoles.push({
      x,
      y: y - STRIP_HEIGHT / 2 + 7,
      angle
    });
    
    // Bottom sprocket hole
    sprocketHoles.push({
      x,
      y: y + STRIP_HEIGHT / 2 - 7,
      angle
    });
  }

  // Generate vertical frame separator lines
  for (let x = frameInterval / 2; x <= W - 30; x += frameInterval) {
    const y = MID + wave(x);
    const angle = getAngle(x);
    frameLines.push({ x, y, angle });
  }

  const uid = `bg-${rotate}-${reversed}-${top || bottom}-${left || right}-${height}`.replace(/%/g, '');

  return (
    <div style={{
      position: 'absolute', pointerEvents: 'none', zIndex: 2,
      opacity, filter: blur > 0 ? `blur(${blur}px)` : undefined,
      top, left, right, bottom,
      width: W, height: H,
      transform: `rotate(${rotate}deg)`,
      transformOrigin: '50% 50%',
      overflow: 'visible',
      willChange: 'transform',
    }}>
      <div 
        className={reversed ? "animate-film-slide-reverse" : "animate-film-slide"}
        style={{
          width: '100%',
          height: '100%',
          '--duration': `${animDuration}s`,
        }}
      >
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
          <defs>
            {/* Film stock styling: dark translucent rails, lighter translucent frame cells */}
            <linearGradient id={`bgr-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
              {/* Top rail: dark translucent */}
              <stop offset="0%" stopColor="#080D18" stopOpacity="0.75" />
              <stop offset="15%" stopColor="#080D18" stopOpacity="0.75" />
              
              {/* Middle frame cells: very light dark translucent for transparency */}
              <stop offset="15.01%" stopColor="#080D18" stopOpacity="0.25" />
              <stop offset="84.99%" stopColor="#080D18" stopOpacity="0.25" />
              
              {/* Bottom rail: dark translucent */}
              <stop offset="85%" stopColor="#080D18" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#080D18" stopOpacity="0.75" />
            </linearGradient>
            <filter id={`shadow-${uid}`} x="-10%" y="-10%" width="120%" height="120%">
              {/* Dark backing shadow for separation */}
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.35" />
            </filter>
          </defs>

          {/* Group wrapping all elements to apply the shadow filter */}
          <g filter={`url(#shadow-${uid})`}>
            {/* Main film strip body */}
            <path d={ribbonD} fill={`url(#bgr-${uid})`} />

            {/* Outer borders (top/bottom edges of the film strip) */}
            <path d={ribbonD} fill="none" stroke="rgba(79, 209, 255, 0.4)" strokeWidth="0.8" />

            {/* Inner rail lines */}
            <path d={innerRailTopD} fill="none" stroke="rgba(111, 168, 255, 0.3)" strokeWidth="0.6" />
            <path d={innerRailBottomD} fill="none" stroke="rgba(111, 168, 255, 0.3)" strokeWidth="0.6" />

            {/* Vertical frame separation lines - light separators dividing the frames */}
            {frameLines.map((fl, i) => (
              <line
                key={i}
                x1={0}
                y1={-STRIP_HEIGHT / 2}
                x2={0}
                y2={STRIP_HEIGHT / 2}
                stroke="rgba(111, 168, 255, 0.3)"
                strokeWidth="0.8"
                transform={`translate(${fl.x}, ${fl.y}) rotate(${fl.angle})`}
              />
            ))}

            {/* Sprocket holes - hollow vertical rectangles with thin light outline */}
            {sprocketHoles.map((sh, i) => (
              <rect
                key={i}
                x={-pw / 2}
                y={-ph / 2}
                width={pw}
                height={ph}
                rx={rx}
                fill="none"
                stroke="rgba(79, 209, 255, 0.4)"
                strokeWidth="0.8"
                transform={`translate(${sh.x}, ${sh.y}) rotate(${sh.angle})`}
              />
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
}

export default function GlobalBackground() {
  // Parallax via direct DOM write — no per-frame React re-renders of the SVG tree
  const parallaxRef = useRef(null);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (parallaxRef.current) {
            // 8% velocity parallax, compositor-only transform
            parallaxRef.current.style.transform = `translate3d(0, ${-(window.scrollY * 0.08)}px, 0)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
      <style>{`
        @keyframes film-slide-x-slow {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(-200px, 0, 0);
          }
        }
        @keyframes film-slide-x-slow-reverse {
          0%, 100% {
            transform: translate3d(-200px, 0, 0);
          }
          50% {
            transform: translate3d(0, 0, 0);
          }
        }
        .animate-film-slide {
          animation: film-slide-x-slow var(--duration, 50s) ease-in-out infinite;
        }
        .animate-film-slide-reverse {
          animation: film-slide-x-slow-reverse var(--duration, 50s) ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-film-slide,
          .animate-film-slide-reverse,
          .animate-drift-slow,
          .animate-drift-slower {
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>
      
      {/* ── Layer 0: Base fixed background gradient ── */}
      <div 
        className="fixed inset-0 z-0 bg-darkBg"
        style={{ 
          background: 'radial-gradient(ellipse 120% 80% at 50% -10%, #0c1220 0%, #070B12 55%, #070B12 100%)',
          pointerEvents: 'none'
        }} 
      />

      {/* ── Layer 1: Ambient soft radial glow orbs (fixed) ── */}
      {/* Primary: Top-left Smoky Blue orb */}
      <div 
        className="fixed top-[-15%] left-[-10%] w-[750px] h-[750px] rounded-full pointer-events-none z-[1] animate-drift-slow"
        style={{ 
          background: 'radial-gradient(circle, rgba(61,90,128,0.0035) 0%, rgba(61,90,128,0.001) 45%, transparent 70%)',
          pointerEvents: 'none'
        }} 
      />
      {/* Secondary: Bottom-right Soft Cyan orb */}
      <div 
        className="fixed bottom-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full pointer-events-none z-[1] animate-drift-slower"
        style={{ 
          background: 'radial-gradient(circle, rgba(79,209,255,0.002) 0%, rgba(79,209,255,0.0005) 50%, transparent 70%)',
          pointerEvents: 'none'
        }} 
      />
      {/* Accent: Mid-right Copper Gold aurora */}
      <div 
        className="fixed top-[35%] right-[5%] w-[450px] h-[450px] rounded-full pointer-events-none z-[1] animate-drift-slow"
        style={{ 
          background: 'radial-gradient(circle, rgba(212,165,116,0.001) 0%, transparent 65%)',
          animationDelay: '8s',
          pointerEvents: 'none'
        }} 
      />
      {/* Accent: Lower-left Warm Ivory reflection */}
      <div 
        className="fixed bottom-[15%] left-[8%] w-[400px] h-[400px] rounded-full pointer-events-none z-[1] animate-drift-slower"
        style={{ 
          background: 'radial-gradient(circle, rgba(245,239,230,0.001) 0%, transparent 65%)',
          animationDelay: '4s',
          pointerEvents: 'none'
        }} 
      />

      {/* ── Layer 2: Parallaxing Film Strips ── */}
      <div
        ref={parallaxRef}
        className="absolute inset-x-0 top-0 h-[220vh] pointer-events-none z-[2]"
        style={{
          transform: 'translate3d(0, 0, 0)',
          willChange: 'transform'
        }}
      >
        {/* Layer 1: Top, pushed slightly higher. Behind navbar. Opacity 22% (faded), blur 3.0px, height 76px */}
        <BgFilmStrip 
          top="-140px" 
          left="-400px" 
          rotate={-4}
          opacity={0.3}
          blur={3.0} 
          height={76} 
          reversed={false} 
          animDuration={55} 
        />
        
        {/* Layer 2: Center, runs diagonally behind headline and mockup. Opacity 28% (sharpest), blur 0px, height 98px */}
        <BgFilmStrip 
          top="250px" 
          left="-500px" 
          rotate={6}
          opacity={0.36}
          blur={0} 
          height={98} 
          reversed={true} 
          animDuration={52} 
        />
        
        {/* Layer 3: Bottom, behind mockup, pushed bottom-right. Opacity 20% (faded), blur 1.2px, height 68px */}
        <BgFilmStrip 
          top="640px" 
          left="-240px" 
          rotate={-8}
          opacity={0.27}
          blur={1.2} 
          height={68} 
          reversed={false} 
          animDuration={60} 
        />
      </div>
    </div>
  );
}
