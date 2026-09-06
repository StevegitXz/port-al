import React, { useEffect, useRef } from 'react';

/**
 * Catmull-Rom Spline interpolation for silky smooth closed 3D flight trajectories
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
 * High-Fidelity Japanese Imperial Dragon (Ryu / 龍) with Multi-Layer Z-Depth
 * - 2-Canvas Stacking Architecture:
 *   1. Background Canvas (z-0): Deep atmospheric Kasumi fog rivers and submerged dragon segments behind cards (z-10).
 *   2. Foreground Canvas (z-20): Surfaced dragon segments, glowing amber eyes, golden whiskers,
 *      razor claws and mist soaring DIRECTLY OVER the cards with physical drop-shadow.
 * - Periodic Surfacing: Weaves in and out of the card layer dynamically and organically ("de vez em quando").
 * - Zero impact on card usability: Both canvases have pointer-events-none, keeping all links and buttons 100% interactive.
 */
export default function JapaneseDragonTimeline({
  opacity = 0.92,
}) {
  const bgCanvasRef = useRef(null);
  const fgCanvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const bgCanvas = bgCanvasRef.current;
    const fgCanvas = fgCanvasRef.current;
    if (!bgCanvas || !fgCanvas) return;

    const bgCtx = bgCanvas.getContext('2d');
    const fgCtx = fgCanvas.getContext('2d');
    if (!bgCtx || !fgCtx) return;

    let animId;
    let isVisible = true;

    // Dimensions
    let width = bgCanvas.parentElement?.clientWidth || window.innerWidth;
    let height = bgCanvas.parentElement?.clientHeight || window.innerHeight;

    // DPR Scaling for Ultra-Sharp High-DPI Screens
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const setupCanvas = (c, ctx) => {
      c.width = width * dpr;
      c.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    setupCanvas(bgCanvas, bgCtx);
    setupCanvas(fgCanvas, fgCtx);

    // Spine Configuration (58 articulated vertebrae nodes, broader and longer)
    const NUM_SEGMENTS = 58;
    const SEGMENT_LENGTH = 19;

    // Initialize Body Vertebrae with 3D coordinate (x, y, z)
    const spine = Array.from({ length: NUM_SEGMENTS }, (_, i) => {
      const widthFactor = Math.sin((i / NUM_SEGMENTS) * Math.PI);
      return {
        x: width * 0.5 - i * SEGMENT_LENGTH,
        y: height * 0.2,
        z: -1.0, // Starts submerged in background mist
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

    // Flight patrol circuit waypoints with (x, y, z) coordinates:
    // z > 0: Surfaced OVER cards (Foreground Canvas z-20)
    // z < 0: Submerged in background mist BEHIND cards (Background Canvas z-0)
    const getWaypoints = (w, h) => [
      { x: w * 0.90, y: h * 0.07, z: -1.0 }, // Behind top right margin
      { x: w * 0.42, y: h * 0.11, z: 0.95 }, // Surfacing over Lattes card and top header
      { x: w * 0.08, y: h * 0.20, z: -1.0 }, // Diving behind upper left margin
      { x: w * 0.50, y: h * 0.28, z: 1.45 }, // SURFACED MAJESTICALLY OVER FEATURED CSBC 2025 PAPER CARD!
      { x: w * 0.94, y: h * 0.40, z: -1.0 }, // Diving behind right gutter
      { x: w * 0.50, y: h * 0.52, z: 1.30 }, // SURFACED OVER CENTER RECORDS (Row 1)!
      { x: w * 0.06, y: h * 0.63, z: -1.0 }, // Diving behind left gutter
      { x: w * 0.52, y: h * 0.74, z: 1.35 }, // SURFACED OVER LOWER RECORDS (Row 2)!
      { x: w * 0.92, y: h * 0.83, z: -1.0 }, // Diving behind right gutter
      { x: w * 0.44, y: h * 0.95, z: 0.85 }, // Low sweep under certificates
      { x: w * 0.05, y: h * 0.82, z: -1.0 }, // Diving behind bottom left margin
      { x: w * 0.42, y: h * 0.46, z: -0.6 }, // Submerged ascending crossover
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
      const rect = bgCanvas.getBoundingClientRect();
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

    // Path position evaluator with Catmull-Rom (X, Y, Z)
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
        z: catmullRom(waypoints[i0].z, waypoints[i1].z, waypoints[i2].z, waypoints[i3].z, localT),
      };
    };

    // Spawn Multi-Lobed Japanese Mist Cloud (Kumo)
    const spawnMistCloud = (x, y, vx, vy, scale = 1.0, isDarkSmoke = false, isForeground = false) => {
      if (mistClouds.length >= MAX_MIST_CLOUDS) mistClouds.shift();

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
        isForeground,
      });
    };

    // Spawn Luminous Sakura / Golden Ember
    const spawnEmber = (x, y, vx, vy, isForeground = false) => {
      if (embers.length >= MAX_EMBERS) embers.shift();
      embers.push({
        x: x + (Math.random() - 0.5) * 10,
        y: y + (Math.random() - 0.5) * 10,
        vx: vx * 0.2 + (Math.random() - 0.5) * 0.9,
        vy: vy * 0.2 - (0.4 + Math.random() * 0.7),
        life: 1.0,
        decay: 0.016 + Math.random() * 0.014,
        size: 2.2 + Math.random() * 3.0,
        color: Math.random() > 0.45 ? '#f43f5e' : '#fbbf24',
        isForeground,
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

      // 1. Advance Dragon Head along Flight Spline (X, Y, Z)
      const targetPoint = getPathPoint(pathProgress);
      const lookAheadPoint = getPathPoint(pathProgress + 0.002);

      let targetHeadX = targetPoint.x;
      let targetHeadY = targetPoint.y;

      // Periodic macro cycle for surfacing ("passar de vez em quando"):
      // Sine wave with period ~26 seconds: modulates when the dragon breaches into the foreground
      const macroSurfacingCycle = Math.sin(time * 0.22);
      const isSurfacingPhase = macroSurfacingCycle > -0.20;
      const surfacingAmp = isSurfacingPhase ? (macroSurfacingCycle + 0.20) * 0.85 + 0.45 : 0;

      let targetHeadZ = targetPoint.z > 0 ? targetPoint.z * surfacingAmp : targetPoint.z;

      // Magnetic Mouse Steering & Surfacing Elevation Boost
      if (mouse.active) {
        const dx = mouse.x - targetHeadX;
        const dy = mouse.y - targetHeadY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 460) {
          const pull = (1 - dist / 460) * 52;
          targetHeadX += (dx / dist) * pull;
          targetHeadY += (dy / dist) * pull;
          targetHeadZ += (1 - dist / 460) * 0.95; // Surfacing pull near cursor!
        }
      }

      const head = spine[0];
      head.x += (targetHeadX - head.x) * 0.12;
      head.y += (targetHeadY - head.y) * 0.12;
      head.z += (targetHeadZ - head.z) * 0.12;
      head.angle = Math.atan2(lookAheadPoint.y - head.y, lookAheadPoint.x - head.x);

      // 2. Spine Kinematics & Wave Undulation (Fluid Aerial Swimming Motion)
      for (let i = 1; i < NUM_SEGMENTS; i++) {
        const prev = spine[i - 1];
        const cur = spine[i];

        // Propagate depth Z through spine like a wave
        cur.z += (prev.z - cur.z) * 0.42;

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

      // 3. Whisker Physics
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

      // 4. Emit Mist Clouds & Embers (flagged with isForeground based on node.z)
      // Nostril breath vapor
      if (Math.random() < 0.40) {
        const nostrilX = head.x + Math.cos(head.angle) * 26;
        const nostrilY = head.y + Math.sin(head.angle) * 26;
        spawnMistCloud(nostrilX, nostrilY, -Math.cos(head.angle) * 2.5, -Math.sin(head.angle) * 2.5, 0.55, false, head.z > 0.05);
      }

      // Body & Claw Wake Mist Clouds
      if (Math.random() < 0.50 + scrollVelocity * 120) {
        const segIdx = 12 + Math.floor(Math.random() * (NUM_SEGMENTS - 20));
        const node = spine[segIdx];
        spawnMistCloud(node.x, node.y, -Math.cos(node.angle) * 1.8, -Math.sin(node.angle) * 1.8, 0.95 + Math.random() * 0.4, Math.random() > 0.65, node.z > 0.05);
      }

      // Tail Sakura Embers
      if (Math.random() < 0.60) {
        const tail = spine[NUM_SEGMENTS - 1];
        spawnEmber(tail.x, tail.y, -Math.cos(tail.angle) * 2.0, -Math.sin(tail.angle) * 2.0, tail.z > 0.05);
      }

      // ----------------------------------------------------
      // DRAWING PASS (Clear both Background & Foreground)
      // ----------------------------------------------------
      bgCtx.clearRect(0, 0, width, height);
      fgCtx.clearRect(0, 0, width, height);

      bgCtx.globalAlpha = opacity;
      fgCtx.globalAlpha = opacity;

      // ====================================================
      // LAYER 1: ATMOSPHERIC ROLLING KASUMI FOG BANKS (Always Background)
      // ====================================================
      bgCtx.save();
      fogBanks.forEach((bank, bIdx) => {
        bank.offset += bank.speed;
        const baseY = height * bank.yPercent;

        const fogGrad = bgCtx.createLinearGradient(0, baseY - bank.height * 0.5, 0, baseY + bank.height * 0.5);
        fogGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        fogGrad.addColorStop(0.3, `rgba(255, 255, 255, ${bank.alpha})`);
        fogGrad.addColorStop(0.7, `rgba(244, 246, 250, ${bank.alpha * 0.85})`);
        fogGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        bgCtx.fillStyle = fogGrad;
        bgCtx.beginPath();
        bgCtx.moveTo(0, baseY + bank.height);

        const step = 60;
        for (let x = 0; x <= width + step; x += step) {
          const wave =
            Math.sin(x * 0.004 + bank.offset * 0.02) * bank.amp +
            Math.cos(x * 0.008 - time * 0.8 + bIdx) * (bank.amp * 0.5);
          bgCtx.lineTo(x, baseY - bank.height * 0.4 + wave);
        }

        bgCtx.lineTo(width, baseY + bank.height);
        bgCtx.closePath();
        bgCtx.fill();
      });
      bgCtx.restore();

      // ====================================================
      // LAYER 2: VOLUMETRIC KUMO MIST PUFFS (Dispatched to bgCtx or fgCtx)
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

        const targetCtx = cloud.isForeground ? fgCtx : bgCtx;
        targetCtx.save();
        targetCtx.translate(cloud.x, cloud.y);
        targetCtx.rotate(cloud.rotation);
        targetCtx.scale(cloud.scale, cloud.scale);

        cloud.lobes.forEach((lobe) => {
          const grad = targetCtx.createRadialGradient(lobe.relX, lobe.relY, 0, lobe.relX, lobe.relY, lobe.radius);
          if (cloud.isDarkSmoke) {
            grad.addColorStop(0, `rgba(30, 41, 59, ${(cloud.life * 0.12).toFixed(3)})`);
            grad.addColorStop(0.6, `rgba(51, 65, 85, ${(cloud.life * 0.06).toFixed(3)})`);
            grad.addColorStop(1, 'rgba(30, 41, 59, 0)');
          } else {
            grad.addColorStop(0, `rgba(255, 255, 255, ${(cloud.life * 0.35).toFixed(3)})`);
            grad.addColorStop(0.5, `rgba(245, 248, 255, ${(cloud.life * 0.22).toFixed(3)})`);
            grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
          }

          targetCtx.fillStyle = grad;
          targetCtx.beginPath();
          targetCtx.arc(lobe.relX, lobe.relY, lobe.radius, 0, Math.PI * 2);
          targetCtx.fill();
        });

        targetCtx.restore();
      }

      // ====================================================
      // LAYER 3: LUMINOUS SAKURA & GOLDEN EMBERS (Dispatched to bgCtx or fgCtx)
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

        const targetCtx = emb.isForeground ? fgCtx : bgCtx;
        targetCtx.save();
        targetCtx.shadowColor = emb.color;
        targetCtx.shadowBlur = 8;
        targetCtx.fillStyle = emb.color;
        targetCtx.globalAlpha = emb.life * 0.85;
        targetCtx.beginPath();
        targetCtx.arc(emb.x, emb.y, emb.size * 0.5, 0, Math.PI * 2);
        targetCtx.fill();
        targetCtx.restore();
      }

      // ====================================================
      // LAYER 4: THE IMPERIAL SUMI-E DRAGON (RYU / 龍)
      // ====================================================
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

      // Helper to generate body gradient on any context
      const createDragonGrad = (targetCtx) => {
        const grad = targetCtx.createLinearGradient(
          spine[0].x,
          spine[0].y,
          spine[NUM_SEGMENTS - 1].x,
          spine[NUM_SEGMENTS - 1].y
        );
        grad.addColorStop(0, 'rgba(15, 19, 26, 0.72)');
        grad.addColorStop(0.25, 'rgba(26, 32, 44, 0.65)');
        grad.addColorStop(0.65, 'rgba(190, 24, 60, 0.52)');
        grad.addColorStop(1, 'rgba(15, 19, 26, 0.42)');
        return grad;
      };

      // 4A. DRAW ON BACKGROUND CANVAS (Full continuous dragon ribbon)
      bgCtx.save();
      const bgBodyGrad = createDragonGrad(bgCtx);

      bgCtx.beginPath();
      bgCtx.moveTo(leftPoints[0].x, leftPoints[0].y);
      for (let i = 1; i < leftPoints.length; i++) {
        const xc = (leftPoints[i].x + leftPoints[i - 1].x) * 0.5;
        const yc = (leftPoints[i].y + leftPoints[i - 1].y) * 0.5;
        bgCtx.quadraticCurveTo(leftPoints[i - 1].x, leftPoints[i - 1].y, xc, yc);
      }
      bgCtx.lineTo(leftPoints[leftPoints.length - 1].x, leftPoints[leftPoints.length - 1].y);

      const tailTip = spine[NUM_SEGMENTS - 1];
      bgCtx.lineTo(tailTip.x, tailTip.y);

      for (let i = rightPoints.length - 1; i > 0; i--) {
        const xc = (rightPoints[i].x + rightPoints[i - 1].x) * 0.5;
        const yc = (rightPoints[i].y + rightPoints[i - 1].y) * 0.5;
        bgCtx.quadraticCurveTo(rightPoints[i].x, rightPoints[i - 1].y, xc, yc);
      }
      bgCtx.lineTo(rightPoints[0].x, rightPoints[0].y);
      bgCtx.closePath();

      bgCtx.fillStyle = bgBodyGrad;
      bgCtx.fill();

      bgCtx.strokeStyle = 'rgba(10, 14, 20, 0.55)';
      bgCtx.lineWidth = 2.4;
      bgCtx.stroke();

      // Background Belly Plates
      for (let i = 3; i < NUM_SEGMENTS - 5; i += 2) {
        const node = spine[i];
        const normal = node.angle + Math.PI * 0.5;
        const bW = node.width * 0.38;

        bgCtx.fillStyle = 'rgba(254, 243, 199, 0.38)';
        bgCtx.beginPath();
        bgCtx.ellipse(node.x - Math.cos(normal) * (bW * 0.5), node.y - Math.sin(normal) * (bW * 0.5), bW, 4.5, node.angle, 0, Math.PI * 2);
        bgCtx.fill();

        bgCtx.strokeStyle = 'rgba(180, 83, 9, 0.35)';
        bgCtx.lineWidth = 1.2;
        bgCtx.stroke();
      }

      // Background Scales
      for (let i = 4; i < NUM_SEGMENTS - 6; i += 3) {
        const node = spine[i];
        const normal = node.angle + Math.PI * 0.5;
        const scaleRadius = node.width * 0.28;

        bgCtx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
        bgCtx.lineWidth = 1.4;
        bgCtx.beginPath();
        bgCtx.arc(
          node.x + Math.cos(normal) * (node.width * 0.22),
          node.y + Math.sin(normal) * (node.width * 0.22),
          scaleRadius,
          node.angle - 1.2,
          node.angle + 1.2
        );
        bgCtx.stroke();
      }

      // Background Dorsal Fins
      for (let i = 3; i < NUM_SEGMENTS - 5; i += 2) {
        const node = spine[i];
        const finAngle = node.angle + Math.PI * 0.5;
        const finLength = node.width * 0.95 + Math.sin(time * 3.2 + i * 0.45) * 6;
        const finBase = 8;

        bgCtx.fillStyle = 'rgba(225, 29, 72, 0.55)';
        bgCtx.beginPath();
        bgCtx.moveTo(node.x - Math.cos(node.angle) * finBase, node.y - Math.sin(node.angle) * finBase);
        bgCtx.lineTo(node.x + Math.cos(finAngle) * finLength, node.y + Math.sin(finAngle) * finLength);
        bgCtx.lineTo(node.x + Math.cos(node.angle) * finBase, node.y + Math.sin(node.angle) * finBase);
        bgCtx.closePath();
        bgCtx.fill();

        bgCtx.fillStyle = '#fbbf24';
        bgCtx.beginPath();
        bgCtx.arc(node.x + Math.cos(finAngle) * finLength, node.y + Math.sin(finAngle) * finLength, 1.8, 0, Math.PI * 2);
        bgCtx.fill();
      }

      // Background Legs & Claws
      const legSegments = [12, 22, 34, 44];
      legSegments.forEach((segIdx, legIdx) => {
        const node = spine[segIdx];
        const side = legIdx % 2 === 0 ? 1 : -1;
        const legBaseAngle = node.angle + side * 1.35;
        const hipX = node.x + Math.cos(node.angle + side * Math.PI * 0.5) * (node.width * 0.48);
        const hipY = node.y + Math.sin(node.angle + side * Math.PI * 0.5) * (node.width * 0.48);

        const thighLen = 22;
        const kneeX = hipX + Math.cos(legBaseAngle) * thighLen;
        const kneeY = hipY + Math.sin(legBaseAngle) * thighLen;

        const shinAngle = legBaseAngle + side * 0.75 + Math.sin(time * 3 + legIdx) * 0.15;
        const shinLen = 18;
        const ankleX = kneeX + Math.cos(shinAngle) * shinLen;
        const ankleY = kneeY + Math.sin(shinAngle) * shinLen;

        bgCtx.strokeStyle = 'rgba(20, 24, 34, 0.75)';
        bgCtx.lineWidth = 5.5;
        bgCtx.lineCap = 'round';
        bgCtx.beginPath();
        bgCtx.moveTo(hipX, hipY);
        bgCtx.lineTo(kneeX, kneeY);
        bgCtx.lineTo(ankleX, ankleY);
        bgCtx.stroke();

        for (let c = -1.5; c <= 1.5; c += 1.0) {
          const clawAngle = shinAngle + c * 0.4;
          const clawLen = 12;
          const tipX = ankleX + Math.cos(clawAngle) * clawLen;
          const tipY = ankleY + Math.sin(clawAngle) * clawLen;

          bgCtx.strokeStyle = '#e11d48';
          bgCtx.lineWidth = 2.8;
          bgCtx.beginPath();
          bgCtx.moveTo(ankleX, ankleY);
          bgCtx.quadraticCurveTo(
            ankleX + Math.cos(clawAngle) * (clawLen * 0.6) + side * 3,
            ankleY + Math.sin(clawAngle) * (clawLen * 0.6),
            tipX,
            tipY
          );
          bgCtx.stroke();

          bgCtx.fillStyle = '#ffffff';
          bgCtx.beginPath();
          bgCtx.arc(tipX, tipY, 1.2, 0, Math.PI * 2);
          bgCtx.fill();
        }
      });

      // Background Tail Plume
      const tailNode = spine[NUM_SEGMENTS - 1];
      for (let t = -3; t <= 3; t++) {
        const tuftAngle = tailNode.angle + t * 0.28 + Math.sin(time * 3 + t * 0.7) * 0.25;
        const tuftLen = 42 - Math.abs(t) * 6;

        bgCtx.fillStyle = t % 2 === 0 ? 'rgba(225, 29, 72, 0.65)' : 'rgba(20, 24, 34, 0.75)';
        bgCtx.beginPath();
        bgCtx.moveTo(tailNode.x, tailNode.y);
        bgCtx.quadraticCurveTo(
          tailNode.x + Math.cos(tuftAngle) * (tuftLen * 0.5) + t * 5,
          tailNode.y + Math.sin(tuftAngle) * (tuftLen * 0.5),
          tailNode.x + Math.cos(tuftAngle) * tuftLen,
          tailNode.y + Math.sin(tuftAngle) * tuftLen
        );
        bgCtx.lineTo(tailNode.x, tailNode.y);
        bgCtx.fill();
      }

      // Background Head
      bgCtx.save();
      bgCtx.translate(head.x, head.y);
      bgCtx.rotate(head.angle);

      bgCtx.fillStyle = 'rgba(16, 20, 28, 0.92)';
      bgCtx.beginPath();
      bgCtx.ellipse(6, 0, 32, 20, 0, 0, Math.PI * 2);
      bgCtx.fill();

      bgCtx.beginPath();
      bgCtx.moveTo(14, -14);
      bgCtx.lineTo(42, -9);
      bgCtx.lineTo(46, 0);
      bgCtx.lineTo(42, 9);
      bgCtx.lineTo(14, 14);
      bgCtx.closePath();
      bgCtx.fillStyle = 'rgba(22, 28, 38, 0.95)';
      bgCtx.fill();

      bgCtx.beginPath();
      bgCtx.moveTo(14, 8);
      bgCtx.lineTo(34, 11);
      bgCtx.lineTo(28, 17);
      bgCtx.lineTo(10, 14);
      bgCtx.closePath();
      bgCtx.fillStyle = 'rgba(30, 38, 50, 0.92)';
      bgCtx.fill();

      bgCtx.fillStyle = '#f8fafc';
      bgCtx.beginPath();
      bgCtx.moveTo(34, 4);
      bgCtx.lineTo(36, 12);
      bgCtx.lineTo(38, 4);
      bgCtx.closePath();
      bgCtx.fill();

      bgCtx.beginPath();
      bgCtx.moveTo(26, 11);
      bgCtx.lineTo(28, 3);
      bgCtx.lineTo(30, 11);
      bgCtx.closePath();
      bgCtx.fill();

      bgCtx.fillStyle = '#0f172a';
      bgCtx.beginPath();
      bgCtx.ellipse(38, -4, 3, 2, -0.3, 0, Math.PI * 2);
      bgCtx.fill();

      for (let b = 0; b < 3; b++) {
        bgCtx.fillStyle = b === 1 ? 'rgba(225, 29, 72, 0.75)' : 'rgba(20, 24, 34, 0.85)';
        bgCtx.beginPath();
        bgCtx.moveTo(10, 10 + b * 2);
        bgCtx.quadraticCurveTo(-14, 24 + b * 6 + Math.sin(time * 3.8 + b) * 5, -32 - b * 6, 16 + b * 4);
        bgCtx.lineTo(-4, 6);
        bgCtx.closePath();
        bgCtx.fill();
      }

      for (let m = 0; m < 4; m++) {
        bgCtx.fillStyle = m % 2 === 0 ? 'rgba(225, 29, 72, 0.70)' : 'rgba(30, 41, 59, 0.85)';
        bgCtx.beginPath();
        bgCtx.moveTo(-6, -8 + m * 5);
        bgCtx.quadraticCurveTo(-28, -22 + m * 8 + Math.sin(time * 3.5 + m) * 4, -48 - m * 8, -14 + m * 6);
        bgCtx.lineTo(-12, -2);
        bgCtx.closePath();
        bgCtx.fill();
      }

      [-1, 1].forEach((sign) => {
        bgCtx.strokeStyle = '#334155';
        bgCtx.lineWidth = 4.5;
        bgCtx.lineCap = 'round';

        bgCtx.beginPath();
        bgCtx.moveTo(-4, sign * 10);
        bgCtx.quadraticCurveTo(-22, sign * 24, -44, sign * 30);
        bgCtx.stroke();

        bgCtx.lineWidth = 3.2;
        bgCtx.beginPath();
        bgCtx.moveTo(-22, sign * 24);
        bgCtx.lineTo(-30, sign * 14);
        bgCtx.stroke();

        bgCtx.beginPath();
        bgCtx.moveTo(-32, sign * 27);
        bgCtx.lineTo(-42, sign * 20);
        bgCtx.stroke();

        bgCtx.fillStyle = '#fbbf24';
        bgCtx.beginPath();
        bgCtx.arc(-44, sign * 30, 3.2, 0, Math.PI * 2);
        bgCtx.fill();

        bgCtx.beginPath();
        bgCtx.arc(-30, sign * 14, 2.5, 0, Math.PI * 2);
        bgCtx.fill();
      });

      bgCtx.shadowColor = '#fbbf24';
      bgCtx.shadowBlur = 18;
      bgCtx.fillStyle = '#fbbf24';
      bgCtx.beginPath();
      bgCtx.ellipse(18, -6, 6.5, 4.2, -0.25, 0, Math.PI * 2);
      bgCtx.fill();

      bgCtx.fillStyle = '#0f172a';
      bgCtx.shadowBlur = 0;
      bgCtx.beginPath();
      bgCtx.ellipse(18, -6, 1.8, 4.2, -0.25, 0, Math.PI * 2);
      bgCtx.fill();

      bgCtx.fillStyle = '#ffffff';
      bgCtx.beginPath();
      bgCtx.arc(16.5, -7.5, 1.2, 0, Math.PI * 2);
      bgCtx.fill();

      bgCtx.restore();

      // Background Whiskers
      [leftWhisker, rightWhisker].forEach((whisker) => {
        bgCtx.beginPath();
        bgCtx.moveTo(whisker[0].x, whisker[0].y);
        for (let k = 1; k < whisker.length; k++) {
          const xc = (whisker[k].x + whisker[k - 1].x) * 0.5;
          const yc = (whisker[k].y + whisker[k - 1].y) * 0.5;
          bgCtx.quadraticCurveTo(whisker[k - 1].x, whisker[k - 1].y, xc, yc);
        }
        bgCtx.strokeStyle = 'rgba(251, 191, 36, 0.85)';
        bgCtx.lineWidth = 2.4;
        bgCtx.lineCap = 'round';
        bgCtx.stroke();
      });

      bgCtx.restore();

      // ====================================================
      // 4B. DRAW ON FOREGROUND CANVAS (z-20: SOARING OVER CARDS!)
      // Only segments with z > 0.05 are drawn on fgCanvas, casting drop-shadow directly onto cards!
      // ====================================================
      const hasSurfacedSegments = spine.some((node) => node.z > 0.05);

      if (hasSurfacedSegments) {
        fgCtx.save();
        const fgBodyGrad = createDragonGrad(fgCtx);

        // Draw Surfaced Body Quads with Physical Drop-Shadow on Cards
        for (let i = 0; i < NUM_SEGMENTS - 1; i++) {
          const zAvg = (spine[i].z + spine[i + 1].z) * 0.5;
          if (zAvg > 0.05) {
            const segAlpha = Math.min(1.0, (zAvg - 0.05) * 2.2);

            fgCtx.save();
            fgCtx.globalAlpha = opacity * segAlpha;

            // Soft drop shadow cast onto card faces below
            fgCtx.shadowColor = 'rgba(15, 23, 42, 0.24)';
            fgCtx.shadowBlur = 18;
            fgCtx.shadowOffsetX = 3;
            fgCtx.shadowOffsetY = 12;

            // Joint disc to eliminate sub-pixel seam
            fgCtx.beginPath();
            fgCtx.arc(spine[i].x, spine[i].y, spine[i].width * 0.5, 0, Math.PI * 2);
            fgCtx.fillStyle = fgBodyGrad;
            fgCtx.fill();

            // Segment Quad
            fgCtx.beginPath();
            fgCtx.moveTo(leftPoints[i].x, leftPoints[i].y);
            fgCtx.lineTo(leftPoints[i + 1].x, leftPoints[i + 1].y);
            fgCtx.lineTo(rightPoints[i + 1].x, rightPoints[i + 1].y);
            fgCtx.lineTo(rightPoints[i].x, rightPoints[i].y);
            fgCtx.closePath();
            fgCtx.fillStyle = fgBodyGrad;
            fgCtx.fill();

            // Clear shadow for crisp calligraphic borders and details
            fgCtx.shadowColor = 'transparent';
            fgCtx.shadowBlur = 0;

            fgCtx.strokeStyle = 'rgba(10, 14, 20, 0.55)';
            fgCtx.lineWidth = 2.4;
            fgCtx.beginPath();
            fgCtx.moveTo(leftPoints[i].x, leftPoints[i].y);
            fgCtx.lineTo(leftPoints[i + 1].x, leftPoints[i + 1].y);
            fgCtx.stroke();

            fgCtx.beginPath();
            fgCtx.moveTo(rightPoints[i].x, rightPoints[i].y);
            fgCtx.lineTo(rightPoints[i + 1].x, rightPoints[i + 1].y);
            fgCtx.stroke();

            // Surfaced Belly Plates
            if (i >= 3 && i < NUM_SEGMENTS - 5 && i % 2 === 1) {
              const node = spine[i];
              const normal = node.angle + Math.PI * 0.5;
              const bW = node.width * 0.38;

              fgCtx.fillStyle = 'rgba(254, 243, 199, 0.45)';
              fgCtx.beginPath();
              fgCtx.ellipse(node.x - Math.cos(normal) * (bW * 0.5), node.y - Math.sin(normal) * (bW * 0.5), bW, 4.5, node.angle, 0, Math.PI * 2);
              fgCtx.fill();

              fgCtx.strokeStyle = 'rgba(180, 83, 9, 0.40)';
              fgCtx.lineWidth = 1.2;
              fgCtx.stroke();
            }

            // Surfaced Overlapping Scales
            if (i >= 4 && i < NUM_SEGMENTS - 6 && i % 3 === 1) {
              const node = spine[i];
              const normal = node.angle + Math.PI * 0.5;
              const scaleRadius = node.width * 0.28;

              fgCtx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
              fgCtx.lineWidth = 1.4;
              fgCtx.beginPath();
              fgCtx.arc(
                node.x + Math.cos(normal) * (node.width * 0.22),
                node.y + Math.sin(normal) * (node.width * 0.22),
                scaleRadius,
                node.angle - 1.2,
                node.angle + 1.2
              );
              fgCtx.stroke();
            }

            // Surfaced Dorsal Fins with Gold Highlight
            if (i >= 3 && i < NUM_SEGMENTS - 5 && i % 2 === 1) {
              const node = spine[i];
              const finAngle = node.angle + Math.PI * 0.5;
              const finLength = node.width * 0.95 + Math.sin(time * 3.2 + i * 0.45) * 6;
              const finBase = 8;

              fgCtx.fillStyle = 'rgba(225, 29, 72, 0.65)';
              fgCtx.beginPath();
              fgCtx.moveTo(node.x - Math.cos(node.angle) * finBase, node.y - Math.sin(node.angle) * finBase);
              fgCtx.lineTo(node.x + Math.cos(finAngle) * finLength, node.y + Math.sin(finAngle) * finLength);
              fgCtx.lineTo(node.x + Math.cos(node.angle) * finBase, node.y + Math.sin(node.angle) * finBase);
              fgCtx.closePath();
              fgCtx.fill();

              fgCtx.fillStyle = '#fbbf24';
              fgCtx.beginPath();
              fgCtx.arc(node.x + Math.cos(finAngle) * finLength, node.y + Math.sin(finAngle) * finLength, 1.8, 0, Math.PI * 2);
              fgCtx.fill();
            }

            fgCtx.restore();
          }
        }

        // Surfaced Legs & Claws
        legSegments.forEach((segIdx, legIdx) => {
          const node = spine[segIdx];
          if (node.z > 0.05) {
            const side = legIdx % 2 === 0 ? 1 : -1;
            const legBaseAngle = node.angle + side * 1.35;
            const hipX = node.x + Math.cos(node.angle + side * Math.PI * 0.5) * (node.width * 0.48);
            const hipY = node.y + Math.sin(node.angle + side * Math.PI * 0.5) * (node.width * 0.48);

            const thighLen = 22;
            const kneeX = hipX + Math.cos(legBaseAngle) * thighLen;
            const kneeY = hipY + Math.sin(legBaseAngle) * thighLen;

            const shinAngle = legBaseAngle + side * 0.75 + Math.sin(time * 3 + legIdx) * 0.15;
            const shinLen = 18;
            const ankleX = kneeX + Math.cos(shinAngle) * shinLen;
            const ankleY = kneeY + Math.sin(shinAngle) * shinLen;

            fgCtx.save();
            fgCtx.shadowColor = 'rgba(15, 23, 42, 0.25)';
            fgCtx.shadowBlur = 14;
            fgCtx.shadowOffsetY = 8;

            fgCtx.strokeStyle = 'rgba(20, 24, 34, 0.85)';
            fgCtx.lineWidth = 5.5;
            fgCtx.lineCap = 'round';
            fgCtx.beginPath();
            fgCtx.moveTo(hipX, hipY);
            fgCtx.lineTo(kneeX, kneeY);
            fgCtx.lineTo(ankleX, ankleY);
            fgCtx.stroke();

            fgCtx.shadowColor = 'transparent';
            fgCtx.shadowBlur = 0;

            for (let c = -1.5; c <= 1.5; c += 1.0) {
              const clawAngle = shinAngle + c * 0.4;
              const clawLen = 12;
              const tipX = ankleX + Math.cos(clawAngle) * clawLen;
              const tipY = ankleY + Math.sin(clawAngle) * clawLen;

              fgCtx.strokeStyle = '#e11d48';
              fgCtx.lineWidth = 2.8;
              fgCtx.beginPath();
              fgCtx.moveTo(ankleX, ankleY);
              fgCtx.quadraticCurveTo(
                ankleX + Math.cos(clawAngle) * (clawLen * 0.6) + side * 3,
                ankleY + Math.sin(clawAngle) * (clawLen * 0.6),
                tipX,
                tipY
              );
              fgCtx.stroke();

              fgCtx.fillStyle = '#ffffff';
              fgCtx.beginPath();
              fgCtx.arc(tipX, tipY, 1.2, 0, Math.PI * 2);
              fgCtx.fill();
            }
            fgCtx.restore();
          }
        });

        // Surfaced Head with Shadow & Glowing Eye
        if (head.z > 0.05) {
          const headAlpha = Math.min(1.0, (head.z - 0.05) * 2.5);

          fgCtx.save();
          fgCtx.globalAlpha = opacity * headAlpha;
          fgCtx.translate(head.x, head.y);
          fgCtx.rotate(head.angle);

          // Skull Shadow on Card Face
          fgCtx.shadowColor = 'rgba(15, 23, 42, 0.28)';
          fgCtx.shadowBlur = 22;
          fgCtx.shadowOffsetX = 4;
          fgCtx.shadowOffsetY = 14;

          fgCtx.fillStyle = 'rgba(16, 20, 28, 0.95)';
          fgCtx.beginPath();
          fgCtx.ellipse(6, 0, 32, 20, 0, 0, Math.PI * 2);
          fgCtx.fill();

          fgCtx.shadowColor = 'transparent';
          fgCtx.shadowBlur = 0;

          // Snout / Upper Jaw
          fgCtx.beginPath();
          fgCtx.moveTo(14, -14);
          fgCtx.lineTo(42, -9);
          fgCtx.lineTo(46, 0);
          fgCtx.lineTo(42, 9);
          fgCtx.lineTo(14, 14);
          fgCtx.closePath();
          fgCtx.fillStyle = 'rgba(22, 28, 38, 0.98)';
          fgCtx.fill();

          // Lower Jaw
          fgCtx.beginPath();
          fgCtx.moveTo(14, 8);
          fgCtx.lineTo(34, 11);
          fgCtx.lineTo(28, 17);
          fgCtx.lineTo(10, 14);
          fgCtx.closePath();
          fgCtx.fillStyle = 'rgba(30, 38, 50, 0.95)';
          fgCtx.fill();

          // Fangs in Ivory
          fgCtx.fillStyle = '#f8fafc';
          fgCtx.beginPath();
          fgCtx.moveTo(34, 4);
          fgCtx.lineTo(36, 12);
          fgCtx.lineTo(38, 4);
          fgCtx.closePath();
          fgCtx.fill();

          fgCtx.beginPath();
          fgCtx.moveTo(26, 11);
          fgCtx.lineTo(28, 3);
          fgCtx.lineTo(30, 11);
          fgCtx.closePath();
          fgCtx.fill();

          // Flared Nostrils
          fgCtx.fillStyle = '#0f172a';
          fgCtx.beginPath();
          fgCtx.ellipse(38, -4, 3, 2, -0.3, 0, Math.PI * 2);
          fgCtx.fill();

          // Beard Mane
          for (let b = 0; b < 3; b++) {
            fgCtx.fillStyle = b === 1 ? 'rgba(225, 29, 72, 0.85)' : 'rgba(20, 24, 34, 0.92)';
            fgCtx.beginPath();
            fgCtx.moveTo(10, 10 + b * 2);
            fgCtx.quadraticCurveTo(-14, 24 + b * 6 + Math.sin(time * 3.8 + b) * 5, -32 - b * 6, 16 + b * 4);
            fgCtx.lineTo(-4, 6);
            fgCtx.closePath();
            fgCtx.fill();
          }

          // Crown Mane
          for (let m = 0; m < 4; m++) {
            fgCtx.fillStyle = m % 2 === 0 ? 'rgba(225, 29, 72, 0.80)' : 'rgba(30, 41, 59, 0.92)';
            fgCtx.beginPath();
            fgCtx.moveTo(-6, -8 + m * 5);
            fgCtx.quadraticCurveTo(-28, -22 + m * 8 + Math.sin(time * 3.5 + m) * 4, -48 - m * 8, -14 + m * 6);
            fgCtx.lineTo(-12, -2);
            fgCtx.closePath();
            fgCtx.fill();
          }

          // Deer Antlers
          [-1, 1].forEach((sign) => {
            fgCtx.strokeStyle = '#334155';
            fgCtx.lineWidth = 4.5;
            fgCtx.lineCap = 'round';

            fgCtx.beginPath();
            fgCtx.moveTo(-4, sign * 10);
            fgCtx.quadraticCurveTo(-22, sign * 24, -44, sign * 30);
            fgCtx.stroke();

            fgCtx.lineWidth = 3.2;
            fgCtx.beginPath();
            fgCtx.moveTo(-22, sign * 24);
            fgCtx.lineTo(-30, sign * 14);
            fgCtx.stroke();

            fgCtx.beginPath();
            fgCtx.moveTo(-32, sign * 27);
            fgCtx.lineTo(-42, sign * 20);
            fgCtx.stroke();

            fgCtx.fillStyle = '#fbbf24';
            fgCtx.beginPath();
            fgCtx.arc(-44, sign * 30, 3.2, 0, Math.PI * 2);
            fgCtx.fill();

            fgCtx.beginPath();
            fgCtx.arc(-30, sign * 14, 2.5, 0, Math.PI * 2);
            fgCtx.fill();
          });

          // Radiant Glowing Amber Eye Floating Over Card
          fgCtx.shadowColor = '#fbbf24';
          fgCtx.shadowBlur = 24;
          fgCtx.fillStyle = '#fbbf24';
          fgCtx.beginPath();
          fgCtx.ellipse(18, -6, 6.5, 4.2, -0.25, 0, Math.PI * 2);
          fgCtx.fill();

          fgCtx.fillStyle = '#0f172a';
          fgCtx.shadowBlur = 0;
          fgCtx.beginPath();
          fgCtx.ellipse(18, -6, 1.8, 4.2, -0.25, 0, Math.PI * 2);
          fgCtx.fill();

          fgCtx.fillStyle = '#ffffff';
          fgCtx.beginPath();
          fgCtx.arc(16.5, -7.5, 1.2, 0, Math.PI * 2);
          fgCtx.fill();

          fgCtx.restore();

          // Surfaced Golden Whiskers
          [leftWhisker, rightWhisker].forEach((whisker) => {
            fgCtx.save();
            fgCtx.shadowColor = 'rgba(251, 191, 36, 0.45)';
            fgCtx.shadowBlur = 10;
            fgCtx.beginPath();
            fgCtx.moveTo(whisker[0].x, whisker[0].y);
            for (let k = 1; k < whisker.length; k++) {
              const xc = (whisker[k].x + whisker[k - 1].x) * 0.5;
              const yc = (whisker[k].y + whisker[k - 1].y) * 0.5;
              fgCtx.quadraticCurveTo(whisker[k - 1].x, whisker[k - 1].y, xc, yc);
            }
            fgCtx.strokeStyle = 'rgba(251, 191, 36, 0.95)';
            fgCtx.lineWidth = 2.6;
            fgCtx.lineCap = 'round';
            fgCtx.stroke();
            fgCtx.restore();
          });
        }

        // Surfaced Tail Plume
        if (tailNode.z > 0.05) {
          fgCtx.save();
          for (let t = -3; t <= 3; t++) {
            const tuftAngle = tailNode.angle + t * 0.28 + Math.sin(time * 3 + t * 0.7) * 0.25;
            const tuftLen = 42 - Math.abs(t) * 6;

            fgCtx.fillStyle = t % 2 === 0 ? 'rgba(225, 29, 72, 0.75)' : 'rgba(20, 24, 34, 0.85)';
            fgCtx.beginPath();
            fgCtx.moveTo(tailNode.x, tailNode.y);
            fgCtx.quadraticCurveTo(
              tailNode.x + Math.cos(tuftAngle) * (tuftLen * 0.5) + t * 5,
              tailNode.y + Math.sin(tuftAngle) * (tuftLen * 0.5),
              tailNode.x + Math.cos(tuftAngle) * tuftLen,
              tailNode.y + Math.sin(tuftAngle) * tuftLen
            );
            fgCtx.lineTo(tailNode.x, tailNode.y);
            fgCtx.fill();
          }
          fgCtx.restore();
        }

        fgCtx.restore();
      }
    };

    // Resize Handler for Both Canvases
    const handleResize = () => {
      width = bgCanvas.parentElement?.clientWidth || window.innerWidth;
      height = bgCanvas.parentElement?.clientHeight || window.innerHeight;

      setupCanvas(bgCanvas, bgCtx);
      setupCanvas(fgCanvas, fgCtx);

      waypoints = getWaypoints(width, height);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    if (bgCanvas.parentElement) {
      resizeObserver.observe(bgCanvas.parentElement);
    }

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(bgCanvas);

    render();

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [opacity]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 w-full h-full select-none"
      aria-hidden="true"
    >
      {/* Background Canvas: renders Kasumi fog and submerged dragon segments behind cards (z-0) */}
      <canvas
        ref={bgCanvasRef}
        className="pointer-events-none absolute inset-0 z-0 w-full h-full block"
      />
      {/* Foreground Canvas: renders surfaced dragon segments, glowing eyes & mist OVER cards (z-20) */}
      <canvas
        ref={fgCanvasRef}
        className="pointer-events-none absolute inset-0 z-20 w-full h-full block"
      />
    </div>
  );
}
