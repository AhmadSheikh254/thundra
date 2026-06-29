import React from 'react';
import { Clock, Eye, Film } from 'lucide-react';
import GlassCard from './GlassCard';

export default function SceneCard({ scene, index, isActive, onClick, delay = 0 }) {
  return (
    <GlassCard
      onClick={onClick}
      delay={delay}
      hover={true}
      className={`border transition-all duration-300 ${
        isActive 
          ? 'border-purpleTheme bg-purpleTheme/5 shadow-[0_0_20px_rgba(124,58,237,0.15)]' 
          : 'border-slate-800 bg-[#090914]/50'
      }`}
    >
      <div className="flex flex-col gap-3">
        {/* Header line */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-heading tracking-wider uppercase ${
              isActive ? 'bg-purpleTheme text-white shadow-[0_0_8px_rgba(124,58,237,0.4)]' : 'bg-slate-850 text-slate-400'
            }`}>
              Scene {index + 1}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500">
            <Clock className="w-3.5 h-3.5" />
            <span>{scene.timeStart}s - {scene.timeEnd}s ({scene.timeEnd - scene.timeStart}s)</span>
          </div>
        </div>

        {/* Video preview / placeholder */}
        {scene.mediaUrl && (
          <div className="relative aspect-video rounded-lg overflow-hidden border border-slate-900 bg-black/60 group/media">
            <video 
              src={scene.mediaUrl}
              muted
              loop
              playsInline
              className="w-full h-full object-cover opacity-75 group-hover/media:opacity-100 transition-opacity"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-1.5 left-2 text-[10px] font-mono text-slate-300 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800/50 flex items-center gap-1">
              <Film className="w-3 h-3 text-purpleLight" />
              <span>Preview</span>
            </div>
          </div>
        )}

        {/* Narrative Script / Description */}
        <div className="space-y-1">
          <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Voiceover / Script</span>
          <p className="text-xs text-slate-200 leading-relaxed font-body italic">
            "{scene.text}"
          </p>
        </div>

        {/* Visual notes */}
        <div className="space-y-1 border-t border-slate-850/60 pt-2.5">
          <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1">
            <Eye className="w-3 h-3 text-blueTheme" />
            <span>Visual Notes (AI Recommended)</span>
          </span>
          <p className="text-[11px] text-slate-400 font-body leading-normal">
            {scene.brollSuggestion}
          </p>
        </div>
      </div>
    </GlassCard>
  );
}
