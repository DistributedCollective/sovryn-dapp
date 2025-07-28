import { ChainIds } from '@sovryn/ethers-provider';

import { NetworkConfig, Environments, CrossBridgeAsset } from '../types';

export const networks: NetworkConfig[] = [
  // RSK Networks
  {
    chainId: ChainIds.RSK_MAINNET,
    name: 'RSK',
    nativeCurrency: CrossBridgeAsset.RBTC,
    rpcUrl: 'https://rsk-live.sovryn.app/rpc',
    explorerUrl: 'https://explorer.rsk.co',
    mode: Environments.MAINNET,
    multicallAddress: '0x6c62bf5440de2cb157205b15c424bceb5c3368f5',
  },
  {
    chainId: ChainIds.RSK_TESTNET,
    name: 'RSK Testnet',
    nativeCurrency: CrossBridgeAsset.RBTC,
    rpcUrl: 'https://testnet.sovryn.app/rpc',
    explorerUrl: 'https://explorer.testnet.rsk.co',
    mode: Environments.TESTNET,
    multicallAddress: '0x9e469e1fc7fb4c5d17897b68eaf1afc9df39f103',
  },

  // Ethereum Networks
  {
    chainId: ChainIds.MAINNET,
    name: 'Ethereum',
    nativeCurrency: CrossBridgeAsset.ETH,
    rpcUrl: 'https://eth-mainnet.public.blastapi.io',
    explorerUrl: 'https://etherscan.io',
    mode: Environments.MAINNET,
    multicallAddress: '0x5ba1e12693dc8f9c48aad8770482f4739beed696',
  },
  {
    chainId: ChainIds.ROPSTEN,
    name: 'Ropsten',
    nativeCurrency: CrossBridgeAsset.ETH,
    rpcUrl: `https://ropsten.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`,
    explorerUrl: 'https://ropsten.etherscan.io',
    mode: Environments.TESTNET,
    multicallAddress: '0x5ba1e12693dc8f9c48aad8770482f4739beed696',
  },

  // BSC Networks
  {
    chainId: ChainIds.BSC_MAINNET,
    name: 'Binance Smart Chain',
    nativeCurrency: CrossBridgeAsset.BNB,
    rpcUrl: 'https://bsc.sovryn.app/mainnet',
    explorerUrl: 'https://bscscan.com',
    mode: Environments.MAINNET,
    multicallAddress: '0x41263cba59eb80dc200f3e2544eda4ed6a90e76c',
  },
  {
    chainId: ChainIds.BSC_TESTNET,
    name: 'Binance Smart Testnet',
    nativeCurrency: CrossBridgeAsset.BNB,
    rpcUrl: 'https://bsc.sovryn.app/testnet',
    explorerUrl: 'https://testnet.bscscan.com',
    mode: Environments.TESTNET,
    multicallAddress: '0xae11C5B5f29A6a25e955F0CB8ddCc416f522AF5C',
  },
];

export const getBridgeNetwork = (
  chainId: ChainIds,
): NetworkConfig | undefined => {
  return networks.find(n => n.chainId === chainId);
};

export const getBridgeSupportedChainIds = (): ChainIds[] => {
  return networks.map(n => n.chainId);
};
