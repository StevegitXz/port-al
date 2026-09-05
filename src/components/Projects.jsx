import React, { useState } from 'react';
import { ExternalLink, ArrowUpRight, BookOpen } from 'lucide-react';
import GithubIcon from './GithubIcon';
import ScrambleText from './ScrambleText';
import { PROJECTS } from '../utils/data';
import { sound } from '../utils/sound';
import ProjectModal from './ProjectModal';

export default function Projects() {
  const [filter, setFilter] = useState('ALL');
  const [selectedProject, setSelectedProject] = useState(null);

  const filters = [
    { id: 'ALL', label: 'Todos os Projetos' },
    { id: 'FULLSTACK', label: 'Full Stack & Web' },
    { id: 'IOT', label: 'Hardware & IoT' },
    { id: 'GAMES', label: 'Gamificação & EdTech' }
  ];

  const filteredProjects = PROJECTS.filter((proj) => {
    if (filter === 'ALL') return true;
    if (filter === 'FULLSTACK') return proj.category.includes('Full-Stack');
    if (filter === 'IOT') return proj.category.includes('Hardware') || proj.category.includes('IoT');
    if (filter === 'GAMES') return proj.category.includes('Gamificação') || proj.category.includes('EdTech');
    return true;
  });

  const handleOpenModal = (proj) => {
    sound.playSelect();
    setSelectedProject(proj);
  };

  const rarityColor = (rarity) => {
    switch (rarity) {
      case 'LEGENDARY':
        return 'text-amber-800 border-amber-300 bg-amber-50/80';
      case 'EPIC':
        return 'text-rose-800 border-rose-300 bg-rose-50/80';
      case 'RARE':
        return 'text-sky-800 border-sky-300 bg-sky-50/80';
      default:
        return 'text-zinc-700 border-zinc-300 bg-zinc-100';
    }
  };

  const getBentoConfig = (id, totalCount) => {
    if (totalCount <= 2) {
      return {
        colSpan: totalCount === 1 ? 'lg:col-span-12' : 'lg:col-span-6',
        offset: '',
        kanji: id === 'mariot-iot' ? '学術' : id === 'socio-plat' ? '教育' : id === 'norte-eventos' ? '地域' : '遊戯',
        numTag: id === 'mariot-iot' ? '№ 01 // HARDWARE & CSBC' : id === 'socio-plat' ? '№ 02 // WEB & ENSINO' : id === 'norte-eventos' ? '№ 03 // ARQUITETURA MVC' : '№ 04 // GAMIFICAÇÃO',
        isWide: totalCount === 1,
        accentGlow: 'bg-rose-300/10',
      };
    }

    switch (id) {
      case 'mariot-iot':
        return {
          colSpan: 'lg:col-span-7 xl:col-span-8',
          offset: '',
          kanji: '学術',
          numTag: '№ 01 // HARDWARE & CSBC 2025',
          isWide: true,
          accentGlow: 'bg-amber-300/15',
        };
      case 'socio-plat':
        return {
          colSpan: 'lg:col-span-5 xl:col-span-4',
          offset: 'lg:translate-y-8',
          kanji: '教育',
          numTag: '№ 02 // WEB APP EDUCACIONAL',
          isWide: false,
          accentGlow: 'bg-rose-300/15',
        };
      case 'norte-eventos':
        return {
          colSpan: 'lg:col-span-5 xl:col-span-4',
          offset: 'lg:-translate-y-3',
          kanji: '地域',
          numTag: '№ 03 // ARQUITETURA MVC',
          isWide: false,
          accentGlow: 'bg-sky-300/15',
        };
      case 'decifra':
        return {
          colSpan: 'lg:col-span-7 xl:col-span-8',
          offset: 'lg:translate-y-5',
          kanji: '遊戯',
          numTag: '№ 04 // GAMIFICAÇÃO & EDTECH',
          isWide: true,
          accentGlow: 'bg-purple-300/15',
        };
      default:
        return {
          colSpan: 'lg:col-span-6',
          offset: '',
          kanji: '創造',
          numTag: '// PROJETO',
          isWide: false,
          accentGlow: 'bg-rose-300/10',
        };
    }
  };

  return (
    <section id="projects" className="relative py-24 px-4 bg-[#fafbfc] bg-asanoha border-t border-zinc-200/80">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute top-1/3 right-0 w-[450px] h-[450px] bg-rose-400/5 blur-[140px] rounded-full"></div>
      <div className="pointer-events-none absolute bottom-10 left-10 w-[350px] h-[350px] bg-emerald-400/5 blur-[120px] rounded-full"></div>

      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-rose-600 tracking-widest uppercase mb-2 font-semibold">
              <span className="inline-block w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              <span>// 02. INVENTÁRIO DE SISTEMAS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-zinc-950 font-['Space_Grotesk'] tracking-tight">
              Projetos & Produção Técnica
            </h2>
            <p className="text-zinc-600 text-sm sm:text-base max-w-xl mt-2 font-normal">
              Softwares de apoio acadêmico, plataformas completas e pesquisa aplicada em Internet das Coisas (IoT) com publicação nacional.
            </p>
          </div>

          {/* Filter Pills / Deck Filter */}
          <div className="flex flex-wrap gap-1.5 p-1.5 rounded-2xl bg-zinc-100/90 border border-zinc-200 self-start md:self-end shadow-2xs">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => {
                  sound.playClick();
                  setFilter(f.id);
                }}
                onMouseEnter={() => sound.playHover()}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all ${
                  filter === f.id
                    ? 'bg-white text-zinc-950 font-bold shadow-xs border border-zinc-200'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-white/50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Asymmetrical Bento-Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          {filteredProjects.map((proj) => {
            const config = getBentoConfig(proj.id, filteredProjects.length);

            return (
              <div
                key={proj.id}
                onMouseEnter={() => sound.playHover()}
                className={`group relative rounded-3xl glass-panel bg-white/95 holo-shimmer border border-zinc-200/80 hover:border-rose-300 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 overflow-hidden ${config.colSpan} ${config.offset}`}
              >
                {/* Soft ambient corner glow on hover */}
                <div className={`pointer-events-none absolute -top-16 -right-16 w-44 h-44 ${config.accentGlow} rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500`}></div>

                {/* Vertical Japanese Kanji Watermark */}
                <div
                  aria-hidden="true"
                  className="absolute right-6 top-5 text-6xl sm:text-7xl font-bold text-zinc-900/[0.035] group-hover:text-rose-500/10 transition-colors pointer-events-none font-mono select-none"
                >
                  {config.kanji}
                </div>

                {/* Card Interior */}
                <div className="p-7 sm:p-8 flex flex-col justify-between h-full relative z-10">
                  {/* Top Metadata Strip */}
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-rose-600 font-bold tracking-wider">
                          {config.numTag}
                        </span>
                        <span className="text-zinc-300">•</span>
                        <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border uppercase tracking-wider font-bold ${rarityColor(proj.rarity)}`}>
                          {proj.badge}
                        </span>
                      </div>
                      <span className="text-xs font-mono text-zinc-400">
                        ANO {proj.year}
                      </span>
                    </div>

                    {/* WIDE CARD LAYOUT (e.g. MARIOT & DECIFRA) */}
                    {config.isWide ? (
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6 items-start">
                        {/* Left Side: Title & Description */}
                        <div className="md:col-span-7 space-y-3">
                          <ScrambleText
                            text={proj.title}
                            as="h3"
                            className="text-2xl sm:text-3xl font-black text-zinc-950 group-hover:text-rose-600 transition-colors font-['Space_Grotesk'] tracking-tight block"
                          />
                          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal">
                            {proj.description}
                          </p>
                        </div>

                        {/* Right Side: Quick Spec Highlights Sub-Box */}
                        <div className="md:col-span-5 p-4 rounded-2xl bg-zinc-50/80 border border-zinc-200/70 space-y-2">
                          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-semibold block">
                            // DESTAQUES DE ENGENHARIA
                          </span>
                          {proj.highlights.slice(0, 2).map((hl, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs font-mono text-zinc-700 leading-snug">
                              <span className="text-rose-500 font-bold shrink-0">›</span>
                              <span>{hl}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      /* COMPACT / VERTICAL CARD LAYOUT (e.g. SOCIO-PLAT & NORTE EVENTOS) */
                      <div className="mb-6 space-y-3">
                        <ScrambleText
                          text={proj.title}
                          as="h3"
                          className="text-xl sm:text-2xl font-black text-zinc-950 group-hover:text-rose-600 transition-colors font-['Space_Grotesk'] tracking-tight block"
                        />
                        <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal">
                          {proj.description}
                        </p>

                        {/* Quick Spec Highlights */}
                        <div className="space-y-1.5 py-3 border-y border-zinc-100">
                          {proj.highlights.slice(0, 2).map((hl, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs font-mono text-zinc-700 leading-snug">
                              <span className="text-rose-500 font-bold shrink-0">›</span>
                              <span className="line-clamp-1">{hl}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bottom Strip: Tech Badges & Actions */}
                  <div className="pt-5 border-t border-zinc-100/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-1.5">
                      {proj.techs.map((tech, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700 border border-zinc-200/80"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0">
                      {proj.articleUrl && (
                        <a
                          href={proj.articleUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => sound.playClick()}
                          className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100 hover:border-amber-300 transition-colors text-xs font-mono font-semibold flex items-center gap-1.5 shadow-2xs"
                          title="Ler Artigo Publicado no SOL/SBC"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                          <span>Artigo SBC</span>
                        </a>
                      )}

                      <a
                        href={proj.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => sound.playClick()}
                        className="p-2 rounded-xl bg-white border border-zinc-200 text-zinc-700 hover:text-zinc-950 hover:border-rose-300 shadow-2xs transition-colors"
                        title="Acessar no GitHub"
                      >
                        <GithubIcon className="w-4 h-4" />
                      </a>

                      <button
                        type="button"
                        onClick={() => handleOpenModal(proj)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 hover:text-rose-800 text-xs font-mono font-bold transition-all shadow-2xs"
                      >
                        <span>INSPECIONAR</span>
                        <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail Inspection Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
}
