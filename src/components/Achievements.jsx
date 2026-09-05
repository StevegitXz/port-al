import React, { useState, useEffect } from 'react';
import { Trophy, Sparkles, Cpu, Terminal, Award, Volume2, X, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { achievementManager, ACHIEVEMENTS_LIST } from '../utils/achievements';
import { sound } from '../utils/sound';

export default function Achievements() {
  const [currentNotification, setCurrentNotification] = useState(null);
  const [isTrayOpen, setIsTrayOpen] = useState(false);
  const [unlockedIds, setUnlockedIds] = useState([]);

  useEffect(() => {
    // Initial sync
    setUnlockedIds(ACHIEVEMENTS_LIST.filter(a => achievementManager.isUnlocked(a.id)).map(a => a.id));

    const unsubscribe = achievementManager.subscribe((achievement) => {
      setCurrentNotification(achievement);
      setUnlockedIds(ACHIEVEMENTS_LIST.filter(a => achievementManager.isUnlocked(a.id)).map(a => a.id));

      // Trigger confetti if all completed
      if (achievementManager.getUnlockedCount() === ACHIEVEMENTS_LIST.length) {
        try {
          confetti({
            particleCount: 70,
            spread: 90,
            origin: { y: 0.8 },
            colors: ['#f4a7b9', '#10b981', '#fbbf24', '#ffffff']
          });
        } catch (e) {}
      }

      // Auto dismiss banner after 5s
      const timer = setTimeout(() => {
        setCurrentNotification(null);
      }, 5000);

      return () => clearTimeout(timer);
    });

    return unsubscribe;
  }, []);

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className="w-4 h-4 text-amber-400" />;
      case 'Cpu':
        return <Cpu className="w-4 h-4 text-emerald-400" />;
      case 'Terminal':
        return <Terminal className="w-4 h-4 text-cyan-400" />;
      case 'Award':
        return <Award className="w-4 h-4 text-[#f4a7b9]" />;
      case 'Volume2':
        return <Volume2 className="w-4 h-4 text-purple-400" />;
      default:
        return <Trophy className="w-4 h-4 text-amber-400" />;
    }
  };

  const unlockedCount = unlockedIds.length;
  const totalCount = ACHIEVEMENTS_LIST.length;

  return (
    <>
      {/* Toast Notification for newly unlocked achievement */}
      {currentNotification && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300 max-w-sm">
          <div className="rounded-2xl glass-panel p-4 border border-[#f4a7b9]/50 bg-[#0e1017]/95 shadow-2xl shadow-black/80 flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-amber-400/10 border border-amber-400/30 shrink-0">
              <Trophy className="w-5 h-5 text-amber-400 animate-bounce" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#f4a7b9] font-bold">
                  // CONQUISTA DESBLOQUEADA
                </span>
                <span className="text-[10px] font-mono text-zinc-500">
                  {unlockedCount}/{totalCount}
                </span>
              </div>

              <h4 className="text-sm font-bold text-white font-['Space_Grotesk'] mt-0.5">
                {currentNotification.title}
              </h4>
              <p className="text-xs text-zinc-400 mt-0.5 leading-tight">
                {currentNotification.desc}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setCurrentNotification(null)}
              className="text-zinc-500 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Persistent Tiny HUD Badge trigger in bottom-left */}
      <div className="fixed bottom-4 left-4 z-40">
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            setIsTrayOpen(!isTrayOpen);
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-950/80 border border-white/10 hover:border-[#f4a7b9]/40 text-xs font-mono text-zinc-300 backdrop-blur-md transition-all hover:scale-105 active:scale-95 shadow-lg"
          title="Ver Conquistas da Exploração"
        >
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span>{unlockedCount}/{totalCount} Conquistas</span>
        </button>

        {/* Modal / Tray displaying all achievements */}
        {isTrayOpen && (
          <div className="absolute bottom-12 left-0 w-80 rounded-2xl glass-panel p-4 border border-white/15 bg-[#0b0d13]/95 shadow-2xl backdrop-blur-xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Explorador do Sistema
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsTrayOpen(false)}
                className="text-zinc-500 hover:text-white p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {ACHIEVEMENTS_LIST.map((ach) => {
                const isDone = unlockedIds.includes(ach.id);
                return (
                  <div
                    key={ach.id}
                    className={`p-2.5 rounded-xl border transition-all flex items-start gap-2.5 ${
                      isDone
                        ? 'bg-zinc-900/90 border-[#f4a7b9]/30 text-zinc-200'
                        : 'bg-zinc-950/40 border-white/5 opacity-50 text-zinc-500'
                    }`}
                  >
                    <div className="p-1.5 rounded-lg bg-zinc-950 border border-white/10 shrink-0 mt-0.5">
                      {getIcon(ach.icon)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-bold text-white truncate font-['Space_Grotesk']">
                          {ach.title}
                        </h5>
                        {isDone && <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />}
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug">
                        {ach.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-3 pt-2 border-t border-white/10 text-[10px] font-mono text-zinc-500 text-center">
              // Explore o terminal, áudio e simulador IoT para desbloquear tudo!
            </div>
          </div>
        )}
      </div>
    </>
  );
}
