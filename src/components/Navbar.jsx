import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Database, ArrowRight, Menu, X, Sparkles } from 'lucide-react';
import ThundraLogo from './ThundraLogo';
import { scrollToSection } from '../lib/scroll';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [featuresActive, setFeaturesActive] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Highlight "Features" while the comparison section is on screen.
  // IntersectionObserver instead of a scroll handler: zero main-thread work per frame.
  useEffect(() => {
    if (location.pathname !== '/') { setFeaturesActive(false); return; }
    const el = document.getElementById('comparison');
    if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(
      ([entry]) => setFeaturesActive(entry.isIntersecting),
      { rootMargin: '-45% 0px -45% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [location.pathname]);

  // Smooth, navbar-offset anchor scroll routed through Lenis (no fighting = no jump).
  const handleAnchorScroll = (id, e) => {
    setMobileMenuOpen(false);
    if (location.pathname !== '/') return; // let the browser navigate home + hash
    e.preventDefault();
    if (scrollToSection(id) && window.history?.pushState) {
      window.history.pushState(null, '', `/#${id}`);
    }
  };

  // Body scroll lock when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const handleLogoClick = (e) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
      setTimeout(() => {
        navigate('/');
      }, 50);
    }
  };

  const handleNavigation = (path, e) => {
    setMobileMenuOpen(false);
    if (location.pathname === path) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isLinkActive = (path) => location.pathname === path;

  const prefersReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl transition-all duration-300">
      {/* Floating Capsule Body */}
      <div className={`w-full flex items-center justify-between px-5 py-2 md:py-2.5 rounded-full border transition-all duration-300 relative ${
        isScrolled 
          ? 'bg-[#101826]/85 backdrop-blur-xl border-[#3D5A80]/25 shadow-[0_12px_40px_rgba(0,0,0,0.55),_0_0_8px_rgba(61,90,128,0.03)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]' 
          : 'bg-[#070B12]/45 backdrop-blur-md border-white/[0.04]'
      }`}>
        
        {/* Ambient Top Glow Line on scroll */}
        {isScrolled && (
          <div className="absolute top-0 left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-transparent via-[#F5EFE6]/30 to-[#4FD1FF]/30 blur-[0.2px]" />
        )}

        {/* Logo and Brand */}
        <a 
          href="/" 
          onClick={handleLogoClick}
          className="flex items-center gap-1.5 font-brand text-lg md:text-xl font-black tracking-[0.03em] text-white shrink-0 group select-none"
        >
          <ThundraLogo className="w-10 h-10 group-hover:rotate-3 transition-transform duration-300" />
          <span className="bg-gradient-to-r from-white via-slate-150 to-purpleLight bg-clip-text text-transparent">Thundra AI</span>
        </a>

        {/* Navigation Links for Desktop */}
        <div className="hidden md:flex items-center gap-2">
          <Link 
            to="/assistant" 
            onClick={(e) => handleNavigation('/assistant', e)}
            className={`px-4 py-2 text-xs font-bold rounded-full transition-all duration-300 flex items-center gap-1.5 relative group ${
              isLinkActive('/assistant') 
                ? 'text-white bg-white/[0.04] border border-white/[0.05]' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 transition-transform duration-300 group-hover:scale-110 ${
              isLinkActive('/assistant') ? 'text-blueTheme animate-pulse' : 'text-slate-500'
            }`} />
            <span>AI Assistant</span>
            {!isLinkActive('/assistant') && (
              <span className="absolute inset-0 rounded-full scale-75 opacity-0 bg-white/[0.04] group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 -z-10" />
            )}
          </Link>

          <Link 
            to="/projects" 
            onClick={(e) => handleNavigation('/projects', e)}
            className={`px-4 py-2 text-xs font-bold rounded-full transition-all duration-300 flex items-center gap-1.5 relative group ${
              isLinkActive('/projects') 
                ? 'text-white bg-white/[0.04] border border-white/[0.05]' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Database className={`w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-6 ${
              isLinkActive('/projects') ? 'text-blueTheme' : 'text-slate-550'
            }`} />
            <span>Projects</span>
            {!isLinkActive('/projects') && (
              <span className="absolute inset-0 rounded-full scale-75 opacity-0 bg-white/[0.04] group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 -z-10" />
            )}
          </Link>

          <Link 
            to="/how-it-works" 
            onClick={(e) => handleNavigation('/how-it-works', e)}
            className={`px-4 py-2 text-xs font-bold rounded-full transition-all duration-300 relative group ${
              isLinkActive('/how-it-works') 
                ? 'text-white bg-white/[0.04] border border-white/[0.05]' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>How It Works</span>
            {!isLinkActive('/how-it-works') && (
              <span className="absolute inset-0 rounded-full scale-75 opacity-0 bg-white/[0.04] group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 -z-10" />
            )}
          </Link>

          <a
            href="/#comparison"
            onClick={(e) => handleAnchorScroll('comparison', e)}
            className={`px-4 py-2 text-xs font-bold rounded-full transition-all duration-300 relative group ${
              featuresActive
                ? 'text-white bg-white/[0.04] border border-white/[0.05]'
                : 'text-slate-455 hover:text-white'
            }`}
          >
            <span>Features</span>
            {!featuresActive && (
              <span className="absolute inset-0 rounded-full scale-75 opacity-0 bg-white/[0.04] group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 -z-10" />
            )}
          </a>

          <a 
            href="/#pricing" 
            onClick={() => setMobileMenuOpen(false)}
            className="px-4 py-2 text-xs font-bold rounded-full text-slate-455 hover:text-white transition-all duration-300 relative group"
          >
            <span>Pricing</span>
            <span className="absolute inset-0 rounded-full scale-75 opacity-0 bg-white/[0.04] group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 -z-10" />
          </a>
        </div>

        {/* CTA Workspace Button */}
        <div className="hidden md:block">
          <Link
            to="/projects"
            onClick={(e) => handleNavigation('/projects', e)}
            className="group relative h-[38px] px-4.5 rounded-xl overflow-hidden border-2 border-[#3D6FA6] bg-slate-900 text-white text-[10px] font-bold uppercase tracking-[0.02em] flex items-center gap-1.5 transform transition-all duration-500 hover:scale-105 hover:border-[#6DD6FF] hover:text-[#BDE9FF] active:scale-[0.98] before:absolute before:w-6 before:h-6 before:content-[''] before:right-1.5 before:top-1 before:z-10 before:bg-[#4A6CF7] before:rounded-full before:blur-lg before:opacity-70 before:transition-all before:duration-500 after:absolute after:z-10 after:w-10 after:h-10 after:content-[''] after:bg-[#57C7FF] after:right-4 after:top-2 after:rounded-full after:blur-lg after:opacity-70 after:transition-all after:duration-500 hover:before:right-7 hover:before:-bottom-2 hover:before:blur hover:after:-right-4 hover:after:scale-110"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <span className="relative z-20">Workspace</span>
            <ArrowRight className="relative z-20 w-3 h-3 group-hover:translate-x-1 transition-transform duration-500" />
          </Link>
        </div>

        {/* Mobile Hamburger toggle */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-full bg-slate-900/60 border border-slate-800 text-slate-450 hover:text-white transition-colors relative"
          aria-label="Toggle Menu"
        >
          <div className="w-4 h-4 relative flex flex-col justify-center items-center">
            <span className={`w-3.5 h-[1.5px] bg-current absolute transition-all duration-300 ${mobileMenuOpen ? 'rotate-45' : '-translate-y-1'}`} />
            <span className={`w-3.5 h-[1.5px] bg-current transition-all duration-200 ${mobileMenuOpen ? 'opacity-0 scale-x-0' : ''}`} />
            <span className={`w-3.5 h-[1.5px] bg-current absolute transition-all duration-300 ${mobileMenuOpen ? '-rotate-45' : 'translate-y-1'}`} />
          </div>
        </button>

        {/* Mobile Capsule Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: -8 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: -8 }}
              transition={prefersReducedMotion ? { duration: 0.1 } : { duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-[calc(100%+8px)] left-0 right-0 bg-[#101826]/95 border border-[#3D5A80]/20 rounded-3xl p-5 flex flex-col gap-3.5 z-50 backdrop-blur-xl shadow-2xl"
            >
              <Link 
                to="/assistant" 
                onClick={(e) => handleNavigation('/assistant', e)}
                className={`flex items-center gap-2 p-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isLinkActive('/assistant') ? 'text-white bg-white/[0.04]' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Sparkles className="w-4 h-4 text-blueTheme animate-pulse" />
                <span>AI Assistant</span>
              </Link>

              <Link 
                to="/projects" 
                onClick={(e) => handleNavigation('/projects', e)}
                className={`flex items-center gap-2 p-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isLinkActive('/projects') ? 'text-white bg-white/[0.04]' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Database className="w-4 h-4 text-[#F5EFE6]" />
                <span>Projects</span>
              </Link>
              
              <Link 
                to="/how-it-works" 
                onClick={(e) => handleNavigation('/how-it-works', e)}
                className={`p-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isLinkActive('/how-it-works') ? 'text-white bg-white/[0.04]' : 'text-slate-300 hover:text-white'
                }`}
              >
                <span>How It Works</span>
              </Link>

              <a
                href="/#comparison"
                onClick={(e) => handleAnchorScroll('comparison', e)}
                className="p-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white transition-colors"
              >
                Features
              </a>

              <a 
                href="/#pricing" 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white transition-colors"
              >
                Pricing
              </a>

              <Link 
                to="/projects"
                onClick={(e) => handleNavigation('/projects', e)}
                className="relative w-full overflow-hidden text-center py-3 text-xs font-bold uppercase tracking-[0.02em] rounded-xl text-white border-2 border-[#57C7FF]/30 bg-[#0A1322]/90 backdrop-blur-md shadow-[0_8px_28px_rgba(87,199,255,0.12),inset_0_1px_0_rgba(255,255,255,0.1)] before:absolute before:content-[''] before:w-6 before:h-6 before:right-2 before:top-1.5 before:bg-[#4A6CF7] before:rounded-full before:blur-lg before:opacity-40 after:absolute after:content-[''] after:w-9 after:h-9 after:right-5 after:top-2 after:bg-[#57C7FF] after:rounded-full after:blur-lg after:opacity-40"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                <span className="relative z-10">Workspace</span>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

// Memoized: parent re-renders (e.g. video timeupdate state) must not reconcile this subtree.
export default React.memo(Navbar);
