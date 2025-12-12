import React from 'react';

interface LogoProps {
  className?: string;
  light?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = "w-8 h-8", light = false }) => {
  // Brand Colors: Navy #0A2342, Teal #1CB5B2
  const textColor = light ? 'text-white' : 'text-[#0A2342]';
  
  // Symbol Colors
  const crossColor = '#1CB5B2'; // Teal
  const dotColor = '#1CB5B2'; // Teal
  const lineColor = light ? 'rgba(255,255,255,0.3)' : 'rgba(10,35,66,0.1)';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Symbol: Three connected dots around a cross */}
      <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
           {/* Connecting Lines (Triangle) */}
           <path d="M20 5L7 28H33L20 5Z" stroke={lineColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
           
           {/* The Cross (Health) */}
           <path d="M20 12V28" stroke={crossColor} strokeWidth="3" strokeLinecap="round"/>
           <path d="M12 20H28" stroke={crossColor} strokeWidth="3" strokeLinecap="round"/>

           {/* Three Dots (Network) */}
           <circle cx="20" cy="5" r="3.5" fill={dotColor} />
           <circle cx="7" cy="28" r="3.5" fill={dotColor} />
           <circle cx="33" cy="28" r="3.5" fill={dotColor} />
        </svg>
      </div>

      {/* Wordmark */}
      <div className="flex flex-col justify-center">
        <span className={`font-bold text-xl tracking-tight leading-none ${textColor} font-[Plus Jakarta Sans]`}>
          DocNet
        </span>
      </div>
    </div>
  );
};

export default Logo;