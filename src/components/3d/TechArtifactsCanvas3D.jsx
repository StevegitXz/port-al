import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { sound } from '../../utils/sound';

/**
 * Procedural laser-engraved texture for the ESP-12F aluminum RF shield
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

  // Brushed metal directional lines
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  for (let i = 0; i < 1024; i += 3) {
    ctx.fillRect(0, i, 1024, 1);
  }
  ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
  for (let i = 1; i < 1024; i += 4) {
    ctx.fillRect(0, i, 1024, 1);
  }

  // Outer border bevel
  ctx.strokeStyle = '#8a9099';
  ctx.lineWidth = 14;
  ctx.strokeRect(30, 30, 964, 964);

  // Header line
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

  // Central Branding
  ctx.textAlign = 'center';
  ctx.fillStyle = '#17191c';
  ctx.font = '900 86px sans-serif';
  ctx.fillText('ESP8266MOD', 512, 330);

  ctx.fillStyle = '#393e46';
  ctx.font = 'bold 46px monospace';
  ctx.fillText('XTENSA® 32-BIT LX106', 512, 430);

  ctx.fillStyle = '#4b525d';
  ctx.font = 'bold 38px monospace';
  ctx.fillText('VENDOR: IFAC LAB / MARIOT', 512, 530);
  ctx.font = 'bold 32px monospace';
  ctx.fillText('CSBC 2025 // WCAMA PAPER 01', 512, 600);

  // Crosshairs
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

  // Bottom separator
  ctx.beginPath();
  ctx.moveTo(60, 830);
  ctx.lineTo(964, 830);
  ctx.strokeStyle = '#71767e';
  ctx.lineWidth = 6;
  ctx.stroke();

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

const REST_ROTATIONS = {
  iot: { x: 0.28, y: -0.38 },
  frontend: { x: 0.15, y: -0.35 },
  backend: { x: 0.35, y: -0.45 },
  devops: { x: 0.22, y: -0.32 },
};

export default function TechArtifactsCanvas3D({
  activeArtifact = 'iot',
  boosted = false,
  onInteract,
}) {
  const mountRef = useRef(null);
  const [isInteracting, setIsInteracting] = useState(false);

  // References for Three.js state
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const rootGroupRef = useRef(null);
  const modelsRef = useRef({});
  const activeLightRef = useRef(null);
  const pulseRingRef = useRef(null);

  // Rotation & Drag state
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ ...REST_ROTATIONS.iot });
  const currentRotationRef = useRef({ ...REST_ROTATIONS.iot });
  const hasMovedRef = useRef(false);
  const activeArtifactRef = useRef(activeArtifact);

  useEffect(() => {
    activeArtifactRef.current = activeArtifact;
  }, [activeArtifact]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 340;
    const height = container.clientHeight || 360;

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

    // Dynamic Context Light
    const activeLight = new THREE.PointLight(0x38bdf8, 3.5, 4.5);
    activeLight.position.set(0, 0, 1.2);
    scene.add(activeLight);
    activeLightRef.current = activeLight;

    // 5. Root Group for Levitation and Free 360 Rotation
    const rootGroup = new THREE.Group();
    rootGroupRef.current = rootGroup;
    scene.add(rootGroup);

    // ==========================================
    // ARTIFACT 1: ESP8266 IoT Microcontroller
    // ==========================================
    const espGroup = new THREE.Group();
    modelsRef.current.iot = espGroup;
    rootGroup.add(espGroup);

    // PCB board
    const pcbGeo = new THREE.BoxGeometry(2.35, 3.45, 0.12);
    const pcbMat = new THREE.MeshStandardMaterial({
      color: 0x0b1118,
      roughness: 0.55,
      metalness: 0.15,
    });
    espGroup.add(new THREE.Mesh(pcbGeo, pcbMat));

    // Gold castellated pads
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

    for (let i = 0; i < padCountY; i++) {
      const y = startY - i * padSpacing;
      const leftPad = new THREE.Mesh(padGeo, padMat);
      leftPad.position.set(-1.18, y, 0);
      espGroup.add(leftPad);

      const rightPad = new THREE.Mesh(padGeo, padMat);
      rightPad.position.set(1.18, y, 0);
      espGroup.add(rightPad);
    }

    // Meandering 2.4 GHz Antenna
    const antGroup = new THREE.Group();
    antGroup.position.set(0, 1.25, 0.065);
    const antTraceMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      metalness: 0.92,
      roughness: 0.18,
    });
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
      antGroup.add(segMesh);
    });
    espGroup.add(antGroup);

    // Aluminum RF Shield
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
    espGroup.add(shieldMesh);

    // Crystal Oscillator
    const crystalMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.22, 0.08),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.1 })
    );
    crystalMesh.position.set(-0.65, 0.78, 0.08);
    espGroup.add(crystalMesh);

    // Telemetry Activity SMD LED
    const espLedMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 2.5,
      roughness: 0.2,
    });
    const espLedMesh = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.08, 0.06), espLedMat);
    espLedMesh.position.set(0.72, -1.32, 0.24);
    espGroup.add(espLedMesh);
    espGroup.userData.ledMesh = espLedMesh;

    // ==========================================
    // ARTIFACT 2: React 3D Atomic Core (Front-End)
    // ==========================================
    const reactGroup = new THREE.Group();
    modelsRef.current.frontend = reactGroup;
    reactGroup.visible = false;
    rootGroup.add(reactGroup);

    // Luminous Crystal Core Sphere
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 1.8,
      roughness: 0.15,
      metalness: 0.7,
      transparent: true,
      opacity: 0.92,
    });
    const coreMesh = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), coreMat);
    reactGroup.add(coreMesh);
    reactGroup.userData.coreMesh = coreMesh;

    // 3 Tilted Orbital Elliptical Rings
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 1.6,
      roughness: 0.2,
      metalness: 0.85,
    });

    const ringAngles = [0, Math.PI / 3, -Math.PI / 3];
    const electrons = [];

    ringAngles.forEach((angle, idx) => {
      const ringContainer = new THREE.Group();
      ringContainer.rotation.z = angle;

      // Torus scaled into an ellipse
      const torusMesh = new THREE.Mesh(
        new THREE.TorusGeometry(1.5, 0.038, 16, 80),
        ringMat
      );
      torusMesh.scale.set(1.4, 0.58, 1);
      ringContainer.add(torusMesh);

      // Traveling electron sphere
      const electronMat = new THREE.MeshStandardMaterial({
        color: 0xbae6fd,
        emissive: 0x38bdf8,
        emissiveIntensity: 3.5,
        roughness: 0.1,
      });
      const electron = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 16), electronMat);
      ringContainer.add(electron);
      electrons.push({ mesh: electron, speed: 1.8 + idx * 0.3, offset: (idx * Math.PI) / 1.5 });

      reactGroup.add(ringContainer);
    });

    reactGroup.userData.electrons = electrons;

    // ==========================================
    // ARTIFACT 3: High-Speed Database Server (Back-End)
    // ==========================================
    const dbGroup = new THREE.Group();
    modelsRef.current.backend = dbGroup;
    dbGroup.visible = false;
    rootGroup.add(dbGroup);

    // 3 Stacked Cylindrical Magnetic Discs
    const platterMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.3,
      metalness: 0.88,
    });

    const platterYPositions = [0.65, 0, -0.65];
    const dataTracks = [];

    platterYPositions.forEach((yPos) => {
      // Platter Disc
      const platter = new THREE.Mesh(
        new THREE.CylinderGeometry(1.2, 1.2, 0.42, 36),
        platterMat
      );
      platter.position.y = yPos;
      dbGroup.add(platter);

      // Glowing Data Ring in Groove
      const trackMat = new THREE.MeshStandardMaterial({
        color: 0x34d399,
        emissive: 0x10b981,
        emissiveIntensity: 2.2,
        roughness: 0.2,
      });
      const track = new THREE.Mesh(new THREE.TorusGeometry(1.22, 0.03, 16, 48), trackMat);
      track.position.y = yPos;
      track.rotation.x = Math.PI / 2;
      dbGroup.add(track);
      dataTracks.push(track);

      // Front Activity LED
      const led = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.08, 0.04),
        new THREE.MeshStandardMaterial({
          color: 0x34d399,
          emissive: 0x10b981,
          emissiveIntensity: 3.0,
        })
      );
      led.position.set(0, yPos, 1.22);
      dbGroup.add(led);
    });

    dbGroup.userData.dataTracks = dataTracks;

    // Vertical Read/Write Actuator Needle on Side
    const actuatorArm = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 1.9, 0.1),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.15 })
    );
    actuatorArm.position.set(1.15, 0, 0.5);
    dbGroup.add(actuatorArm);

    // ==========================================
    // ARTIFACT 4: Git Octahedron Node (DevOps)
    // ==========================================
    const gitGroup = new THREE.Group();
    modelsRef.current.devops = gitGroup;
    gitGroup.visible = false;
    rootGroup.add(gitGroup);

    // Dark Faceted Octahedron Body
    const octaGeo = new THREE.OctahedronGeometry(1.35, 0);
    const octaMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.25,
      metalness: 0.85,
      transparent: true,
      opacity: 0.88,
    });
    const octaMesh = new THREE.Mesh(octaGeo, octaMat);
    gitGroup.add(octaMesh);

    // Glowing Neon Wireframe Lattice
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xf43f5e,
      wireframe: true,
      transparent: true,
      opacity: 0.75,
    });
    const wireMesh = new THREE.Mesh(new THREE.OctahedronGeometry(1.37, 0), wireMat);
    gitGroup.add(wireMesh);
    gitGroup.userData.wireMesh = wireMesh;

    // 6 Vertex Nodes (Commit Branches)
    const nodeVertices = [
      { pos: [0, 1.35, 0], color: 0xf43f5e },   // Top: Main
      { pos: [0, -1.35, 0], color: 0x10b981 },  // Bottom: Prod
      { pos: [-1.35, 0, 0], color: 0x38bdf8 },  // Left: Feature
      { pos: [1.35, 0, 0], color: 0xfbbf24 },   // Right: Staging
      { pos: [0, 0, 1.35], color: 0xa855f7 },   // Front: Release
      { pos: [0, 0, -1.35], color: 0x06b6d4 },  // Back: Origin
    ];

    nodeVertices.forEach((v) => {
      const nodeMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.14, 16, 16),
        new THREE.MeshStandardMaterial({
          color: v.color,
          emissive: v.color,
          emissiveIntensity: 3.2,
          roughness: 0.1,
        })
      );
      nodeMesh.position.set(v.pos[0], v.pos[1], v.pos[2]);
      gitGroup.add(nodeMesh);
    });

    // ==========================================
    // SHARED: Energy Shockwave Ring & Contact Shadow
    // ==========================================
    const ringGeo = new THREE.RingGeometry(0.08, 0.18, 32);
    const shockwaveRingMat = new THREE.MeshBasicMaterial({
      color: 0xf43f5e,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
    });
    const pulseRing = new THREE.Mesh(ringGeo, shockwaveRingMat);
    pulseRing.position.set(0, 0, 0.15);
    rootGroup.add(pulseRing);
    pulseRingRef.current = pulseRing;

    // Contact shadow
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext('2d');
    const sGrad = sCtx.createRadialGradient(128, 128, 10, 128, 128, 120);
    sGrad.addColorStop(0, 'rgba(15, 23, 42, 0.35)');
    sGrad.addColorStop(0.5, 'rgba(15, 23, 42, 0.1)');
    sGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
    sCtx.fillStyle = sGrad;
    sCtx.fillRect(0, 0, 256, 256);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowGeo = new THREE.PlaneGeometry(3.8, 4.2);
    const shadowMesh = new THREE.Mesh(
      shadowGeo,
      new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, opacity: 0.65, depthWrite: false })
    );
    shadowMesh.position.set(0, -2.2, -0.2);
    shadowMesh.rotation.x = -Math.PI / 2 + 0.35;
    scene.add(shadowMesh);

    // ==========================================
    // ANIMATION & RENDER LOOP
    // ==========================================
    let reqId;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Gentle vertical levitation motion
      const floatOffset = Math.sin(elapsedTime * 1.5) * 0.07;
      rootGroup.position.y = floatOffset;
      shadowMesh.scale.setScalar(1 - floatOffset * 0.35);

      // Micro-animations per active artifact
      const currentType = activeArtifactRef.current;

      if (currentType === 'frontend' && reactGroup.userData.electrons) {
        // Orbit electrons around rings
        reactGroup.userData.electrons.forEach((el) => {
          const t = elapsedTime * el.speed + el.offset;
          // Ellipse trajectory: x = a*cos(t), y = b*sin(t)
          el.mesh.position.x = 1.4 * 1.5 * Math.cos(t);
          el.mesh.position.y = 0.58 * 1.5 * Math.sin(t);
        });
      }

      if (currentType === 'backend' && dbGroup.userData.dataTracks) {
        // Subtle data pulse glow in tracks
        const pulseVal = Math.sin(elapsedTime * 4) * 0.4 + 2.0;
        dbGroup.userData.dataTracks.forEach((tr) => {
          tr.material.emissiveIntensity = pulseVal;
        });
      }

      // Spring-back to normal resting position when released
      const activeRest = REST_ROTATIONS[currentType] || REST_ROTATIONS.iot;

      if (!isDraggingRef.current) {
        targetRotationRef.current.x += (activeRest.x - targetRotationRef.current.x) * 0.07;
        targetRotationRef.current.y += (activeRest.y - targetRotationRef.current.y) * 0.07;
      }

      currentRotationRef.current.x += (targetRotationRef.current.x - currentRotationRef.current.x) * 0.12;
      currentRotationRef.current.y += (targetRotationRef.current.y - currentRotationRef.current.y) * 0.12;

      rootGroup.rotation.x = currentRotationRef.current.x;
      rootGroup.rotation.y = currentRotationRef.current.y;

      // Pulse ring animation
      if (pulseRingRef.current && pulseRingRef.current.material.opacity > 0.01) {
        pulseRingRef.current.scale.multiplyScalar(1.08);
        pulseRingRef.current.material.opacity *= 0.92;
      }

      renderer.render(scene, camera);
    };

    animate();

    // ==========================================
    // POINTER DRAG & CLICK HANDLERS
    // ==========================================
    const handlePointerDown = (e) => {
      isDraggingRef.current = true;
      hasMovedRef.current = false;
      setIsInteracting(true);
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

      targetRotationRef.current.y += dx * 0.008;
      targetRotationRef.current.x += dy * 0.008;

      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
      setIsInteracting(false);
      renderer.domElement.style.cursor = 'grab';

      // Click without drag -> trigger tactile action
      if (!hasMovedRef.current && onInteract) {
        onInteract(activeArtifactRef.current);

        // Visual pulse ring
        if (pulseRingRef.current) {
          pulseRingRef.current.scale.set(1, 1, 1);
          pulseRingRef.current.material.opacity = 0.9;
        }
      }
    };

    const dom = renderer.domElement;
    dom.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    // Resize observer
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const newWidth = entries[0].contentRect.width || 340;
      const newHeight = entries[0].contentRect.height || 360;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    });
    resizeObserver.observe(container);

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
      shadowTex.dispose();
    };
  }, []);

  // Update visible model and light when activeArtifact changes
  useEffect(() => {
    Object.keys(modelsRef.current).forEach((key) => {
      const model = modelsRef.current[key];
      if (model) {
        model.visible = key === activeArtifact;
      }
    });

    // Reset rotation target to the specific artifact's resting pose
    const rest = REST_ROTATIONS[activeArtifact] || REST_ROTATIONS.iot;
    targetRotationRef.current = { ...rest };

    // Update dynamic light color per artifact
    if (activeLightRef.current) {
      if (activeArtifact === 'iot') {
        activeLightRef.current.color.setHex(boosted ? 0xf43f5e : 0x38bdf8);
      } else if (activeArtifact === 'frontend') {
        activeLightRef.current.color.setHex(0x38bdf8);
      } else if (activeArtifact === 'backend') {
        activeLightRef.current.color.setHex(0x10b981);
      } else if (activeArtifact === 'devops') {
        activeLightRef.current.color.setHex(0xf43f5e);
      }
    }
  }, [activeArtifact, boosted]);

  // Update LED when boosted changes (IoT)
  useEffect(() => {
    const esp = modelsRef.current.iot;
    if (!esp || !esp.userData.ledMesh || !activeLightRef.current) return;

    if (activeArtifact === 'iot') {
      if (boosted) {
        esp.userData.ledMesh.material.color.setHex(0xf43f5e);
        esp.userData.ledMesh.material.emissive.setHex(0xe11d48);
        esp.userData.ledMesh.material.emissiveIntensity = 4.5;
        activeLightRef.current.color.setHex(0xf43f5e);
        if (pulseRingRef.current) {
          pulseRingRef.current.scale.set(1, 1, 1);
          pulseRingRef.current.material.opacity = 0.9;
        }
      } else {
        esp.userData.ledMesh.material.color.setHex(0x38bdf8);
        esp.userData.ledMesh.material.emissive.setHex(0x0284c7);
        esp.userData.ledMesh.material.emissiveIntensity = 2.5;
        activeLightRef.current.color.setHex(0x38bdf8);
      }
    }
  }, [boosted, activeArtifact]);

  return (
    <div className="relative w-full h-80 sm:h-96 flex items-center justify-center select-none">
      {/* 3D WebGL Canvas Container */}
      <div
        ref={mountRef}
        className="w-full h-full flex items-center justify-center touch-none outline-none"
      />

      {/* Bottom Floating Instruction & Gesture Tip */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-zinc-200/80 text-[10px] font-mono text-zinc-600 shadow-xs pointer-events-none whitespace-nowrap">
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            boosted ? 'bg-rose-500 animate-ping' : 'bg-emerald-500 animate-pulse'
          }`}
        ></span>
        <span>
          {isInteracting
            ? 'EXPLORANDO EM 360° (SOLTE PARA VOLTAR)'
            : '[ ARRASTE PARA GIRAR • SOLTE PARA VOLTAR • CLIQUE PARA INTERAGIR ]'}
        </span>
      </div>
    </div>
  );
}
