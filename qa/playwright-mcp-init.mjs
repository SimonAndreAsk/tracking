import './load-env.mjs';

/** @param {{ page: import('playwright').Page }} param0 */
export default async ({ page }) => {
  const secret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
  if (!secret) {
    console.warn(
      '[playwright-mcp] VERCEL_AUTOMATION_BYPASS_SECRET is not set; Vercel Deployment Protection may block staging.',
    );
    return;
  }

  await page.context().setExtraHTTPHeaders({
    'x-vercel-protection-bypass': secret,
    'x-vercel-set-bypass-cookie': 'true',
  });
};
