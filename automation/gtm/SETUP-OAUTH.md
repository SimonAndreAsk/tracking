# GTM API — sign in with your Google account (OAuth)

Use this when GTM User Management rejects your service account email (`*.iam.gserviceaccount.com`).

You will sign in once in the browser; the repo stores a refresh token locally (gitignored).

---

## Part 1 — Google Cloud Console

### Step 1: Open your project

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Select project **tracking-automation-497717** (or the project where Tag Manager API is enabled).

### Step 2: Confirm Tag Manager API is on

1. **APIs & Services → Library**.
2. Search **Tag Manager API**.
3. If it is not enabled, click **Enable**. (Skip if already enabled.)

### Step 3: Configure OAuth consent screen

1. **APIs & Services → OAuth consent screen**.
2. Click **Get started** (or **Edit app** if it already exists).
3. **App information**
   - App name: `GTM Local Automation` (any name is fine)
   - User support email: your email
   - Developer contact: your email
   - **Save and continue**
4. **Audience**
   - Choose **External** (typical for a personal Gmail).
   - **Save and continue**
5. **Contact information** — save and continue through any remaining steps until you reach **Scopes**.

### Step 4: Add the Tag Manager scope

1. On the consent screen flow, open **Scopes** (or go to OAuth consent screen → **Edit app → Scopes**).
2. **Add or remove scopes**.
3. Filter for `tagmanager` and enable:
   - `.../auth/tagmanager.readonly` — **View your Google Tag Manager containers**
4. **Update** / **Save**.

### Step 5: Add yourself as a test user (External apps only)

If the app is **External** and not published:

1. **OAuth consent screen → Audience** (or **Test users**).
2. **Add users**.
3. Add the **same Gmail** you use for [tagmanager.google.com](https://tagmanager.google.com/).
4. Save.

### Step 6: Create a Desktop OAuth client

1. **APIs & Services → Credentials**.
2. **+ Create credentials → OAuth client ID**.
3. If prompted to configure consent screen, finish Part 1 steps above first.
4. Application type: **Desktop app**.
5. Name: `gtm-local-automation`.
6. **Create**.
7. Click **Download JSON** on the new client.

### Step 7: Put the JSON in this repo

1. Rename/move the downloaded file to:

   ```
   c:\Dev\tracking\automation\credentials\oauth-client.json
   ```

2. Do not commit this file (gitignored).

---

## Part 2 — This repository

### Step 8: Set auth mode in `.env`

Open `c:\Dev\tracking\automation\.env` and set:

```env
GTM_AUTH=oauth
GTM_SCOPES=https://www.googleapis.com/auth/tagmanager.readonly
```

(Leave `GTM_SERVICE_ACCOUNT_KEY_PATH` as-is or ignore it — OAuth mode does not use it.)

### Step 9: Install dependencies

In PowerShell:

```powershell
cd c:\Dev\tracking\automation
npm install
```

### Step 10: Sign in (one time)

```powershell
npm run gtm:auth
```

What happens:

1. Your browser opens a Google sign-in page.
2. Choose the account that already has access to your GTM containers.
3. You may see **“Google hasn’t verified this app”** — click **Advanced → Go to GTM Local Automation (unsafe)**. That is normal for a personal test app.
4. Approve access to Tag Manager (read-only).
5. The browser shows **Success**; return to the terminal.

A token file is written to `credentials/oauth-token.json` (gitignored).

### Step 11: Verify the API works

```powershell
npm run gtm:verify
```

You should see your GTM account name(s) and ID(s).

### Step 12: Save account and container IDs

```powershell
npm run gtm:accounts
```

Copy the `accountId` into `.env`:

```env
GTM_ACCOUNT_ID=1234567
```

Then:

```powershell
npm run gtm:containers
```

Copy `containerId` into `.env`:

```env
GTM_CONTAINER_ID=7654321
```

Run `npm run gtm:verify` again — it should report workspace count for that container.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `redirect_uri_mismatch` | OAuth client must be **Desktop app**. Redirect is fixed to `http://127.0.0.1:3847/oauth2callback`. |
| `access_denied` | Add your Gmail under OAuth consent screen → **Test users**. |
| `invalid_client` | `oauth-client.json` is wrong file or corrupted — re-download Desktop client JSON. |
| Browser never opens | Copy the URL printed in the terminal and open it manually. |
| `0 accounts` | You signed in with a different Google account than the one that owns GTM. Run `npm run gtm:auth` again. |
| Token expired / revoked | Run `npm run gtm:auth` again. |

---

## Optional: gcloud instead of `npm run gtm:auth`

If you install [Google Cloud SDK](https://cloud.google.com/sdk/docs/install):

```powershell
gcloud auth application-default login --scopes="https://www.googleapis.com/auth/tagmanager.readonly,https://www.googleapis.com/auth/cloud-platform"
```

Set in `.env`:

```env
GTM_AUTH=adc
```

Then `npm run gtm:verify` uses Application Default Credentials (no `oauth-token.json`).
