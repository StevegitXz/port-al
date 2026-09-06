import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Copy, Check, ArrowDown, ExternalLink, Sparkles, Code2 } from 'lucide-react';
import SakuraCanvas from './SakuraCanvas';
import ScrambleText from './ScrambleText';
import { PERSONAL_INFO, METRICS } from '../utils/data';
import { sound } from '../utils/sound';
import { achievementManager } from '../utils/achievements';

export default function Hero() {
  const [copied, setCopied] = useState(false);
  const [slashed, setSlashed] = useState(false);
  const lastSlashRef = useRef(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      achievementManager.unlock('first_contact');
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleKatanaSlash = () => {
    const now = Date.now();
    if (slashed || now - lastSlashRef.current < 1200) return;
    lastSlashRef.current = now;
    setSlashed(true);
    sound.playKatanaSlash();
    setTimeout(() => setSlashed(false), 700);
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PERSONAL_INFO.email);
      setCopied(true);
      sound.playSuccess();
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      // Fallback
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-center items-center px-4 pt-24 pb-16 overflow-hidden bg-[#fafbfc] bg-cyber-grid">
      {/* Background Interactive Sakura Particle Canvas */}
      <SakuraCanvas />

      {/* Subtle Japanese Kanji Watermarks */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute left-6 md:left-14 top-1/4 select-none text-[8rem] md:text-[14rem] font-bold text-zinc-900/[0.035] writing-mode-vertical"
      >
        創造
      </div>
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute right-6 md:right-14 bottom-1/4 select-none text-[8rem] md:text-[14rem] font-bold text-zinc-900/[0.035] writing-mode-vertical"
      >
        開発
      </div>

      {/* Ambient Soft Rose & Sky Glows */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-rose-400/10 blur-[130px] rounded-full"></div>
      <div className="pointer-events-none absolute -bottom-32 left-1/3 w-[500px] h-[350px] bg-emerald-500/5 blur-[120px] rounded-full"></div>

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center text-center">
        {/* Top Status & Hanko Stamp Strip */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          {/* Status HUD Pill */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/90 border border-zinc-200/90 backdrop-blur-md shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
            </span>
            <span className="text-xs font-mono text-zinc-700">
              <strong className="text-emerald-700 font-semibold">DISPONÍVEL</strong> • {PERSONAL_INFO.location}
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200">
              UTC-5
            </span>
          </div>

          {/* Traditional Hanko Artisan Seal Stamp [ 創 ] */}
          <div 
            onMouseEnter={() => sound.playHover()}
            className="group/stamp inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50/90 border border-rose-200 text-rose-700 shadow-2xs hover:scale-105 transition-all cursor-default"
            title="Selo de Artesão Digital // 創造 (Criação)"
          >
            <span className="w-5 h-5 rounded-md border border-rose-500/80 flex items-center justify-center font-serif text-[11px] font-bold text-rose-600 bg-white select-none shadow-2xs group-hover/stamp:rotate-6 transition-transform">
              創
            </span>
            <span className="text-[10px] font-mono tracking-wider font-bold text-rose-800">
              ARTISAN_CODE
            </span>
          </div>
        </div>

        {/* Cyber Moniker Badge */}
        <div className="flex items-center gap-2 text-xs font-mono text-rose-600 tracking-widest uppercase mb-3 font-semibold">
          <span>// DISCENTE & PESQUISADOR IFAC</span>
          <span className="text-zinc-300">•</span>
          <span className="text-zinc-500">HANDLE: @{PERSONAL_INFO.handle}</span>
        </div>

        {/* Main Heading with Interactive Katana Slash Light Beam */}
        <div className="relative inline-block my-2">
          <h1 
            onMouseEnter={handleKatanaSlash}
            className={`relative inline-block cursor-pointer select-none text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight uppercase text-zinc-950 font-['Space_Grotesk'] leading-[1.05] overflow-hidden p-2 rounded-2xl ${
              slashed ? 'katana-slashed' : ''
            }`}
            title="Passe o cursor para ativar o corte de luz Katana"
          >
            Estevão{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 via-rose-600 to-zinc-900">
              Emanuel
            </span>
            {/* Katana Slash Light Blade */}
            <span className="katana-slash-beam" />
          </h1>
        </div>

        {/* Subtitle / Role with ScrambleText */}
        <p className="text-lg sm:text-2xl font-mono text-zinc-800 font-medium max-w-2xl mx-auto mb-5 tracking-tight">
          <span className="text-rose-500 font-bold">&lt;</span>
          <ScrambleText
            text="Full Stack Developer & Creative Technologist"
            className="text-zinc-800"
          />
          <span className="text-rose-500 font-bold"> /&gt;</span>
        </p>

        {/* Bio summary paragraph */}
        <p className="text-sm sm:text-base text-zinc-600 max-w-2xl mx-auto mb-9 font-normal leading-relaxed">
          Desenvolvendo aplicações web completas do front-end reativo ao backend relacional, integrando sistemas embarcados e Internet das Coisas (IoT) na Amazônia Ocidental.
        </p>

        {/* Call to Actions (CTAs) */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 mb-14">
          <a
            href="#projects"
            onClick={() => sound.playSelect()}
            onMouseEnter={() => sound.playHover()}
            className="group relative inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-rose-500 text-white font-mono font-semibold text-sm hover:bg-rose-600 transition-all duration-300 shadow-md shadow-rose-500/25 active:scale-95"
          >
            <span>Ver Inventário de Projetos</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </a>

          <button
            type="button"
            onClick={handleCopyEmail}
            onMouseEnter={() => sound.playHover()}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl glass-panel bg-white/90 border-zinc-200 text-zinc-800 hover:text-rose-600 hover:border-rose-300 font-mono text-sm shadow-xs transition-all duration-300 active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">E-mail Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-zinc-400" />
                <span>Copiar E-mail</span>
              </>
            )}
          </button>

          <a
            href={PERSONAL_INFO.github}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sound.playClick()}
            onMouseEnter={() => sound.playHover()}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white border border-zinc-200 text-zinc-700 hover:text-zinc-950 font-mono text-sm hover:border-zinc-300 shadow-xs transition-all active:scale-95"
          >
            <ExternalLink className="w-4 h-4" />
            <span>GitHub</span>
          </a>
        </div>

        {/* Dispersed Constellation Metrics with 3D Tactile Tilt */}
        <div className="w-full max-w-5xl grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-4 mb-10">
          {METRICS.map((item, idx) => {
            const offsets = [
              'lg:-translate-y-2',
              'lg:translate-y-3',
              'lg:-translate-y-1',
              'lg:translate-y-4'
            ];
            const tags = ['// SYS_SOFTWARE', '// SBC_ACADEMIC', '// IFAC_TUTORING', '// TECH_HOURS'];

            return (
              <HeroMetricCard
                key={idx}
                item={item}
                offset={offsets[idx] || ''}
                tag={tags[idx] || '// METRIC'}
              />
            );
          })}
        </div>
      </div>

      {/* Down Scroll Indicator */}
      <a 
        href="#about"
        onClick={() => sound.playClick()}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-zinc-400 hover:text-rose-600 transition-colors"
        aria-label="Rolar para a seção sobre"
      >
        <span className="text-[10px] font-mono uppercase tracking-widest">Rolar</span>
        <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
      </a>
    </section>
  );
}

// 3D Perspective Tilt Card Component
function HeroMetricCard({ item, offset, tag }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTilt({
      x: -((y / (rect.height / 2)) * 12),
      y: (x / (rect.width / 2)) * 12,
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

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
          ? `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.04, 1.04, 1.04)` 
          : undefined,
        transition: isHovered ? 'transform 80ms ease-out' : 'transform 400ms ease-out',
      }}
      className={`group relative p-5 sm:p-6 rounded-3xl glass-panel bg-white/95 border border-zinc-200/80 hover:border-rose-300 flex flex-col justify-between text-left shadow-xs hover:shadow-2xl ${offset} overflow-hidden will-change-transform`}
    >
      {/* Micro accent glow & light refraction */}
      <div className="pointer-events-none absolute -top-8 -right-8 w-24 h-24 bg-rose-200/25 rounded-full blur-xl group-hover:scale-150 transition-transform duration-300"></div>

      <div>
        <div className="flex items-center justify-between gap-1 mb-2">
          <span className="text-[10px] font-mono text-rose-600 font-semibold tracking-wider">
            {tag}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500/80 animate-pulse"></span>
        </div>
        <div className="text-3xl sm:text-4xl font-black font-['Space_Grotesk'] text-zinc-950 group-hover:text-rose-600 transition-colors">
          {item.value}
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-zinc-100">
        <div className="text-xs font-bold text-zinc-800 leading-tight">
          {item.label}
        </div>
        <div className="text-[11px] font-mono text-zinc-500 mt-0.5">
          {item.detail}
        </div>
      </div>
    </div>
  );
}

