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
          <div className="rounded-2xl glass-panel p-4 border border-rose-200 bg-white/95 shadow-xl shadow-zinc-200/60 flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 shrink-0">
              <Trophy className="w-5 h-5 text-amber-500 animate-bounce" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-rose-600 font-bold">
                  // CONQUISTA DESBLOQUEADA
                </span>
                <span className="text-[10px] font-mono text-zinc-400">
                  {unlockedCount}/{totalCount}
                </span>
              </div>

              <h4 className="text-sm font-bold text-zinc-950 font-['Space_Grotesk'] mt-0.5">
                {currentNotification.title}
              </h4>
              <p className="text-xs text-zinc-600 mt-0.5 leading-tight">
                {currentNotification.desc}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setCurrentNotification(null)}
              className="text-zinc-400 hover:text-zinc-700 p-1 transition-colors"
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
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 border border-zinc-200 hover:border-rose-300 text-xs font-mono text-zinc-800 backdrop-blur-md transition-all hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
          title="Ver Conquistas da Exploração"
        >
          <Trophy className="w-3.5 h-3.5 text-amber-500" />
          <span className="font-semibold">{unlockedCount}/{totalCount} Conquistas</span>
        </button>

        {/* Modal / Tray displaying all achievements */}
        {isTrayOpen && (
          <div className="absolute bottom-12 left-0 w-80 rounded-2xl glass-panel p-4 border border-zinc-200 bg-white/98 shadow-2xl backdrop-blur-xl animate-in zoom-in-95 duration-200 text-zinc-900">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-mono font-bold text-zinc-900 uppercase tracking-wider">
                  Explorador do Sistema
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsTrayOpen(false)}
                className="text-zinc-400 hover:text-zinc-700 p-1 transition-colors"
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
                        ? 'bg-rose-50/50 border-rose-200 text-zinc-900'
                        : 'bg-zinc-50 border-zinc-200/60 opacity-60 text-zinc-400'
                    }`}
                  >
                    <div className="p-1.5 rounded-lg bg-white border border-zinc-200 shrink-0 mt-0.5 shadow-2xs">
                      {getIcon(ach.icon)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-bold text-zinc-900 truncate font-['Space_Grotesk']">
                          {ach.title}
                        </h5>
                        {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                      </div>
                      <p className="text-[11px] text-zinc-600 mt-0.5 leading-snug">
                        {ach.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-3 pt-2 border-t border-zinc-100 text-[10px] font-mono text-zinc-400 text-center">
              // Explore os projetos, terminal e áudio para desbloquear tudo!
            </div>
          </div>
        )}
      </div>
    </>
  );
}
