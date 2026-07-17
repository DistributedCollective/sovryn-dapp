import { render, screen } from '@testing-library/react';

import React from 'react';

import 'jest-canvas-mock';

import { ChainIds } from '@sovryn/ethers-provider';

import { i18n } from '../../../../../../../locales/i18n';
import { USDT0_BTC_AMM_POOL_TOKEN } from '../../../../MarketMakingPage.constants';
import { AmmLiquidityPool } from '../../../../utils/AmmLiquidityPool';
import { PoolsTableReturns } from './PoolsTableReturns';

jest.mock('../../../../hooks/useGetReturnRate', () => ({
  useGetReturnRate: () => ({ beforeRewards: '0.42', afterRewards: '1.00' }),
}));

const usdt0Pool = new AmmLiquidityPool(
  'USDT0',
  'BTC',
  1,
  ChainIds.RSK_MAINNET,
  '0xd107e06964112d3f70cfb386565dfbda16ae71f3',
  USDT0_BTC_AMM_POOL_TOKEN,
);

const dllrPool = new AmmLiquidityPool(
  'DLLR',
  'BTC',
  1,
  ChainIds.RSK_MAINNET,
  '0xe81373285eb8cdee2e0108e98c5aa022948da9d2',
  '0x3D5eDF3201876BF6935090C319FE3Ff36ED3D494',
);

describe('PoolsTableReturns', () => {
  beforeAll(async () => {
    await i18n;
  });

  it('shows the boosted rate with Merkl badge for the USDT0/RBTC pool', () => {
    render(<PoolsTableReturns pool={usdt0Pool} />);

    expect(screen.getByText('~10.42%')).toBeInTheDocument();
    expect(screen.getByLabelText('Merkl incentives')).toBeInTheDocument();
  });

  it('shows the plain rate without badge for other pools', () => {
    render(<PoolsTableReturns pool={dllrPool} />);

    expect(screen.getByText('0.42%')).toBeInTheDocument();
    expect(screen.queryByLabelText('Merkl incentives')).toBeNull();
  });
});
