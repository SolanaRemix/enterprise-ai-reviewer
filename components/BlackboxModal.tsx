import React, { useState } from 'react';
import { BlackboxRecording } from '../types';
import { RepoBrainAI } from '../services/geminiService';

interface Props {
  recording: BlackboxRecording;
  onClose: () => void;
}

const BlackboxModal: React.FC<Props> = ({ recording, onClose }) => {
  const [activeTab, setActiveTab] = useState<'trace' | 'env' | 'git'>('trace');
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getInsight = async () => {
    setLoading(true);
    const ai = new RepoBrainAI();
    const res = await ai.analyzeBlackbox(recording);
    setInsight(res);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-2 sm:p-4 bg-slate-950/95 backdrop-blur-xl">
      <div className="w-full max-w-5xl bg-slate-900 border border-slate-700 shadow-2xl rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden flex flex-col h-[95vh] sm:h-[90vh]">
        <div className="bg-slate-800/50 px-4 sm:px-8 py-4 sm:py-6 flex items-center justify-between border-b border-slate-700 shrink-0">
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="text-xl sm:text-3xl">📼</span>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-xl font-black text-white tracking-tight uppercase italic leading-none truncate">Blackbox Recording</h2>
              <p className="text-[8px] sm:text-[10px] text-slate-500 font-mono font-bold tracking-widest uppercase mt-1 truncate">ID: {recording.runId.substring(0, 10)}... • {new Date(recording.timestamp).toLocaleTimeString()}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-2 -mr-2 text-xl sm:text-2xl">✕</button>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Navigation */}
          <div className="w-full lg:w-56 border-b lg:border-b-0 lg:border-r border-slate-800 p-3 sm:p-6 flex flex-row lg:flex-col gap-2 bg-slate-900/50 shrink-0 overflow-x-auto custom-scrollbar">
            {['trace', 'env', 'git'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-2 sm:py-3 rounded-xl text-center lg:text-left text-[9px] sm:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap flex-1 lg:flex-none ${activeTab === tab ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105' : 'text-slate-500 hover:bg-slate-800'}`}
              >
                {tab === 'trace' ? 'Trace Log' : tab === 'env' ? 'Env Snapshot' : 'Git State'}
              </button>
            ))}

            <div className="hidden lg:block mt-auto pt-6 border-t border-slate-800">
              <button 
                onClick={getInsight}
                disabled={loading}
                className="w-full py-4 bg-slate-950 border border-slate-800 hover:border-blue-500/50 text-slate-400 hover:text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all active:scale-95 shadow-inner"
              >
                {loading ? 'Replaying...' : 'AI Forensic Replay'}
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden relative">
            {insight && (
              <div className="p-4 sm:p-6 bg-blue-500/5 border-b border-blue-500/20 text-[10px] sm:text-xs text-blue-300 font-medium italic animate-in fade-in slide-in-from-top-4 sticky top-0 z-10 backdrop-blur">
                <span className="font-black text-blue-500 uppercase not-italic mr-2 text-[8px] sm:text-[9px]">Oracle Advisory:</span>
                {insight}
              </div>
            )}
            <div className="flex-1 p-4 sm:p-8 font-mono text-[10px] sm:text-[13px] overflow-y-auto custom-scrollbar text-emerald-500/80 whitespace-pre leading-relaxed selection:bg-blue-500/30">
              {activeTab === 'trace' && <div className="animate-in fade-in duration-300"><span className="text-emerald-300 font-bold">$ set -x; ./brain.run.sh --trace</span><br/><br/>{recording.trace}</div>}
              {activeTab === 'env' && <div className="animate-in fade-in duration-300 text-slate-400">{recording.env}</div>}
              {activeTab === 'git' && (
                <div className="animate-in fade-in duration-300 space-y-6 sm:space-y-8">
                  <div>
                    <span className="text-blue-400 font-black uppercase tracking-widest text-[8px] sm:text-[10px] mb-3 sm:mb-4 block">System Status</span>
                    <div className="text-slate-400">{recording.gitStatus}</div>
                  </div>
                  <div>
                    <span className="text-blue-400 font-black uppercase tracking-widest text-[8px] sm:text-[10px] mb-3 sm:mb-4 block">Audit History</span>
                    <div className="text-slate-500">{recording.gitLog}</div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Mobile Action Bar */}
            <div className="lg:hidden p-3 border-t border-slate-800 bg-slate-900/50 backdrop-blur">
               <button 
                  onClick={getInsight}
                  disabled={loading}
                  className="w-full py-3.5 bg-slate-950 border border-slate-800 text-blue-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all active:scale-95"
                 >
                   {loading ? 'Synthesizing...' : '✨ Oracle Forensic Trace'}
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlackboxModal;