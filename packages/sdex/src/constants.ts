import { BigNumber } from 'ethers';

type ChainAddress = string;
type ChainId = string;

export const MIN_TICK = -665454;
export const MAX_TICK = 831818;
export const MAX_SQRT_PRICE: BigNumber = BigNumber.from(
  '21267430153580247136652501917186561138',
).sub(1);
export const MIN_SQRT_PRICE: BigNumber = BigNumber.from('65538').sub(1);
export const MAX_LIQ = BigNumber.from(2).pow(128).sub(1);

export interface ChainSpec {
  nodeUrl: string;
  wsUrl?: string;
  poolIndex: number;
  addrs: {
    dex: ChainAddress;
    query: ChainAddress;
    impact: ChainAddress;
    router?: ChainAddress;
    routerBypass?: ChainAddress;
  };
  isTestNet: boolean;
  chainId: ChainId;
  gridSize: number;
  proxyPaths: {
    cold: number;
    liq: number;
    long: number;
    dfltColdSwap?: boolean;
  };
  blockExplorer?: string;
  displayName: string;
  logoUrl?: string;
}

const ETHEREUM_LOGO =
  'https://d33wubrfki0l68.cloudfront.net/fcd4ecd90386aeb50a235ddc4f0063cfbb8a7b66/4295e/static/bfc04ac72981166c740b189463e1f74c/40129/eth-diamond-black-white.jpg';

const BOB_CHAIN: ChainSpec = {
  nodeUrl: 'https://rpc.gobob.xyz',
  addrs: {
    dex: '0xe5bc234A484A912A61Aa74501960cFc202e773dA',
    query: '0x1dff4Ff93dF17Ad6F44E23368341CcFb8fB8B675',
    impact: '0x30B2a8810B091D1DbE4aAA4905141f815586e274',
    router: '0x9f93D654a1cdC128c27F99Af5452b26d8002e607',
    routerBypass: '0x7b96cC2256e94348a678B554e2fC648D13b1560E',
  },
  poolIndex: 400,
  isTestNet: false,
  chainId: '0xed88', // 60808
  gridSize: 4,
  proxyPaths: {
    cold: 3,
    long: 130,
    liq: 128,
    dfltColdSwap: true,
  },
  blockExplorer: 'https://explorer.gobob.xyz',
  displayName: 'BOB',
  logoUrl: ETHEREUM_LOGO,
};

const BOB_TESTNET_CHAIN: ChainSpec = {
  nodeUrl: 'https://bob-rpc.test.sovryn.app',
  addrs: {
    dex: '0x6E47BC2BC7CF8383369BbA36F520323C5F16dC1C',
    query: '0x28A6328B0e167035F33a4C58374F2524Ae9c8dC1',
    impact: '0x56c1F530BF3C81f729EBA05b7BFbf5daA48C875b',
    router: '0x9F6dD52C51D50e3C2Dce847d2a88067bDcB65500',
    routerBypass: '0x806305A4222905CB0a083391d18795F52B8d462c',
  },
  poolIndex: 36000,
  isTestNet: true,
  chainId: '0xc576d', // 808813
  gridSize: 16,
  proxyPaths: {
    cold: 3,
    long: 130,
    liq: 128,
    dfltColdSwap: true,
  },
  blockExplorer: 'https://bob-sepolia.explorer.gobob.xyz/',
  displayName: 'BOB Testnet',
  logoUrl: ETHEREUM_LOGO,
};

const TENDERLY_FORK: ChainSpec = Object.assign({}, BOB_TESTNET_CHAIN, {
  chainId: '0x1b669',
  nodeUrl:
    'https://virtual.mainnet.rpc.tenderly.co/85e84e6d-a6fe-4497-8cfc-e32db752ac01',
  wsUrl: undefined,
  blockExplorer:
    'https://dashboard.tenderly.co/explorer/vnet/85e84e6d-a6fe-4497-8cfc-e32db752ac01',
  displayName: 'Tenderly Fork',
  addrs: {
    dex: '0xDFDC89c04EE7E661Fdbfd50972923823350d8514',
    query: '0x7B794a3101594EC9aF48eF505E9f18DFbe966315',
    impact: '0x3beb724c3c2b8ae0DfCe74015B21f6cf962D9881',
    router: '0xc442ce6a859d3155B4c1347dD424ad11a936f560',
    routerBypass: '0x31B957FE4C68B1949C38F2F8AaeB0028C6860a5d',
  },
});

const SEPOLIA_CHAIN: ChainSpec = {
  nodeUrl: 'https://ethereum-sepolia-rpc.publicnode.com',
  wsUrl: 'wss://ethereum-sepolia-rpc.publicnode.com',
  addrs: {
    dex: '0xad2Ef29985c20d5980dE28c3CbBD0355AB29F9A4',
    query: '0xa3Ede3d94493BA944715a036833c0D6E36E0c52c',
    impact: '0x8AC7f31B587A2369C985b05627873cFA50C70a3C',
    router: '0xbF78d668a90Eac8C1a247C631a07dcC169428658',
    routerBypass: '0x18Ca1b9F9595D402f1a03b0262288a15760D028C',
  },
  poolIndex: 36000,
  isTestNet: true,
  chainId: '0xaa36a7', // 11155111
  gridSize: 16,
  proxyPaths: {
    cold: 3,
    long: 130,
    liq: 128,
    dfltColdSwap: true,
  },
  blockExplorer: 'https://sepolia.etherscan.io/',
  displayName: 'Sepolia',
  logoUrl: ETHEREUM_LOGO,
};

const LOCAL_FORK_CHAIN: ChainSpec = Object.assign({}, SEPOLIA_CHAIN, {
  nodeUrl: 'http://127.0.0.1:8545',
  chainId: '0x7a69',
  displayName: 'Local Fork',
});

const RSK_MAINNET: ChainSpec = {
  nodeUrl: 'https://public-node.rsk.co',
  addrs: {
    dex: '',
    query: '',
    impact: '',
    router: '',
    routerBypass: '',
  },
  poolIndex: 0,
  isTestNet: false,
  chainId: '0x1e', // 30 in decimal
  gridSize: 0,
  proxyPaths: {
    cold: 0,
    long: 0,
    liq: 0,
    dfltColdSwap: true,
  },
  displayName: 'RSK Mainnet',
};

const RSK_TESTNET: ChainSpec = {
  nodeUrl: 'https://public-node.testnet.rsk.co',
  addrs: {
    dex: '',
    query: '',
    impact: '',
    router: '',
    routerBypass: '',
  },
  poolIndex: 0,
  isTestNet: true,
  chainId: '0x1f', // 31 in decimal
  gridSize: 0,
  proxyPaths: {
    cold: 0,
    long: 0,
    liq: 0,
  },
  blockExplorer: 'https://explorer.testnet.rsk.co',
  displayName: 'RSK Testnet',
};

export const CHAIN_SPECS: { [chainId: string]: ChainSpec } = {
  '0xed88': BOB_CHAIN,
  '0xc576d': BOB_TESTNET_CHAIN,
  '0x7a69': LOCAL_FORK_CHAIN,
  '0xaa36a7': SEPOLIA_CHAIN,
  '0x1b669': TENDERLY_FORK,
  '0x1e': RSK_MAINNET,
  '0x1f': RSK_TESTNET,
  sepolia: SEPOLIA_CHAIN,
  local: LOCAL_FORK_CHAIN,
  bob: BOB_CHAIN,
  bobTestnet: BOB_TESTNET_CHAIN,
  fork: TENDERLY_FORK,
};
