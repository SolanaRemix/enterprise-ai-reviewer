
import { RepoStatus, Framework, Diagnosis, HealthReport, GenomeReport, AutopsyReport, ImmunizerReport, FleetData, VitalsReport, BlackboxRecording, FirewallReport, PhaseResult } from './types';

export const SYSTEM_VERSION = 'v2.2.0';

export const MERMEDA_PHASES: string[] = [
  "detect", "scan-actions", "frameworks", "frameworks.ci", "solidity.detect",
  "solidity.ci", "rust", "normalize", "diagnose", "fix.safe",
  "verify", "ai.guard", "neural.bridge", "motor.function", "greenlock", "guard", "fleet", "test-suite"
];

const generatePhases = (status: RepoStatus): PhaseResult[] => {
  return MERMEDA_PHASES.map((name, i) => {
    let phaseStatus: any = 'SUCCESS';
    if (status === RepoStatus.RED && i === 12) phaseStatus = 'FAILED';
    if (status === RepoStatus.AUTO_FIXABLE && i >= 9) phaseStatus = 'PENDING';
    if (i > 12 && status === RepoStatus.RED) phaseStatus = 'SKIPPED';
    return { id: i + 1, name, status: phaseStatus };
  });
};

export const MOCK_AUTOPSY: AutopsyReport = {
  runId: 'AUTOPSY-2024-05-25',
  timestamp: new Date().toISOString(),
  treeSnapshot: ['.repo-brain/brain.run.sh', 'MERMEDA.md'],
  capturedFiles: ['diagnosis.json', 'detect.json'],
  traces: {
    'brain.detect.sh': '+ Detect languages...\n+ languages=(node python)\n✅ Success',
    'brain.ai.guard.sh': '+ Scanning for secrets...\n+ Found RISK: main.py:12\n⚠️ Flagged',
    'brain.neural.bridge.sh': '🤖 [Neural Bridge Grafting] Syncing GITHUB_TOKEN loop...',
    'brain.motor.function.sh': '⚙️ [Motor Function] Hardhat motor check complete. Stable.'
  },
  envKeys: ['PATH', 'JQ_BIN', 'BRAIN_ROOT', 'GITHUB_TOKEN', 'REPO_BRAIN_ACCESS_TOKEN']
};

export const MOCK_REPOS: Diagnosis[] = [
  {
    repo: 'nexus-api',
    status: RepoStatus.GREEN,
    reason: 'Infrastructure matches MERMEDA v2.2 spec. CI/CD verified via brain.verify.sh.',
    languages: ['node', 'typescript'],
    framework: Framework.NEXT,
    ci: 'github-actions',
    timestamp: new Date().toISOString(),
    workflows: ['ci.yml', 'deploy.yml'],
    jobs: ['build', 'test', 'deploy'],
    phases: generatePhases(RepoStatus.GREEN),
    prStatus: 'MERGED',
    prUrl: 'https://github.com/org/nexus-api/pull/42',
    automergeEnabled: true,
    healthScore: 98,
    lastRunLogs: [
      '🧠 [BRAIN] Phase 1-3: Detection completed (Node/Next)',
      '🧠 [BRAIN] Phase 14: Neural Bridge Grafting (Restored loop)',
      '🧠 [BRAIN] Phase 11: Verification (Success)',
      '✅ 18/18 phases successful'
    ]
  },
  {
    repo: 'vault-service',
    status: RepoStatus.RED,
    reason: 'AI Guard flagged unsafe patterns or secrets: Hardcoded API key in main.py.',
    languages: ['python'],
    framework: Framework.NONE,
    ci: 'github-actions',
    timestamp: new Date().toISOString(),
    aiGuardComments: [
      'CRITICAL: Hardcoded OPENAI_API_KEY detected in main.py:12',
      'RISK: Unsafe os.system usage detected in shell_utils.py'
    ],
    vulnerabilities: 2,
    workflows: ['ci.yml'],
    phases: generatePhases(RepoStatus.RED),
    prStatus: 'NONE',
    automergeEnabled: false,
    healthScore: 32,
    lastRunLogs: [
      '🧠 [BRAIN] Phase 13: AI Guard scan initiated...',
      '❌ [ai-guard] Flagged: main.py',
      '⚠️ Phase 13 failed security check: Pathological secret leak detected.',
      '🩺 [ORACLE] Diagnosis: Neural Leakage.'
    ],
    autopsyReport: MOCK_AUTOPSY
  },
  {
    repo: 'contracts-core',
    status: RepoStatus.AUTO_FIXABLE,
    reason: 'Missing CI configuration. Normalization required.',
    languages: ['solidity'],
    framework: Framework.NONE,
    ci: 'none',
    timestamp: new Date().toISOString(),
    workflows: [],
    phases: generatePhases(RepoStatus.AUTO_FIXABLE),
    prStatus: 'NONE',
    automergeEnabled: false,
    automergeRules: ['CI Pass', 'AI Guard Clear'],
    healthScore: 65,
    lastRunLogs: [
      '🧠 [BRAIN] Phase 9: Diagnosis (AUTO_FIXABLE)',
      '⚙️ [Hardhat Motor Function Test] npx hardhat compile...',
      '✅ Typebindings generated successfully.',
      '🛠️ [fix-safe] Correcting workflow path for Hardhat'
    ],
    web3Stack: ['ethers.js', 'hardhat', 'solc']
  },
  {
    repo: 'nuxt-frontend',
    status: RepoStatus.GREEN,
    reason: 'Nuxt 3 engine verified with Nuxi build optimization.',
    languages: ['node', 'vue'],
    framework: Framework.NUXT,
    ci: 'github-actions',
    timestamp: new Date().toISOString(),
    phases: generatePhases(RepoStatus.GREEN),
    prStatus: 'NONE',
    automergeEnabled: true,
    healthScore: 92,
    workflows: ['ci.yml']
  },
  {
    repo: 'angular-dash',
    status: RepoStatus.AUTO_FIXABLE,
    reason: 'Legacy Angular structure detected. Modernizing build pipeline.',
    languages: ['node', 'typescript'],
    framework: Framework.ANGULAR,
    ci: 'none',
    timestamp: new Date().toISOString(),
    phases: generatePhases(RepoStatus.AUTO_FIXABLE),
    prStatus: 'NONE',
    automergeEnabled: false,
    healthScore: 78
  },
  {
    repo: 'rust-engine',
    status: RepoStatus.GREEN,
    reason: 'Rust toolchain and components verified.',
    languages: ['rust'],
    framework: Framework.NONE,
    ci: 'github-actions',
    timestamp: new Date().toISOString(),
    phases: generatePhases(RepoStatus.GREEN),
    prStatus: 'NONE',
    automergeEnabled: false,
    healthScore: 100,
    workflows: ['rust-ci.yml']
  }
];

