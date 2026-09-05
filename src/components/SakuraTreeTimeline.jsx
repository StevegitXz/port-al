import React, { useState } from 'react';
import { Calendar, BookOpen, ChevronRight, Sparkles, Award, ExternalLink, ZoomIn } from 'lucide-react';
import { TIMELINE } from '../utils/data';
import { sound } from '../utils/sound';

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
      // SVG focus coordinates (% within tree)
      focusX: 50,
      focusY: 82,
      zoom: 1.25,
    },
    {
      levelName: 'Galho de Extensão',
      kanji: '枝',
      year: '2024-2025',
      dataIdx: 3,
      tag: 'AÇÃO COMUNITÁRIA',
      focusX: 30,
      focusY: 65,
      zoom: 1.35,
    },
    {
      levelName: 'Tronco de Pesquisa',
      kanji: '幹',
      year: '2025',
      dataIdx: 2,
      tag: 'INICIAÇÃO CIENTÍFICA',
      focusX: 68,
      focusY: 50,
      zoom: 1.35,
    },
    {
      levelName: 'Ramo de Liderança',
      kanji: '育',
      year: '2025',
      dataIdx: 1,
      tag: 'TUTORIA DISCENTE',
      focusX: 35,
      focusY: 34,
      zoom: 1.4,
    },
    {
      levelName: 'Copa Florida (O Ápice)',
      kanji: '頂',
      year: '2025-2026',
      dataIdx: 0,
      tag: 'CONGRESSO NACIONAL',
      focusX: 50,
      focusY: 16,
      zoom: 1.45,
    },
  ];

  const [activeStep, setActiveStep] = useState(4); // Default to apex (CSBC 2025)

  const activeConfig = treeNodes[activeStep];
  const activeMilestone = TIMELINE[activeConfig.dataIdx] || TIMELINE[0];
  const isApex = activeStep === 4;

  const handleSelectStep = (idx) => {
    sound.playSelect();
    setActiveStep(idx);
  };

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-zinc-200/90 shadow-2xl bg-gradient-to-b from-[#f8fafc] via-[#fff1f2]/30 to-[#fafbfc]">
      {/* 1. SCENIC BACKGROUND: MOUNT FUJI & MISTY SKY (Soft Blurred Depth-of-Field) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        {/* Morning Dawn Sky Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-100/40 via-rose-100/30 to-[#fafbfc] opacity-90"></div>

        {/* Soft Fuji Sun / Dawn Glow */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-gradient-to-b from-rose-200/40 to-amber-100/0 blur-3xl pointer-events-none"></div>

        {/* Mount Fuji Silhouette (Delicately Blurred) */}
        <div 
          className="absolute bottom-16 left-1/2 -translate-x-1/2 w-[700px] sm:w-[950px] opacity-25 filter blur-[2px] transition-transform duration-700 ease-out"
          style={{
            transform: `translateX(-50%) translateY(${-(activeConfig.focusY - 50) * 0.15}px) scale(${1 + (activeConfig.zoom - 1) * 0.1})`
          }}
        >
          <svg viewBox="0 0 1000 450" className="w-full h-auto" fill="none">
            {/* Fuji Base / Volcano Slope */}
            <path
              d="M 50 450 L 380 180 C 440 130 460 110 500 110 C 540 110 560 130 620 180 L 950 450 Z"
              fill="url(#fujiSlopeGradient)"
            />
            {/* Fuji Snow Cap */}
            <path
              d="M 420 150 C 445 130 470 110 500 110 C 530 110 555 130 580 150 L 595 180 C 580 175 565 190 550 175 C 535 160 520 175 500 165 C 480 175 465 160 450 175 C 435 190 420 175 405 180 Z"
              fill="url(#fujiSnowGradient)"
            />
            <defs>
              <linearGradient id="fujiSlopeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.1" />
              </linearGradient>
              <linearGradient id="fujiSnowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#f1f5f9" stopOpacity="0.75" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Ethereal Morning Mist Bands */}
        <div className="absolute bottom-24 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/70 to-transparent blur-md"></div>
      </div>

      {/* 2. THE SAKURA TREE INTERACTIVE CANVASES & NODES */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 min-h-[640px] items-stretch">
        {/* Left / Tree Visual Stage with Dynamic Zoom (7 Columns on lg) */}
        <div className="lg:col-span-7 relative flex items-center justify-center p-4 sm:p-8 min-h-[380px] lg:min-h-[620px] overflow-hidden">
          {/* Zoomable Tree Container */}
          <div
            className="relative w-full max-w-[540px] aspect-[4/5] transition-all duration-700 ease-out"
            style={{
              transform: `scale(${activeConfig.zoom}) translate(${-(activeConfig.focusX - 50) * 0.4}%, ${-(activeConfig.focusY - 50) * 0.4}%)`,
              transformOrigin: `${activeConfig.focusX}% ${activeConfig.focusY}%`,
            }}
          >
            {/* SVG Organic Sakura Tree (Trunk, Branches, Foliage) */}
            <svg viewBox="0 0 500 620" className="w-full h-full drop-shadow-xl" fill="none">
              <defs>
                {/* Wood bark gradient */}
                <linearGradient id="barkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3f3f46" />
                  <stop offset="50%" stopColor="#52525b" />
                  <stop offset="100%" stopColor="#27272a" />
                </linearGradient>

                {/* Sakura Blossom Glow */}
                <radialGradient id="sakuraBlossomGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#fb7185" stopOpacity="0.8" />
                  <stop offset="70%" stopColor="#fda4af" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Main Trunk Rising from Roots */}
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

              {/* CLUSTERS OF SAKURA BLOSSOMS (Soft Pink & Rose Cloud Clusters) */}
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

              {/* CROWN APEX CANOPY: THE MASSIVE FLOURISHING BLOOM (CSBC 2025) */}
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
              // Positioning mapped onto tree %
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
                  onClick={() => handleSelectStep(idx)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 group/node transition-transform duration-300 z-20 ${
                    isSelected ? 'scale-125' : 'hover:scale-110'
                  }`}
                  style={{ left: pos.left, top: pos.top }}
                  title={`${node.levelName} (${node.year})`}
                >
                  {/* Glowing halo when active */}
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

          {/* Floating Zoom Indicator Pill */}
          <div className="absolute bottom-4 left-4 z-20 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-zinc-200 text-[11px] font-mono text-zinc-600 shadow-sm flex items-center gap-2">
            <ZoomIn className="w-3.5 h-3.5 text-rose-500" />
            <span>Foco no Galho: <strong>{activeConfig.levelName}</strong></span>
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
