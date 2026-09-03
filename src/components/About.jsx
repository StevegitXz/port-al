import React from 'react';
import { BookOpen, GraduationCap, Cpu, Layers, Sparkles, Award, Compass, HeartHandshake } from 'lucide-react';
import { PERSONAL_INFO, PHILOSOPHY_PILLARS } from '../utils/data';
import { sound } from '../utils/sound';

export default function About() {
  return (
    <section id="about" className="relative py-24 px-4 bg-[#09090b] border-t border-white/5">
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-[#f4a7b9]/5 blur-[120px] rounded-full"></div>

      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-start mb-16">
          <div className="flex items-center gap-2 text-xs font-mono text-[#f4a7b9] tracking-widest uppercase mb-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#f4a7b9] animate-pulse"></span>
            <span>// 01. LORE & FILOSOFIA</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-white font-['Space_Grotesk'] tracking-tight">
            Sobre Mim & Visão
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mt-2 font-normal">
            A convergência entre o desenvolvimento de software web de alta escala, o fascínio pela eletrônica embarcada e o compromisso com a educação pública.
          </p>
        </div>

        {/* Narrative & Profile Overview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-start">
          {/* Main Story & Lattes Excerpt */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl glass-panel relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#f4a7b9]/10 rounded-full blur-2xl pointer-events-none"></div>

              <div className="flex items-center gap-3 mb-4">
                <span className="p-2 rounded-lg bg-[#f4a7b9]/10 text-[#f4a7b9] border border-[#f4a7b9]/20">
                  <GraduationCap className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-white">Trajetória no IFAC</h3>
                  <p className="text-xs font-mono text-zinc-400">Campus Rio Branco • Técnico Integrado em Informática</p>
                </div>
              </div>

              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed mb-4">
                Com 17 anos e cursando o Técnico em Informática para a Internet no Instituto Federal do Acre (IFAC), cultivo uma paixão obstinada pela construção de sistemas ponta a ponta. Acredito que a programação é uma forma de materializar ideias complexas em soluções funcionais para a sociedade.
              </p>

              <blockquote className="border-l-2 border-[#f4a7b9] pl-4 py-1 text-xs sm:text-sm text-zinc-400 italic bg-white/[0.02] rounded-r-lg">
                "{PERSONAL_INFO.lattesBio}"
                <span className="block mt-2 not-italic font-mono text-[11px] text-[#f4a7b9]">
                  — Resumo Oficial Cadastrado na Plataforma Lattes (CNPq)
                </span>
              </blockquote>
            </div>

            {/* CNPq Citations & Recognition Card */}
            <div className="p-5 rounded-xl bg-[#12141a]/60 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-xs font-mono text-zinc-400 uppercase">Citação Bibliográfica (CNPq)</div>
                  <div className="text-xs font-mono font-semibold text-zinc-200">
                    {PERSONAL_INFO.cnpqCitation}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {PERSONAL_INFO.cnpqAreas.map((area, idx) => (
                  <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-zinc-300 border border-white/5">
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Specs / Vitals Card */}
          <div className="lg:col-span-5 p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#f4a7b9]"></span>
                <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">STATUS OPERACIONAL</span>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                ACTIVE
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-zinc-500">Desenvolvedor:</span>
                <span className="text-zinc-200 font-semibold">{PERSONAL_INFO.shortName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-zinc-500">Idade / Nível:</span>
                <span className="text-zinc-200">{PERSONAL_INFO.age} Anos (Classe 2008)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-zinc-500">Origem:</span>
                <span className="text-zinc-200">{PERSONAL_INFO.location}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-zinc-500">Instituição:</span>
                <span className="text-[#f4a7b9]">IFAC Rio Branco</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-zinc-500">Papel em Extensão:</span>
                <span className="text-zinc-200">Co-coordenador Learn.with(us)</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-zinc-500">Especialidade IoT:</span>
                <span className="text-zinc-200">ESP8266 + Automação Amazônica</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-zinc-950/60 border border-white/5 text-[11px] text-zinc-400 leading-relaxed">
              💡 <strong className="text-zinc-200">Filosofia de Trabalho:</strong> "Código elegante, circuitos funcionais e conhecimento compartilhado com a comunidade."
            </div>
          </div>
        </div>

        {/* 4 Pillars Grid (Cyber-Zen Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {PHILOSOPHY_PILLARS.map((pillar) => (
            <div
              key={pillar.id}
              onMouseEnter={() => sound.playHover()}
              className="group p-5 rounded-2xl glass-panel hover:border-[#f4a7b9]/40 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 relative overflow-hidden"
            >
              {/* Vertical Japanese Kanji background */}
              <div 
                aria-hidden="true"
                className="absolute right-3 top-3 text-4xl font-bold text-white/[0.04] group-hover:text-[#f4a7b9]/10 transition-colors pointer-events-none font-mono"
              >
                {pillar.kanji}
              </div>

              <div>
                <div className="text-xs font-mono text-[#f4a7b9] uppercase tracking-wider mb-1">
                  // {pillar.kanji}
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-[#f4a7b9] transition-colors mb-1">
                  {pillar.title}
                </h3>
                <p className="text-xs font-mono text-zinc-500 mb-3">
                  {pillar.subtitle}
                </p>
                <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                  {pillar.desc}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/5">
                {pillar.techs.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800 group-hover:border-[#f4a7b9]/20"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
