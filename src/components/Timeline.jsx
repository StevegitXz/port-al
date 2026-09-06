import React, { useState } from 'react';
import { Calendar, Award, BookOpen, GraduationCap, Sparkles, CheckCircle2, ChevronRight, FileText, ExternalLink, ShieldCheck, Tag } from 'lucide-react';
import { TIMELINE, PERSONAL_INFO } from '../utils/data';
import { sound } from '../utils/sound';
import SakuraTreeTimeline from './SakuraTreeTimeline';
import JapaneseDragonTimeline from './effects/JapaneseDragonTimeline';

// 3D Perspective Tilt Card for Academic Records
function TimelineRecordCard({ item, idx, isFullWidth = false }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTilt({
      x: -((y / (rect.height / 2)) * 7),
      y: (x / (rect.width / 2)) * 7,
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const kanjiMap = {
    'CONGRESSO NACIONAL': '学術',
    'VOLUNTÁRIO': '共創',
    'FOMENTO IFAC': '探究',
    'PROEX / IFAC': '普及',
    'BOLSISTA': '指導',
    'SUFRAMA': '機械',
    'DISTINÇÃO': '栄誉',
    'CERTIFICAÇÕES': '技能',
  };

  const badgeColorMap = {
    'CONGRESSO NACIONAL': {
      badge: 'bg-amber-100 text-amber-900 border-amber-300',
      glow: 'bg-amber-300/15',
      accent: 'text-amber-700',
      borderHover: 'hover:border-amber-400',
    },
    'FOMENTO IFAC': {
      badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      glow: 'bg-emerald-300/15',
      accent: 'text-emerald-700',
      borderHover: 'hover:border-emerald-300',
    },
    'PROEX / IFAC': {
      badge: 'bg-cyan-50 text-cyan-800 border-cyan-200',
      glow: 'bg-cyan-300/15',
      accent: 'text-cyan-700',
      borderHover: 'hover:border-cyan-300',
    },
    'VOLUNTÁRIO': {
      badge: 'bg-rose-50 text-rose-700 border-rose-200',
      glow: 'bg-rose-300/15',
      accent: 'text-rose-700',
      borderHover: 'hover:border-rose-300',
    },
    'BOLSISTA': {
      badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      glow: 'bg-emerald-300/15',
      accent: 'text-emerald-700',
      borderHover: 'hover:border-emerald-300',
    },
    'SUFRAMA': {
      badge: 'bg-blue-50 text-blue-800 border-blue-200',
      glow: 'bg-blue-300/15',
      accent: 'text-blue-700',
      borderHover: 'hover:border-blue-300',
    },
    'DISTINÇÃO': {
      badge: 'bg-purple-50 text-purple-800 border-purple-200',
      glow: 'bg-purple-300/15',
      accent: 'text-purple-700',
      borderHover: 'hover:border-purple-300',
    },
    'CERTIFICAÇÕES': {
      badge: 'bg-zinc-100 text-zinc-800 border-zinc-300',
      glow: 'bg-zinc-300/15',
      accent: 'text-zinc-700',
      borderHover: 'hover:border-zinc-400',
    },
  };

  const theme = badgeColorMap[item.tag] || badgeColorMap['CERTIFICAÇÕES'];
  const kanji = kanjiMap[item.tag] || '記';

  return (
    <div
      onMouseEnter={() => {
        sound.playHover();
        setIsHovered(true);
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isHovered
          ? `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.012, 1.012, 1.012)`
          : undefined,
        transition: isHovered ? 'transform 80ms ease-out' : 'transform 400ms ease-out',
      }}
      className={`group relative z-10 rounded-3xl glass-panel bg-white/95 p-7 sm:p-8 border border-zinc-200/80 ${theme.borderHover} shadow-xs hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between will-change-transform ${
        isFullWidth ? 'md:col-span-2' : ''
      }`}
    >
      {/* Ambient corner glow */}
      <div className={`pointer-events-none absolute -top-16 -right-16 w-48 h-48 ${theme.glow} rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500`}></div>

      {/* Floating 3D Japanese Kanji Watermark */}
      <div
        aria-hidden="true"
        style={{
          transform: isHovered ? 'scale(1.1) translateZ(30px)' : 'scale(1)',
          transition: 'transform 300ms ease-out, color 300ms ease',
        }}
        className="absolute right-6 top-5 text-6xl sm:text-7xl font-bold text-zinc-900/[0.035] group-hover:text-rose-500/15 transition-colors pointer-events-none font-mono select-none"
      >
        {kanji}
      </div>

      <div className="relative z-10 flex flex-col justify-between h-full">
        <div>
          {/* Top Header Strip */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-mono font-bold tracking-wider ${theme.accent} flex items-center gap-1.5`}>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                № 0{idx + 1} // {item.type}
              </span>
              <span className="text-zinc-300">•</span>
              <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border uppercase font-bold tracking-wider ${theme.badge}`}>
                {item.tag}
              </span>
            </div>

            <span className="text-xs font-mono font-semibold text-zinc-500 flex items-center gap-1.5 bg-zinc-50 px-2.5 py-0.5 rounded-full border border-zinc-200/80">
              <Calendar className="w-3.5 h-3.5 text-zinc-400" />
              {item.period}
            </span>
          </div>

          {/* Title & Subtitle */}
          <h3 className="text-xl sm:text-2xl font-black text-zinc-950 group-hover:text-rose-600 transition-colors font-['Space_Grotesk'] tracking-tight mb-1.5">
            {item.title}
          </h3>

          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-mono text-zinc-500">
              // {item.subtitle}
            </span>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed mb-6 font-normal">
            {item.description}
          </p>
        </div>

        {/* Footer with Details & Optional Link */}
        <div className="pt-4 border-t border-zinc-100/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {item.details ? (
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-600">
              <span className="text-rose-500 font-bold shrink-0">›</span>
              <span className="line-clamp-1">{item.details}</span>
            </div>
          ) : (
            <div />
          )}

          {item.link && (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sound.playClick()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-xs font-mono font-bold transition-all shadow-2xs self-end sm:self-auto shrink-0"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-800" />
              <span>{item.linkLabel || 'Ler Artigo'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Timeline() {
  const [filter, setFilter] = useState('ALL');

  const filters = [
    { id: 'ALL', label: 'Todos os Registros' },
    { id: 'PESQUISA', label: 'Pesquisa & Artigos' },
    { id: 'EXTENSAO', label: 'Extensão & Ensino' },
    { id: 'FORMACAO', label: 'Formação & Prêmios' },
  ];

  const getFilteredItems = (filterId) => {
    switch (filterId) {
      case 'PESQUISA':
        return TIMELINE.filter((item) =>
          item.tag === 'CONGRESSO NACIONAL' ||
          item.tag === 'FOMENTO IFAC' ||
          item.type.includes('Pesquisa')
        );
      case 'EXTENSAO':
        return TIMELINE.filter((item) =>
          item.tag === 'VOLUNTÁRIO' ||
          item.tag === 'PROEX / IFAC' ||
          item.tag === 'BOLSISTA' ||
          item.type.includes('Extensão') ||
          item.type.includes('Ensino')
        );
      case 'FORMACAO':
        return TIMELINE.filter((item) =>
          item.tag === 'SUFRAMA' ||
          item.tag === 'DISTINÇÃO' ||
          item.tag === 'CERTIFICAÇÕES' ||
          item.type.includes('Formação') ||
          item.type.includes('Premiação')
        );
      default:
        return TIMELINE;
    }
  };

  const filteredItems = getFilteredItems(filter);
  const featuredItem = filter === 'ALL' || filter === 'PESQUISA' ? TIMELINE[0] : null;
  const gridItems = filter === 'ALL' || filter === 'PESQUISA' 
    ? filteredItems.filter((i) => i.tag !== 'CONGRESSO NACIONAL') 
    : filteredItems;

  return (
    <section id="timeline" className="relative bg-[#fafbfc] border-t border-zinc-200/80">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute top-1/4 left-10 w-[450px] h-[450px] bg-emerald-100/30 blur-[140px] rounded-full"></div>
      <div className="pointer-events-none absolute bottom-1/4 right-10 w-[400px] h-[400px] bg-rose-100/30 blur-[140px] rounded-full"></div>

      {/* 1. IMMERSIVE FULL-BLEED SAKURA TREE & MOUNT FUJI PANORAMIC STAGE (100% SCREEN WIDTH) */}
      <div className="w-full relative">
        <SakuraTreeTimeline />
      </div>

      {/* 2. REORGANIZED & BALANCED EDITORIAL DOSSIER SECTION */}
      <div className="relative max-w-6xl mx-auto px-4 py-20 overflow-hidden sm:overflow-visible">
        {/* Japanese Dragon (Ryu / 龍) in Sumi-e ink slithering dynamically along all cards */}
        <JapaneseDragonTimeline opacity={0.92} />

        {/* Section Header */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 pb-6 border-b border-zinc-200/80">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-rose-600 tracking-widest uppercase mb-2 font-semibold">
              <span className="inline-block w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              <span>// 04. DOSSIÊ ACADÊMICO & CIENTÍFICO</span>
              <span className="text-zinc-300 hidden sm:inline">•</span>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-rose-50 border border-rose-200 text-rose-700 font-bold hidden sm:inline-flex items-center gap-1">
                <span>🐉</span>
                <span>ESPÍRITO RYU</span>
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-zinc-950 font-['Space_Grotesk'] tracking-tight">
              Registros Oficiais & Produção
            </h2>
            <p className="text-zinc-600 text-sm sm:text-base max-w-xl mt-2 font-normal">
              Publicações homologadas na SBC, bolsas de pesquisa institucional, projetos de extensão comunitária e distinções discentes cadastradas no CNPq.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-1.5 p-1.5 rounded-2xl bg-zinc-100/90 border border-zinc-200 self-start md:self-end shadow-2xs">
            {filters.map((f) => {
              const count = getFilteredItems(f.id).length;
              const isSelected = filter === f.id;

              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setFilter(f.id);
                  }}
                  onMouseEnter={() => sound.playHover()}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all inline-flex items-center gap-2 ${
                    isSelected
                      ? 'bg-white text-zinc-950 font-bold shadow-xs border border-zinc-200'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-white/50'
                  }`}
                >
                  <span>{f.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${
                      isSelected
                        ? 'bg-rose-50 text-rose-600 border border-rose-200'
                        : 'bg-zinc-200/70 text-zinc-500'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Lattes & CNPq Metadata Card */}
        <div className="relative z-10 p-4 sm:p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider font-semibold">
                BASE CNPq // CURRÍCULO LATTES
              </div>
              <div className="text-xs sm:text-sm font-mono font-bold text-zinc-900">
                {PERSONAL_INFO.cnpqCitation}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              {TIMELINE.length} Registros Auditados
            </span>
            <a
              href="https://lattes.cnpq.br"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sound.playClick()}
              className="text-xs font-mono text-zinc-700 hover:text-zinc-950 bg-zinc-100 hover:bg-zinc-200/80 px-3 py-1 rounded-lg border border-zinc-200 transition-colors inline-flex items-center gap-1.5 font-semibold"
            >
              <span>Plataforma Lattes</span>
              <ExternalLink className="w-3 h-3 text-zinc-500" />
            </a>
          </div>
        </div>

        {/* FEATURED MILESTONE 01: CSBC 2025 CONGRESSO NACIONAL (Hero Card) */}
        {featuredItem && (
          <div
            onMouseEnter={() => sound.playHover()}
            className="group relative z-10 rounded-3xl glass-panel bg-white/95 border-2 border-amber-300/90 hover:border-amber-400 p-8 sm:p-10 shadow-md hover:shadow-2xl transition-all duration-300 mb-8 overflow-hidden will-change-transform"
          >
            {/* Ambient golden glow */}
            <div className="pointer-events-none absolute -top-20 -right-20 w-64 h-64 bg-amber-200/35 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-500"></div>

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
                  <span className="text-xs font-mono text-amber-700 font-bold tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                    № 01 // DESTAQUE CIENTÍFICO NACIONAL
                  </span>
                  <span className="text-zinc-300">•</span>
                  <span className="text-xs font-mono px-3 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-bold uppercase tracking-wider shadow-2xs">
                    {featuredItem.tag}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-zinc-600 flex items-center gap-1.5 bg-white/80 px-3 py-1 rounded-full border border-amber-200">
                  <Calendar className="w-3.5 h-3.5 text-amber-600" />
                  {featuredItem.period}
                </span>
              </div>

              {/* Content 2-Column Split */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-3">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-zinc-950 group-hover:text-amber-900 transition-colors font-['Space_Grotesk'] tracking-tight">
                    {featuredItem.title}
                  </h3>
                  <h4 className="text-sm font-mono text-zinc-600 font-medium">
                    // {featuredItem.subtitle}
                  </h4>
                  <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed font-normal pt-2">
                    {featuredItem.description}
                  </p>
                  {featuredItem.details && (
                    <p className="text-xs font-mono text-zinc-500 italic pt-1">
                      › {featuredItem.details}
                    </p>
                  )}
                </div>

                <div className="lg:col-span-5 p-6 rounded-2xl bg-amber-50/70 border border-amber-200/90 space-y-4">
                  <div className="space-y-2 font-mono text-xs text-zinc-800">
                    <div className="flex items-center justify-between border-b border-amber-200/70 pb-1.5">
                      <span className="text-amber-900 font-semibold">Evento:</span>
                      <span className="text-zinc-700">45º CSBC / 16º WCAMA</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-amber-200/70 pb-1.5">
                      <span className="text-amber-900 font-semibold">Local:</span>
                      <span className="text-zinc-700">Maceió - AL</span>
                    </div>
                    <div className="flex items-center justify-between pb-1">
                      <span className="text-amber-900 font-semibold">Chancela:</span>
                      <span className="text-zinc-700">Soc. Bras. de Computação</span>
                    </div>
                  </div>

                  {featuredItem.link && (
                    <a
                      href={featuredItem.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => sound.playClick()}
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-zinc-950 font-mono text-xs font-bold transition-all shadow-sm active:scale-95"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>{featuredItem.linkLabel || 'Ler Artigo no Portal SOL/SBC'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* HARMONIOUS 2-COLUMN GRID FOR ALL REMAINING RECORDS */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {gridItems.map((item, index) => {
            const actualIndex = TIMELINE.findIndex((t) => t.title === item.title);
            const isLastOdd = gridItems.length % 2 !== 0 && index === gridItems.length - 1;

            return (
              <TimelineRecordCard
                key={item.title}
                item={item}
                idx={actualIndex !== -1 ? actualIndex : index}
                isFullWidth={isLastOdd}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

