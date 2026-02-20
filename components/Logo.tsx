
import React from 'react';

const Logo: React.FC<{ className?: string; size?: 'sm' | 'md' | 'lg' }> = ({ className = '', size = 'md' }) => {
  const scales = {
    sm: { h: 32, w: 160 },
    md: { h: 48, w: 240 },
    lg: { h: 64, w: 320 }
  };
  const config = scales[size];

  return (
    <div className={`flex items-center ${className}`} style={{ width: 'auto', height: config.h }}>
      <svg
        viewBox="0 0 420 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto"
        preserveAspectRatio="xMinYMid meet"
      >
        {/* The Red Line: Short flat start -> V-shape -> Long flat line over text */}
        <path
          d="M 5 32 H 35 L 60 70 L 85 32 H 410"
          stroke="#E8322A"
          strokeWidth="6"
          strokeLinecap="butt"
          strokeLinejoin="miter"
        />
        
        {/* The Text "OLTCOM INC." positioned exactly like the logo */}
        <text
          x="95"
          y="70"
          fill="#2D2D2D"
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 600,
            fontSize: '44px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase'
          }}
        >
          <tspan>OLTCOM</tspan>
          <tspan dx="25" style={{ fontWeight: 400 }}>INC.</tspan>
        </text>
      </svg>
    </div>
  );
};

export default Logo;
