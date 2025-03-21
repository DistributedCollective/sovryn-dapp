import { GatewaySDK } from '@gobob/bob-sdk';
import { QueryClient } from '@tanstack/react-query';

import React from 'react';

export const bobGateway = new GatewaySDK('bob');

export const strategies = [
  {
    strategyAddress: '0xBA67A0a0C2dd790182D1954B4C9788f9Ae43e604',
    toToken: 'wBTC',
    name: 'solvBTCBBN/uniBTC',
    tokenA: 'solvBTCBBN',
    tokenB: 'uniBTC',
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
    name: 'wbtc/solvBTCBBN',
    tokenA: 'wbtc',
    tokenB: 'solvBTCBBN',
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
    name: 'wBTC/uniBTC',
    tokenA: 'wBTC',
    tokenB: 'uniBTC',
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
