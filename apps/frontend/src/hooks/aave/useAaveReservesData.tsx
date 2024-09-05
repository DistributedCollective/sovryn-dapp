import {
  ReserveDataHumanized,
  UiPoolDataProvider,
} from '@aave/contract-helpers';
import { formatReserves, FormatReserveUSDResponse } from '@aave/math-utils';

import { useCallback, useEffect, useMemo, useState } from 'react';

import dayjs from 'dayjs';

import { config } from '../../constants/aave';
import { useAccount } from '../useAccount';

export type Reserve = ReserveDataHumanized & FormatReserveUSDResponse;

export type ReserveData = { reserves: Reserve[]; loading: boolean };

export const useAaveReservesData = (): ReserveData => {
  const { provider } = useAccount();
  const [reserves, setReserves] = useState<Reserve[]>([]);
  const [loading, setLoading] = useState(false);

  const uiPoolDataProvider = useMemo(
    () =>
      provider
        ? new UiPoolDataProvider({
            provider,
            uiPoolDataProviderAddress: config.UiPoolDataProviderV3Address,
            chainId: config.chainId,
          })
        : null,
    [provider],
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
    if (uiPoolDataProvider) {
      setLoading(true);
      fetchReservesData(uiPoolDataProvider).finally(() => setLoading(false));
    }
  }, [uiPoolDataProvider, fetchReservesData]);

  return { reserves, loading };
};
