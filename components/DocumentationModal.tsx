import React from 'react';

interface Props {
  onClose: () => void;
}

const DocumentationModal: React.FC<Props> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-10 bg-slate-950/95 backdrop-blur-xl">
      <div className="w-full max-w-5xl bg-slate-900 border border-slate-800 shadow-2xl rounded-2xl sm:rounded-[2rem] md:rounded-[3rem] overflow-hidden flex flex-col h-[95vh] md:h-[90vh] max-h-[800px]">
        <div className="bg-slate-800/30 px-5 sm:px-8 md:px-10 py-4 sm:py-6 md:py-8 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3 md:gap-4">
            <span className="text-xl sm:text-2xl md:text-3xl">📜</span>
            <h2 className="text-base sm:text-lg md:text-xl font-black text-white tracking-tighter uppercase italic truncate">CyberAI Oracle System Spec</h2>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors text-xl sm:text-2xl md:text-3xl p-1 md:p-2 -mr-1 md:-mr-2">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 sm:p-8 md:p-12 space-y-8 sm:space-y-10 md:space-y-12 custom-scrollbar text-slate-300 font-medium leading-relaxed">
          <section className="space-y-6">
            <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-tighter uppercase border-l-4 border-blue-600 pl-4 md:pl-6 italic">🛠️ Operator Command Cheat Sheet</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
               <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                  <p className="text-[9px] text-slate-500 mb-2 uppercase font-black">Admit Repository</p>
                  <code className="text-xs text-blue-400">brainctl run</code>
               </div>
               <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                  <p className="text-[9px] text-slate-500 mb-2 uppercase font-black">Self-Healing / Repair</p>
                  <code className="text-xs text-emerald-400">brainctl heal</code>
               </div>
               <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                  <p className="text-[9px] text-slate-500 mb-2 uppercase font-black">Build brain.exe</p>
                  <code className="text-xs text-amber-400">brainctl pack</code>
               </div>
               <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                  <p className="text-[9px] text-slate-500 mb-2 uppercase font-black">Health Audit</p>
                  <code className="text-xs text-rose-400">brainctl doctor</code>
               </div>
            </div>
          </section>

          <section className="space-y-4 md:space-y-6">
            <h3 className="text-base sm:text-lg md:text-2xl font-black text-white tracking-tighter uppercase border-l-4 border-emerald-600 pl-4 md:pl-6">📦 Standalone Packaging (Windows)</h3>
            <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl">
              <p className="text-xs sm:text-sm text-slate-400 mb-4">
                To build the <strong>User Dashboard</strong> as a single Windows executable (brain.exe), ensure you have Node.js installed and run the following in your terminal:
              </p>
              <div className="bg-black p-4 rounded-xl text-[10px] sm:text-xs text-emerald-500 font-mono space-y-1">
                <p># 1. Install packaging engine</p>
                <p>npm install -g pkg</p>
                <p># 2. Compile React dashboard + Brain CLI</p>
                <p>npm run pack:win</p>
              </div>
              <p className="mt-4 text-[10px] text-slate-500 italic">
                * This will bundle the entire REPO BRAIN architecture into a portable EXE file.
              </p>
            </div>
          </section>

          <section className="space-y-4 md:space-y-6">
            <h3 className="text-base sm:text-lg md:text-2xl font-black text-white tracking-tighter uppercase border-l-4 border-blue-600 pl-4 md:pl-6">2. 18-Phase Orchestration Loop</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              {[
                { title: 'P1-4: Discovery', desc: 'Fingerprinting stack genome and indexing GitHub Actions jobs.' },
                { title: 'P8: Normalization', desc: 'Injecting canonical workflows and repo structural templates.' },
                { title: 'P9: Diagnosis', desc: 'Categorizing health into GREEN, AUTO, or RED.' },
                { title: 'P12: AI Guard', desc: 'Scanning for secrets (OpenAI, Gemini) and code injection risks.' },
                { title: 'P18: Test Suite', desc: 'Autonomous verification of brain module logic and security rules.' },
              ].map(p => (
                <div key={p.title} className="p-4 sm:p-5 md:p-6 bg-slate-950/50 rounded-xl sm:rounded-2xl border border-slate-800">
                  <h4 className="text-blue-400 font-black uppercase text-[9px] sm:text-[10px] md:text-xs mb-1.5 tracking-widest">{p.title}</h4>
                  <p className="text-[9px] sm:text-[10px] md:text-xs text-slate-400 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4 md:space-y-6 pb-6 md:pb-8">
             <h3 className="text-base sm:text-lg md:text-2xl font-black text-white tracking-tighter uppercase border-l-4 border-rose-600 pl-4 md:pl-6">4. Safety Commitments</h3>
             <div className="p-5 sm:p-6 md:p-8 bg-rose-500/5 border border-rose-500/20 rounded-xl sm:rounded-2xl md:rounded-[2.5rem]">
                <p className="text-rose-400 font-black uppercase text-[9px] sm:text-[10px] md:text-xs mb-3 tracking-widest">Operator Guardrails:</p>
                <ul className="list-disc list-inside space-y-1.5 text-[9px] sm:text-[10px] md:text-xs text-rose-300 font-semibold italic leading-relaxed">
                  <li>Zero-touch policy on business logic and domain files.</li>
                  <li>Surgical infrastructure repairs with SHA-256 lock verification.</li>
                  <li>Cross-platform resilience via Node.js fallback for JSON processing.</li>
                  <li>Deterministic, idempotent, and operator-grade script execution.</li>
                  <li>Pre-graduation test suite for all management modules.</li>
                </ul>
             </div>
          </section>
        </div>

        <div className="p-5 sm:p-8 md:p-10 bg-slate-800/20 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">www.CyberAi.network • 2024</p>
          <button 
            onClick={onClose}
            className="w-full sm:w-auto px-6 sm:px-12 py-3.5 sm:py-5 bg-blue-600 hover:bg-blue-500 text-white text-[9px] sm:text-[10px] md:text-xs font-black rounded-xl md:rounded-2xl transition-all uppercase tracking-widest shadow-2xl active:scale-95"
          >
            Acknowledge Contract
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentationModal;
