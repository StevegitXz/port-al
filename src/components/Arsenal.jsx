import React from 'react';
import { Layout, Server, Cpu, Terminal, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { ARSENAL_SKILLS } from '../utils/data';
import { sound } from '../utils/sound';

export default function Arsenal() {
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Front-End & Creative':
        return <Layout className="w-5 h-5 text-[#f4a7b9]" />;
      case 'Back-End & Banco de Dados':
        return <Server className="w-5 h-5 text-cyan-400" />;
      case 'Hardware, IoT & Firmware':
        return <Cpu className="w-5 h-5 text-emerald-400" />;
      default:
        return <Terminal className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <section id="arsenal" className="relative py-24 px-4 bg-[#09090b] border-t border-white/5">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#f4a7b9]/5 blur-[150px] rounded-full"></div>

      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-start mb-16">
          <div className="flex items-center gap-2 text-xs font-mono text-[#f4a7b9] tracking-widest uppercase mb-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#f4a7b9] animate-pulse"></span>
            <span>// 03. ARSENAL TECNOLÓGICO</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-white font-['Space_Grotesk'] tracking-tight">
            Ferramentas & Tecnologias
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mt-2 font-normal">
            Pilha tecnológica validada em desenvolvimento web full-stack, circuitos eletrônicos inteligentes e ambientes acadêmicos.
          </p>
        </div>

        {/* 4 Pillars Matrix Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {ARSENAL_SKILLS.map((group, groupIdx) => (
            <div
              key={groupIdx}
              onMouseEnter={() => sound.playHover()}
              className="rounded-2xl glass-panel p-6 sm:p-7 border border-white/10 hover:border-[#f4a7b9]/30 transition-all duration-300"
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 pb-4 mb-5 border-b border-white/5">
                <div className="p-2 rounded-xl bg-zinc-900 border border-white/10">
                  {getCategoryIcon(group.category)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-['Space_Grotesk']">
                    {group.category}
                  </h3>
                  <span className="text-xs font-mono text-zinc-500">
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
                        <span className="font-semibold text-zinc-200">{skill.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-zinc-400 border border-white/5">
                          {skill.badge}
                        </span>
                      </div>
                      <span className="text-[#f4a7b9] font-semibold">{skill.status}</span>
                    </div>

                    {/* Cyber Progress Bar */}
                    <div className="h-1.5 w-full rounded-full bg-zinc-900 overflow-hidden relative">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-zinc-600 via-[#f4a7b9] to-emerald-400 transition-all duration-700"
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
        <div className="p-6 rounded-2xl glass-panel border border-[#f4a7b9]/25 bg-gradient-to-r from-zinc-950 via-[#12141a] to-zinc-950 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-[#f4a7b9]/10 border border-[#f4a7b9]/30 text-[#f4a7b9] shrink-0">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-bold text-white">
                Perfil Híbrido: Engenharia de Software + Sistemas Embarcados
              </h4>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mt-1">
                Capacidade de projetar a solução desde o nível do sensor físico (C++ / ESP8266) até a interface web moderna (React / Tailwind) e a infraestrutura de APIs.
              </p>
            </div>
          </div>

          <a
            href="#terminal"
            onClick={() => sound.playSelect()}
            className="shrink-0 px-4 py-2.5 rounded-xl bg-zinc-900 border border-[#f4a7b9]/40 hover:border-[#f4a7b9] text-[#f4a7b9] hover:text-white font-mono text-xs font-semibold transition-all shadow-[0_0_15px_rgba(244,167,185,0.15)]"
          >
            [ TESTAR NO TERMINAL ]
          </a>
        </div>
      </div>
    </section>
  );
}
