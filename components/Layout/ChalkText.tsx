'use client';

import React, { useState, useEffect } from 'react';

interface ChalkTextProps {
  children: string;
  className?: string;
  speed?: number; // milliseconds per character
  color?: 'white' | 'yellow' | 'green' | 'pink';
  skipAnimation?: boolean;
}

const chalkColors = {
  white: '#FFFFFF',
  yellow: '#FFF9C4',
  green: '#C5E1A5',
  pink: '#F8BBD0',
};

export const ChalkText: React.FC<ChalkTextProps> = ({
  children,
  className = '',
  speed = 30, // Fast default: 30ms per character
  color = 'white',
  skipAnimation = false,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (skipAnimation) {
      setDisplayedText(children);
      return;
    }

    setDisplayedText('');
    setIsAnimating(true);
    
    let currentIndex = 0;
    const text = children;
    
    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsAnimating(false);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [children, speed, skipAnimation]);

  const chalkColor = chalkColors[color];

  return (
    <span
      className={className}
      style={{
        color: chalkColor,
        fontFamily: 'var(--font-handwriting)',
        textShadow: `0 0 4px ${chalkColor}40, 0 1px 2px rgba(0,0,0,0.1)`,
      }}
    >
      {displayedText}
      {isAnimating && (
        <span
          className="inline-block w-0.5 h-5 bg-current ml-0.5 animate-pulse"
          style={{ animationDuration: '0.8s' }}
        />
      )}
    </span>
  );
};

