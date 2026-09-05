import React, { useEffect } from 'react';
import { X, ExternalLink, CheckCircle2, Cpu, Calendar, Tag, ShieldCheck, BookOpen } from 'lucide-react';
import GithubIcon from './GithubIcon';
import { sound } from '../utils/sound';
import { achievementManager } from '../utils/achievements';

export default function ProjectModal({ project, onClose }) {
  useEffect(() => {
    if (project?.id === 'mariot-iot') {
      achievementManager.unlock('sbc_scholar');
      achievementManager.unlock('iot_engineer');
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        sound.playClick();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          sound.playClick();
          onClose();
        }
      }}
    >
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl glass-panel border border-zinc-200 p-6 sm:p-8 bg-white/95 shadow-2xl animate-in zoom-in-95 duration-200 text-zinc-900"
      >
        {/* Header Bar */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-zinc-200">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 font-bold uppercase tracking-wider">
                {project.badge}
              </span>
              <span className="text-xs font-mono text-zinc-500">
                {project.category} • {project.year}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-zinc-950 font-['Space_Grotesk']">
              {project.title}
            </h3>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-zinc-100 border border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200 transition-colors"
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
              <div key={idx} className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/80 text-center">
                <div className="text-[10px] font-mono text-zinc-500 uppercase">{m.label}</div>
                <div className="text-xs sm:text-sm font-bold text-zinc-900 mt-0.5">{m.val}</div>
              </div>
            ))}
          </div>

          {/* Deep Architectural Overview */}
          <div>
            <h4 className="text-xs font-mono text-rose-600 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-semibold">
              <Cpu className="w-3.5 h-3.5" />
              <span>Visão Arquitetural & Propósito</span>
            </h4>
            <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed">
              {project.fullDescription || project.description}
            </p>
          </div>

          {/* Highlights / Features List */}
          <div>
            <h4 className="text-xs font-mono text-emerald-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Destaques Técnicos & Resultados</span>
            </h4>
            <ul className="space-y-2">
              {project.highlights.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-700">
                  <CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech Stack Chips */}
          <div>
            <h4 className="text-xs font-mono text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-semibold">
              <Tag className="w-3.5 h-3.5" />
              <span>Tecnologias & Ferramentas Empregadas</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.techs.map((t, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 text-xs font-mono rounded-lg bg-zinc-100 border border-zinc-200 text-zinc-800"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer / CTAs */}
        <div className="pt-4 border-t border-zinc-200 flex items-center justify-between gap-3">
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
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 font-mono font-bold text-xs hover:bg-amber-100 transition-colors shadow-2xs"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                <span>Artigo SOL/SBC</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}

            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sound.playClick()}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-rose-500 text-white font-mono font-bold text-xs hover:bg-rose-600 transition-colors shadow-xs"
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
              className="px-4 py-2 rounded-xl bg-zinc-100 border border-zinc-200 text-xs font-mono text-zinc-700 hover:text-zinc-950 hover:bg-zinc-200 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
