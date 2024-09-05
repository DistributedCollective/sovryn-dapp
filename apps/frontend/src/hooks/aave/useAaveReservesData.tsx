import {
  ReserveDataHumanized,
  UiPoolDataProvider,
} from '@aave/contract-helpers';
import { formatReserves, FormatReserveUSDResponse } from '@aave/math-utils';

import { useCallback, useEffect, useMemo, useState } from 'react';

import dayjs from 'dayjs';

import { getProvider } from '@sovryn/ethers-provider';

import { BOB_CHAIN_ID } from '../../config/chains';

import { config } from '../../constants/aave';

export type Reserve = ReserveDataHumanized & FormatReserveUSDResponse;
export type ReserveData = { reserves: Reserve[]; loading: boolean };

export const useAaveReservesData = (): ReserveData => {
  const [reserves, setReserves] = useState<Reserve[]>([]);
  const [loading, setLoading] = useState(false);

  const uiPoolDataProvider = useMemo(
    () =>
      new UiPoolDataProvider({
        provider: getProvider(BOB_CHAIN_ID),
        uiPoolDataProviderAddress: config.UiPoolDataProviderV3Address,
        chainId: Number(BOB_CHAIN_ID),
      }),
    [],
  );

  const fetchReservesData = useCallback(
    async (uiPoolDataProvider: UiPoolDataProvider) => {
      const currentTimestamp = dayjs().unix();
      const reservesData = await uiPoolDataProvider.getReservesHumanized({
        lendingPoolAddressProvider: config.PoolAddressesProviderAddress,
      });
      const formattedReserves = formatReserves({
        reserves: reservesData.reservesData,
        currentTimestamp,
        marketReferenceCurrencyDecimals:
          reservesData.baseCurrencyData.marketReferenceCurrencyDecimals,
        marketReferencePriceInUsd:
          reservesData.baseCurrencyData.marketReferenceCurrencyPriceInUsd,
      });

      setReserves(
        // rename weth to eth. We don't expose WETH through ui.
        formattedReserves.map(r =>
          r.symbol === 'WETH' ? { ...r, symbol: 'ETH' } : r,
        ),
      );
    },
    [setReserves],
  );

  useEffect(() => {
    setLoading(true);
    fetchReservesData(uiPoolDataProvider).finally(() => setLoading(false));
  }, [uiPoolDataProvider, fetchReservesData]);

  return { reserves, loading };
};
