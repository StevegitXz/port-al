import React, { useRef, useEffect } from 'react';

export default function ZenRipples() {
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

    const ripples = [];
    const inkSpecks = [];

    // Initialize some gentle floating ink/dust specks
    for (let i = 0; i < 18; i++) {
      inkSpecks.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 1 + Math.random() * 2,
        alpha: 0.1 + Math.random() * 0.15,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
      });
    }

    let lastSpawn = 0;
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const now = performance.now();
      if (now - lastSpawn > 90) {
        lastSpawn = now;
        ripples.push({
          x,
          y,
          radius: 2,
          maxRadius: 45 + Math.random() * 25,
          alpha: 0.35,
          color: Math.random() > 0.3 ? 'rgba(244, 63, 94,' : 'rgba(161, 161, 170,', // Sakura rose or Sumi-ink gray
        });
      }
    };

    // Listen on parent element
    const parent = canvas.parentElement;
    if (parent) {
      parent.addEventListener('mousemove', handleMouseMove);
    }

    // Occasional ambient ripple
    const ambientTimer = setInterval(() => {
      if (ripples.length < 5) {
        ripples.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: 3,
          maxRadius: 50 + Math.random() * 30,
          alpha: 0.25,
          color: 'rgba(244, 63, 94,',
        });
      }
    }, 2800);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render & Update ink specks
      inkSpecks.forEach((speck) => {
        speck.x += speck.speedX;
        speck.y += speck.speedY;

        if (speck.x < 0) speck.x = width;
        if (speck.x > width) speck.x = 0;
        if (speck.y < 0) speck.y = height;
        if (speck.y > height) speck.y = 0;

        ctx.beginPath();
        ctx.arc(speck.x, speck.y, speck.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180, 83, 9, ${speck.alpha * 0.3})`;
        ctx.fill();
      });

      // Render & Update Ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += 0.8;
        r.alpha *= 0.965;

        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `${r.color} ${r.alpha})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Inner echo wave
        if (r.radius > 12) {
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.radius * 0.65, 0, Math.PI * 2);
          ctx.strokeStyle = `${r.color} ${r.alpha * 0.45})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }

        if (r.alpha < 0.01 || r.radius >= r.maxRadius) {
          ripples.splice(i, 1);
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      clearInterval(ambientTimer);
      if (parent) {
        parent.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0 opacity-75"
      aria-hidden="true"
    />
  );
}
