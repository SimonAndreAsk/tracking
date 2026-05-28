# MCP — Cursor agent servers

This repo configures two MCP servers in [`.cursor/mcp.json`](../../.cursor/mcp.json). Cursor also merges **global** servers from `%USERPROFILE%\.cursor\mcp.json` (e.g. Sanity).

After changing config: **restart Cursor** or reload MCP servers.

## Servers

| Server | Purpose | Docs |
|--------|---------|------|
| `gtm-stape` | Google Tag Manager via [Stape MCP](https://github.com/stape-io/google-tag-manager-mcp-server) | Below |
| `Playwright` | Browser automation for staging QA | [`qa/README.md`](../../qa/README.md) |

## GTM (Stape)

1. Restart Cursor and complete **Google OAuth** when prompted (same account as [tagmanager.google.com](https://tagmanager.google.com)).
2. Stape stores tokens in `~/.mcp-auth` (separate from `automation/credentials/oauth-token.json`).

### simonask.io containers (reference)

| Container | ID | Public ID |
|-----------|-----|-----------|
| Web | `253101870` | GTM-KR894J8P |
| Server | `253113551` | GTM-PS3KHKB6 |

Account ID: `6268381941`

### Scopes

- Stape MCP uses its own OAuth flow for GTM API create/update when tools allow.
- Local `automation/` scripts use `GTM_SCOPES` in `automation/.env` (read-only by default).

### Troubleshooting

- **Tools missing in Cursor:** Server name is kept short (`gtm-stape`) — Cursor filters tools when name + tool name exceeds ~60 characters.
- **Auth stuck:** `Remove-Item -Recurse -Force "$env:USERPROFILE\.mcp-auth"` then restart Cursor and sign in again.
- **Docs:** [Stape GTM MCP setup](https://stape.io/helpdesk/documentation/how-to-set-up-mcp-server-for-gtm)

## Playwright (staging QA)

Configured to run `qa/scripts/run-playwright-mcp.mjs`, which loads the repo root `.env` and applies Vercel deployment-protection bypass headers for `stage.simonask.io`.

See [`qa/README.md`](../../qa/README.md) for setup (`VERCEL_AUTOMATION_BYPASS_SECRET`) and test commands.
