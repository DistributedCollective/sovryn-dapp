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
    strategyAddress: '0x2a4F027cb568F2F3f7b2F7008b92C3B0eFc8DCfD',
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
    strategyAddress: '0x9509e42a304b408A17403a0a439692DBe8b68F6c',
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
