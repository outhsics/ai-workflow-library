#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const defaultRulesPath = path.join(repoRoot, 'config', 'agent-config-rules.json');

function printHelp() {
  console.log(`Usage: node scripts/install-agent-config-auto.mjs --agent <claude|codex> [--target <dir>] [--profile <aggressive|conservative>] [--force]\n\nOptions:\n  --agent    Agent type: claude or codex\n  --target   Target project directory, defaults to current directory\n  --profile  Optional manual override of detected profile\n  --force    Overwrite existing file if present\n  --help     Show this help message`);
}

function parseArgs(argv) {
  const result = {
    agent: '',
    target: process.cwd(),
    profile: '',
    force: false,
    help: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      result.help = true;
      continue;
    }
    if (arg === '--force') {
      result.force = true;
      continue;
    }
    if (arg === '--agent' || arg === '--target' || arg === '--profile') {
      const value = argv[i + 1];
      if (!value) {
        throw new Error(`Missing value for ${arg}`);
      }
      result[arg.slice(2)] = value;
      i += 1;
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }

  return result;
}

function readRules(targetDir) {
  const projectRulesPath = path.join(targetDir, '.agent-config-rules.json');
  const defaults = JSON.parse(fs.readFileSync(defaultRulesPath, 'utf8'));
  if (!fs.existsSync(projectRulesPath)) {
    return defaults;
  }
  const projectRules = JSON.parse(fs.readFileSync(projectRulesPath, 'utf8'));
  return {
    forcedConservativeRepos: [...(defaults.forcedConservativeRepos || []), ...(projectRules.forcedConservativeRepos || [])],
    forcedAggressiveRepos: [...(defaults.forcedAggressiveRepos || []), ...(projectRules.forcedAggressiveRepos || [])],
    conservativePathPatterns: [...defaults.conservativePathPatterns, ...(projectRules.conservativePathPatterns || [])],
    aggressivePathPatterns: [...defaults.aggressivePathPatterns, ...(projectRules.aggressivePathPatterns || [])],
    conservativeRepoPatterns: [...defaults.conservativeRepoPatterns, ...(projectRules.conservativeRepoPatterns || [])],
    aggressiveRepoPatterns: [...defaults.aggressiveRepoPatterns, ...(projectRules.aggressiveRepoPatterns || [])],
  };
}

function safeGit(args, cwd) {
  try {
    return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return '';
  }
}

function collectSignals(targetDir) {
  const normalizedPath = targetDir.toLowerCase();
  const repoName = path.basename(targetDir).toLowerCase();
  const remote = safeGit(['config', '--get', 'remote.origin.url'], targetDir).toLowerCase();
  const branch = safeGit(['branch', '--show-current'], targetDir).toLowerCase();
  const files = [
    'schema.prisma',
    'prisma/schema.prisma',
    'db/schema.sql',
    'migrations',
    'supabase',
    'docker-compose.yml',
    'k8s',
    '.github/workflows',
    'terraform',
    'pulumi',
  ];
  const presentFiles = files.filter((name) => fs.existsSync(path.join(targetDir, name)));
  return {
    normalizedPath,
    repoName,
    remote,
    branch,
    presentFiles,
    repoSlug: extractRepoSlug(remote),
  };
}

function includesAny(haystack, needles) {
  return needles.filter((needle) => haystack.includes(String(needle).toLowerCase()));
}

function extractRepoSlug(remote) {
  if (!remote) {
    return '';
  }
  const normalized = remote.replace(/\.git$/, '');
  const sshMatch = normalized.match(/github\.com[:/]([^/]+\/[^/]+)$/);
  if (sshMatch) {
    return sshMatch[1].toLowerCase();
  }
  const httpsMatch = normalized.match(/github\.com\/([^/]+\/[^/]+)$/);
  if (httpsMatch) {
    return httpsMatch[1].toLowerCase();
  }
  return '';
}

