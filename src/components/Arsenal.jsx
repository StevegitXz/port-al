import React from 'react';
import { Layout, Server, Cpu, Terminal, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { ARSENAL_SKILLS } from '../utils/data';
import { sound } from '../utils/sound';
import CircuitTraces from './effects/CircuitTraces';
import Esp8266Canvas3D from './3d/Esp8266Canvas3D';

// Interactive ESP8266 MCU Microchip Component
function Esp8266McuCore({ hoveredCategory }) {
  const [boosted, setBoosted] = React.useState(false);
  const [packetCount, setPacketCount] = React.useState(1048);

  const handleMcuClick = () => {
    sound.playRelayClick(!boosted);
    setBoosted((prev) => !prev);
    setPacketCount((prev) => prev + Math.floor(Math.random() * 24 + 1));
  };

  return (
    <div className="mb-14 p-6 sm:p-8 rounded-3xl glass-panel bg-white/95 border border-zinc-200/90 shadow-sm relative overflow-hidden group">
      {/* Background ambient PCB glow */}
      <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-44 bg-emerald-300/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-500"></div>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
        {/* Left Telemetry Info */}
        <div className="space-y-3 text-left max-w-sm">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-[10px] font-mono font-bold text-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>HARDWARE EMBARCADO ATIVO</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-zinc-950 font-['Space_Grotesk'] tracking-tight">
            Núcleo de Controle SoC ESP8266
          </h3>
          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal">
            Microcontrolador 32-bit Xtensa LX106 com Wi-Fi nativo 802.11 b/g/n, operando sensores de umidade, temperatura e acionamento de atuadores no projeto MARIOT.
          </p>
          <div className="flex items-center gap-3 pt-2 font-mono text-[11px] text-zinc-500">
            <span>CLOCK: <strong className={boosted ? 'text-rose-600 font-bold' : 'text-zinc-900'}>{boosted ? '160 MHz (BOOST)' : '80 MHz'}</strong></span>
            <span>•</span>
            <span>PACOTES: <strong className="text-emerald-700 font-bold">{packetCount}</strong></span>
          </div>
        </div>

        {/* Center: Real-Time Interactive 3D ESP8266 Module (Three.js / WebGL) */}
        <div className="w-full max-w-sm lg:max-w-md flex items-center justify-center">
          <Esp8266Canvas3D boosted={boosted} onToggleBoost={handleMcuClick} />
        </div>

        {/* Right Feature Highlights */}
        <div className="space-y-2 text-left max-w-xs font-mono text-xs text-zinc-700">
          <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/80">
            <span className="text-[10px] text-zinc-500 uppercase block font-semibold mb-0.5">// FIRMWARE & PROTOCOLO</span>
            <span className="font-bold text-zinc-900">C++ / Arduino IDE / HTTP REST</span>
          </div>
          <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/80">
            <span className="text-[10px] text-zinc-500 uppercase block font-semibold mb-0.5">// SENSORES & ATUADORES</span>
            <span className="font-bold text-zinc-900">Módulo Relé, DHT22, Higrômetro</span>
          </div>
          <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/80">
            <span className="text-[10px] text-zinc-500 uppercase block font-semibold mb-0.5">// PUBLICAÇÃO CIENTÍFICA</span>
            <span className="font-bold text-emerald-700">Artigo Aceito no CSBC / WCAMA 2025</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// 3D Perspective Tilt Card for Arsenal Skills
function ArsenalMatrixCard({ group, config, getCategoryIcon }) {
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
      className={`group relative rounded-3xl glass-panel bg-white/95 p-7 sm:p-8 border border-zinc-200/80 hover:border-rose-300 shadow-xs hover:shadow-2xl transition-all duration-300 overflow-hidden will-change-transform ${config.colSpan} ${config.offset}`}
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

        {/* Central Interactive ESP8266 MCU Microchip */}
        <Esp8266McuCore />

        {/* 4 Pillars Bento-Editorial Matrix Grid with 3D Tilt Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          {ARSENAL_SKILLS.map((group, groupIdx) => {
            const config = configs[groupIdx] || configs[0];

            return (
              <ArsenalMatrixCard
                key={groupIdx}
                group={group}
                config={config}
                getCategoryIcon={getCategoryIcon}
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
