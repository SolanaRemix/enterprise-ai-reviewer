import React from 'react';
import { Diagnosis } from '../types';

interface Props {
  repo: Diagnosis;
  onClose: () => void;
}

const ActionWorkflowModal: React.FC<Props> = ({ repo, onClose }) => {
  const yamlContent = `name: CAST BRAIN - Autonomous Governance

on:
  push:
    branches: [ main, master ]
  pull_request:
  schedule:
    - cron: '0 0 * * *' # Daily Deep Scan

jobs:
  mermeda-governance:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Initialize .repo-brain
        run: ./.repo-brain/install.sh

      - name: Execute Phase 1-15 Pipeline
        run: ./.repo-brain/brain.run.sh

      - name: AI Guard Security Analysis
        if: always()
        run: ./.repo-brain/brain.ai.guard.sh

      - name: Auto-PR Fixes
        if: github.event_name == 'push' && success()
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
        run: |
          if [ -f .repo-brain/diagnosis.json ]; then
            STATUS=$(jq -r .status .repo-brain/diagnosis.json)
            if [ "$STATUS" == "AUTO_FIXABLE" ]; then
              ./.repo-brain/brain.auto-pr.sh
            fi
          fi

      - name: Greenlock Seal
        if: success()
        run: ./.repo-brain/brain.greenlock.sh
`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/95 backdrop-blur-xl">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 shadow-[0_0_100px_rgba(0,0,0,0.8)] rounded-[2.5rem] overflow-hidden flex flex-col h-[85vh]">
        <div className="bg-slate-800/30 px-8 py-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-4">
            <span className="text-2xl">🤖</span>
            <div>
              <h2 className="text-lg font-black text-white tracking-tighter uppercase italic leading-none">GitHub Action Logic</h2>
              <p className="text-[10px] text-slate-500 font-mono font-bold tracking-widest uppercase mt-1">{repo.repo} — .github/workflows/brain.yml</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors text-2xl">✕</button>
        </div>

        <div className="flex-1 overflow-hidden p-8 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500">Pipeline YAML Specification</h3>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(yamlContent);
                alert("YAML copied to clipboard");
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-[10px] font-black uppercase tracking-widest text-blue-400 rounded-lg transition-all"
            >
              Copy YAML
            </button>
          </div>

          <div className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl p-6 overflow-y-auto custom-scrollbar font-mono text-sm leading-relaxed text-blue-400/80">
            <pre className="whitespace-pre-wrap">{yamlContent}</pre>
          </div>

          <div className="p-4 bg-blue-600/5 border border-blue-500/20 rounded-xl flex items-center gap-4">
             <span className="text-xl">ℹ️</span>
             <p className="text-[11px] text-blue-300 font-medium italic">
                This action runs the 15-phase MERMEDA protocol autonomously. If fixes are detected, it will automatically wire a PR and, if configured, trigger automerge.
             </p>
          </div>
        </div>

        <div className="p-8 bg-slate-800/20 border-t border-slate-800 flex justify-end">
          <button 
            onClick={onClose}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black rounded-xl transition-all uppercase tracking-widest shadow-2xl active:scale-95"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionWorkflowModal;