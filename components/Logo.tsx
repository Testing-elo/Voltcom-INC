import React from 'react';

const Logo: React.FC<{ className?: string; size?: 'sm' | 'md' | 'lg' }> = ({ className = '', size = 'md' }) => {
  const scales = {
    sm: { h: 28 },
    md: { h: 40 },
    lg: { h: 56 }
  };
  const config = scales[size];

  return (
    <div className={`flex items-center ${className}`} style={{ height: config.h, width: 'auto' }}>
      <svg
        viewBox="0 0 380 70"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto"
        preserveAspectRatio="xMinYMid meet"
      >
        {/* Red line: short flat -> V dip (forms the "V" of VOLTCOM) -> long flat over rest of text */}
        {/* The V dip sits under/through the "V" letter area, starting ~x=10 */}
        <path
          d="M 2 22 H 18 L 36 52 L 54 22 H 375"
          stroke="#E8322A"
          strokeWidth="4.5"
          strokeLinecap="butt"
          strokeLinejoin="miter"
        />

        {/* Full text "VOLTCOM Inc." — V is dark just like the other letters */}
        {/* The V letter sits between x=12 and x=54, aligning with the red V dip */}
        <text
          x="12"
          y="48"
          fill="#2D2D2D"
          style={{
            fontFamily: "'Poppins', 'Arial', sans-serif",
            fontWeight: 700,
            fontSize: '38px',
            letterSpacing: '0.05em',
          }}
        >
          VOLTCOM
        </text>
        <text
          x="232"
          y="48"
          fill="#2D2D2D"
          style={{
            fontFamily: "'Poppins', 'Arial', sans-serif",
            fontWeight: 400,
            fontSize: '38px',
            letterSpacing: '0.05em',
          }}
        >
          {' '}Inc.
        </text>
      </svg>
    </div>
  );
};

export default Logo;
