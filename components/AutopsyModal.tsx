import React, { useState } from 'react';
import { AutopsyReport } from '../types';
import { RepoBrainAI } from '../services/geminiService';

interface Props {
  report: AutopsyReport;
  onClose: () => void;
}

const AutopsyModal: React.FC<Props> = ({ report, onClose }) => {
  const [selectedTrace, setSelectedTrace] = useState<string | null>(Object.keys(report.traces)[0]);
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getInsight = async () => {
    setLoading(true);
    const ai = new RepoBrainAI();
    const res = await ai.analyzeAutopsy(report);
    setInsight(res);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-700 shadow-2xl rounded-2xl overflow-hidden flex flex-col h-[95vh] sm:h-[90vh]">
        <div className="bg-slate-800/50 px-4 sm:px-6 py-4 flex items-center justify-between border-b border-slate-700 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔪</span>
            <h2 className="text-sm sm:text-lg font-black text-white tracking-tight uppercase italic truncate">Brain Autopsy: {report.runId}</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-2 -mr-2 text-xl">✕</button>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Sidebar */}
          <div className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-row lg:flex-col p-4 space-x-4 lg:space-x-0 lg:space-y-6 overflow-x-auto lg:overflow-y-auto shrink-0 custom-scrollbar">
            <section className="shrink-0 min-w-[140px] lg:min-w-0">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 lg:mb-3">Snapshots</h3>
              <div className="space-y-1">
                 {report.treeSnapshot.slice(0, 5).map(f => (
                   <div key={f} className="text-[10px] font-mono text-slate-400 truncate">{f}</div>
                 ))}
                 {report.treeSnapshot.length > 5 && <div className="text-[8px] text-slate-600 italic">+{report.treeSnapshot.length - 5} more...</div>}
              </div>
            </section>
            
            <section className="shrink-0 min-w-[140px] lg:min-w-0">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 lg:mb-3">Captured Logs</h3>
              <div className="flex flex-row lg:flex-col gap-1">
                {Object.keys(report.traces).map(name => (
                  <button 
                    key={name}
                    onClick={() => setSelectedTrace(name)}
                    className={`whitespace-nowrap lg:w-full text-left px-3 lg:px-2 py-1.5 rounded text-[10px] font-mono transition-colors ${selectedTrace === name ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'}`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </section>

            <section className="hidden lg:block mt-auto pt-4 border-t border-slate-800">
               <button 
                onClick={getInsight}
                disabled={loading}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all active:scale-95"
               >
                 {loading ? 'Analyzing...' : 'Perform AI Autopsy'}
               </button>
            </section>
          </div>

          {/* Trace Content */}
          <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden relative">
            {insight && (
              <div className="p-4 bg-emerald-500/5 border-b border-emerald-500/20 text-[10px] sm:text-[11px] text-emerald-400 italic sticky top-0 z-10 backdrop-blur">
                <div className="font-black uppercase text-[8px] mb-1">AI Diagnostic Insight:</div>
                {insight}
              </div>
            )}
            <div className="flex-1 p-4 sm:p-6 font-mono text-[10px] sm:text-xs overflow-y-auto custom-scrollbar text-slate-400 whitespace-pre">
               {selectedTrace ? (
                 <div className="animate-in fade-in duration-300">
                    <span className="text-blue-500"># Tracing {selectedTrace} execution flow...</span>
                    <br/><br/>
                    {report.traces[selectedTrace]}
                 </div>
               ) : (
                 <div className="h-full flex items-center justify-center text-slate-600 uppercase tracking-widest text-center px-4">Select a trace to begin analysis</div>
               )}
            </div>
            
            {/* Mobile Insight Button */}
            <div className="lg:hidden p-3 border-t border-slate-800 bg-slate-900/50 backdrop-blur">
               <button 
                  onClick={getInsight}
                  disabled={loading}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-95 shadow-lg"
                 >
                   {loading ? 'Synthesizing...' : '⚡ Neural Forensic Replay'}
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutopsyModal;