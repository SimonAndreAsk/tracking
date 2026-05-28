# Enterprise Tracking Governance Hub

Centralized data governance repository hosting enterprise data contracts, downstream system dependency maps, and custom automation infrastructure for automated data layer validation and synchronous GTM deployment.

## Overview

This repository is the single source of truth for analytics instrumentation across the portfolio. It separates **binding data laws** (contracts and dependency maps) from **local automation tooling** (GTM API scripts, validators, MCP environments) so engineering and analytics can agree on contracts in version control while automation evolves independently in `automation/`.

Contracts are validated in CI/CD; protected telemetry keys are registered for downstream impact analysis; the automation layer provisions and audits Google Tag Manager containers programmatically.

## Quick start

| Goal | Where to start |
|------|----------------|
| Define or change a dataLayer contract | [`contracts/README.md`](contracts/README.md) |
| Register protected dashboard keys | [`dependencies/README.md`](dependencies/README.md) |
| GTM API scripts & OAuth | [`automation/README.md`](automation/README.md) |
| Staging QA / Playwright MCP | [`qa/README.md`](qa/README.md) |
| Cursor MCP servers (GTM + browser) | [`automation/mcp/README.md`](automation/mcp/README.md) |

**Environment files (gitignored):**

- **Repo root `.env`** — Vercel staging bypass for Playwright ([`.env.example`](.env.example))
- **`automation/.env`** — GTM API credentials ([`automation/.env.example`](automation/.env.example))

Before commit/push, run `node scripts/check-before-commit.mjs` (after `git add`) to scan for accidental secrets.

## Why `contracts/` and not `schemas/`?

We use **contracts** deliberately. A JSON Schema in this repo is not merely documentation—it is a **binding architectural agreement** between engineering and analytics:

| Term | Meaning in this repo |
|------|----------------------|
| **Contract** | Enforceable specification. Breaking changes require review, manifest updates, and stakeholder sign-off. |
| **Schema** (colloquial) | Often implies optional or illustrative structure; we avoid that naming to prevent "soft" specs. |

Extension contracts under `contracts/extensions/` must remain compatible with global requirements in `contracts/core/`. Validators should reject payloads that violate `additionalProperties`, missing required fields, or const event names.

## Directory layout

```
├── contracts/          # Binding data layer agreements (JSON Schema Draft-07)
│   ├── core/           # Enterprise-wide contracts
│   └── extensions/     # Per-property contracts (e.g. simonask-io/)
├── dependencies/       # Downstream BI/reporting impact maps
├── automation/         # GTM API v2 scripts, credentials, MCP docs
├── qa/                 # Playwright E2E tests & staging browser automation
├── .cursor/            # Cursor MCP configuration (project-local)
└── .env.example        # Vercel bypass secret template (copy → .env)
```

### `contracts/`

See [`contracts/README.md`](contracts/README.md). Global rules live in `core/`; property-specific rules in `extensions/<property>/`.

### `dependencies/`

See [`dependencies/README.md`](dependencies/README.md). `dashboard-manifest.json` lists **protected telemetry keys** for CI and automation.

### `automation/`

GTM API orchestration, OAuth/service account setup, and agent tooling. See [`automation/README.md`](automation/README.md).

### `qa/`

Playwright tests, Vercel deployment-protection bypass for `stage.simonask.io`, and Playwright MCP for Cursor. See [`qa/README.md`](qa/README.md).

## Example: property extension

[`contracts/extensions/simonask-io/contact-contract.json`](contracts/extensions/simonask-io/contact-contract.json) defines the strict `contact_click` dataLayer contract:

- `event` — required string, constant `"contact_click"`
- `button_location` — required string
- `user_language` — optional string
- `additionalProperties: false` — no undeclared fields permitted

## Protected downstream keys

Initial manifest ([`dependencies/dashboard-manifest.json`](dependencies/dashboard-manifest.json)):

- `contact_click`
- `button_location`
- `conversion_value`
- `dealer_id`
