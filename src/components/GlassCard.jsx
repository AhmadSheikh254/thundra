import React from 'react';
import { motion } from 'framer-motion';

export default function GlassCard({ children, className = '', hover = true, delay = 0, onClick, style }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      onClick={onClick}
      style={style}
      className={`relative rounded-2xl border border-purpleTheme/20 bg-[#0c0c16]/75 backdrop-blur-xl p-5 ${
        onClick ? 'cursor-pointer select-none' : ''
      } ${
        hover ? 'hover:border-blueTheme/30 hover:shadow-[0_12px_35px_rgba(4,6,12,0.6),_0_0_20px_rgba(79,209,255,0.1)] hover:scale-[1.01] transition-all duration-300' : ''
      } ${className}`}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-purpleTheme/5 via-transparent to-blueTheme/5 pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
