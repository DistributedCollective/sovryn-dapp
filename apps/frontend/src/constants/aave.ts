import { ethers } from 'ethers';

import { decimalic } from '../utils/math';

export const config = {
  chainId: 111,
  MinCollateralRatio: decimalic(1.5),
  VariableDebtWETHAddress: '0x5d390c39c8bc4B116a87991fd369244dD7B0C6D8',
  PoolAddress: '0xc62b1eDC4fF950aD32D6846e69B68cCadBC568Af',
  WETHGatewayAddress: '0x9F9Dc8dc9308C32Cf652b32dD1b5d2DA106f1dA0',
  UiPoolDataProviderV3Address: '0x0954E027fb7d59271CF253831c5Cc78be5c75840',
  PoolAddressesProviderAddress: '0x01757F5712695f8f93AD63ED3Bdf66575522188a',

  provider: new ethers.providers.JsonRpcProvider(
    'https://testnet.rpc.gobob.xyz',
  ),
};
