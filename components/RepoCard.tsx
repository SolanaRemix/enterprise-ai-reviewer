
import React, { useState } from 'react';
import { Diagnosis, AutopsyReport, PhaseState } from '../types';
import StatusBadge from './StatusBadge';
import { RepoBrainAI } from '../services/geminiService';
import { GithubService } from '../services/githubService';

interface Props {
  repo: Diagnosis;
  onViewLogs: (logs: string[]) => void;
  onViewAutopsy: (report: AutopsyReport) => void;
  onOpenActionModal: (repo: Diagnosis) => void;
  onPRCreated?: (repoName: string, prUrl: string) => void;
}

const RepoCard: React.FC<Props> = ({ repo, onViewLogs, onViewAutopsy, onOpenActionModal, onPRCreated }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [prLoading, setPrLoading] = useState(false);
  const [prStep, setPrStep] = useState<string | null>(null);

  const score = repo.healthScore || 0;

  const fetchInsight = async () => {
    setLoading(true);
    const ai = new RepoBrainAI();
    const result = await ai.analyzeRepo(repo);
    setInsight(result);
    setLoading(false);
  };

  const handleVercelTroubleshoot = async () => {
    setLoading(true);
    const ai = new RepoBrainAI();
    const result = await ai.troubleshootVercelDeployment(repo.lastRunLogs || ["No logs found."]);
    setInsight(`🚀 VERCEL ADVISORY: ${result}`);
    setLoading(false);
  };

  const handleCreatePR = async () => {
    setPrLoading(true);
    const ai = new RepoBrainAI();
    const gh = new GithubService();
    const logs: string[] = [...(repo.lastRunLogs || [])];
    
    const logStep = (msg: string) => {
      logs.push(`[${new Date().toLocaleTimeString()}] ${msg}`);
      onViewLogs([...logs]);
    };

    try {
      setPrStep("AI Drafting...");
      logStep("🧠 Consulting Oracle for PR Genome...");
      const proposal = await ai.generatePRProposal(repo);
      logStep(`✅ Proposal generated: "${proposal.title}"`);

      setPrStep("GitHub Handshake...");
      logStep("🐙 Initiating PR creation on organization fleet...");
      const pr = await gh.createPR(repo.repo, `brain/normalization-${Date.now()}`, proposal.title, proposal.body);
      
      setPrStep("Governance Tags...");
      logStep("🛡️ Applying MERMEDA v2.2 governance labels...");
      await gh.applyLabels(repo.repo, pr.id, ["governance", "mermeda-v2.2", "automerge", "ai-fixed"]);

      setPrStep("Posting Advisory...");
      logStep("📜 Posting surgical advisory for reviewers...");
      await gh.postComment(repo.repo, pr.id, `**AI Guard Advisory**: This PR resolves detected structural drift and pathological patterns. Score: ${score}/100.`);

      logStep(`🏁 Admission complete. PR #${pr.id} live.`);
      if (onPRCreated) onPRCreated(repo.repo, pr.url);
      setInsight(`🚀 REPAIR COMPLETE: PR #${pr.id} is pending review.`);
    } catch (error) {
      logStep("❌ PR Negotiation Failed.");
      setInsight("❌ PR Creation Failed. Terminal trace available.");
    } finally {
      setPrLoading(false);
      setPrStep(null);
    }
  };

  const getPhaseColor = (status: PhaseState) => {
    switch (status) {
      case 'SUCCESS': return 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.2)]';
      case 'FAILED': return 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.4)] animate-pulse';
      case 'RUNNING': return 'bg-blue-500 animate-pulse';
      case 'SKIPPED': return 'bg-slate-700';
      case 'PENDING': return 'bg-slate-800 border border-slate-700';
      default: return 'bg-slate-800';
    }
  };

  const getPrBadgeStyle = (status: string) => {
    switch (status) {
      case 'MERGED': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'OPEN': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'DRAFT': return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      default: return 'hidden';
    }
  };

  const scoreColor = score > 80 ? 'text-emerald-500' : score > 50 ? 'text-amber-500' : 'text-rose-500';

  return (
    <div className={`group bg-slate-900/40 border ${repo.status === 'RED' ? 'border-rose-500/40 bg-rose-500/[0.03]' : 'border-slate-800/80'} rounded-[1.25rem] sm:rounded-[2rem] p-4 sm:p-6 md:p-8 hover:border-blue-500/40 hover:bg-slate-900/60 transition-all duration-500 flex flex-col shadow-2xl relative overflow-hidden h-full`}>
      <div className={`absolute top-0 right-0 w-24 sm:w-48 h-24 sm:h-48 ${repo.status === 'RED' ? 'bg-rose-500/10' : 'bg-blue-500/5'} blur-[40px] sm:blur-[60px] pointer-events-none transition-colors duration-1000`}></div>
      
      <div className="flex justify-between items-start mb-4 md:mb-6 gap-3 sm:gap-4">
        <div className="flex gap-3 sm:gap-4 md:gap-6 min-w-0">
          <div className="relative shrink-0">
            <div className={`w-10 h-10 sm:w-14 sm:h-14 md:w-20 md:h-20 bg-slate-950 rounded-xl sm:rounded-2xl md:rounded-3xl flex items-center justify-center text-xl sm:text-3xl md:text-5xl shadow-inner border border-white/5 transition-all group-hover:rotate-6 ${repo.status === 'RED' ? 'border-rose-500/30' : ''}`}>
              {repo.languages.includes('solidity') ? '⚖️' : repo.languages.includes('python') ? '🐍' : repo.languages.includes('node') ? '💿' : '📡'}
            </div>
            {/* Health Score Gauge */}
            <div className="absolute -bottom-1.5 -right-1.5 sm:-bottom-2 sm:-right-2 bg-slate-900 border border-slate-800 rounded-full px-1.5 sm:px-2 py-0.5 shadow-xl">
              <span className={`text-[8px] sm:text-[10px] font-black ${scoreColor}`}>{score}</span>
            </div>
          </div>
          <div className="min-w-0 flex flex-col justify-center">
            <h3 className="text-sm sm:text-base md:text-2xl font-black text-white tracking-tighter truncate uppercase italic leading-tight">{repo.repo}</h3>
            <div className="flex items-center flex-wrap gap-1.5 sm:gap-2 mt-1 sm:mt-2">
               <span className="text-slate-500 text-[7px] sm:text-[10px] md:text-[11px] font-black uppercase tracking-widest opacity-70">
                 {repo.framework !== 'none' ? repo.framework : 'Standalone'}
               </span>
               {repo.ci === 'github-actions' && (
                 <span className="text-emerald-500 text-[6px] sm:text-[8px] font-black uppercase tracking-widest bg-emerald-500/10 px-1 sm:px-1.5 py-0.5 rounded border border-emerald-500/20">CI</span>
               )}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <StatusBadge status={repo.status} />
          {repo.prStatus !== 'NONE' && (
            <span className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[6px] sm:text-[8px] font-black border uppercase tracking-tighter ${getPrBadgeStyle(repo.prStatus)}`}>
              {repo.prStatus}
            </span>
          )}
        </div>
      </div>

      <div className="mb-4">
        <div className="w-full bg-slate-800 h-1 md:h-1.5 rounded-full overflow-hidden mb-1 sm:mb-1.5">
          <div className={`h-full ${score > 80 ? 'bg-emerald-500' : score > 50 ? 'bg-amber-500' : 'bg-rose-500'} transition-all duration-1000`} style={{ width: `${score}%` }}></div>
        </div>
        <div className="flex justify-between text-[7px] sm:text-[8px] font-black text-slate-500 uppercase tracking-widest">
          <span>Health Index</span>
          <span className={scoreColor}>{score}/100</span>
        </div>
      </div>

      <p className="text-slate-400 text-[10px] sm:text-xs md:text-sm mb-4 md:mb-6 font-medium leading-relaxed italic opacity-80 min-h-[2.5em] md:min-h-[3em]">{repo.reason}</p>

      <div className="mb-4 md:mb-6 p-3 md:p-4 bg-slate-950/60 rounded-xl md:rounded-[2rem] border border-slate-800/50 shadow-inner">
        <p className="text-[7px] sm:text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-slate-500 font-black mb-2 md:mb-3">Phase Grid (P18 Active)</p>
        <div className="grid grid-cols-6 sm:grid-cols-9 gap-1 sm:gap-1.5 md:gap-2">
          {repo.phases?.map((p) => (
            <div 
              key={p.id} 
              title={`P${p.id}: ${p.name}`}
              className={`w-full aspect-square rounded-[3px] sm:rounded-md md:rounded-lg ${getPhaseColor(p.status)} transition-all cursor-help hover:scale-110 relative group/phase`}
            >
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover/phase:opacity-100 transition-opacity bg-slate-950 border border-slate-800 px-2 py-1 rounded-md text-[6px] sm:text-[8px] font-black uppercase tracking-widest text-slate-100 whitespace-nowrap z-20 pointer-events-none shadow-2xl">
                {p.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto space-y-2 sm:space-y-3">
        {insight && (
          <div className="p-3 sm:p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] md:text-xs text-blue-300 italic animate-in fade-in slide-in-from-bottom-2 shadow-inner">
             {insight}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <button 
            onClick={() => onViewLogs(repo.lastRunLogs || [])}
            className="px-2 sm:px-4 py-2 sm:py-3 bg-slate-950 border border-slate-800 text-slate-400 hover:text-white text-[7px] sm:text-[8px] md:text-[10px] font-black uppercase tracking-widest rounded-lg sm:rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1.5 md:gap-2"
          >
            <span>📜</span> Run Logs
          </button>
          
          {repo.status === 'RED' && repo.autopsyReport ? (
            <button 
              onClick={() => onViewAutopsy(repo.autopsyReport!)}
              className="px-2 sm:px-4 py-2 sm:py-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white text-[7px] sm:text-[8px] md:text-[10px] font-black uppercase tracking-widest rounded-lg sm:rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1.5 md:gap-2"
            >
              <span>🔪</span> Autopsy
            </button>
          ) : (
            <button 
              onClick={() => onOpenActionModal(repo)}
              className="px-2 sm:px-4 py-2 sm:py-3 bg-slate-950 border border-slate-800 text-slate-400 hover:text-white text-[7px] sm:text-[8px] md:text-[10px] font-black uppercase tracking-widest rounded-lg sm:rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1.5 md:gap-2"
            >
              <span>🤖</span> YAML
            </button>
          )}

          {repo.status === 'AUTO_FIXABLE' && (
            <button 
              onClick={handleCreatePR}
              disabled={prLoading}
              className={`col-span-2 px-3 sm:px-4 py-2.5 sm:py-3 ${prLoading ? 'bg-slate-800 text-slate-500' : 'bg-blue-600 hover:bg-blue-500 text-white'} text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-lg sm:rounded-xl transition-all active:scale-95 shadow-xl flex items-center justify-center gap-2 md:gap-3`}
            >
              {prLoading ? (
                <>
                  <div className="w-3 h-3 border-2 border-slate-500 border-t-transparent rounded-full animate-spin"></div>
                  <span>{prStep || 'Working...'}</span>
                </>
              ) : (
                <><span>🐙</span> Wire PR Repair</>
              )}
            </button>
          )}

          <button 
            onClick={fetchInsight}
            disabled={loading}
            className={`px-2 sm:px-4 py-2 sm:py-3 bg-slate-800 hover:bg-slate-700 text-white text-[7px] sm:text-[8px] md:text-[10px] font-black uppercase tracking-widest rounded-lg sm:rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1.5 md:gap-2 shadow-lg ${repo.framework === 'next' ? 'col-span-1' : 'col-span-2'}`}
          >
            {loading ? '...' : '✨ Oracle'}
          </button>

          {repo.framework === 'next' && (
             <button 
              onClick={handleVercelTroubleshoot}
              disabled={loading}
              className="col-span-1 px-2 sm:px-4 py-2 sm:py-3 bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500 hover:text-white text-[7px] sm:text-[8px] md:text-[10px] font-black uppercase tracking-widest rounded-lg sm:rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1.5 md:gap-2"
            >
              <span>🚀</span> Vercel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RepoCard;
