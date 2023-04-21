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
  bnbs: '0x801F223Def9A4e3a543eAcCEFB79dCE981Fa2Fb5',
  eths: '0x0Fd0d8D78Ce9299Ee0e5676a8d51F938C234162c',
  fish: '0xaa7038D80521351F243168FefE0352194e3f83C3',
  moc: '0x45a97b54021a3f99827641afe1bfae574431e6ab',
  rif: '0x19f64674d8a5b4e652319f5e239efd3bc969a1fe',
  bpro: '0x4dA7997A819bb46B6758b9102234c289Dd2ad3bf',
  rusdt: '0x4a0741FA749eD6b1F810224D09f1f511952e67de',
};
