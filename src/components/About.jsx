import React from 'react';
import { BookOpen, GraduationCap, Cpu, Layers, Sparkles, Award, Compass, HeartHandshake } from 'lucide-react';
import { PERSONAL_INFO, PHILOSOPHY_PILLARS } from '../utils/data';
import { sound } from '../utils/sound';

export default function About() {
  return (
    <section id="about" className="relative py-24 px-4 bg-[#fafbfc] border-t border-zinc-200/80">
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-rose-400/5 blur-[120px] rounded-full"></div>

      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-start mb-16">
          <div className="flex items-center gap-2 text-xs font-mono text-rose-600 tracking-widest uppercase mb-2 font-semibold">
            <span className="inline-block w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            <span>// 01. LORE & FILOSOFIA</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-zinc-950 font-['Space_Grotesk'] tracking-tight">
            Sobre Mim & Visão
          </h2>
          <p className="text-zinc-600 text-sm sm:text-base max-w-2xl mt-2 font-normal">
            A convergência entre o desenvolvimento de software web de alta escala, o fascínio pela eletrônica embarcada e o compromisso com a educação pública.
          </p>
        </div>

        {/* Narrative & Profile Overview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-start">
          {/* Main Story & Lattes Excerpt */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl glass-panel bg-white/90 border border-zinc-200/80 shadow-xs relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-rose-400/10 rounded-full blur-2xl pointer-events-none"></div>

              <div className="flex items-center gap-3 mb-4">
                <span className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
                  <GraduationCap className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-zinc-950">Trajetória no IFAC</h3>
                  <p className="text-xs font-mono text-zinc-500">Campus Rio Branco • Técnico Integrado em Informática</p>
                </div>
              </div>

              <p className="text-sm sm:text-base text-zinc-700 leading-relaxed mb-4">
                Com 17 anos e cursando o Técnico em Informática para a Internet no Instituto Federal do Acre (IFAC), cultivo uma paixão obstinada pela construção de sistemas ponta a ponta. Acredito que a programação é uma forma de materializar ideias complexas em soluções funcionais para a sociedade.
              </p>

              <blockquote className="border-l-2 border-rose-500 pl-4 py-2 text-xs sm:text-sm text-zinc-700 italic bg-rose-50/40 rounded-r-lg">
                "{PERSONAL_INFO.lattesBio}"
                <span className="block mt-2 not-italic font-mono text-[11px] text-rose-600 font-semibold">
                  — Resumo Oficial Cadastrado na Plataforma Lattes (CNPq)
                </span>
              </blockquote>
            </div>

            {/* CNPq Citations & Recognition Card */}
            <div className="p-5 rounded-xl bg-white border border-zinc-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <div className="text-xs font-mono text-zinc-500 uppercase">Citação Bibliográfica (CNPq)</div>
                  <div className="text-xs font-mono font-semibold text-zinc-800">
                    {PERSONAL_INFO.cnpqCitation}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {PERSONAL_INFO.cnpqAreas.map((area, idx) => (
                  <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200">
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Specs / Vitals Card */}
          <div className="lg:col-span-5 p-6 rounded-2xl glass-panel bg-white/90 border border-zinc-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span className="text-xs font-mono uppercase tracking-widest text-zinc-600 font-semibold">STATUS OPERACIONAL</span>
              </div>
              <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                ACTIVE
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between py-1.5 border-b border-zinc-100">
                <span className="text-zinc-500">Desenvolvedor:</span>
                <span className="text-zinc-900 font-semibold">{PERSONAL_INFO.shortName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-zinc-100">
                <span className="text-zinc-500">Idade / Nível:</span>
                <span className="text-zinc-800">{PERSONAL_INFO.age} Anos (Classe 2008)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-zinc-100">
                <span className="text-zinc-500">Origem:</span>
                <span className="text-zinc-800">{PERSONAL_INFO.location}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-zinc-100">
                <span className="text-zinc-500">Instituição:</span>
                <span className="text-rose-600 font-semibold">IFAC Rio Branco</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-zinc-100">
                <span className="text-zinc-500">Papel em Extensão:</span>
                <span className="text-zinc-800">Co-coordenador Learn.with(us)</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-zinc-500">Especialidade IoT:</span>
                <span className="text-zinc-800">ESP8266 + Automação Amazônica</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-[11px] text-zinc-600 leading-relaxed">
              💡 <strong className="text-zinc-900">Filosofia de Trabalho:</strong> "Código elegante, circuitos funcionais e conhecimento compartilhado com a comunidade."
            </div>
          </div>
        </div>

        {/* 4 Pillars Bento-Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-6">
          {PHILOSOPHY_PILLARS.map((pillar) => {
            const configs = {
              fullstack: {
                colSpan: 'lg:col-span-7 xl:col-span-8',
                offset: '',
                numTag: '№ 01 // ENGENHARIA WEB',
                glow: 'bg-rose-300/15',
                isWide: true,
              },
              iot: {
                colSpan: 'lg:col-span-5 xl:col-span-4',
                offset: 'lg:translate-y-8',
                numTag: '№ 02 // EMBARCADOS & IOT',
                glow: 'bg-emerald-300/15',
                isWide: false,
              },
              academic: {
                colSpan: 'lg:col-span-5 xl:col-span-4',
                offset: 'lg:-translate-y-2',
                numTag: '№ 03 // LIDERANÇA & PESQUISA',
                glow: 'bg-amber-300/15',
                isWide: false,
              },
              zen: {
                colSpan: 'lg:col-span-7 xl:col-span-8',
                offset: 'lg:translate-y-5',
                numTag: '№ 04 // HARMONIA CYBER-ZEN',
                glow: 'bg-purple-300/15',
                isWide: true,
              }
            };
            const config = configs[pillar.id] || {
              colSpan: 'lg:col-span-6',
              offset: '',
              numTag: '// PILAR',
              glow: 'bg-rose-300/10',
              isWide: false
            };

            return (
              <div
                key={pillar.id}
                onMouseEnter={() => sound.playHover()}
                className={`group relative rounded-3xl glass-panel bg-white/95 border border-zinc-200/80 hover:border-rose-300 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 overflow-hidden flex flex-col justify-between ${config.colSpan} ${config.offset}`}
              >
                {/* Soft ambient corner glow on hover */}
                <div className={`pointer-events-none absolute -top-16 -right-16 w-44 h-44 ${config.glow} rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500`}></div>

                {/* Vertical Japanese Kanji Watermark */}
                <div 
                  aria-hidden="true"
                  className="absolute right-6 top-5 text-6xl sm:text-7xl font-bold text-zinc-900/[0.035] group-hover:text-rose-500/10 transition-colors pointer-events-none font-mono select-none"
                >
                  {pillar.kanji}
                </div>

                <div className="p-7 sm:p-8 relative z-10 flex flex-col justify-between h-full">
                  <div>
                    {/* Top Metadata */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="text-[11px] font-mono text-rose-600 font-bold tracking-wider">
                        {config.numTag}
                      </span>
                      <span className="text-xs font-mono text-zinc-400">
                        {pillar.kanji}
                      </span>
                    </div>

                    {/* Title & Subtitle */}
                    <h3 className="text-xl sm:text-2xl font-black text-zinc-950 group-hover:text-rose-600 transition-colors mb-1 font-['Space_Grotesk'] tracking-tight">
                      {pillar.title}
                    </h3>
                    <p className="text-xs font-mono text-zinc-500 mb-4">
                      // {pillar.subtitle}
                    </p>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed mb-6 font-normal">
                      {pillar.desc}
                    </p>
                  </div>

                  {/* Tech/Tag Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-4 border-t border-zinc-100">
                    {pillar.techs.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700 border border-zinc-200/80 group-hover:border-rose-200"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
