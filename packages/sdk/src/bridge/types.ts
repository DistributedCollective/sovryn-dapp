import { Signer } from 'ethers';

import { ChainId, ChainIds } from '@sovryn/ethers-provider';

export enum CrossBridgeAsset {
  // Native assets
  RBTC = 'RBTC',
  ETH = 'ETH',
  BNB = 'BNB',

  // Wrapped assets on RSK
  ETHS = 'ETHS',
  BNBS = 'BNBS',
  XUSD = 'XUSD',

  // Stablecoins
  USDT = 'USDT',
  USDC = 'USDC',
  DAI = 'DAI',
  BUSD = 'BUSD',

  // Other
  SOV = 'SOV',
  BSOV = 'BSOV',
}

export interface NetworkConfig {
  chainId: ChainIds;
  name: string;
  nativeCurrency: CrossBridgeAsset;
  rpcUrl: string;
  explorerUrl: string;
  multicallAddress: string;
}

export interface AssetConfig {
  mainChainId?: ChainIds;
  sideChainId?: ChainIds;
  symbol: string;
  minDecimals: number;
  isNative: boolean;
  isBase: boolean;
  usesAggregator: boolean;
  aggregatorContractAddress?: string;
  bridgeTokenAddress?: string;
}

export interface BridgeConfig {
  mainChainId: ChainIds;
  sideChainId: ChainIds;
  bridgeContractAddress: string;
  allowTokensContractAddress: string;
  assets: AssetConfig[];
}

export interface BridgeLimits {
  spentToday: string;
  dailyLimit: string;
  minPerToken: string;
  feePerToken: string;
  maxTokensAllowed: string;
}

export enum TxStep {
  IDLE = 'IDLE',
  APPROVING = 'APPROVING',
  APPROVED = 'APPROVED',
  CONFIRMING = 'CONFIRMING',
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  FAILED = 'FAILED',
  USER_DENIED = 'USER_DENIED',
}

export interface BridgeTransaction {
  step: TxStep;
  approveHash?: string;
  transferHash?: string;
  error?: Error;
}

export interface BridgeParams {
  sourceChain: ChainId;
  targetChain: ChainId;
  asset: string;
  amount: string;
  receiver: string;
  signer: Signer;
}
