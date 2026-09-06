import React, { useEffect, useRef, useCallback, useState } from 'react';
import * as THREE from 'three';
import { sound } from '../../utils/sound';
import { Maximize2, Monitor } from 'lucide-react';

/**
 * Creates texture for vintage computer badge
 */
function createBadgeTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#1e222b';
  ctx.fillRect(0, 0, 256, 64);

  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 4;
  ctx.strokeRect(4, 4, 248, 56);

  ctx.fillStyle = '#e11d48';
  ctx.fillRect(10, 10, 8, 44);

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 24px "Consolas", monospace';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('ZEN-86', 26, 32);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '10px "Consolas", monospace';
  ctx.fillText('VT-100', 200, 34);

  return new THREE.CanvasTexture(canvas);
}

/**
 * Creates wide ambient desk shadow for both monitor and keyboard
 */
function createWorkstationShadowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createRadialGradient(256, 256, 40, 256, 256, 250);
  grad.addColorStop(0, 'rgba(10, 15, 25, 0.42)');
  grad.addColorStop(0.35, 'rgba(10, 15, 25, 0.22)');
  grad.addColorStop(0.7, 'rgba(10, 15, 25, 0.05)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  return new THREE.CanvasTexture(canvas);
}

/**
 * Creates curved geometry for cathode ray tube glass face
 */
function createCrtCurvedScreenGeometry(width, height, segX = 32, segY = 32, curvature = 0.12) {
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

/**
 * Creates texture for labeled mechanical keycap
 */
function createKeycapTexture(label, subLabel = '', bgColor = '#ded8cc', textColor = '#2d3137') {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, 128, 128);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.fillRect(0, 0, 128, 12);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.14)';
  ctx.fillRect(0, 116, 128, 12);

  ctx.fillStyle = textColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  if (label.length === 1) {
    ctx.font = 'bold 54px "Space Grotesk", "Segoe UI", sans-serif';
    ctx.fillText(label, 64, subLabel ? 54 : 64);
    if (subLabel) {
      ctx.font = 'bold 26px "Space Grotesk", sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText(subLabel, 64, 96);
    }
  } else {
    ctx.font = 'bold 30px "Space Grotesk", "Segoe UI", sans-serif';
    ctx.fillText(label, 64, 64);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 4;
  return texture;
}

