// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

import { Enum, Struct, Vec } from '@polkadot/types/codec';
import { Bytes, u32 } from '@polkadot/types/primitive';

/** @name DefaultValues */
export interface DefaultValues extends Struct {
  readonly hashAlgo: Bytes;
  readonly hashBits: u32;
  readonly encodingAlgo: Bytes;
  readonly encodingPrefix: Bytes;
}

/** @name ForWhat */
export interface ForWhat extends Enum {
  readonly isGeneric: boolean;
  readonly isPhoto: boolean;
  readonly isCamera: boolean;
  readonly isLens: boolean;
  readonly isSmartPhone: boolean;
}

/** @name Operation */
export interface Operation extends Struct {
  readonly op: Bytes;
  readonly desc: Bytes;
  readonly hashAlgo: Bytes;
  readonly encodeAlgo: Bytes;
  readonly prefix: Bytes;
  readonly ops: Vec<Operation>;
}

/** @name Rule */
export interface Rule extends Struct {
  readonly description: Bytes;
  readonly creator: Bytes;
  readonly version: u32;
  readonly forWhat: ForWhat;
  readonly parent: Bytes;
  readonly buildParams: Operation;
  readonly ops: Vec<Operation>;
}

export type PHANTOM_POE = 'poe';
