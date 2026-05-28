import './load-env.mjs';
import { defineConfig } from '@playwright/test';

const vercelBypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;

export default defineConfig({
  testDir: 'tests',
  use: {
    userAgent: 'Playwright-Analytics-QA-Gate',
    ...(vercelBypassSecret
      ? {
          extraHTTPHeaders: {
            'x-vercel-protection-bypass': vercelBypassSecret,
            'x-vercel-set-bypass-cookie': 'true',
          },
        }
      : {}),
  },
});
