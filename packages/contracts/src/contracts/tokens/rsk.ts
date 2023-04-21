import { constants } from 'ethers';

import { addresses } from '@sovryn-zero/lib-ethers/dist/deployments/default/rsksovrynmainnet.json';

export const rsk: Record<string, string> = {
  rbtc: constants.AddressZero,
  sov: '0xEFc78fc7d48b64958315949279Ba181c2114ABBd',
  xusd: '0xb5999795BE0EbB5bAb23144AA5FD6A02D080299F',
  dllr: '0xc1411567d2670e24d9C4DaAa7CdA95686e1250AA',
  mynt: '0x2e6B1d146064613E8f521Eb3c6e65070af964EbB',
  doc: '0xe700691da7b9851f2f35f8b8182c69c53ccad9db',
  babelfish: '0x1440d19436bEeaF8517896bffB957a88EC95a00F',
  zusd: addresses.zusdToken,
  bnbs: '0x6D9659bdF5b1A1dA217f7BbAf7dBAF8190E2e71B',
  eths: '0x1D931Bf8656d795E50eF6D639562C5bD8Ac2B78f',
  fish: '0x055A902303746382FBB7D18f6aE0df56eFDc5213',
  moc: '0x9aC7Fe28967b30e3a4E6E03286D715B42B453d10',
  rif: '0x2acc95758f8b5f583470ba265eb685a8f45fc9d5',
  bpro: '0x440cd83c160de5c96ddb20246815ea44c7abbca8',
  rusdt: '0xEf213441a85DF4d7acBdAe0Cf78004E1e486BB96',
};
