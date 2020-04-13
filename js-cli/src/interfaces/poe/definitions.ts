/* eslint-disable @typescript-eslint/camelcase */
export const PoECustomTypes = {
  DefaultValues: {
    hashAlgo: 'Vec<u8>',
    hashBits: 'u32',
    encodingAlgo: 'Vec<u8>',
    encodingPrefix: 'Vec<u8>',
  },
  ForWhat: {
    _enum: ['Generic', 'Photo', 'Camera', 'Lens', 'SmartPhone'],
  },
  Operation: {
    op: 'Vec<u8>',
    desc: 'Vec<u8>',
    hashAlgo: 'Vec<u8>',
    encodeAlgo: 'Vec<u8>',
    prefix: 'Vec<u8>',
    ops: 'Vec<Operation>',
  },
  Rule: {
    description: 'Vec<u8>',
    creator: 'Vec<u8>',
    version: 'u32',
    forWhat: 'ForWhat',
    parent: 'Vec<u8>',
    buildParams: 'Operation',
    ops: 'Vec<Operation>',
  },
};

export default {
  types: {
    ...PoECustomTypes,
  },
};
