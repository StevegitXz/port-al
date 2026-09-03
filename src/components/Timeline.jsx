import React from 'react';
import { Calendar, Award, BookOpen, GraduationCap, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import { TIMELINE } from '../utils/data';
import { sound } from '../utils/sound';

export default function Timeline() {
  const getBadgeStyle = (tag) => {
    switch (tag) {
      case 'CONGRESSO NACIONAL':
        return 'bg-amber-400/10 text-amber-400 border-amber-400/30';
      case 'DISTINÇÃO':
        return 'bg-purple-400/10 text-purple-400 border-purple-400/30';
      case 'FOMENTO IFAC':
      case 'BOLSISTA':
        return 'bg-emerald-400/10 text-emerald-400 border-emerald-400/30';
      case 'VOLUNTÁRIO':
      case 'PROEX / IFAC':
        return 'bg-[#f4a7b9]/15 text-[#f4a7b9] border-[#f4a7b9]/30';
      default:
        return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    }
  };

  return (
    <section id="timeline" className="relative py-24 px-4 bg-[#09090b] border-t border-white/5">
      {/* Background glow */}
      <div className="pointer-events-none absolute top-1/4 left-10 w-[400px] h-[400px] bg-emerald-500/5 blur-[140px] rounded-full"></div>

      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-start mb-16">
          <div className="flex items-center gap-2 text-xs font-mono text-[#f4a7b9] tracking-widest uppercase mb-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#f4a7b9] animate-pulse"></span>
            <span>// 04. TRAJETÓRIA & CONQUISTAS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-white font-['Space_Grotesk'] tracking-tight">
            Marcos Acadêmicos & Científicos
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mt-2 font-normal">
            Histórico cronológico registrado no CNPq com pesquisas, projetos de extensão comunitária, tutoria discente e distinções.
          </p>
        </div>

        {/* Vertical Timeline Structure */}
        <div className="relative border-l border-white/10 ml-3 sm:ml-6 space-y-10">
          {TIMELINE.map((item, idx) => (
            <div
              key={idx}
              onMouseEnter={() => sound.playHover()}
              className="relative pl-6 sm:pl-10 group"
            >
              {/* Neon Timeline Node / Dot */}
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-[#09090b] border-2 border-[#f4a7b9] group-hover:scale-125 group-hover:bg-[#f4a7b9] group-hover:shadow-[0_0_12px_rgba(244,167,185,0.6)] transition-all duration-300"></div>

              {/* Timeline Card */}
              <div className="rounded-2xl glass-panel p-6 border border-white/10 hover:border-[#f4a7b9]/30 transition-all duration-300 group-hover:-translate-y-1">
                {/* Header: Period & Tag */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                  <span className="text-xs font-mono font-bold text-zinc-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#f4a7b9]" />
                    {item.period}
                  </span>
                  <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded border uppercase font-bold tracking-wider ${getBadgeStyle(item.tag)}`}>
                    {item.tag}
                  </span>
                </div>

                {/* Title & Subtitle */}
                <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-[#f4a7b9] transition-colors font-['Space_Grotesk']">
                  {item.title}
                </h3>
                <h4 className="text-xs sm:text-sm font-mono text-zinc-400 mt-0.5 mb-3">
                  {item.subtitle}
                </h4>

                {/* Description */}
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-3 font-normal">
                  {item.description}
                </p>

                {/* Details and Link Footer */}
                {(item.details || item.link) && (
                  <div className="pt-2.5 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                    {item.details && (
                      <div className="flex items-center gap-1.5 text-zinc-500">
                        <span className="text-zinc-600">›</span>
                        <span>{item.details}</span>
                      </div>
                    )}
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => sound.playClick()}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-300 hover:text-white hover:border-amber-400/60 transition-colors text-xs font-mono font-semibold"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{item.linkLabel || 'Ler Artigo'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                )}

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
