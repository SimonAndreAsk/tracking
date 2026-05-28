import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const automationRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);

dotenv.config({ path: path.join(automationRoot, '.env') });

const DEFAULT_SCOPES = ['https://www.googleapis.com/auth/tagmanager.readonly'];

/** @typedef {'oauth' | 'service_account' | 'adc'} GtmAuthMode */

/**
 * @returns {{
 *   authMode: GtmAuthMode;
 *   keyPath?: string;
 *   oauthClientPath: string;
 *   oauthTokenPath: string;
 *   accountId?: string;
 *   containerId?: string;
 *   scopes: string[];
 *   automationRoot: string;
 * }}
 */
export function getGtmConfig() {
  const authMode = /** @type {GtmAuthMode} */ (
    process.env.GTM_AUTH || 'oauth'
  );

  const scopes = process.env.GTM_SCOPES
    ? process.env.GTM_SCOPES.split(',').map((s) => s.trim()).filter(Boolean)
    : DEFAULT_SCOPES;

  const oauthClientPath = resolvePath(
    process.env.GTM_OAUTH_CLIENT_PATH || 'credentials/oauth-client.json',
  );
  const oauthTokenPath = resolvePath(
    process.env.GTM_OAUTH_TOKEN_PATH || 'credentials/oauth-token.json',
  );

  let keyPath;
  if (authMode === 'service_account') {
    const keyPathEnv = process.env.GTM_SERVICE_ACCOUNT_KEY_PATH;
    if (!keyPathEnv) {
      throw new Error(
        'GTM_AUTH=service_account requires GTM_SERVICE_ACCOUNT_KEY_PATH in .env',
      );
    }
    keyPath = resolvePath(keyPathEnv);
  }

  return {
    authMode,
    keyPath,
    oauthClientPath,
    oauthTokenPath,
    accountId: process.env.GTM_ACCOUNT_ID || undefined,
    containerId: process.env.GTM_CONTAINER_ID || undefined,
    scopes,
    automationRoot,
  };
}

/**
 * @param {string} p
 */
function resolvePath(p) {
  return path.isAbsolute(p) ? p : path.join(automationRoot, p);
}
