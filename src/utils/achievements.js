import { sound } from './sound';

export const ACHIEVEMENTS_LIST = [
  {
    id: 'first_contact',
    title: 'Primeiro Contato',
    desc: 'Explorou a introdução e iniciou o portfólio.',
    icon: 'Sparkles'
  },
  {
    id: 'iot_engineer',
    title: 'Engenheiro de Hardware',
    desc: 'Inspecionou os circuitos eletrônicos e microcontroladores do MARIOT.',
    icon: 'Cpu'
  },
  {
    id: 'terminal_hacker',
    title: 'Hacker do Terminal',
    desc: 'Executou um comando no console interativo.',
    icon: 'Terminal'
  },
  {
    id: 'sbc_scholar',
    title: 'Pesquisador da Amazônia',
    desc: 'Inspecionou os detalhes do artigo publicado no CSBC 2025.',
    icon: 'Award'
  },
  {
    id: 'audio_master',
    title: 'Mestre do Áudio',
    desc: 'Ativou o sintetizador procedural Web Audio API.',
    icon: 'Volume2'
  }
];

class AchievementManager {
  constructor() {
    this.listeners = [];
    this.unlocked = new Set();

    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('steve_achievements');
        if (saved) {
          this.unlocked = new Set(JSON.parse(saved));
        }
      } catch (e) {}
    }
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  notify(achievement) {
    this.listeners.forEach((listener) => listener(achievement));
  }

  unlock(id) {
    if (this.unlocked.has(id)) return;
    const achievement = ACHIEVEMENTS_LIST.find((a) => a.id === id);
    if (!achievement) return;

    this.unlocked.add(id);
    try {
      localStorage.setItem('steve_achievements', JSON.stringify([...this.unlocked]));
    } catch (e) {}

    sound.playAchievement();
    this.notify(achievement);
  }

  isUnlocked(id) {
    return this.unlocked.has(id);
  }

  getUnlockedCount() {
    return this.unlocked.size;
  }

  getTotalCount() {
    return ACHIEVEMENTS_LIST.length;
  }
}

export const achievementManager = new AchievementManager();
