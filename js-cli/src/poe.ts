import { ApiPromise } from '@polkadot/api';
import { stringToU8a } from '@polkadot/util';
import { blake2AsHex } from '@polkadot/util-crypto';
import { Rule } from './interfaces';
import { getAlice } from './setupConnection';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function objectToString(o: Record<string, any>): string {
  const r = JSON.stringify(o);
  // console.log(`\nLength of the json string is ${Buffer.byteLength(r)} bytes`);
  return r;
}

interface SavePayload {
  ruleId: string;
  payload: Rule;
}
export function createRulePayload(api: ApiPromise, rule: Record<string, any>): SavePayload {
  const buf = stringToU8a(objectToString(rule));
  const hash = blake2AsHex(buf);
  // const payload = buf.toString();
  const payload = api.createType('Rule', rule);
  // const ret = { ruleId: stringToHex(cid.toString()), payload: stringToHex(payload) };
  const ret = { ruleId: hash, payload };
  return ret;
}

export async function saveToBlockchain(api: ApiPromise, { ruleId, payload }: SavePayload): Promise<void> {
  const signer = getAlice();
  await api.tx.poe.createRuleNew(ruleId, payload).signAndSend(signer, {}, (res) => {
    const { events = [], status, isError } = res;
    console.log(`\tTransaction status:${status.type}`);

    if (status.isInBlock) {
      console.log('\tIncluded at block hash', status.asInBlock.toHex());

      console.log('\tEvents:', events.length);

      events.forEach(({ event, phase }) => {
        const { data, method, section } = event;
        const [error] = data;

        // console.log('\t', phase.toString(), `: ${section}.${method}`, data.toString());
        // console.log('\t', phase.toString(), `: ${section}.${method}`);

        if (error.isModule) {
          const { documentation, name, section } = api.registry.findMetaError(error.asModule);
          console.error('\t', documentation.toString(), name, section);
          console.error('\tRejecting ...');

          // reject here would make all the other promises to fail
          // reject('ExtrinsicFailed');
        } else {
          console.log('\t', phase.toString(), `: ${section}.${method}`, data.toString());
        }
      });
    } else if (status.isFinalized) {
      console.log('\tFinalized block hash', status.asFinalized.toHex());
    } else if (isError) {
      console.error(status);
    }

    // console.log(
    //   `Rule created for ${ForWhat[r.forWhat]}\n hash: ${createdRuleSimple.toHex()}\n cid: ${hexToString(ruleId)}`,
    // );
  });
}
export interface RuleInternalPayload {
  rule: Rule;
  ruleId: string;
}
export async function getRules(api: ApiPromise, extended = false): Promise<> {
  const c = await api.query.poe.rulesNew.entries();
  console.log(`FOUND ${c.length} rules`);

  return c.map(([key, [ruleId, payload, accountId, blockNumber]]) => {
    if (extended) {
      console.log('KEY: ', key.args[0].toHex()); // this is the hash of the ruleID
      console.log('ruleId: ', ruleId.toHex()); // this is the hash of the ruleID
      console.log('VALUE: ', payload.toHex()); // this should be the rule
      console.log('ACCOUNT ID: ', accountId.toString());
      console.log('BLOCK_NUMBER: ', blockNumber.toNumber());
    }
  });
}
