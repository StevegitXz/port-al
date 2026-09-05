import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Menu, X, Terminal, Cpu } from 'lucide-react';
import GithubIcon from './GithubIcon';
import { sound } from '../utils/sound';
import { achievementManager } from '../utils/achievements';
import { PERSONAL_INFO } from '../utils/data';

export default function Navbar() {
  const [isMuted, setIsMuted] = useState(sound.isMuted());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSound = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    sound.setMuted(nextMute);
    if (!nextMute) {
      sound.playSuccess();
      achievementManager.unlock('audio_master');
    }
  };


  const navLinks = [
    { label: '01. Início', href: '#hero' },
    { label: '02. Sobre', href: '#about' },
    { label: '03. Projetos', href: '#projects' },
    { label: '04. Arsenal', href: '#arsenal' },
    { label: '05. Trajetória', href: '#timeline' },
    { label: '06. Terminal', href: '#terminal' }
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-8 py-3 ${
        scrolled 
          ? 'bg-[#09090b]/85 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/40' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand / Logo */}
        <a 
          href="#hero"
          onClick={() => sound.playClick()}
          onMouseEnter={() => sound.playHover()}
          className="group flex items-center gap-2.5 font-mono text-sm tracking-wide text-zinc-100"
        >
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#f4a7b9]/10 border border-[#f4a7b9]/30 text-[#f4a7b9] font-bold group-hover:border-[#f4a7b9] group-hover:shadow-[0_0_12px_rgba(244,167,185,0.4)] transition-all">
            S
          </span>
          <div className="flex flex-col leading-tight">
            <span className="font-bold tracking-tight text-white group-hover:text-[#f4a7b9] transition-colors">
              {PERSONAL_INFO.handle}
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">
              // 創造 • Cyber-Zen
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#12141a]/70 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-md">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => sound.playClick()}
              onMouseEnter={() => sound.playHover()}
              className="px-3 py-1 text-xs font-mono text-zinc-400 hover:text-[#f4a7b9] hover:bg-white/5 rounded-full transition-all"
            >
              <span className="text-[#f4a7b9]/60 font-semibold">// </span>
              {link.label.split('. ')[1]}
            </a>
          ))}
        </nav>

        {/* Right Controls: Live Status, Audio SFX, GitHub */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Status Indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-[11px] font-mono text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="tracking-wider uppercase">Online</span>
          </div>

          {/* Sound FX Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            title={isMuted ? 'Ativar Efeitos Sonoros' : 'Silenciar Efeitos Sonoros'}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-all ${
              isMuted
                ? 'bg-zinc-900/80 border-zinc-800 text-zinc-500 hover:text-zinc-300'
                : 'bg-[#f4a7b9]/10 border-[#f4a7b9]/30 text-[#f4a7b9] hover:border-[#f4a7b9] shadow-[0_0_10px_rgba(244,167,185,0.2)]'
            }`}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline text-[10px]">SFX</span>
          </button>

          {/* GitHub Link */}
          <a
            href={PERSONAL_INFO.github}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sound.playClick()}
            onMouseEnter={() => sound.playHover()}
            title="Acessar Perfil no GitHub"
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-900/80 border border-zinc-700/60 text-zinc-300 hover:text-[#f4a7b9] hover:border-[#f4a7b9]/50 transition-all"
          >
            <GithubIcon className="w-4 h-4" />
          </a>


          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-900/80 border border-zinc-800 text-zinc-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 rounded-2xl glass-panel p-4 border border-zinc-800 animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => {
                  sound.playClick();
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-2 text-sm font-mono text-zinc-300 hover:text-[#f4a7b9] hover:bg-white/5 rounded-lg transition-colors flex items-center justify-between"
              >
                <span>{link.label}</span>
                <span className="text-zinc-600 text-xs">→</span>
              </a>
            ))}
            <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-400">
              <span>Status Sistema</span>
              <span className="text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                ONLINE // IFAC
              </span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
