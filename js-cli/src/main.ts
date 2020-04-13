import { createRulePayload, getRules, saveToBlockchain } from './poe';
import photoRule from './rules/photo';
import { setupConnection } from './setupConnection';
async function main(): Promise<void> {
  const api = await setupConnection();

  const rules = await getRules(api);
  console.log(rules);

  const rulePayload = createRulePayload(api, photoRule);

  await saveToBlockchain(api, rulePayload);

  return;
}

main().catch(console.error);
