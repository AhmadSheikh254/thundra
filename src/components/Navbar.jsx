import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Database, ArrowRight, Menu, X, Sparkles } from 'lucide-react';
import ThundraLogo from './ThundraLogo';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
            href="/#features" 
            onClick={() => setMobileMenuOpen(false)}
            className="px-4 py-2 text-xs font-bold rounded-full text-slate-455 hover:text-white transition-all duration-300 relative group"
          >
            <span>Features</span>
            <span className="absolute inset-0 rounded-full scale-75 opacity-0 bg-white/[0.04] group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 -z-10" />
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
            className="relative group overflow-hidden bg-gradient-to-r from-purpleTheme to-blueTheme px-5 py-2 text-[10px] font-extrabold uppercase tracking-widest rounded-full shadow-md shadow-black/35 hover:shadow-[0_4px_12px_rgba(79,209,255,0.12)] hover:scale-[1.03] transition-all duration-300 text-white flex items-center gap-1.5 border border-purpleLight/20"
          >
            <span>Workspace</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-300" />
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
            <span className={`w-3.5 h-[1.5px] bg-current absolute transition-all duration-200 ${mobileMenuOpen ? 'opacity-0 scale-x-0' : ''}`} />
            <span className={`w-3.5 h-[1.5px] bg-current absolute transition-all duration-300 ${mobileMenuOpen ? '-rotate-45' : 'translate-y-1'}`} />
          </div>
        </button>

        {/* Mobile Capsule Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -8 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
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
                href="/#features" 
                onClick={() => setMobileMenuOpen(false)}
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
                className="w-full text-center bg-gradient-to-r from-purpleTheme to-blueTheme py-3 text-xs font-bold uppercase tracking-wider rounded-xl text-white border border-[#F5EFE6]/20 shadow-md"
              >
                Workspace
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
