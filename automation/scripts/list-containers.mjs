import { createGtmClient } from '../gtm/client.js';
import { getGtmConfig } from '../gtm/config.js';

async function main() {
  const { accountId } = getGtmConfig();
  if (!accountId) {
    console.error('Set GTM_ACCOUNT_ID in automation/.env (run npm run gtm:accounts first).');
    process.exit(1);
  }

  const tagmanager = await createGtmClient();
  const parent = `accounts/${accountId}`;
  const { data } = await tagmanager.accounts.containers.list({ parent });
  const containers = data.container ?? [];

  if (containers.length === 0) {
    console.log(`No containers in account ${accountId}.`);
    return;
  }

  console.log(`Containers in account ${accountId}:\n`);
  for (const container of containers) {
    console.log(`  containerId: ${container.containerId}`);
    console.log(`  name:        ${container.name}`);
    console.log(`  publicId:    ${container.publicId}`);
    console.log(`  path:        ${container.path}`);
    console.log('');
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
