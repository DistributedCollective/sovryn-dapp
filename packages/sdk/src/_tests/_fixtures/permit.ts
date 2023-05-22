import { constants } from 'ethers';

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
