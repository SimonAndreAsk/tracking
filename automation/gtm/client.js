import fs from 'fs';
import { google } from 'googleapis';
import { getGtmConfig } from './config.js';

/**
 * @param {{ scopes?: string[] }} [overrides]
 */
export async function createGtmClient(overrides = {}) {
  const config = getGtmConfig();
  const scopes = overrides.scopes ?? config.scopes;

  /** @type {import('google-auth-library').GoogleAuth | import('google-auth-library').OAuth2Client} */
  let auth;

  switch (config.authMode) {
    case 'adc': {
      auth = new google.auth.GoogleAuth({ scopes });
      break;
    }
    case 'oauth': {
      if (!fs.existsSync(config.oauthClientPath)) {
        throw new Error(
          `OAuth client JSON not found at ${config.oauthClientPath}. See automation/gtm/SETUP-OAUTH.md`,
        );
      }
      if (!fs.existsSync(config.oauthTokenPath)) {
        throw new Error(
          `OAuth token not found at ${config.oauthTokenPath}. Run: npm run gtm:auth`,
        );
      }
      const clientSecrets = JSON.parse(
        fs.readFileSync(config.oauthClientPath, 'utf8'),
      );
      const installed = clientSecrets.installed ?? clientSecrets.web;
      if (!installed?.client_id || !installed?.client_secret) {
        throw new Error(
          'oauth-client.json must be a Desktop OAuth client downloaded from Google Cloud Console.',
        );
      }
      const oauth2 = new google.auth.OAuth2(
        installed.client_id,
        installed.client_secret,
        'http://127.0.0.1:3847/oauth2callback',
      );
      oauth2.setCredentials(
        JSON.parse(fs.readFileSync(config.oauthTokenPath, 'utf8')),
      );
      auth = oauth2;
      break;
    }
    case 'service_account': {
      if (!config.keyPath || !fs.existsSync(config.keyPath)) {
        throw new Error(
          `Service account key not found at ${config.keyPath}. See automation/gtm/README.md`,
        );
      }
      auth = new google.auth.GoogleAuth({
        keyFile: config.keyPath,
        scopes,
      });
      break;
    }
    default:
      throw new Error(`Unknown GTM_AUTH: ${config.authMode}`);
  }

  return google.tagmanager({ version: 'v2', auth });
}
