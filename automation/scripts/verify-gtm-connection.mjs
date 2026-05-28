import { createGtmClient } from '../gtm/client.js';
import { getGtmConfig } from '../gtm/config.js';

async function main() {
  const config = getGtmConfig();
  const tagmanager = await createGtmClient();

  const { data } = await tagmanager.accounts.list();
  const accounts = data.account ?? [];

  console.log('GTM API v2 connection OK');
  console.log(`Auth mode: ${config.authMode}`);
  console.log(`Scopes: ${config.scopes.join(', ')}`);
  console.log(`Accounts visible: ${accounts.length}`);

  if (accounts.length === 0) {
    console.warn('\nNo accounts returned. Sign in with the Google account that owns your GTM containers.');
    process.exit(1);
  }

  for (const account of accounts) {
    console.log(`  - ${account.name} (${account.accountId})`);
  }

  if (config.accountId && config.containerId) {
    const parent = `accounts/${config.accountId}/containers/${config.containerId}`;
    const workspaces = await tagmanager.accounts.containers.workspaces.list({ parent });
    const count = workspaces.data.workspace?.length ?? 0;
    console.log(`\nConfigured container ${config.containerId}: ${count} workspace(s)`);
  } else {
    console.log('\nTip: run npm run gtm:accounts and gtm:containers, then set GTM_ACCOUNT_ID / GTM_CONTAINER_ID in .env');
  }
}

main().catch((err) => {
  console.error('GTM verify failed:', err.message);
  if (err.response?.data) {
    console.error(JSON.stringify(err.response.data, null, 2));
  }
  process.exit(1);
});
