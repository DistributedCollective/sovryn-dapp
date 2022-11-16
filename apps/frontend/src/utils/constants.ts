import { ChainIds } from '@sovryn/ethers-provider';

export const sovrynLinks = {
  discord: 'https://discord.gg/kBTNx4zjRf',
  telegram: 'https://t.me/SovrynBitcoin',
  twitter: 'https://twitter.com/Sovrynbtc',
  github: 'https://github.com/DistributedCollective',
};

export const footerLinks = [
  {
    id: 'start',
    href: 'https://wiki.sovryn.app/en/getting-started',
    name: 'Getting started',
  },
  {
    id: 'dapp-alfa',
    href: 'https://live.sovryn.app/',
    name: 'Sovryn Alpha',
  },
  {
    id: 'blog',
    href: 'https://www.sovryn.app/blog',
    name: 'Blog',
  },
  {
    id: 'fee',
    href: '#',
    name: 'Fee prices',
  },
  {
    id: 'terms',
    href: '#',
    name: 'Terms & Conditions',
  },
  {
    id: 'policy',
    href: '#',
    name: 'Privacy policy',
  },
];

export const requiredChain = ChainIds.RSK_TESTNET;
