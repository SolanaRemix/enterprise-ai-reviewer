
import React, { useState } from 'react';
import { FirewallReport } from '../types';
import { RepoBrainAI } from '../services/geminiService';

interface Props {
  report: FirewallReport;
  onClose: () => void;
}

const FirewallModal: React.FC<Props> = ({ report, onClose }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getInsight = async () => {
    setLoading(true);
    const ai = new RepoBrainAI();
    const res = await ai.analyzeFirewall(report);
    setInsight(res);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-700 shadow-2xl rounded-[3rem] overflow-hidden flex flex-col max-h-[85vh]">
        <div className="bg-slate-800/50 px-8 py-5 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-4">
            <span className="text-2xl">🔥</span>
            <div>
              <h2 className="text-lg font-black text-white tracking-tight uppercase italic leading-none">Safety Firewall</h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Pre-Commit Policy Enforcement</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
          <div className={`p-6 rounded-2xl border flex items-center gap-6 ${report.installed ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-rose-500/5 border-rose-500/20'}`}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${report.installed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
              {report.installed ? '🛡️' : '⚠️'}
            </div>
            <div className="flex-1">
              <p className="text-sm font-black text-white uppercase tracking-widest">Hook Status: {report.installed ? 'PROTECTED' : 'INACTIVE'}</p>
              <p className="text-xs text-slate-400 mt-1">The firewall is currently monitoring all local commit attempts for compliance.</p>
            </div>
          </div>

          <section>
            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500 mb-5">Active Denial Rules</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.activeRules.map((rule, i) => (
                <div key={i} className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl group hover:border-blue-500/30 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-blue-400">/{rule.pattern}/</span>
                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${rule.severity === 'CRITICAL' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}>
                      {rule.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium">{rule.description}</p>
                </div>
              ))}
            </div>
          </section>

          {report.lastInterceptedFiles.length > 0 && (
            <section>
              <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-rose-500 mb-5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                Recent Interceptions
              </h3>
              <div className="space-y-2">
                {report.lastInterceptedFiles.map((file, i) => (
                  <div key={i} className="px-5 py-3 bg-rose-500/5 border border-rose-500/20 rounded-xl flex items-center justify-between group">
                    <span className="text-xs font-mono text-rose-300">{file}</span>
                    <span className="text-[9px] font-black text-rose-500/60 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Blocked Commit</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="pt-6 border-t border-slate-800">
            {insight ? (
              <div className="p-6 bg-blue-500/5 border border-blue-500/20 rounded-[2rem] animate-in fade-in slide-in-from-top-4">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">AI Security Recommendation</p>
                <p className="text-xs text-slate-300 leading-relaxed italic font-medium">{insight}</p>
              </div>
            ) : (
              <button 
                onClick={getInsight}
                disabled={loading}
                className="w-full py-5 bg-slate-950 border border-slate-800 hover:border-blue-500/50 text-slate-400 hover:text-blue-400 text-xs font-black uppercase tracking-widest rounded-2xl transition-all"
              >
                {loading ? 'Analyzing Rules...' : '✨ Audit Firewall Intelligence'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirewallModal;
