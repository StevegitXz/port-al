import React, { useEffect } from 'react';
import Lenis from 'lenis';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Arsenal from './components/Arsenal';
import Timeline from './components/Timeline';
import Terminal from './components/Terminal';
import Footer from './components/Footer';

export default function App() {
  useEffect(() => {
    // Prevent browser from restoring scroll position to bottom or previous state on reload
    if (typeof window !== 'undefined') {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }
      window.scrollTo(0, 0);
    }

    // Initialize buttery smooth scrolling via Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    lenis.scrollTo(0, { immediate: true });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);


  return (
    <div className="relative min-h-screen bg-[#09090b] text-zinc-100 selection:bg-[#f4a7b9]/25 selection:text-[#f4a7b9]">
      {/* Subtle CRT/Cyber scanline overlay */}
      <div className="fixed inset-0 scanlines pointer-events-none z-30 opacity-30" />

      {/* Main HUD Navigation Bar */}
      <Navbar />

      {/* Main Page Flow */}
      <main className="relative z-10 flex flex-col">
        {/* Section A: The Hero (Interactive Entry) */}
        <Hero />

        {/* Section B: Lore & Philosophy */}
        <About />

        {/* Section C: Project Showcase (Inventory & Stage Select) */}
        <Projects />

        {/* Section D: The Tech Arsenal */}
        <Arsenal />

        {/* Section E: Milestones & Scientific Timeline */}
        <Timeline />

        {/* Section F: Interactive Cyber Terminal */}
        <Terminal />
      </main>

      {/* Dock Footer */}
      <Footer />
    </div>
  );
}