// 5-Row Mechanical Keyboard Layout (62 Keycaps)
const KEYBOARD_ROWS = [
  [
    { code: 'Escape', label: 'ESC', width: 1.0, type: 'accent-red' },
    { code: 'Digit1', label: '1', sub: '!', width: 1.0, type: 'alpha' },
    { code: 'Digit2', label: '2', sub: '@', width: 1.0, type: 'alpha' },
    { code: 'Digit3', label: '3', sub: '#', width: 1.0, type: 'alpha' },
    { code: 'Digit4', label: '4', sub: '$', width: 1.0, type: 'alpha' },
    { code: 'Digit5', label: '5', sub: '%', width: 1.0, type: 'alpha' },
    { code: 'Digit6', label: '6', sub: '^', width: 1.0, type: 'alpha' },
    { code: 'Digit7', label: '7', sub: '&', width: 1.0, type: 'alpha' },
    { code: 'Digit8', label: '8', sub: '*', width: 1.0, type: 'alpha' },
    { code: 'Digit9', label: '9', sub: '(', width: 1.0, type: 'alpha' },
    { code: 'Digit0', label: '0', sub: ')', width: 1.0, type: 'alpha' },
    { code: 'Minus', label: '-', sub: '_', width: 1.0, type: 'alpha' },
    { code: 'Equal', label: '=', sub: '+', width: 1.0, type: 'alpha' },
    { code: 'Backspace', label: 'BACK', width: 1.6, type: 'mod' },
  ],
  [
    { code: 'Tab', label: 'TAB', width: 1.4, type: 'mod' },
    { code: 'KeyQ', label: 'Q', width: 1.0, type: 'alpha' },
    { code: 'KeyW', label: 'W', width: 1.0, type: 'alpha' },
    { code: 'KeyE', label: 'E', width: 1.0, type: 'alpha' },
    { code: 'KeyR', label: 'R', width: 1.0, type: 'alpha' },
    { code: 'KeyT', label: 'T', width: 1.0, type: 'alpha' },
    { code: 'KeyY', label: 'Y', width: 1.0, type: 'alpha' },
    { code: 'KeyU', label: 'U', width: 1.0, type: 'alpha' },
    { code: 'KeyI', label: 'I', width: 1.0, type: 'alpha' },
    { code: 'KeyO', label: 'O', width: 1.0, type: 'alpha' },
    { code: 'KeyP', label: 'P', width: 1.0, type: 'alpha' },
    { code: 'BracketLeft', label: '[', sub: '{', width: 1.0, type: 'alpha' },
    { code: 'BracketRight', label: ']', sub: '}', width: 1.0, type: 'alpha' },
    { code: 'Backslash', label: '\\', sub: '|', width: 1.2, type: 'mod' },
  ],
  [
    { code: 'CapsLock', label: 'CAPS', width: 1.6, type: 'mod' },
    { code: 'KeyA', label: 'A', width: 1.0, type: 'alpha' },
    { code: 'KeyS', label: 'S', width: 1.0, type: 'alpha' },
    { code: 'KeyD', label: 'D', width: 1.0, type: 'alpha' },
    { code: 'KeyF', label: 'F', width: 1.0, type: 'alpha' },
    { code: 'KeyG', label: 'G', width: 1.0, type: 'alpha' },
    { code: 'KeyH', label: 'H', width: 1.0, type: 'alpha' },
    { code: 'KeyJ', label: 'J', width: 1.0, type: 'alpha' },
    { code: 'KeyK', label: 'K', width: 1.0, type: 'alpha' },
    { code: 'KeyL', label: 'L', width: 1.0, type: 'alpha' },
    { code: 'Semicolon', label: ';', sub: ':', width: 1.0, type: 'alpha' },
    { code: 'Quote', label: "'", sub: '"', width: 1.0, type: 'alpha' },
    { code: 'Enter', label: 'ENTER', width: 2.0, type: 'accent-amber' },
  ],
  [
    { code: 'ShiftLeft', label: 'SHIFT', width: 2.1, type: 'mod' },
    { code: 'KeyZ', label: 'Z', width: 1.0, type: 'alpha' },
    { code: 'KeyX', label: 'X', width: 1.0, type: 'alpha' },
    { code: 'KeyC', label: 'C', width: 1.0, type: 'alpha' },
    { code: 'KeyV', label: 'V', width: 1.0, type: 'alpha' },
    { code: 'KeyB', label: 'B', width: 1.0, type: 'alpha' },
    { code: 'KeyN', label: 'N', width: 1.0, type: 'alpha' },
    { code: 'KeyM', label: 'M', width: 1.0, type: 'alpha' },
    { code: 'Comma', label: ',', sub: '<', width: 1.0, type: 'alpha' },
    { code: 'Period', label: '.', sub: '>', width: 1.0, type: 'alpha' },
    { code: 'Slash', label: '/', sub: '?', width: 1.0, type: 'alpha' },
    { code: 'ShiftRight', label: 'SHIFT', width: 2.5, type: 'mod' },
  ],
  [
    { code: 'ControlLeft', label: 'CTRL', width: 1.4, type: 'mod' },
    { code: 'AltLeft', label: 'ALT', width: 1.2, type: 'mod' },
    { code: 'Space', label: '', width: 7.2, type: 'space' },
    { code: 'AltRight', label: 'ALT', width: 1.3, type: 'mod' },
    { code: 'ControlRight', label: 'CTRL', width: 1.4, type: 'mod' },
    { code: 'ZenBadge', label: 'ZEN', width: 1.1, type: 'accent-red' },
  ],
];

