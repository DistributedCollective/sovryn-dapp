import { GatewaySDK } from '@gobob/bob-sdk';
import { QueryClient } from '@tanstack/react-query';

import React from 'react';

export const bobGateway = new GatewaySDK('bob');

export const strategies = [
  {
    strategyAddress: '0x0A0A0F6d572488093763C13AF7aB55597477aBDB',
    toToken: 'wBTC',
    tokenA: 'UniBTC',
    tokenB: 'XSOLVBTC',
    category: 'Liquidity providing',
    incentives: (
      <div className="flex flex-col">
        <span>20x/20x Spice </span>
        <span>+ Supply APR </span>
        <span>+ SolvXP</span>
        <span>+ Babylon Points</span>
        <span>+ Diamond</span>
      </div>
    ),
    about:
      'Maximize your rewards with liquid Bitcoin staking. This pool facilitates seamless swaps between XSOLVBTC and UniBTC, two Liquid Staking Tokens (LSTs) representing BTC. With a 20x Spice multiplier, it offers high incentives for liquidity providers looking to optimize yield while staying fully exposed to BTC derivatives.',
  },

  {
    strategyAddress: '0x2a4F027cb568F2F3f7b2F7008b92C3B0eFc8DCfD',
    toToken: 'wBTC',
    tokenA: 'WBTC',
    tokenB: 'XSOLVBTC',
    category: 'Liquidity providing',
    incentives: (
      <div className="flex flex-col">
        <span>7x/20x Spice</span>
        <span>+ Supply APR</span>
        <span>+ SolvXP</span>
        <span>+ Babylon Points</span>
      </div>
    ),
    about:
      'Combine wrapped BTC liquidity with staking rewards. This pool pairs wBTC with XSOLVBTC, allowing users to move between a widely-used BTC wrapper and an interest-bearing LST. Liquidity providers earn a 7x Spice multiplier on wBTC and a 20x multiplier on XSOLVBTC, making it an attractive option for BTC holders looking to gain exposure to liquid staking rewards.',
  },

  {
    strategyAddress: '0x9509e42a304b408A17403a0a439692DBe8b68F6c',
    toToken: 'wBTC',
    tokenA: 'WBTC',
    tokenB: 'UniBTC',
    category: 'Liquidity providing',
    incentives: (
      <div className="flex flex-col">
        <span>7x/20x Spice</span>
        <span>+ Supply APR</span>
        <span>+ Diamond</span>
      </div>
    ),
    about:
      'Combine wrapped BTC liquidity with staking rewards. This pool pairs wBTC with UniBTC, allowing users to move between a widely-used BTC wrapper and an interest-bearing LST. Liquidity providers earn a 7x Spice multiplier on wBTC and a 20x multiplier on UniBTC, making it an attractive option for BTC holders looking to gain exposure to liquid staking rewards.',
  },
];

export const queryClient = new QueryClient();
