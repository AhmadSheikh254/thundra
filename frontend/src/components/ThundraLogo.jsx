import React from 'react';

export default function ThundraLogo({ className = "w-8 h-8", style }) {
  return (
    <svg 
      className={className} 
      style={style} 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Modern SaaS metallic gradient */}
        <linearGradient id="thundraLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3D5A80" />       {/* Smoky Blue */}
          <stop offset="35%" stopColor="#4FD1FF" />      {/* Soft Electric Cyan */}
          <stop offset="65%" stopColor="#FFFFFF" />      {/* Premium Ivory highlight reflection */}
          <stop offset="70%" stopColor="#F5EFE6" />      {/* Warm Ivory */}
          <stop offset="100%" stopColor="#3D5A80" />     {/* Smoky Blue reflection */}
        </linearGradient>
        
        {/* Premium chrome reflections */}
        <linearGradient id="thundraLogoReflect" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
          <stop offset="30%" stopColor="#4FD1FF" stopOpacity="0.4" />
          <stop offset="70%" stopColor="#3D5A80" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#F5EFE6" stopOpacity="0.4" />
        </linearGradient>

        {/* Enhanced cyan glow filter */}
        <filter id="thundraLogoGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="0.4" result="blur" />
          <feComponentTransfer in="blur" result="glow">
            <feFuncA type="linear" slope="0.2"/>
          </feComponentTransfer>
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Futuristic camera shutter/lens indicator frame */}
      <circle cx="16" cy="16" r="14.5" stroke="url(#thundraLogoReflect)" strokeWidth="1.5" opacity="0.45" />
      <circle cx="16" cy="16" r="11" stroke="url(#thundraLogoGrad)" strokeWidth="0.8" strokeDasharray="4 2" opacity="0.3" />

      {/* Stylized premium thunderbolt (Thundra) core shape with chrome bevels */}
      <path 
        d="M18.5 2.5L9.5 16.5H16L12.5 29.5L22.5 15.5H16L18.5 2.5Z" 
        fill="url(#thundraLogoGrad)" 
        stroke="url(#thundraLogoReflect)"
        strokeWidth="1"
        strokeLinejoin="round"
        filter="url(#thundraLogoGlow)"
        style={{ filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.45))' }}
      />
    </svg>
  );
}
