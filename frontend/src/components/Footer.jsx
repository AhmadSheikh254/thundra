import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Send, MapPin, Clock, ArrowRight, Check } from 'lucide-react';
import ThundraLogo from './ThundraLogo';

export default function Footer() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="relative z-10 bg-[#070B12] pt-20 pb-8 px-6 md:px-[6%] border-t border-[#3D5A80]/15 shrink-0 overflow-hidden">
      {/* Background Decorative Mesh Lights */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-80 h-80 bg-[#3D5A80]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 translate-x-1/2 w-96 h-96 bg-blueTheme/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-white/[0.04]">
        
        {/* Column 1: Info and Subscription */}
        <div className="space-y-6 lg:col-span-1">
          <Link 
            to="/" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 font-brand text-xl font-bold text-white tracking-[0.02em] group w-max"
          >
            <ThundraLogo className="w-9 h-9 group-hover:rotate-3 transition-transform duration-300" />
            <span className="bg-gradient-to-r from-white via-slate-100 to-purpleLight bg-clip-text text-transparent">Thundra AI</span>
          </Link>
          <p className="text-xs text-slate-400 leading-relaxed font-body">
            Synthesize full-length social video plans from a single prompt. Match stock B-rolls, generate Urdu/English captions, mix background scores, and color grade in 60 seconds.
          </p>

          {/* Stay Updated Email Form */}
          <div className="space-y-3 pt-2">
            <h5 className="text-[11px] font-bold text-slate-350 uppercase tracking-widest">Stay Updated</h5>
            <form onSubmit={handleSubscribe} className="relative max-w-sm flex items-center">
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#101826]/70 border border-white/[0.06] text-xs px-4 py-2.5 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blueTheme/45 focus:ring-1 focus:ring-blueTheme/20 transition-all pr-10"
              />
              <button 
                type="submit"
                className="absolute right-1.5 p-1.5 rounded-lg bg-gradient-to-r from-purpleTheme to-blueTheme text-white hover:scale-[1.05] transition-all cursor-pointer shadow-md shadow-purpleTheme/15"
              >
                {subscribed ? <Check className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
              </button>
            </form>
            {subscribed && (
              <p className="text-[10px] text-[#F5EFE6] animate-pulse font-medium">
                ✓ Subscription active. Welcome to Thundra AI!
              </p>
            )}
          </div>
        </div>

        {/* Column 2: Capabilities */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">
            Capabilities
          </h4>
          <ul className="space-y-3 text-xs text-slate-400 font-body">
            {[
              'AI Prompt Scripting',
              'Semantic B-Roll matching',
              'Automated Subtitle generation',
              'Waveform Beat syncing',
              'Advanced Color LUT grading'
            ].map((item) => (
              <li 
                key={item} 
                className="hover:text-white transition-colors cursor-pointer flex items-center gap-2.5 group"
                onClick={() => navigate('/how-it-works')}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#3D5A80] group-hover:scale-125 transition-transform" />
                <span className="group-hover:translate-x-0.5 transition-transform">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Resources */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">
            Resources
          </h4>
          <ul className="space-y-3 text-xs text-slate-400 font-body">
            {[
              { label: 'System Documentation', path: '/how-it-works' },
              { label: 'Saved Projects Logs', path: '/projects' },
              { label: 'API References', path: '/how-it-works' },
              { label: 'Orchestration Status', path: '/' },
              { label: 'Community Creators', path: '/' }
            ].map((item, idx) => (
              <li key={idx}>
                {item.path.startsWith('/') && !item.path.includes('#') ? (
                  <Link 
                    to={item.path} 
                    className="hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-3 h-3 text-blueTheme/80 group-hover:translate-x-0.5 transition-transform" />
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <a 
                    href={item.path} 
                    className="hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-3 h-3 text-blueTheme/80 group-hover:translate-x-0.5 transition-transform" />
                    <span>{item.label}</span>
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Pakistan Node Info */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">
            Pakistan Node
          </h4>
          <div className="space-y-3 text-xs text-slate-400 leading-relaxed font-body">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#F5EFE6] shrink-0 mt-0.5" />
              <span>Central HQ Office, Karachi, Pakistan</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-blueTheme shrink-0" />
              <a href="mailto:support@thundra.ai" className="hover:text-white transition-colors">support@thundra.ai</a>
            </div>
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-[#F5EFE6] shrink-0" />
              <span>Active hours: 9:00 AM - 6:00 PM PKT</span>
            </div>
            
            {/* Operational status badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider text-green-400 bg-green-500/10 border border-green-500/20 uppercase mt-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
              </span>
              All Systems Operational
            </div>
          </div>
        </div>
      </div>

      {/* Footer bottom */}
      <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-slate-500 font-mono">
        <div className="flex items-center gap-4">
          <span>© {new Date().getFullYear()} Thundra AI Inc. All rights reserved.</span>
          {/* Social Links inside footer bottom */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-white/[0.08]">
            {[
              { 
                icon: (
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                ), 
                link: 'https://twitter.com/thundra_ai' 
              },
              { 
                icon: (
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                    <path d="M9 18c-4.51 2-5-2-7-2" />
                  </svg>
                ), 
                link: 'https://github.com/thundra' 
              },
              { 
                icon: (
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
                    <polygon points="10 15 15 12 10 9" />
                  </svg>
                ), 
                link: 'https://youtube.com' 
              },
              { 
                icon: (
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                ), 
                link: 'https://discord.gg' 
              },
            ].map((soc, index) => (
              <a 
                key={index} 
                href={soc.link}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-[#4FD1FF]/45 hover:bg-slate-900/80 transition-all duration-300"
              >
                {soc.icon}
              </a>
            ))}
          </div>
        </div>
        <div className="flex gap-4">
          <a href="#terms" className="hover:text-slate-350 transition-colors">Terms of Service</a>
          <a href="#privacy" className="hover:text-slate-350 transition-colors">Privacy Policy</a>
          <a href="#cookies" className="hover:text-slate-350 transition-colors">Cookies Settings</a>
        </div>
      </div>
    </footer>
  );
}
