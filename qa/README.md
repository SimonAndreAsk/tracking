# QA — Playwright & staging access

Browser automation for analytics QA: E2E tests, Cursor Playwright MCP, and Vercel-protected staging (`stage.simonask.io`).

## Setup

1. Copy the repo root env file (if you have not already):

   ```bash
   cp .env.example .env
   ```

2. Set `VERCEL_AUTOMATION_BYPASS_SECRET` in `.env` (repo root) from Vercel → **Project → Settings → Deployment Protection → Protection Bypass for Automation**.

3. Install dependencies:

   ```bash
   cd qa
   npm install
   ```

4. Restart Cursor after changing MCP config so Playwright MCP reloads.

## Commands

| Command | Purpose |
|---------|---------|
| `npm test` | Run Playwright E2E tests (`tests/`) |
| `npm run mcp` | Start Playwright MCP locally (same as Cursor uses) |

## Cursor MCP

Playwright MCP is wired in [`.cursor/mcp.json`](../.cursor/mcp.json). It runs `qa/scripts/run-playwright-mcp.mjs`, which loads `.env` and starts `@playwright/mcp` with [`playwright-mcp.config.json`](playwright-mcp.config.json).

- **User-Agent:** `Playwright-Analytics-QA-Gate` (excludes traffic from production analytics)
- **Vercel bypass:** Injected via `playwright-mcp-init.mjs` when the secret is set

GTM MCP (Stape) is documented in [automation/mcp/README.md](../automation/mcp/README.md).

## Layout

```
qa/
├── playwright.config.js       # @playwright/test
├── playwright-mcp.config.json # Cursor Playwright MCP
├── playwright-mcp-init.mjs    # Vercel bypass headers on browser start
├── load-env.mjs               # Loads ../.env then ./.env
├── scripts/
│   ├── run-playwright-mcp.mjs
│   └── mcp-navigate-staging.mjs  # optional MCP dev helper
└── tests/                     # E2E specs (*.spec.js)
```

## Adding tests

Add files under `tests/`, for example `tests/contact-click.spec.js`, then run `npm test` from this directory.
