import { ChainIds } from '@sovryn/ethers-provider';

import { BridgeConfig, Environments } from '../types';
import {
  bscToRskMainnetAssets,
  rskToBscMainnetAssets,
  bscToRskTestnetAssets,
  rskToBscTestnetAssets,
} from './assets';

export const bridges: BridgeConfig[] = [
  // Mainnet Bridges
  {
    mainChainId: ChainIds.RSK_MAINNET,
    sideChainId: ChainIds.BSC_MAINNET,
    bridgeContractAddress: '0x971b97c8cc82e7d27bc467c2dc3f219c6ee2e350',
    allowTokensContractAddress: '0xa2f50a2c699c1aa3b9089f6b565d4999d45d8983',
    assets: rskToBscMainnetAssets,
    mode: Environments.MAINNET,
  },
  {
    mainChainId: ChainIds.BSC_MAINNET,
    sideChainId: ChainIds.RSK_MAINNET,
    bridgeContractAddress: '0xdfc7127593c8af1a17146893f10e08528f4c2aa7',
    allowTokensContractAddress: '0x05b68e70168e876b2025f837bc8e0b2312d5327d',
    assets: bscToRskMainnetAssets,
    mode: Environments.MAINNET,
  },

  // Testnet Bridges
  {
    mainChainId: ChainIds.RSK_TESTNET,
    sideChainId: ChainIds.BSC_TESTNET,
    bridgeContractAddress: '0x2b2bcad081fa773dc655361d1bb30577caa556f8',
    allowTokensContractAddress: '0xa9f2ccb27fe01479a1f21f3a236989c614f801bc',
    assets: rskToBscTestnetAssets,
    mode: Environments.TESTNET,
  },
  {
    mainChainId: ChainIds.BSC_TESTNET,
    sideChainId: ChainIds.RSK_TESTNET,
    bridgeContractAddress: '0x862e8aff917319594cc7faaae5350d21196c086f',
    allowTokensContractAddress: '0xeb23e848ceca88b7d0c019c7186bb86cefadd0bd',
    assets: bscToRskTestnetAssets,
    mode: Environments.TESTNET,
  },
];

export const getBridge = (
  sourceChain: ChainIds,
  targetChain: ChainIds,
  mode: Environments = Environments.MAINNET,
): BridgeConfig | undefined => {
  return bridges.find(
    b =>
      b.mainChainId === sourceChain &&
      b.mode === mode &&
      b.sideChainId === targetChain,
  );
};

export const getSupportedTargetChains = (
  sourceChain: ChainIds,
  mode: Environments = Environments.MAINNET,
): ChainIds[] => {
  return bridges
    .filter(b => b.mainChainId === sourceChain && b.mode === mode)
    .map(b => b.sideChainId);
};
