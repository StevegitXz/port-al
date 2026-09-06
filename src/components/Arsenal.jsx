import React from 'react';
import { Layout, Server, Cpu, Terminal, Zap, Sparkles, CheckCircle2, SlidersHorizontal } from 'lucide-react';
import { ARSENAL_SKILLS } from '../utils/data';
import { sound } from '../utils/sound';
import CircuitTraces from './effects/CircuitTraces';
import TechArtifactsCanvas3D from './3d/TechArtifactsCanvas3D';

const ARTIFACT_TABS = [
  { id: 'iot', label: 'IoT // ESP8266', icon: '⚡', level: 'Intermediário', color: 'text-emerald-700' },
  { id: 'frontend', label: 'Front-End // React', icon: '⚛️', level: 'Avançado', color: 'text-rose-600' },
  { id: 'backend', label: 'Back-End // SQL', icon: '🗄️', level: 'Avançado / Base', color: 'text-sky-700' },
  { id: 'devops', label: 'DevOps // Git', icon: '🐙', level: 'Avançado / Base', color: 'text-amber-700' }
];

const ARTIFACT_DATA = {
  iot: {
    tag: 'HARDWARE EMBARCADO // INTERMEDIÁRIO',
    tagColor: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    title: 'Núcleo de Controle SoC ESP8266',
    desc: 'Prototipagem de sistemas embarcados com microcontrolador Xtensa 32-bit, Wi-Fi nativo 802.11 e sensores ambientais aplicados no projeto de automação MARIOT (CSBC 2025).',
    stat1Label: 'FREQUÊNCIA XTENSA',
    stat1Val: (boosted) => (boosted ? '160 MHz (OVERCLOCK)' : '80 MHz (ESTÁVEL)'),
    stat2Label: 'TELEMETRIA',
    stat2Val: (count) => `${count} TX/RX`,
    highlights: [
      { tag: '// FIRMWARE & PROTOCOLO (INTERMEDIÁRIO)', val: 'C++ / Arduino IDE / HTTP REST' },
      { tag: '// SENSORES & ATUADORES (INTERMEDIÁRIO)', val: 'Módulo Relé, DHT22, Higrômetro' },
      { tag: '// PUBLICAÇÃO CIENTÍFICA', val: 'Artigo Aceito no CSBC / WCAMA 2025' }
    ]
  },
  frontend: {
    tag: 'REATOR REATIVO // AVANÇADO & DESIGN',
    tagColor: 'bg-rose-50 border-rose-200 text-rose-800',
    title: 'Átomo Reativo React 19 & UI',
    desc: 'Arquitetura baseada em componentes funcionais puros, reconciliação ágil de Virtual DOM, estilização moderna com Tailwind CSS e computação gráfica 3D em Three.js.',
    stat1Label: 'TAXA DE QUADROS',
    stat1Val: (boosted) => (boosted ? '120 FPS (TURBO)' : '60 FPS (V-SYNC)'),
    stat2Label: 'SISTEMA DE DESIGN',
    stat2Val: () => 'Cyber-Zen Minimalist',
    highlights: [
      { tag: '// CORE FRAMEWORK (AVANÇADO)', val: 'React 19 + Modern ES6+ + Vite' },
      { tag: '// DESIGN SYSTEM (ESPECIALISTA)', val: 'Tailwind CSS v4 + Glassmorphism' },
      { tag: '// GRÁFICOS & ÁUDIO (AVANÇADO)', val: 'Three.js WebGL + Web Audio API' }
    ]
  },
  backend: {
    tag: 'MOTOR RELACIONAL // AVANÇADO & SCRIPTS',
    tagColor: 'bg-sky-50 border-sky-200 text-sky-800',
    title: 'Servidor SQL & Arquitetura de Dados',
    desc: 'APIs RESTful em Node.js/Express e modelagem relacional ACID no MySQL, complementadas por automação em Python e fundamentos em PHP.',
    stat1Label: 'LATÊNCIA QUERY',
    stat1Val: (boosted) => (boosted ? '0.12 ms (CACHE HIT)' : '0.38 ms (INDEXED)'),
    stat2Label: 'CONFIABILIDADE',
    stat2Val: () => 'ACID COMPLIANT',
    highlights: [
      { tag: '// RUNTIME & APIS (AVANÇADO)', val: 'Node.js + Express + Padrão REST' },
      { tag: '// BANCO RELACIONAL (AVANÇADO)', val: 'MySQL Relacional & Modelagem ACID' },
      { tag: '// SCRIPTS & BASE (INICIANTE)', val: 'Python (Scripts) & PHP (Web Base)' }
    ]
  },
  devops: {
    tag: 'PIPELINE CI/CD // VERSIONAMENTO & SHELL',
    tagColor: 'bg-amber-50 border-amber-200 text-amber-800',
    title: 'Grafo Git & Orquestração de Deploy',
    desc: 'Versionamento semântico com Git Flow, pipelines automatizados no GitHub e entrega contínua na Vercel Edge Network, operando com comandos essenciais em Linux.',
    stat1Label: 'PIPELINE STATUS',
    stat1Val: () => 'PASSING (0 ERRORS)',
    stat2Label: 'BRANCH ATIVO',
    stat2Val: (boosted) => (boosted ? 'main (DEPLOYED)' : 'main (SYNCED)'),
    highlights: [
      { tag: '// CONTROLE DE VERSÃO (AVANÇADO)', val: 'Git Flow + Semantic Commits GitHub' },
      { tag: '// CLOUD DEPLOY (AVANÇADO)', val: 'Vercel Serverless Edge Global' },
      { tag: '// SISTEMA OPERACIONAL (INICIANTE)', val: 'Linux Terminal / Bash Shell Básico' }
    ]
  }
};

