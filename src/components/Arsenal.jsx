import React from 'react';
import { Layout, Server, Cpu, Terminal, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { ARSENAL_SKILLS } from '../utils/data';
import { sound } from '../utils/sound';
import CircuitTraces from './effects/CircuitTraces';

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

  return (
    <section id="arsenal" className="relative py-24 px-4 bg-[#fafbfc] border-t border-zinc-200/80 overflow-hidden">
      {/* PCB Circuit Traces & Electron Pulses */}
      <CircuitTraces />

      {/* Ambient background glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-rose-100/40 blur-[150px] rounded-full"></div>

      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-start mb-16">
          <div className="flex items-center gap-2 text-xs font-mono text-rose-600 tracking-widest uppercase mb-2">
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

        {/* 4 Pillars Bento-Editorial Matrix Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          {ARSENAL_SKILLS.map((group, groupIdx) => {
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
            const config = configs[groupIdx] || configs[0];

            return (
              <div
                key={groupIdx}
                onMouseEnter={() => sound.playHover()}
                className={`group relative rounded-3xl glass-panel bg-white/95 p-7 sm:p-8 border border-zinc-200/80 hover:border-rose-300 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 overflow-hidden ${config.colSpan} ${config.offset}`}
              >
                {/* Soft ambient corner glow on hover */}
                <div className={`pointer-events-none absolute -top-16 -right-16 w-44 h-44 ${config.glow} rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500`}></div>

                {/* Vertical Japanese Kanji Watermark */}
                <div
                  aria-hidden="true"
                  className="absolute right-6 top-5 text-6xl sm:text-7xl font-bold text-zinc-900/[0.035] group-hover:text-rose-500/10 transition-colors pointer-events-none font-mono select-none"
                >
                  {config.kanji}
                </div>

                <div className="relative z-10">
                  {/* Category Header */}
                  <div className="flex items-center justify-between pb-4 mb-5 border-b border-zinc-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-2xl bg-zinc-50 border border-zinc-200/80 shadow-2xs">
                        {getCategoryIcon(group.category)}
                      </div>
                      <div>
                        <span className="text-[11px] font-mono text-rose-600 font-bold tracking-wider block">
                          {config.numTag}
                        </span>
                        <h3 className="text-lg font-bold text-zinc-900 font-['Space_Grotesk']">
                          {group.category}
                        </h3>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-zinc-400 hidden sm:inline">
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
