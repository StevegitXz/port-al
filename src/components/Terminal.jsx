import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Sparkles, Send, CornerDownLeft, RefreshCw } from 'lucide-react';
import { PERSONAL_INFO, PROJECTS } from '../utils/data';
import { sound } from '../utils/sound';

export default function Terminal() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    { type: 'sys', text: 'SYSTEM KERNEL v4.19-ZEN INITIALIZED // STEVEGITXZ' },
    { type: 'sys', text: 'Conectado ao nó Rio Branco, AC (UTC-5).' },
    { type: 'info', text: 'Digite "help" ou clique nos atalhos abaixo para interagir.' }
  ]);
  const [matrixMode, setMatrixMode] = useState(false);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const executeCommand = (cmdText) => {
    const raw = cmdText.trim();
    if (!raw) return;

    sound.playTerminalKey();
    const command = raw.toLowerCase();

    // Add command echo to history
    const newHistory = [...history, { type: 'cmd', text: `steve@ifac-node:~$ ${raw}` }];

    switch (command) {
      case 'help':
        newHistory.push({
          type: 'res',
          text: `COMANDOS DISPONÍVEIS:
  • bio       - Exibe resumo acadêmico e biografia
  • projects  - Lista o inventário de softwares e IoT
  • mariot    - Detalhes da publicação no CSBC 2025
  • skills    - Arsenal tecnológico e competências
  • contact   - Informações de contato e repositório
  • lattes    - Dados cadastrados no CNPq
  • zen       - Pensamento de equilíbrio Cyber-Zen
  • matrix    - Ativa/desativa visual matrix
  • clear     - Limpa o buffer do terminal`
        });
        break;

      case 'bio':
        newHistory.push({
          type: 'res',
          text: `NOME: ${PERSONAL_INFO.name} (${PERSONAL_INFO.age} anos)
ORIGEM: ${PERSONAL_INFO.location}
INSTITUIÇÃO: ${PERSONAL_INFO.institution}
CURSO: ${PERSONAL_INFO.course} (${PERSONAL_INFO.period})
RESUMO: ${PERSONAL_INFO.tagline}`
        });
        break;

      case 'projects':
        newHistory.push({
          type: 'res',
          text: PROJECTS.map((p, i) => `[0${i + 1}] ${p.title} (${p.year}) -> ${p.category}`).join('\n')
        });
        break;

      case 'mariot':
        newHistory.push({
          type: 'res',
          text: `PROJETO MARIOT (Artigo no 45º CSBC / 16º WCAMA 2025):
Automação e Irrigação Inteligente com ESP8266, C++, Relés e Sensores.
Foco em sustentabilidade hídrica e monitoramento climático na Amazônia Ocidental.`
        });
        break;

      case 'skills':
        newHistory.push({
          type: 'res',
          text: `FRONT-END: React, Vite, Tailwind CSS, JavaScript ES6+, HTML5/CSS3
BACK-END: Node.js, Express, MySQL, REST APIs, Python
HARDWARE/IoT: ESP8266, C++, Arduino IDE, Sensores e Relés
DEVOPS/TOOLS: Git, GitHub, Vercel, Linux, VS Code`
        });
        break;

      case 'contact':
        newHistory.push({
          type: 'res',
          text: `E-MAIL: ${PERSONAL_INFO.email}
GITHUB: ${PERSONAL_INFO.github}
LOCAL: ${PERSONAL_INFO.location}`
        });
        break;

      case 'lattes':
        newHistory.push({
          type: 'res',
          text: `CURRÍCULO LATTES (CNPq):
Citação: ${PERSONAL_INFO.cnpqCitation}
Áreas: ${PERSONAL_INFO.cnpqAreas.join(', ')}`
        });
        break;

      case 'zen':
        newHistory.push({
          type: 'res',
          text: `調和 (Zen): "No silêncio do circuito e no fluir do código, a complexidade se dissolve na clareza da solução."`
        });
        break;

      case 'matrix':
        setMatrixMode(!matrixMode);
        newHistory.push({
          type: 'res',
          text: `[!] Modo visual Matrix ${!matrixMode ? 'ATIVADO' : 'DESATIVADO'}.`
        });
        break;

      case 'clear':
        setHistory([]);
        setInput('');
        return;

      default:
        newHistory.push({
          type: 'err',
          text: `Comando não reconhecido: "${raw}". Digite "help" para lista de opções.`
        });
    }

    setHistory(newHistory);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      executeCommand(input);
    } else {
      sound.playTerminalKey();
    }
  };

  const quickChips = ['help', 'bio', 'projects', 'mariot', 'skills', 'contact', 'zen', 'clear'];

  return (
    <section id="terminal" className="relative py-24 px-4 bg-[#09090b] border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-start mb-10">
          <div className="flex items-center gap-2 text-xs font-mono text-[#f4a7b9] tracking-widest uppercase mb-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#f4a7b9] animate-pulse"></span>
            <span>// 05. TERMINAL DE ACESSO DIRETO</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black uppercase text-white font-['Space_Grotesk'] tracking-tight">
            Console Interativo
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1">
            Consulte o sistema diretamente pela linha de comando em tempo real.
          </p>
        </div>

        {/* Terminal Window */}
        <div className={`rounded-2xl border ${matrixMode ? 'border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.2)]' : 'border-[#f4a7b9]/25 shadow-2xl'} bg-[#0a0c10] overflow-hidden transition-all duration-300`}>
          {/* Terminal Title Bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#12141a] border-b border-white/5">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
              <span className="ml-2 text-xs font-mono text-zinc-400 hidden sm:inline">
                steve@neo-tokyo-ifac:~ (zsh)
              </span>
            </div>

            <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500">
              <span>UTF-8</span>
              <span>•</span>
              <span className={matrixMode ? 'text-emerald-400' : 'text-[#f4a7b9]'}>
                {matrixMode ? 'MATRIX: ON' : 'CYBER-ZEN'}
              </span>
            </div>
          </div>

          {/* Terminal Screen & Logs */}
          <div 
            onClick={() => inputRef.current?.focus()}
            className="p-5 font-mono text-xs sm:text-sm min-h-[320px] max-h-[440px] overflow-y-auto space-y-3 cursor-text"
          >
            {history.map((line, idx) => (
              <div key={idx} className="leading-relaxed">
                {line.type === 'sys' && (
                  <span className="text-zinc-500">// {line.text}</span>
                )}
                {line.type === 'info' && (
                  <span className="text-[#f4a7b9] font-medium">{line.text}</span>
                )}
                {line.type === 'cmd' && (
                  <span className="text-zinc-300 font-semibold">{line.text}</span>
                )}
                {line.type === 'res' && (
                  <pre className={`whitespace-pre-wrap ${matrixMode ? 'text-emerald-400' : 'text-zinc-300'}`}>
                    {line.text}
                  </pre>
                )}
                {line.type === 'err' && (
                  <span className="text-red-400">{line.text}</span>
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Terminal Prompt Input */}
          <div className="px-4 py-3 bg-[#0d0f14] border-t border-white/5 flex items-center gap-2 font-mono text-xs sm:text-sm">
            <span className={matrixMode ? 'text-emerald-400 font-bold' : 'text-[#f4a7b9] font-bold'}>
              steve@ifac:~$
            </span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="digite um comando (ex: help)..."
              className="flex-1 bg-transparent text-white outline-none placeholder-zinc-600 font-mono text-xs sm:text-sm"
            />
            <button
              type="button"
              onClick={() => executeCommand(input)}
              className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700"
              title="Executar comando"
            >
              <CornerDownLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quick Command Chips */}
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <span className="text-xs font-mono text-zinc-500">Atalhos rápidos:</span>
          {quickChips.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => executeCommand(chip)}
              className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400 hover:text-[#f4a7b9] hover:border-[#f4a7b9]/40 transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