// Interactive 3D Technology Showcase Component
function TechArtifactsShowcase({ activeArtifact, setActiveArtifact }) {
  const [boosted, setBoosted] = React.useState(false);
  const [packetCount, setPacketCount] = React.useState(1048);

  const handleArtifactInteract = (type) => {
    if (type === 'iot') {
      sound.playRelayClick(!boosted);
      setBoosted((prev) => !prev);
      setPacketCount((prev) => prev + Math.floor(Math.random() * 24 + 1));
    } else if (type === 'frontend') {
      sound.playSelect();
      setBoosted((prev) => !prev);
    } else if (type === 'backend') {
      sound.playMechanicalKey();
      setBoosted((prev) => !prev);
    } else if (type === 'devops') {
      sound.playSuccess();
      setBoosted((prev) => !prev);
    }
  };

  const currentData = ARTIFACT_DATA[activeArtifact] || ARTIFACT_DATA.iot;

  return (
    <div className="mb-16 relative">
      {/* Background ambient glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-rose-400/10 blur-[140px] rounded-full"></div>

      {/* Main Glass Workbench Container */}
      <div className="relative z-10 rounded-3xl bg-white/90 backdrop-blur-xl border border-zinc-200/90 shadow-xl p-6 sm:p-8 lg:p-10 overflow-hidden">
        {/* Soft corner highlight */}
        <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 bg-gradient-to-br from-rose-200/30 to-amber-200/20 rounded-full blur-3xl"></div>

        {/* Workbench Top Header & Pill Selector */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b border-zinc-100">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500 uppercase font-semibold">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              <span>BANCADA 3D INTERATIVA // SELECIONE O DOMÍNIO</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-zinc-950 font-['Space_Grotesk'] tracking-tight mt-0.5">
              Inspeção de Artefatos & Telemetria
            </h3>
          </div>

          {/* Domain Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {ARTIFACT_TABS.map((tab) => {
              const isActive = activeArtifact === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setActiveArtifact(tab.id);
                  }}
                  onMouseEnter={() => sound.playHover()}
                  className={`px-3.5 py-2 rounded-xl font-mono text-xs transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? 'bg-zinc-950 text-white shadow-md scale-105 border border-zinc-800 ring-2 ring-zinc-900/20'
                      : 'bg-zinc-50 border border-zinc-200 text-zinc-600 hover:text-zinc-950 hover:bg-white hover:border-zinc-300 shadow-2xs'
                  }`}
                >
                  <span className="text-sm">{tab.icon}</span>
                  <span className="font-bold">{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-zinc-200/70 text-zinc-600'
                  }`}>
                    {tab.level}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3-Column Balanced Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Telemetry & Description (4 cols) */}
          <div className="lg:col-span-4 space-y-4 text-left">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-mono font-bold ${currentData.tagColor}`}>
              <span className="w-2 h-2 rounded-full bg-current animate-ping"></span>
              <span>{currentData.tag}</span>
            </div>

            <div>
              <h4 className="text-2xl sm:text-3xl font-black text-zinc-950 font-['Space_Grotesk'] tracking-tight">
                {currentData.title}
              </h4>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal mt-2">
                {currentData.desc}
              </p>
            </div>

            {/* Live Stat Cards */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-zinc-50/90 border border-zinc-200/80 shadow-2xs">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block font-semibold">
                  {currentData.stat1Label}
                </span>
                <span className={`text-xs font-mono font-bold block mt-1 ${boosted ? 'text-rose-600' : 'text-zinc-900'}`}>
                  {currentData.stat1Val(boosted)}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-zinc-50/90 border border-zinc-200/80 shadow-2xs">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block font-semibold">
                  {currentData.stat2Label}
                </span>
                <span className="text-xs font-mono font-bold text-emerald-700 block mt-1">
                  {currentData.stat2Val(packetCount)}
                </span>
              </div>
            </div>

            {/* Action Trigger Button */}
            <button
              type="button"
              onClick={() => handleArtifactInteract(activeArtifact)}
              onMouseEnter={() => sound.playHover()}
              className="w-full mt-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-950 text-white font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md cursor-pointer group"
            >
              <Zap className={`w-3.5 h-3.5 transition-transform ${boosted ? 'text-amber-400 rotate-12' : 'text-zinc-400'}`} />
              <span>{boosted ? '[ MODO BOOST ATIVO // RESETAR ]' : '[ ATIVAR PULSO / OVERCLOCK ]'}</span>
            </button>
          </div>

          {/* Center Column: Interactive 3D Canvas (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            <div className="w-full flex items-center justify-center">
              <TechArtifactsCanvas3D
                activeArtifact={activeArtifact}
                boosted={boosted}
                onInteract={handleArtifactInteract}
              />
            </div>
            {/* Interactive hint pill */}
            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100/90 border border-zinc-200 text-[10px] font-mono text-zinc-600 shadow-2xs">
              <span>🔄 Arraste em 360°</span>
              <span>•</span>
              <span>👆 Clique no modelo para interagir</span>
            </div>
          </div>

          {/* Right Column: Key Architectural Highlights (3 cols) */}
          <div className="lg:col-span-3 space-y-3 text-left">
            <span className="text-[11px] font-mono text-zinc-500 uppercase font-bold tracking-wider block mb-1">
              // ESPECIFICAÇÕES VALIDADAS
            </span>
            {currentData.highlights.map((h, i) => (
              <div
                key={i}
                className="p-3.5 rounded-2xl bg-zinc-50/90 hover:bg-white border border-zinc-200/80 hover:border-zinc-300 shadow-2xs transition-all"
              >
                <span className="text-[10px] font-mono text-zinc-500 uppercase block font-semibold mb-0.5">
                  {h.tag}
                </span>
                <span className="text-xs font-mono font-bold text-zinc-900 block leading-snug">
                  {h.val}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Visual Level Pill Component
function SkillLevelBadge({ status, tier }) {
  switch (tier) {
    case 'expert':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-purple-50 text-purple-700 border border-purple-200/90 shadow-2xs">
          <Sparkles className="w-3 h-3 text-purple-600 animate-pulse" />
          <span>{status}</span>
        </span>
      );
    case 'advanced':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200/90 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
          <span>{status}</span>
        </span>
      );
    case 'intermediate':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-50 text-amber-700 border border-amber-200/90 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          <span>{status}</span>
        </span>
      );
    case 'beginner':
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-sky-50 text-sky-700 border border-sky-200/90 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
          <span>{status}</span>
        </span>
      );
  }
}

// 4-Segmented Tactile Cyber Mastery Pips
function MasteryPips({ tier }) {
  // 1 = beginner, 2 = intermediate, 3 = advanced, 4 = expert
  const getPipState = (step) => {
    if (step === 1) return true; // All skills have at least 1 pip
    if (step === 2) return tier !== 'beginner';
    if (step === 3) return tier === 'advanced' || tier === 'expert';
    if (step === 4) return tier === 'expert';
    return false;
  };

  const getPipColor = () => {
    switch (tier) {
      case 'expert':
        return 'bg-purple-500 shadow-xs shadow-purple-500/40';
      case 'advanced':
        return 'bg-rose-500 shadow-xs shadow-rose-500/40';
      case 'intermediate':
        return 'bg-amber-500 shadow-xs shadow-amber-500/40';
      case 'beginner':
      default:
        return 'bg-sky-500 shadow-xs shadow-sky-500/40';
    }
  };

  return (
    <div className="flex items-center gap-1" title={`Nível: ${tier}`}>
      {[1, 2, 3, 4].map((step) => {
        const active = getPipState(step);
        return (
          <div
            key={step}
            className={`h-1.5 w-4.5 rounded-full transition-all duration-300 ${
              active ? getPipColor() : 'bg-zinc-200/70'
            }`}
          />
        );
      })}
    </div>
  );
}

// Symmetrical 3D Perspective Tilt Card for Arsenal Skills
function ArsenalMatrixCard({ group, config, getCategoryIcon, isActive, onSelectCategory, activeTierFilter }) {
  const [tilt, setTilt] = React.useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTilt({
      x: -((y / (rect.height / 2)) * 6),
      y: (x / (rect.width / 2)) * 6,
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      onClick={onSelectCategory}
      onMouseEnter={() => {
        sound.playHover();
        setIsHovered(true);
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isHovered
          ? `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.012, 1.012, 1.012)`
          : undefined,
        transition: isHovered ? 'transform 80ms ease-out' : 'transform 400ms ease-out',
      }}
      className={`group relative rounded-3xl glass-panel bg-white/95 p-7 sm:p-8 border transition-all duration-300 overflow-hidden will-change-transform cursor-pointer flex flex-col justify-between ${
        isActive
          ? 'border-rose-400 ring-2 ring-rose-300/40 shadow-xl'
          : 'border-zinc-200/80 hover:border-zinc-300 shadow-xs hover:shadow-2xl'
      }`}
    >
      {/* Soft ambient corner glow on hover */}
      <div className={`pointer-events-none absolute -top-16 -right-16 w-52 h-52 ${config.glow} rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500`}></div>

      {/* Floating 3D Japanese Kanji Watermark */}
      <div
        aria-hidden="true"
        style={{
          transform: isHovered ? 'scale(1.1) translateZ(30px)' : 'scale(1)',
          transition: 'transform 300ms ease-out, color 300ms ease',
        }}
        className="absolute right-6 top-5 text-6xl sm:text-7xl font-bold text-zinc-900/[0.035] group-hover:text-rose-500/15 transition-colors pointer-events-none font-mono select-none"
      >
        {config.kanji}
      </div>

      <div className="relative z-10 w-full">
        {/* Category Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-zinc-100">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200/80 shadow-2xs group-hover:border-rose-200 transition-colors">
              {getCategoryIcon(group.category)}
            </div>
            <div>
              <span className="text-[11px] font-mono text-rose-600 font-bold tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                {config.numTag}
              </span>
              <h3 className="text-lg font-bold text-zinc-900 font-['Space_Grotesk']">
                {group.category}
              </h3>
            </div>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-zinc-100/90 text-zinc-600 border border-zinc-200 font-semibold group-hover:text-rose-600 group-hover:border-rose-200 transition-colors">
            {group.skills.length} Tecnologias
          </span>
        </div>

        {/* Skills List */}
        <div className="space-y-4">
          {group.skills.map((skill, sIdx) => {
            const isHighlighted = !activeTierFilter || activeTierFilter === 'all' || activeTierFilter === skill.tier;
            const isMatch = activeTierFilter && activeTierFilter !== 'all' && activeTierFilter === skill.tier;

            return (
              <div
                key={sIdx}
                className={`p-3 rounded-2xl transition-all duration-300 ${
                  isMatch
                    ? 'bg-rose-50/60 ring-2 ring-rose-400 border border-rose-300 shadow-sm'
                    : isHighlighted
                    ? 'hover:bg-zinc-50/80'
                    : 'opacity-35 grayscale-[50%]'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  {/* Skill Name & Sub-badge */}
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-semibold text-xs sm:text-sm text-zinc-900 truncate">
                      {skill.name}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200/80 shrink-0">
                      {skill.badge}
                    </span>
                  </div>

                  {/* Level Pill Badge */}
                  <div className="shrink-0">
                    <SkillLevelBadge status={skill.status} tier={skill.tier} />
                  </div>
                </div>

                {/* Meter Row: 4 Pips + Subtle Progress Bar */}
                <div className="flex items-center gap-3">
                  <MasteryPips tier={skill.tier} />

                  <div className="h-1.5 flex-1 rounded-full bg-zinc-100 border border-zinc-200/60 overflow-hidden relative">
                    <div
                      className={`h-full rounded-full ${config.barGradient} transition-all duration-700`}
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>

                  <span className="text-[11px] font-mono font-semibold text-zinc-500 shrink-0 w-8 text-right">
                    {skill.level}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function Arsenal() {
  const [activeArtifact, setActiveArtifact] = React.useState('iot');
  const [activeTierFilter, setActiveTierFilter] = React.useState('all');

  const categoryToArtifact = {
    'Front-End & Creative': 'frontend',
    'Hardware, IoT & Firmware': 'iot',
    'Back-End & Banco de Dados': 'backend',
    'Ambiente, DevOps & Práticas': 'devops',
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Front-End & Creative':
        return <Layout className="w-5 h-5 text-rose-500" />;
      case 'Back-End & Banco de Dados':
        return <Server className="w-5 h-5 text-sky-600" />;
      case 'Hardware, IoT & Firmware':
        return <Cpu className="w-5 h-5 text-emerald-600" />;
      default:
        return <Terminal className="w-5 h-5 text-amber-600" />;
    }
  };

  const configs = [
    {
      kanji: '画面',
      numTag: '№ 01 // FRONT-END & UI',
      glow: 'bg-rose-300/15',
      barGradient: 'bg-gradient-to-r from-zinc-300 via-rose-500 to-rose-400',
    },
    {
      kanji: '基盤',
      numTag: '№ 02 // APIS & BANCO RELACIONAL',
      glow: 'bg-sky-300/15',
      barGradient: 'bg-gradient-to-r from-zinc-300 via-sky-600 to-sky-400',
    },
    {
      kanji: '装置',
      numTag: '№ 03 // EMBARCADOS & IOT',
      glow: 'bg-emerald-300/15',
      barGradient: 'bg-gradient-to-r from-zinc-300 via-emerald-600 to-emerald-400',
    },
    {
      kanji: '道具',
      numTag: '№ 04 // DEVOPS & FERRAMENTAS',
      glow: 'bg-amber-300/15',
      barGradient: 'bg-gradient-to-r from-zinc-300 via-amber-500 to-amber-400',
    },
  ];

  const tierFilters = [
    { id: 'all', label: 'Todas as Tecnologias', count: 20 },
    { id: 'expert', label: 'Especialista', count: 1 },
    { id: 'advanced', label: 'Avançado', count: 9 },
    { id: 'intermediate', label: 'Intermediário (Hardware & Web)', count: 7 },
    { id: 'beginner', label: 'Iniciante (Python, PHP, Linux)', count: 3 },
  ];

  return (
    <section id="arsenal" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#fafbfc] border-t border-zinc-200/80 overflow-hidden">
      {/* PCB Circuit Traces & Electron Pulses */}
      <CircuitTraces />

      {/* Ambient background glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[450px] bg-rose-100/35 blur-[160px] rounded-full"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-start mb-12">
          <div className="flex items-center gap-2 text-xs font-mono text-rose-600 tracking-widest uppercase mb-2 font-semibold">
            <span className="inline-block w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            <span>// 03. ARSENAL TECNOLÓGICO • 技能マトリックス</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-zinc-950 font-['Space_Grotesk'] tracking-tight">
            Ferramentas & Tecnologias
          </h2>
          <p className="text-zinc-600 text-sm sm:text-base max-w-3xl mt-2 font-normal">
            Pilha tecnológica validada em desenvolvimento web full-stack, circuitos eletrônicos inteligentes e ambientes acadêmicos, categorizada por níveis de proficiência real.
          </p>
        </div>

        {/* Central Real-Time Interactive 3D Stack Showcase (Three.js / WebGL) */}
        <TechArtifactsShowcase
          activeArtifact={activeArtifact}
          setActiveArtifact={setActiveArtifact}
        />

        {/* Level Filter Toolbar & Legend */}
        <div className="mb-10 p-4 rounded-2xl bg-white/85 border border-zinc-200/80 shadow-xs backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-zinc-700">
            <SlidersHorizontal className="w-4 h-4 text-rose-500" />
            <span>FILTRAR PROFICIÊNCIA:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {tierFilters.map((tf) => {
              const isSelected = activeTierFilter === tf.id;
              return (
                <button
                  key={tf.id}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setActiveTierFilter(tf.id);
                  }}
                  onMouseEnter={() => sound.playHover()}
                  className={`px-3 py-1.5 rounded-xl font-mono text-xs transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-zinc-950 text-white shadow-sm font-bold scale-105 border border-zinc-800'
                      : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-600 border border-zinc-200/80'
                  }`}
                >
                  <span>{tf.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-zinc-200/80 text-zinc-600'
                  }`}>
                    {tf.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4 Pillars Bento-Editorial Matrix Grid with Perfectly Symmetrical 2x2 Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch mb-16">
          {ARSENAL_SKILLS.map((group, groupIdx) => {
            const config = configs[groupIdx] || configs[0];
            const artifactId = categoryToArtifact[group.category] || 'iot';
            const isActive = activeArtifact === artifactId;

            return (
              <ArsenalMatrixCard
                key={groupIdx}
                group={group}
                config={config}
                getCategoryIcon={getCategoryIcon}
                isActive={isActive}
                activeTierFilter={activeTierFilter}
                onSelectCategory={() => {
                  sound.playSelect();
                  setActiveArtifact(artifactId);
                }}
              />
            );
          })}
        </div>

        {/* Highlight Banner: Full-Stack + Hardware Hybrid */}
        <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-rose-200/80 bg-gradient-to-r from-white via-rose-50/40 to-white shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-rose-100 border border-rose-200 text-rose-600 shrink-0 shadow-2xs">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-mono text-rose-600 font-bold uppercase tracking-wider">
                  HOMOLOGAÇÃO TÉCNICA
                </span>
                <span className="text-zinc-300">•</span>
                <span className="text-[11px] font-mono text-zinc-500">
                  CSBC 2025 + IFAC
                </span>
              </div>
              <h4 className="text-base sm:text-lg font-bold text-zinc-950 font-['Space_Grotesk']">
                Perfil Híbrido: Engenharia Web Full-Stack & Sistemas Embarcados IoT
              </h4>
              <p className="text-xs sm:text-sm text-zinc-600 max-w-2xl mt-1 leading-relaxed">
                Capacidade comprovada de conceber soluções completas: da calibração de sensores e firmware em C++ (ESP8266) à interface web reativa em React, estilização com Tailwind CSS, banco relacional MySQL e deploy em nuvem.
              </p>
            </div>
          </div>

          <a
            href="#terminal"
            onClick={() => sound.playSelect()}
            className="shrink-0 px-5 py-3 rounded-2xl bg-zinc-900 hover:bg-zinc-950 text-white font-mono text-xs font-bold transition-all shadow-sm hover:shadow-md cursor-pointer flex items-center gap-2"
          >
            <Terminal className="w-4 h-4 text-rose-400" />
            <span>[ TESTAR NO TERMINAL 3D ]</span>
          </a>
        </div>
      </div>
    </section>
  );
}
