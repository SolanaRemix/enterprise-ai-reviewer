
import { GoogleGenAI } from "@google/genai";
import { 
  Diagnosis, 
  GenomeReport, 
  AutopsyReport, 
  ImmunizerReport, 
  VitalsReport, 
  BlackboxRecording, 
  FirewallReport 
} from "../types";

export class RepoBrainAI {
  private ai: GoogleGenAI;

  constructor() {
    // Initializing the Gemini API client with the environment API key.
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  // Analyzes a single repository status and provides a repair recommendation.
  async analyzeRepo(repo: Diagnosis) {
    const prompt = `
      You are CAST BRAIN, the autonomous repository governance bot.
      Analyze this repository status:
      Repo: ${repo.repo}, Status: ${repo.status}, Reason: ${repo.reason}
      Stack: ${repo.languages.join(', ')} / ${repo.framework}
      Provide a concise 1-sentence strategic repair recommendation.
    `;
    try {
      const res = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
      return res.text || "Unable to sync AI insight.";
    } catch (e) { 
      console.error(e);
      return "Unable to sync AI insight."; 
    }
  }

  // Generates a professional, context-aware PR title and description.
  async generatePRProposal(repo: Diagnosis) {
    const prompt = `
      You are the CyberAI Oracle for Repo Brain Hospital v2.2.
      Generate a GitHub Pull Request title and a detailed Markdown body for the following repository:
      Repo: ${repo.repo}
      Framework: ${repo.framework}
      Issue: ${repo.reason}
      Governance: MERMEDA v2.2 Compliance Standards
      Health Score: ${repo.healthScore}/100
      
      The PR should sound autonomous, surgical, and authoritative. 
      Mention that this is part of the v2.2 Oracle Network Protocol.
      Format the output as a JSON object: { "title": "...", "body": "..." }
    `;
    try {
      const res = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });
      return JSON.parse(res.text || '{"title": "chore: infrastructure normalization", "body": "Automatic update."}');
    } catch (e) {
      console.error(e);
      return { 
        title: `chore: stabilize ${repo.repo} infrastructure`, 
        body: "Automated PR to align with MERMEDA v2.2 spec." 
      };
    }
  }

  // AI Troubleshooter for execution logs.
  async troubleshootLogs(logs: string[]) {
    const prompt = `
      You are the SmartBrain AI Oracle for REPO BRAIN HOSPITAL.
      Analyze these execution logs and provide a 2-step surgical solution.
      Logs:
      ${logs.slice(-20).join('\n')}
    `;
    try {
      const res = await this.ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: prompt,
      });
      return res.text || "Diagnosis logic failed. Check connectivity.";
    } catch (e) { 
      console.error(e);
      return "Diagnosis logic failed. Check connectivity."; 
    }
  }

  // Specialized analysis for Vercel build failures.
  async troubleshootVercelDeployment(logs: string[]) {
    const prompt = `
      Analyze these Vercel/Next.js build logs for pathological patterns (OOM, missing envs, path conflicts).
      Logs:
      ${logs.join('\n')}
      Provide a surgical 1-line shell command to fix the issue if possible, or a direct explanation.
    `;
    try {
      const res = await this.ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: prompt,
      });
      return res.text || "Vercel diagnostic signal lost.";
    } catch (e) { return "Vercel diagnostic signal lost."; }
  }

  // Strategic overview for the entire fleet.
  async getFleetHealthOverview(fleet: Diagnosis[]) {
    const summary = fleet.map(r => `${r.repo} [${r.status}]: ${r.reason}`).join('\n');
    const prompt = `
      You are CAST BRAIN Strategic Controller. Fleet Summary:
      ${summary}
      Provide a 3-point strategic directive for the fleet over the next 48 hours.
    `;
    try {
      const res = await this.ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: prompt,
        config: { thinkingConfig: { thinkingBudget: 4000 } }
      });
      return res.text || "Strategic signal lost.";
    } catch (e) { 
      console.error(e);
      return "Strategic signal lost."; 
    }
  }

  async analyzeGenome(report: GenomeReport) {
    const prompt = `Analyze this genome evolution report from version ${report.from} to ${report.to}. 
    Changes: ${JSON.stringify(report.changes)}. 
    Summarize the evolutionary impact in 2 sentences.`;
    try {
      const res = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
      return res.text || "Genome interpretation offline.";
    } catch (e) { return "Genome interpretation offline."; }
  }

  async analyzeAutopsy(report: AutopsyReport) {
    const prompt = `Analyze this brain autopsy report for run ${report.runId}. 
    Traces: ${JSON.stringify(report.traces)}. 
    Provide a 1-sentence forensic conclusion.`;
    try {
      const res = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
      return res.text || "Autopsy analysis failed.";
    } catch (e) { return "Autopsy analysis failed."; }
  }

  async analyzeIntegrity(report: ImmunizerReport) {
    const prompt = `Analyze this integrity report. Locked: ${report.locked}, Integrity OK: ${report.integrityOk}. 
    Files protected: ${report.filesProtected}. Hash: ${report.hash}. 
    Give a 1-sentence security assurance statement.`;
    try {
      const res = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
      return res.text || "Integrity signal blocked.";
    } catch (e) { return "Integrity signal blocked."; }
  }

  async analyzeVitals(vitals: VitalsReport) {
    const prompt = `Analyze repo vitals: ${JSON.stringify(vitals)}. 
    Provide a 1-sentence interpretation of build efficiency and repository health.`;
    try {
      const res = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
      return res.text || "Vitals interpretation failed.";
    } catch (e) { return "Vitals interpretation failed."; }
  }

  async analyzeBlackbox(recording: BlackboxRecording) {
    const prompt = `Analyze this blackbox recording (Run ID: ${recording.runId}). 
    Git status: ${recording.gitStatus}. 
    Provide a 1-sentence operational summary.`;
    try {
      const res = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
      return res.text || "Blackbox replay failed.";
    } catch (e) { return "Blackbox replay failed."; }
  }

  async analyzeFirewall(report: FirewallReport) {
    const prompt = `Analyze this firewall report. Active rules: ${JSON.stringify(report.activeRules)}. 
    Intercepted files: ${report.lastInterceptedFiles.join(', ')}. 
    Provide a 1-sentence threat assessment.`;
    try {
      const res = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
      return res.text || "Firewall audit offline.";
    } catch (e) { return "Firewall audit offline."; }
  }
}
