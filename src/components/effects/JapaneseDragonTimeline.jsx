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
 * High-Fidelity Japanese Imperial Dragon (Ryu / 龍) with Insane Kasumi & Kumo Mist
 * - Much larger, imposing scale (NUM_SEGMENTS = 58, torso width up to 46px, 1100px+ spine)
 * - Hyper-realistic Sumi-e details: ventral belly plates (Hara-tate), curved scales (Uroko),
 *   sharp fangs, glowing amber eyes, multi-tier deer antlers, 4-clawed muscular paws, and brush plume tail.
 * - Insane Japanese Mist (Kumo & Kasumi): multi-lobed cloud puffs, rolling atmospheric fog banks,
 *   nostril vapor exhalations, and golden/sakura embers.
 */
export default function JapaneseDragonTimeline({
  className = 'pointer-events-none absolute inset-0 z-0 overflow-hidden w-full h-full select-none',
  opacity = 0.9,
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

    // DPR Scaling for Ultra-Sharp High-DPI Screens
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Spine Configuration (58 articulated vertebrae nodes, broader and longer)
    const NUM_SEGMENTS = 58;
    const SEGMENT_LENGTH = 19;

    // Initialize Body Vertebrae
    const spine = Array.from({ length: NUM_SEGMENTS }, (_, i) => {
      const widthFactor = Math.sin((i / NUM_SEGMENTS) * Math.PI);
      return {
        x: width * 0.5 - i * SEGMENT_LENGTH,
        y: height * 0.2,
        angle: 0,
        width: Math.max(10, widthFactor * 32 + 14), // Torso reaches up to 46px width!
      };
    });

    // Whisker simulation nodes (9 articulated nodes per whisker for dramatic wave flow)
    const WHISKER_NODES = 9;
    const leftWhisker = Array.from({ length: WHISKER_NODES }, () => ({ x: 0, y: 0 }));
    const rightWhisker = Array.from({ length: WHISKER_NODES }, () => ({ x: 0, y: 0 }));

    // Multi-lobed Japanese Cloud / Mist Puffs (Kumo)
    const mistClouds = [];
    const MAX_MIST_CLOUDS = 42;

    // Luminous Sakura & Gold Embers
    const embers = [];
    const MAX_EMBERS = 50;

    // Background rolling Kasumi atmospheric fog banks (3 layered horizontal fog rivers)
    const fogBanks = [
      { yPercent: 0.18, speed: 0.22, offset: 0, amp: 28, height: 180, alpha: 0.28 },
      { yPercent: 0.52, speed: -0.16, offset: 120, amp: 35, height: 220, alpha: 0.24 },
      { yPercent: 0.82, speed: 0.18, offset: 260, amp: 30, height: 190, alpha: 0.26 },
    ];

    // Flight patrol circuit waypoints weaving around and between every card in the dossier
    const getWaypoints = (w, h) => [
      { x: w * 0.90, y: h * 0.07 }, // High right above CNPq/Lattes
      { x: w * 0.38, y: h * 0.11 }, // Swoop across header title
      { x: w * 0.08, y: h * 0.20 }, // Upper left loop
      { x: w * 0.48, y: h * 0.28 }, // Dive over featured paper card
      { x: w * 0.94, y: h * 0.40 }, // Wide sweep around right margin
      { x: w * 0.50, y: h * 0.52 }, // Center crossover between 2 columns
      { x: w * 0.06, y: h * 0.63 }, // Left flank loop outside column 1
      { x: w * 0.52, y: h * 0.74 }, // Center diagonal swoop between row 2
      { x: w * 0.92, y: h * 0.83 }, // Right flank loop outside certificates
      { x: w * 0.38, y: h * 0.96 }, // Deep bottom sweep under certificates
      { x: w * 0.05, y: h * 0.82 }, // Ascending left turn
      { x: w * 0.42, y: h * 0.46 }, // Center ascending crossing
    ];

    let waypoints = getWaypoints(width, height);

    // Path progression
    let pathProgress = 0.0;
    let baseSpeed = 0.00030;
    let currentSpeed = baseSpeed;

    // Scroll & Mouse Dynamic Velocity Tracking
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
      scrollVelocity = Math.min(delta * 0.00032, 0.0042);
      lastScrollY = currentScrollY;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Path position evaluator with Catmull-Rom
    const getPathPoint = (t) => {
      const n = waypoints.length;
      let normT = ((t % 1) + 1) % 1;
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

    // Spawn Multi-Lobed Japanese Mist Cloud (Kumo)
    const spawnMistCloud = (x, y, vx, vy, scale = 1.0, isDarkSmoke = false) => {
      if (mistClouds.length >= MAX_MIST_CLOUDS) mistClouds.shift();

      // 4-5 circular cloud lobes forming an organic Japanese cloud curl
      const lobes = [];
      const numLobes = 4 + Math.floor(Math.random() * 2);
      for (let l = 0; l < numLobes; l++) {
        const angle = (l / numLobes) * Math.PI * 2 + Math.random() * 0.5;
        const dist = (12 + Math.random() * 16) * scale;
        lobes.push({
          relX: Math.cos(angle) * dist,
          relY: Math.sin(angle) * dist,
          radius: (18 + Math.random() * 22) * scale,
        });
      }

      mistClouds.push({
        x: x + (Math.random() - 0.5) * 12,
        y: y + (Math.random() - 0.5) * 12,
        vx: vx * 0.15 + (Math.random() - 0.5) * 0.6,
        vy: vy * 0.15 + (Math.random() - 0.5) * 0.6,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.015,
        life: 1.0,
        decay: 0.009 + Math.random() * 0.007,
        scale: 0.85 * scale,
        growRate: 1.008,
        lobes,
        isDarkSmoke,
      });
    };

    // Spawn Luminous Sakura / Golden Ember
    const spawnEmber = (x, y, vx, vy) => {
      if (embers.length >= MAX_EMBERS) embers.shift();
      embers.push({
        x: x + (Math.random() - 0.5) * 10,
        y: y + (Math.random() - 0.5) * 10,
        vx: vx * 0.2 + (Math.random() - 0.5) * 0.9,
        vy: vy * 0.2 - (0.4 + Math.random() * 0.7), // Gently floats upward
        life: 1.0,
        decay: 0.016 + Math.random() * 0.014,
        size: 2.2 + Math.random() * 3.0,
        color: Math.random() > 0.45 ? '#f43f5e' : '#fbbf24', // Sakura Rose or Golden Amber
      });
    };

    // Main Animation Loop
    let time = 0;

    const render = () => {
      animId = requestAnimationFrame(render);
      if (!isVisible) return;

      time += 0.032;

      // Scroll speed decay & dynamic speed boost
      scrollVelocity *= 0.92;
      currentSpeed = baseSpeed + scrollVelocity;
      pathProgress += currentSpeed;

      // 1. Advance Dragon Head along Flight Spline
      const targetPoint = getPathPoint(pathProgress);
      const lookAheadPoint = getPathPoint(pathProgress + 0.002);

      let targetHeadX = targetPoint.x;
      let targetHeadY = targetPoint.y;

      // Magnetic Mouse Steering
      if (mouse.active) {
        const dx = mouse.x - targetHeadX;
        const dy = mouse.y - targetHeadY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 460) {
          const pull = (1 - dist / 460) * 52;
          targetHeadX += (dx / dist) * pull;
          targetHeadY += (dy / dist) * pull;
        }
      }

      const head = spine[0];
      head.x += (targetHeadX - head.x) * 0.12;
      head.y += (targetHeadY - head.y) * 0.12;
      head.angle = Math.atan2(lookAheadPoint.y - head.y, lookAheadPoint.x - head.x);

      // 2. Spine Kinematics & Wave Undulation (Fluid Aerial Swimming Motion)
      for (let i = 1; i < NUM_SEGMENTS; i++) {
        const prev = spine[i - 1];
        const cur = spine[i];

        const waveFreq = 0.24;
        const waveAmp = Math.sin((i / NUM_SEGMENTS) * Math.PI) * (18 + scrollVelocity * 3200);
        const lateralOffset = Math.sin(time * 2.7 - i * waveFreq) * waveAmp;

        const dx = cur.x - prev.x;
        const dy = cur.y - prev.y;
        const angle = Math.atan2(dy, dx);
        cur.angle = angle;

        const targetX = prev.x + Math.cos(angle) * SEGMENT_LENGTH;
        const targetY = prev.y + Math.sin(angle) * SEGMENT_LENGTH;

        const perpX = -Math.sin(angle) * (lateralOffset * 0.09);
        const perpY = Math.cos(angle) * (lateralOffset * 0.09);

        cur.x += (targetX + perpX - cur.x) * 0.52;
        cur.y += (targetY + perpY - cur.y) * 0.52;
      }

      // 3. Whisker Physics (Long flowing barbels)
      const whiskerBaseOffset = 14;
      leftWhisker[0] = {
        x: head.x + Math.cos(head.angle + 0.6) * whiskerBaseOffset,
        y: head.y + Math.sin(head.angle + 0.6) * whiskerBaseOffset,
      };
      rightWhisker[0] = {
        x: head.x + Math.cos(head.angle - 0.6) * whiskerBaseOffset,
        y: head.y + Math.sin(head.angle - 0.6) * whiskerBaseOffset,
      };

      for (let j = 1; j < WHISKER_NODES; j++) {
        const prevL = leftWhisker[j - 1];
        const curL = leftWhisker[j];
        const flutterL = Math.sin(time * 4.2 + j * 0.7) * 3.5;
        curL.x += (prevL.x - Math.cos(head.angle) * 11 - curL.x) * 0.38 + flutterL * 0.25;
        curL.y += (prevL.y - Math.sin(head.angle) * 11 - curL.y) * 0.38;

        const prevR = rightWhisker[j - 1];
        const curR = rightWhisker[j];
        const flutterR = Math.sin(time * 4.2 + j * 0.7 + Math.PI) * 3.5;
        curR.x += (prevR.x - Math.cos(head.angle) * 11 - curR.x) * 0.38 + flutterR * 0.25;
        curR.y += (prevR.y - Math.sin(head.angle) * 11 - curR.y) * 0.38;
      }

      // 4. Emit Mist Clouds & Embers
      // Nostril breath vapor
      if (Math.random() < 0.40) {
        const nostrilX = head.x + Math.cos(head.angle) * 26;
        const nostrilY = head.y + Math.sin(head.angle) * 26;
        spawnMistCloud(nostrilX, nostrilY, -Math.cos(head.angle) * 2.5, -Math.sin(head.angle) * 2.5, 0.55, false);
      }

      // Body & Claw Wake Mist Clouds
      if (Math.random() < 0.50 + scrollVelocity * 120) {
        const segIdx = 12 + Math.floor(Math.random() * (NUM_SEGMENTS - 20));
        const node = spine[segIdx];
        spawnMistCloud(node.x, node.y, -Math.cos(node.angle) * 1.8, -Math.sin(node.angle) * 1.8, 0.95 + Math.random() * 0.4, Math.random() > 0.65);
      }

      // Tail Sakura Embers
      if (Math.random() < 0.60) {
        const tail = spine[NUM_SEGMENTS - 1];
        spawnEmber(tail.x, tail.y, -Math.cos(tail.angle) * 2.0, -Math.sin(tail.angle) * 2.0);
      }

      // ----------------------------------------------------
      // DRAWING PASS
      // ----------------------------------------------------
      ctx.clearRect(0, 0, width, height);

      // ====================================================
      // LAYER 1: ATMOSPHERIC ROLLING KASUMI FOG BANKS
      // ====================================================
      ctx.save();
      fogBanks.forEach((bank, bIdx) => {
        bank.offset += bank.speed;
        const baseY = height * bank.yPercent;

        const fogGrad = ctx.createLinearGradient(0, baseY - bank.height * 0.5, 0, baseY + bank.height * 0.5);
        fogGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        fogGrad.addColorStop(0.3, `rgba(255, 255, 255, ${bank.alpha})`);
        fogGrad.addColorStop(0.7, `rgba(244, 246, 250, ${bank.alpha * 0.85})`);
        fogGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = fogGrad;
        ctx.beginPath();
        ctx.moveTo(0, baseY + bank.height);

        const step = 60;
        for (let x = 0; x <= width + step; x += step) {
          const wave =
            Math.sin(x * 0.004 + bank.offset * 0.02) * bank.amp +
            Math.cos(x * 0.008 - time * 0.8 + bIdx) * (bank.amp * 0.5);
          ctx.lineTo(x, baseY - bank.height * 0.4 + wave);
        }

        ctx.lineTo(width, baseY + bank.height);
        ctx.closePath();
        ctx.fill();
      });
      ctx.restore();

      // ====================================================
      // LAYER 2: VOLUMETRIC KUMO MIST PUFFS (Dragon Wake)
      // ====================================================
      for (let m = mistClouds.length - 1; m >= 0; m--) {
        const cloud = mistClouds[m];
        cloud.x += cloud.vx;
        cloud.y += cloud.vy;
        cloud.rotation += cloud.rotSpeed;
        cloud.scale *= cloud.growRate;
        cloud.life -= cloud.decay;

        if (cloud.life <= 0) {
          mistClouds.splice(m, 1);
          continue;
        }

        ctx.save();
        ctx.translate(cloud.x, cloud.y);
        ctx.rotate(cloud.rotation);
        ctx.scale(cloud.scale, cloud.scale);

        // Render each puffy lobe with soft radial gradient
        cloud.lobes.forEach((lobe) => {
          const grad = ctx.createRadialGradient(lobe.relX, lobe.relY, 0, lobe.relX, lobe.relY, lobe.radius);
          if (cloud.isDarkSmoke) {
            // Soft Sumi-e ink vapor
            grad.addColorStop(0, `rgba(30, 41, 59, ${(cloud.life * 0.12).toFixed(3)})`);
            grad.addColorStop(0.6, `rgba(51, 65, 85, ${(cloud.life * 0.06).toFixed(3)})`);
            grad.addColorStop(1, 'rgba(30, 41, 59, 0)');
          } else {
            // Ethereal white celestial mist
            grad.addColorStop(0, `rgba(255, 255, 255, ${(cloud.life * 0.35).toFixed(3)})`);
            grad.addColorStop(0.5, `rgba(245, 248, 255, ${(cloud.life * 0.22).toFixed(3)})`);
            grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
          }

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(lobe.relX, lobe.relY, lobe.radius, 0, Math.PI * 2);
          ctx.fill();
        });

        ctx.restore();
      }

      // ====================================================
      // LAYER 3: LUMINOUS SAKURA & GOLDEN EMBERS
      // ====================================================
      for (let e = embers.length - 1; e >= 0; e--) {
        const emb = embers[e];
        emb.x += emb.vx;
        emb.y += emb.vy;
        emb.life -= emb.decay;

        if (emb.life <= 0) {
          embers.splice(e, 1);
          continue;
        }

        ctx.save();
        ctx.shadowColor = emb.color;
        ctx.shadowBlur = 8;
        ctx.fillStyle = emb.color;
        ctx.globalAlpha = emb.life * 0.85;
        ctx.beginPath();
        ctx.arc(emb.x, emb.y, emb.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // ====================================================
      // LAYER 4: THE IMPERIAL SUMI-E DRAGON (RYU / 龍)
      // ====================================================
      ctx.save();

      // Construct Ribbon Profile Points
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

      // Main Dragon Body Gradient
      const bodyGrad = ctx.createLinearGradient(
        spine[0].x,
        spine[0].y,
        spine[NUM_SEGMENTS - 1].x,
        spine[NUM_SEGMENTS - 1].y
      );
      bodyGrad.addColorStop(0, 'rgba(15, 19, 26, 0.72)');
      bodyGrad.addColorStop(0.25, 'rgba(26, 32, 44, 0.65)');
      bodyGrad.addColorStop(0.65, 'rgba(190, 24, 60, 0.52)'); // Deep Carmine Sakura glow
      bodyGrad.addColorStop(1, 'rgba(15, 19, 26, 0.42)');

      // Draw Serpentine Body Ribbon
      ctx.beginPath();
      ctx.moveTo(leftPoints[0].x, leftPoints[0].y);
      for (let i = 1; i < leftPoints.length; i++) {
        const xc = (leftPoints[i].x + leftPoints[i - 1].x) * 0.5;
        const yc = (leftPoints[i].y + leftPoints[i - 1].y) * 0.5;
        ctx.quadraticCurveTo(leftPoints[i - 1].x, leftPoints[i - 1].y, xc, yc);
      }
      ctx.lineTo(leftPoints[leftPoints.length - 1].x, leftPoints[leftPoints.length - 1].y);

      const tailTip = spine[NUM_SEGMENTS - 1];
      ctx.lineTo(tailTip.x, tailTip.y);

      for (let i = rightPoints.length - 1; i > 0; i--) {
        const xc = (rightPoints[i].x + rightPoints[i - 1].x) * 0.5;
        const yc = (rightPoints[i].y + rightPoints[i - 1].y) * 0.5;
        ctx.quadraticCurveTo(rightPoints[i].x, rightPoints[i - 1].y, xc, yc);
      }
      ctx.lineTo(rightPoints[0].x, rightPoints[0].y);
      ctx.closePath();

      ctx.fillStyle = bodyGrad;
      ctx.fill();

      // Calligraphic ink contour outline
      ctx.strokeStyle = 'rgba(10, 14, 20, 0.55)';
      ctx.lineWidth = 2.4;
      ctx.stroke();

      // ====================================================
      // 4A. VENTRAL BELLY PLATES (HARA-TATE / 腹板)
      // Segmented ivory/washi belly bands along the inner curve
      // ====================================================
      for (let i = 3; i < NUM_SEGMENTS - 5; i += 2) {
        const node = spine[i];
        const normal = node.angle + Math.PI * 0.5;
        const bW = node.width * 0.38;

        // Draw segmented belly plate
        ctx.fillStyle = 'rgba(254, 243, 199, 0.38)'; // Pale washi cream
        ctx.beginPath();
        ctx.ellipse(node.x - Math.cos(normal) * (bW * 0.5), node.y - Math.sin(normal) * (bW * 0.5), bW, 4.5, node.angle, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(180, 83, 9, 0.35)'; // Amber/sepia segment line
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // ====================================================
      // 4B. OVERLAPPING BODY SCALES (UROKO / 鱗)
      // Delicate curved ink scale texture arcs along the dorsal body
      // ====================================================
      for (let i = 4; i < NUM_SEGMENTS - 6; i += 3) {
        const node = spine[i];
        const normal = node.angle + Math.PI * 0.5;
        const scaleRadius = node.width * 0.28;

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)'; // Luminous scale edge
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(
          node.x + Math.cos(normal) * (node.width * 0.22),
          node.y + Math.sin(normal) * (node.width * 0.22),
          scaleRadius,
          node.angle - 1.2,
          node.angle + 1.2
        );
        ctx.stroke();
      }

      // ====================================================
      // 4C. DORSAL FLAME CREST FINS (SEHIRE / 背鰭)
      // Serrated fiery spines undulating along the back
      // ====================================================
      for (let i = 3; i < NUM_SEGMENTS - 5; i += 2) {
        const node = spine[i];
        const finAngle = node.angle + Math.PI * 0.5;
        const finLength = node.width * 0.95 + Math.sin(time * 3.2 + i * 0.45) * 6;
        const finBase = 8;

        // Gradient fin tip
        ctx.fillStyle = 'rgba(225, 29, 72, 0.55)'; // Crimson flame
        ctx.beginPath();
        ctx.moveTo(node.x - Math.cos(node.angle) * finBase, node.y - Math.sin(node.angle) * finBase);
        ctx.lineTo(node.x + Math.cos(finAngle) * finLength, node.y + Math.sin(finAngle) * finLength);
        ctx.lineTo(node.x + Math.cos(node.angle) * finBase, node.y + Math.sin(node.angle) * finBase);
        ctx.closePath();
        ctx.fill();

        // Gold tipped spine highlight
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(node.x + Math.cos(finAngle) * finLength, node.y + Math.sin(finAngle) * finLength, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }

      // ====================================================
      // 4D. FOUR MUSCULAR IMPERIAL LEGS & CLAWS (TSUME / 爪)
      // 3-jointed legs with 4 curved talons and knuckles
      // ====================================================
      const legSegments = [12, 22, 34, 44];
      legSegments.forEach((segIdx, legIdx) => {
        const node = spine[segIdx];
        const side = legIdx % 2 === 0 ? 1 : -1;
        const legBaseAngle = node.angle + side * 1.35;
        const hipX = node.x + Math.cos(node.angle + side * Math.PI * 0.5) * (node.width * 0.48);
        const hipY = node.y + Math.sin(node.angle + side * Math.PI * 0.5) * (node.width * 0.48);

        // Thigh
        const thighLen = 22;
        const kneeX = hipX + Math.cos(legBaseAngle) * thighLen;
        const kneeY = hipY + Math.sin(legBaseAngle) * thighLen;

        // Shin
        const shinAngle = legBaseAngle + side * 0.75 + Math.sin(time * 3 + legIdx) * 0.15;
        const shinLen = 18;
        const ankleX = kneeX + Math.cos(shinAngle) * shinLen;
        const ankleY = kneeY + Math.sin(shinAngle) * shinLen;

        // Paw Pad
        ctx.strokeStyle = 'rgba(20, 24, 34, 0.75)';
        ctx.lineWidth = 5.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(hipX, hipY);
        ctx.lineTo(kneeX, kneeY);
        ctx.lineTo(ankleX, ankleY);
        ctx.stroke();

        // 4 Curved Razor Talons
        for (let c = -1.5; c <= 1.5; c += 1.0) {
          const clawAngle = shinAngle + c * 0.4;
          const clawLen = 12;
          const tipX = ankleX + Math.cos(clawAngle) * clawLen;
          const tipY = ankleY + Math.sin(clawAngle) * clawLen;

          // Talon body
          ctx.strokeStyle = '#e11d48'; // Crimson talons
          ctx.lineWidth = 2.8;
          ctx.beginPath();
          ctx.moveTo(ankleX, ankleY);
          ctx.quadraticCurveTo(
            ankleX + Math.cos(clawAngle) * (clawLen * 0.6) + side * 3,
            ankleY + Math.sin(clawAngle) * (clawLen * 0.6),
            tipX,
            tipY
          );
          ctx.stroke();

          // Silver talon tip
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(tipX, tipY, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // ====================================================
      // 4E. CALLIGRAPHIC INK BRUSH TAIL PLUME (OPPO / 尾)
      // Massive flared flame fan of calligraphic streaks
      // ====================================================
      const tailNode = spine[NUM_SEGMENTS - 1];
      const tailAngle = tailNode.angle;
      for (let t = -3; t <= 3; t++) {
        const tuftAngle = tailAngle + t * 0.28 + Math.sin(time * 3 + t * 0.7) * 0.25;
        const tuftLen = 42 - Math.abs(t) * 6;

        ctx.fillStyle = t % 2 === 0 ? 'rgba(225, 29, 72, 0.65)' : 'rgba(20, 24, 34, 0.75)';
        ctx.beginPath();
        ctx.moveTo(tailNode.x, tailNode.y);
        ctx.quadraticCurveTo(
          tailNode.x + Math.cos(tuftAngle) * (tuftLen * 0.5) + t * 5,
          tailNode.y + Math.sin(tuftAngle) * (tuftLen * 0.5),
          tailNode.x + Math.cos(tuftAngle) * tuftLen,
          tailNode.y + Math.sin(tuftAngle) * tuftLen
        );
        ctx.lineTo(tailNode.x, tailNode.y);
        ctx.fill();
      }

      // ====================================================
      // 4F. THE IMPERIAL DRAGON HEAD (ATAMA / 頭)
      // Imposing skull, deer antlers, fangs, glowing eyes, flowing mane
      // ====================================================
      ctx.save();
      ctx.translate(head.x, head.y);
      ctx.rotate(head.angle);

      // Skull Base
      ctx.fillStyle = 'rgba(16, 20, 28, 0.92)';
      ctx.beginPath();
      ctx.ellipse(6, 0, 32, 20, 0, 0, Math.PI * 2);
      ctx.fill();

      // Snout / Upper Jaw (46px long)
      ctx.beginPath();
      ctx.moveTo(14, -14);
      ctx.lineTo(42, -9);
      ctx.lineTo(46, 0);
      ctx.lineTo(42, 9);
      ctx.lineTo(14, 14);
      ctx.closePath();
      ctx.fillStyle = 'rgba(22, 28, 38, 0.95)';
      ctx.fill();

      // Lower Jaw (36px long)
      ctx.beginPath();
      ctx.moveTo(14, 8);
      ctx.lineTo(34, 11);
      ctx.lineTo(28, 17);
      ctx.lineTo(10, 14);
      ctx.closePath();
      ctx.fillStyle = 'rgba(30, 38, 50, 0.92)';
      ctx.fill();

      // Fangs (Kiba / 牙) in Ivory White
      ctx.fillStyle = '#f8fafc';
      // Upper Fang
      ctx.beginPath();
      ctx.moveTo(34, 4);
      ctx.lineTo(36, 12);
      ctx.lineTo(38, 4);
      ctx.closePath();
      ctx.fill();

      // Lower Fang
      ctx.beginPath();
      ctx.moveTo(26, 11);
      ctx.lineTo(28, 3);
      ctx.lineTo(30, 11);
      ctx.closePath();
      ctx.fill();

      // Flared Nostrils
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.ellipse(38, -4, 3, 2, -0.3, 0, Math.PI * 2);
      ctx.fill();

      // Flowing Beard / Mane under Chin (Tategami)
      for (let b = 0; b < 3; b++) {
        ctx.fillStyle = b === 1 ? 'rgba(225, 29, 72, 0.75)' : 'rgba(20, 24, 34, 0.85)';
        ctx.beginPath();
        ctx.moveTo(10, 10 + b * 2);
        ctx.quadraticCurveTo(
          -14,
          24 + b * 6 + Math.sin(time * 3.8 + b) * 5,
          -32 - b * 6,
          16 + b * 4
        );
        ctx.lineTo(-4, 6);
        ctx.closePath();
        ctx.fill();
      }

      // Crown Mane streaming backward from head
      for (let m = 0; m < 4; m++) {
        ctx.fillStyle = m % 2 === 0 ? 'rgba(225, 29, 72, 0.70)' : 'rgba(30, 41, 59, 0.85)';
        ctx.beginPath();
        ctx.moveTo(-6, -8 + m * 5);
        ctx.quadraticCurveTo(
          -28,
          -22 + m * 8 + Math.sin(time * 3.5 + m) * 4,
          -48 - m * 8,
          -14 + m * 6
        );
        ctx.lineTo(-12, -2);
        ctx.closePath();
        ctx.fill();
      }

      // Pair of Magnificent Branched Deer Antlers (Tsuno / 角)
      [-1, 1].forEach((sign) => {
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 4.5;
        ctx.lineCap = 'round';

        // Main antler beam (50px)
        ctx.beginPath();
        ctx.moveTo(-4, sign * 10);
        ctx.quadraticCurveTo(-22, sign * 24, -44, sign * 30);
        ctx.stroke();

        // Fork 1 (Front tine)
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        ctx.moveTo(-22, sign * 24);
        ctx.lineTo(-30, sign * 14);
        ctx.stroke();

        // Fork 2 (Top tine)
        ctx.beginPath();
        ctx.moveTo(-32, sign * 27);
        ctx.lineTo(-42, sign * 20);
        ctx.stroke();

        // Luminous Golden Antler Tips
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(-44, sign * 30, 3.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(-30, sign * 14, 2.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Hyper-Realistic Glowing Golden Amber Eye
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = 18;
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.ellipse(18, -6, 6.5, 4.2, -0.25, 0, Math.PI * 2);
      ctx.fill();

      // Slit Pupil
      ctx.fillStyle = '#0f172a';
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.ellipse(18, -6, 1.8, 4.2, -0.25, 0, Math.PI * 2);
      ctx.fill();

      // Specular Gleam
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(16.5, -7.5, 1.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // ====================================================
      // 4G. DYNAMIC TRAILING WHISKERS (HIGE / 髭)
      // Long sweeping golden barbels undulating with fluid inertia
      // ====================================================
      [leftWhisker, rightWhisker].forEach((whisker) => {
        ctx.beginPath();
        ctx.moveTo(whisker[0].x, whisker[0].y);
        for (let k = 1; k < whisker.length; k++) {
          const xc = (whisker[k].x + whisker[k - 1].x) * 0.5;
          const yc = (whisker[k].y + whisker[k - 1].y) * 0.5;
          ctx.quadraticCurveTo(whisker[k - 1].x, whisker[k - 1].y, xc, yc);
        }
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.85)'; // Radiant gold
        ctx.lineWidth = 2.4;
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

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(canvas);

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
