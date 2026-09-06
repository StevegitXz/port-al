import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Sparkles, Send, CornerDownLeft, RefreshCw, Box, Monitor } from 'lucide-react';
import { PERSONAL_INFO, PROJECTS } from '../utils/data';
import { sound } from '../utils/sound';
import { achievementManager } from '../utils/achievements';
import RetroCrtMonitor3D from './3d/RetroCrtMonitor3D';
import RetroKeyboard3D from './3d/RetroKeyboard3D';

export default function Terminal() {
  const [input, setInput] = useState('');
  const [viewMode, setViewMode] = useState('3d'); // '3d' | 'classic'
  const [history, setHistory] = useState([
    { type: 'sys', text: 'SYSTEM KERNEL v4.19-ZEN INITIALIZED // STEVEGITXZ' },
    { type: 'sys', text: 'Conectado ao nó Rio Branco, AC (UTC-5).' },
    { type: 'info', text: 'Digite "help" ou clique nos atalhos ao lado para interagir.' }
  ]);
  const [matrixMode, setMatrixMode] = useState(false);

  const terminalBodyRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [history]);

  const executeCommand = (cmdText) => {
    const raw = cmdText.trim();
    if (!raw) return;

    sound.playMechanicalKey();
    achievementManager.unlock('terminal_hacker');
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
  • weather   - Telemetria meteorológica de Rio Branco (Amazônia)
  • game      - Desafio interativo Cyber-Zen & Hacker
  • sudo      - Solicitação de permissão de superusuário
  • matrix    - Alterna tema visual Matrix Green
  • contact   - Informações de contato e repositório
  • lattes    - Dados cadastrados no CNPq
  • zen       - Pensamento de equilíbrio Cyber-Zen
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

      case 'weather':
        newHistory.push({
          type: 'res',
          text: `[ESTAÇÃO METEOROLÓGICA // IFAC RIO BRANCO - AC]
📍 COORDENADAS: 09°58'29"S 67°48'36"W (Amazônia Ocidental)
🌡️ TEMPERATURA: 31.8 °C (Sensação Térmica: 36.2 °C)
💧 UMIDADE RELATIVA: 82% (Microclima Úmido Equatorial)
🌧️ PRECIPITAÇÃO: Probabilidade de pancadas tropicais vespertinas
📡 HARDWARE NÓ 01: ESP8266 + Sensor DHT22 + Higrômetro Analógico [ONLINE]
🌱 SISTEMA MARIOT: Solo hidratado (78%) - Válvulas de irrigação em stand-by.`
        });
        break;

      case 'game':
        newHistory.push({
          type: 'res',
          text: `[DESAFIO CYBER-ZEN // TESTE DE ARQUITETURA]
Questão: Qual dos seguintes pinos do ESP-12F deve ser mantido em nível ALTO (HIGH) durante o boot normal?
  [A] GPIO15
  [B] GPIO0
  [C] GPIO2
  [D] ADC0

💡 Dica de Hardware: Durante o boot, GPIO0 em HIGH entra no modo execução da memória Flash SPI!`
        });
        break;

      case 'sudo':
        sound.playAchievement();
        newHistory.push({
          type: 'res',
          text: `[AUTH SUCCESSFUL] UID 0 (root) concedido para @stevegitxz.
> Kernel: Linux neo-tokyo-ifac 6.8.0-zen-rt #1 PREEMPT_DYNAMIC
> Status: Superusuário verificado com chave ed25519.
> Privilégios: Acesso completo ao hardware embarcado e compilador web.
"Na dúvida, 'sudo rm -rf /' nunca é a resposta correta."`
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
        setMatrixMode((prev) => !prev);
        newHistory.push({
          type: 'res',
          text: `[!] Tema visual Matrix ${!matrixMode ? 'ATIVADO (Green Phosphor)' : 'DESATIVADO (Cyber-Zen)'}.`
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
      sound.playMechanicalKey();
    }
  };

  const commandList = [
    { cmd: 'help', desc: 'Lista geral de comandos' },
    { cmd: 'projects', desc: 'Inventário de projetos' },
    { cmd: 'mariot', desc: 'Artigo CSBC 2025' },
    { cmd: 'skills', desc: 'Pilha tecnológica' },
    { cmd: 'weather', desc: 'Telemetria Rio Branco' },
    { cmd: 'game', desc: 'Desafio hacker de IoT' },
    { cmd: 'sudo', desc: 'Modo superusuário root' },
    { cmd: 'matrix', desc: 'Alternar tema Matrix' },
    { cmd: 'clear', desc: 'Limpar console' },
  ];

  return (
    <section id="terminal" className="relative py-24 px-4 bg-[#fafbfc] bg-cyber-grid border-t border-zinc-200/80 overflow-hidden">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-rose-200/25 blur-[150px] rounded-full"></div>
      <div className="pointer-events-none absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-emerald-200/20 blur-[140px] rounded-full"></div>

      <div className="max-w-6xl mx-auto">
        {/* Header (Centered) */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="flex items-center gap-2 text-xs font-mono text-rose-600 tracking-widest uppercase mb-2 font-semibold">
            <span className="inline-block w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            <span>// 05. TERMINAL DE ACESSO DIRETO</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-zinc-950 font-['Space_Grotesk'] tracking-tight">
            Console Interativo Retrô 3D
          </h2>
          <p className="text-zinc-600 text-sm sm:text-base max-w-2xl mt-2 font-normal">
            Estação vintage com monitor CRT de caixa e teclado mecânico físico. Digite no seu teclado para ver as teclas 3D contraírem e o texto surgir diretamente no vidro de fósforo.
          </p>
        </div>

        {/* Centered Controls Bar (View Mode & CRT Phosphor) */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-zinc-200/80 border border-zinc-300/80 shadow-2xs">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setViewMode('3d');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                viewMode === '3d'
                  ? 'bg-zinc-900 text-white shadow-md'
                  : 'text-zinc-600 hover:text-zinc-950 hover:bg-white/60'
              }`}
            >
              <Box className="w-3.5 h-3.5 text-rose-500" />
              <span>ESTAÇÃO 3D RETRÔ CRT</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setViewMode('classic');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                viewMode === 'classic'
                  ? 'bg-zinc-900 text-white shadow-md'
                  : 'text-zinc-600 hover:text-zinc-950 hover:bg-white/60'
              }`}
            >
              <Monitor className="w-3.5 h-3.5 text-emerald-500" />
              <span>CONSOLE PLANO</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setMatrixMode(!matrixMode);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold border transition-all cursor-pointer ${
                matrixMode
                  ? 'bg-emerald-500/20 text-emerald-800 border-emerald-500/50'
                  : 'bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-50'
              }`}
            >
              FÓSFORO: {matrixMode ? 'VERDE MATRIX' : 'CYBER-ZEN'}
            </button>
          </div>
        </div>

        {/* Center Stage: 3D Workstation (No Delimiting Cards) OR Classic Window */}
        <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
          {viewMode === '3d' ? (
            <div className="w-full flex flex-col items-center gap-1 sm:gap-3">
              {/* 1. RETRO CRT BOX COMPUTER (O MONITOR DE CAIXA RETRÔ) */}
              <RetroCrtMonitor3D
                history={history}
                input={input}
                matrixMode={matrixMode}
              />

              {/* 2. DEDICATED MECHANICAL KEYBOARD (100% VISIBLE KEYS & PHYSICAL CONTRACTION) */}
              <RetroKeyboard3D
                input={input}
                setInput={setInput}
                onExecuteCommand={executeCommand}
                matrixMode={matrixMode}
              />
            </div>
          ) : (
            <div className={`w-full max-w-3xl mx-auto rounded-3xl border ${matrixMode ? 'border-emerald-500/60 shadow-[0_0_50px_rgba(16,185,129,0.25)]' : 'border-zinc-300/90 shadow-2xl'} bg-[#0c0e14] overflow-hidden transition-all duration-300`}>
              {/* Terminal Title Bar */}
              <div className="flex items-center justify-between px-5 py-3.5 bg-[#161922] border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/90"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-400/90"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500/90"></span>
                  <span className="ml-2.5 text-xs font-mono text-zinc-400 hidden sm:inline">
                    steve@neo-tokyo-ifac:~ (zsh)
                  </span>
                </div>

                <div className="flex items-center gap-2.5 text-[10px] font-mono text-zinc-400">
                  <span className="text-zinc-500">UTF-8</span>
                </div>
              </div>

              {/* Terminal Screen & Logs */}
              <div 
                ref={terminalBodyRef}
                onClick={() => inputRef.current?.focus()}
                className="p-6 font-mono text-xs sm:text-sm min-h-[350px] max-h-[460px] overflow-y-auto space-y-3 cursor-text text-zinc-200"
              >
                {history.map((line, idx) => (
                  <div key={idx} className="leading-relaxed">
                    {line.type === 'sys' && (
                      <span className="text-zinc-500">// {line.text}</span>
                    )}
                    {line.type === 'info' && (
                      <span className="text-rose-400 font-medium">{line.text}</span>
                    )}
                    {line.type === 'cmd' && (
                      <span className="text-zinc-100 font-semibold">{line.text}</span>
                    )}
                    {line.type === 'res' && (
                      <pre className={`whitespace-pre-wrap ${matrixMode ? 'text-emerald-400' : 'text-zinc-200'}`}>
                        {line.text}
                      </pre>
                    )}
                    {line.type === 'err' && (
                      <span className="text-red-400">{line.text}</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Terminal Prompt Input */}
              <div className="px-5 py-3.5 bg-[#11141c] border-t border-zinc-800 flex items-center gap-2.5 font-mono text-xs sm:text-sm">
                <span className={matrixMode ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                  steve@ifac:~$
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="digite um comando (ex: help)..."
                  className="flex-1 bg-transparent text-white outline-none placeholder-zinc-500 font-mono text-xs sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => executeCommand(input)}
                  className="p-1.5 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors cursor-pointer"
                  title="Executar comando"
                >
                  <CornerDownLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Quick Command Chips Palette (Centered) */}
          <div className="w-full max-w-4xl mx-auto mt-6 flex flex-wrap items-center justify-center gap-2 px-4">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mr-1">
              Comandos Rápidos:
            </span>
            {commandList.map((item) => (
              <button
                key={item.cmd}
                type="button"
                onClick={() => executeCommand(item.cmd)}
                onMouseEnter={() => sound.playHover()}
                className="px-3 py-1.5 rounded-xl bg-white/90 hover:bg-rose-50 border border-zinc-200/80 hover:border-rose-300 text-xs font-mono font-medium transition-all shadow-2xs group flex items-center gap-1.5 cursor-pointer"
                title={item.desc}
              >
                <span className="font-bold text-rose-600 group-hover:text-rose-700">${item.cmd}</span>
                <span className="text-[10px] text-zinc-400 group-hover:text-zinc-600 hidden sm:inline">
                  // {item.desc}
                </span>
              </button>
            ))}
          </div>

          {/* Live Node Telemetry Strip (Centered Horizontal Bar) */}
          <div className="w-full max-w-3xl mx-auto mt-6 p-3 px-5 rounded-2xl bg-white/85 backdrop-blur-md border border-zinc-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-zinc-500">Nó:</span>
              <span className="font-semibold text-zinc-800">IFAC Campus Rio Branco</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-zinc-500">Fuso:</span>
              <span className="text-zinc-800">UTC-5 (Acre)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-zinc-500">Núcleo:</span>
              <span className="font-semibold text-rose-600">v4.19-Zen (C++ / JS)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-zinc-500">Status:</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px]">
                ONLINE
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
