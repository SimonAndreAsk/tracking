import '../load-env.mjs';
import { spawn } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const qaRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const configPath = resolve(qaRoot, 'playwright-mcp.config.json');

const child = spawn(
  process.platform === 'win32' ? 'npx.cmd' : 'npx',
  ['@playwright/mcp@latest', `--config=${configPath}`],
  {
    cwd: qaRoot,
    env: process.env,
    stdio: 'inherit',
    shell: true,
  },
);

child.on('exit', (code) => process.exit(code ?? 1));
