#!/usr/bin/env node
/**
 * Scan files staged for commit for common secret patterns.
 * Usage: node scripts/check-before-commit.mjs
 */
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const SECRET_PATTERNS = [
  { name: 'Google OAuth client secret', re: /GOCSPX-[A-Za-z0-9_-]{10,}/ },
  { name: 'Google access token', re: /ya29\.[A-Za-z0-9_-]{10,}/ },
  { name: 'Private key block', re: /-----BEGIN (?:RSA |OPENSSH )?PRIVATE KEY-----/ },
  {
    name: 'Non-empty VERCEL_AUTOMATION_BYPASS_SECRET in a tracked file',
    re: /^VERCEL_AUTOMATION_BYPASS_SECRET=\S+/m,
    allowIn: [],
  },
];

function stagedFiles() {
  try {
    const out = execSync('git diff --cached --name-only --diff-filter=ACM', {
      encoding: 'utf8',
    }).trim();
    return out ? out.split(/\r?\n/) : [];
  } catch {
    return [];
  }
}

function workingTreeFiles() {
  try {
    const out = execSync('git diff --name-only --diff-filter=ACM', {
      encoding: 'utf8',
    }).trim();
    const staged = new Set(stagedFiles());
    const unstaged = out ? out.split(/\r?\n/).filter((f) => !staged.has(f)) : [];
    return [...staged, ...unstaged];
  } catch {
    return stagedFiles();
  }
}

const files = stagedFiles().length > 0 ? stagedFiles() : workingTreeFiles();
const checkPaths = files.filter(
  (f) => f && !f.includes('node_modules/') && !f.endsWith('.lock'),
);

if (checkPaths.length === 0) {
  console.log('check-before-commit: no changed files to scan (stage files first, or nothing changed).');
  process.exit(0);
}

const findings = [];

for (const file of checkPaths) {
  let content;
  try {
    content = readFileSync(file, 'utf8');
  } catch {
    continue;
  }

  for (const { name, re, allowIn = [] } of SECRET_PATTERNS) {
    if (allowIn.some((suffix) => file.endsWith(suffix))) continue;
    if (file.endsWith('.env.example') && name.includes('VERCEL')) {
      const line = content.match(/^VERCEL_AUTOMATION_BYPASS_SECRET=(.*)$/m);
      if (!line || !line[1].trim()) continue;
    }
    if (re.test(content)) {
      findings.push({ file, name });
    }
  }
}

if (findings.length === 0) {
  console.log(`check-before-commit: OK (${checkPaths.length} file(s) scanned).`);
  process.exit(0);
}

console.error('check-before-commit: possible secrets detected:\n');
for (const { file, name } of findings) {
  console.error(`  - ${file}: ${name}`);
}
console.error('\nUnstage or fix these files before commit. Never commit .env or automation/credentials/*.');
process.exit(1);