export const MOCK_HEALTH_REPORT: HealthReport = {
  timestamp: new Date().toISOString(),
  mermedaPresent: true,
  jqPresent: true,
  nodePresent: true,
  fallbackPresent: true,
  missingScripts: [],
  notExecutable: [],
  dryRunErrors: []
};

export const MOCK_VITALS: VitalsReport = {
  repoSize: "1.2G",
  fileCount: "14,502",
  largestDirs: "/node_modules (800M); /dist (200M); /src (150M); /public (50M); /.git (2M)",
  commitCount: "1,240",
  lastCommitAge: "2 hours ago",
  testDurationSec: 45,
  buildDurationSec: 120
};

export const MOCK_FIREWALL: FirewallReport = {
  installed: true,
  activeRules: [
    { pattern: 'OPENAI_API_KEY', severity: 'CRITICAL', description: 'Leakage of LLM secrets' },
    { pattern: 'child_process', severity: 'WARNING', description: 'Unsafe Shell execution' },
    { pattern: 'eval(', severity: 'CRITICAL', description: 'Arbitrary code injection' }
  ],
  lastInterceptedFiles: ['config/test_secrets.env', 'src/legacy_shell.py']
};

export const MOCK_BLACKBOX: BlackboxRecording = {
  runId: 'REC-20240525-001',
  timestamp: new Date().toISOString(),
  env: 'USER=brain\nPATH=/usr/local/bin:/usr/bin\nSHELL=/bin/bash\nBRAIN_VERSION=2.2.0\nGITHUB_TOKEN=REDACTED',
  gitStatus: 'On branch main\nnothing to commit, working tree clean',
  gitLog: 'commit f2b3c4d (HEAD -> main)\nAuthor: Oracle Bot <oracle@repo-brain.ai>\nDate: Sat May 25 10:00:00 2024 +0000',
  trace: '+ [brain.run.sh:12] log "Starting brain.run.sh V2.2"\n+ [brain.run.sh:22] brain.neural.bridge.sh\n✅ Loop Restored'
};

export const MOCK_GENOME: GenomeReport = {
  from: 'v2.1.0',
  to: 'v2.2.0',
  changes: [
    { file: 'brain.test.sh', change: 'added' },
    { file: 'brain.vercel.troubleshoot.sh', change: 'added' },
    { file: 'brain.run.sh', change: 'modified' },
    { file: 'brain.guard.sh', change: 'modified' }
  ]
};

export const MOCK_IMMUNIZER: ImmunizerReport = {
  locked: true,
  hashFound: true,
  integrityOk: true,
  lastLockedAt: new Date().toISOString(),
  filesProtected: 21,
  hash: 'sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
};

export const FLEET_SUMMARY: FleetData = {
  generatedAt: new Date().toISOString(),
  repos: MOCK_REPOS
};
