import { constants } from 'ethers';

import { Decimal } from '@sovryn/utils';

export const FAKE_PERMIT = {
  r: constants.HashZero,
  s: constants.HashZero,
  v: 27,
  owner: constants.AddressZero,
  spender: constants.AddressZero,
  value: '0x6',
  nonce: '0x7',
  deadline: '0x8',
};

export const FAKE_PERMIT_TRANSFER_FROM = {
  permitted: {
    token: constants.AddressZero,
    amount: Decimal.ONE.toString(),
  },
  spender: constants.AddressZero,
  nonce: 0,
  deadline: '1965803677',
};

export const FAKE_SIGNATURE =
  '0x86638c772f972d496f6671bc8157498b853ef064f134e813ddd25269c6a01a385ed8032201f3b91a84b46d75bb3ea50c919a576927975bab5b91829833eb8e111c';
