import { ChainIds } from '@sovryn/ethers-provider';

export const sovrynLinks = {
  discord: 'https://discord.gg/kBTNx4zjRf',
  telegram: 'https://t.me/SovrynBitcoin',
  twitter: 'https://twitter.com/Sovrynbtc',
  github: 'https://github.com/DistributedCollective',
  wiki: 'https://wiki.sovryn.app/en/',
  dappAlpha: 'https://live.sovryn.app/',
  blog: 'https://www.sovryn.app/blog',
};

export const requiredChain = ChainIds.RSK_TESTNET;

export const APPROVAL_FUNCTION = 'approve';

export const MESSAGE_TYPES = {
  exampleMessage: [{ name: 'content', type: 'string' }],
};
