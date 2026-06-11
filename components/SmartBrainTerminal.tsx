import React, { useState, useEffect, useRef } from 'react';
import { RepoBrainAI } from '../services/geminiService';

interface Props {
  logs: string[];
  onClose: () => void;
}

const SmartBrainTerminal: React.FC<Props> = ({ logs, onClose }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [isTroubleshooting, setIsTroubleshooting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const troubleshoot = async () => {
    setIsTroubleshooting(true);
    const ai = new RepoBrainAI();
    const solution = await ai.troubleshootLogs(logs);
    setInsight(solution);
    setIsTroubleshooting(false);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-2 sm:p-6 lg:p-20 bg-slate-950/95 backdrop-blur-xl overflow-hidden">
      <div className="w-full max-w-6xl bg-slate-900 rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[4rem] border border-slate-700 shadow-2xl overflow-hidden flex flex-col h-[95vh] sm:h-[90vh] animate-in zoom-in duration-500">
        <div className="bg-slate-800/60 px-5 sm:px-12 py-4 sm:py-8 flex items-center justify-between border-b border-slate-700 shrink-0">
          <div className="flex items-center gap-3 sm:gap-6">
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-blue-600 rounded-xl md:rounded-2xl flex items-center justify-center text-lg sm:text-2xl shadow-2xl">🧠</div>
            <div className="min-w-0">
              <h2 className="text-xs sm:text-2xl font-black text-white uppercase italic leading-none truncate">SmartBrain Oracle</h2>
              <p className="text-[7px] sm:text-[11px] text-slate-500 font-mono font-bold tracking-widest uppercase mt-1 md:mt-2 opacity-60 truncate">High-Fidelity Telemetry</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-all p-2 -mr-2 text-xl sm:text-3xl">✕</button>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-slate-950/50">
          <div ref={scrollRef} className="flex-1 p-4 sm:p-16 font-mono text-[9px] sm:text-sm overflow-y-auto custom-scrollbar text-emerald-400/90 space-y-1.5 sm:space-y-3 leading-relaxed selection:bg-emerald-500/20">
            {logs.map((log, i) => (
              <div key={i} className={`flex gap-3 sm:gap-8 group ${log.includes('⚠️') ? 'text-amber-400' : log.includes('✅') ? 'text-emerald-300 font-bold' : log.includes('❌') ? 'text-rose-400 font-bold' : ''}`}>
                <span className="opacity-10 shrink-0 select-none group-hover:opacity-40 text-[8px] sm:text-[11px]">[{i.toString().padStart(3, '0')}]</span>
                <span className="break-words">{log}</span>
              </div>
            ))}
            <div className="animate-pulse inline-block w-2 h-4 sm:w-3 sm:h-5 bg-emerald-400/50 ml-1 sm:ml-2"></div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-[350px] xl:w-[450px] border-t lg:border-t-0 lg:border-l border-slate-800 p-5 sm:p-12 bg-slate-900/40 flex flex-col gap-4 sm:gap-8 overflow-y-auto shrink-0 shadow-[-20px_0_40px_rgba(0,0,0,0.3)]">
            <div className="flex items-center justify-between">
              <h3 className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 italic">Oracle Diagnostic</h3>
              <span className="text-[7px] sm:text-[8px] px-2 py-0.5 bg-blue-600/10 text-blue-400 border border-blue-600/20 rounded-full font-black">ACTIVE</span>
            </div>

            <button 
              onClick={troubleshoot}
              disabled={isTroubleshooting}
              className="w-full py-4 sm:py-8 bg-blue-600 hover:bg-blue-500 text-white text-[10px] sm:text-sm font-black uppercase tracking-[0.2em] rounded-xl sm:rounded-[2.5rem] transition-all shadow-xl active:scale-95 border-b-4 border-blue-800"
            >
              {isTroubleshooting ? 'Synthesizing...' : 'Oracle Troubleshoot'}
            </button>

            {insight && (
              <div className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-right-8 duration-700">
                <div className="p-5 sm:p-8 bg-blue-500/5 border border-blue-500/20 rounded-2xl sm:rounded-[2rem] text-[11px] sm:text-base text-slate-300 leading-relaxed font-medium italic relative shadow-inner">
                  <div className="font-black text-blue-500 mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3 uppercase tracking-widest text-[8px] sm:text-[10px]">
                    <span className="text-lg">🏥</span> Surgical Patch Advisory
                  </div>
                  {insight}
                </div>
                <div className="flex gap-2 sm:gap-4">
                   <button className="flex-1 py-3 sm:py-4 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-500 hover:text-white text-[9px] sm:text-[10px] font-black uppercase tracking-widest rounded-xl border border-emerald-500/30 transition-all active:scale-95 shadow-lg">Apply Fix</button>
                   <button className="flex-1 py-3 sm:py-4 bg-slate-800/50 hover:bg-slate-700 text-slate-500 hover:text-white text-[9px] sm:text-[10px] font-black uppercase tracking-widest rounded-xl border border-slate-700 transition-all active:scale-95">Dismiss</button>
                </div>
              </div>
            )}
            
            <div className="mt-auto pt-6 sm:pt-8 border-t border-slate-800 text-[8px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 space-y-3 sm:space-y-4">
               <p className="flex justify-between items-center"><span>State</span> <span className="text-emerald-500">Live Link</span></p>
               <p className="flex justify-between"><span>Parallel Threads</span> <span className="text-slate-400">08 active</span></p>
               <p className="flex justify-between"><span>Neural Spec</span> <span className="text-slate-400">HOSPITAL_V2.1</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartBrainTerminal;