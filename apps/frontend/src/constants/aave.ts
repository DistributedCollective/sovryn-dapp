import { ethers } from 'ethers';

export const config = {
  chainId: 137,
  PoolAddress: '0x794a61358D6845594F94dc1DB02A252b5b4814aD',
  WETHGatewayAddress: '0xC1E320966c485ebF2A0A2A6d3c0Dc860A156eB1B',
  VariableDebtWETHAddress: '0x4a1c3aD6Ed28a636ee1751C69071f6be75DEb8B8',
  UiPoolDataProviderV3Address: '0x5598BbFA2f4fE8151f45bBA0a3edE1b54B51a0a9',
  PoolAddressesProviderAddress: '0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb',
  assetsWhitelist: ['DAI', 'USDC', 'USDT', 'BTC', 'WETH', 'EURS', 'WMATIC'],
  // TODO: temporary
  provider: new ethers.providers.JsonRpcProvider(
    'https://polygon-bor-rpc.publicnode.com',
  ),
};
