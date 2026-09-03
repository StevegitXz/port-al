import React, { useState } from 'react';
import { Mail, Copy, Check, Clock, Sparkles, Heart, ExternalLink } from 'lucide-react';
import GithubIcon from './GithubIcon';
import confetti from 'canvas-confetti';
import { PERSONAL_INFO } from '../utils/data';
import { sound } from '../utils/sound';
import { useClock } from '../hooks/useClock';


export default function Footer() {
  const { timeStr, dateStr } = useClock();
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PERSONAL_INFO.email);
      setCopied(true);
      sound.playSuccess();
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {}
  };

  const handleEasterEgg = () => {
    sound.playSuccess();
    try {
      confetti({
        particleCount: 45,
        spread: 70,
        origin: { y: 0.9 },
        colors: ['#f4a7b9', '#10b981', '#38bdf8', '#ffffff']
      });
    } catch (e) {}
  };

  return (
    <footer className="relative bg-[#07080a] border-t border-white/10 pt-16 pb-12 px-4 overflow-hidden">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-[#f4a7b9]/5 blur-[120px] rounded-full"></div>

      <div className="max-w-6xl mx-auto flex flex-col gap-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Brand & Location Info */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#f4a7b9]/15 border border-[#f4a7b9]/40 text-[#f4a7b9] font-mono font-black text-base shadow-[0_0_15px_rgba(244,167,185,0.3)]">
                S
              </span>
              <div>
                <h3 className="text-lg font-black text-white font-['Space_Grotesk'] tracking-tight">
                  {PERSONAL_INFO.name}
                </h3>
                <p className="text-xs font-mono text-[#f4a7b9]">
                  @{PERSONAL_INFO.handle} • Full Stack & IoT
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-zinc-400 max-w-md leading-relaxed font-normal">
              Discente do Curso Técnico Integrado em Informática para a Internet no IFAC Campus Rio Branco. Pesquisador em IoT e desenvolvedor de software focado em impacto educacional e regional.
            </p>

            {/* Live Clock Card */}
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-zinc-900/80 border border-white/5 font-mono text-xs text-zinc-300">
              <Clock className="w-4 h-4 text-[#f4a7b9] animate-pulse" />
              <div>
                <span className="text-zinc-500">Rio Branco (UTC-5): </span>
                <span className="font-bold text-white tracking-wider">{timeStr || '14:30:00'}</span>
                {dateStr && <span className="text-zinc-500 ml-1.5">• {dateStr}</span>}
              </div>
            </div>
          </div>

          {/* Quick Contact & Links */}
          <div className="md:col-span-6 space-y-4 md:text-right">
            <div className="text-xs font-mono text-[#f4a7b9] uppercase tracking-widest">
              // CANAL DE COMUNICAÇÃO
            </div>

            <div className="flex flex-col md:items-end gap-2.5">
              {/* Copy Email Button */}
              <button
                type="button"
                onClick={handleCopyEmail}
                onMouseEnter={() => sound.playHover()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass-panel text-zinc-200 hover:text-white font-mono text-xs hover:border-[#f4a7b9]/40 transition-colors w-fit"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">{PERSONAL_INFO.email} (Copiado!)</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-3.5 h-3.5 text-[#f4a7b9]" />
                    <span>{PERSONAL_INFO.email}</span>
                    <Copy className="w-3 h-3 text-zinc-500" />
                  </>
                )}
              </button>

              {/* GitHub and External Links */}
              <div className="flex items-center gap-2.5">
                <a
                  href={PERSONAL_INFO.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => sound.playClick()}
                  onMouseEnter={() => sound.playHover()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-white hover:border-[#f4a7b9]/40 transition-colors"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                  <ExternalLink className="w-3 h-3 text-zinc-500" />
                </a>


                {/* Easter Egg Trigger */}
                <button
                  type="button"
                  onClick={handleEasterEgg}
                  onMouseEnter={() => sound.playHover()}
                  title="Easter egg!"
                  className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-[#f4a7b9] hover:border-[#f4a7b9]/40 transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <div>
            © {new Date().getFullYear()} Estevão Emanuel (StevegitXz) • IFAC Rio Branco
          </div>

          <div className="flex items-center gap-1 text-[11px]">
            <span>Arquitetado com estética</span>
            <span className="text-[#f4a7b9]">Cyber-Zen</span>
            <span>&amp;</span>
            <span className="text-emerald-400">Gaming UI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
