import React from 'react';
import { Music, Play, Pause, Disc } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MusicCard({ track, isPlaying, isActive, onSelect, onTogglePlay, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer select-none transition-all duration-300 ${
        isActive 
          ? 'bg-blueTheme/10 border-blueTheme shadow-[0_0_15px_rgba(59,130,246,0.15)]' 
          : 'bg-[#090914]/50 border-slate-800 hover:border-slate-700'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center gap-3 min-w-0">
        {/* Glowing record disc */}
        <div className={`p-2.5 rounded-lg shrink-0 relative flex items-center justify-center ${
          isActive ? 'bg-blueTheme/20 text-blueTheme' : 'bg-slate-900 text-slate-500'
        }`}>
          <Disc className={`w-5 h-5 ${isActive && isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`} />
          {isActive && (
            <span className="absolute inset-0 rounded-lg border border-blueTheme/30 animate-pulse pointer-events-none" />
          )}
        </div>

        {/* Text information */}
        <div className="min-w-0">
          <h4 className={`text-xs font-bold font-heading truncate ${isActive ? 'text-white' : 'text-slate-300'}`}>
            {track.name}
          </h4>
          <p className="text-[10px] text-slate-400 mt-0.5 truncate">
            {track.genre} · {track.mood}
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[9px] font-mono text-slate-500 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-900/60 shrink-0">
              {track.tempo} BPM
            </span>
          </div>
        </div>
      </div>

      {/* Play / pause trigger button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (onTogglePlay) onTogglePlay();
          else onSelect();
        }}
        className={`p-2 rounded-full shrink-0 border transition-all ${
          isActive && isPlaying
            ? 'bg-blueTheme border-blueTheme text-white shadow-[0_0_8px_rgba(59,130,246,0.4)]'
            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
        }`}
      >
        {isActive && isPlaying ? (
          <Pause className="w-3.5 h-3.5" />
        ) : (
          <Play className="w-3.5 h-3.5 fill-current" />
        )}
      </button>
    </motion.div>
  );
}
