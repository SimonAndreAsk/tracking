# Automation ("Batcave")

This directory houses the engineering automation layer for the tracking governance hub. It is intentionally decoupled from `contracts/` and `dependencies/`: contracts define **what** must be true in the data layer; automation defines **how** we validate, audit, and provision infrastructure programmatically.

## Purpose

Use this space for:

- **Custom scripts** — CI validators, data layer auditors, contract diff checkers, and release helpers.
- **Google Tag Manager API (v2)** — Orchestration frameworks for container export/import, workspace promotion, tag/trigger/variable provisioning, and drift detection.
- **Google Cloud credentials** — Service account key material for GTM API and related GCP integrations (never commit secrets; see repository `.gitignore`).
- **MCP server environments** — Localized Model Context Protocol servers and tooling configs used to drive agent-assisted audits and bulk GTM operations from the IDE.

## Quick start (GTM API v2)

```bash
cd automation
cp .env.example .env
# Place service account JSON at credentials/gtm-service-account.json (see gtm/README.md)
npm install
npm run gtm:verify
```

- **OAuth (your Google account)** — **[gtm/SETUP-OAUTH.md](gtm/SETUP-OAUTH.md)** ← use this if GTM rejects the service account email
- **Service account** — [gtm/README.md](gtm/README.md)

## Layout

```
automation/
├── gtm/              # GTM API v2 client (config.js, client.js)
├── scripts/          # verify, list-accounts, list-containers
├── validators/       # (planned) Contract validation runners (AJV, etc.)
├── mcp/              # (planned) MCP server code and environment templates
└── credentials/      # Gitignored; service account JSON lives here locally only
```

## Security

- Do **not** commit service account keys, OAuth tokens, or `.env` files.
- Reference credential paths via environment variables or local-only config ignored by Git.
- Prefer workload identity or secret managers in production pipelines over checked-in keys.

## Relationship to contracts

Automation **consumes** contracts from `../contracts/` and dependency keys from `../dependencies/dashboard-manifest.json`. Pipelines should fail when instrumentation changes violate a contract or remove a protected key listed in the manifest.
