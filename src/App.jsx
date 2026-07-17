import React, { useEffect, lazy, Suspense } from 'react';
import Lenis from 'lenis';
import { motion, AnimatePresence } from 'framer-motion';
import { setLenis } from './lib/scroll';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import GlobalBackground from './components/GlobalBackground';

const Home = lazy(() => import('./pages/Home'));
const Editor = lazy(() => import('./pages/Editor'));
const SavedProjects = lazy(() => import('./pages/SavedProjects'));
const Processing = lazy(() => import('./pages/Processing'));
const HowItWorks = lazy(() => import('./pages/HowItWorks'));
const Assistant = lazy(() => import('./pages/Assistant'));

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

// Centralized SEO Configuration for Thundra AI
const SEO_CONFIG = {
  '/': {
    title: "Thundra AI - Pakistan's First AI Video Editing Agent ⚡",
    description: "Upload raw footage, write text prompts, and get a professionally edited video with automatic cuts, B-rolls, lofi soundtracks, and stylized captions."
  },
  '/how-it-works': {
    title: "How It Works | Thundra AI - Automatic Video Editing",
    description: "Learn how Thundra AI uses transcription, silent cut detection, visual pacing models, and LUT grading to turn raw video into high-quality social reels."
  },
  '/editor': {
    title: "Preview Studio | Thundra AI Video Editor",
    description: "Refine subtitle styles, choose visual aesthetics, select audio styles (Synthwave, Lofi, Cinematic), and edit your video in real-time."
  },
  '/processing': {
    title: "AI Editor Working... | Thundra AI Rendering",
    description: "Thundra AI is currently analyzing visual pacing, extracting captions, matching soundtrack beats, and rendering your high-fidelity output."
  },
  '/projects': {
    title: "Saved Projects | Thundra AI Workspace",
    description: "Access and review your previously rendered video projects, download finalized MP4s, or continue editing in the Thundra AI studio."
  },
  '/assistant': {
    title: "AI Video Editing Assistant Chatbot | Thundra AI Help",
    description: "Chat with the Thundra AI assistant for helpful tips, lego-style timeline explanations, computer lag solutions, and video styling guides."
  }
};

function SEOManager() {
  const location = useLocation();

  useEffect(() => {
    const route = SEO_CONFIG[location.pathname] || SEO_CONFIG['/'];
    
    // Update document title
    document.title = route.title;
    
    // Update description meta tag
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = route.description;

    // Update keywords meta tag
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.name = 'keywords';
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.content = "AI video editor, video editing agent, automated captions, silence cuts, beat syncing, Pakistan AI video, TikTok reel editor, Thundra AI";

    // Update Open Graph meta tags (for Facebook, LinkedIn, Twitter/X cards)
    const ogTags = {
      'og:title': route.title,
      'og:description': route.description,
      'og:type': 'website',
      'og:url': window.location.href,
      'og:site_name': 'Thundra AI'
    };

    Object.entries(ogTags).forEach(([property, value]) => {
      let ogMeta = document.querySelector(`meta[property="${property}"]`);
      if (!ogMeta) {
        ogMeta = document.createElement('meta');
        ogMeta.setAttribute('property', property);
        document.head.appendChild(ogMeta);
      }
      ogMeta.content = value;
    });

    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = window.location.href;

  }, [location.pathname]);

  return null;
}

function AnimatedPage({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}

function AppContent() {
  const location = useLocation();

  return (
    <div className="relative min-h-screen bg-[#070B12] text-[#F8F8FF] overflow-x-clip font-body">
      <GlobalBackground />
      <AnimatePresence mode="wait">
        <Suspense fallback={null}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<AnimatedPage><Home /></AnimatedPage>} />
            <Route path="/how-it-works" element={<AnimatedPage><HowItWorks /></AnimatedPage>} />
            <Route path="/processing" element={<AnimatedPage><Processing /></AnimatedPage>} />
            <Route path="/editor" element={<AnimatedPage><Editor /></AnimatedPage>} />
            <Route path="/projects" element={<AnimatedPage><SavedProjects /></AnimatedPage>} />
            <Route path="/assistant" element={<AnimatedPage><Assistant /></AnimatedPage>} />
          </Routes>
        </Suspense>
      </AnimatePresence>
    </div>
  );
}

function App() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
      smoothWheel: true,
      smoothTouch: false,
      wheelMultiplier: 0.65, // natural, premium control
      touchMultiplier: 1.0,
    });

    setLenis(lenis);

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      setLenis(null);
      lenis.destroy();
    };
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <SEOManager />
      <AppContent />
    </Router>
  );
}

// Trigger HMR update to resolve newly created files
export default App;
