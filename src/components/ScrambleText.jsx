import React, { useState, useEffect, useRef, useCallback } from 'react';
import { sound } from '../utils/sound';

const GLYPHS = '!<>-_\\/[]{}—=+*^?#________01ABCDEF';

export default function ScrambleText({
  text,
  as: Component = 'span',
  className = '',
  scrambleOnHover = true,
  triggerOnView = true,
  children,
  ...props
}) {
  const targetText = text || (typeof children === 'string' ? children : '');
  const [displayText, setDisplayText] = useState(targetText);
  const [isScrambling, setIsScrambling] = useState(false);
  const elementRef = useRef(null);
  const frameRef = useRef(null);

  const startScramble = useCallback(() => {
    if (isScrambling || !targetText) return;
    setIsScrambling(true);

    let iteration = 0;
    const maxIterations = targetText.length * 3;
    let audioCounter = 0;

    const interval = setInterval(() => {
      setDisplayText(() => {
        return targetText
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration / 3) {
              return targetText[index];
            }
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join('');
      });

      audioCounter++;
      if (audioCounter % 2 === 0) {
        sound.playScrambleTick();
      }

      if (iteration >= maxIterations) {
        clearInterval(interval);
        setDisplayText(targetText);
        setIsScrambling(false);
      }

      iteration += 1;
    }, 28);

    frameRef.current = interval;
  }, [targetText, isScrambling]);

  useEffect(() => {
    setDisplayText(targetText);
  }, [targetText]);

  useEffect(() => {
    if (!triggerOnView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startScramble();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
      if (frameRef.current) clearInterval(frameRef.current);
    };
  }, [triggerOnView, startScramble]);

  const handleMouseEnter = () => {
    if (scrambleOnHover && !isScrambling) {
      startScramble();
    }
  };

  return (
    <Component
      ref={elementRef}
      onMouseEnter={handleMouseEnter}
      className={`inline-block select-none cursor-default font-mono ${className}`}
      {...props}
    >
      {displayText}
    </Component>
  );
}