function detectProfile(targetDir, rules) {
  const signals = collectSignals(targetDir);
  const reasons = [];
  let conservativeScore = 0;
  let aggressiveScore = 0;

  const forcedConservative = (rules.forcedConservativeRepos || []).map((item) => String(item).toLowerCase());
  const forcedAggressive = (rules.forcedAggressiveRepos || []).map((item) => String(item).toLowerCase());

  if (signals.repoSlug && forcedConservative.includes(signals.repoSlug)) {
    return {
      profile: 'conservative',
      reasons: [`repo slug forced conservative: ${signals.repoSlug}`],
      conservativeScore: Number.POSITIVE_INFINITY,
      aggressiveScore: Number.NEGATIVE_INFINITY,
    };
  }

  if (signals.repoSlug && forcedAggressive.includes(signals.repoSlug)) {
    return {
      profile: 'aggressive',
      reasons: [`repo slug forced aggressive: ${signals.repoSlug}`],
      conservativeScore: Number.NEGATIVE_INFINITY,
      aggressiveScore: Number.POSITIVE_INFINITY,
    };
  }

  for (const match of includesAny(signals.normalizedPath, rules.conservativePathPatterns)) {
    conservativeScore += 2;
    reasons.push(`path matched conservative pattern: ${match}`);
  }
  for (const match of includesAny(signals.normalizedPath, rules.aggressivePathPatterns)) {
    aggressiveScore += 2;
    reasons.push(`path matched aggressive pattern: ${match}`);
  }
  for (const match of includesAny(signals.repoName, rules.conservativeRepoPatterns)) {
    conservativeScore += 2;
    reasons.push(`repo name matched conservative pattern: ${match}`);
  }
  for (const match of includesAny(signals.repoName, rules.aggressiveRepoPatterns)) {
    aggressiveScore += 2;
    reasons.push(`repo name matched aggressive pattern: ${match}`);
  }
  for (const match of includesAny(signals.remote, rules.conservativeRepoPatterns)) {
    conservativeScore += 1;
    reasons.push(`remote matched conservative pattern: ${match}`);
  }
  for (const match of includesAny(signals.remote, rules.aggressiveRepoPatterns)) {
    aggressiveScore += 1;
    reasons.push(`remote matched aggressive pattern: ${match}`);
  }

  if (signals.presentFiles.length > 0) {
    conservativeScore += 2;
    reasons.push(`detected infra or data files: ${signals.presentFiles.join(', ')}`);
  }

  if (signals.branch === 'main' || signals.branch === 'master') {
    conservativeScore += 1;
    reasons.push(`current branch is ${signals.branch}`);
  }

  const profile = conservativeScore >= aggressiveScore ? 'conservative' : 'aggressive';
  return { profile, reasons, conservativeScore, aggressiveScore };
}

try {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    printHelp();
    process.exit(0);
  }
  if (!['claude', 'codex'].includes(options.agent)) {
    throw new Error('`--agent` must be `claude` or `codex`');
  }
  if (options.profile && !['aggressive', 'conservative'].includes(options.profile)) {
    throw new Error('`--profile` must be `aggressive` or `conservative`');
  }

  const targetDir = path.resolve(options.target);
  if (!fs.existsSync(targetDir) || !fs.statSync(targetDir).isDirectory()) {
    throw new Error(`Target directory not found: ${targetDir}`);
  }

  const rules = readRules(targetDir);
  const detected = detectProfile(targetDir, rules);
  const profile = options.profile || detected.profile;

  const args = [
    path.join(repoRoot, 'scripts', 'install-agent-config.mjs'),
    '--agent', options.agent,
    '--profile', profile,
    '--target', targetDir,
  ];
  if (options.force) {
    args.push('--force');
  }

  execFileSync('node', args, { stdio: 'inherit' });
  console.log(`Auto-selected profile: ${profile}`);
  if (detected.reasons.length > 0) {
    console.log('Reasons:');
    for (const reason of detected.reasons) {
      console.log(`- ${reason}`);
    }
  }
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
