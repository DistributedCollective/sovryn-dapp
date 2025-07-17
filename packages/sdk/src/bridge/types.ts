import { ChainIds } from '@sovryn/ethers-provider';

export enum Environments {
  TESTNET = 'testnet',
  MAINNET = 'mainnet',
}

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
  icon: string;
  rpcUrl: string;
  explorerUrl: string;
  mode: Environments;
  multicallAddress: string;
}

export interface AssetConfig {
  id?: string;
  asset: CrossBridgeAsset;
  symbol: string;
  icon: string;
  decimals: number;
  minDecimals: number;
  tokenContractAddress: string;
  isNative: boolean;
  targetAsset: CrossBridgeAsset;
  isBase: boolean;
  usesAggregator: boolean;
  aggregatorContractAddress?: string;
  bridgeTokenAddress?: string;
  allowedTargets: CrossBridgeAsset[];
  targetContracts?: Map<CrossBridgeAsset, string>;
  fromChainId: ChainIds;
  toChainId: ChainIds;
}

export interface BridgeConfig {
  mainChainId: ChainIds;
  sideChainId: ChainIds;
  bridgeContractAddress: string;
  allowTokensContractAddress: string;
  assets: AssetConfig[];
  mode: Environments;
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

export interface BridgeDepositParams {
  sourceChain: ChainIds;
  targetChain: ChainIds;
  asset: CrossBridgeAsset;
  amount: string;
  receiver?: string;
}
