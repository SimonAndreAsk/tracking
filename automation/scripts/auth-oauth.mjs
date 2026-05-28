import fs from 'fs';
import http from 'http';
import { spawn } from 'child_process';
import { google } from 'googleapis';
import { getGtmConfig } from '../gtm/config.js';

const REDIRECT_PORT = 3847;
const REDIRECT_PATH = '/oauth2callback';
const REDIRECT_URI = `http://127.0.0.1:${REDIRECT_PORT}${REDIRECT_PATH}`;

function openBrowser(url) {
  const platform = process.platform;
  if (platform === 'win32') {
    // cmd `start` truncates at `&` and drops response_type from the OAuth URL
    spawn('rundll32', ['url.dll,FileProtocolHandler', url], {
      detached: true,
      stdio: 'ignore',
    });
  } else if (platform === 'darwin') {
    spawn('open', [url], { detached: true, stdio: 'ignore' });
  } else {
    spawn('xdg-open', [url], { detached: true, stdio: 'ignore' });
  }
}

async function main() {
  const config = getGtmConfig();
  if (config.authMode !== 'oauth') {
    console.error('Set GTM_AUTH=oauth in automation/.env before running gtm:auth');
    process.exit(1);
  }

  if (!fs.existsSync(config.oauthClientPath)) {
    console.error(`Missing ${config.oauthClientPath}`);
    console.error('Follow automation/gtm/SETUP-OAUTH.md steps 1–6 first.');
    process.exit(1);
  }

  const secrets = JSON.parse(fs.readFileSync(config.oauthClientPath, 'utf8'));
  const installed = secrets.installed ?? secrets.web;
  if (!installed?.client_id || !installed?.client_secret) {
    console.error('oauth-client.json must be a Desktop app OAuth client from Google Cloud.');
    process.exit(1);
  }

  const oauth2 = new google.auth.OAuth2(
    installed.client_id,
    installed.client_secret,
    REDIRECT_URI,
  );

  const authUrl = oauth2.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: config.scopes,
  });

  if (!authUrl.includes('response_type=code')) {
    throw new Error('Generated auth URL is missing response_type=code');
  }

  console.log('Opening browser for Google sign-in...');
  console.log('Use the same Google account that can open tagmanager.google.com.\n');
  console.log('If the browser does not open, visit:\n');
  console.log(authUrl);
  console.log('');

  openBrowser(authUrl);

  const code = await new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      if (!req.url?.startsWith(REDIRECT_PATH)) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      const url = new URL(req.url, REDIRECT_URI);
      const err = url.searchParams.get('error');
      if (err) {
        res.writeHead(400, { 'Content-Type': 'text/html' });
        res.end(`<h1>Authorization failed</h1><p>${err}</p>`);
        server.close();
        reject(new Error(err));
        return;
      }
      const authCode = url.searchParams.get('code');
      if (!authCode) {
        res.writeHead(400, { 'Content-Type': 'text/html' });
        res.end('<h1>Missing code</h1>');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(
        '<h1>Success</h1><p>You can close this tab and return to the terminal.</p>',
      );
      server.close();
      resolve(authCode);
    });

    server.listen(REDIRECT_PORT, '127.0.0.1', () => {
      console.log(`Waiting for callback on ${REDIRECT_URI} ...`);
    });

    server.on('error', reject);
  });

  const { tokens } = await oauth2.getToken(code);
  fs.mkdirSync(config.automationRoot + '/credentials', { recursive: true });
  fs.writeFileSync(config.oauthTokenPath, JSON.stringify(tokens, null, 2));

  console.log(`\nSaved token to ${config.oauthTokenPath}`);
  console.log('Next: npm run gtm:verify');
}

main().catch((err) => {
  console.error('OAuth auth failed:', err.message);
  process.exit(1);
});
