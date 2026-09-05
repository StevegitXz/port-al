import React from 'react';
import { Calendar, Award, BookOpen, GraduationCap, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import { TIMELINE } from '../utils/data';
import { sound } from '../utils/sound';

export default function Timeline() {
  const getBadgeStyle = (tag) => {
    switch (tag) {
      case 'CONGRESSO NACIONAL':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'DISTINÇÃO':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'FOMENTO IFAC':
      case 'BOLSISTA':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'VOLUNTÁRIO':
      case 'PROEX / IFAC':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-zinc-100 text-zinc-700 border-zinc-200';
    }
  };

  return (
    <section id="timeline" className="relative py-24 px-4 bg-[#fafbfc] border-t border-zinc-200/80">
      {/* Background glow */}
      <div className="pointer-events-none absolute top-1/4 left-10 w-[400px] h-[400px] bg-emerald-100/30 blur-[140px] rounded-full"></div>

      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-start mb-16">
          <div className="flex items-center gap-2 text-xs font-mono text-rose-600 tracking-widest uppercase mb-2">
            <span className="inline-block w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            <span>// 04. TRAJETÓRIA & CONQUISTAS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-zinc-950 font-['Space_Grotesk'] tracking-tight">
            Marcos Acadêmicos & Científicos
          </h2>
          <p className="text-zinc-600 text-sm sm:text-base max-w-2xl mt-2 font-normal">
            Histórico cronológico registrado no CNPq com pesquisas, projetos de extensão comunitária, tutoria discente e distinções.
          </p>
        </div>

        {/* Vertical Timeline Structure */}
        <div className="relative border-l border-zinc-200 ml-3 sm:ml-6 space-y-10">
          {TIMELINE.map((item, idx) => (
            <div
              key={idx}
              onMouseEnter={() => sound.playHover()}
              className="relative pl-6 sm:pl-10 group"
            >
              {/* Sakura Timeline Node / Dot */}
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-rose-500 group-hover:scale-125 group-hover:bg-rose-500 transition-all duration-300 shadow-sm"></div>

              {/* Timeline Card */}
              <div className="rounded-2xl glass-panel bg-white/95 p-6 border border-zinc-200/80 hover:border-rose-300 hover:shadow-md transition-all duration-300 group-hover:-translate-y-1 shadow-xs">
                {/* Header: Period & Tag */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                  <span className="text-xs font-mono font-bold text-zinc-500 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-rose-500" />
                    {item.period}
                  </span>
                  <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded border uppercase font-bold tracking-wider ${getBadgeStyle(item.tag)}`}>
                    {item.tag}
                  </span>
                </div>

                {/* Title & Subtitle */}
                <h3 className="text-lg sm:text-xl font-bold text-zinc-950 group-hover:text-rose-600 transition-colors font-['Space_Grotesk']">
                  {item.title}
                </h3>
                <h4 className="text-xs sm:text-sm font-mono text-zinc-500 mt-0.5 mb-3">
                  {item.subtitle}
                </h4>

                {/* Description */}
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed mb-3 font-normal">
                  {item.description}
                </p>

                {/* Details and Link Footer */}
                {(item.details || item.link) && (
                  <div className="pt-2.5 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                    {item.details && (
                      <div className="flex items-center gap-1.5 text-zinc-500">
                        <span className="text-zinc-400">›</span>
                        <span>{item.details}</span>
                      </div>
                    )}
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => sound.playClick()}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100 hover:border-amber-300 transition-colors text-xs font-mono font-semibold"
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
