import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, Sparkles, Zap, Shield, HelpCircle } from 'lucide-react';
import { sound } from '../../utils/sound';

/**
 * Creates a procedural high-resolution texture for the metal RF shield
 * with laser-engraved typography and logos matching the real ESP-12F / MARIoT module.
 */
function createShieldTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Brushed aluminum metallic background base
  const bgGrad = ctx.createLinearGradient(0, 0, 1024, 1024);
  bgGrad.addColorStop(0, '#c7cbd1');
  bgGrad.addColorStop(0.3, '#dfe3e8');
  bgGrad.addColorStop(0.6, '#bec3ca');
  bgGrad.addColorStop(1, '#a8adb6');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1024, 1024);

  // Subtle brushed metal directional noise lines
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  for (let i = 0; i < 1024; i += 3) {
    ctx.fillRect(0, i, 1024, 1);
  }
  ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
  for (let i = 1; i < 1024; i += 4) {
    ctx.fillRect(0, i, 1024, 1);
  }

  // Outer border bevel line
  ctx.strokeStyle = '#8a9099';
  ctx.lineWidth = 14;
  ctx.strokeRect(30, 30, 964, 964);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.lineWidth = 4;
  ctx.strokeRect(38, 38, 948, 948);

  // Header separator
  ctx.beginPath();
  ctx.moveTo(60, 190);
  ctx.lineTo(964, 190);
  ctx.strokeStyle = '#71767e';
  ctx.lineWidth = 6;
  ctx.stroke();

  // Top header text
  ctx.fillStyle = '#2d3137';
  ctx.font = 'bold 44px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('MODEL: ESP-12F', 70, 140);

  ctx.textAlign = 'right';
  ctx.font = 'bold 36px monospace';
  ctx.fillText('2.4GHz ISM', 950, 140);

  // Big Central Module Branding
  ctx.textAlign = 'center';
  ctx.fillStyle = '#17191c';
  ctx.font = '900 86px sans-serif';
  ctx.letterSpacing = '8px';
  ctx.fillText('ESP8266MOD', 512, 330);

  // SoC Architecture Line
  ctx.fillStyle = '#393e46';
  ctx.font = 'bold 46px monospace';
  ctx.fillText('XTENSA® 32-BIT LX106', 512, 430);

  // Middle IFAC / Research Attribution
  ctx.fillStyle = '#4b525d';
  ctx.font = 'bold 38px monospace';
  ctx.fillText('VENDOR: IFAC LAB / MARIOT', 512, 530);

  ctx.font = 'bold 32px monospace';
  ctx.fillText('CSBC 2025 // WCAMA PAPER 01', 512, 600);

  // Subtle decorative circuit dot & crosshairs
  ctx.strokeStyle = '#5a626f';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(512, 700, 32, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(512, 650);
  ctx.lineTo(512, 750);
  ctx.moveTo(462, 700);
  ctx.lineTo(562, 700);
  ctx.stroke();

  // Bottom separator line
  ctx.beginPath();
  ctx.moveTo(60, 830);
  ctx.lineTo(964, 830);
  ctx.strokeStyle = '#71767e';
  ctx.lineWidth = 6;
  ctx.stroke();

  // Bottom Regulatory & Identity Text
  ctx.textAlign = 'left';
  ctx.fillStyle = '#2d3137';
  ctx.font = 'bold 32px monospace';
  ctx.fillText('FCC ID: 2AHMR-ESP12F', 70, 910);

  ctx.textAlign = 'right';
  ctx.fillText('STEVEGITXZ // RBR-AC', 950, 910);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 8;
  return texture;
}

const REST_ROTATION = { x: 0.28, y: -0.38 };

