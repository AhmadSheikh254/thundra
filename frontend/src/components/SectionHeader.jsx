import React from 'react';
import { Sparkles } from 'lucide-react';

export default function SectionHeader({ title, subtitle, badgeText, icon: Icon = Sparkles, className = '' }) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {badgeText && (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider text-purpleLight bg-purpleTheme/10 border border-purpleTheme/20 uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-purpleLight animate-pulse" />
          {badgeText}
        </div>
      )}
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-5 h-5 text-purpleLight" />}
        <h3 className="font-heading text-xl md:text-2xl font-black text-white tracking-tight">{title}</h3>
      </div>
      {subtitle && <p className="text-xs text-slate-400 leading-relaxed font-body">{subtitle}</p>}
    </div>
  );
}
