import React from 'react';
import { Layout, Server, Cpu, Terminal, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { ARSENAL_SKILLS } from '../utils/data';
import { sound } from '../utils/sound';
import CircuitTraces from './effects/CircuitTraces';
import TechArtifactsCanvas3D from './3d/TechArtifactsCanvas3D';

const ARTIFACT_TABS = [
  { id: 'iot', label: 'IoT // ESP8266', icon: '⚡' },
  { id: 'frontend', label: 'Front-End // React', icon: '⚛️' },
  { id: 'backend', label: 'Back-End // SQL', icon: '🗄️' },
  { id: 'devops', label: 'DevOps // Git', icon: '🐙' }
];

const ARTIFACT_DATA = {
  iot: {
    tag: 'HARDWARE EMBARCADO ATIVO',
    tagColor: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    title: 'Núcleo de Controle SoC ESP8266',
    desc: 'Microcontrolador 32-bit Xtensa LX106 com Wi-Fi nativo 802.11 b/g/n, operando sensores de umidade, temperatura e acionamento de atuadores no projeto MARIOT.',
    stat1Label: 'CLOCK',
    stat1Val: (boosted) => (boosted ? '160 MHz (BOOST)' : '80 MHz'),
    stat2Label: 'PACOTES',
    stat2Val: (count) => `${count} TX/RX`,
    highlights: [
      { tag: '// FIRMWARE & PROTOCOLO', val: 'C++ / Arduino IDE / HTTP REST' },
      { tag: '// SENSORES & ATUADORES', val: 'Módulo Relé, DHT22, Higrômetro' },
      { tag: '// PUBLICAÇÃO CIENTÍFICA', val: 'Artigo Aceito no CSBC / WCAMA 2025' }
    ]
  },
  frontend: {
    tag: 'REATOR REATIVO // UI VIRTUAL DOM',
    tagColor: 'bg-sky-50 border-sky-200 text-sky-800',
    title: 'Átomo Reativo React 19 & UI',
    desc: 'Arquitetura baseada em componentes funcionais puros, reconciliação ágil de Virtual DOM, estilização com Tailwind CSS e computação gráfica em Three.js.',
    stat1Label: 'TAXA DE QUADROS',
    stat1Val: (boosted) => (boosted ? '120 FPS (TURBO)' : '60 FPS (V-SYNC)'),
    stat2Label: 'SISTEMA DE DESIGN',
    stat2Val: () => 'Cyber-Zen Minimalist',
    highlights: [
      { tag: '// CORE FRAMEWORK', val: 'React 19 + Vite + Modern ES6' },
      { tag: '// DESIGN & ESTILOS', val: 'Tailwind CSS v4 + Glassmorphism' },
      { tag: '// GRÁFICOS & ÁUDIO', val: 'Three.js WebGL + Web Audio API' }
    ]
  },
  backend: {
    tag: 'MOTOR RELACIONAL // REST APIS',
    tagColor: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    title: 'Servidor SQL & Arquitetura de Dados',
    desc: 'Modelagem relacional de alta integridade, APIs RESTful padronizadas em Node.js/Express, conformidade estrita com transações ACID e persistência em banco relacional.',
    stat1Label: 'LATÊNCIA QUERY',
    stat1Val: (boosted) => (boosted ? '0.12 ms (CACHE HIT)' : '0.38 ms (INDEXED)'),
    stat2Label: 'CONFIABILIDADE',
    stat2Val: () => 'ACID COMPLIANT',
    highlights: [
      { tag: '// RUNTIME & SERVIDOR', val: 'Node.js + Express + TypeScript' },
      { tag: '// BANCOS DE DADOS', val: 'MySQL Relacional & PostgreSQL' },
      { tag: '// SEGURANÇA & REGRAS', val: 'JWT Auth + Sanitização de Queries' }
    ]
  },
  devops: {
    tag: 'PIPELINE CI/CD // VERSIONAMENTO',
    tagColor: 'bg-rose-50 border-rose-200 text-rose-800',
    title: 'Grafo Git & Orquestração de Deploy',
    desc: 'Versionamento semântico de código com Git Flow, pipelines automatizados de compilação, testes no GitHub Actions e entrega contínua na Vercel Edge Network.',
    stat1Label: 'PIPELINE STATUS',
    stat1Val: () => 'PASSING (0 ERRORS)',
    stat2Label: 'BRANCH ATIVO',
    stat2Val: (boosted) => (boosted ? 'main (DEPLOYED)' : 'main (SYNCED)'),
    highlights: [
      { tag: '// CONTROLE DE VERSÃO', val: 'Git + Semantic Commit History' },
      { tag: '// CLOUD DEPLOY', val: 'Vercel Serverless Edge Global' },
      { tag: '// SISTEMA OPERACIONAL', val: 'Linux Terminal / Bash Shell' }
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
    <div className="mb-20 relative">
      {/* Background ambient glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-emerald-400/10 blur-[130px] rounded-full"></div>

      {/* Modern Pill Tab Selector */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10 relative z-20">
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
              className={`px-4 py-2 rounded-full font-mono text-xs transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-zinc-950 text-white shadow-md scale-105 border border-zinc-800'
                  : 'bg-white/80 border border-zinc-200 text-zinc-600 hover:text-zinc-950 hover:border-zinc-300 backdrop-blur-sm shadow-2xs'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="font-bold">{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 relative z-10">
        {/* Left Telemetry Info */}
        <div className="space-y-3.5 text-left max-w-sm shrink-0">
          <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full border text-[10px] font-mono font-bold ${currentData.tagColor}`}>
            <span className="w-2 h-2 rounded-full bg-current animate-ping"></span>
            <span>{currentData.tag}</span>
          </div>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-zinc-950 font-['Space_Grotesk'] tracking-tight">
            {currentData.title}
          </h3>
          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal">
            {currentData.desc}
          </p>
          <div className="flex items-center gap-3 pt-2 font-mono text-xs text-zinc-500">
            <span>{currentData.stat1Label}: <strong className={boosted ? 'text-rose-600 font-bold' : 'text-zinc-900'}>{currentData.stat1Val(boosted)}</strong></span>
            <span>•</span>
            <span>{currentData.stat2Label}: <strong className="text-emerald-700 font-bold">{currentData.stat2Val(packetCount)}</strong></span>
          </div>
        </div>

        {/* Center: Real-Time Interactive 3D Artifact directly on the screen (Three.js / WebGL) */}
        <div className="w-full max-w-md lg:max-w-lg flex items-center justify-center">
          <TechArtifactsCanvas3D
            activeArtifact={activeArtifact}
            boosted={boosted}
            onInteract={handleArtifactInteract}
          />
        </div>

        {/* Right Feature Highlights */}
        <div className="space-y-3 text-left max-w-xs shrink-0 font-mono text-xs text-zinc-700">
          {currentData.highlights.map((h, i) => (
            <div key={i} className="p-3 rounded-2xl bg-white/90 border border-zinc-200/80 shadow-2xs backdrop-blur-sm">
              <span className="text-[10px] text-zinc-500 uppercase block font-semibold mb-0.5">{h.tag}</span>
              <span className="font-bold text-zinc-900">{h.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 3D Perspective Tilt Card for Arsenal Skills
function ArsenalMatrixCard({ group, config, getCategoryIcon, isActive, onSelectCategory }) {
  const [tilt, setTilt] = React.useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTilt({
      x: -((y / (rect.height / 2)) * 8),
      y: (x / (rect.width / 2)) * 8,
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
          ? `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.015, 1.015, 1.015)`
          : undefined,
        transition: isHovered ? 'transform 80ms ease-out' : 'transform 400ms ease-out',
      }}
      className={`group relative rounded-3xl glass-panel bg-white/95 p-7 sm:p-8 border transition-all duration-300 overflow-hidden will-change-transform cursor-pointer ${
        isActive
          ? 'border-rose-400 ring-2 ring-rose-300/40 shadow-xl'
          : 'border-zinc-200/80 hover:border-rose-300 shadow-xs hover:shadow-2xl'
      } ${config.colSpan} ${config.offset}`}
    >
      {/* Soft ambient corner glow on hover */}
      <div className={`pointer-events-none absolute -top-16 -right-16 w-48 h-48 ${config.glow} rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500`}></div>

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

      <div className="relative z-10">
        {/* Category Header */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-zinc-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-zinc-50 border border-zinc-200/80 shadow-2xs group-hover:border-rose-200 transition-colors">
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
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-100/90 text-zinc-500 border border-zinc-200 font-semibold group-hover:text-rose-600 group-hover:border-rose-200 transition-colors hidden sm:inline">
            {config.kanji}
          </span>
        </div>

        {/* Skills List */}
        <div className="space-y-4">
          {group.skills.map((skill, sIdx) => (
            <div key={sIdx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-zinc-800">{skill.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200/80">
                    {skill.badge}
                  </span>
                </div>
                <span className="text-rose-600 font-semibold">{skill.status}</span>
              </div>

              {/* Progress Bar */}
              <div className="h-2 w-full rounded-full bg-zinc-100 border border-zinc-200/60 overflow-hidden relative">
                <div
                  className={`h-full rounded-full ${config.barGradient} transition-all duration-700`}
                  style={{ width: `${skill.level}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Arsenal() {
  const [activeArtifact, setActiveArtifact] = React.useState('iot');

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
        return <Server className="w-5 h-5 text-cyan-600" />;
      case 'Hardware, IoT & Firmware':
        return <Cpu className="w-5 h-5 text-emerald-600" />;
      default:
        return <Terminal className="w-5 h-5 text-amber-600" />;
    }
  };

  const configs = [
    {
      colSpan: 'lg:col-span-7 xl:col-span-8',
      offset: '',
      kanji: '画面',
      numTag: '№ 01 // INTERFACE & EXPERIÊNCIA',
      glow: 'bg-rose-300/15',
      barGradient: 'bg-gradient-to-r from-zinc-400 via-rose-500 to-rose-400',
    },
    {
      colSpan: 'lg:col-span-5 xl:col-span-4',
      offset: 'lg:translate-y-8',
      kanji: '装置',
      numTag: '№ 02 // HARDWARE & IOT',
      glow: 'bg-emerald-300/15',
      barGradient: 'bg-gradient-to-r from-zinc-400 via-emerald-500 to-emerald-400',
    },
    {
      colSpan: 'lg:col-span-5 xl:col-span-4',
      offset: 'lg:-translate-y-2',
      kanji: '基盤',
      numTag: '№ 03 // APIS & BANCO RELACIONAL',
      glow: 'bg-cyan-300/15',
      barGradient: 'bg-gradient-to-r from-zinc-400 via-cyan-500 to-cyan-400',
    },
    {
      colSpan: 'lg:col-span-7 xl:col-span-8',
      offset: 'lg:translate-y-4',
      kanji: '道具',
      numTag: '№ 04 // DEVOPS & FERRAMENTAS',
      glow: 'bg-amber-300/15',
      barGradient: 'bg-gradient-to-r from-zinc-400 via-amber-500 to-amber-400',
    },
  ];

  return (
    <section id="arsenal" className="relative py-24 px-4 bg-[#fafbfc] border-t border-zinc-200/80 overflow-hidden">
      {/* PCB Circuit Traces & Electron Pulses */}
      <CircuitTraces />

      {/* Ambient background glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-rose-100/40 blur-[150px] rounded-full"></div>

      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-start mb-12">
          <div className="flex items-center gap-2 text-xs font-mono text-rose-600 tracking-widest uppercase mb-2 font-semibold">
            <span className="inline-block w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            <span>// 03. ARSENAL TECNOLÓGICO</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-zinc-950 font-['Space_Grotesk'] tracking-tight">
            Ferramentas & Tecnologias
          </h2>
          <p className="text-zinc-600 text-sm sm:text-base max-w-2xl mt-2 font-normal">
            Pilha tecnológica validada em desenvolvimento web full-stack, circuitos eletrônicos inteligentes e ambientes acadêmicos.
          </p>
        </div>

        {/* Central Real-Time Interactive 3D Stack Showcase (Three.js / WebGL) */}
        <TechArtifactsShowcase
          activeArtifact={activeArtifact}
          setActiveArtifact={setActiveArtifact}
        />

        {/* 4 Pillars Bento-Editorial Matrix Grid with 3D Tilt Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
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
                onSelectCategory={() => {
                  sound.playSelect();
                  setActiveArtifact(artifactId);
                }}
              />
            );
          })}
        </div>

        {/* Highlight Banner: Full-Stack + Hardware Hybrid */}
        <div className="p-6 rounded-2xl glass-panel border border-rose-200/70 bg-gradient-to-r from-zinc-50 via-rose-50/30 to-zinc-50 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-rose-100 border border-rose-200 text-rose-600 shrink-0">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-bold text-zinc-950">
                Perfil Híbrido: Engenharia de Software + Sistemas Embarcados
              </h4>
              <p className="text-xs sm:text-sm text-zinc-600 max-w-2xl mt-1">
                Capacidade de projetar a solução desde o nível do sensor físico (C++ / ESP8266) até a interface web moderna (React / Tailwind) e a infraestrutura de APIs.
              </p>
            </div>
          </div>

          <a
            href="#terminal"
            onClick={() => sound.playSelect()}
            className="shrink-0 px-4 py-2.5 rounded-xl bg-white border border-rose-300 hover:border-rose-500 text-rose-600 hover:text-rose-700 font-mono text-xs font-semibold transition-all shadow-xs hover:shadow-sm"
          >
            [ TESTAR NO TERMINAL ]
          </a>
        </div>
      </div>
    </section>
  );
}
