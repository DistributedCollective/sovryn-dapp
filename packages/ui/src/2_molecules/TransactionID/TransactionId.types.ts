export const chains = {
  mainnet: 30,
  testnet: 31,
};

export const currentChainId = chains.mainnet;

export enum ChainId {
  ETH_MAINNET = 1,
  ETH_TESTNET = 3, // Ropsten
  ETH_RINKEBY = 4,
  RSK_MAINNET = 30,
  RSK_TESTNET = 31,
  BSC_MAINNET = 56,
  BSC_TESTNET = 97,
  MATIC_MAINNET = 137, // Polygon
  MATIC_TESTNET = 80001,
}

export const blockExplorers = {
  1: 'https://etherscan.io',
  3: 'https://ropsten.etherscan.io',
  30: 'https://explorer.rsk.co',
  31: 'https://explorer.testnet.rsk.co',
  btc_30: 'https://live.blockcypher.com/btc',
  btc_31: 'https://live.blockcypher.com/btc-testnet',
  56: 'https://bscscan.com',
  97: 'https://testnet.bscscan.com',
};
