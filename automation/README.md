# Automation ("Batcave")

Engineering automation for the tracking governance hub: GTM API orchestration, contract validators (planned), and IDE agent tooling. Decoupled from `contracts/` and `dependencies/` so **what** is governed separately from **how** it is enforced.

## Purpose

- **GTM API (v2)** — Container audit, list accounts/containers, future tag/trigger provisioning
- **Custom scripts** — CI validators, data layer auditors, contract diff checkers
- **MCP** — Cursor agents for GTM (Stape) and browser QA (Playwright in [`../qa/`](../qa/))

## Quick start (GTM API v2)

```bash
cd automation
cp .env.example .env
# Place OAuth client JSON or service account key — see gtm/README.md
npm install
npm run gtm:verify
```

- **OAuth (your Google account)** — [`gtm/SETUP-OAUTH.md`](gtm/SETUP-OAUTH.md)
- **Service account** — [`gtm/README.md`](gtm/README.md)

## Layout

```
automation/
├── gtm/              # GTM API v2 client (config.js, client.js)
├── scripts/          # verify, list-accounts, list-containers, auth-oauth
├── mcp/              # Cursor MCP setup (GTM + links to qa/)
├── credentials/      # Gitignored — OAuth tokens / service account JSON
└── .env.example      # GTM_ACCOUNT_ID, GTM_SCOPES, credential paths
```

Planned: `validators/` for AJV contract runners wired to CI.

## Security

- Do **not** commit service account keys, OAuth tokens, or `.env` files.
- Vercel staging bypass secrets belong in the **repo root** `.env` (see [`../.env.example`](../.env.example)), not here.

## Relationship to contracts

Automation **consumes** contracts from `../contracts/` and keys from `../dependencies/dashboard-manifest.json`. Pipelines should fail when instrumentation violates a contract or removes a protected manifest key.
