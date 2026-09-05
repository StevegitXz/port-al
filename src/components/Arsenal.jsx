import React from 'react';
import { Layout, Server, Cpu, Terminal, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { ARSENAL_SKILLS } from '../utils/data';
import { sound } from '../utils/sound';

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
    <section id="arsenal" className="relative py-24 px-4 bg-[#fafbfc] border-t border-zinc-200/80">
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

        {/* 4 Pillars Matrix Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {ARSENAL_SKILLS.map((group, groupIdx) => (
            <div
              key={groupIdx}
              onMouseEnter={() => sound.playHover()}
              className="rounded-2xl glass-panel bg-white/90 p-6 sm:p-7 border border-zinc-200/80 shadow-xs hover:border-rose-300 hover:shadow-md transition-all duration-300"
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 pb-4 mb-5 border-b border-zinc-100">
                <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-200/80">
                  {getCategoryIcon(group.category)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-900 font-['Space_Grotesk']">
                    {group.category}
                  </h3>
                  <span className="text-xs font-mono text-zinc-400">
                    // Nível de Prática & Domínio
                  </span>
                </div>
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
                    <div className="h-1.5 w-full rounded-full bg-zinc-100 border border-zinc-200/60 overflow-hidden relative">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-zinc-400 via-rose-500 to-emerald-500 transition-all duration-700"
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
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
