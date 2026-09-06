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
    ctx.font = 'bold 56px "Consolas", monospace';
    ctx.fillText(label, 64, subLabel ? 52 : 64);
  } else if (label.length <= 4) {
    ctx.font = 'bold 36px "Consolas", monospace';
    ctx.fillText(label, 64, 64);
  } else {
    ctx.font = 'bold 26px "Consolas", monospace';
    ctx.fillText(label, 64, 64);
  }

  if (subLabel) {
    ctx.font = 'bold 22px "Consolas", monospace';
    ctx.fillStyle = 'rgba(45, 49, 55, 0.65)';
    ctx.fillText(subLabel, 64, 94);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 4;
  return texture;
}

/**
 * Soft shadow texture for keyboard grounding
 */
function createKeyboardShadowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createRadialGradient(256, 128, 30, 256, 128, 240);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0.25)');
  grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.1)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 256);

  return new THREE.CanvasTexture(canvas);
}

/**
 * Keyboard Layout Specification
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

export default function RetroKeyboard3D({
  input = '',
  setInput = () => {},
  onExecuteCommand = () => {},
  matrixMode = false,
  className = '',
}) {
  const mountRef = useRef(null);
  const promptInputRef = useRef(null);
  const keysMapRef = useRef(new Map());
  const allKeyMeshesRef = useRef([]);

  const inputValRef = useRef(input);
  useEffect(() => {
    inputValRef.current = input;
  }, [input]);

  const matrixModeRef = useRef(matrixMode);
  useEffect(() => {
    matrixModeRef.current = matrixMode;
  }, [matrixMode]);

  // Robust Key Finder by Code, Key, Case & Label
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

    // Letters (a-z)
    if (target.length === 1 && target >= 'a' && target <= 'z') {
      const codeName = 'Key' + target.toUpperCase();
      if (map.has(codeName)) return map.get(codeName);
    }

    // Digits (0-9)
    if (target.length === 1 && target >= '0' && target <= '9') {
      const codeName = 'Digit' + target;
      if (map.has(codeName)) return map.get(codeName);
    }

    // Label search
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
      mesh.userData.targetY = mesh.userData.baseY - 0.15;
      mesh.userData.targetRotX = -0.16;
      mesh.userData.isPressed = true;

      // Glow highlight on top face
      if (Array.isArray(mesh.material) && mesh.material[2]) {
        mesh.material[2].emissive.set(matrixModeRef.current ? 0x22c55e : 0xe11d48);
        mesh.material[2].emissiveIntensity = 0.85;
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

  // Setup Three.js Scene for the Keyboard
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = null;

    // Camera angled from above (~46 degrees) where ALL 5 ROWS are 100% visible!
    const camera = new THREE.PerspectiveCamera(
      34,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 3.8, 3.4);
    camera.lookAt(0, -0.2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff8ee, 1.3);
    keyLight.position.set(4, 7, 5);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xdbeafe, 0.6);
    fillLight.position.set(-4, 4, 3);
    scene.add(fillLight);

    const kbGroup = new THREE.Group();
    kbGroup.position.set(0, 0, 0);
    scene.add(kbGroup);

    // Desk Shadow
    const shadowGeo = new THREE.PlaneGeometry(6.4, 3.2);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: createKeyboardShadowTexture(),
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI * 0.5;
    shadowMesh.position.set(0, -0.4, 0);
    kbGroup.add(shadowMesh);

    // Chassis Materials
    const chassisMat = new THREE.MeshStandardMaterial({
      color: 0xded6c4,
      roughness: 0.55,
      metalness: 0.04,
    });

    const wellMat = new THREE.MeshStandardMaterial({
      color: 0x1f232b,
      roughness: 0.75,
      metalness: 0.15,
    });

    // Keyboard Body
    const bodyGeo = new THREE.BoxGeometry(4.7, 0.32, 2.1);
    const bodyMesh = new THREE.Mesh(bodyGeo, chassisMat);
    bodyMesh.position.set(0, -0.1, 0);
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    kbGroup.add(bodyMesh);

    // Recessed Key Well
    const wellGeo = new THREE.BoxGeometry(4.35, 0.06, 1.8);
    const wellMesh = new THREE.Mesh(wellGeo, wellMat);
    wellMesh.position.set(0, 0.06, 0);
    kbGroup.add(wellMesh);

    // Keycap Materials
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

    // Generate Keycaps
    const unitSize = 0.265;
    const keyHeight = 0.15;
    const startRowZ = -0.68;
    const rowSpacing = 0.31;

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
          kMat,
          kMat,
          topFaceMat,
          kMat,
          kMat,
          kMat,
        ];

        const keyMesh = new THREE.Mesh(keyGeo, keyMaterials);
        const posX = curX + (keyData.width * unitSize) * 0.5;
        const posY = 0.16;
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

        kbGroup.add(keyMesh);
        newKeysMap.set(keyData.code, keyMesh);
        allKeyMeshes.push(keyMesh);

        curX += keyData.width * unitSize;
      });
    });

    keysMapRef.current = newKeysMap;
    allKeyMeshesRef.current = allKeyMeshes;

    // Raycast Key Clicking
    const raycaster = new THREE.Raycaster();
    const mouseCoord = new THREE.Vector2();

    const handleCanvasClick = (e) => {
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

      promptInputRef.current?.focus();
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('click', handleCanvasClick);

    // Animation loop (Lerp key movement smoothly)
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      newKeysMap.forEach((mesh) => {
        mesh.position.y += (mesh.userData.targetY - mesh.position.y) * 0.45;
        mesh.rotation.x += (mesh.userData.targetRotX - mesh.rotation.x) * 0.45;
      });

      renderer.render(scene, camera);
    };

    animate();

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
      if (container.contains(domEl)) {
        container.removeChild(domEl);
      }
      renderer.dispose();
    };
  }, [pressKey, releaseKey, onExecuteCommand, setInput]);

  // Global window listener for typing
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (
        document.activeElement &&
        document.activeElement.tagName === 'INPUT' &&
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
    <div className={`w-full flex flex-col items-center select-none ${className}`}>
      {/* 3D Mechanical Keyboard Canvas (All 5 rows 100% visible) */}
      <div className="relative w-full h-[250px] sm:h-[280px] lg:h-[310px] cursor-pointer">
        <div ref={mountRef} className="w-full h-full" />
      </div>

      {/* Integrated Prompt Input Bar Directly Below Keyboard */}
      <div className="w-full max-w-2xl mx-auto px-4 mt-2">
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
            placeholder="digite aqui ou no teclado 3D (ex: help, projects)..."
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
