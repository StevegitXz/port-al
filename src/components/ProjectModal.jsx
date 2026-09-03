import React, { useEffect } from 'react';
import { X, ExternalLink, CheckCircle2, Cpu, Calendar, Tag, ShieldCheck, BookOpen } from 'lucide-react';
import GithubIcon from './GithubIcon';
import { sound } from '../utils/sound';



export default function ProjectModal({ project, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        sound.playClick();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          sound.playClick();
          onClose();
        }
      }}
    >
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl glass-panel border border-[#f4a7b9]/30 p-6 sm:p-8 bg-[#0e1017] shadow-2xl shadow-black/80 animate-in zoom-in-95 duration-200"
      >
        {/* Header Bar */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#f4a7b9]/15 text-[#f4a7b9] border border-[#f4a7b9]/30 font-bold uppercase tracking-wider">
                {project.badge}
              </span>
              <span className="text-xs font-mono text-zinc-500">
                {project.category} • {project.year}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white font-['Space_Grotesk']">
              {project.title}
            </h3>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white hover:border-[#f4a7b9]/50 transition-colors"
            title="Fechar Detalhes (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="py-5 space-y-6">
          {/* Quick Metrics HUD */}
          <div className="grid grid-cols-3 gap-2.5">
            {project.metrics.map((m, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-zinc-950/60 border border-white/5 text-center">
                <div className="text-[10px] font-mono text-zinc-500 uppercase">{m.label}</div>
                <div className="text-xs sm:text-sm font-bold text-zinc-200 mt-0.5">{m.val}</div>
              </div>
            ))}
          </div>

          {/* Deep Architectural Overview */}
          <div>
            <h4 className="text-xs font-mono text-[#f4a7b9] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" />
              <span>Visão Arquitetural & Propósito</span>
            </h4>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {project.fullDescription || project.description}
            </p>
          </div>

          {/* Highlights / Features List */}
          <div>
            <h4 className="text-xs font-mono text-emerald-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Destaques Técnicos & Resultados</span>
            </h4>
            <ul className="space-y-2">
              {project.highlights.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-300">
                  <CheckCircle2 className="w-4 h-4 text-[#f4a7b9] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech Stack Chips */}
          <div>
            <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              <span>Tecnologias & Ferramentas Empregadas</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.techs.map((t, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 text-xs font-mono rounded-lg bg-zinc-900 border border-zinc-700/80 text-[#f4a7b9]"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer / CTAs */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
          <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline">
            // StevegitXz • Open Source
          </span>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
            {project.articleUrl && (
              <a
                href={project.articleUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sound.playClick()}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-amber-400/15 border border-amber-400/40 text-amber-300 font-mono font-bold text-xs hover:bg-amber-400/25 transition-colors shadow-[0_0_15px_rgba(251,191,36,0.15)]"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Artigo SOL/SBC</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}

            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sound.playClick()}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#f4a7b9] text-zinc-950 font-mono font-bold text-xs hover:bg-[#f6b8c6] transition-colors shadow-[0_0_15px_rgba(244,167,185,0.3)]"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span>Ver Repositório</span>
              <ExternalLink className="w-3 h-3" />
            </a>



            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs font-mono text-zinc-300 hover:text-white"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
