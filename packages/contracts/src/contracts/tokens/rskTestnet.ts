import { constants } from 'ethers';

import { addresses } from '@sovryn-zero/lib-ethers/dist/deployments/default/rsktestnet.json';

export const rskTestnet: Record<string, string> = {
  rbtc: constants.AddressZero,
  sov: '0x6a9A07972D07e58F0daf5122d11E069288A375fb',
  xusd: '0xa9262cc3fb54ea55b1b0af00efca9416b8d59570',
  dllr: '0x007b3AA69A846cB1f76b60b3088230A52D2A83AC',
  mynt: '0xac2d05A148aB512EDEDc7280c00292ED33d31f1A',
  doc: '0xcb46c0ddc60d18efeb0e586c17af6ea36452dae0',
  babelfish: '0x1572D7E4a78A8AD14AE722E6fE5f5600a2c7A149',
  zusd: addresses.zusdToken,
};
