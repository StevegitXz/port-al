import React, { useEffect, useRef } from 'react';

/**
 * Catmull-Rom Spline interpolation for silky smooth closed flight trajectories
 */
function catmullRom(p0, p1, p2, p3, t) {
  const t2 = t * t;
  const t3 = t2 * t;
  return (
    0.5 *
    (2 * p1 +
      (-p0 + p2) * t +
      (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
      (-p0 + 3 * p1 - 3 * p2 + p3) * t3)
  );
}

/**
 * Japanese Dragon (Ryu / 龍) in traditional Sumi-e ink style
 * Features fluid multi-segment spine kinematics, swimming undulation,
 * scroll velocity responsiveness, trailing ink smoke puffs, and Sakura embers.
 */
export default function JapaneseDragonTimeline({
  className = 'pointer-events-none absolute inset-0 z-0 overflow-hidden w-full h-full select-none',
  opacity = 0.85,
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let isVisible = true;

    // Dimensions
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    // Dpr
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Spine Configuration (52 articulated vertebrae nodes)
    const NUM_SEGMENTS = 52;
    const SEGMENT_LENGTH = 14;

    // Body node array
    const spine = Array.from({ length: NUM_SEGMENTS }, (_, i) => ({
      x: width * 0.5 - i * SEGMENT_LENGTH,
      y: height * 0.2,
      angle: 0,
      width: Math.sin((i / NUM_SEGMENTS) * Math.PI) * 16 + 8, // Thicker in middle, tapered at tail
    }));

    // Whisker simulation nodes (Left & Right, 7 nodes each)
    const WHISKER_NODES = 7;
    const leftWhisker = Array.from({ length: WHISKER_NODES }, () => ({ x: 0, y: 0 }));
    const rightWhisker = Array.from({ length: WHISKER_NODES }, () => ({ x: 0, y: 0 }));

    // Trail particles (Ink vapor + Golden & Sakura embers)
    const particles = [];
    const MAX_PARTICLES = 65;

    // Flight patrol circuit waypoints weaving in an organic S-curve around cards
    const getWaypoints = (w, h) => [
      { x: w * 0.88, y: h * 0.08 }, // Upper right above Lattes banner
      { x: w * 0.35, y: h * 0.12 }, // Swoop across top header
      { x: w * 0.10, y: h * 0.22 }, // Upper left loop
      { x: w * 0.48, y: h * 0.30 }, // Center dive over featured card
      { x: w * 0.92, y: h * 0.42 }, // Wide sweep to right flank
      { x: w * 0.52, y: h * 0.54 }, // Crossover between columns
      { x: w * 0.08, y: h * 0.65 }, // Left flank curve
      { x: w * 0.55, y: h * 0.76 }, // Center sweep between lower cards
      { x: w * 0.90, y: h * 0.85 }, // Right sweep lower certificates
      { x: w * 0.35, y: h * 0.96 }, // Deep bottom turn
      { x: w * 0.06, y: h * 0.82 }, // Ascending left turn
      { x: w * 0.45, y: h * 0.48 }, // Center ascending diagonal
    ];

    let waypoints = getWaypoints(width, height);

    // Progress along circuit
    let pathProgress = 0.0;
    let baseSpeed = 0.00032;
    let currentSpeed = baseSpeed;

    // Scroll & Mouse Tracking for dynamic movement feel
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;
    const mouse = { x: -2000, y: -2000, active: false };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = Math.abs(currentScrollY - lastScrollY);
      scrollVelocity = Math.min(delta * 0.00028, 0.0035);
      lastScrollY = currentScrollY;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Path position evaluator with Catmull-Rom
    const getPathPoint = (t) => {
      const n = waypoints.length;
      let normT = ((t % 1) + 1) % 1; // 0 to 1
      const totalT = normT * n;
      const i1 = Math.floor(totalT) % n;
      const i0 = (i1 - 1 + n) % n;
      const i2 = (i1 + 1) % n;
      const i3 = (i1 + 2) % n;
      const localT = totalT - Math.floor(totalT);

      return {
        x: catmullRom(waypoints[i0].x, waypoints[i1].x, waypoints[i2].x, waypoints[i3].x, localT),
        y: catmullRom(waypoints[i0].y, waypoints[i1].y, waypoints[i2].y, waypoints[i3].y, localT),
      };
    };

    // Spawn trailing ink smoke & sakura embers
    const spawnParticle = (x, y, vx, vy, isEmber = false) => {
      if (particles.length >= MAX_PARTICLES) particles.shift();
      particles.push({
        x: x + (Math.random() - 0.5) * 8,
        y: y + (Math.random() - 0.5) * 8,
        vx: vx * 0.2 + (Math.random() - 0.5) * 0.8,
        vy: vy * 0.2 + (Math.random() - 0.5) * 0.8,
        life: 1.0,
        decay: isEmber ? 0.018 + Math.random() * 0.015 : 0.014 + Math.random() * 0.01,
        size: isEmber ? 2 + Math.random() * 2.5 : 8 + Math.random() * 14,
        isEmber,
        color: isEmber
          ? Math.random() > 0.5
            ? 'rgba(244, 63, 94,' // Rose sakura
            : 'rgba(245, 158, 11,' // Amber gold
          : 'rgba(20, 24, 33,', // Sumi-e charcoal
      });
    };

    // Main Animation Loop
    let time = 0;

    const render = () => {
      animId = requestAnimationFrame(render);
      if (!isVisible) return;

      time += 0.035;

      // Smooth scroll boost decay
      scrollVelocity *= 0.92;
      currentSpeed = baseSpeed + scrollVelocity;
      pathProgress += currentSpeed;

      // 1. Advance Head along circuit
      const targetPoint = getPathPoint(pathProgress);
      const lookAheadPoint = getPathPoint(pathProgress + 0.002);

      // Target head position
      let targetHeadX = targetPoint.x;
      let targetHeadY = targetPoint.y;

      // Subtle mouse magnetic influence (softly steering without leaving path)
      if (mouse.active) {
        const dx = mouse.x - targetHeadX;
        const dy = mouse.y - targetHeadY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 420) {
          const pull = (1 - dist / 420) * 45;
          targetHeadX += (dx / dist) * pull;
          targetHeadY += (dy / dist) * pull;
        }
      }

      // Smooth head move
      const head = spine[0];
      const headVx = (targetHeadX - head.x) * 0.12;
      const headVy = (targetHeadY - head.y) * 0.12;
      head.x += headVx;
      head.y += headVy;
      head.angle = Math.atan2(lookAheadPoint.y - head.y, lookAheadPoint.x - head.x);

      // 2. Spine Kinematics & Undulation (Sinusoidal Swimming Wave)
      for (let i = 1; i < NUM_SEGMENTS; i++) {
        const prev = spine[i - 1];
        const cur = spine[i];

        // Lateral wave offset perpendicular to motion (creates the swimming snake effect)
        const waveFreq = 0.28;
        const waveAmp = Math.sin((i / NUM_SEGMENTS) * Math.PI) * (14 + scrollVelocity * 2500);
        const lateralOffset = Math.sin(time * 2.8 - i * waveFreq) * waveAmp;

        const dx = cur.x - prev.x;
        const dy = cur.y - prev.y;
        const angle = Math.atan2(dy, dx);
        cur.angle = angle;

        // Position constrained by fixed vertebra distance
        const targetX = prev.x + Math.cos(angle) * SEGMENT_LENGTH;
        const targetY = prev.y + Math.sin(angle) * SEGMENT_LENGTH;

        // Add lateral offset perpendicular to angle
        const perpX = -Math.sin(angle) * (lateralOffset * 0.08);
        const perpY = Math.cos(angle) * (lateralOffset * 0.08);

        cur.x += (targetX + perpX - cur.x) * 0.52;
        cur.y += (targetY + perpY - cur.y) * 0.52;
      }

      // 3. Whisker Physics (Trailing behind the dragon's snout)
      const whiskerBaseOffset = 10;
      const leftBaseX = head.x + Math.cos(head.angle + 0.6) * whiskerBaseOffset;
      const leftBaseY = head.y + Math.sin(head.angle + 0.6) * whiskerBaseOffset;
      const rightBaseX = head.x + Math.cos(head.angle - 0.6) * whiskerBaseOffset;
      const rightBaseY = head.y + Math.sin(head.angle - 0.6) * whiskerBaseOffset;

      leftWhisker[0] = { x: leftBaseX, y: leftBaseY };
      rightWhisker[0] = { x: rightBaseX, y: rightBaseY };

      for (let j = 1; j < WHISKER_NODES; j++) {
        // Left
        const prevL = leftWhisker[j - 1];
        const curL = leftWhisker[j];
        const flutterL = Math.sin(time * 4.5 + j * 0.8) * 2.5;
        curL.x += (prevL.x - Math.cos(head.angle) * 7 - curL.x) * 0.35 + flutterL * 0.2;
        curL.y += (prevL.y - Math.sin(head.angle) * 7 - curL.y) * 0.35;

        // Right
        const prevR = rightWhisker[j - 1];
        const curR = rightWhisker[j];
        const flutterR = Math.sin(time * 4.5 + j * 0.8 + Math.PI) * 2.5;
        curR.x += (prevR.x - Math.cos(head.angle) * 7 - curR.x) * 0.35 + flutterR * 0.2;
        curR.y += (prevR.y - Math.sin(head.angle) * 7 - curR.y) * 0.35;
      }

      // 4. Emit particles along path
      if (Math.random() < 0.35 + scrollVelocity * 100) {
        // Ink smoke from belly
        const midNode = spine[Math.floor(NUM_SEGMENTS * 0.45)];
        spawnParticle(midNode.x, midNode.y, -Math.cos(midNode.angle) * 2, -Math.sin(midNode.angle) * 2, false);
      }
      if (Math.random() < 0.45) {
        // Sakura ember from tail
        const tail = spine[NUM_SEGMENTS - 1];
        spawnParticle(tail.x, tail.y, -Math.cos(tail.angle) * 1.5, -Math.sin(tail.angle) * 1.5, true);
      }

      // ----------------------------------------------------
      // DRAWING PASS (Clear & Render Sumi-e Japanese Dragon)
      // ----------------------------------------------------
      ctx.clearRect(0, 0, width, height);

      // A. Render Trailing Ink & Sakura Particles
      for (let p = particles.length - 1; p >= 0; p--) {
        const pt = particles[p];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.life -= pt.decay;
        pt.size *= 1.015;

        if (pt.life <= 0) {
          particles.splice(p, 1);
          continue;
        }

        ctx.fillStyle = `${pt.color} ${(pt.life * (pt.isEmber ? 0.75 : 0.18)).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // B. Render Dragon Body (Ribbon with left & right profile)
      ctx.save();

      // Body Gradient: Deep charcoal nanquim with crimson spine and washi cream belly
      const bodyGrad = ctx.createLinearGradient(
        spine[0].x,
        spine[0].y,
        spine[NUM_SEGMENTS - 1].x,
        spine[NUM_SEGMENTS - 1].y
      );
      bodyGrad.addColorStop(0, 'rgba(18, 22, 30, 0.65)');
      bodyGrad.addColorStop(0.3, 'rgba(30, 36, 48, 0.55)');
      bodyGrad.addColorStop(0.7, 'rgba(190, 24, 60, 0.45)'); // Carmine sakura accent
      bodyGrad.addColorStop(1, 'rgba(18, 22, 30, 0.35)');

      // Construct Ribbon Contour
      const leftPoints = [];
      const rightPoints = [];

      for (let i = 0; i < NUM_SEGMENTS; i++) {
        const node = spine[i];
        const normalAngle = node.angle + Math.PI * 0.5;
        const halfW = node.width * 0.5;

        leftPoints.push({
          x: node.x + Math.cos(normalAngle) * halfW,
          y: node.y + Math.sin(normalAngle) * halfW,
        });
        rightPoints.push({
          x: node.x - Math.cos(normalAngle) * halfW,
          y: node.y - Math.sin(normalAngle) * halfW,
        });
      }

      // Draw Main Serpentine Body
      ctx.beginPath();
      ctx.moveTo(leftPoints[0].x, leftPoints[0].y);
      for (let i = 1; i < leftPoints.length; i++) {
        const xc = (leftPoints[i].x + leftPoints[i - 1].x) * 0.5;
        const yc = (leftPoints[i].y + leftPoints[i - 1].y) * 0.5;
        ctx.quadraticCurveTo(leftPoints[i - 1].x, leftPoints[i - 1].y, xc, yc);
      }
      ctx.lineTo(leftPoints[leftPoints.length - 1].x, leftPoints[leftPoints.length - 1].y);

      // Connect around tail
      const tailTip = spine[NUM_SEGMENTS - 1];
      ctx.lineTo(tailTip.x, tailTip.y);

      for (let i = rightPoints.length - 1; i > 0; i--) {
        const xc = (rightPoints[i].x + rightPoints[i - 1].x) * 0.5;
        const yc = (rightPoints[i].y + rightPoints[i - 1].y) * 0.5;
        ctx.quadraticCurveTo(rightPoints[i].x, rightPoints[i].y, xc, yc);
      }
      ctx.lineTo(rightPoints[0].x, rightPoints[0].y);
      ctx.closePath();

      ctx.fillStyle = bodyGrad;
      ctx.fill();

      // Calligraphic ink contour outline
      ctx.strokeStyle = 'rgba(10, 14, 20, 0.45)';
      ctx.lineWidth = 2.0;
      ctx.stroke();

      // C. Dorsal Spine Fins (Sehire) - Sharp flame-like spikes along the back
      for (let i = 3; i < NUM_SEGMENTS - 4; i += 2) {
        const node = spine[i];
        const finAngle = node.angle + Math.PI * 0.5;
        const finLength = node.width * 0.85 + Math.sin(time * 3 + i * 0.5) * 4;
        const finBaseW = 6;

        ctx.fillStyle = 'rgba(225, 29, 72, 0.45)'; // Crimson ink crest
        ctx.beginPath();
        ctx.moveTo(node.x - Math.cos(node.angle) * finBaseW, node.y - Math.sin(node.angle) * finBaseW);
        ctx.lineTo(node.x + Math.cos(finAngle) * finLength, node.y + Math.sin(finAngle) * finLength);
        ctx.lineTo(node.x + Math.cos(node.angle) * finBaseW, node.y + Math.sin(node.angle) * finBaseW);
        ctx.closePath();
        ctx.fill();
      }

      // D. Four Imperial Claws (Legs at segments 10, 18, 30, 38)
      const legSegments = [11, 19, 31, 39];
      legSegments.forEach((segIdx, legIdx) => {
        const node = spine[segIdx];
        const side = legIdx % 2 === 0 ? 1 : -1;
        const legAngle = node.angle + side * 1.35;
        const hipX = node.x + Math.cos(node.angle + side * Math.PI * 0.5) * (node.width * 0.45);
        const hipY = node.y + Math.sin(node.angle + side * Math.PI * 0.5) * (node.width * 0.45);

        // Knee joint
        const kneeLen = 16;
        const kneeX = hipX + Math.cos(legAngle) * kneeLen;
        const kneeY = hipY + Math.sin(legAngle) * kneeLen;

        // Paw ankle
        const ankleAngle = legAngle + side * 0.7;
        const ankleLen = 14;
        const ankleX = kneeX + Math.cos(ankleAngle) * ankleLen;
        const ankleY = kneeY + Math.sin(ankleAngle) * ankleLen;

        // Draw leg bone in Sumi-e stroke
        ctx.strokeStyle = 'rgba(24, 28, 38, 0.55)';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(hipX, hipY);
        ctx.lineTo(kneeX, kneeY);
        ctx.lineTo(ankleX, ankleY);
        ctx.stroke();

        // 3 Talons (Claws)
        for (let c = -1; c <= 1; c++) {
          const clawAngle = ankleAngle + c * 0.45;
          const clawLen = 8;
          ctx.strokeStyle = '#e11d48'; // Crimson claw tips
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.moveTo(ankleX, ankleY);
          ctx.lineTo(
            ankleX + Math.cos(clawAngle) * clawLen,
            ankleY + Math.sin(clawAngle) * clawLen
          );
          ctx.stroke();
        }
      });

      // E. Calligraphic Brush Tail Tuft (Flaring ink mane at the tip)
      const tailNode = spine[NUM_SEGMENTS - 1];
      const tailAngle = tailNode.angle;
      ctx.fillStyle = 'rgba(225, 29, 72, 0.55)';
      for (let t = -2; t <= 2; t++) {
        const tuftAngle = tailAngle + t * 0.35 + Math.sin(time * 3 + t) * 0.2;
        const tuftLen = 28 - Math.abs(t) * 5;
        ctx.beginPath();
        ctx.moveTo(tailNode.x, tailNode.y);
        ctx.quadraticCurveTo(
          tailNode.x + Math.cos(tuftAngle) * (tuftLen * 0.5),
          tailNode.y + Math.sin(tuftAngle) * (tuftLen * 0.5) + (t * 4),
          tailNode.x + Math.cos(tuftAngle) * tuftLen,
          tailNode.y + Math.sin(tuftAngle) * tuftLen
        );
        ctx.lineTo(tailNode.x, tailNode.y);
        ctx.fill();
      }

      // F. The Imperial Dragon Head (Atama)
      ctx.save();
      ctx.translate(head.x, head.y);
      ctx.rotate(head.angle);

      // Head Base Geometry
      ctx.fillStyle = 'rgba(16, 20, 28, 0.85)';
      ctx.beginPath();
      ctx.ellipse(4, 0, 18, 12, 0, 0, Math.PI * 2);
      ctx.fill();

      // Snout / Upper Jaw
      ctx.beginPath();
      ctx.moveTo(10, -8);
      ctx.lineTo(26, -5);
      ctx.lineTo(28, 0);
      ctx.lineTo(26, 5);
      ctx.lineTo(10, 8);
      ctx.closePath();
      ctx.fillStyle = 'rgba(22, 26, 36, 0.9)';
      ctx.fill();

      // Lower Jaw
      ctx.beginPath();
      ctx.moveTo(10, 4);
      ctx.lineTo(22, 6);
      ctx.lineTo(18, 10);
      ctx.lineTo(8, 7);
      ctx.closePath();
      ctx.fillStyle = 'rgba(30, 36, 48, 0.85)';
      ctx.fill();

      // Flowing Mane / Beard under chin
      ctx.fillStyle = 'rgba(225, 29, 72, 0.65)';
      ctx.beginPath();
      ctx.moveTo(6, 6);
      ctx.quadraticCurveTo(
        -8,
        14 + Math.sin(time * 4) * 3,
        -18,
        10
      );
      ctx.lineTo(-4, 4);
      ctx.closePath();
      ctx.fill();

      // Pair of Branched Deer Antlers (Tsuno)
      [-1, 1].forEach((sign) => {
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-2, sign * 6);
        ctx.lineTo(-16, sign * 14);
        ctx.lineTo(-28, sign * 18);
        ctx.stroke();

        // Antler Fork
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-16, sign * 14);
        ctx.lineTo(-20, sign * 8);
        ctx.stroke();

        // Antler Gold Tip
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(-28, sign * 18, 2.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Glowing Golden/Amber Dragon Eye
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = 12;
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.ellipse(12, -4, 4, 2.5, -0.2, 0, Math.PI * 2);
      ctx.fill();

      // Vertical Slit Pupil
      ctx.fillStyle = '#0f172a';
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.ellipse(12, -4, 1, 2.5, -0.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // G. Dynamic Trailing Whiskers (Hige)
      [leftWhisker, rightWhisker].forEach((whisker) => {
        ctx.beginPath();
        ctx.moveTo(whisker[0].x, whisker[0].y);
        for (let k = 1; k < whisker.length; k++) {
          const xc = (whisker[k].x + whisker[k - 1].x) * 0.5;
          const yc = (whisker[k].y + whisker[k - 1].y) * 0.5;
          ctx.quadraticCurveTo(whisker[k - 1].x, whisker[k - 1].y, xc, yc);
        }
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.75)'; // Golden flowing whisker
        ctx.lineWidth = 1.8;
        ctx.lineCap = 'round';
        ctx.stroke();
      });

      ctx.restore();
    };

    // Resize Handler
    const handleResize = () => {
      width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.parentElement?.clientHeight || window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      waypoints = getWaypoints(width, height);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    // Intersection Observer to sleep when out of view (zero battery drain)
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(canvas);

    // Start loop
    render();

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ opacity }}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
