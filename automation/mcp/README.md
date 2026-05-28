# MCP — Stape Google Tag Manager

This repo is configured to use [Stape's GTM MCP server](https://github.com/stape-io/google-tag-manager-mcp-server) from Cursor.

## Cursor setup

Config for this repo: [`.cursor/mcp.json`](../../.cursor/mcp.json) (`gtm-stape`, `Playwright`).

Cursor also loads **global** servers from `%USERPROFILE%\.cursor\mcp.json` (e.g. Sanity). Project + global configs are merged.

After adding or changing config:

1. **Restart Cursor** (or reload MCP servers in settings).
2. When prompted, complete **Google OAuth** in the browser (same account as [tagmanager.google.com](https://tagmanager.google.com/)).
3. Stape stores tokens in `~/.mcp-auth` (separate from `automation/credentials/oauth-token.json`).

## simonask.io containers (reference)

| Container | ID | Public ID |
|-----------|-----|-----------|
| Web | `253101870` | GTM-KR894J8P |
| Server | `253113551` | GTM-PS3KHKB6 |

Account ID: `6268381941`

## Scopes

- Stape MCP uses its own OAuth flow with GTM API access for create/update operations (when tools allow).
- Local `automation/` scripts use `GTM_SCOPES` in `.env` (currently read-only unless you widen it).

## Troubleshooting

- **Tools missing in Cursor:** Server name is kept short (`gtm-stape`) — Cursor filters tools when name + tool name exceeds ~60 characters.
- **Auth stuck:** `Remove-Item -Recurse -Force "$env:USERPROFILE\.mcp-auth"` then restart Cursor and sign in again.
- **Docs:** [Stape GTM MCP setup](https://stape.io/helpdesk/documentation/how-to-set-up-mcp-server-for-gtm)
