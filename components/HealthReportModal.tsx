
import React from 'react';
import { HealthReport } from '../types';

interface Props {
  report: HealthReport;
  onClose: () => void;
}

const HealthReportModal: React.FC<Props> = ({ report, onClose }) => {
  const CheckItem = ({ label, passed, value }: { label: string; passed: boolean; value?: string }) => (
    <div className="flex items-center justify-between p-3 bg-slate-950/50 border border-slate-800 rounded-lg">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${passed ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]'}`} />
        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">{label}</span>
      </div>
      <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${passed ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
        {value || (passed ? 'PASSED' : 'FAILED')}
      </span>
    </div>
  );

  const isHealthy = report.missingScripts.length === 0 && report.notExecutable.length === 0 && report.dryRunErrors.length === 0 && report.mermedaPresent;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 shadow-2xl rounded-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-slate-800/50 px-6 py-4 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-2">
            <span className="text-xl">🩺</span>
            <h2 className="text-lg font-black text-white tracking-tight uppercase italic">Brain Health Audit</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {/* Status Header */}
          <div className={`p-4 rounded-xl border flex items-center gap-4 ${isHealthy ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-amber-500/5 border-amber-500/20'}`}>
            <div className={`text-3xl ${isHealthy ? 'text-emerald-500' : 'text-amber-500'}`}>
              {isHealthy ? '🟢' : '⚠️'}
            </div>
            <div>
              <p className="text-sm font-bold text-white uppercase tracking-widest">
                System Status: {isHealthy ? 'NOMINAL' : 'DEGRADED'}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {isHealthy ? 'All brain modules are synchronized and executable.' : 'Minor permission or dependency issues detected in the core scripts.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <CheckItem label="MERMEDA Canonical Spec" passed={report.mermedaPresent} />
            <CheckItem label="JQ Binary Support" passed={report.jqPresent} />
            <CheckItem label="Node Runtime" passed={report.nodePresent} />
            <CheckItem label="JSON-CLI Fallback" passed={report.fallbackPresent} />
          </div>

          <div className="space-y-4">
            <section>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Module Integrity</h3>
              <div className="space-y-2">
                <div className="p-3 bg-slate-950/30 border border-slate-800 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Missing Scripts</span>
                    <span className="text-xs text-white font-mono">{report.missingScripts.length}</span>
                  </div>
                  {report.missingScripts.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {report.missingScripts.map(s => <span key={s} className="text-[10px] font-mono bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded border border-rose-500/20">{s}</span>)}
                    </div>
                  ) : (
                    <p className="text-[10px] text-emerald-500 italic">All required brain scripts are present in the filesystem.</p>
                  )}
                </div>

                <div className="p-3 bg-slate-950/30 border border-slate-800 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Permission Warnings</span>
                    <span className="text-xs text-white font-mono">{report.notExecutable.length}</span>
                  </div>
                  {report.notExecutable.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {report.notExecutable.map(s => <span key={s} className="text-[10px] font-mono bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20">{s}</span>)}
                    </div>
                  ) : (
                    <p className="text-[10px] text-emerald-500 italic">No executability issues detected.</p>
                  )}
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Dry-Run Diagnostics</h3>
              <div className="p-3 bg-slate-950/30 border border-slate-800 rounded-lg">
                 {report.dryRunErrors.length > 0 ? (
                    <ul className="space-y-1">
                      {report.dryRunErrors.map(e => <li key={e} className="text-[10px] text-rose-400 font-mono flex items-center gap-2"><span>✖</span> {e} returned non-zero exit code</li>)}
                    </ul>
                 ) : (
                   <p className="text-[10px] text-emerald-500 italic">All brain modules passed dry-run verification.</p>
                 )}
              </div>
            </section>
          </div>
        </div>

        <div className="bg-slate-800/30 p-6 border-t border-slate-700 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded-xl transition-all uppercase tracking-widest"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default HealthReportModal;
