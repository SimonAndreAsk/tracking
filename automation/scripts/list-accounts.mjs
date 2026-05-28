import { createGtmClient } from '../gtm/client.js';

async function main() {
  const tagmanager = await createGtmClient();
  const { data } = await tagmanager.accounts.list();
  const accounts = data.account ?? [];

  if (accounts.length === 0) {
    console.log('No GTM accounts found for this service account.');
    return;
  }

  console.log('GTM accounts:\n');
  for (const account of accounts) {
    console.log(`  accountId: ${account.accountId}`);
    console.log(`  name:      ${account.name}`);
    console.log(`  path:      ${account.path}`);
    console.log('');
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
