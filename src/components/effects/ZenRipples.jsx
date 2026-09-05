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
    const droplets = [];
    const inkSpecks = [];

    // Initialize floating zen ink dust specks
    for (let i = 0; i < 24; i++) {
      inkSpecks.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 1.2 + Math.random() * 2.2,
        alpha: 0.15 + Math.random() * 0.25,
        speedX: (Math.random() - 0.5) * 0.35,
        speedY: (Math.random() - 0.5) * 0.35,
        color: Math.random() > 0.4 ? 'rgba(244, 63, 94,' : 'rgba(161, 161, 170,',
      });
    }

    const spawnRipple = (x, y, isClick = false, velocity = 1) => {
      const maxR = isClick 
        ? 240 + Math.random() * 80 
        : 140 + Math.min(120, velocity * 18);

      ripples.push({
        x,
        y,
        radius: 4,
        maxRadius: maxR,
        speed: isClick ? 2.8 : 1.6 + Math.min(1.8, velocity * 0.25),
        alpha: isClick ? 0.85 : 0.65,
        decay: isClick ? 0.982 : 0.978,
        color: isClick || Math.random() > 0.25 ? '244, 63, 94' : '2, 132, 199', // Sakura Rose or Zen Cyan
        isClick,
      });

      if (isClick) {
        // Spawn small water droplet beads on click
        const count = 8 + Math.floor(Math.random() * 6);
        for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2;
          const spd = 1.5 + Math.random() * 3.5;
          droplets.push({
            x,
            y,
            vx: Math.cos(angle) * spd,
            vy: Math.sin(angle) * spd,
            radius: 1.5 + Math.random() * 2,
            alpha: 0.8,
            color: '244, 63, 94',
          });
        }
      }
    };

    let lastX = 0;
    let lastY = 0;
    let lastSpawn = 0;

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const dx = x - lastX;
      const dy = y - lastY;
      const dist = Math.hypot(dx, dy);
      const velocity = Math.min(8, dist / 8);

      const now = performance.now();
      // Throttle mouse ripples based on movement
      if (now - lastSpawn > (velocity > 3 ? 55 : 85) && dist > 8) {
        lastSpawn = now;
        lastX = x;
        lastY = y;
        spawnRipple(x, y, false, velocity);
      }
    };

    const handleClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      spawnRipple(x, y, true, 4);
    };

    // Listen on parent element for broad capture
    const parent = canvas.parentElement;
    if (parent) {
      parent.addEventListener('mousemove', handleMouseMove);
      parent.addEventListener('click', handleClick);
    }

    // Natural ambient water drops every 2 seconds
    const ambientInterval = setInterval(() => {
      if (ripples.length < 10) {
        const randX = Math.random() * width;
        const randY = Math.random() * height;
        spawnRipple(randX, randY, false, 1.2);
      }
    }, 1900);

    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // 1. Subtle Harmonic Sand / Water Currents (Karesansui undulating wave lines)
      ctx.beginPath();
      const waveCount = 3;
      for (let w = 0; w < waveCount; w++) {
        const baseY = height * (0.28 + w * 0.24);
        ctx.moveTo(0, baseY + Math.sin(time + w) * 12);
        for (let x = 0; x <= width; x += 30) {
          const y = baseY + Math.sin(x * 0.004 + time * 1.2 + w * 1.5) * 14 + Math.cos(x * 0.002 + time * 0.8) * 8;
          ctx.lineTo(x, y);
        }
      }
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.035)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // 2. Render & Update Floating Ink / Dust Specks
      inkSpecks.forEach((speck) => {
        speck.x += speck.speedX;
        speck.y += speck.speedY;

        if (speck.x < 0) speck.x = width;
        if (speck.x > width) speck.x = 0;
        if (speck.y < 0) speck.y = height;
        if (speck.y > height) speck.y = 0;

        ctx.beginPath();
        ctx.arc(speck.x, speck.y, speck.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${speck.color} ${speck.alpha * 0.45})`;
        ctx.fill();
      });

      // 3. Render & Update Droplets (Splash beads)
      for (let d = droplets.length - 1; d >= 0; d--) {
        const drop = droplets[d];
        drop.x += drop.vx;
        drop.y += drop.vy;
        drop.vx *= 0.94;
        drop.vy *= 0.94;
        drop.alpha *= 0.94;

        ctx.beginPath();
        ctx.arc(drop.x, drop.y, drop.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${drop.color}, ${drop.alpha})`;
        ctx.shadowColor = `rgba(${drop.color}, ${drop.alpha * 0.8})`;
        ctx.shadowBlur = 4;
        ctx.fill();
        ctx.shadowBlur = 0;

        if (drop.alpha < 0.02) {
          droplets.splice(d, 1);
        }
      }

      // 4. Render & Update Multi-Crest Concentric Ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += r.speed;
        r.alpha *= r.decay;

        const progress = r.radius / r.maxRadius;
        const fadeMultiplier = Math.max(0, 1 - progress);

        // A. Primary Wavefront (Strongest outer crest)
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${r.color}, ${r.alpha * fadeMultiplier})`;
        ctx.lineWidth = r.isClick ? 2.4 : 1.8;
        ctx.stroke();

        // B. Secondary Echo Wave (Mid crest)
        if (r.radius > 16) {
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.radius * 0.74, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${r.color}, ${r.alpha * 0.6 * fadeMultiplier})`;
          ctx.lineWidth = r.isClick ? 1.8 : 1.3;
          ctx.stroke();
        }

        // C. Tertiary Inner Wave (Gentle inner pulse)
        if (r.radius > 32) {
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.radius * 0.48, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${r.color}, ${r.alpha * 0.35 * fadeMultiplier})`;
          ctx.lineWidth = 1.0;
          ctx.stroke();
        }

        // D. Soft Water-Lens Refraction Glow
        if (r.radius > 20 && r.alpha > 0.15) {
          const grad = ctx.createRadialGradient(r.x, r.y, r.radius * 0.4, r.x, r.y, r.radius);
          grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
          grad.addColorStop(0.8, `rgba(${r.color}, ${r.alpha * 0.06 * fadeMultiplier})`);
          grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
          ctx.fill();
        }

        if (r.alpha < 0.015 || r.radius >= r.maxRadius) {
          ripples.splice(i, 1);
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      clearInterval(ambientInterval);
      if (parent) {
        parent.removeEventListener('mousemove', handleMouseMove);
        parent.removeEventListener('click', handleClick);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0 opacity-100"
      aria-hidden="true"
    />
  );
}
