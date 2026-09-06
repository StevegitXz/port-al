import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';

/**
 * Creates a canvas texture for a vintage computer badge
 */
function createBadgeTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#1e222b';
  ctx.fillRect(0, 0, 256, 64);

  // Border
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 4;
  ctx.strokeRect(4, 4, 248, 56);

  // Accent stripe
  ctx.fillStyle = '#e11d48';
  ctx.fillRect(10, 10, 8, 44);

  // Typography
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 24px "Consolas", monospace';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('ZEN-86', 30, 32);

  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 16px "Consolas", monospace';
  ctx.textAlign = 'right';
  ctx.fillText('VT100', 242, 32);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 4;
  return texture;
}

/**
 * Soft radial shadow texture for desk grounding
 */
function createShadowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createRadialGradient(256, 256, 40, 256, 256, 256);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0.32)');
  grad.addColorStop(0.45, 'rgba(0, 0, 0, 0.14)');
  grad.addColorStop(0.8, 'rgba(0, 0, 0, 0.03)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  return new THREE.CanvasTexture(canvas);
}

/**
 * Creates curved geometry for cathode ray tube glass face
 */
function createCrtCurvedScreenGeometry(width, height, segX = 32, segY = 32, curvature = 0.22) {
  const geo = new THREE.PlaneGeometry(width, height, segX, segY);
  const pos = geo.attributes.position;
  const halfW = width * 0.5;
  const halfH = height * 0.5;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const factorX = 1 - Math.pow(x / halfW, 2);
    const factorY = 1 - Math.pow(y / halfH, 2);
    const bulge = Math.max(0, factorX * factorY) * curvature;
    pos.setZ(i, bulge);
  }

  geo.computeVertexNormals();
  return geo;
}

