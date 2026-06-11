
import React, { useState } from 'react';
import { ImmunizerReport } from '../types';
import { RepoBrainAI } from '../services/geminiService';

interface Props {
  report: ImmunizerReport;
  onClose: () => void;
}

const ImmunizerModal: React.FC<Props> = ({ report, onClose }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getInsight = async () => {
    setLoading(true);
    const ai = new RepoBrainAI();
    const res = await ai.analyzeIntegrity(report);
    setInsight(res);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 shadow-2xl rounded-2xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="bg-slate-800/50 px-6 py-4 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-2">
            <span className="text-xl">🛡️</span>
            <h2 className="text-lg font-black text-white tracking-tight uppercase italic">Brain Immunizer System</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {/* Status Header */}
          <div className={`p-5 rounded-xl border flex flex-col gap-4 ${report.integrityOk ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-rose-500/5 border-rose-500/20'}`}>
            <div className="flex items-center gap-4">
              <div className={`text-3xl ${report.integrityOk ? 'text-emerald-500' : 'text-rose-500'}`}>
                {report.integrityOk ? '🔒' : '🔓'}
              </div>
              <div className="flex-1">
                <p className="text-sm font-black text-white uppercase tracking-widest">
                  System Integrity: {report.integrityOk ? 'VERIFIED' : 'COMPROMISED'}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {report.integrityOk 
                    ? '.repo-brain components are currently locked and match the recorded hash.' 
                    : 'Unauthorized modifications detected in core brain scripts!'}
                </p>
              </div>
              <div className="text-right">
                 <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${report.locked ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-slate-800 text-slate-500'}`}>
                   {report.locked ? 'LOCKED' : 'UNLOCKED'}
                 </span>
              </div>
            </div>
            
            <div className="p-3 bg-slate-950/50 rounded-lg border border-slate-800 font-mono text-[10px] text-slate-500 break-all">
              <p className="text-slate-600 mb-1 uppercase font-bold tracking-tighter">Immune Hash Reference:</p>
              {report.hash}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800">
              <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Last Lock Sequence</p>
              <p className="text-xs text-slate-300">{new Date(report.lastLockedAt).toLocaleString()}</p>
            </div>
            <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800">
              <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Protected Files</p>
              <p className="text-xs text-slate-300 font-mono">{report.filesProtected} modules</p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
             {insight ? (
               <div className="p-5 bg-blue-500/5 border border-blue-500/20 rounded-2xl animate-in fade-in slide-in-from-top-4">
                 <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">🛡️</span>
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Brain AI: Security Analysis</p>
                 </div>
                 <p className="text-xs text-slate-300 leading-relaxed italic">{insight}</p>
               </div>
             ) : (
               <button 
                onClick={getInsight}
                disabled={loading}
                className="w-full py-4 border-2 border-dashed border-slate-800 rounded-2xl text-xs font-black uppercase tracking-[0.2em] text-slate-500 hover:border-emerald-500/30 hover:text-emerald-400 transition-all flex items-center justify-center gap-2"
               >
                 {loading ? <div className="w-3 h-3 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div> : '⚡ Activate Integrity Analysis'}
               </button>
             )}
          </div>
        </div>

        <div className="bg-slate-800/20 p-6 border-t border-slate-700 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-8 py-2 bg-slate-700 hover:bg-slate-600 text-white text-[10px] font-black rounded-xl transition-all uppercase tracking-widest"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImmunizerModal;
