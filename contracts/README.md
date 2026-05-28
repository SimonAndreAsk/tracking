# Contracts

Binding JSON Schema (Draft-07) agreements for the data layer. Breaking changes need review and updates to [`dependencies/dashboard-manifest.json`](../dependencies/dashboard-manifest.json).

## Layout

| Path | Purpose |
|------|---------|
| [`core/`](core/) | Enterprise-wide events and attributes (shared by every property) |
| [`extensions/<property>/`](extensions/) | Site-specific contracts (e.g. [`simonask-io/contact-contract.json`](extensions/simonask-io/contact-contract.json)) |

Extension contracts must stay compatible with `core/` requirements.

## Adding a contract

1. Add or edit a `.json` schema under `core/` or `extensions/<property>/`.
2. Register any new telemetry keys used downstream in `dependencies/dashboard-manifest.json`.
3. Wire validation in CI (e.g. AJV) under `automation/` when available.

See the [repository README](../README.md) for the full governance model.
