import { ethers } from 'ethers';

export const config = {
  chainId: 137,
  UiPoolDataProviderV3Address: '0x5598BbFA2f4fE8151f45bBA0a3edE1b54B51a0a9',
  PoolAddressesProviderAddress: '0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb',
  assetsWhitelist: ['DAI', 'USDC', 'USDT', 'BTC', 'WETH', 'EURS', 'WMATIC'],
  // TODO: temporary
  provider: new ethers.providers.JsonRpcProvider(
    'https://polygon-bor-rpc.publicnode.com',
  ),
};
