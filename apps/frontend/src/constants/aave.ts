import { ethers } from 'ethers';

import { decimalic } from '../utils/math';

export const config = {
  chainId: 111,
  MinCollateralRatio: decimalic(1.5),
  PoolAddress: '0xD0Fb3Eb747A368f01d1598faF1F1C55a33416429',
  WETHGatewayAddress: '0x5723D6ABA3e46375C343A82fEC9e05a465dE387B',
  VariableDebtWETHAddress: '0x1F016249e1bCa541f4BFb1268aF3f4f293eAf082',
  UiPoolDataProviderV3Address: '0xf185Ee9FE1DA4F36b9a53194c83E657fEC8D0FA9',
  PoolAddressesProviderAddress: '0xAE73edfC71af8f5fb7d8840887E8EE4317989456',
  assetsWhitelist: ['DAI', 'USDC', 'USDT', 'BTC', 'WETH', 'EURS'],

  provider: new ethers.providers.JsonRpcProvider(
    'https://testnet.rpc.gobob.xyz',
  ),
};
