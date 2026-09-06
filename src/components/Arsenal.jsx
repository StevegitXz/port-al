import React, { useState } from 'react';
import { Layout, Server, Cpu, Terminal, Zap, Sparkles, SlidersHorizontal, Layers, ShieldCheck, Compass } from 'lucide-react';
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

// 20 Complete Holographic Data-Shards with Real Context Tags
const TECH_DATA_SHARDS = [
  // Front-End & Creative (Avançado & Especialista)
  {
    id: 'react',
    name: 'React 19',
    category: 'Front-End & Creative',
    domain: 'frontend',
    icon: '⚛️',
    iconBg: 'bg-sky-50 text-sky-600 border-sky-200',
    tier: 'advanced',
    status: 'Avançado',
    level: 90,
    role: 'Virtual DOM & Componentes',
    context: 'Socio-Plat & Portfólio',
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    category: 'Front-End & Creative',
    domain: 'frontend',
    icon: '🎨',
    iconBg: 'bg-cyan-50 text-cyan-600 border-cyan-200',
    tier: 'expert',
    status: 'Especialista',
    level: 95,
    role: 'Design System & Responsivo',
    context: 'Cyber-Zen Minimalist UI',
  },
  {
    id: 'javascript',
    name: 'JavaScript (ES6+)',
    category: 'Front-End & Creative',
    domain: 'frontend',
    icon: '⚡',
    iconBg: 'bg-amber-50 text-amber-600 border-amber-200',
    tier: 'advanced',
    status: 'Avançado',
    level: 92,
    role: 'Lógica Reativa & Estado',
    context: 'Decifra Game & APIs',
  },
  {
    id: 'html-css',
    name: 'HTML5 / CSS3',
    category: 'Front-End & Creative',
    domain: 'frontend',
    icon: '🌐',
    iconBg: 'bg-orange-50 text-orange-600 border-orange-200',
    tier: 'advanced',
    status: 'Avançado',
    level: 95,
    role: 'Semântica W3C & Grid',
    context: 'Acessibilidade Web',
  },
  {
    id: 'vite',
    name: 'Vite Bundler',
    category: 'Front-End & Creative',
    domain: 'frontend',
    icon: '📦',
    iconBg: 'bg-purple-50 text-purple-600 border-purple-200',
    tier: 'intermediate',
    status: 'Intermediário+',
    level: 88,
    role: 'HMR & Pipeline de Build',
    context: 'Compilação Ágil',
  },
  {
    id: 'ui-ux',
    name: 'UI/UX & Figma',
    category: 'Front-End & Creative',
    domain: 'frontend',
    icon: '✨',
    iconBg: 'bg-rose-50 text-rose-600 border-rose-200',
    tier: 'intermediate',
    status: 'Intermediário+',
    level: 85,
    role: 'Prototipagem & Wireframes',
    context: 'Identidade Visual IFAC',
  },

  // Back-End & Banco de Dados (Avançado + Python & PHP Iniciante)
  {
    id: 'nodejs',
    name: 'Node.js & Express',
    category: 'Back-End & Banco de Dados',
    domain: 'backend',
    icon: '🟢',
    iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    tier: 'advanced',
    status: 'Avançado',
    level: 88,
    role: 'APIs RESTful & Middlewares',
    context: 'Norte Eventos (MVC)',
  },
  {
    id: 'mysql',
    name: 'MySQL Relacional',
    category: 'Back-End & Banco de Dados',
    domain: 'backend',
    icon: '🐬',
    iconBg: 'bg-sky-50 text-sky-600 border-sky-200',
    tier: 'advanced',
    status: 'Avançado',
    level: 85,
    role: 'Modelagem ACID & Índices',
    context: 'Banco de Dados Normalizado',
  },
  {
    id: 'mvc-rest',
    name: 'Arquitetura MVC & REST',
    category: 'Back-End & Banco de Dados',
    domain: 'backend',
    icon: '🏛️',
    iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    tier: 'advanced',
    status: 'Avançado',
    level: 88,
    role: 'Padrões de Software & Rotas',
    context: 'Clean Architecture Web',
  },
  {
    id: 'python',
    name: 'Python',
    category: 'Back-End & Banco de Dados',
    domain: 'backend',
    icon: '🐍',
    iconBg: 'bg-blue-50 text-blue-600 border-blue-200',
    tier: 'beginner',
    status: 'Iniciante',
    level: 45,
    role: 'Automação & Scripts Básicos',
    context: 'Fundamentos de Algoritmos',
  },
  {
    id: 'php',
    name: 'PHP',
    category: 'Back-End & Banco de Dados',
    domain: 'backend',
    icon: '🐘',
    iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    tier: 'beginner',
    status: 'Iniciante',
    level: 40,
    role: 'Scripts Web & Fundamentos',
    context: 'Sintaxe & Backend Base',
  },

  // Hardware, IoT & Firmware (Intermediário em tudo)
  {
    id: 'esp8266',
    name: 'ESP8266 SoC',
    category: 'Hardware, IoT & Firmware',
    domain: 'iot',
    icon: '📻',
    iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    tier: 'intermediate',
    status: 'Intermediário',
    level: 74,
    role: 'Wi-Fi 802.11 & GPIO 32-bit',
    context: 'Projeto MARIOT / CSBC 2025',
  },
  {
    id: 'cpp-firmware',
    name: 'C++ para Embarcados',
    category: 'Hardware, IoT & Firmware',
    domain: 'iot',
    icon: '⚙️',
    iconBg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    tier: 'intermediate',
    status: 'Intermediário',
    level: 70,
    role: 'Firmware & I/O em Tempo Real',
    context: 'Artigo Científico SBC',
  },
  {
    id: 'arduino-ide',
    name: 'Arduino IDE & Tooling',
    category: 'Hardware, IoT & Firmware',
    domain: 'iot',
    icon: '♾️',
    iconBg: 'bg-teal-50 text-teal-700 border-teal-200',
    tier: 'intermediate',
    status: 'Intermediário',
    level: 75,
    role: 'Flashing, Serial & Libs',
    context: 'Bancada Laboratorial IFAC',
  },
  {
    id: 'sensores-reles',
    name: 'Sensores, Relés & Circuitos',
    category: 'Hardware, IoT & Firmware',
    domain: 'iot',
    icon: '🔌',
    iconBg: 'bg-amber-50 text-amber-700 border-amber-200',
    tier: 'intermediate',
    status: 'Intermediário',
    level: 72,
    role: 'DHT22, Higrômetro & Cargas',
    context: 'Irrigação Automatizada',
  },
  {
    id: 'robotica-maker',
    name: 'Automação & Robótica',
    category: 'Hardware, IoT & Firmware',
    domain: 'iot',
    icon: '🤖',
    iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    tier: 'intermediate',
    status: 'Intermediário',
    level: 70,
    role: 'Oficinas Práticas & Montagem',
    context: 'Extensão PROEX & Suframa 40h',
  },

  // DevOps & Práticas (Avançado + Linux Iniciante)
  {
    id: 'git-github',
    name: 'Git & GitHub Flow',
    category: 'Ambiente, DevOps & Práticas',
    domain: 'devops',
    icon: '🐙',
    iconBg: 'bg-rose-50 text-rose-700 border-rose-200',
    tier: 'advanced',
    status: 'Avançado',
    level: 92,
    role: 'Versionamento & Commits',
    context: 'Git Flow em Repositórios',
  },
  {
    id: 'vercel-deploy',
    name: 'Vercel Edge Cloud',
    category: 'Ambiente, DevOps & Práticas',
    domain: 'devops',
    icon: '▲',
    iconBg: 'bg-zinc-100 text-zinc-900 border-zinc-300',
    tier: 'advanced',
    status: 'Avançado',
    level: 88,
    role: 'CI/CD & Serverless Edge',
    context: 'Deploy Contínuo Produção',
  },
  {
    id: 'linux-shell',
    name: 'Linux / Shell Scripting',
    category: 'Ambiente, DevOps & Práticas',
    domain: 'devops',
    icon: '🐧',
    iconBg: 'bg-slate-100 text-slate-800 border-slate-300',
    tier: 'beginner',
    status: 'Iniciante',
    level: 45,
    role: 'Terminal Bash & Navegação',
    context: 'Comandos Básicos de Sistema',
  },
  {
    id: 'vscode',
    name: 'VS Code Customizado',
    category: 'Ambiente, DevOps & Práticas',
    domain: 'devops',
    icon: '💻',
    iconBg: 'bg-blue-50 text-blue-700 border-blue-200',
    tier: 'advanced',
    status: 'Avançado',
    level: 95,
    role: 'Atalhos, Extensões & Tooling',
    context: 'Ambiente de Alta Produtividade',
  },
];

