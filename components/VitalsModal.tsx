
import React, { useState } from 'react';
import { VitalsReport } from '../types';
import { RepoBrainAI } from '../services/geminiService';

interface Props {
  vitals: VitalsReport;
  onClose: () => void;
}

const VitalsModal: React.FC<Props> = ({ vitals, onClose }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getInsight = async () => {
    setLoading(true);
    const ai = new RepoBrainAI();
    const res = await ai.analyzeVitals(vitals);
    setInsight(res);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 shadow-2xl rounded-2xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="bg-slate-800/50 px-6 py-4 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-2">
            <span className="text-xl">📊</span>
            <h2 className="text-lg font-black text-white tracking-tight uppercase italic">Repository Vitals</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
              <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Repo Size</p>
              <p className="text-xl font-mono text-white font-black">{vitals.repoSize}</p>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
              <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Files</p>
              <p className="text-xl font-mono text-white font-black">{vitals.fileCount}</p>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
              <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Commits</p>
              <p className="text-xl font-mono text-white font-black">{vitals.commitCount}</p>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
              <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Last Activity</p>
              <p className="text-xs text-white font-bold">{vitals.lastCommitAge}</p>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
              <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Build Perf</p>
              <p className="text-xs text-blue-400 font-bold">{vitals.buildDurationSec}s</p>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
              <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Test Perf</p>
              <p className="text-xs text-emerald-400 font-bold">{vitals.testDurationSec}s</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Distribution Profile</h3>
            <div className="p-6 bg-slate-950/30 border border-slate-800 rounded-xl font-mono text-xs text-slate-400 leading-loose">
              {vitals.largestDirs.split(';').map((d, i) => <div key={i}>{d.trim()}</div>)}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            {insight ? (
              <div className="p-6 bg-blue-500/5 border border-blue-500/20 rounded-2xl animate-in fade-in slide-in-from-top-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">🧠</span>
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">AI Performance Advisory</p>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic font-medium">{insight}</p>
              </div>
            ) : (
              <button 
                onClick={getInsight}
                disabled={loading}
                className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white text-xs font-black rounded-xl transition-all uppercase tracking-widest"
              >
                {loading ? 'Synthesizing...' : 'Interpret Performance Genome'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VitalsModal;
