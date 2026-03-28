#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function printHelp() {
  console.log(`Usage: node scripts/install-agent-config.mjs --agent <claude|codex> --profile <aggressive|conservative> [--target <dir>] [--force]\n\nOptions:\n  --agent    Agent type: claude or codex\n  --profile  Profile type: aggressive or conservative\n  --target   Target project directory, defaults to current directory\n  --force    Overwrite existing file if present\n  --help     Show this help message`);
}

function parseArgs(argv) {
  const result = {
    agent: '',
    profile: '',
    target: process.cwd(),
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
    if (arg === '--agent' || arg === '--profile' || arg === '--target') {
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

try {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    printHelp();
    process.exit(0);
  }

  if (!['claude', 'codex'].includes(options.agent)) {
    throw new Error('`--agent` must be `claude` or `codex`');
  }

  if (!['aggressive', 'conservative'].includes(options.profile)) {
    throw new Error('`--profile` must be `aggressive` or `conservative`');
  }

  const templateName = `${options.agent}-${options.profile}.md`;
  const templatePath = path.join(repoRoot, 'templates', 'agent-configs', templateName);
  const targetDir = path.resolve(options.target);
  const outputName = options.agent === 'claude' ? 'CLAUDE.md' : 'AGENTS.md';
  const outputPath = path.join(targetDir, outputName);

  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template not found: ${templatePath}`);
  }

  if (!fs.existsSync(targetDir) || !fs.statSync(targetDir).isDirectory()) {
    throw new Error(`Target directory not found: ${targetDir}`);
  }

  if (fs.existsSync(outputPath) && !options.force) {
    throw new Error(`Target file already exists: ${outputPath}. Re-run with --force to overwrite.`);
  }

  const content = fs.readFileSync(templatePath, 'utf8');
  fs.writeFileSync(outputPath, content, 'utf8');

  console.log(`Installed ${templateName} to ${outputPath}`);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
