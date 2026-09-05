import React, { useState, useRef, useEffect } from 'react';
import { Calendar, BookOpen, ExternalLink, ZoomIn, ZoomOut, RotateCcw, Move, Compass, Sparkles } from 'lucide-react';
import { TIMELINE } from '../utils/data';
import { sound } from '../utils/sound';
import SakuraCanvas from './SakuraCanvas';

export default function SakuraTreeTimeline() {
  // Chronological tree levels from roots to crown:
  // 0: Raízes (2024) -> Monitoria & OBLI (data index 4)
  // 1: Galho Extensão (2024-2025) -> PROEX Robótica (data index 3)
  // 2: Tronco Pesquisa (2025) -> PROINP IoT (data index 2)
  // 3: Galho Liderança (2025) -> Learn.with(us) (data index 1)
  // 4: Copa Florida / Ápice (2025-2026) -> CSBC 2025 (data index 0)
  const treeNodes = [
    {
      levelName: 'Raízes & Base',
      kanji: '根',
      year: '2024',
      dataIdx: 4,
      tag: 'INÍCIO & DISTINÇÃO',
      focusX: 50,
      focusY: 82,
      zoom: 1.35,
    },
    {
      levelName: 'Galho de Extensão',
      kanji: '枝',
      year: '2024-2025',
      dataIdx: 3,
      tag: 'AÇÃO COMUNITÁRIA',
      focusX: 30,
      focusY: 65,
      zoom: 1.45,
    },
    {
      levelName: 'Tronco de Pesquisa',
      kanji: '幹',
      year: '2025',
      dataIdx: 2,
      tag: 'INICIAÇÃO CIENTÍFICA',
      focusX: 70,
      focusY: 50,
      zoom: 1.45,
    },
    {
      levelName: 'Ramo de Liderança',
      kanji: '育',
      year: '2025',
      dataIdx: 1,
      tag: 'TUTORIA DISCENTE',
      focusX: 35,
      focusY: 34,
      zoom: 1.5,
    },
    {
      levelName: 'Copa Florida (O Ápice)',
      kanji: '頂',
      year: '2025-2026',
      dataIdx: 0,
      tag: 'CONGRESSO NACIONAL',
      focusX: 50,
      focusY: 16,
      zoom: 1.55,
    },
  ];

  const [activeStep, setActiveStep] = useState(4); // Default to apex (CSBC 2025)
  const [zoom, setZoom] = useState(1.55);
  const [pan, setPan] = useState({ x: 0, y: 130 }); // Initially framed on the apex crown
  const [isFreeMode, setIsFreeMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const dragStartRef = useRef({ x: 0, y: 0 });
  const panStartRef = useRef({ x: 0, y: 0 });
  const treeViewportRef = useRef(null);
  const touchDistRef = useRef(null);

  const activeConfig = treeNodes[activeStep];
  const activeMilestone = TIMELINE[activeConfig.dataIdx] || TIMELINE[0];
  const isApex = activeStep === 4;

  // Jump smoothly to a predefined stage
  const handleSelectStep = (idx) => {
    sound.playSelect();
    setActiveStep(idx);
    setIsFreeMode(false);
    const target = treeNodes[idx];
    setZoom(target.zoom);
    // Pan offset to center the clicked stage
    setPan({
      x: -((target.focusX - 50) * 3.6),
      y: -((target.focusY - 50) * 3.6),
    });
  };

  // Zoom HUD buttons
  const handleZoomIn = () => {
    sound.playClick();
    setIsFreeMode(true);
    setZoom((prev) => Math.min(Number((prev + 0.25).toFixed(2)), 3.2));
  };

  const handleZoomOut = () => {
    sound.playClick();
    setIsFreeMode(true);
    setZoom((prev) => Math.max(Number((prev - 0.25).toFixed(2)), 0.85));
  };

  const handleResetView = () => {
    sound.playClick();
    setIsFreeMode(false);
    const target = treeNodes[activeStep];
    setZoom(target.zoom);
    setPan({
      x: -((target.focusX - 50) * 3.6),
      y: -((target.focusY - 50) * 3.6),
    });
  };

  // Free Mouse Wheel Zoom on the tree canvas
  useEffect(() => {
    const el = treeViewportRef.current;
    if (!el) return;

    const handleWheel = (e) => {
      e.preventDefault();
      setIsFreeMode(true);
      const delta = -e.deltaY * 0.0018;
      setZoom((prev) => Math.min(Math.max(Number((prev + delta).toFixed(3)), 0.85), 3.2));
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  // Mouse Drag / Pan Handlers
  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Left click only
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    panStartRef.current = { ...pan };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      setIsFreeMode(true);
    }
    setPan({
      x: panStartRef.current.x + dx,
      y: panStartRef.current.y + dy,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch Support for Mobile
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      panStartRef.current = { ...pan };
    } else if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchDistRef.current = dist;
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 1 && isDragging) {
      const dx = e.touches[0].clientX - dragStartRef.current.x;
      const dy = e.touches[0].clientY - dragStartRef.current.y;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
        setIsFreeMode(true);
      }
      setPan({
        x: panStartRef.current.x + dx,
        y: panStartRef.current.y + dy,
      });
    } else if (e.touches.length === 2 && touchDistRef.current) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const ratio = dist / touchDistRef.current;
      setIsFreeMode(true);
      setZoom((prev) => Math.min(Math.max(Number((prev * (ratio > 1 ? 1.04 : 0.96)).toFixed(3)), 0.85), 3.2));
      touchDistRef.current = dist;
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    touchDistRef.current = null;
  };

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-zinc-200/90 shadow-2xl bg-gradient-to-b from-[#f8fafc] via-[#fff1f2]/30 to-[#fafbfc]">
      {/* ========================================================================= */}
      {/* 1. CINEMATIC SCENIC BACKGROUND: DETAILED MOUNT FUJI, DAWN & MIST (Soft DoF) */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        {/* Morning Dawn Sky Radiant Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#e0f2fe]/40 via-[#fce7f3]/35 to-[#fafbfc] opacity-95"></div>

        {/* Japanese Rising Sun (Asahi) with soft atmospheric rings */}
        <div className="absolute top-8 left-[18%] -translate-x-1/2 w-72 h-72 rounded-full bg-gradient-to-tr from-rose-400/20 via-amber-200/25 to-transparent blur-2xl"></div>
        <div className="absolute top-16 left-[18%] -translate-x-1/2 w-32 h-32 rounded-full bg-rose-400/25 blur-xl"></div>
        <div className="absolute top-20 left-[18%] -translate-x-1/2 w-16 h-16 rounded-full bg-rose-500/30 blur-sm"></div>

        {/* Stylized Floating Japanese Kasumi / Kumo Clouds */}
        <div className="absolute top-12 left-0 right-0 h-40 opacity-40">
          <svg viewBox="0 0 1200 200" className="w-full h-full" fill="none">
            <path
              d="M 50 80 Q 90 60 140 80 Q 180 60 230 80 L 320 80 Q 350 95 320 110 L 90 110 Q 50 100 50 80 Z"
              fill="#ffffff"
              opacity="0.8"
            />
            <path
              d="M 750 40 Q 790 20 840 40 Q 890 20 950 40 L 1050 40 Q 1080 55 1050 70 L 800 70 Q 750 60 750 40 Z"
              fill="#ffffff"
              opacity="0.75"
            />
          </svg>
        </div>

        {/* Migrating Japanese Cranes (Tsuru) Silhouette Flock in the Dawn Sky */}
        <div className="absolute top-14 right-[25%] opacity-35 filter blur-[0.4px]">
          <svg viewBox="0 0 180 80" className="w-36 h-auto" fill="#475569">
            {/* Lead Crane */}
            <path d="M 40 20 Q 50 15 60 22 Q 45 28 35 25 Q 25 18 15 22 Q 30 18 40 20 Z" />
            {/* Follower 1 */}
            <path d="M 80 32 Q 88 28 96 34 Q 84 38 76 36 Q 68 30 60 34 Q 72 30 80 32 Z" />
            {/* Follower 2 */}
            <path d="M 120 45 Q 127 41 134 47 Q 123 50 116 48 Q 109 43 102 47 Q 112 43 120 45 Z" />
            {/* Follower 3 */}
            <path d="M 150 58 Q 155 55 160 59 Q 152 62 147 60 Q 142 56 137 59 Q 144 56 150 58 Z" />
          </svg>
        </div>

        {/* HIGH-FIDELITY MOUNT FUJI & SURROUNDING LANDSCAPE (Soft Depth-of-Field Blur) */}
        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[850px] sm:w-[1150px] transition-transform duration-700 ease-out filter blur-[2px] opacity-35"
          style={{
            transform: `translateX(calc(-50% + ${pan.x * 0.08}px)) translateY(${pan.y * 0.08}px) scale(${1 + (zoom - 1) * 0.06})`,
          }}
        >
          <svg viewBox="0 0 1200 500" className="w-full h-auto" fill="none">
            <defs>
              {/* Sunlit Flank of Mount Fuji */}
              <linearGradient id="fujiLightFlank" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#94a3b8" stopOpacity="0.65" />
                <stop offset="100%" stopColor="#64748b" stopOpacity="0.3" />
              </linearGradient>

              {/* Shaded Ravine Flank of Mount Fuji */}
              <linearGradient id="fujiShadowFlank" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.85" />
                <stop offset="60%" stopColor="#64748b" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#475569" stopOpacity="0.25" />
              </linearGradient>

              {/* Pure Snow Cap with Natural Albedo */}
              <linearGradient id="fujiSnowCap" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.98" />
                <stop offset="60%" stopColor="#f8fafc" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#e2e8f0" stopOpacity="0.6" />
              </linearGradient>

              {/* Misty Foothills Gradient */}
              <linearGradient id="foothillGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.05" />
              </linearGradient>
            </defs>

            {/* 1. Mount Fuji Base & Volcano Slopes */}
            {/* Shaded Western Slope */}
            <path
              d="M 600 130 C 650 130 680 150 730 200 L 1120 480 L 600 480 Z"
              fill="url(#fujiShadowFlank)"
            />
            {/* Sunlit Eastern Slope */}
            <path
              d="M 80 480 L 470 200 C 520 150 550 130 600 130 L 600 480 Z"
              fill="url(#fujiLightFlank)"
            />

            {/* 2. Jagged Stratovolcano Snow Cap with Glacial Ravines */}
            <path
              d="M 500 170 
                 C 520 150 545 130 600 130 
                 C 655 130 680 150 700 170 
                 L 725 215 
                 C 705 205 690 225 675 210 
                 C 660 190 645 230 625 215 
                 C 605 195 595 220 575 205 
                 C 555 190 540 225 520 210 
                 C 505 195 490 220 475 215 Z"
              fill="url(#fujiSnowCap)"
            />
            {/* Deep Snow Ravine Tongues flowing down slopes */}
            <path d="M 545 205 L 530 270 L 540 275 L 555 208 Z" fill="#ffffff" opacity="0.65" />
            <path d="M 590 215 L 585 295 L 595 300 L 605 212 Z" fill="#ffffff" opacity="0.75" />
            <path d="M 645 210 L 655 280 L 645 285 L 635 215 Z" fill="#ffffff" opacity="0.6" />

            {/* 3. Layered Midground Foothills (Hakone / Yamanashi Ridges) */}
            <path
              d="M 0 460 Q 200 370 420 410 Q 640 450 860 380 Q 1040 330 1200 420 L 1200 500 L 0 500 Z"
              fill="url(#foothillGrad)"
            />
            <path
              d="M 0 430 Q 300 360 600 420 Q 900 480 1200 390 L 1200 500 L 0 500 Z"
              fill="#cbd5e1"
              opacity="0.3"
            />

            {/* 4. Cultural Landscape Silhouettes in the Distance */}
            {/* Chureito Style 5-Tier Pagoda on Left Ridge */}
            <g transform="translate(180, 360) scale(0.65)" opacity="0.6" fill="#475569">
              {/* Spire */}
              <rect x="23" y="0" width="2" height="18" />
              {/* Tier 5 */}
              <polygon points="24,18 8,24 40,24" />
              <rect x="18" y="24" width="12" height="6" />
              {/* Tier 4 */}
              <polygon points="24,30 5,37 43,37" />
              <rect x="17" y="37" width="14" height="6" />
              {/* Tier 3 */}
              <polygon points="24,43 2,51 46,51" />
              <rect x="16" y="51" width="16" height="7" />
              {/* Tier 2 */}
              <polygon points="24,58 0,67 48,67" />
              <rect x="15" y="67" width="18" height="8" />
              {/* Base */}
              <rect x="12" y="75" width="24" height="15" />
            </g>

            {/* Distant Torii Gate in the Shore Mist */}
            <g transform="translate(880, 395) scale(0.7)" opacity="0.5" fill="#475569">
              <rect x="2" y="5" width="46" height="4" rx="1" />
              <rect x="6" y="12" width="38" height="3" />
              <rect x="12" y="5" width="4" height="35" />
              <rect x="34" y="5" width="4" height="35" />
            </g>

            {/* Distant Japanese Pine Groves (Matsu) on Foothill Ridges */}
            <g opacity="0.45" fill="#64748b">
              <path d="M 320 410 Q 325 395 330 410 Q 335 390 342 410 Q 350 400 355 410 Z" />
              <path d="M 360 415 Q 365 398 372 415 Q 378 395 385 415 Z" />
              <path d="M 720 425 Q 726 405 734 425 Q 740 408 748 425 Z" />
              <path d="M 755 430 Q 762 412 770 430 Q 778 415 785 430 Z" />
            </g>
          </svg>
        </div>

        {/* Ethereal Morning Mist Bands Rising from Lake */}
        <div className="absolute bottom-16 left-0 right-0 h-36 bg-gradient-to-t from-white via-white/80 to-transparent blur-md"></div>
      </div>

      {/* FALLING SAKURA PETALS OVERLAY (Over scenic tree & Mount Fuji viewport) */}
      <SakuraCanvas
        bounded
        count={42}
        className="pointer-events-none absolute inset-0 z-15 h-full w-full"
        style={{ opacity: 0.95 }}
      />

      {/* ========================================================================= */}
      {/* 2. THE SAKURA TREE INTERACTIVE CANVASES WITH FREE ZOOM & DRAG/PAN ENGINE */}
      {/* ========================================================================= */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 min-h-[640px] items-stretch">
        {/* Left / Tree Visual Viewport (7 Columns on lg) */}
        <div
          ref={treeViewportRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className={`lg:col-span-7 relative flex items-center justify-center p-4 sm:p-8 min-h-[420px] lg:min-h-[640px] overflow-hidden select-none ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
        >
          {/* FLOATING ZOOM & PAN HUD CONTROLS (Top Right of Tree Canvas) */}
          <div className="absolute top-4 right-4 z-30 flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/90 backdrop-blur-md border border-zinc-200/90 shadow-md">
            {/* Zoom Out Button */}
            <button
              type="button"
              onClick={handleZoomOut}
              title="Diminuir Zoom (-)"
              className="w-8 h-8 rounded-xl flex items-center justify-center text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 transition-colors"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            {/* Current Zoom Percentage Indicator */}
            <span className="font-mono text-[11px] font-bold px-1.5 text-zinc-600 min-w-[48px] text-center">
              {Math.round(zoom * 100)}%
            </span>

            {/* Zoom In Button */}
            <button
              type="button"
              onClick={handleZoomIn}
              title="Aumentar Zoom (+)"
              className="w-8 h-8 rounded-xl flex items-center justify-center text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            {/* Reset View Button */}
            <button
              type="button"
              onClick={handleResetView}
              title="Redefinir Enquadramento"
              className="w-8 h-8 rounded-xl flex items-center justify-center text-zinc-500 hover:text-rose-600 hover:bg-rose-50 transition-colors ml-1 border-l border-zinc-200"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* ACTIVE MODE STATUS PILL (Top Left of Tree Canvas) */}
          <div className="absolute top-4 left-4 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-zinc-200/90 shadow-xs text-xs font-mono">
            {isFreeMode ? (
              <>
                <Move className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                <span className="text-emerald-800 font-semibold">
                  Modo Livre // Arraste & Scroll
                </span>
              </>
            ) : (
              <>
                <Compass className="w-3.5 h-3.5 text-rose-500" />
                <span className="text-zinc-700">
                  Foco: <strong className="text-rose-600">{activeConfig.levelName}</strong>
                </span>
              </>
            )}
          </div>

          {/* HELPFUL INTERACTION HINT (Bottom Left of Tree Canvas) */}
          <div className="absolute bottom-4 left-4 z-30 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-zinc-200/60 text-[10px] font-mono text-zinc-500 pointer-events-none">
            <Sparkles className="w-3 h-3 text-rose-400" />
            <span>Role o mouse para zoom livre ou arraste para explorar qualquer ramo</span>
          </div>

          {/* 3. ZOOMABLE & DRAGGABLE TREE CONTAINER */}
          <div
            className="relative w-full max-w-[540px] aspect-[4/5] will-change-transform"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: '50% 50%',
              transition: isDragging
                ? 'none'
                : 'transform 600ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* SVG ORGANIC SAKURA TREE (Trunk, Branches, Blooming Canopies) */}
            <svg viewBox="0 0 500 620" className="w-full h-full drop-shadow-2xl" fill="none">
              <defs>
                {/* Wood Bark Gradient */}
                <linearGradient id="barkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3f3f46" />
                  <stop offset="50%" stopColor="#52525b" />
                  <stop offset="100%" stopColor="#27272a" />
                </linearGradient>

                {/* Sakura Blossom Glow */}
                <radialGradient id="sakuraBlossomGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#fb7185" stopOpacity="0.85" />
                  <stop offset="70%" stopColor="#fda4af" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Main Trunk Rising from Roots to Canopy */}
              <path
                d="M 235 620 C 240 540, 230 480, 245 420 C 255 370, 240 310, 250 250 C 255 200, 245 160, 250 110"
                stroke="url(#barkGradient)"
                strokeWidth="28"
                strokeLinecap="round"
              />

              {/* Lower Roots Flaring into Earth */}
              <path d="M 235 590 C 210 605, 185 615, 150 620" stroke="#3f3f46" strokeWidth="12" strokeLinecap="round" />
              <path d="M 245 595 C 270 608, 305 618, 345 620" stroke="#3f3f46" strokeWidth="14" strokeLinecap="round" />

              {/* Branch Level 1 (Right): Extensão PROEX (2024-2025) */}
              <path
                d="M 245 430 C 280 420, 320 410, 360 415 C 380 418, 410 425, 430 435"
                stroke="#52525b"
                strokeWidth="14"
                strokeLinecap="round"
              />

              {/* Branch Level 2 (Left): Pesquisa PROINP IoT (2025) */}
              <path
                d="M 248 350 C 205 340, 160 325, 130 315 C 100 305, 75 310, 60 320"
                stroke="#52525b"
                strokeWidth="13"
                strokeLinecap="round"
              />

              {/* Branch Level 3 (Right High): Learn.with(us) Tutoria (2025) */}
              <path
                d="M 250 260 C 290 240, 335 220, 370 215 C 400 210, 430 220, 450 230"
                stroke="#52525b"
                strokeWidth="11"
                strokeLinecap="round"
              />

              {/* Apex Canopy Branches: CSBC 2025 */}
              <path d="M 250 180 C 220 140, 190 120, 160 100" stroke="#3f3f46" strokeWidth="9" strokeLinecap="round" />
              <path d="M 250 170 C 275 130, 310 110, 340 95" stroke="#3f3f46" strokeWidth="9" strokeLinecap="round" />
              <path d="M 250 120 C 248 85, 252 60, 250 40" stroke="#3f3f46" strokeWidth="7" strokeLinecap="round" />

              {/* CLUSTERS OF SAKURA BLOSSOMS (Soft Pink, Rose & Ruby Clouds) */}
              {/* Roots Blossom Specks */}
              <circle cx="230" cy="510" r="30" fill="url(#sakuraBlossomGlow)" />
              <circle cx="250" cy="505" r="18" fill="#fda4af" opacity="0.6" />

              {/* Branch 1 Blossom Cluster (Extensão) */}
              <circle cx="390" cy="420" r="55" fill="url(#sakuraBlossomGlow)" />
              <circle cx="410" cy="415" r="35" fill="#f43f5e" opacity="0.45" />
              <circle cx="370" cy="425" r="28" fill="#fda4af" opacity="0.75" />

              {/* Branch 2 Blossom Cluster (Pesquisa) */}
              <circle cx="105" cy="315" r="60" fill="url(#sakuraBlossomGlow)" />
              <circle cx="95" cy="310" r="40" fill="#f43f5e" opacity="0.45" />
              <circle cx="130" cy="325" r="30" fill="#fda4af" opacity="0.75" />

              {/* Branch 3 Blossom Cluster (Tutoria) */}
              <circle cx="390" cy="215" r="65" fill="url(#sakuraBlossomGlow)" />
              <circle cx="410" cy="210" r="45" fill="#f43f5e" opacity="0.5" />
              <circle cx="365" cy="225" r="35" fill="#fda4af" opacity="0.8" />

              {/* Crown Apex Canopy Bloom (CSBC 2025) */}
              <circle cx="250" cy="95" r="95" fill="url(#sakuraBlossomGlow)" />
              <circle cx="220" cy="85" r="60" fill="#f43f5e" opacity="0.55" />
              <circle cx="280" cy="80" r="65" fill="#fb7185" opacity="0.65" />
              <circle cx="250" cy="65" r="50" fill="#fda4af" opacity="0.85" />
              <circle cx="180" cy="100" r="45" fill="#f43f5e" opacity="0.4" />
              <circle cx="320" cy="95" r="48" fill="#fb7185" opacity="0.5" />
            </svg>

            {/* 5 INTERACTIVE BLOOMING NODES ON THE TREE */}
            {treeNodes.map((node, idx) => {
              const isSelected = activeStep === idx;
              const nodePositions = [
                { left: '48%', top: '82%' }, // Raiz (2024)
                { left: '78%', top: '68%' }, // Extensão (2024-2025)
                { left: '22%', top: '51%' }, // Pesquisa (2025)
                { left: '76%', top: '35%' }, // Tutoria (2025)
                { left: '50%', top: '15%' }, // Ápice CSBC 2025
              ];
              const pos = nodePositions[idx];

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectStep(idx);
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 group/node transition-transform duration-300 z-20 ${
                    isSelected ? 'scale-125' : 'hover:scale-110'
                  }`}
                  style={{ left: pos.left, top: pos.top }}
                  title={`${node.levelName} (${node.year})`}
                >
                  {/* Glowing Halo when active */}
                  <div
                    className={`absolute -inset-2 rounded-full blur-md transition-opacity ${
                      isSelected
                        ? idx === 4
                          ? 'bg-amber-400 opacity-90 animate-pulse'
                          : 'bg-rose-500 opacity-85 animate-pulse'
                        : 'bg-rose-300 opacity-0 group-hover/node:opacity-60'
                    }`}
                  ></div>

                  {/* Blossom Button */}
                  <div
                    className={`relative w-8 h-8 rounded-full border-2 flex items-center justify-center font-mono font-bold text-xs shadow-md transition-all ${
                      isSelected
                        ? idx === 4
                          ? 'bg-amber-400 border-amber-200 text-zinc-950 shadow-amber-400/50 scale-110'
                          : 'bg-rose-500 border-white text-white shadow-rose-500/50 scale-110'
                        : 'bg-white/95 border-rose-300 text-zinc-700 hover:border-rose-500 hover:text-rose-600'
                    }`}
                  >
                    {node.kanji}
                  </div>

                  {/* Year Tag Below Node */}
                  <span
                    className={`absolute top-full mt-1 left-1/2 -translate-x-1/2 text-[10px] font-mono px-1.5 py-0.5 rounded shadow-2xs font-semibold whitespace-nowrap transition-colors ${
                      isSelected
                        ? idx === 4
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                        : 'bg-white/90 text-zinc-600 border border-zinc-200/80'
                    }`}
                  >
                    {node.year}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right / Milestone Card & Branch Timeline Controls (5 Columns on lg) */}
        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-zinc-200/80 bg-white/95 backdrop-blur-md relative z-20">
          <div>
            {/* Step Navigation Pill Strip */}
            <div className="flex items-center justify-between gap-2 pb-4 mb-6 border-b border-zinc-100">
              <span className="text-[11px] font-mono uppercase tracking-wider text-rose-600 font-bold">
                // MARCOS DA SAKURA
              </span>

              <div className="flex items-center gap-1">
                {treeNodes.map((n, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelectStep(i)}
                    className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all ${
                      activeStep === i
                        ? i === 4
                          ? 'bg-amber-400 text-zinc-950 shadow-xs'
                          : 'bg-rose-500 text-white shadow-xs'
                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Milestone Card */}
            <div
              key={activeStep}
              className={`rounded-2xl p-6 transition-all duration-300 animate-in fade-in zoom-in-95 border ${
                isApex
                  ? 'bg-gradient-to-br from-amber-50/90 via-white to-amber-50/50 border-amber-300 shadow-xl shadow-amber-500/10'
                  : 'bg-white border-zinc-200 shadow-md'
              }`}
            >
              {/* Badge & Period Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span
                  className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border uppercase tracking-wider font-bold ${
                    isApex
                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}
                >
                  {activeConfig.tag}
                </span>

                <span className="text-xs font-mono font-bold text-zinc-500 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-rose-500" />
                  {activeMilestone.period}
                </span>
              </div>

              {/* Title */}
              <h3
                className={`text-xl sm:text-2xl font-black font-['Space_Grotesk'] tracking-tight mb-1 ${
                  isApex ? 'text-amber-950' : 'text-zinc-950'
                }`}
              >
                {activeMilestone.title}
              </h3>

              {/* Subtitle */}
              <h4 className="text-xs sm:text-sm font-mono text-zinc-500 mb-4">
                // {activeMilestone.subtitle}
              </h4>

              {/* Description */}
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal mb-5">
                {activeMilestone.description}
              </p>

              {/* Details and Official Link */}
              <div className="pt-3 border-t border-zinc-100 space-y-3">
                {activeMilestone.details && (
                  <div className="text-xs font-mono text-zinc-500 flex items-start gap-2">
                    <span className="text-rose-500 font-bold shrink-0">›</span>
                    <span>{activeMilestone.details}</span>
                  </div>
                )}

                {activeMilestone.link && (
                  <a
                    href={activeMilestone.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => sound.playClick()}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 text-zinc-950 hover:bg-amber-500 font-mono text-xs font-bold transition-all shadow-sm active:scale-95 mt-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>{activeMilestone.linkLabel || 'Ler Artigo no Portal SOL/SBC'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Step-through Controls */}
          <div className="pt-6 mt-6 border-t border-zinc-100 flex items-center justify-between">
            <button
              type="button"
              disabled={activeStep === 0}
              onClick={() => handleSelectStep(activeStep - 1)}
              className="px-3.5 py-1.5 rounded-xl bg-zinc-100 disabled:opacity-35 text-zinc-700 hover:bg-zinc-200 text-xs font-mono font-semibold transition-colors"
            >
              ← Galho Anterior
            </button>

            <span className="text-xs font-mono text-zinc-400">
              {activeStep + 1} / {treeNodes.length}
            </span>

            <button
              type="button"
              disabled={activeStep === treeNodes.length - 1}
              onClick={() => handleSelectStep(activeStep + 1)}
              className="px-3.5 py-1.5 rounded-xl bg-rose-50 disabled:opacity-35 text-rose-700 hover:bg-rose-100 text-xs font-mono font-semibold transition-colors"
            >
              Próximo Galho →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
