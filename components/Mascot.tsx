
import React from 'react';

export const Mascot: React.FC = () => {
  return (
    <svg viewBox="0 0 100 100" className="w-20 h-20" xmlns="http://www.w3.org/2000/svg">
      <style>
        {`
          .wave { animation: wave-animation 2.5s infinite; transform-origin: 70% 70%; display: inline-block; }
          @keyframes wave-animation { 0% { transform: rotate(0.0deg) } 10% { transform: rotate(14.0deg) } 20% { transform: rotate(-8.0deg) } 30% { transform: rotate(14.0deg) } 40% { transform: rotate(-4.0deg) } 50% { transform: rotate(10.0deg) } 60% { transform: rotate(0.0deg) } 100% { transform: rotate(0.0deg) } }
          .leaf-sway { animation: sway-animation 4s ease-in-out infinite alternate; transform-origin: bottom center; }
          @keyframes sway-animation { from { transform: rotate(-5deg); } to { transform: rotate(5deg); } }
        `}
      </style>
      <g>
        {/* Body */}
        <path d="M 50,30 C 25,30 25,70 50,70 C 75,70 75,30 50,30 Z" fill="#6EE7B7" />
        <circle cx="50" cy="50" r="22" fill="#34D399" />
        
        {/* Eyes */}
        <circle cx="42" cy="48" r="4" fill="white" />
        <circle cx="42" cy="48" r="2" fill="#2F3136" />
        <circle cx="58" cy="48" r="4" fill="white" />
        <circle cx="58" cy="48" r="2" fill="#2F3136" />

        {/* Mouth */}
        <path d="M 45 58 Q 50 62 55 58" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />

        {/* Waving Hand */}
        <g className="wave">
          <path d="M 68,55 C 75,50 80,55 75,65" fill="#34D399" stroke="white" strokeWidth="1.5" />
        </g>
        
        {/* Leaf on head */}
        <g className="leaf-sway">
          <path d="M 50 28 C 55 18, 60 22, 50 28 Z" fill="#10B981" />
          <line x1="50" y1="28" x2="53" y2="23" stroke="#047857" strokeWidth="1" />
        </g>
      </g>
    </svg>
  );
};
