import { ApiPromise, Keyring, WsProvider } from '@polkadot/api';
import { KeyringPair } from '@polkadot/keyring/types';
import './interfaces/augment-api';
import './interfaces/augment-types';
// our local stuff
import * as definitions from './interfaces/definitions';

export function getAlice(): KeyringPair {
  // Construct the keying after the API (crypto has an async init)
  const keyring = new Keyring({ type: 'sr25519' });

  // Add Alice to our keyring with a hard-derived path (empty phrase, so uses dev)
  const alice = keyring.addFromUri('//Alice');
  return alice;
}

export async function setupConnection(): Promise<ApiPromise> {
  const types = Object.values(definitions).reduce((res, { types }): object => ({ ...res, ...types }), {});

  // Init the provider to connect to the local node
  const provider = new WsProvider('ws://127.0.0.1:9944');

  // Init the server
  const api = await ApiPromise.create({
    types: {
      ...types,
      // chain-specific overrides
      Address: 'AccountId',
      LookupSource: 'AccountId',
    },
    provider,
  });

  // Retrieve the chain & node information information via rpc calls
  const [chain, nodeName, nodeVersion] = await Promise.all([
    api.rpc.system.chain(),
    api.rpc.system.name(),
    api.rpc.system.version(),
  ]);

  console.log(`Connected to chain ${chain} using ${nodeName} v${nodeVersion}`);

  return api;
}
