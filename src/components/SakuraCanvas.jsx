import React, { useEffect, useRef } from 'react';

export default function SakuraCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates and velocity
    const mouse = { x: -1000, y: -1000, vx: 0, vy: 0, lastX: 0, lastY: 0 };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;
      mouse.vx = currentX - mouse.lastX;
      mouse.vy = currentY - mouse.lastY;
      mouse.lastX = currentX;
      mouse.lastY = currentY;
      mouse.x = currentX;
      mouse.y = currentY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Number of petals adjusted for screen size
    const petalCount = Math.min(Math.floor(width / 28), 48);

    class Petal {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : -20 - Math.random() * 50;
        this.size = 10 + Math.random() * 14;
        this.speedX = 0.5 + Math.random() * 1.2;
        this.speedY = 0.8 + Math.random() * 1.5;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        this.opacity = 0.55 + Math.random() * 0.35;
        this.sway = Math.random() * Math.PI * 2;
        this.swaySpeed = 0.015 + Math.random() * 0.02;
        const colors = ['#f43f5e', '#fb7185', '#f472b6', '#fda4af'];
        this.petalColor = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.sway += this.swaySpeed;
        this.rotation += this.rotationSpeed;

        // Base floating physics
        this.x += this.speedX + Math.sin(this.sway) * 0.8;
        this.y += this.speedY;

        // Interaction with mouse cursor
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 130;

        if (dist < maxDist && dist > 0) {
          const force = (1 - dist / maxDist) * 3.5;
          const angle = Math.atan2(dy, dx);
          this.x += Math.cos(angle) * force + mouse.vx * 0.08;
          this.y += Math.sin(angle) * force + mouse.vy * 0.08;
          this.rotationSpeed += 0.01;
        }

        // Wrap around borders
        if (this.y > height + 30) {
          this.reset(false);
        }
        if (this.x > width + 30) {
          this.x = -20;
        } else if (this.x < -30) {
          this.x = width + 20;
        }
      }

      draw(c) {
        c.save();
        c.translate(this.x, this.y);
        c.rotate(this.rotation);
        c.globalAlpha = this.opacity;

        // Soft drop shadow for white paper contrast
        c.shadowColor = 'rgba(244, 63, 94, 0.2)';
        c.shadowBlur = 5;

        // Organic Sakura petal silhouette
        c.beginPath();
        c.fillStyle = this.petalColor;

        const w = this.size;
        const h = this.size * 1.35;

        c.moveTo(0, -h / 2);
        c.bezierCurveTo(w / 2, -h / 4, w / 2, h / 3, 0, h / 2);
        c.bezierCurveTo(-w / 2, h / 3, -w / 2, -h / 4, 0, -h / 2);
        c.fill();

        // Subtle center vein
        c.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        c.lineWidth = 0.8;
        c.beginPath();
        c.moveTo(0, -h / 3);
        c.lineTo(0, h / 3);
        c.stroke();

        c.restore();
      }

    }

    const petals = Array.from({ length: petalCount }, () => new Petal());

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < petals.length; i++) {
        petals[i].update();
        petals[i].draw(ctx);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      style={{ opacity: 0.85 }}
    />
  );
}