export default function RetroCrtMonitor3D({
  history = [],
  input = '',
  matrixMode = false,
  className = '',
}) {
  const mountRef = useRef(null);
  const screenCanvasRef = useRef(null);
  const screenTextureRef = useRef(null);
  const powerLedMatRef = useRef(null);
  const diskLedMatRef = useRef(null);

  // Rotation & spring-back state
  const rotationState = useRef({
    currentX: 0.08,
    currentY: -0.05,
    targetX: 0.08,
    targetY: -0.05,
    defaultX: 0.08,
    defaultY: -0.05,
    isDragging: false,
    prevMouseX: 0,
    prevMouseY: 0,
    lastInteractTime: Date.now(),
  });

  // Re-draw 2D CRT Screen on Canvas
  const drawScreenCanvas = useCallback(() => {
    const canvas = screenCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Background phosphor colors
    const isMatrix = matrixMode;
    const bgBase = isMatrix ? '#040e06' : '#070a12';
    const fgColor = isMatrix ? '#22c55e' : '#38bdf8';
    const fgDim = isMatrix ? '#15803d' : '#0284c7';
    const fgWhite = isMatrix ? '#86efac' : '#f8fafc';
    const fgAmber = '#fbbf24';
    const fgRed = '#f87171';

    // Clear background
    ctx.fillStyle = bgBase;
    ctx.fillRect(0, 0, width, height);

    // Vignette CRT glass curve shading
    const radialGrad = ctx.createRadialGradient(
      width * 0.5, height * 0.5, width * 0.15,
      width * 0.5, height * 0.5, width * 0.7
    );
    radialGrad.addColorStop(0, 'rgba(255, 255, 255, 0.04)');
    radialGrad.addColorStop(0.7, 'rgba(0, 0, 0, 0.25)');
    radialGrad.addColorStop(1, 'rgba(0, 0, 0, 0.85)');
    ctx.fillStyle = radialGrad;
    ctx.fillRect(0, 0, width, height);

    // CRT Scanlines
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    for (let y = 0; y < height; y += 4) {
      ctx.fillRect(0, y, width, 2);
    }

    // Top Header Banner
    ctx.font = 'bold 15px "Consolas", "Courier New", monospace';
    ctx.fillStyle = fgDim;
    ctx.fillText('╔' + '═'.repeat(66) + '╗', 34, 38);
    ctx.fillText('║  IFAC VT-100 RETRO CRT // KERNEL v4.19-ZEN // 80x25 // ACTIVE       ║', 34, 56);
    ctx.fillText('╚' + '═'.repeat(66) + '╝', 34, 74);

    // Terminal History Text lines
    ctx.font = '16px "Consolas", "Monaco", "Courier New", monospace';
    const lineHeight = 24;
    const maxLines = 23;
    const startY = 104;

    const formattedLines = [];
    history.forEach((item) => {
      let color = fgWhite;
      if (item.type === 'sys') color = fgDim;
      else if (item.type === 'info') color = fgAmber;
      else if (item.type === 'cmd') color = fgColor;
      else if (item.type === 'err') color = fgRed;
      else if (item.type === 'res') color = isMatrix ? '#86efac' : '#e2e8f0';

      const rawLines = String(item.text).split('\n');
      rawLines.forEach((l) => {
        if (l.length <= 68) {
          formattedLines.push({ text: l, color });
        } else {
          for (let c = 0; c < l.length; c += 68) {
            formattedLines.push({ text: l.slice(c, c + 68), color });
          }
        }
      });
    });

    const visibleLines = formattedLines.slice(-maxLines);
    visibleLines.forEach((line, idx) => {
      ctx.fillStyle = line.color;
      ctx.fillText(line.text, 44, startY + idx * lineHeight);
    });

    // Active Prompt Line at the bottom
    const promptY = Math.min(height - 40, startY + visibleLines.length * lineHeight + 8);
    ctx.font = 'bold 17px "Consolas", "Courier New", monospace';
    ctx.fillStyle = fgColor;
    ctx.fillText('steve@ifac:~$ ', 44, promptY);

    const promptWidth = ctx.measureText('steve@ifac:~$ ').width;
    ctx.fillStyle = fgWhite;
    ctx.fillText(input, 44 + promptWidth, promptY);

    // Blinking Block Cursor
    const isBlinking = Math.floor(performance.now() / 450) % 2 === 0;
    if (isBlinking) {
      const inputWidth = ctx.measureText(input).width;
      ctx.fillStyle = fgColor;
      ctx.fillRect(44 + promptWidth + inputWidth + 2, promptY - 15, 11, 19);
    }

    // Mark texture for update
    if (screenTextureRef.current) {
      screenTextureRef.current.needsUpdate = true;
    }
  }, [history, input, matrixMode]);

  // Update canvas on props change
  useEffect(() => {
    drawScreenCanvas();
  }, [drawScreenCanvas]);

  // Blink disk activity LED when commands execute or input changes
  useEffect(() => {
    if (diskLedMatRef.current) {
      diskLedMatRef.current.emissiveIntensity = 2.2;
      const timer = setTimeout(() => {
        if (diskLedMatRef.current) {
          diskLedMatRef.current.emissiveIntensity = 0.2;
        }
      }, 180);
      return () => clearTimeout(timer);
    }
  }, [history, input]);

  // Setup Three.js Scene (Runs once on mount)
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Offscreen Canvas for CRT Display
    const screenCanvas = document.createElement('canvas');
    screenCanvas.width = 1024;
    screenCanvas.height = 768;
    screenCanvasRef.current = screenCanvas;

    const screenTexture = new THREE.CanvasTexture(screenCanvas);
    screenTexture.anisotropy = 4;
    screenTextureRef.current = screenTexture;

    // Scene & Camera
    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(
      32,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    // Framed directly on the retro PC chassis
    camera.position.set(0, 0.5, 6.4);
    camera.lookAt(0, 0.1, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Lighting (Warm Studio Lights)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff8ee, 1.4);
    keyLight.position.set(4, 7, 5);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xdbeafe, 0.65);
    fillLight.position.set(-5, 4, 3);
    scene.add(fillLight);

    // Workstation Group (Orbit & spring-back)
    const pcGroup = new THREE.Group();
    scene.add(pcGroup);

    // Ambient Desk Shadow Plane
    const shadowGeo = new THREE.PlaneGeometry(6.2, 5.0);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: createShadowTexture(),
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI * 0.5;
    shadowMesh.position.set(0, -1.88, 0.2);
    pcGroup.add(shadowMesh);

    // ----------------------------------------------------
    // RETRO ALL-IN-ONE CRT COMPUTER CHASSIS (Macintosh / IBM style)
    // ----------------------------------------------------
    const vintageBeigeMat = new THREE.MeshStandardMaterial({
      color: 0xded6c4,
      roughness: 0.55,
      metalness: 0.04,
    });

    const darkBezelMat = new THREE.MeshStandardMaterial({
      color: 0x22252d,
      roughness: 0.7,
      metalness: 0.15,
    });

    const darkTrimMat = new THREE.MeshStandardMaterial({
      color: 0x16181e,
      roughness: 0.8,
      metalness: 0.2,
    });

    // Self-illuminated screen material (CRISP, LUMINOUS, ZERO SPECULAR GLARE!)
    const crtScreenMat = new THREE.MeshBasicMaterial({
      map: screenTexture,
    });

    // 1. Lower Chin Housing
    const chinGeo = new THREE.BoxGeometry(4.0, 1.25, 3.2);
    const chinMesh = new THREE.Mesh(chinGeo, vintageBeigeMat);
    chinMesh.position.set(0, -1.2, 0);
    chinMesh.castShadow = true;
    chinMesh.receiveShadow = true;
    pcGroup.add(chinMesh);

    // 2. Upper Monitor Housing
    const upperGeo = new THREE.BoxGeometry(4.0, 2.7, 3.1);
    const upperMesh = new THREE.Mesh(upperGeo, vintageBeigeMat);
    upperMesh.position.set(0, 0.75, -0.05);
    upperMesh.castShadow = true;
    pcGroup.add(upperMesh);

    // 3. Iconic Rear Cathode Tube Taper (Box Depth)
    const rearTubeGeo = new THREE.BoxGeometry(3.3, 2.3, 2.1);
    const rearTubeMesh = new THREE.Mesh(rearTubeGeo, vintageBeigeMat);
    rearTubeMesh.position.set(0, 0.7, -2.1);
    rearTubeMesh.castShadow = true;
    pcGroup.add(rearTubeMesh);

    const rearCapGeo = new THREE.BoxGeometry(2.1, 1.6, 0.8);
    const rearCapMesh = new THREE.Mesh(rearCapGeo, darkBezelMat);
    rearCapMesh.position.set(0, 0.7, -3.2);
    pcGroup.add(rearCapMesh);

    // 4. Rear & Top Ventilation Grilles
    for (let i = 0; i < 7; i++) {
      const ventGeo = new THREE.BoxGeometry(2.7, 0.035, 0.06);
      const ventMesh = new THREE.Mesh(ventGeo, darkTrimMat);
      ventMesh.position.set(0, 1.6 + i * 0.09, -1.4);
      pcGroup.add(ventMesh);
    }

    // 5. Inset Screen Bezel Frame
    const screenWellGeo = new THREE.BoxGeometry(3.25, 2.35, 0.15);
    const screenWellMesh = new THREE.Mesh(screenWellGeo, darkBezelMat);
    screenWellMesh.position.set(0, 0.82, 1.48);
    pcGroup.add(screenWellMesh);

    // 6. Curved CRT Glass Face (Convex Cathode Bulb)
    const crtScreenGeo = createCrtCurvedScreenGeometry(3.08, 2.2, 36, 36, 0.22);
    const crtScreenMesh = new THREE.Mesh(crtScreenGeo, crtScreenMat);
    crtScreenMesh.position.set(0, 0.82, 1.52);
    pcGroup.add(crtScreenMesh);

    // 7. Lower Chin Details: Floppy Drive, Badge, Dials & Power LED
    // 3.5" Floppy Disk Slot
    const floppySlotGeo = new THREE.BoxGeometry(1.25, 0.12, 0.08);
    const floppySlotMesh = new THREE.Mesh(floppySlotGeo, darkTrimMat);
    floppySlotMesh.position.set(1.05, -1.15, 1.58);
    pcGroup.add(floppySlotMesh);

    // Floppy Read LED
    const diskLedGeo = new THREE.BoxGeometry(0.06, 0.06, 0.03);
    const diskLedMat = new THREE.MeshStandardMaterial({
      color: 0x22c55e,
      emissive: 0x22c55e,
      emissiveIntensity: 0.2,
      roughness: 0.2,
    });
    const diskLedMesh = new THREE.Mesh(diskLedGeo, diskLedMat);
    diskLedMesh.position.set(0.35, -1.15, 1.61);
    diskLedMatRef.current = diskLedMat;
    pcGroup.add(diskLedMesh);

    // Floppy Eject Button
    const ejectBtnGeo = new THREE.BoxGeometry(0.18, 0.1, 0.04);
    const ejectBtnMesh = new THREE.Mesh(ejectBtnGeo, vintageBeigeMat);
    ejectBtnMesh.position.set(0.2, -1.15, 1.61);
    pcGroup.add(ejectBtnMesh);

    // Retro Brand Badge
    const badgeGeo = new THREE.BoxGeometry(1.1, 0.28, 0.03);
    const badgeMat = new THREE.MeshStandardMaterial({
      map: createBadgeTexture(),
      roughness: 0.35,
      metalness: 0.25,
    });
    const badgeMesh = new THREE.Mesh(badgeGeo, badgeMat);
    badgeMesh.position.set(-1.15, -1.15, 1.61);
    pcGroup.add(badgeMesh);

    // Rotary Adjustment Dials (Brightness & Contrast)
    const knobGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.1, 16);
    knobGeo.rotateX(Math.PI * 0.5);
    const knob1 = new THREE.Mesh(knobGeo, darkTrimMat);
    knob1.position.set(-0.35, -1.15, 1.62);
    const knob2 = new THREE.Mesh(knobGeo, darkTrimMat);
    knob2.position.set(-0.12, -1.15, 1.62);
    pcGroup.add(knob1, knob2);

    // Pulsing Power LED
    const powerLedGeo = new THREE.SphereGeometry(0.05, 14, 14);
    const powerLedMat = new THREE.MeshStandardMaterial({
      color: matrixMode ? 0x22c55e : 0xf59e0b,
      emissive: matrixMode ? 0x22c55e : 0xf59e0b,
      emissiveIntensity: 1.8,
      roughness: 0.2,
    });
    const powerLedMesh = new THREE.Mesh(powerLedGeo, powerLedMat);
    powerLedMesh.position.set(0.08, -1.15, 1.62);
    powerLedMatRef.current = powerLedMat;
    pcGroup.add(powerLedMesh);

    // 8. Low-Profile Integrated Desk Feet
    const footGeo = new THREE.BoxGeometry(0.8, 0.08, 2.6);
    const footMat = new THREE.MeshStandardMaterial({ color: 0x1f232b, roughness: 0.8 });
    const foot1 = new THREE.Mesh(footGeo, footMat);
    foot1.position.set(-1.4, -1.85, 0);
    const foot2 = new THREE.Mesh(footGeo, footMat);
    foot2.position.set(1.4, -1.85, 0);
    pcGroup.add(foot1, foot2);

    // Initial Screen Draw
    drawScreenCanvas();

    // ----------------------------------------------------
    // MOUSE DRAG & ORBIT (Free 360° Inspection with Spring-Back)
    // ----------------------------------------------------
    const rot = rotationState.current;

    const handlePointerDown = (e) => {
      rot.isDragging = true;
      rot.prevMouseX = e.clientX;
      rot.prevMouseY = e.clientY;
      rot.lastInteractTime = Date.now();
    };

    const handlePointerMove = (e) => {
      if (!rot.isDragging) return;
      const deltaX = e.clientX - rot.prevMouseX;
      const deltaY = e.clientY - rot.prevMouseY;

      rot.targetY += deltaX * 0.007;
      rot.targetX += deltaY * 0.007;

      rot.targetX = Math.max(-0.25, Math.min(0.45, rot.targetX));
      rot.targetY = Math.max(-0.85, Math.min(0.85, rot.targetY));

      rot.prevMouseX = e.clientX;
      rot.prevMouseY = e.clientY;
      rot.lastInteractTime = Date.now();
    };

    const handlePointerUp = () => {
      rot.isDragging = false;
      rot.lastInteractTime = Date.now();
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    // Animation Loop
    let animId;
    let lastBlink = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Spring-back damping to default orientation when idle
      const timeSinceInteract = Date.now() - rot.lastInteractTime;
      if (!rot.isDragging && timeSinceInteract > 2800) {
        rot.targetX += (rot.defaultX - rot.targetX) * 0.025;
        rot.targetY += (rot.defaultY - rot.targetY) * 0.025;
      }

      rot.currentX += (rot.targetX - rot.currentX) * 0.12;
      rot.currentY += (rot.targetY - rot.currentY) * 0.12;
      pcGroup.rotation.x = rot.currentX;
      pcGroup.rotation.y = rot.currentY;

      // Pulse power LED
      if (powerLedMatRef.current) {
        const pulse = 1.4 + Math.sin(performance.now() * 0.004) * 0.4;
        powerLedMatRef.current.emissiveIntensity = pulse;
      }

      // Blinking cursor redraw
      const now = performance.now();
      if (now - lastBlink > 450) {
        lastBlink = now;
        drawScreenCanvas();
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        const height = entry.contentRect.height;
        if (width && height) {
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);
        }
      }
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      domEl.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      if (container.contains(domEl)) {
        container.removeChild(domEl);
      }
      renderer.dispose();
    };
  }, [drawScreenCanvas]);

  return (
    <div className={`relative w-full h-[460px] sm:h-[520px] lg:h-[560px] select-none ${className}`}>
      {/* 3D WebGL Canvas Viewport */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Floating Status Pill */}
      <div className="pointer-events-none absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-zinc-200/80 shadow-md text-xs font-mono">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-zinc-800 font-semibold tracking-wide">
          MONITOR CRT RETRÔ // TELA CONVEXA DE FÓSFORO
        </span>
        <span className="text-zinc-400">|</span>
        <span className="text-rose-600 font-bold">ARRASTE 360°</span>
      </div>
    </div>
  );
}
