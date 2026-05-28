import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const qaRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = resolve(qaRoot, '..');

function loadBypassSecret() {
  if (process.env.VERCEL_AUTOMATION_BYPASS_SECRET) {
    return process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
  }
  for (const envPath of [resolve(repoRoot, '.env'), resolve(qaRoot, '.env')]) {
    if (!existsSync(envPath)) continue;
    for (const line of readFileSync(envPath, 'utf8').split('\n')) {
      const trimmed = line.trim();
      if (trimmed.startsWith('VERCEL_AUTOMATION_BYPASS_SECRET=')) {
        return trimmed.slice('VERCEL_AUTOMATION_BYPASS_SECRET='.length).trim();
      }
    }
  }
  return undefined;
}

/** Dev helper for Playwright MCP `browser_run_code_unsafe` with `filename`. */
export default async (page) => {
  const secret = loadBypassSecret();
  if (!secret) {
    return { error: 'VERCEL_AUTOMATION_BYPASS_SECRET not found in .env' };
  }

  await page.context().setExtraHTTPHeaders({
    'x-vercel-protection-bypass': secret,
    'x-vercel-set-bypass-cookie': 'true',
  });

  await page.goto('https://stage.simonask.io', { waitUntil: 'domcontentloaded' });

  return {
    url: page.url(),
    title: await page.title(),
    onStaging: !page.url().includes('vercel.com'),
  };
};
