import { addresses } from '@sovryn-zero/lib-ethers/dist/deployments/default/rsksovrynmainnet.json';

import { constants } from 'ethers';

export const rsk: Record<string, string> = {
  rbtc: constants.AddressZero,
  sov: '0xEFc78fc7d48b64958315949279Ba181c2114ABBd',
  xusd: '0xb5999795BE0EbB5bAb23144AA5FD6A02D080299F',
  dllr: '0xc1411567d2670e24d9C4DaAa7CdA95686e1250AA',
  mynt: '0x5F777270259E32F79589fe82269DB6209F7b7582',
  doc: '0xE700691Da7B9851F2F35f8b8182C69C53ccad9DB',
  babelfish: '0x1440d19436bEeaF8517896bffB957a88EC95a00F',
  zusd: addresses.zusdToken,
};
