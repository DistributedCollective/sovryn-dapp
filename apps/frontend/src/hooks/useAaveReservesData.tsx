import {
  ReserveDataHumanized,
  ReservesDataHumanized,
  UiPoolDataProvider,
} from '@aave/contract-helpers';
import { formatReserves, FormatReserveUSDResponse } from '@aave/math-utils';

import { useCallback, useEffect, useMemo, useState } from 'react';

import dayjs from 'dayjs';

import { config } from '../constants/aave';

export type Reserve = ReserveDataHumanized & FormatReserveUSDResponse;

export const useAaveReservesData = () => {
  const provider = config.provider; // TODO: replace with useAccount
  const [reserves, setReserves] = useState<Reserve[]>([]);
  const [reservesData, setReservesData] =
    useState<ReservesDataHumanized | null>(null);

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
      const reserves = reservesData.reservesData.filter(r =>
        config.assetsWhitelist.includes(r.symbol),
      );
      const formattedReserves = formatReserves({
        reserves,
        currentTimestamp,
        marketReferenceCurrencyDecimals:
          reservesData.baseCurrencyData.marketReferenceCurrencyDecimals,
        marketReferencePriceInUsd:
          reservesData.baseCurrencyData.marketReferenceCurrencyPriceInUsd,
      });

      setReserves(formattedReserves);
      setReservesData({
        baseCurrencyData: reservesData.baseCurrencyData,
        reservesData: reserves,
      });
    },
    [],
  );

  useEffect(() => {
    if (uiPoolDataProvider) {
      fetchReservesData(uiPoolDataProvider);
    }
  }, [uiPoolDataProvider, fetchReservesData]);

  return { reserves, reservesData };
};
