import React, { useEffect, useState, useRef } from 'react';

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [cursorType, setCursorType] = useState('default'); // 'default', 'pointer', 'project', 'terminal'
  const [cursorText, setCursorText] = useState('');
  const [isTouch, setIsTouch] = useState(false);

  const dotRef = useRef(null);
  const ringRef = useRef(null);

  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const animFrameId = useRef(null);

  useEffect(() => {
    // Detect touch device
    if (typeof window !== 'undefined') {
      const touchQuery = window.matchMedia('(pointer: coarse)');
      if (touchQuery.matches || 'ontouchstart' in window) {
        setIsTouch(true);
        return;
      }
    }

    const handleMouseMove = (e) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
      if (!isVisible) setIsVisible(true);

      // Inspect target element for contextual cursor states
      const target = e.target;
      if (!target) return;

      const projectEl = target.closest('[data-cursor="project"]');
      const terminalEl = target.closest('[data-cursor="terminal"], #terminal, input, textarea');
      const interactiveEl = target.closest('button, a, [role="button"], [data-cursor="pointer"]');

      if (projectEl) {
        setCursorType('project');
        setCursorText(projectEl.getAttribute('data-cursor-text') || 'VER');
      } else if (terminalEl) {
        setCursorType('terminal');
        setCursorText('>_');
      } else if (interactiveEl) {
        setCursorType('pointer');
        setCursorText('');
      } else {
        setCursorType('default');
        setCursorText('');
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Smooth animation loop for ring lagging
    const render = () => {
      // Lerp ring position
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.18;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.18;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0)`;
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    animFrameId.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [isVisible]);

  if (isTouch || !isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Center sharp dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 -ml-[3px] -mt-[3px] rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)] transition-opacity duration-200"
      />

      {/* Smooth lagging interactive ring */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 -ml-5 -mt-5 rounded-full border transition-all duration-200 flex items-center justify-center font-mono text-[9px] font-bold tracking-widest ${
          cursorType === 'project'
            ? 'w-20 h-20 -ml-10 -mt-10 bg-[#f4a7b9]/15 border-[#f4a7b9] text-[#f4a7b9] backdrop-blur-sm shadow-[0_0_20px_rgba(244,167,185,0.4)]'
            : cursorType === 'terminal'
            ? 'w-10 h-10 -ml-5 -mt-5 bg-zinc-950/80 border-emerald-400 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
            : cursorType === 'pointer'
            ? 'w-12 h-12 -ml-6 -mt-6 bg-[#f4a7b9]/10 border-[#f4a7b9]/80 shadow-[0_0_15px_rgba(244,167,185,0.3)]'
            : 'w-10 h-10 border-white/20'
        }`}
      >
        {cursorText && (
          <span className="uppercase select-none animate-pulse">
            {cursorText}
          </span>
        )}
      </div>
    </div>
  );
}
