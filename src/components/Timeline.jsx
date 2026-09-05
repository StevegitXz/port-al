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

  const featuredMilestone = TIMELINE[0];
  const otherMilestones = TIMELINE.slice(1);

  const getMilestoneBento = (idx) => {
    const configs = [
      {
        colSpan: 'lg:col-span-7 xl:col-span-8',
        offset: '',
        kanji: '共創',
        numTag: '№ 02 // TUTORIA DISCENTE',
        glow: 'bg-rose-300/15',
      },
      {
        colSpan: 'lg:col-span-5 xl:col-span-4',
        offset: 'lg:translate-y-8',
        kanji: '探究',
        numTag: '№ 03 // PESQUISA CIENTÍFICA',
        glow: 'bg-emerald-300/15',
      },
      {
        colSpan: 'lg:col-span-5 xl:col-span-4',
        offset: 'lg:-translate-y-2',
        kanji: '普及',
        numTag: '№ 04 // EXTENSÃO COMUNITÁRIA',
        glow: 'bg-cyan-300/15',
      },
      {
        colSpan: 'lg:col-span-7 xl:col-span-8',
        offset: 'lg:translate-y-4',
        kanji: '栄誉',
        numTag: '№ 05 // ENSINO & DISTINÇÕES',
        glow: 'bg-purple-300/15',
      },
    ];
    return configs[idx] || configs[0];
  };

  return (
    <section id="timeline" className="relative py-24 px-4 bg-[#fafbfc] border-t border-zinc-200/80">
      {/* Background glow */}
      <div className="pointer-events-none absolute top-1/4 left-10 w-[450px] h-[450px] bg-emerald-100/30 blur-[140px] rounded-full"></div>
      <div className="pointer-events-none absolute bottom-1/4 right-10 w-[400px] h-[400px] bg-rose-100/30 blur-[140px] rounded-full"></div>

      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-start mb-16">
          <div className="flex items-center gap-2 text-xs font-mono text-rose-600 tracking-widest uppercase mb-2 font-semibold">
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

        {/* FEATURED MILESTONE 01: CSBC 2025 CONGRESSO NACIONAL */}
        {featuredMilestone && (
          <div
            onMouseEnter={() => sound.playHover()}
            className="group relative rounded-3xl glass-panel bg-white/95 border-2 border-amber-300/80 hover:border-amber-400 p-8 sm:p-10 shadow-md hover:shadow-2xl transition-all duration-300 mb-12 overflow-hidden"
          >
            {/* Ambient golden glow */}
            <div className="pointer-events-none absolute -top-20 -right-20 w-60 h-60 bg-amber-200/30 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-500"></div>

            {/* Kanji watermark */}
            <div
              aria-hidden="true"
              className="absolute right-8 top-6 text-7xl sm:text-8xl font-bold text-amber-900/[0.04] group-hover:text-amber-600/10 transition-colors pointer-events-none font-mono select-none"
            >
              学術
            </div>

            <div className="relative z-10">
              {/* Header Badge Strip */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-amber-700 font-bold tracking-wider">
                    № 01 // DESTAQUE CIENTÍFICO NACIONAL
                  </span>
                  <span className="text-zinc-300">•</span>
                  <span className="text-xs font-mono px-3 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-bold uppercase tracking-wider shadow-2xs">
                    {featuredMilestone.tag}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-zinc-500 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-600" />
                  {featuredMilestone.period}
                </span>
              </div>

              {/* Content 2-Column Split */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-3">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-zinc-950 group-hover:text-amber-800 transition-colors font-['Space_Grotesk'] tracking-tight">
                    {featuredMilestone.title}
                  </h3>
                  <h4 className="text-sm font-mono text-zinc-600 font-medium">
                    // {featuredMilestone.subtitle}
                  </h4>
                  <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed font-normal pt-2">
                    {featuredMilestone.description}
                  </p>
                  {featuredMilestone.details && (
                    <p className="text-xs font-mono text-zinc-500 italic pt-1">
                      › {featuredMilestone.details}
                    </p>
                  )}
                </div>

                <div className="lg:col-span-5 p-6 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-4">
                  <div className="space-y-2 font-mono text-xs text-zinc-800">
                    <div className="flex items-center justify-between border-b border-amber-200/60 pb-1.5">
                      <span className="text-amber-900 font-semibold">Evento:</span>
                      <span className="text-zinc-700">45º CSBC / 16º WCAMA</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-amber-200/60 pb-1.5">
                      <span className="text-amber-900 font-semibold">Local:</span>
                      <span className="text-zinc-700">Maceió - AL</span>
                    </div>
                    <div className="flex items-center justify-between pb-1">
                      <span className="text-amber-900 font-semibold">Chancela:</span>
                      <span className="text-zinc-700">Soc. Bras. de Computação</span>
                    </div>
                  </div>

                  {featuredMilestone.link && (
                    <a
                      href={featuredMilestone.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => sound.playClick()}
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 text-zinc-950 hover:bg-amber-500 font-mono text-xs font-bold transition-all shadow-sm active:scale-95"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>{featuredMilestone.linkLabel || 'Ler Artigo na SBC'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBSEQUENT MILESTONES: BENTO-EDITORIAL GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-6">
          {otherMilestones.map((item, idx) => {
            const config = getMilestoneBento(idx);

            return (
              <div
                key={idx}
                onMouseEnter={() => sound.playHover()}
                className={`group relative rounded-3xl glass-panel bg-white/95 p-7 sm:p-8 border border-zinc-200/80 hover:border-rose-300 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 overflow-hidden flex flex-col justify-between ${config.colSpan} ${config.offset}`}
              >
                {/* Ambient corner glow */}
                <div className={`pointer-events-none absolute -top-16 -right-16 w-44 h-44 ${config.glow} rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500`}></div>

                {/* Vertical Kanji Watermark */}
                <div
                  aria-hidden="true"
                  className="absolute right-6 top-5 text-6xl sm:text-7xl font-bold text-zinc-900/[0.035] group-hover:text-rose-500/10 transition-colors pointer-events-none font-mono select-none"
                >
                  {config.kanji}
                </div>

                <div className="relative z-10 flex flex-col justify-between h-full">
                  <div>
                    {/* Header Strip */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-rose-600 font-bold tracking-wider">
                          {config.numTag}
                        </span>
                        <span className="text-zinc-300">•</span>
                        <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border uppercase font-bold tracking-wider ${getBadgeStyle(item.tag)}`}>
                          {item.tag}
                        </span>
                      </div>
                      <span className="text-xs font-mono font-bold text-zinc-400 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-rose-500" />
                        {item.period}
                      </span>
                    </div>

                    {/* Title & Subtitle */}
                    <h3 className="text-xl sm:text-2xl font-black text-zinc-950 group-hover:text-rose-600 transition-colors font-['Space_Grotesk'] tracking-tight mb-1">
                      {item.title}
                    </h3>
                    <h4 className="text-xs font-mono text-zinc-500 mb-4">
                      // {item.subtitle}
                    </h4>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed mb-6 font-normal">
                      {item.description}
                    </p>
                  </div>

                  {/* Details Footer */}
                  {item.details && (
                    <div className="pt-3 border-t border-zinc-100 flex items-center gap-2 text-xs font-mono text-zinc-500">
                      <span className="text-rose-500 font-bold">›</span>
                      <span>{item.details}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
