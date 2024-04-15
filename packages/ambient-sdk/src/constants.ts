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
  };
  blockExplorer?: string;
  displayName: string;
  logoUrl?: string;
}

const ETHEREUM_LOGO =
  'https://d33wubrfki0l68.cloudfront.net/fcd4ecd90386aeb50a235ddc4f0063cfbb8a7b66/4295e/static/bfc04ac72981166c740b189463e1f74c/40129/eth-diamond-black-white.jpg';

const BOB_TESTNET_CHAIN: ChainSpec = {
  nodeUrl: 'https://sepolia-dencun.rpc.gobob.xyz',
  wsUrl: 'wss://sepolia-dencun.rpc.gobob.xyz/wss',
  addrs: {
    dex: '0xdA95787c585F179BE374a241C8f0cdC25dC5A751',
    query: '0xA6b5f74DDCc75b4b561D84B19Ad7FD51f0405483',
    impact: '0xE00d0EeFfC2F6838b003c81Fe45894D6400c0B28',
    router: '0x718425f091Df36637e14602635B9a17a20Ba23E4',
    routerBypass: '0x007b3AA69A846cB1f76b60b3088230A52D2A83AC',
  },
  poolIndex: 36000,
  isTestNet: true,
  chainId: '0x94258',
  gridSize: 16,
  proxyPaths: {
    cold: 3,
    long: 130,
    liq: 128,
  },
  blockExplorer: 'https://sepolia-dencun.explorer.gobob.xyz',
  displayName: 'BOB Testnet',
  logoUrl: ETHEREUM_LOGO,
};

const TENDERLY_FORK: ChainSpec = Object.assign({}, BOB_TESTNET_CHAIN, {
  chainId: '0x1b669',
  nodeUrl:
    'https://virtual.mainnet.rpc.tenderly.co/4a0f7fb8-07fb-4cdd-baad-ec76fc7c6233',
  wsUrl: undefined,
  blockExplorer:
    'https://dashboard.tenderly.co/explorer/vnet/85e84e6d-a6fe-4497-8cfc-e32db752ac01/transactions',
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

export const CHAIN_SPECS: { [chainId: string]: ChainSpec } = {
  '0x94258': BOB_TESTNET_CHAIN,
  '0x7a69': LOCAL_FORK_CHAIN,
  '0xaa36a7': SEPOLIA_CHAIN,
  '0x1b669': TENDERLY_FORK,
  sepolia: SEPOLIA_CHAIN,
  local: LOCAL_FORK_CHAIN,
  bobTestnet: BOB_TESTNET_CHAIN,
  fork: TENDERLY_FORK,
};
