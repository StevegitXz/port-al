import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { sound } from '../../utils/sound';

/**
 * Creates a canvas texture for a labeled mechanical keycap
 */
function createKeycapTexture(label, subLabel = '', bgColor = '#ded8cc', textColor = '#2d3137') {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, 128, 128);

  // Keycap surface recess / bevel
  ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
  ctx.fillRect(8, 8, 112, 112);
  ctx.fillStyle = bgColor;
  ctx.fillRect(14, 14, 100, 100);

  // Text label
  ctx.fillStyle = textColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  if (label.length === 1) {
    ctx.font = 'bold 56px "Space Mono", monospace';
    ctx.fillText(label, 64, subLabel ? 52 : 64);
  } else if (label.length <= 4) {
    ctx.font = 'bold 36px "Space Mono", monospace';
    ctx.fillText(label, 64, 64);
  } else {
    ctx.font = 'bold 26px "Space Mono", monospace';
    ctx.fillText(label, 64, 64);
  }

  if (subLabel) {
    ctx.font = 'bold 22px "Space Mono", monospace';
    ctx.fillStyle = 'rgba(45, 49, 55, 0.65)';
    ctx.fillText(subLabel, 64, 94);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 4;
  return texture;
}

/**
 * Soft radial shadow texture for workstation grounding on desk surface
 */
function createShadowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createRadialGradient(256, 256, 40, 256, 256, 256);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0.28)');
  grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.12)');
  grad.addColorStop(0.85, 'rgba(0, 0, 0, 0.03)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  return new THREE.CanvasTexture(canvas);
}

/**
 * Creates a curved convex geometry for the CRT glass tube
 */