// Interactive 3D Technology Showcase Component
function TechArtifactsShowcase({ activeArtifact, setActiveArtifact }) {
  const [boosted, setBoosted] = useState(false);
  const [packetCount, setPacketCount] = useState(1048);

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
    <div className="mb-14 relative">
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

// Interactive Cyber-Zen Mastery Radar Chart
function MasteryRadarChart({ activeDomain, onSelectDomain }) {
  const [hoveredAxis, setHoveredAxis] = useState(null);

  // 4 Axes representing the core stack domains
  const axes = [
    { id: 'frontend', label: 'Front-End // UI & Design', angle: -Math.PI / 2, val: 0.92, level: '92%', tag: 'Avançado / Especialista' },
    { id: 'backend', label: 'Back-End // APIs & SQL', angle: 0, val: 0.78, level: '78%', tag: 'Avançado + Base' },
    { id: 'iot', label: 'Hardware // IoT & C++', angle: Math.PI / 2, val: 0.73, level: '73%', tag: 'Intermediário' },
    { id: 'devops', label: 'DevOps // Git & Cloud', angle: Math.PI, val: 0.78, level: '78%', tag: 'Avançado + Linux Base' },
  ];

  const cx = 150;
  const cy = 150;
  const maxR = 95;

  // Compute Polygon Points
  const polyPoints = axes
    .map((a) => {
      const r = a.val * maxR;
      const x = cx + Math.cos(a.angle) * r;
      const y = cy + Math.sin(a.angle) * r;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <div className="rounded-3xl glass-panel bg-white/95 p-6 sm:p-7 border border-zinc-200/90 shadow-xl flex flex-col justify-between h-full relative overflow-hidden">
      {/* Corner Glow */}
      <div className="pointer-events-none absolute -top-16 -left-16 w-48 h-48 bg-rose-200/25 rounded-full blur-2xl"></div>

      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-600">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-rose-600 font-bold uppercase tracking-wider block">
                TELEMETRIA DE HABILIDADES
              </span>
              <h4 className="text-base font-bold text-zinc-950 font-['Space_Grotesk']">
                Radar de Maestria Full-Stack
              </h4>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200 font-semibold">
            4 EIXOS
          </span>
        </div>

        {/* SVG Radar Graphic */}
        <div className="relative flex items-center justify-center py-2 select-none">
          <svg viewBox="0 0 300 300" className="w-full max-w-[270px] aspect-square overflow-visible">
            <defs>
              <linearGradient id="radarPolyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.35" />
                <stop offset="50%" stopColor="#fb7185" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.30" />
              </linearGradient>
            </defs>

            {/* Concentric Washi Web Rings (25%, 50%, 75%, 100%) */}
            {[0.25, 0.5, 0.75, 1.0].map((step, idx) => (
              <circle
                key={idx}
                cx={cx}
                cy={cy}
                r={maxR * step}
                fill="none"
                stroke="rgba(228, 228, 231, 0.8)"
                strokeDasharray={step === 1.0 ? 'none' : '3 3'}
                strokeWidth="1"
              />
            ))}

            {/* Diagonal crosshairs */}
            <line x1={cx} y1={cy - maxR} x2={cx} y2={cy + maxR} stroke="rgba(228, 228, 231, 0.9)" strokeWidth="1" />
            <line x1={cx - maxR} y1={cy} x2={cx + maxR} y2={cy} stroke="rgba(228, 228, 231, 0.9)" strokeWidth="1" />

            {/* Animated Competency Polygon */}
            <polygon
              points={polyPoints}
              fill="url(#radarPolyGrad)"
              stroke="#f43f5e"
              strokeWidth="2.2"
              className="transition-all duration-500 filter drop-shadow-sm"
            />

            {/* Vertex Nodes with Active Glow */}
            {axes.map((a, idx) => {
              const r = a.val * maxR;
              const vx = cx + Math.cos(a.angle) * r;
              const vy = cy + Math.sin(a.angle) * r;
              const isSelected = activeDomain === a.id;
              const isHover = hoveredAxis === a.id;

              return (
                <g
                  key={idx}
                  className="cursor-pointer group"
                  onClick={() => {
                    sound.playClick();
                    onSelectDomain(a.id);
                  }}
                  onMouseEnter={() => {
                    sound.playHover();
                    setHoveredAxis(a.id);
                  }}
                  onMouseLeave={() => setHoveredAxis(null)}
                >
                  {/* Outer pulse circle */}
                  <circle
                    cx={vx}
                    cy={vy}
                    r={isSelected ? 7 : isHover ? 6 : 4.5}
                    fill={isSelected ? '#e11d48' : '#f43f5e'}
                    className="transition-all duration-300"
                  />
                  <circle
                    cx={vx}
                    cy={vy}
                    r={isSelected ? 11 : 8}
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="1.5"
                    strokeOpacity={isSelected ? 0.6 : 0.3}
                    className="animate-ping"
                  />
                </g>
              );
            })}

            {/* Axis Cardinal Labels */}
            <text x={cx} y={cy - maxR - 12} textAnchor="middle" className="text-[10px] font-mono font-bold fill-rose-600">
              FRONT-END (92%)
            </text>
            <text x={cx + maxR + 10} y={cy + 4} textAnchor="start" className="text-[10px] font-mono font-bold fill-sky-700">
              BACK-END (78%)
            </text>
            <text x={cx} y={cy + maxR + 18} textAnchor="middle" className="text-[10px] font-mono font-bold fill-emerald-700">
              HARDWARE (73%)
            </text>
            <text x={cx - maxR - 10} y={cy + 4} textAnchor="end" className="text-[10px] font-mono font-bold fill-amber-700">
              DEVOPS (78%)
            </text>
          </svg>
        </div>
      </div>

      {/* Domain Breakdown Bars below Radar */}
      <div className="space-y-2 mt-2 pt-3 border-t border-zinc-100 font-mono">
        <div className="flex items-center justify-between text-[11px] text-zinc-500 font-bold mb-1">
          <span>// COORDENADAS POR DOMÍNIO</span>
          <span className="text-emerald-700 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            HÍBRIDO ATIVO
          </span>
        </div>

        {axes.map((a) => {
          const isSelected = activeDomain === a.id;
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => {
                sound.playClick();
                onSelectDomain(a.id);
              }}
              onMouseEnter={() => sound.playHover()}
              className={`w-full p-2 rounded-xl text-left transition-all flex items-center justify-between gap-2 cursor-pointer ${
                isSelected
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'bg-zinc-50/80 hover:bg-zinc-100 text-zinc-700'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs">{a.id === 'frontend' ? '⚛️' : a.id === 'backend' ? '🗄️' : a.id === 'iot' ? '⚡' : '🐙'}</span>
                <span className="text-xs font-semibold truncate">{a.label.split(' // ')[0]}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-zinc-200/70 text-zinc-700'
                }`}>
                  {a.level}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// 4-Segmented Tactile Cyber Mastery Pips
function MasteryPips({ tier }) {
  const getPipState = (step) => {
    if (step === 1) return true;
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
            className={`h-1.5 w-3.5 rounded-full transition-all duration-300 ${
              active ? getPipColor() : 'bg-zinc-200/70'
            }`}
          />
        );
      })}
    </div>
  );
}

// Visual Level Pill Badge
function ShardLevelBadge({ status, tier }) {
  switch (tier) {
    case 'expert':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-purple-50 text-purple-700 border border-purple-200/90 shadow-2xs">
          <Sparkles className="w-2.5 h-2.5 text-purple-600 animate-pulse" />
          <span>{status}</span>
        </span>
      );
    case 'advanced':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200/90 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
          <span>{status}</span>
        </span>
      );
    case 'intermediate':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-50 text-amber-700 border border-amber-200/90 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          <span>{status}</span>
        </span>
      );
    case 'beginner':
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-sky-50 text-sky-700 border border-sky-200/90 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
          <span>{status}</span>
        </span>
      );
  }
}

