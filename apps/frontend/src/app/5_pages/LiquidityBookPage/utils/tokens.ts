import { ChainId, Token } from '@sovryn/joe-core';

export const WBTC = new Token(
  ChainId.BOB_TESTNET,
  '0x6DBed1fd7C490bb860D02F027C9257D9338Ed190',
  8,
  'WBTC',
  'Wrapped Bitcoin',
);

export const USDT = new Token(
  ChainId.BOB_TESTNET,
  '0x9Fddb3a3D9a014A2A1F85DB3ebF6Ba5E26F4e5Ad',
  6,
  'USDT',
  'Tether USD',
);

export const SOV = new Token(
  ChainId.BOB_TESTNET,
  '0x05da4128d52750421D1bA07E932Cb68B28c69021',
  18,
  'SOV',
  'Sovryn',
);
