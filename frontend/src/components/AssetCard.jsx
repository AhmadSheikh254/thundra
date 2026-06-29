import React from 'react';
import { Play, Check, Plus, Film } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AssetCard({ asset, isSelected, onSelect, onAdd, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      className={`group relative h-28 rounded-xl overflow-hidden border bg-slate-950/80 cursor-pointer transition-all duration-300 ${
        isSelected 
          ? 'border-purpleTheme shadow-[0_0_15px_rgba(124,58,237,0.2)]' 
          : 'border-slate-800 hover:border-purpleTheme/40'
      }`}
      onClick={onSelect}
    >
      {/* Video clip thumbnail */}
      {asset.mediaUrl ? (
        <video 
          src={asset.mediaUrl}
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-60 group-hover:opacity-85 transition-opacity"
        />
      ) : (
        <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-700">
          <Film className="w-8 h-8" />
        </div>
      )}

      {/* Radial overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

      {/* Active marker / Controls */}
      <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        {onAdd && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onAdd();
            }}
            className="p-1 rounded-md bg-purpleTheme hover:bg-purpleTheme/80 text-white shadow"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {isSelected && (
        <div className="absolute top-2 left-2 bg-purpleTheme p-1 rounded-md text-white shadow-[0_0_8px_rgba(124,58,237,0.5)] z-10">
          <Check className="w-3 h-3" />
        </div>
      )}

      {/* Asset Info */}
      <div className="absolute bottom-2 left-2.5 right-2.5 text-left">
        <p className="text-[9px] text-purpleLight uppercase font-mono tracking-wider font-bold">
          {asset.duration || '5s'} · {asset.category || 'B-Roll'}
        </p>
        <p className="text-[10px] text-white font-medium truncate mt-0.5 group-hover:text-purpleLight transition-colors">
          {asset.title}
        </p>
      </div>

      {/* Subtle hover pulse border overlay */}
      <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-purpleTheme/20 pointer-events-none transition-colors" />
    </motion.div>
  );
}