// Holographic Data-Shard Card with 3D Tilt & Foil Shimmer
function HoloTechCard({ shard, isSelected, onClick }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTilt({
      x: -((y / (rect.height / 2)) * 7),
      y: (x / (rect.width / 2)) * 7,
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const getBarColor = () => {
    switch (shard.tier) {
      case 'expert':
        return 'bg-gradient-to-r from-zinc-300 via-purple-500 to-purple-400';
      case 'advanced':
        return 'bg-gradient-to-r from-zinc-300 via-rose-500 to-rose-400';
      case 'intermediate':
        return 'bg-gradient-to-r from-zinc-300 via-amber-500 to-amber-400';
      case 'beginner':
      default:
        return 'bg-gradient-to-r from-zinc-300 via-sky-500 to-sky-400';
    }
  };

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => {
        sound.playHover();
        setIsHovered(true);
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isHovered
          ? `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.02, 1.02, 1.02)`
          : undefined,
        transition: isHovered ? 'transform 80ms ease-out' : 'transform 350ms ease-out',
      }}
      className={`holo-shimmer group relative rounded-2xl glass-panel bg-white/95 p-4 sm:p-4.5 border transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between select-none will-change-transform ${
        isSelected
          ? 'border-rose-400 ring-2 ring-rose-300/50 shadow-lg'
          : 'border-zinc-200/80 hover:border-zinc-300 shadow-xs hover:shadow-xl'
      }`}
    >
      <div>
        {/* Card Header: Icon + Name + Level Badge */}
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`w-8 h-8 rounded-xl border flex items-center justify-center text-sm shadow-2xs shrink-0 ${shard.iconBg}`}>
              <span>{shard.icon}</span>
            </div>
            <div className="min-w-0">
              <h5 className="font-bold text-sm text-zinc-950 font-['Space_Grotesk'] tracking-tight truncate group-hover:text-rose-600 transition-colors">
                {shard.name}
              </h5>
              <span className="text-[10px] font-mono text-zinc-500 block truncate">
                {shard.role}
              </span>
            </div>
          </div>

          <div className="shrink-0">
            <ShardLevelBadge status={shard.status} tier={shard.tier} />
          </div>
        </div>

        {/* Project Context Tag */}
        <div className="mb-3">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-50 text-[10px] font-mono text-zinc-600 border border-zinc-200/70 truncate max-w-full">
            <span className="text-zinc-400">#</span>
            <span className="truncate">{shard.context}</span>
          </span>
        </div>
      </div>

      {/* Card Footer: Mastery Pips + Progress Micro-bar */}
      <div className="pt-2 border-t border-zinc-100 flex items-center justify-between gap-2">
        <MasteryPips tier={shard.tier} />

        <div className="h-1.5 flex-1 rounded-full bg-zinc-100 border border-zinc-200/60 overflow-hidden relative">
          <div
            className={`h-full rounded-full ${getBarColor()} transition-all duration-700`}
            style={{ width: `${shard.level}%` }}
          ></div>
        </div>

        <span className="text-[10px] font-mono font-bold text-zinc-600 shrink-0 w-7 text-right">
          {shard.level}%
        </span>
      </div>
    </div>
  );
}

