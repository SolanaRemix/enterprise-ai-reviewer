
import React, { useState } from 'react';
import { GenomeReport } from '../types';
import { RepoBrainAI } from '../services/geminiService';

interface Props {
  report: GenomeReport;
  onClose: () => void;
}

const GenomeModal: React.FC<Props> = ({ report, onClose }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getInsight = async () => {
    setLoading(true);
    const ai = new RepoBrainAI();
    const res = await ai.analyzeGenome(report);
    setInsight(res);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 shadow-2xl rounded-2xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="bg-slate-800/50 px-6 py-4 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-2">
            <span className="text-xl">🧬</span>
            <h2 className="text-lg font-black text-white tracking-tight uppercase italic">Brain Genome Explorer</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800">
            <div className="text-center flex-1">
              <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Source</p>
              <p className="text-sm font-mono text-white">{report.from}</p>
            </div>
            <div className="px-4 text-slate-600">→</div>
            <div className="text-center flex-1">
              <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Target</p>
              <p className="text-sm font-mono text-white">{report.to}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Evolutionary Changes</h3>
            {report.changes.map((c, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-slate-950/30 border border-slate-800/50 rounded-lg group">
                <span className="text-xs font-mono text-slate-300 group-hover:text-white transition-colors">{c.file}</span>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                  c.change === 'added' ? 'bg-emerald-500/10 text-emerald-400' :
                  c.change === 'modified' ? 'bg-amber-500/10 text-amber-400' :
                  'bg-rose-500/10 text-rose-400'
                }`}>
                  {c.change}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4">
             {insight ? (
               <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl animate-in fade-in slide-in-from-top-2">
                 <p className="text-[10px] font-black text-blue-400 uppercase mb-2">AI Genome Interpretation</p>
                 <p className="text-xs text-slate-300 leading-relaxed italic">{insight}</p>
               </div>
             ) : (
               <button 
                onClick={getInsight}
                disabled={loading}
                className="w-full py-3 border border-dashed border-slate-700 rounded-xl text-xs font-bold text-slate-400 hover:border-blue-500/50 hover:text-blue-400 transition-all flex items-center justify-center gap-2"
               >
                 {loading ? <div className="w-3 h-3 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div> : '✨ Interpret Genetic Evolution'}
               </button>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenomeModal;
