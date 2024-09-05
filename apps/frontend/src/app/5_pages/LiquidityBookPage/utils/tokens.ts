import { ChainId, Token } from '@sovryn/joe-core';

export const WBTC = new Token(
  ChainId.BOB_TESTNET,
  '0xb5E3dbAF69A46B71Fe9c055e6Fa36992ae6b2c1A'.toLowerCase(),
  8,
  'WBTC',
  'Wrapped Bitcoin',
);

export const USDT = new Token(
  ChainId.BOB_TESTNET,
  '0x2267Ae86066097EF49884Aac96c63f70fE818eb3'.toLowerCase(),
  6,
  'USDT',
  'Tether USD',
);

export const SOV = new Token(
  ChainId.BOB_TESTNET,
  '0x67bF6DE7f8d4d13FBa410CBe05219cB26242A7C9'.toLowerCase(),
  18,
  'SOV',
  'Sovryn',
);