// Deck of Holographic Data-Shards with Dual Filters
function HoloDataShardsDeck({ activeDomain, setActiveDomain }) {
  const [tierFilter, setTierFilter] = useState('all');

  const tierFilters = [
    { id: 'all', label: 'Todas', count: 20 },
    { id: 'expert', label: 'Especialista', count: 1 },
    { id: 'advanced', label: 'Avançado', count: 9 },
    { id: 'intermediate', label: 'Intermediário (Hardware & Web)', count: 7 },
    { id: 'beginner', label: 'Iniciante (Python, PHP, Linux)', count: 3 },
  ];

  const domainTabs = [
    { id: 'all', label: 'Todos os Domínios', icon: '🌐' },
    { id: 'frontend', label: 'Front-End', icon: '⚛️' },
    { id: 'backend', label: 'Back-End', icon: '🗄️' },
    { id: 'iot', label: 'Hardware IoT', icon: '⚡' },
    { id: 'devops', label: 'DevOps & Shell', icon: '🐙' },
  ];

  // Filter shards
  const filteredShards = TECH_DATA_SHARDS.filter((s) => {
    const matchesTier = tierFilter === 'all' || s.tier === tierFilter;
    const matchesDomain = activeDomain === 'all' || s.domain === activeDomain;
    return matchesTier && matchesDomain;
  });

  return (
    <div className="space-y-4">
      {/* Top Filter Bar */}
      <div className="p-4 rounded-3xl bg-white/90 backdrop-blur-xl border border-zinc-200/90 shadow-md space-y-3">
        {/* Row 1: Domain Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-zinc-100">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-zinc-800">
            <Layers className="w-4 h-4 text-rose-500" />
            <span>DATA-SHARDS // FILTRAR DOMÍNIO:</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {domainTabs.map((dt) => {
              const isActive = activeDomain === dt.id;
              return (
                <button
                  key={dt.id}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setActiveDomain(dt.id);
                  }}
                  onMouseEnter={() => sound.playHover()}
                  className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-zinc-950 text-white shadow-xs scale-105 border border-zinc-800'
                      : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-600 border border-zinc-200/80'
                  }`}
                >
                  <span>{dt.icon}</span>
                  <span>{dt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 2: Proficiency Tier Filter */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-zinc-500">
            <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
            <span>NÍVEL DE PROFICIÊNCIA:</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {tierFilters.map((tf) => {
              const isSelected = tierFilter === tf.id;
              return (
                <button
                  key={tf.id}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setTierFilter(tf.id);
                  }}
                  onMouseEnter={() => sound.playHover()}
                  className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-rose-500 text-white font-bold shadow-xs'
                      : 'bg-zinc-100/90 hover:bg-zinc-200 text-zinc-600'
                  }`}
                >
                  <span>{tf.label}</span>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? 'bg-white/25 text-white' : 'bg-zinc-200 text-zinc-600'
                  }`}>
                    {tf.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Holographic Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5">
        {filteredShards.map((shard) => (
          <HoloTechCard
            key={shard.id}
            shard={shard}
            isSelected={activeDomain === shard.domain}
            onClick={() => {
              sound.playSelect();
              setActiveDomain(shard.domain);
            }}
          />
        ))}
      </div>

      {filteredShards.length === 0 && (
        <div className="p-8 rounded-3xl bg-white/80 border border-zinc-200 text-center font-mono text-xs text-zinc-500">
          Nenhuma tecnologia encontrada para os filtros selecionados.
        </div>
      )}
    </div>
  );
}

export default function Arsenal() {
  const [activeArtifact, setActiveArtifact] = useState('iot');
  const [activeDomain, setActiveDomain] = useState('all');

  // Handle domain selection from radar or card deck
  const handleDomainSelect = (domainId) => {
    setActiveDomain(domainId);
    if (domainId !== 'all') {
      setActiveArtifact(domainId);
    }
  };

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

        {/* ========================================================= */}
        {/* IDEA 3: RADAR DE MAESTRIA CYBER-ZEN + DECK DE HOLO-SHARDS */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          {/* Left Column: Interactive Telemetry Radar (5 cols) */}
          <div className="lg:col-span-5 xl:col-span-4 sticky top-24">
            <MasteryRadarChart
              activeDomain={activeDomain}
              onSelectDomain={handleDomainSelect}
            />
          </div>

          {/* Right Column: Holographic Data-Shards Deck (7 cols) */}
          <div className="lg:col-span-7 xl:col-span-8">
            <HoloDataShardsDeck
              activeDomain={activeDomain}
              setActiveDomain={handleDomainSelect}
            />
          </div>
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
