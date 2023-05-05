import { constants } from 'ethers';

import { addresses } from '@sovryn-zero/lib-ethers/dist/deployments/default/rsksovrynmainnet.json';

export const rsk: Record<string, string> = {
  rbtc: constants.AddressZero,
  wrbtc: '0x2BEe6167f91D10db23252e03de039Da6b9047D49',
  sov: '0xEFc78fc7d48b64958315949279Ba181c2114ABBd',
  xusd: '0xb5999795BE0EbB5bAb23144AA5FD6A02D080299F',
  dllr: '0xc1411567d2670e24d9C4DaAa7CdA95686e1250AA',
  mynt: '0x2e6B1d146064613E8f521Eb3c6e65070af964EbB',
  doc: '0xE700691Da7B9851F2F35f8b8182C69C53ccad9DB',
  babelfish: '0x1440d19436bEeaF8517896bffB957a88EC95a00F',
  zusd: addresses.zusdToken,
};
