import React from 'react';
import { Type, Play } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CaptionCard({ caption, isActive, onClick, styleClass = 'text-yellow-400 font-extrabold' }) {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      onClick={onClick}
      className={`p-3 rounded-xl border flex items-center justify-between gap-4 cursor-pointer select-none transition-all ${
        isActive 
          ? 'bg-yellow-500/10 border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.1)]' 
          : 'bg-[#090914]/40 border-slate-800 hover:border-slate-700'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className={`p-2 rounded-lg shrink-0 ${
          isActive ? 'bg-yellow-500/20 text-yellow-500' : 'bg-slate-900 text-slate-500'
        }`}>
          <Type className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <p className={`text-xs truncate ${isActive ? 'text-white font-medium' : 'text-slate-300'}`}>
            "{caption.text}"
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[9px] font-mono text-slate-500">
              {caption.timeStart.toFixed(1)}s - {caption.timeEnd.toFixed(1)}s
            </span>
          </div>
        </div>
      </div>

      <div className="shrink-0 flex items-center gap-1.5">
        {isActive ? (
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
          </span>
        ) : (
          <Play className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-350 transition-colors" />
        )}
      </div>
    </motion.div>
  );
}