export default function Esp8266Canvas3D({ boosted, onToggleBoost }) {
  const mountRef = useRef(null);
  const [isInteracting, setIsInteracting] = useState(false);

  // Refs for Three.js state
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const chipGroupRef = useRef(null);
  const ledLightRef = useRef(null);
  const ledMeshRef = useRef(null);
  const pulseRingRef = useRef(null);

  // Drag & rotation tracking
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const rotVelocityRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ ...REST_ROTATION });
  const currentRotationRef = useRef({ ...REST_ROTATION });
  const hasMovedRef = useRef(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 320;
    const height = container.clientHeight || 340;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0, 6.8);
    cameraRef.current = camera;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.outline = 'none';
    renderer.domElement.style.touchAction = 'none';
    renderer.domElement.style.cursor = 'grab';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const mainKeyLight = new THREE.DirectionalLight(0xfff8f2, 2.8);
    mainKeyLight.position.set(4, 6, 5);
    scene.add(mainKeyLight);

    const fillLight = new THREE.DirectionalLight(0xe0f2fe, 1.2);
    fillLight.position.set(-5, 2, 4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xf43f5e, 0.9);
    rimLight.position.set(0, -5, -4);
    scene.add(rimLight);

    // 5. Main Chip Group
    const chipGroup = new THREE.Group();
    chipGroupRef.current = chipGroup;
    scene.add(chipGroup);

    // --- A. PCB Substrate (Black Epoxy Board) ---
    const pcbGeo = new THREE.BoxGeometry(2.35, 3.45, 0.12);
    const pcbMat = new THREE.MeshStandardMaterial({
      color: 0x0b1118,
      roughness: 0.55,
      metalness: 0.15,
    });
    const pcbMesh = new THREE.Mesh(pcbGeo, pcbMat);
    chipGroup.add(pcbMesh);

    // --- B. Gold Edge Castellated Pads (Solder Pins) ---
    const padMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.95,
      roughness: 0.15,
      emissive: 0x78350f,
      emissiveIntensity: 0.2,
    });

    const padGeo = new THREE.BoxGeometry(0.12, 0.18, 0.14);
    const padCountY = 8;
    const padSpacing = 0.32;
    const startY = -0.9 + (padCountY - 1) * padSpacing * 0.5;

    // Left and Right Pins
    for (let i = 0; i < padCountY; i++) {
      const y = startY - i * padSpacing;

      // Left pad
      const leftPad = new THREE.Mesh(padGeo, padMat);
      leftPad.position.set(-1.18, y, 0);
      chipGroup.add(leftPad);

      // Right pad
      const rightPad = new THREE.Mesh(padGeo, padMat);
      rightPad.position.set(1.18, y, 0);
      chipGroup.add(rightPad);
    }

    // --- C. Meandering 2.4 GHz PCB Antenna (Gold Meander Traces) ---
    const antennaGroup = new THREE.Group();
    antennaGroup.position.set(0, 1.25, 0.065);

    const antTraceMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      metalness: 0.92,
      roughness: 0.18,
    });

    // Antenna horizontal and vertical serpentine segments
    const meanderSegments = [
      { x: 0, y: 0.3, w: 1.9, h: 0.06 },
      { x: -0.92, y: 0.18, w: 0.06, h: 0.2 },
      { x: -0.5, y: 0.08, w: 0.9, h: 0.06 },
      { x: -0.05, y: 0.18, w: 0.06, h: 0.2 },
      { x: 0.4, y: 0.22, w: 0.85, h: 0.06 },
      { x: 0.82, y: 0.1, w: 0.06, h: 0.2 },
      { x: 0.4, y: -0.02, w: 0.9, h: 0.06 },
      { x: -0.05, y: -0.1, w: 0.06, h: 0.2 },
      { x: -0.4, y: -0.18, w: 0.75, h: 0.06 },
    ];

    meanderSegments.forEach((seg) => {
      const segMesh = new THREE.Mesh(
        new THREE.BoxGeometry(seg.w, seg.h, 0.02),
        antTraceMat
      );
      segMesh.position.set(seg.x, seg.y, 0);
      antennaGroup.add(segMesh);
    });

    chipGroup.add(antennaGroup);

    // --- D. Brushed Aluminum RF Shield Can ---
    const shieldTex = createShieldTexture();
    const shieldGeo = new THREE.BoxGeometry(2.05, 2.05, 0.22);
    const shieldMat = new THREE.MeshStandardMaterial({
      color: 0xdde2e8,
      metalness: 0.88,
      roughness: 0.22,
      map: shieldTex,
    });
    const shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
    shieldMesh.position.set(0, -0.45, 0.12);
    chipGroup.add(shieldMesh);

    // --- E. Quartz Crystal Clock Oscillator & SMD Components ---
    const crystalGeo = new THREE.BoxGeometry(0.32, 0.22, 0.08);
    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.9,
      roughness: 0.1,
    });
    const crystalMesh = new THREE.Mesh(crystalGeo, crystalMat);
    crystalMesh.position.set(-0.65, 0.78, 0.08);
    chipGroup.add(crystalMesh);

    // Minor SMD ceramic caps
    const smdMat = new THREE.MeshStandardMaterial({
      color: 0x92400e,
      roughness: 0.4,
      metalness: 0.3,
    });
    [-0.2, 0.1, 0.35, 0.6].forEach((x, idx) => {
      const cap = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.06), smdMat);
      cap.position.set(x, 0.78 + (idx % 2) * 0.06, 0.07);
      chipGroup.add(cap);
    });

    // --- F. Telemetry Activity SMD LED & Real Light Source ---
    const ledMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 2.5,
      roughness: 0.2,
    });
    const ledMesh = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.08, 0.06), ledMat);
    ledMesh.position.set(0.72, -1.32, 0.24);
    chipGroup.add(ledMesh);
    ledMeshRef.current = ledMesh;

    const ledPointLight = new THREE.PointLight(0x38bdf8, 3.2, 3.5);
    ledPointLight.position.set(0.72, -1.32, 0.36);
    chipGroup.add(ledPointLight);
    ledLightRef.current = ledPointLight;

    // --- G. Overclock Energy Wave Ring ---
    const ringGeo = new THREE.RingGeometry(0.05, 0.12, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xf43f5e,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
    });
    const pulseRing = new THREE.Mesh(ringGeo, ringMat);
    pulseRing.position.set(0, 1.25, 0.1);
    chipGroup.add(pulseRing);
    pulseRingRef.current = pulseRing;

    // --- H. Subtle Contact Shadow Disk ---
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext('2d');
    const sGrad = sCtx.createRadialGradient(128, 128, 10, 128, 128, 120);
    sGrad.addColorStop(0, 'rgba(15, 23, 42, 0.35)');
    sGrad.addColorStop(0.5, 'rgba(15, 23, 42, 0.12)');
    sGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
    sCtx.fillStyle = sGrad;
    sCtx.fillRect(0, 0, 256, 256);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowGeo = new THREE.PlaneGeometry(3.6, 4.2);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.position.set(0, -2.2, -0.2);
    shadowMesh.rotation.x = -Math.PI / 2 + 0.35;
    scene.add(shadowMesh);

    // --- Animation & Render Loop ---
    let reqId;
    let clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Floating gentle levitation motion
      const floatOffset = Math.sin(elapsedTime * 1.6) * 0.07;
      chipGroup.position.y = floatOffset;
      shadowMesh.scale.setScalar(1 - floatOffset * 0.35);

      // When released, smoothly spring back to resting showcase angle
      if (!isDraggingRef.current) {
        targetRotationRef.current.x += (REST_ROTATION.x - targetRotationRef.current.x) * 0.07;
        targetRotationRef.current.y += (REST_ROTATION.y - targetRotationRef.current.y) * 0.07;
      }

      currentRotationRef.current.x += (targetRotationRef.current.x - currentRotationRef.current.x) * 0.12;
      currentRotationRef.current.y += (targetRotationRef.current.y - currentRotationRef.current.y) * 0.12;

      chipGroup.rotation.x = currentRotationRef.current.x;
      chipGroup.rotation.y = currentRotationRef.current.y;

      // Pulse ring animation if active
      if (pulseRingRef.current && pulseRingRef.current.material.opacity > 0.01) {
        pulseRingRef.current.scale.multiplyScalar(1.08);
        pulseRingRef.current.material.opacity *= 0.92;
      }

      renderer.render(scene, camera);
    };

    animate();

    // --- Pointer & Drag Handlers ---
    const handlePointerDown = (e) => {
      isDraggingRef.current = true;
      hasMovedRef.current = false;
      setIsInteracting(true);
      setAutoRotate(false);
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
      renderer.domElement.style.cursor = 'grabbing';
    };

    const handlePointerMove = (e) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - prevMouseRef.current.x;
      const dy = e.clientY - prevMouseRef.current.y;

      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        hasMovedRef.current = true;
      }

      rotVelocityRef.current = {
        x: dy * 0.005,
        y: dx * 0.005,
      };

      targetRotationRef.current.y += dx * 0.008;
      targetRotationRef.current.x += dy * 0.008;

      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
      setIsInteracting(false);
      renderer.domElement.style.cursor = 'grab';

      // If clicked without dragging, trigger overclock
      if (!hasMovedRef.current) {
        if (onToggleBoost) {
          onToggleBoost();
        }
      }
    };

    const dom = renderer.domElement;
    dom.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    // --- Resize Observer ---
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const newWidth = entries[0].contentRect.width || 320;
      const newHeight = entries[0].contentRect.height || 340;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    });

    resizeObserver.observe(container);

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(reqId);
      resizeObserver.disconnect();
      dom.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      if (container && dom && dom.parentNode === container) {
        container.removeChild(dom);
      }
      renderer.dispose();
      pcbGeo.dispose();
      pcbMat.dispose();
      shieldGeo.dispose();
      shieldMat.dispose();
      shieldTex.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();
      shadowTex.dispose();
    };
  }, []);

  // Update LED and Pulse Animation when boosted state changes
  useEffect(() => {
    if (!ledMeshRef.current || !ledLightRef.current) return;

    if (boosted) {
      // Hot Magenta/Rose Overclock state
      ledMeshRef.current.material.color.setHex(0xf43f5e);
      ledMeshRef.current.material.emissive.setHex(0xe11d48);
      ledMeshRef.current.material.emissiveIntensity = 4.5;
      ledLightRef.current.color.setHex(0xf43f5e);
      ledLightRef.current.intensity = 5.0;

      // Trigger energy shockwave pulse
      if (pulseRingRef.current) {
        pulseRingRef.current.scale.set(1, 1, 1);
        pulseRingRef.current.material.opacity = 0.9;
      }
    } else {
      // Cool Cyan/Blue Default telemetry state
      ledMeshRef.current.material.color.setHex(0x38bdf8);
      ledMeshRef.current.material.emissive.setHex(0x0284c7);
      ledMeshRef.current.material.emissiveIntensity = 2.5;
      ledLightRef.current.color.setHex(0x38bdf8);
      ledLightRef.current.intensity = 3.0;
    }
  }, [boosted]);

  return (
    <div className="relative w-full h-80 sm:h-96 flex items-center justify-center select-none">
      {/* 3D WebGL Canvas Container */}
      <div
        ref={mountRef}
        className="w-full h-full flex items-center justify-center touch-none outline-none"
      />

      {/* Bottom Floating Instruction & Gesture Tip */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-zinc-200/80 text-[10px] font-mono text-zinc-600 shadow-xs pointer-events-none whitespace-nowrap">
        <span className={`w-1.5 h-1.5 rounded-full ${boosted ? 'bg-rose-500 animate-ping' : 'bg-emerald-500 animate-pulse'}`}></span>
        <span>
          {isInteracting
            ? 'EXPLORANDO EM 360° (SOLTE PARA VOLTAR)'
            : '[ ARRASTE PARA GIRAR • SOLTE PARA VOLTAR • CLIQUE PARA OVERCLOCK ]'}
        </span>
      </div>
    </div>
  );
}
