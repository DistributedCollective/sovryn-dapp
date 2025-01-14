import { GatewaySDK } from '@gobob/bob-sdk';
import { QueryClient } from '@tanstack/react-query';

import React from 'react';

export const bobGateway = new GatewaySDK('bob');

export const strategies = [
  {
    strategyAddress: '0x0A0A0F6d572488093763C13AF7aB55597477aBDB',
    toToken: 'wBTC',
    tokenA: 'SolvBTC.BBN',
    tokenB: 'UniBTC',
    category: 'Liquidity providing',
    incentives: (
      <div className="flex flex-col">
        <span>Spice</span>
        <span>+ Segment Points</span>
        <span>+ Supply APR</span>
        <span>+ Solv XP</span>
        <span>+ Babylon Points</span>
      </div>
    ),
    about:
      'Lorem bitcoinae dollar situs ametus, consensusium adipiscing elitum, sed  do proofus-of-workium tempor incididunt ut blockchainus ',
  },
  {
    strategyAddress: '0x15b6ce34A89769AdEa427FD3CCf76cdf32CE4d2B',
    toToken: 'wBTC',
    tokenA: 'WBTC',
    tokenB: 'SolvBTC.BBN',
    category: 'Liquidity providing',
    incentives: (
      <div className="flex flex-col">
        <span>Spice</span>
        <span>+ Segment Points</span>
        <span>+ Supply APR</span>
        <span>+ Solv XP</span>
        <span>+ Babylon Points</span>
      </div>
    ),
    about:
      'Lorem bitcoinae dollar situs ametus, consensusium adipiscing elitum, sed  do proofus-of-workium tempor incididunt ut blockchainus ',
  },
  {
    strategyAddress: '0x9FaF18725Ab3dE1F1bF94c74d40888AF4690EFc9',
    toToken: 'wBTC',
    tokenA: 'WBTC',
    tokenB: 'UniBTC',
    category: 'Liquidity providing',
    incentives: (
      <div className="flex flex-col">
        <span>Spice</span>
        <span>+ Segment Points</span>
        <span>+ Supply APR</span>
        <span>+ Solv XP</span>
        <span>+ Babylon Points</span>
      </div>
    ),
    about:
      'Lorem bitcoinae dollar situs ametus, consensusium adipiscing elitum, sed  do proofus-of-workium tempor incididunt ut blockchainus ',
  },
];

export const queryClient = new QueryClient();