function createCrtCurvedScreenGeometry(width, height, segX = 36, segY = 36, curvature = 0.24) {
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
 * Keyboard Layout specification with positions, sizes, labels and key codes
 */
const KEYBOARD_ROWS = [
  // Row 0: Function & Numbers
  [
    { code: 'Escape', label: 'ESC', width: 1.0, type: 'accent-red' },
    { code: 'Digit1', label: '1', sub: '!', width: 1.0 },
    { code: 'Digit2', label: '2', sub: '@', width: 1.0 },
    { code: 'Digit3', label: '3', sub: '#', width: 1.0 },
    { code: 'Digit4', label: '4', sub: '$', width: 1.0 },
    { code: 'Digit5', label: '5', sub: '%', width: 1.0 },
    { code: 'Digit6', label: '6', sub: '^', width: 1.0 },
    { code: 'Digit7', label: '7', sub: '&', width: 1.0 },
    { code: 'Digit8', label: '8', sub: '*', width: 1.0 },
    { code: 'Digit9', label: '9', sub: '(', width: 1.0 },
    { code: 'Digit0', label: '0', sub: ')', width: 1.0 },
    { code: 'Minus', label: '-', sub: '_', width: 1.0 },
    { code: 'Equal', label: '=', sub: '+', width: 1.0 },
    { code: 'Backspace', label: 'BACK', width: 1.7, type: 'mod' },
  ],
  // Row 1: QWERTY
  [
    { code: 'Tab', label: 'TAB', width: 1.4, type: 'mod' },
    { code: 'KeyQ', label: 'Q', width: 1.0 },
    { code: 'KeyW', label: 'W', width: 1.0 },
    { code: 'KeyE', label: 'E', width: 1.0 },
    { code: 'KeyR', label: 'R', width: 1.0 },
    { code: 'KeyT', label: 'T', width: 1.0 },
    { code: 'KeyY', label: 'Y', width: 1.0 },
    { code: 'KeyU', label: 'U', width: 1.0 },
    { code: 'KeyI', label: 'I', width: 1.0 },
    { code: 'KeyO', label: 'O', width: 1.0 },
    { code: 'KeyP', label: 'P', width: 1.0 },
    { code: 'BracketLeft', label: '[', width: 1.0 },
    { code: 'BracketRight', label: ']', width: 1.0 },
    { code: 'Backslash', label: '\\', width: 1.3 },
  ],
  // Row 2: ASDF
  [
    { code: 'CapsLock', label: 'CAPS', width: 1.6, type: 'mod' },
    { code: 'KeyA', label: 'A', width: 1.0 },
    { code: 'KeyS', label: 'S', width: 1.0 },
    { code: 'KeyD', label: 'D', width: 1.0 },
    { code: 'KeyF', label: 'F', width: 1.0 },
    { code: 'KeyG', label: 'G', width: 1.0 },
    { code: 'KeyH', label: 'H', width: 1.0 },
    { code: 'KeyJ', label: 'J', width: 1.0 },
    { code: 'KeyK', label: 'K', width: 1.0 },
    { code: 'KeyL', label: 'L', width: 1.0 },
    { code: 'Semicolon', label: ';', width: 1.0 },
    { code: 'Quote', label: '\'', width: 1.0 },
    { code: 'Enter', label: 'ENTER', width: 2.1, type: 'accent-orange' },
  ],
  // Row 3: ZXCV
  [
    { code: 'ShiftLeft', label: 'SHIFT', width: 2.1, type: 'mod' },
    { code: 'KeyZ', label: 'Z', width: 1.0 },
    { code: 'KeyX', label: 'X', width: 1.0 },
    { code: 'KeyC', label: 'C', width: 1.0 },
    { code: 'KeyV', label: 'V', width: 1.0 },
    { code: 'KeyB', label: 'B', width: 1.0 },
    { code: 'KeyN', label: 'N', width: 1.0 },
    { code: 'KeyM', label: 'M', width: 1.0 },
    { code: 'Comma', label: ',', width: 1.0 },
    { code: 'Period', label: '.', width: 1.0 },
    { code: 'Slash', label: '/', width: 1.0 },
    { code: 'ShiftRight', label: 'SHIFT', width: 2.6, type: 'mod' },
  ],
  // Row 4: Space & Modifiers
  [
    { code: 'ControlLeft', label: 'CTRL', width: 1.5, type: 'mod' },
    { code: 'AltLeft', label: 'ALT', width: 1.4, type: 'mod' },
    { code: 'Space', label: 'SPACE', width: 6.8, type: 'space' },
    { code: 'AltRight', label: 'ALT', width: 1.4, type: 'mod' },
    { code: 'ControlRight', label: 'CTRL', width: 1.5, type: 'mod' },
    { code: 'ZenBadge', label: 'ZEN', width: 1.1, type: 'accent-red' },
  ],
];

export default function RetroTerminalCanvas3D({
  history = [],
  input = '',
  setInput = () => {},
  onExecuteCommand = () => {},
  matrixMode = false,
  className = '',
}) {
  const mountRef = useRef(null);
  const hiddenInputRef = useRef(null);
  const promptInputRef = useRef(null);
  const screenCanvasRef = useRef(null);
  const screenTextureRef = useRef(null);
  const keysMapRef = useRef(new Map());
  const powerLedRef = useRef(null);
  const screenGlowLightRef = useRef(null);
  const allKeyMeshesRef = useRef([]);

  const inputValRef = useRef(input);
  useEffect(() => {
    inputValRef.current = input;
  }, [input]);

  const matrixModeRef = useRef(matrixMode);
  useEffect(() => {
    matrixModeRef.current = matrixMode;
  }, [matrixMode]);

  const [isFocused, setIsFocused] = useState(false);

  // Rotation / spring-back state (centered and closer viewing angle)
  const rotationState = useRef({
    currentX: 0.12,
    currentY: -0.05,
    targetX: 0.12,
    targetY: -0.05,
    defaultX: 0.12,
    defaultY: -0.05,
    isDragging: false,
    prevMouseX: 0,
    prevMouseY: 0,
    downMouseX: 0,
    downMouseY: 0,
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
    const bgBase = isMatrix ? '#040d06' : '#070b12';
    const fgColor = isMatrix ? '#22c55e' : '#38bdf8';
    const fgDim = isMatrix ? '#15803d' : '#0369a1';
    const fgWhite = isMatrix ? '#86efac' : '#f8fafc';
    const fgAmber = '#fbbf24';
    const fgRed = '#f87171';

    // Clear background
    ctx.fillStyle = bgBase;
    ctx.fillRect(0, 0, width, height);

    // Vignette CRT glass curve shading
    const radialGrad = ctx.createRadialGradient(
      width * 0.5, height * 0.5, width * 0.15,
      width * 0.5, height * 0.5, width * 0.72
    );
    radialGrad.addColorStop(0, 'rgba(255, 255, 255, 0.05)');
    radialGrad.addColorStop(0.72, 'rgba(0, 0, 0, 0.22)');
    radialGrad.addColorStop(1, 'rgba(0, 0, 0, 0.85)');
    ctx.fillStyle = radialGrad;
    ctx.fillRect(0, 0, width, height);

    // CRT Scanlines
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    for (let y = 0; y < height; y += 4) {
      ctx.fillRect(0, y, width, 2);
    }

    // Top Header Banner
    ctx.font = 'bold 15px "Space Mono", monospace';
    ctx.fillStyle = fgDim;
    ctx.fillText('╔' + '═'.repeat(66) + '╗', 34, 38);
    ctx.fillText(`║  IFAC VT-100 TERMINAL EMULATOR // NODE RIO BRANCO // 80x25 // ONLINE `, 34, 56);
    ctx.fillText('╚' + '═'.repeat(66) + '╝', 34, 74);

    // Terminal History Text lines
    ctx.font = '16px "Space Mono", "Courier New", monospace';
    const lineHeight = 24;
    const maxLines = 23;
    const startY = 104;

    // Format history into printable visual lines with wrapping
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

    // Window lines to show recent output
    const visibleLines = formattedLines.slice(-maxLines);
    visibleLines.forEach((line, idx) => {
      ctx.fillStyle = line.color;
      ctx.fillText(line.text, 44, startY + idx * lineHeight);
    });

    // Active Prompt Line at the bottom
    const promptY = Math.min(height - 40, startY + visibleLines.length * lineHeight + 8);
    ctx.font = 'bold 17px "Space Mono", "Courier New", monospace';
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

  // Comprehensive Key Finder supporting Code, Key, Case and Character Variants
  const findKeyMesh = useCallback((codeOrKey, rawKey) => {
    const map = keysMapRef.current;
    if (!map || map.size === 0) return null;

    // 1. Direct code lookup
    if (codeOrKey && map.has(codeOrKey)) {
      return map.get(codeOrKey);
    }

    // 2. Direct key normalization
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

    // Single letters (a-z)
    if (target.length === 1 && target >= 'a' && target <= 'z') {
      const candidateCode = 'Key' + target.toUpperCase();
      if (map.has(candidateCode)) return map.get(candidateCode);
    }

    // Numbers (0-9)
    if (target.length === 1 && target >= '0' && target <= '9') {
      const candidateCode = 'Digit' + target;
      if (map.has(candidateCode)) return map.get(candidateCode);
    }

    // 3. Fallback search by label
    for (const [, mesh] of map.entries()) {
      if (mesh.userData?.label?.toLowerCase() === target) {
        return mesh;
      }
    }

    return null;
  }, []);

  // Physically Depress 3D Keycap (Visible mechanical motion + glow highlight)
  const pressKey = useCallback((code, rawKey) => {
    const mesh = findKeyMesh(code, rawKey);
    if (mesh) {
      // Substantial physical travel downwards + backward mechanical pivot
      mesh.userData.targetY = mesh.userData.baseY - 0.16;
      mesh.userData.targetRotX = -0.16;
      mesh.userData.isPressed = true;

      // Glow highlight on top face
      if (Array.isArray(mesh.material) && mesh.material[2]) {
        mesh.material[2].emissive.set(matrixModeRef.current ? 0x22c55e : 0xe11d48);
        mesh.material[2].emissiveIntensity = 0.85;
      }
    }
  }, [findKeyMesh]);

  // Release 3D Keycap with spring-back
  const releaseKey = useCallback((code, rawKey) => {
    const mesh = findKeyMesh(code, rawKey);
    if (mesh) {
      mesh.userData.targetY = mesh.userData.baseY;
      mesh.userData.targetRotX = 0;
      mesh.userData.isPressed = false;

      // Remove highlight
      if (Array.isArray(mesh.material) && mesh.material[2]) {
        mesh.material[2].emissive.set(0x000000);
        mesh.material[2].emissiveIntensity = 0;
      }
    }
  }, [findKeyMesh]);

  // Update lights and LED when matrixMode changes without rebuilding scene
  useEffect(() => {
    if (screenGlowLightRef.current) {
      screenGlowLightRef.current.color.set(matrixMode ? 0x22c55e : 0x38bdf8);
    }
    if (powerLedRef.current) {
      const ledColor = matrixMode ? 0x22c55e : 0xf59e0b;
      powerLedRef.current.color.set(ledColor);
      powerLedRef.current.emissive.set(ledColor);
    }
  }, [matrixMode]);

  // Set up Three.js Scene, Geometry and Lifecycle (runs once on mount)
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Create dynamic offscreen canvas for CRT screen
    const screenCanvas = document.createElement('canvas');
    screenCanvas.width = 1024;
    screenCanvas.height = 768;
    screenCanvasRef.current = screenCanvas;

    const screenTexture = new THREE.CanvasTexture(screenCanvas);
    screenTexture.anisotropy = 4;
    screenTextureRef.current = screenTexture;

    // Scene & Camera - Set closer and centered for high-impact monumentality
    const scene = new THREE.Scene();
    scene.background = null; // Completely transparent: workstation sits directly on the page!

    const camera = new THREE.PerspectiveCamera(
      34,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    // Camera placed closer (5.6 instead of 7.8) and looking straight at workstation center
    camera.position.set(0, 1.5, 5.6);
    camera.lookAt(0, 0.15, 0);

    // Renderer with full alpha transparency
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Lighting (Warm studio lighting + phosphor bounce)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff7ed, 1.5);
    dirLight.position.set(5, 9, 7);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0xcfd8dc, 0.7);
    fillLight.position.set(-6, 4, 3);
    scene.add(fillLight);

    // Screen phosphor glow onto the workstation
    const screenGlowLight = new THREE.PointLight(
      matrixMode ? 0x22c55e : 0x38bdf8,
      1.8,
      4.5
    );
    screenGlowLight.position.set(0, 0.8, 1.0);
    screenGlowLightRef.current = screenGlowLight;
    scene.add(screenGlowLight);

    // Workstation Root Group (for rotation and spring-back)
    const workstationGroup = new THREE.Group();
    scene.add(workstationGroup);

    // Soft Desk Ambient Shadow Plane (grounds the workstation on the page seamlessly)
    const shadowTex = createShadowTexture();
    const shadowGeo = new THREE.PlaneGeometry(7.2, 5.8);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI * 0.5;
    shadowMesh.position.set(0, -1.35, 0.4);
    workstationGroup.add(shadowMesh);

    // ----------------------------------------------------
    // MATERIALS (Vintage Retro Beige & Mechanical Accents)
    // ----------------------------------------------------
    const casingBeige = new THREE.MeshStandardMaterial({
      color: 0xdcd5c2,
      roughness: 0.58,
      metalness: 0.05,
    });

    const casingBevelBeige = new THREE.MeshStandardMaterial({
      color: 0xc9c1ae,
      roughness: 0.62,
      metalness: 0.05,
    });

    const darkAccentMat = new THREE.MeshStandardMaterial({
      color: 0x22252c,
      roughness: 0.7,
      metalness: 0.2,
    });

    const screenCrtMat = new THREE.MeshStandardMaterial({
      map: screenTexture,
      emissiveMap: screenTexture,
      emissive: new THREE.Color(0xffffff),
      emissiveIntensity: 0.95,
      roughness: 0.22,
      metalness: 0.08,
    });

    // ----------------------------------------------------
    // 1. CRT BOX MONITOR
    // ----------------------------------------------------
    const monitorGroup = new THREE.Group();
    monitorGroup.position.set(0, 0.75, -0.2);

    // Swivel Base / Pedestal
    const baseGeo = new THREE.BoxGeometry(2.4, 0.16, 2.1);
    const baseMesh = new THREE.Mesh(baseGeo, casingBevelBeige);
    baseMesh.position.set(0, -1.32, 0);
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    monitorGroup.add(baseMesh);

    const neckGeo = new THREE.CylinderGeometry(0.48, 0.58, 0.32, 18);
    const neckMesh = new THREE.Mesh(neckGeo, darkAccentMat);
    neckMesh.position.set(0, -1.1, 0);
    monitorGroup.add(neckMesh);

    // Main CRT Front Box Housing
    const frontHousingGeo = new THREE.BoxGeometry(4.1, 3.5, 1.6);
    const frontHousingMesh = new THREE.Mesh(frontHousingGeo, casingBeige);
    frontHousingMesh.position.set(0, 0.45, -0.4);
    frontHousingMesh.castShadow = true;
    monitorGroup.add(frontHousingMesh);

    // Tapered Rear Cathode Tube Housing (Iconic Deep Box Depth)
    const rearHousingGeo = new THREE.BoxGeometry(3.4, 2.9, 2.2);
    const rearHousingMesh = new THREE.Mesh(rearHousingGeo, casingBevelBeige);
    rearHousingMesh.position.set(0, 0.45, -1.9);
    rearHousingMesh.castShadow = true;
    monitorGroup.add(rearHousingMesh);

    const rearEndCupGeo = new THREE.BoxGeometry(2.3, 1.9, 0.8);
    const rearEndCupMesh = new THREE.Mesh(rearEndCupGeo, darkAccentMat);
    rearEndCupMesh.position.set(0, 0.45, -3.2);
    monitorGroup.add(rearEndCupMesh);

    // Rear Ventilation Grilles
    for (let r = 0; r < 6; r++) {
      const ventGeo = new THREE.BoxGeometry(2.6, 0.035, 0.05);
      const ventMesh = new THREE.Mesh(ventGeo, darkAccentMat);
      ventMesh.position.set(0, 1.45 + r * 0.1, -1.4);
      monitorGroup.add(ventMesh);
    }

    // Front Bezel Frame (surrounding the curved tube screen)
    const topBezel = new THREE.Mesh(
      new THREE.BoxGeometry(4.1, 0.42, 0.32),
      casingBevelBeige
    );
    topBezel.position.set(0, 2.0, 0.35);
    monitorGroup.add(topBezel);

    const bottomBezel = new THREE.Mesh(
      new THREE.BoxGeometry(4.1, 0.82, 0.32),
      casingBevelBeige
    );
    bottomBezel.position.set(0, -0.9, 0.35);
    bottomBezel.receiveShadow = true;
    monitorGroup.add(bottomBezel);

    const leftBezel = new THREE.Mesh(
      new THREE.BoxGeometry(0.44, 2.2, 0.32),
      casingBevelBeige
    );
    leftBezel.position.set(-1.83, 0.6, 0.35);
    monitorGroup.add(leftBezel);

    const rightBezel = new THREE.Mesh(
      new THREE.BoxGeometry(0.44, 2.2, 0.32),
      casingBevelBeige
    );
    rightBezel.position.set(1.83, 0.6, 0.35);
    monitorGroup.add(rightBezel);

    // Curved CRT Screen Mesh
    const crtScreenGeo = createCrtCurvedScreenGeometry(3.22, 2.2, 36, 36, 0.24);
    const crtScreenMesh = new THREE.Mesh(crtScreenGeo, screenCrtMat);
    crtScreenMesh.position.set(0, 0.6, 0.36);
    monitorGroup.add(crtScreenMesh);

    // Front Bottom Controls: Badge, Dials, Power LED & 3.5" Floppy Slot
    // Badge
    const badgeGeo = new THREE.BoxGeometry(0.9, 0.22, 0.04);
    const badgeTexture = createKeycapTexture('ZEN-86', 'VT100', '#252830', '#38bdf8');
    const badgeMat = new THREE.MeshStandardMaterial({
      map: badgeTexture,
      roughness: 0.4,
      metalness: 0.3,
    });
    const badgeMesh = new THREE.Mesh(badgeGeo, badgeMat);
    badgeMesh.position.set(-1.25, -0.85, 0.52);
    monitorGroup.add(badgeMesh);

    // Rotary Knobs (Brightness & Contrast)
    const knobGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.12, 16);
    knobGeo.rotateX(Math.PI * 0.5);
    const knob1 = new THREE.Mesh(knobGeo, darkAccentMat);
    knob1.position.set(-0.4, -0.85, 0.52);
    const knob2 = new THREE.Mesh(knobGeo, darkAccentMat);
    knob2.position.set(-0.15, -0.85, 0.52);
    monitorGroup.add(knob1, knob2);

    // Power Indicator LED
    const ledGeo = new THREE.SphereGeometry(0.05, 12, 12);
    const ledMat = new THREE.MeshStandardMaterial({
      color: matrixMode ? 0x22c55e : 0xf59e0b,
      emissive: matrixMode ? 0x22c55e : 0xf59e0b,
      emissiveIntensity: 1.8,
      roughness: 0.2,
    });
    const ledMesh = new THREE.Mesh(ledGeo, ledMat);
    ledMesh.position.set(0.2, -0.85, 0.52);
    powerLedRef.current = ledMat;
    monitorGroup.add(ledMesh);

    // 3.5" Floppy Disk Slot (Retro Touch!)
    const floppySlotGeo = new THREE.BoxGeometry(1.05, 0.12, 0.06);
    const floppySlotMesh = new THREE.Mesh(floppySlotGeo, darkAccentMat);
    floppySlotMesh.position.set(1.15, -0.85, 0.52);
    monitorGroup.add(floppySlotMesh);

    workstationGroup.add(monitorGroup);

    // ----------------------------------------------------
    // 2. RETRO MECHANICAL KEYBOARD
    // ----------------------------------------------------
    const keyboardGroup = new THREE.Group();
    keyboardGroup.position.set(0, -0.82, 2.15);
    keyboardGroup.rotation.x = -0.16; // Tilted ergonomically towards user

    // Keyboard Base / Chassis
    const kbBodyGeo = new THREE.BoxGeometry(4.35, 0.32, 1.85);
    const kbBodyMesh = new THREE.Mesh(kbBodyGeo, casingBeige);
    kbBodyMesh.castShadow = true;
    kbBodyMesh.receiveShadow = true;
    keyboardGroup.add(kbBodyMesh);

    // Keyboard Inset Well
    const kbWellGeo = new THREE.BoxGeometry(4.05, 0.08, 1.6);
    const kbWellMesh = new THREE.Mesh(kbWellGeo, darkAccentMat);
    kbWellMesh.position.set(0, 0.14, 0);
    keyboardGroup.add(kbWellMesh);

    // Keycap Materials Pool
    const alphaKeyMat = new THREE.MeshStandardMaterial({
      color: 0xe5dfd2,
      roughness: 0.45,
      metalness: 0.05,
    });

    const modKeyMat = new THREE.MeshStandardMaterial({
      color: 0x9ca3af,
      roughness: 0.45,
      metalness: 0.05,
    });

    const accentRedMat = new THREE.MeshStandardMaterial({
      color: 0xe11d48,
      roughness: 0.4,
      metalness: 0.1,
    });

    const accentOrangeMat = new THREE.MeshStandardMaterial({
      color: 0xf97316,
      roughness: 0.4,
      metalness: 0.1,
    });

    // Populate Keycaps from Layout
    const unitSize = 0.245;
    const keyHeight = 0.14;
    const startRowZ = -0.62;
    const rowSpacing = 0.285;

    const newKeysMap = new Map();
    const allKeyMeshes = [];

    KEYBOARD_ROWS.forEach((row, rowIdx) => {
      let totalUnits = 0;
      row.forEach((k) => (totalUnits += k.width));
      const rowWidth = totalUnits * unitSize;
      let curX = -rowWidth * 0.5;

      row.forEach((keyData) => {
        const kWidth = keyData.width * unitSize - 0.025;
        const kDepth = unitSize - 0.025;

        // Choose Material
        let kMat = alphaKeyMat;
        let bgHex = '#ded8cc';
        let textHex = '#1f2937';

        if (keyData.type === 'mod') {
          kMat = modKeyMat;
          bgHex = '#9ca3af';
          textHex = '#111827';
        } else if (keyData.type === 'accent-red') {
          kMat = accentRedMat;
          bgHex = '#e11d48';
          textHex = '#ffffff';
        } else if (keyData.type === 'accent-orange') {
          kMat = accentOrangeMat;
          bgHex = '#f97316';
          textHex = '#ffffff';
        } else if (keyData.type === 'space') {
          kMat = alphaKeyMat;
          bgHex = '#ded8cc';
          textHex = '#6b7280';
        }

        // Tapered Keycap Geometry
        const keyGeo = new THREE.BoxGeometry(kWidth, keyHeight, kDepth);
        const keycapTex = createKeycapTexture(
          keyData.label,
          keyData.sub || '',
          bgHex,
          textHex
        );

        const topFaceMat = new THREE.MeshStandardMaterial({
          map: keycapTex,
          roughness: 0.4,
          metalness: 0.05,
        });

        const keyMaterials = [
          kMat, // right
          kMat, // left
          topFaceMat, // top
          kMat, // bottom
          kMat, // front
          kMat, // back
        ];

        const keyMesh = new THREE.Mesh(keyGeo, keyMaterials);
        const posX = curX + (keyData.width * unitSize) * 0.5;
        const posY = 0.22;
        const posZ = startRowZ + rowIdx * rowSpacing;

        keyMesh.position.set(posX, posY, posZ);
        keyMesh.castShadow = true;
        keyMesh.receiveShadow = true;

        keyMesh.userData = {
          code: keyData.code,
          label: keyData.label,
          baseY: posY,
          targetY: posY,
          targetRotX: 0,
          isPressed: false,
        };

        keyboardGroup.add(keyMesh);
        newKeysMap.set(keyData.code, keyMesh);
        allKeyMeshes.push(keyMesh);

        curX += keyData.width * unitSize;
      });
    });

    keysMapRef.current = newKeysMap;
    allKeyMeshesRef.current = allKeyMeshes;
    workstationGroup.add(keyboardGroup);

    // Initial Screen Draw
    drawScreenCanvas();

    // ----------------------------------------------------
    // MOUSE DRAG & ORBIT INSPECTION + RAYCAST KEY CLICKING
    // ----------------------------------------------------
    const rot = rotationState.current;
    const raycaster = new THREE.Raycaster();
    const mouseCoord = new THREE.Vector2();

    const handlePointerDown = (e) => {
      rot.isDragging = true;
      rot.prevMouseX = e.clientX;
      rot.prevMouseY = e.clientY;
      rot.downMouseX = e.clientX;
      rot.downMouseY = e.clientY;
      rot.lastInteractTime = Date.now();
    };

    const handlePointerMove = (e) => {
      if (!rot.isDragging) return;
      const deltaX = e.clientX - rot.prevMouseX;
      const deltaY = e.clientY - rot.prevMouseY;

      rot.targetY += deltaX * 0.007;
      rot.targetX += deltaY * 0.007;

      rot.targetX = Math.max(-0.15, Math.min(0.55, rot.targetX));
      rot.targetY = Math.max(-0.85, Math.min(0.85, rot.targetY));

      rot.prevMouseX = e.clientX;
      rot.prevMouseY = e.clientY;
      rot.lastInteractTime = Date.now();
    };

    const handlePointerUp = (e) => {
      rot.isDragging = false;
      rot.lastInteractTime = Date.now();

      // Check if this was a click (not a drag)
      const dist = Math.hypot(e.clientX - rot.downMouseX, e.clientY - rot.downMouseY);
      if (dist < 6) {
        // Focus prompt input
        if (promptInputRef.current) {
          promptInputRef.current.focus();
          setIsFocused(true);
        } else if (hiddenInputRef.current) {
          hiddenInputRef.current.focus();
          setIsFocused(true);
        }

        // Raycast against 3D keys
        const rect = domEl.getBoundingClientRect();
        mouseCoord.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouseCoord.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouseCoord, camera);

        const intersects = raycaster.intersectObjects(allKeyMeshes, false);
        if (intersects.length > 0) {
          const hitMesh = intersects[0].object;
          if (hitMesh && hitMesh.userData && hitMesh.userData.code) {
            const { code, label } = hitMesh.userData;
            pressKey(code, label);
            sound.playMechanicalKey();
            setTimeout(() => releaseKey(code, label), 160);

            // Trigger typing action
            if (code === 'Enter') {
              onExecuteCommand(inputValRef.current);
            } else if (code === 'Backspace') {
              setInput((prev) => prev.slice(0, -1));
            } else if (code === 'Space') {
              setInput((prev) => prev + ' ');
            } else if (label && label.length === 1) {
              setInput((prev) => prev + label.toLowerCase());
            }
          }
        }
      }
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    // ----------------------------------------------------
    // ANIMATION LOOP (Damping, Key Lerp, Screen Refresh)
    // ----------------------------------------------------
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

      // Smooth interpolation for workstation rotation
      rot.currentX += (rot.targetX - rot.currentX) * 0.12;
      rot.currentY += (rot.targetY - rot.currentY) * 0.12;
      workstationGroup.rotation.x = rot.currentX;
      workstationGroup.rotation.y = rot.currentY;

      // Animate 3D physical keys (depression & spring-back lerp)
      newKeysMap.forEach((mesh) => {
        mesh.position.y += (mesh.userData.targetY - mesh.position.y) * 0.45;
        mesh.rotation.x += (mesh.userData.targetRotX - mesh.rotation.x) * 0.45;
      });

      // Pulse power LED
      if (powerLedRef.current) {
        const pulse = 1.4 + Math.sin(performance.now() * 0.004) * 0.4;
        powerLedRef.current.emissiveIntensity = pulse;
      }

      // Periodic screen refresh for blinking cursor
      const now = performance.now();
      if (now - lastBlink > 450) {
        lastBlink = now;
        drawScreenCanvas();
      }

      renderer.render(scene, camera);
    };

    animate();

    // ----------------------------------------------------
    // RESIZE OBSERVER
    // ----------------------------------------------------
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

    // Cleanup
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
  }, [drawScreenCanvas, pressKey, releaseKey]);

  // Global window listener for typing when focused or interacting
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      // If typing in another input element outside our terminal, don't interfere
      if (
        document.activeElement &&
        document.activeElement.tagName === 'INPUT' &&
        document.activeElement !== hiddenInputRef.current &&
        document.activeElement !== promptInputRef.current
      ) {
        return;
      }
      pressKey(e.code, e.key);
      sound.playMechanicalKey();

      if (e.key === 'Enter') {
        onExecuteCommand(inputValRef.current);
      }
    };

    const handleGlobalKeyUp = (e) => {
      releaseKey(e.code, e.key);
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    window.addEventListener('keyup', handleGlobalKeyUp);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
      window.removeEventListener('keyup', handleGlobalKeyUp);
    };
  }, [pressKey, releaseKey, onExecuteCommand]);

  return (
    <div
      onMouseEnter={() => {
        setIsFocused(true);
      }}
      className={`relative w-full flex flex-col items-center select-none ${className}`}
    >
      {/* 3D WebGL Canvas Viewport - Pure transparent stage, NO bounding borders or card boxes */}
      <div className="relative w-full h-[580px] sm:h-[680px] lg:h-[750px]">
        <div
          ref={mountRef}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        />

        {/* Workstation Status Badge Floating at Top-Center */}
        <div className="pointer-events-none absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-zinc-200/80 shadow-md text-xs font-mono">
          <span className={`w-2 h-2 rounded-full ${isFocused ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
          <span className="text-zinc-800 font-semibold tracking-wide">
            {isFocused ? 'TECLADO CONECTADO (DIGITE LIVREMENTE)' : 'CLIQUE NO MONITOR OU TECLADO P/ DIGITAR'}
          </span>
          <span className="text-zinc-400">|</span>
          <span className="text-rose-600 font-bold">CRT 3D</span>
        </div>
      </div>

      {/* Hidden fallback input */}
      <input
        ref={hiddenInputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="absolute opacity-0 pointer-events-none -left-9999px"
        aria-label="Hidden Terminal Input"
      />

      {/* Centered Integrated Floating Prompt Bar - Seamless Glass Design */}
      <div className="w-full max-w-2xl mx-auto -mt-6 sm:-mt-8 z-10 px-4">
        <div className="flex items-center gap-2.5 p-2.5 px-4 rounded-2xl bg-white/95 backdrop-blur-xl border border-zinc-300/80 shadow-xl transition-all focus-within:border-rose-400 focus-within:ring-2 focus-within:ring-rose-200/50">
          <span className={`text-xs sm:text-sm font-mono font-bold ${matrixMode ? 'text-emerald-600' : 'text-rose-600'}`}>
            steve@ifac:~$
          </span>
          <input
            ref={promptInputRef}
            type="text"
            value={input}
            onChange={(e) => {
              const newVal = e.target.value;
              if (newVal.length > input.length) {
                const addedChar = newVal.slice(-1);
                pressKey('', addedChar);
                sound.playMechanicalKey();
                setTimeout(() => releaseKey('', addedChar), 150);
              }
              setInput(newVal);
            }}
            onKeyDown={(e) => {
              pressKey(e.code, e.key);
              sound.playMechanicalKey();
              if (e.key === 'Enter') {
                e.preventDefault();
                onExecuteCommand(input);
                pressKey('Enter', 'Enter');
                setTimeout(() => releaseKey('Enter', 'Enter'), 180);
              }
            }}
            onKeyUp={(e) => releaseKey(e.code, e.key)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="digite um comando (ex: help, projects, weather)..."
            className="flex-1 bg-transparent text-zinc-900 placeholder-zinc-400 outline-none font-mono text-xs sm:text-sm font-medium"
          />
          <button
            type="button"
            onClick={() => {
              onExecuteCommand(input);
              pressKey('Enter', 'Enter');
              setTimeout(() => releaseKey('Enter', 'Enter'), 180);
            }}
            className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-rose-600 text-white font-mono text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
          >
            <span>ENTER</span>
            <span className="text-[10px] text-zinc-400 font-normal">↵</span>
          </button>
        </div>
      </div>
    </div>
  );
}
