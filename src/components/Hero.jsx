import React, { useState, useEffect } from 'react';
import { Terminal, Copy, Check, ArrowDown, ExternalLink, Sparkles, Code2 } from 'lucide-react';
import SakuraCanvas from './SakuraCanvas';
import ScrambleText from './ScrambleText';
import { PERSONAL_INFO, METRICS } from '../utils/data';
import { sound } from '../utils/sound';
import { achievementManager } from '../utils/achievements';

export default function Hero() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      achievementManager.unlock('first_contact');
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleCopyEmail = async () => {

    try {
      await navigator.clipboard.writeText(PERSONAL_INFO.email);
      setCopied(true);
      sound.playSuccess();
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      // Fallback
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-center items-center px-4 pt-24 pb-16 overflow-hidden bg-cyber-grid">
      {/* Background Interactive Sakura Particle Canvas */}
      <SakuraCanvas />

      {/* Subtle Japanese Kanji Watermarks */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute left-6 md:left-14 top-1/4 select-none text-[8rem] md:text-[14rem] font-bold text-white/[0.025] writing-mode-vertical"
      >
        創造
      </div>
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute right-6 md:right-14 bottom-1/4 select-none text-[8rem] md:text-[14rem] font-bold text-white/[0.025] writing-mode-vertical"
      >
        開発
      </div>

      {/* Ambient Gradient Glows */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#f4a7b9]/10 blur-[130px] rounded-full"></div>
      <div className="pointer-events-none absolute -bottom-32 left-1/3 w-[500px] h-[350px] bg-emerald-500/5 blur-[120px] rounded-full"></div>

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center text-center">
        {/* Status HUD Pill */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#12141a]/90 border border-[#f4a7b9]/25 backdrop-blur-md mb-6 shadow-lg shadow-black/40">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-mono text-zinc-300">
            <strong className="text-emerald-400">DISPONÍVEL</strong> • {PERSONAL_INFO.location}
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-zinc-400 border border-white/5">
            UTC-5
          </span>
        </div>

        {/* Cyber Moniker Badge */}
        <div className="flex items-center gap-2 text-xs font-mono text-[#f4a7b9] tracking-widest uppercase mb-3">
          <span>// DISCENTE & PESQUISADOR IFAC</span>
          <span className="text-zinc-600">•</span>
          <span className="text-zinc-400">HANDLE: @{PERSONAL_INFO.handle}</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight uppercase text-white font-['Space_Grotesk'] leading-[1.05] mb-4">
          Estevão{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-[#f4a7b9] to-zinc-200">
            Emanuel
          </span>
        </h1>

        {/* Subtitle / Role with ScrambleText */}
        <p className="text-lg sm:text-2xl font-mono text-zinc-300 font-medium max-w-2xl mx-auto mb-5 tracking-tight">
          <span className="text-[#f4a7b9]">&lt;</span>
          <ScrambleText
            text="Full Stack Developer & Creative Technologist"
            className="text-zinc-200"
          />
          <span className="text-[#f4a7b9]"> /&gt;</span>
        </p>


        {/* Bio summary paragraph */}
        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto mb-9 font-normal leading-relaxed">
          Desenvolvendo aplicações web completas do front-end reativo ao backend relacional, integrando sistemas embarcados e Internet das Coisas (IoT) na Amazônia Ocidental.
        </p>

        {/* Call to Actions (CTAs) */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 mb-14">
          <a
            href="#projects"
            onClick={() => sound.playSelect()}
            onMouseEnter={() => sound.playHover()}
            className="group relative inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-[#f4a7b9] text-zinc-950 font-mono font-semibold text-sm hover:bg-[#f6b8c6] transition-all duration-300 shadow-[0_0_25px_rgba(244,167,185,0.35)] hover:shadow-[0_0_35px_rgba(244,167,185,0.55)] active:scale-95"
          >
            <span>Ver Inventário de Projetos</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </a>

          <button
            type="button"
            onClick={handleCopyEmail}
            onMouseEnter={() => sound.playHover()}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl glass-panel text-zinc-200 hover:text-white font-mono text-sm hover:border-[#f4a7b9]/40 transition-all duration-300 active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">E-mail Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-zinc-400" />
                <span>Copiar E-mail</span>
              </>
            )}
          </button>

          <a
            href={PERSONAL_INFO.github}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sound.playClick()}
            onMouseEnter={() => sound.playHover()}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-zinc-200 font-mono text-sm hover:border-zinc-700 transition-all active:scale-95"
          >
            <ExternalLink className="w-4 h-4" />
            <span>GitHub</span>
          </a>
        </div>

        {/* Quick HUD Metrics Bar */}
        <div className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-3 p-3 rounded-2xl glass-panel border border-white/10">
          {METRICS.map((item, idx) => (
            <div 
              key={idx}
              className="p-3.5 rounded-xl bg-zinc-950/40 border border-white/5 flex flex-col items-center justify-center text-center hover:border-[#f4a7b9]/30 transition-colors"
            >
              <div className="text-2xl sm:text-3xl font-black font-['Space_Grotesk'] text-[#f4a7b9]">
                {item.value}
              </div>
              <div className="text-xs font-semibold text-zinc-200 mt-1">
                {item.label}
              </div>
              <div className="text-[10px] font-mono text-zinc-500 mt-0.5">
                {item.detail}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Down Scroll Indicator */}
      <a 
        href="#about"
        onClick={() => sound.playClick()}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-zinc-500 hover:text-[#f4a7b9] transition-colors"
        aria-label="Rolar para a seção sobre"
      >
        <span className="text-[10px] font-mono uppercase tracking-widest">Rolar</span>
        <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
      </a>
    </section>
  );
}