export default function RetroWorkstation3D({
  history = [],
  input = '',
  setInput = () => {},
  onExecuteCommand = () => {},
  matrixMode = false,
  className = '',
  defaultRotationY = 0.46, // ~26.5° towards user and command panel
  keyboardRef = null,
}) {
  const mountRef = useRef(null);
  const screenCanvasRef = useRef(null);
  const screenTextureRef = useRef(null);
  const powerLedMatRef = useRef(null);
  const diskLedMatRef = useRef(null);

  const keysMapRef = useRef(new Map());
  const allKeyMeshesRef = useRef([]);

  const [zoomMode, setZoomMode] = useState('overview'); // 'overview' | 'screen'

  // Smooth Camera Zoom State (Centered on unified workstation)
  const zoomStateRef = useRef({
    currentZ: 7.6,
    targetZ: 7.6,
    currentLookY: 0.1,
    targetLookY: 0.1,
  });

  const setZoom = (mode) => {
    setZoomMode(mode);
    if (mode === 'screen') {
      zoomStateRef.current.targetZ = 4.4;
      zoomStateRef.current.targetLookY = 0.95; // Focus right on CRT screen
    } else {
      zoomStateRef.current.targetZ = 7.6;
      zoomStateRef.current.targetLookY = 0.1; // Full workstation view
    }
  };

  const zoomStep = (delta) => {
    const nextZ = Math.max(4.0, Math.min(9.5, zoomStateRef.current.targetZ + delta));
    zoomStateRef.current.targetZ = nextZ;
    const t = THREE.MathUtils.clamp((7.6 - nextZ) / (7.6 - 4.0), 0, 1);
    zoomStateRef.current.targetLookY = 0.1 + t * 0.85;
    setZoomMode(nextZ < 5.4 ? 'screen' : 'overview');
  };

  // Always keep latest props in refs to avoid stale closures in animate() loop
  const historyRef = useRef(history);
  const inputRef = useRef(input);
  const matrixModeRef = useRef(matrixMode);
  const onExecuteCommandRef = useRef(onExecuteCommand);
  const setInputRef = useRef(setInput);

  useEffect(() => {
    historyRef.current = history;
    inputRef.current = input;
    matrixModeRef.current = matrixMode;
    drawScreenCanvas();
  });

  useEffect(() => {
    onExecuteCommandRef.current = onExecuteCommand;
  }, [onExecuteCommand]);

  useEffect(() => {
    setInputRef.current = setInput;
  }, [setInput]);

  // Unified Rotation & Spring-Back state for the entire workstation
  const rotationState = useRef({
    currentX: 0.12,
    currentY: defaultRotationY,
    targetX: 0.12,
    targetY: defaultRotationY,
    defaultX: 0.12,
    defaultY: defaultRotationY,
    isDragging: false,
    prevMouseX: 0,
    prevMouseY: 0,
    lastInteractTime: Date.now(),
  });

  // Re-draw 2D CRT Screen on Canvas (Massive 32px font, high contrast)
  const drawScreenCanvas = useCallback(() => {
    const canvas = screenCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    const curHistory = historyRef.current || [];
    const curInput = inputRef.current || '';
    const isMatrix = matrixModeRef.current;

    const bgBase = isMatrix ? '#030d05' : '#070a14';
    const fgColor = isMatrix ? '#34d399' : '#38bdf8';
    const fgDim = isMatrix ? '#15803d' : '#0284c7';
    const fgWhite = isMatrix ? '#86efac' : '#f8fafc';
    const fgAmber = '#fbbf24';
    const fgRed = '#f87171';

    // Clear background
    ctx.fillStyle = bgBase;
    ctx.fillRect(0, 0, width, height);

    // Subtle CRT glass curve vignette
    const radialGrad = ctx.createRadialGradient(
      width * 0.5, height * 0.5, width * 0.18,
      width * 0.5, height * 0.5, width * 0.72
    );
    radialGrad.addColorStop(0, 'rgba(255, 255, 255, 0.03)');
    radialGrad.addColorStop(0.75, 'rgba(0, 0, 0, 0.12)');
    radialGrad.addColorStop(1, 'rgba(0, 0, 0, 0.40)');
    ctx.fillStyle = radialGrad;
    ctx.fillRect(0, 0, width, height);

    // Subtle CRT Scanlines
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    for (let y = 0; y < height; y += 4) {
      ctx.fillRect(0, y, width, 1.5);
    }

    // Top Header Banner
    ctx.font = 'bold 24px "Consolas", "Courier New", monospace';
    ctx.fillStyle = fgDim;
    ctx.fillText('╔' + '═'.repeat(42) + '╗', 44, 44);
    ctx.fillText('║ IFAC VT-100 CRT // KERNEL v4.19 // ONLINE ║', 44, 70);
    ctx.fillText('╚' + '═'.repeat(42) + '╝', 44, 96);

    // Terminal History Text lines (Massive bold 32px font)
    ctx.font = 'bold 32px "Consolas", "Monaco", "Courier New", monospace';
    const lineHeight = 46;
    const maxLines = 11;
    const startY = 142;

    const formattedLines = [];
    curHistory.forEach((item) => {
      let color = fgWhite;
      if (item.type === 'sys') color = fgDim;
      else if (item.type === 'info') color = fgAmber;
      else if (item.type === 'cmd') color = isMatrix ? '#4ade80' : '#38bdf8';
      else if (item.type === 'err') color = fgRed;
      else if (item.type === 'res') color = isMatrix ? '#86efac' : '#f8fafc';

      const rawLines = String(item.text).split('\n');
      rawLines.forEach((l) => {
        if (l.length <= 42) {
          formattedLines.push({ text: l, color });
        } else {
          for (let c = 0; c < l.length; c += 42) {
            formattedLines.push({ text: l.slice(c, c + 42), color });
          }
        }
      });
    });

    const visibleLines = formattedLines.slice(-maxLines);
    visibleLines.forEach((line, idx) => {
      ctx.fillStyle = line.color;
      ctx.fillText(line.text, 48, startY + idx * lineHeight);
    });

    // Active Prompt Line at the bottom
    const promptY = Math.min(height - 40, startY + visibleLines.length * lineHeight + 8);
    ctx.font = 'bold 32px "Consolas", "Courier New", monospace';
    ctx.fillStyle = fgColor;
    ctx.fillText('steve@ifac:~$ ', 48, promptY);

    const promptWidth = ctx.measureText('steve@ifac:~$ ').width;
    ctx.fillStyle = fgWhite;
    ctx.fillText(curInput, 48 + promptWidth, promptY);

    // Blinking Block Cursor
    const isBlinking = Math.floor(performance.now() / 450) % 2 === 0;
    if (isBlinking) {
      const inputWidth = ctx.measureText(curInput).width;
      ctx.fillStyle = fgColor;
      ctx.fillRect(48 + promptWidth + inputWidth + 3, promptY - 26, 18, 30);
    }

    if (screenTextureRef.current) {
      screenTextureRef.current.needsUpdate = true;
    }
  }, []);

  // Robust Key Mesh Finder
  const findKeyMesh = useCallback((codeOrKey, rawKey) => {
    const map = keysMapRef.current;
    if (!map || map.size === 0) return null;

    if (codeOrKey && map.has(codeOrKey)) {
      return map.get(codeOrKey);
    }

    const target = (rawKey || codeOrKey || '').toLowerCase();
    if (!target) return null;

    if (target === ' ' || target === 'space' || target === 'spacebar') {
      return map.get('Space');
    }
    if (target === 'enter') return map.get('Enter');
    if (target === 'backspace') return map.get('Backspace');
    if (target === 'escape' || target === 'esc') return map.get('Escape');
    if (target === 'tab') return map.get('Tab');
    if (target === 'shift') return map.get('ShiftLeft');
    if (target === 'control' || target === 'ctrl') return map.get('ControlLeft');
    if (target === 'alt') return map.get('AltLeft');

    if (target.length === 1 && target >= 'a' && target <= 'z') {
      const codeName = 'Key' + target.toUpperCase();
      if (map.has(codeName)) return map.get(codeName);
    }
    if (target.length === 1 && target >= '0' && target <= '9') {
      const codeName = 'Digit' + target;
      if (map.has(codeName)) return map.get(codeName);
    }

    for (const [, mesh] of map.entries()) {
      if (mesh.userData?.label?.toLowerCase() === target) {
        return mesh;
      }
    }
    return null;
  }, []);

  // Physical Key Depression
  const pressKey = useCallback((code, rawKey) => {
    const mesh = findKeyMesh(code, rawKey);
    if (mesh) {
      mesh.userData.targetY = mesh.userData.baseY - 0.16;
      mesh.userData.targetRotX = -0.16;
      mesh.userData.isPressed = true;

      if (Array.isArray(mesh.material) && mesh.material[2]) {
        mesh.material[2].emissive.set(matrixModeRef.current ? 0x22c55e : 0xe11d48);
        mesh.material[2].emissiveIntensity = 0.95;
      }
    }
  }, [findKeyMesh]);

  // Spring-back
  const releaseKey = useCallback((code, rawKey) => {
    const mesh = findKeyMesh(code, rawKey);
    if (mesh) {
      mesh.userData.targetY = mesh.userData.baseY;
      mesh.userData.targetRotX = 0;
      mesh.userData.isPressed = false;

      if (Array.isArray(mesh.material) && mesh.material[2]) {
        mesh.material[2].emissive.set(0x000000);
        mesh.material[2].emissiveIntensity = 0;
      }
    }
  }, [findKeyMesh]);

  // Hook up external keyboardRef
  useEffect(() => {
    if (keyboardRef) {
      keyboardRef.current = { pressKey, releaseKey };
    }
  }, [keyboardRef, pressKey, releaseKey]);

  // Blink disk activity LED on commands or input
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

  // Setup Unified Three.js Scene (RUNS ONCE ON MOUNT)
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Offscreen Canvas for CRT Display (1024x768)
    const screenCanvas = document.createElement('canvas');
    screenCanvas.width = 1024;
    screenCanvas.height = 768;
    screenCanvasRef.current = screenCanvas;

    const screenTexture = new THREE.CanvasTexture(screenCanvas);
    screenTexture.anisotropy = 4;
    screenTextureRef.current = screenTexture;

    // Scene
    const scene = new THREE.Scene();
    scene.background = null;

    // Camera (Unified perspective framing both Computer and Keyboard)
    const camera = new THREE.PerspectiveCamera(
      36,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0.5, zoomStateRef.current.targetZ);
    camera.lookAt(0, zoomStateRef.current.targetLookY, 0);

    // Renderer (Alpha transparent, PCF Soft Shadows)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Lighting (Warm Studio Rig)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff8ee, 1.35);
    keyLight.position.set(5, 8, 6);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xdbeafe, 0.65);
    fillLight.position.set(-6, 4, 4);
    scene.add(fillLight);

    // ----------------------------------------------------
    // UNIFIED WORKSTATION GROUP (Holds PC, Keyboard & Cable)
    // ----------------------------------------------------
    const workstationGroup = new THREE.Group();
    workstationGroup.rotation.x = rotationState.current.currentX;
    workstationGroup.rotation.y = rotationState.current.currentY;
    scene.add(workstationGroup);

    // Ground Desk Contact Shadow (Unified)
    const shadowGeo = new THREE.PlaneGeometry(9.0, 7.5);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: createWorkstationShadowTexture(),
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI * 0.5;
    shadowMesh.position.set(0, -1.68, 0.3);
    workstationGroup.add(shadowMesh);

    // ====================================================
    // 1. RETRO CRT COMPUTER (Positioned at y = 0.95, z = -0.65)
    // ====================================================
    const pcGroup = new THREE.Group();
    pcGroup.position.set(0, 0.95, -0.65);
    workstationGroup.add(pcGroup);

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

    const crtScreenMat = new THREE.MeshBasicMaterial({
      map: screenTexture,
    });

    // Lower Chin Housing
    const chinGeo = new THREE.BoxGeometry(4.0, 1.25, 3.2);
    const chinMesh = new THREE.Mesh(chinGeo, vintageBeigeMat);
    chinMesh.position.set(0, -1.2, 0);
    chinMesh.castShadow = true;
    chinMesh.receiveShadow = true;
    pcGroup.add(chinMesh);

    // Upper Monitor Housing
    const upperGeo = new THREE.BoxGeometry(4.0, 2.7, 3.1);
    const upperMesh = new THREE.Mesh(upperGeo, vintageBeigeMat);
    upperMesh.position.set(0, 0.75, -0.05);
    upperMesh.castShadow = true;
    pcGroup.add(upperMesh);

    // Rear Cathode Tube Taper
    const rearTubeGeo = new THREE.BoxGeometry(3.3, 2.3, 2.1);
    const rearTubeMesh = new THREE.Mesh(rearTubeGeo, vintageBeigeMat);
    rearTubeMesh.position.set(0, 0.7, -2.1);
    rearTubeMesh.castShadow = true;
    pcGroup.add(rearTubeMesh);

    const rearCapGeo = new THREE.BoxGeometry(2.1, 1.6, 0.8);
    const rearCapMesh = new THREE.Mesh(rearCapGeo, darkBezelMat);
    rearCapMesh.position.set(0, 0.7, -3.2);
    pcGroup.add(rearCapMesh);

    // Ventilation Grilles
    for (let i = 0; i < 7; i++) {
      const ventGeo = new THREE.BoxGeometry(2.7, 0.035, 0.06);
      const ventMesh = new THREE.Mesh(ventGeo, darkTrimMat);
      ventMesh.position.set(0, 1.6 + i * 0.09, -1.4);
      pcGroup.add(ventMesh);
    }

    // Inset Screen Bezel Frame
    const screenWellGeo = new THREE.BoxGeometry(3.52, 2.48, 0.15);
    const screenWellMesh = new THREE.Mesh(screenWellGeo, darkBezelMat);
    screenWellMesh.position.set(0, 0.82, 1.48);
    pcGroup.add(screenWellMesh);

    // Curved CRT Glass Face
    const crtScreenGeo = createCrtCurvedScreenGeometry(3.36, 2.34, 36, 36, 0.12);
    const crtScreenMesh = new THREE.Mesh(crtScreenGeo, crtScreenMat);
    crtScreenMesh.position.set(0, 0.82, 1.52);
    pcGroup.add(crtScreenMesh);

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

    // Brand Badge
    const badgeGeo = new THREE.BoxGeometry(1.1, 0.28, 0.03);
    const badgeMat = new THREE.MeshStandardMaterial({
      map: createBadgeTexture(),
      roughness: 0.35,
      metalness: 0.25,
    });
    const badgeMesh = new THREE.Mesh(badgeGeo, badgeMat);
    badgeMesh.position.set(-1.15, -1.15, 1.61);
    pcGroup.add(badgeMesh);

    // Rotary Dials
    const knobGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.1, 16);
    knobGeo.rotateX(Math.PI * 0.5);
    const knob1 = new THREE.Mesh(knobGeo, darkTrimMat);
    knob1.position.set(-0.35, -1.15, 1.62);
    const knob2 = new THREE.Mesh(knobGeo, darkTrimMat);
    knob2.position.set(-0.12, -1.15, 1.62);
    pcGroup.add(knob1, knob2);

    // Power LED
    const powerLedGeo = new THREE.SphereGeometry(0.05, 14, 14);
    const powerLedMat = new THREE.MeshStandardMaterial({
      color: matrixModeRef.current ? 0x22c55e : 0xf59e0b,
      emissive: matrixModeRef.current ? 0x22c55e : 0xf59e0b,
      emissiveIntensity: 1.8,
      roughness: 0.2,
    });
    const powerLedMesh = new THREE.Mesh(powerLedGeo, powerLedMat);
    powerLedMesh.position.set(0.08, -1.15, 1.62);
    powerLedMatRef.current = powerLedMat;
    pcGroup.add(powerLedMesh);

    // Low-profile Desk Feet
    const footGeo = new THREE.BoxGeometry(0.8, 0.08, 2.6);
    const footMat = new THREE.MeshStandardMaterial({ color: 0x1f232b, roughness: 0.8 });
    const foot1 = new THREE.Mesh(footGeo, footMat);
    foot1.position.set(-1.4, -1.85, 0);
    const foot2 = new THREE.Mesh(footGeo, footMat);
    foot2.position.set(1.4, -1.85, 0);
    pcGroup.add(foot1, foot2);

    // ====================================================
    // 2. DEDICATED MECHANICAL KEYBOARD (Positioned at y = -1.35, z = 1.25)
    // ====================================================
    const kbGroup = new THREE.Group();
    kbGroup.position.set(0, -1.35, 1.25);
    kbGroup.rotation.x = 0.14; // Ergonomic tilt toward user
    workstationGroup.add(kbGroup);

    // Keyboard Chassis Body
    const kbBodyGeo = new THREE.BoxGeometry(4.7, 0.32, 2.1);
    const kbBodyMesh = new THREE.Mesh(kbBodyGeo, vintageBeigeMat);
    kbBodyMesh.position.set(0, -0.1, 0);
    kbBodyMesh.castShadow = true;
    kbBodyMesh.receiveShadow = true;
    kbGroup.add(kbBodyMesh);

    // Recessed Key Well
    const kbWellGeo = new THREE.BoxGeometry(4.35, 0.06, 1.8);
    const kbWellMesh = new THREE.Mesh(kbWellGeo, darkBezelMat);
    kbWellMesh.position.set(0, 0.06, 0);
    kbGroup.add(kbWellMesh);

    // Keycap Materials
    const alphaKeyMat = new THREE.MeshStandardMaterial({
      color: 0xe5dfd2,
      roughness: 0.45,
      metalness: 0.05,
    });
    const modKeyMat = new THREE.MeshStandardMaterial({
      color: 0x9ca3af,
      roughness: 0.45,
      metalness: 0.08,
    });
    const accentAmberMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.4,
      metalness: 0.1,
    });
    const accentRedMat = new THREE.MeshStandardMaterial({
      color: 0xe11d48,
      roughness: 0.4,
      metalness: 0.1,
    });

    const newKeysMap = new Map();
    const newKeyMeshes = [];

    // Construct the 5 Rows of Keycaps
    const rowSpacing = 0.33;
    const startZ = -0.66;
    const keyHeight = 0.16;
    const baseKeyY = 0.16;
    const unitSize = 0.28;

    KEYBOARD_ROWS.forEach((row, rowIndex) => {
      let totalWidth = 0;
      row.forEach((k) => {
        totalWidth += k.width * unitSize + 0.02;
      });
      totalWidth -= 0.02;

      let currentX = -totalWidth * 0.5;
      const currentZ = startZ + rowIndex * rowSpacing;

      row.forEach((keyData) => {
        const kWidth = keyData.width * unitSize;
        const kDepth = 0.28;
        const geo = new THREE.BoxGeometry(kWidth, keyHeight, kDepth);

        let sideMat = alphaKeyMat;
        let bgHex = '#ded8cc';
        let textHex = '#1e293b';

        if (keyData.type === 'mod') {
          sideMat = modKeyMat;
          bgHex = '#9ca3af';
          textHex = '#0f172a';
        } else if (keyData.type === 'accent-amber') {
          sideMat = accentAmberMat;
          bgHex = '#f59e0b';
          textHex = '#ffffff';
        } else if (keyData.type === 'accent-red') {
          sideMat = accentRedMat;
          bgHex = '#e11d48';
          textHex = '#ffffff';
        } else if (keyData.type === 'space') {
          sideMat = alphaKeyMat;
          bgHex = '#ded8cc';
        }

        const topTex = createKeycapTexture(keyData.label, keyData.sub || '', bgHex, textHex);
        const topFaceMat = new THREE.MeshStandardMaterial({
          map: topTex,
          roughness: 0.4,
          metalness: 0.05,
        });

        const materials = [
          sideMat,
          sideMat,
          topFaceMat,
          sideMat,
          sideMat,
          sideMat,
        ];

        const keyMesh = new THREE.Mesh(geo, materials);
        const posX = currentX + kWidth * 0.5;
        keyMesh.position.set(posX, baseKeyY, currentZ);
        keyMesh.castShadow = true;
        keyMesh.receiveShadow = true;

        keyMesh.userData = {
          code: keyData.code,
          label: keyData.label || ' ',
          baseY: baseKeyY,
          targetY: baseKeyY,
          targetRotX: 0,
          isPressed: false,
        };

        kbGroup.add(keyMesh);
        newKeysMap.set(keyData.code, keyMesh);
        newKeyMeshes.push(keyMesh);

        currentX += kWidth + 0.02;
      });
    });

    keysMapRef.current = newKeysMap;
    allKeyMeshesRef.current = newKeyMeshes;

    // ====================================================
    // 3. COILED VINTAGE KEYBOARD CABLE (Connects KB to PC)
    // ====================================================
    const curvePoints = [];
    const coils = 12;
    const startPt = new THREE.Vector3(-1.3, -1.25, 0.7);
    const endPt = new THREE.Vector3(-1.3, -0.65, -0.2);

    for (let i = 0; i <= 60; i++) {
      const t = i / 60;
      const x = THREE.MathUtils.lerp(startPt.x, endPt.x, t) + Math.sin(t * Math.PI * coils) * 0.06;
      const y = THREE.MathUtils.lerp(startPt.y, endPt.y, t) + Math.cos(t * Math.PI * coils) * 0.04;
      const z = THREE.MathUtils.lerp(startPt.z, endPt.z, t);
      curvePoints.push(new THREE.Vector3(x, y, z));
    }

    const cableCurve = new THREE.CatmullRomCurve3(curvePoints);
    const cableGeo = new THREE.TubeGeometry(cableCurve, 64, 0.028, 8, false);
    const cableMat = new THREE.MeshStandardMaterial({ color: 0x22252d, roughness: 0.8 });
    const cableMesh = new THREE.Mesh(cableGeo, cableMat);
    workstationGroup.add(cableMesh);

    // Initial Screen Draw
    drawScreenCanvas();

    // ====================================================
    // 4. MOUSE RAYCASTING & KEY CLICKING
    // ====================================================
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleCanvasClick = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(allKeyMeshesRef.current);

      if (intersects.length > 0) {
        const clickedMesh = intersects[0].object;
        if (clickedMesh && clickedMesh.userData) {
          const { code, label } = clickedMesh.userData;
          pressKey(code, label);
          sound.playMechanicalKey();
          setTimeout(() => releaseKey(code, label), 160);

          if (code === 'Enter') {
            onExecuteCommandRef.current?.(inputRef.current);
          } else if (code === 'Backspace') {
            setInputRef.current?.((prev) => prev.slice(0, -1));
          } else if (code === 'Space') {
            setInputRef.current?.((prev) => prev + ' ');
          } else if (label && label.length === 1) {
            setInputRef.current?.((prev) => prev + label.toLowerCase());
          }
        }
      }
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('click', handleCanvasClick);

    // ====================================================
    // 5. MOUSE ORBIT DRAG & SPRING-BACK (Entire Workstation)
    // ====================================================
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
      rot.targetY = Math.max(-0.5, Math.min(1.4, rot.targetY));

      rot.prevMouseX = e.clientX;
      rot.prevMouseY = e.clientY;
      rot.lastInteractTime = Date.now();
    };

    const handlePointerUp = () => {
      rot.isDragging = false;
      rot.lastInteractTime = Date.now();
    };

    domEl.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    // Scroll Wheel Zoom
    const handleWheel = (e) => {
      e.preventDefault();
      const delta = e.deltaY * 0.004;
      const nextZ = Math.max(4.0, Math.min(9.5, zoomStateRef.current.targetZ + delta));
      zoomStateRef.current.targetZ = nextZ;
      const t = THREE.MathUtils.clamp((7.6 - nextZ) / (7.6 - 4.0), 0, 1);
      zoomStateRef.current.targetLookY = 0.1 + t * 0.85;
      setZoomMode(nextZ < 5.4 ? 'screen' : 'overview');
    };
    domEl.addEventListener('wheel', handleWheel, { passive: false });

    // ====================================================
    // 6. ANIMATION LOOP (Smooth Key lerp, Orbit damping, CRT blink)
    // ====================================================
    let animId;
    let lastBlink = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Spring-back damping to 30° default orientation when idle
      const timeSinceInteract = Date.now() - rot.lastInteractTime;
      if (!rot.isDragging && timeSinceInteract > 2800) {
        rot.targetX += (rot.defaultX - rot.targetX) * 0.025;
        rot.targetY += (rot.defaultY - rot.targetY) * 0.025;
      }

      rot.currentX += (rot.targetX - rot.currentX) * 0.12;
      rot.currentY += (rot.targetY - rot.currentY) * 0.12;
      workstationGroup.rotation.x = rot.currentX;
      workstationGroup.rotation.y = rot.currentY;

      // Smooth Camera Zoom and Target Center Lerp
      const zState = zoomStateRef.current;
      camera.position.z += (zState.targetZ - camera.position.z) * 0.1;
      zState.currentLookY += (zState.targetLookY - zState.currentLookY) * 0.1;
      camera.lookAt(0, zState.currentLookY, 0);

      // Smooth Key Lerp Animation
      newKeysMap.forEach((mesh) => {
        mesh.position.y += (mesh.userData.targetY - mesh.position.y) * 0.45;
        mesh.rotation.x += (mesh.userData.targetRotX - mesh.rotation.x) * 0.45;
      });

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
      domEl.removeEventListener('click', handleCanvasClick);
      domEl.removeEventListener('wheel', handleWheel);
      domEl.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      if (container.contains(domEl)) {
        container.removeChild(domEl);
      }
      renderer.dispose();
    };
  }, [drawScreenCanvas, pressKey, releaseKey]);

  // Global window listener when not typing in an input
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (document.activeElement && document.activeElement.tagName === 'INPUT') {
        return;
      }
      pressKey(e.code, e.key);
      sound.playMechanicalKey();

      if (e.key === 'Enter') {
        onExecuteCommandRef.current?.(inputRef.current);
      }
    };

    const handleGlobalKeyUp = (e) => {
      if (document.activeElement && document.activeElement.tagName === 'INPUT') {
        return;
      }
      releaseKey(e.code, e.key);
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    window.addEventListener('keyup', handleGlobalKeyUp);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
      window.removeEventListener('keyup', handleGlobalKeyUp);
    };
  }, [pressKey, releaseKey]);

  return (
    <div className={`relative w-full h-[620px] sm:h-[700px] lg:h-[760px] xl:h-[820px] select-none ${className}`}>
      {/* Floating Minimal Glass HUD for Zoom & Viewport */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/85 backdrop-blur-md border border-zinc-200/80 shadow-md">
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            setZoom('screen');
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
            zoomMode === 'screen'
              ? 'bg-zinc-950 text-white shadow-xs'
              : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
          }`}
          title="Focar diretamente na tela de fósforo do monitor"
        >
          <Maximize2 className="w-3.5 h-3.5 text-rose-500" />
          <span>Focar Tela</span>
        </button>
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            setZoom('overview');
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
            zoomMode === 'overview'
              ? 'bg-zinc-950 text-white shadow-xs'
              : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
          }`}
          title="Visão completa da estação de trabalho retrô"
        >
          <Monitor className="w-3.5 h-3.5 text-emerald-500" />
          <span>Bancada Completa</span>
        </button>
        <div className="h-4 w-px bg-zinc-300 mx-0.5" />
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            zoomStep(-0.6);
          }}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-sm font-mono text-zinc-700 hover:bg-zinc-100 font-bold transition-colors cursor-pointer"
          title="Aproximar (+)"
        >
          +
        </button>
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            zoomStep(0.6);
          }}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-sm font-mono text-zinc-700 hover:bg-zinc-100 font-bold transition-colors cursor-pointer"
          title="Afastar (-)"
        >
          -
        </button>
      </div>

      {/* Subtle Hint Badge at Bottom Left */}
      <div className="pointer-events-none absolute bottom-4 left-4 z-10 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 text-[11px] font-mono text-white/80">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
        <span>Arraste para Girar 360° • Scroll para Zoom • Clique nas Teclas</span>
      </div>

      {/* 3D WebGL Canvas Viewport (Free & Boundless directly on the session floor) */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        title="Clique e arraste para girar a estação em 360° • Use o scroll para zoom"
      />
    </div>
  );
}
