import React, { useRef, useEffect } from 'react';

export default function CircuitTraces() {
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
      buildTraces();
    };

    window.addEventListener('resize', handleResize);

    // Generate PCB traces with right-angles and 45deg bends
    let traces = [];
    let pulses = [];

    const buildTraces = () => {
      traces = [];
      pulses = [];
      const numLines = Math.min(12, Math.floor(width / 90));

      for (let i = 0; i < numLines; i++) {
        const startX = (i + 0.5) * (width / numLines) + (Math.random() * 40 - 20);
        const startY = Math.random() * (height * 0.2);
        
        const path = [{ x: startX, y: startY }];
        let curX = startX;
        let curY = startY;

        const segments = 3 + Math.floor(Math.random() * 3);
        for (let s = 0; s < segments; s++) {
          // Vertical segment
          curY += 60 + Math.random() * 100;
          path.push({ x: curX, y: curY });

          // 45deg diagonal or horizontal jog
          const dir = Math.random() > 0.5 ? 1 : -1;
          const jog = 30 + Math.random() * 50;
          curX += jog * dir;
          curY += jog;
          path.push({ x: curX, y: curY });
        }

        // Final vertical run to bottom
        curY = Math.min(height, curY + 80);
        path.push({ x: curX, y: curY });

        // Calculate segment lengths
        let totalLen = 0;
        const segLengths = [];
        for (let j = 0; j < path.length - 1; j++) {
          const dx = path[j + 1].x - path[j].x;
          const dy = path[j + 1].y - path[j].y;
          const len = Math.hypot(dx, dy);
          segLengths.push(len);
          totalLen += len;
        }

        const isRose = i % 2 === 0;
        traces.push({
          path,
          segLengths,
          totalLen,
          color: isRose ? 'rgba(244, 63, 94, 0.12)' : 'rgba(16, 185, 129, 0.12)',
          padColor: isRose ? 'rgba(244, 63, 94, 0.35)' : 'rgba(16, 185, 129, 0.35)',
          pulseColor: isRose ? '#f43f5e' : '#10b981',
        });

        // Add 1 or 2 traveling pulses per trace
        pulses.push({
          traceIdx: i,
          progress: Math.random(),
          speed: 0.0015 + Math.random() * 0.002,
        });
      }
    };

    buildTraces();

    const getPointAtProgress = (trace, progress) => {
      let targetDist = progress * trace.totalLen;
      let accumulated = 0;

      for (let j = 0; j < trace.segLengths.length; j++) {
        const segLen = trace.segLengths[j];
        if (accumulated + segLen >= targetDist) {
          const segProgress = (targetDist - accumulated) / segLen;
          const p1 = trace.path[j];
          const p2 = trace.path[j + 1];
          return {
            x: p1.x + (p2.x - p1.x) * segProgress,
            y: p1.y + (p2.y - p1.y) * segProgress,
          };
        }
        accumulated += segLen;
      }

      return trace.path[trace.path.length - 1];
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw Static PCB Traces & Solder Vias
      traces.forEach((trace) => {
        ctx.beginPath();
        ctx.strokeStyle = trace.color;
        ctx.lineWidth = 1;
        ctx.setLineDash([]);

        ctx.moveTo(trace.path[0].x, trace.path[0].y);
        for (let k = 1; k < trace.path.length; k++) {
          ctx.lineTo(trace.path[k].x, trace.path[k].y);
        }
        ctx.stroke();

        // Draw solder via rings at vertices
        trace.path.forEach((pt, idx) => {
          if (idx === 0 || idx === trace.path.length - 1 || idx % 2 === 0) {
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = '#fafbfc';
            ctx.fill();
            ctx.strokeStyle = trace.padColor;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        });
      });

      // Draw Traveling Electron Pulses
      pulses.forEach((pulse) => {
        const trace = traces[pulse.traceIdx];
        if (!trace) return;

        pulse.progress += pulse.speed;
        if (pulse.progress > 1) {
          pulse.progress = 0;
        }

        const pos = getPointAtProgress(trace, pulse.progress);

        // Glowing pulse head
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = trace.pulseColor;
        ctx.shadowColor = trace.pulseColor;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      });

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
      className="pointer-events-none absolute inset-0 z-0 opacity-60"
      aria-hidden="true"
    />
  );
}
