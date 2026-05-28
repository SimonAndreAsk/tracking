# Google Tag Manager API v2 setup

This folder contains a minimal Node.js client for the [Tag Manager API v2](https://developers.google.com/tag-manager/api/v2). Use it to list accounts/containers, export containers, audit tags, and (with edit scope) provision variables/triggers/tags from contracts.

## Prerequisites

- A Google account with access to your GTM **account** (Admin or sufficient permissions to add users).
- A Google Cloud **project** (can be the same org as GA4/BigQuery or a dedicated "tracking-automation" project).
- Node.js 20+ (run `npm install` from `automation/`).

## 1. Enable the API in Google Cloud

1. Open [Google Cloud Console](https://console.cloud.google.com/) and select (or create) a project.
2. Go to **APIs & Services → Library**.
3. Search for **Tag Manager API** and click **Enable**.

## 2. Create a service account

1. **IAM & Admin → Service Accounts → Create service account**.
2. Name example: `gtm-automation`.
3. Skip optional role grants on the GCP project (GTM permissions are granted inside GTM, not IAM project roles).
4. **Keys → Add key → Create new key → JSON**.
5. Save the file as:

   ```
   automation/credentials/gtm-service-account.json
   ```

   This path is gitignored. Never commit the JSON key.

6. Note the service account email (e.g. `gtm-automation@your-project.iam.gserviceaccount.com`).

## 3. Grant access in Google Tag Manager

API access uses the **service account email** as a GTM user:

1. Open [tagmanager.google.com](https://tagmanager.google.com/).
2. **Admin** (gear) → **User Management** at **Account** level (applies to all containers) or **Container** level (single property).
3. **Add users** → paste the service account email.
4. Permission:
   - **Read** — list/export, audits (`tagmanager.readonly`).
   - **Edit** / **Approve** / **Publish** — required for sync/deploy scripts (`tagmanager.edit.containers`).

Without this step, `npm run gtm:verify` succeeds at OAuth but returns **zero accounts**.

## 4. Local environment

From `automation/`:

```bash
cp .env.example .env
# Edit .env: confirm GTM_SERVICE_ACCOUNT_KEY_PATH points at your JSON key
npm install
npm run gtm:verify
```

Discover IDs:

```bash
npm run gtm:accounts
# Set GTM_ACCOUNT_ID in .env
npm run gtm:containers
# Set GTM_CONTAINER_ID in .env
```

## 5. Scopes

| Goal | `GTM_SCOPES` value |
|------|-------------------|
| Audit, list, export | `https://www.googleapis.com/auth/tagmanager.readonly` |
| Create/update tags, triggers, variables | `https://www.googleapis.com/auth/tagmanager.edit.containers` |
| Publish versions | `https://www.googleapis.com/auth/tagmanager.publish` |

Use the narrowest scope that fits the script. Default in `.env.example` is read-only.

## 6. Troubleshooting

| Symptom | Likely cause |
|---------|----------------|
| `Service account key not found` | Wrong path in `.env` or JSON not in `credentials/` |
| `403` / API not enabled | Enable Tag Manager API in the GCP project tied to the key |
| `0 accounts` on verify | SA email not added in GTM User Management |
| `403` on container/workspace | SA has account access but not container; or read-only scope for write calls |
| Wrong project | Key JSON `project_id` must match the project where Tag Manager API is enabled |

## Next steps (repo roadmap)

- **validators/** — AJV runners against `../contracts/`
- Container export/import and drift checks against `dependencies/dashboard-manifest.json`
- **mcp/** — MCP tools wrapping `gtm:verify`, list tags, diff workspace vs contract
