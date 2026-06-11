import React, { useEffect, useRef } from 'react';

interface Props {
  logs: string[];
  onClose: () => void;
}

const Terminal: React.FC<Props> = ({ logs, onClose }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-2 sm:p-6 lg:p-12 bg-slate-950/90 backdrop-blur-md overflow-hidden">
      <div className="w-full max-w-4xl bg-slate-900 rounded-xl sm:rounded-[2.5rem] border border-slate-700 shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col h-[85vh] sm:h-[600px] animate-in zoom-in duration-300">
        <div className="bg-slate-800/80 px-4 sm:px-6 py-3 sm:py-5 flex items-center justify-between border-b border-slate-700">
          <div className="flex gap-1.5 sm:gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 h-3 rounded-full bg-rose-500"></div>
            <div className="w-2.5 h-2.5 sm:w-3 h-3 rounded-full bg-amber-500"></div>
            <div className="w-2.5 h-2.5 sm:w-3 h-3 rounded-full bg-emerald-500"></div>
          </div>
          <span className="text-[8px] sm:text-xs font-mono font-black text-slate-400 uppercase tracking-widest truncate max-w-[150px] sm:max-w-none">brain.run.sh — Execution Stream</span>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-white transition-colors p-2 -mr-2 text-xl"
          >
            ✕
          </button>
        </div>
        <div 
          ref={scrollRef}
          className="flex-1 p-4 sm:p-10 font-mono text-[10px] sm:text-sm overflow-y-auto custom-scrollbar bg-slate-950 text-emerald-400/90 space-y-1 sm:space-y-2 leading-relaxed selection:bg-emerald-500/20"
        >
          {logs.map((log, i) => (
            <div key={i} className={`flex gap-2 sm:gap-4 ${log.includes('⚠️') ? 'text-amber-400' : log.includes('✅') ? 'text-emerald-300 font-bold' : log.includes('❌') ? 'text-rose-400' : ''}`}>
              <span className="opacity-20 shrink-0 select-none hidden sm:inline">[{i.toString().padStart(2, '0')}]</span>
              <span className="break-words">{log}</span>
            </div>
          ))}
          <div className="animate-pulse inline-block w-2 h-4 sm:w-2.5 sm:h-5 bg-emerald-400/50 ml-1 sm:ml-2 translate-y-1"></div>
        </div>
        <div className="bg-slate-800/30 p-3 sm:p-4 border-t border-slate-800 flex items-center justify-between text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-slate-500">
           <div className="flex items-center gap-3 sm:gap-4">
              <span className="flex items-center gap-1.5 sm:gap-2">
                <span className="w-1.5 h-1.5 sm:w-2 h-2 rounded-full bg-emerald-500"></span> Live Trace
              </span>
              <span className="hidden sm:inline opacity-40">UTF-8 Security Compliant</span>
           </div>
           <button onClick={onClose} className="text-blue-500 hover:text-blue-400 px-3 py-1.5 sm:px-4 sm:py-2 border border-blue-500/20 rounded-lg bg-blue-500/5 active:scale-95 transition-all">Close Session</button>
        </div>
      </div>
    </div>
  );
};

export default Terminal;
