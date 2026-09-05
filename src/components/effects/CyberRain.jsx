import React, { useRef, useEffect } from 'react';

export default function CyberRain() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF';
    const fontSize = 13;
    const columns = Math.floor(width / 24);
    const drops = [];

    // Stagger drops randomly
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -80;
    }

    let frameCount = 0;

    const render = () => {
      // Clear with soft fade trail
      ctx.fillStyle = 'rgba(250, 251, 252, 0.08)';
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

      // Update slower (every 2 frames) for calm Zen rain
      frameCount++;
      if (frameCount % 2 === 0) {
        for (let i = 0; i < drops.length; i++) {
          const text = chars[Math.floor(Math.random() * chars.length)];
          const x = i * 24 + 12;
          const y = drops[i] * fontSize;

          // Head of stream: subtle rose or emerald
          const isLeading = Math.random() > 0.85;
          ctx.fillStyle = isLeading ? 'rgba(244, 63, 94, 0.25)' : 'rgba(113, 113, 122, 0.12)';

          if (y > 0 && y < height) {
            ctx.fillText(text, x, y);
          }

          if (y > height && Math.random() > 0.985) {
            drops[i] = 0;
          }
          drops[i] += 0.8;
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0 opacity-80"
      aria-hidden="true"
    />
  );
}
