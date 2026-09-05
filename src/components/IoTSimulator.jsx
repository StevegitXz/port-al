import React, { useState, useEffect, useRef } from 'react';
import { Cpu, Droplets, Zap, Play, RotateCcw, Activity, Terminal as TerminalIcon, ShieldCheck } from 'lucide-react';
import { sound } from '../utils/sound';
import { achievementManager } from '../utils/achievements';

export default function IoTSimulator() {
  const [moisture, setMoisture] = useState(28); // Starts low so relay triggers
  const [temperature, setTemperature] = useState(31.5);
  const [autoMode, setAutoMode] = useState(true);
  const [relayActive, setRelayActive] = useState(false);
  const [serialLogs, setSerialLogs] = useState([
    '[INIT] ESP8266 NodeMCU v3 inicializado (Clock: 80MHz)',
    '[NET] Wi-Fi conectado ao Gateway IFAC (RSSI: -54dBm)',
    '[MARIOT] Módulo de Automação Amazônica pronto na porta D1 (GPIO5)'
  ]);

  const serialBottomRef = useRef(null);

  const addLog = (msg) => {
    const timestamp = new Date().toLocaleTimeString();
    setSerialLogs((prev) => [...prev.slice(-25), `[${timestamp}] ${msg}`]);
  };

  // Logic: when moisture changes, calculate relay trigger
  useEffect(() => {
    achievementManager.unlock('iot_engineer');

    if (autoMode) {
      if (moisture < 35 && !relayActive) {
        setRelayActive(true);
        sound.playRelayClick(true);
        addLog(`CRÍTICO: Umidade em ${moisture}% (<35%). digitalWrite(PIN_D1, HIGH);`);
        addLog(`BOMBA: Relé acionado. Irrigação do solo iniciada.`);
      } else if (moisture >= 60 && relayActive) {
        setRelayActive(false);
        sound.playRelayClick(false);
        addLog(`OK: Solo estabilizado em ${moisture}% (>=60%). digitalWrite(PIN_D1, LOW);`);
        addLog(`BOMBA: Irrigação desativada. Entrando em modo monitoramento.`);
      }
    }
  }, [moisture, autoMode, relayActive]);

  useEffect(() => {
    serialBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [serialLogs]);

  // Simulation timer: if pump is on, gradually increase moisture
  useEffect(() => {
    if (!relayActive) return;
    const interval = setInterval(() => {
      setMoisture((prev) => {
        if (prev >= 65) return prev;
        return prev + 3;
      });
    }, 600);
    return () => clearInterval(interval);
  }, [relayActive]);

  const handleManualToggleRelay = () => {
    sound.playRelayClick(!relayActive);
    setAutoMode(false);
    setRelayActive(!relayActive);
    addLog(`MANUAL: Operador alterou relé para: ${!relayActive ? 'LIGADO' : 'DESLIGADO'}`);
  };

  const handleSetPreset = (val, label) => {
    sound.playClick();
    setMoisture(val);
    addLog(`PRESET: Nível de solo alterado para [${label}]: ${val}%`);
  };

  return (
    <div className="rounded-2xl glass-panel p-5 sm:p-7 border border-[#f4a7b9]/30 bg-[#0c0e14] text-zinc-200">
      {/* Simulator Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-emerald-400/10 border border-emerald-400/30 text-emerald-400">
            <Cpu className="w-5 h-5" />
          </span>
          <div>
            <h4 className="text-base font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
              <span>Laboratório Virtual MARIOT (ESP8266)</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 font-semibold">
                LIVE CIRCUIT
              </span>
            </h4>
            <p className="text-xs font-mono text-zinc-400">
              Circuito de automação e irrigação inteligente apresentado no 45º CSBC/WCAMA
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setAutoMode(!autoMode);
              addLog(`SISTEMA: Modo Automático ${!autoMode ? 'ATIVADO' : 'DESATIVADO'}`);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-all ${
              autoMode
                ? 'bg-emerald-400/15 border-emerald-400/50 text-emerald-300'
                : 'bg-zinc-900 border-zinc-700 text-zinc-400'
            }`}
          >
            AUTO: {autoMode ? 'LIGADO (35% THRESHOLD)' : 'MANUAL'}
          </button>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
        {/* Left Column: ESP8266 & Circuit Hardware Display */}
        <div className="lg:col-span-6 p-4 rounded-xl bg-zinc-950/70 border border-white/5 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pb-2 border-b border-white/5">
            <span>PLACA CONTROLADORA: ESP8266 (NodeMCU)</span>
            <span className="text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              3.3V / Wi-Fi ON
            </span>
          </div>

          {/* Virtual Circuit Board Visual */}
          <div className="relative p-4 rounded-xl bg-[#090b10] border border-emerald-500/20 shadow-inner flex flex-col justify-between h-52">
            {/* PCB Trace Graphic Lines */}
            <div className="absolute inset-0 bg-cyber-grid opacity-20 pointer-events-none"></div>

            {/* Top Chip and Status LEDs */}
            <div className="flex items-start justify-between relative z-10">
              <div className="p-2 rounded bg-zinc-900 border border-zinc-700 text-[10px] font-mono font-bold text-zinc-300 tracking-wider">
                ESP8266-12E
                <div className="text-[8px] text-zinc-500 font-normal">TENSILICA L106</div>
              </div>

              <div className="flex items-center gap-3 text-[10px] font-mono">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
                  <span className="text-zinc-400">PWR</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span>
                  <span className="text-zinc-400">WIFI</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${relayActive ? 'bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.9)] animate-pulse' : 'bg-zinc-700'}`}></span>
                  <span className={relayActive ? 'text-emerald-400 font-bold' : 'text-zinc-500'}>D1 / RELÉ</span>
                </div>
              </div>
            </div>

            {/* Virtual 5V Relay & Pump Module status */}
            <div className="relative z-10 grid grid-cols-2 gap-3 pt-2">
              {/* Relay Unit */}
              <div className={`p-3 rounded-lg border transition-all ${
                relayActive
                  ? 'bg-emerald-950/40 border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                  : 'bg-zinc-900/60 border-zinc-800'
              }`}>
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-zinc-400 font-semibold">Módulo Relé 5V</span>
                  <span className={`font-bold ${relayActive ? 'text-emerald-400' : 'text-zinc-500'}`}>
                    {relayActive ? 'FECHADO (ON)' : 'ABERTO (OFF)'}
                  </span>
                </div>
                <div className="text-[10px] font-mono text-zinc-500 mt-1">
                  Pino GPIO5: {relayActive ? 'HIGH (+3.3V)' : 'LOW (0V)'}
                </div>
              </div>

              {/* Water Pump Unit */}
              <div className={`p-3 rounded-lg border transition-all ${
                relayActive
                  ? 'bg-cyan-950/40 border-cyan-500/60 shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                  : 'bg-zinc-900/60 border-zinc-800'
              }`}>
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-zinc-400 font-semibold flex items-center gap-1">
                    <Droplets className={`w-3.5 h-3.5 ${relayActive ? 'text-cyan-400 animate-bounce' : 'text-zinc-500'}`} />
                    Bomba D'água
                  </span>
                  <span className={`font-bold ${relayActive ? 'text-cyan-400' : 'text-zinc-500'}`}>
                    {relayActive ? 'IRRIGANDO...' : 'REPOUSO'}
                  </span>
                </div>
                <div className="text-[10px] font-mono text-zinc-500 mt-1 truncate">
                  Vazão: {relayActive ? '1.8 L/min (Ativa)' : '0.0 L/min'}
                </div>
              </div>
            </div>

            {/* Manual Trigger Button */}
            <button
              type="button"
              onClick={handleManualToggleRelay}
              className="relative z-10 w-full py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 hover:border-[#f4a7b9] text-xs font-mono text-zinc-300 hover:text-white transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <Zap className="w-3.5 h-3.5 text-[#f4a7b9]" />
              <span>Forçar Disparo Manual do Relé (Clique Mecânico)</span>
            </button>
          </div>
        </div>

        {/* Right Column: Sensor Control & Amazon Soil Conditions */}
        <div className="lg:col-span-6 p-4 rounded-xl bg-zinc-950/70 border border-white/5 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pb-2 border-b border-white/5">
            <span>SENSORES ANALÓGICOS (A0 / DHT)</span>
            <span className="text-amber-400 font-mono">AMAZÔNIA OCIDENTAL</span>
          </div>

          {/* Moisture Slider Control */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-300 flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-[#f4a7b9]" />
                Umidade do Solo (A0):
              </span>
              <span className={`text-sm font-bold font-mono ${
                moisture < 35 ? 'text-red-400 animate-pulse' : moisture < 60 ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {moisture}% {moisture < 35 ? '[SECO]' : moisture < 60 ? '[MODERADO]' : '[ÓTIMO]'}
              </span>
            </div>

            <input
              type="range"
              min="10"
              max="95"
              value={moisture}
              onChange={(e) => setMoisture(Number(e.target.value))}
              className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#f4a7b9]"
            />

            <div className="flex justify-between text-[10px] font-mono text-zinc-500">
              <span>0% (Solo Árido)</span>
              <span className="text-red-400">Limiar: 35%</span>
              <span>100% (Solo Saturado)</span>
            </div>
          </div>

          {/* Presets buttons */}
          <div className="pt-2">
            <span className="text-[11px] font-mono text-zinc-400 block mb-1.5">
              Condições Pré-definidas do Bioma:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleSetPreset(20, 'Estiagem Amazônica')}
                className="px-2 py-1.5 rounded-lg bg-red-950/30 border border-red-500/30 text-red-300 text-[11px] font-mono hover:bg-red-900/40"
              >
                Estiagem (20%)
              </button>
              <button
                type="button"
                onClick={() => handleSetPreset(50, 'Solo Médio')}
                className="px-2 py-1.5 rounded-lg bg-amber-950/30 border border-amber-500/30 text-amber-300 text-[11px] font-mono hover:bg-amber-900/40"
              >
                Normal (50%)
              </button>
              <button
                type="button"
                onClick={() => handleSetPreset(85, 'Pós-Chuva')}
                className="px-2 py-1.5 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-[11px] font-mono hover:bg-emerald-900/40"
              >
                Pós-Chuva (85%)
              </button>
            </div>
          </div>

          {/* Temperature & Microclimate card */}
          <div className="p-3 rounded-lg bg-zinc-900/70 border border-white/5 flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-zinc-500 block">Temperatura Ambiente</span>
              <span className="text-white font-bold">{temperature}°C (Rio Branco - AC)</span>
            </div>
            <div className="text-right">
              <span className="text-zinc-500 block">Status da Irrigação</span>
              <span className={relayActive ? 'text-emerald-400 font-bold' : 'text-zinc-400'}>
                {relayActive ? '● EM ANDAMENTO' : '○ AGUARDANDO'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Serial Monitor Bar (Real-time telemetry output) */}
      <div className="rounded-xl bg-[#08090d] border border-white/10 overflow-hidden font-mono text-xs">
        <div className="flex items-center justify-between px-3.5 py-2 bg-zinc-950 border-b border-white/5">
          <div className="flex items-center gap-2 text-zinc-400">
            <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px]">Monitor Serial (Baud Rate: 115200)</span>
          </div>
          <span className="text-[10px] text-zinc-500">COM3 // ESP8266-USB</span>
        </div>

        <div className="p-3 max-h-32 overflow-y-auto space-y-1 text-[11px] text-zinc-300">
          {serialLogs.map((log, idx) => (
            <div key={idx} className="leading-snug">
              {log.includes('CRÍTICO') || log.includes('HIGH') ? (
                <span className="text-emerald-400 font-semibold">{log}</span>
              ) : log.includes('BOMBA') ? (
                <span className="text-cyan-400">{log}</span>
              ) : (
                <span className="text-zinc-400">{log}</span>
              )}
            </div>
          ))}
          <div ref={serialBottomRef} />
        </div>
      </div>
    </div>
  );
}
