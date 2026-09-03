import React, { useState } from 'react';
import { ExternalLink, Cpu, Layers, Sparkles, Gamepad2, ArrowUpRight, Search, BookOpen } from 'lucide-react';
import GithubIcon from './GithubIcon';
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
        return 'text-amber-400 border-amber-400/40 bg-amber-400/10';
      case 'EPIC':
        return 'text-[#f4a7b9] border-[#f4a7b9]/40 bg-[#f4a7b9]/10';
      case 'RARE':
        return 'text-cyan-400 border-cyan-400/40 bg-cyan-400/10';
      default:
        return 'text-zinc-400 border-zinc-700 bg-zinc-800';
    }
  };

  return (
    <section id="projects" className="relative py-24 px-4 bg-[#09090b] border-t border-white/5">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute top-1/3 right-0 w-[450px] h-[450px] bg-[#f4a7b9]/5 blur-[140px] rounded-full"></div>
      <div className="pointer-events-none absolute bottom-10 left-10 w-[350px] h-[350px] bg-emerald-500/5 blur-[120px] rounded-full"></div>

      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#f4a7b9] tracking-widest uppercase mb-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[#f4a7b9] animate-pulse"></span>
              <span>// 02. INVENTÁRIO DE SISTEMAS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-white font-['Space_Grotesk'] tracking-tight">
              Projetos & Produção Técnica
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base max-w-xl mt-2 font-normal">
              Softwares de apoio acadêmico, plataformas completas e pesquisa aplicada em Internet das Coisas (IoT) com publicação nacional.
            </p>
          </div>

          {/* Filter Pills / Deck Filter */}
          <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-zinc-900/80 border border-white/10 self-start md:self-end">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => {
                  sound.playClick();
                  setFilter(f.id);
                }}
                onMouseEnter={() => sound.playHover()}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  filter === f.id
                    ? 'bg-[#f4a7b9] text-zinc-950 font-bold shadow-md shadow-[#f4a7b9]/20'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid / Stage Select Deck */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((proj) => (
            <div
              key={proj.id}
              onMouseEnter={() => sound.playHover()}
              className="group relative rounded-2xl glass-panel p-6 sm:p-7 flex flex-col justify-between border border-white/10 hover:border-[#f4a7b9]/40 transition-all duration-300 hover:shadow-xl hover:shadow-[#f4a7b9]/5 hover:-translate-y-1.5"
            >
              <div>
                {/* Header of the Card: Year, Category & Rarity */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded border uppercase tracking-wider font-bold ${rarityColor(proj.rarity)}`}>
                    {proj.badge}
                  </span>
                  <span className="text-xs font-mono text-zinc-500">
                    // ANO {proj.year}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-[#f4a7b9] transition-colors font-['Space_Grotesk'] mb-2.5">
                  {proj.title}
                </h3>

                {/* Short Description */}
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6 font-normal">
                  {proj.description}
                </p>

                {/* Quick Spec Highlights */}
                <div className="space-y-1.5 mb-6 py-3 border-y border-white/5">
                  {proj.highlights.slice(0, 2).map((hl, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-mono text-zinc-300">
                      <span className="text-[#f4a7b9] font-bold">›</span>
                      <span className="truncate">{hl}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                {/* Tech Badges */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {proj.techs.map((tech, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-950/80 text-zinc-300 border border-zinc-800"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Actions: Inspect Details & GitHub */}
                <div className="flex items-center justify-between gap-3 pt-4 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => handleOpenModal(proj)}
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#f4a7b9] hover:text-white transition-colors"
                  >
                    <span>[ INSPECIONAR SISTEMA ]</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>

                  <div className="flex items-center gap-2">
                    {proj.articleUrl && (
                      <a
                        href={proj.articleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => sound.playClick()}
                        className="px-2.5 py-1.5 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-300 hover:text-white hover:border-amber-400/60 transition-colors text-xs font-mono flex items-center gap-1.5"
                        title="Ler Artigo Publicado no SOL/SBC"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-semibold">Artigo SBC</span>
                      </a>
                    )}

                    <a
                      href={proj.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => sound.playClick()}
                      className="p-2 rounded-lg bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-white hover:border-[#f4a7b9]/40 transition-colors"
                      title="Acessar no GitHub"
                    >
                      <GithubIcon className="w-4 h-4" />
                    </a>
                  </div>

                </div>
              </div>
            </div>
          ))}

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
