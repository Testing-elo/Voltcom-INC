import React from 'react';

const Logo: React.FC<{ className?: string; size?: 'sm' | 'md' | 'lg' }> = ({ className = '', size = 'md' }) => {
  const heights: Record<string, number> = { sm: 28, md: 40, lg: 56 };

  return (
    <img
      src="/voltcom-logo.jpg"
      alt="Voltcom Inc."
      style={{ height: heights[size], width: 'auto' }}
      className={className}
    />
  );
};

export default Logo;
