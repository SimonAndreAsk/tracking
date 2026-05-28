# Enterprise Tracking Governance Hub

Centralized data governance repository hosting enterprise data contracts, downstream system dependency maps, and custom automation infrastructure for automated data layer validation and synchronous GTM deployment.

## Overview

This repository is the single source of truth for analytics instrumentation across the portfolio. It separates **binding data laws** (contracts and dependency maps) from **local automation tooling** (GTM API scripts, validators, MCP environments) so engineering and analytics can agree on contracts in version control while automation evolves independently in `automation/`.

Contracts are validated in CI/CD; protected telemetry keys are registered for downstream impact analysis; the automation layer provisions and audits Google Tag Manager containers programmatically.

## Why `contracts/` and not `schemas/`?

We use **contracts** deliberately. A JSON Schema in this repo is not merely documentation—it is a **binding architectural agreement** between engineering and analytics:

| Term | Meaning in this repo |
|------|----------------------|
| **Contract** | Enforceable specification. Breaking changes require review, manifest updates, and stakeholder sign-off. |
| **Schema** (colloquial) | Often implies optional or illustrative structure; we avoid that naming to prevent "soft" specs. |

Extension contracts under `contracts/extensions/` must remain compatible with global requirements in `contracts/core/`. Validators should reject payloads that violate `additionalProperties`, missing required fields, or const event names.

## Directory layout

```
├── contracts/                  # Binding data layer agreements (JSON Schema Draft-07)
│   ├── core/                   # Enterprise-wide contracts (pageviews, consent, session context)
│   └── extensions/             # Site-specific property contracts
│       └── simonask-io/        # Main portfolio site environment
├── dependencies/               # Downstream BI/reporting impact maps
└── automation/                 # GTM API tooling, scripts, MCP servers ("Batcave")
```

### `contracts/`

| Path | Purpose |
|------|---------|
| `contracts/core/` | Global contracts shared by every property. Baseline events and attributes required for enterprise reporting. |
| `contracts/extensions/` | Property-specific contracts. Each subdirectory is an environment (e.g. `simonask-io/`). |

### `dependencies/`

Maps contracts to downstream consumers—Power BI, GA4, marketing pixels, Looker, BigQuery views, and other tooling.

`dashboard-manifest.json` is a JSON array of **protected telemetry keys**. CI and automation should grep or diff against it to flag breaking changes before merge.

### `automation/`

Houses custom engineering scripts, GTM API (v2) orchestration, localized MCP server environments, and (locally, gitignored) Google Cloud service account material. See [automation/README.md](automation/README.md).

## Getting started

1. Add or update Draft-07 contracts under `contracts/core/` or `contracts/extensions/<property>/`.
2. Register keys consumed by dashboards or tags in `dependencies/dashboard-manifest.json`.
3. Add validators and GTM tooling under `automation/`; wire contract checks into CI/CD (e.g. AJV for Draft-07).
4. Never commit credentials; use `automation/credentials/` locally with paths ignored by `.gitignore`.

## Example: property extension

[`contracts/extensions/simonask-io/contact-contract.json`](contracts/extensions/simonask-io/contact-contract.json) defines the strict `contact_click` dataLayer contract:

- `event` — required string, constant `"contact_click"`
- `button_location` — required string
- `user_language` — optional string
- `additionalProperties: false` — no undeclared fields permitted

## Protected downstream keys

Initial manifest (`dependencies/dashboard-manifest.json`):

- `contact_click`
- `button_location`
- `conversion_value`
- `dealer_id`
