import {
  ReservesDataHumanized,
  UiPoolDataProvider,
} from '@aave/contract-helpers';
import { formatUserSummary } from '@aave/math-utils';

import { useCallback, useEffect, useMemo, useState } from 'react';

import dayjs from 'dayjs';
import { ethers } from 'ethers';

import { config } from '../constants/aave';
import { AaveUserReservesSummary } from '../utils/aave';
import { Reserve, useAaveReservesData } from './useAaveReservesData';
import { useAccount } from './useAccount';

export const useAaveUserReservesData = () => {
  const provider = config.provider;
  const { reserves, reservesData } = useAaveReservesData();
  const { signer } = useAccount();
  const [userReservesSummary, setUserReservesSummary] =
    useState<AaveUserReservesSummary | null>(null);

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

  const fetchPoolData = useCallback(
    async (
      uiPoolDataProvider: UiPoolDataProvider,
      reserves: Reserve[],
      reservesData: ReservesDataHumanized,
      signer: ethers.Signer,
    ) => {
      const userReservesData =
        await uiPoolDataProvider.getUserReservesHumanized({
          lendingPoolAddressProvider: config.PoolAddressesProviderAddress,
          user: await signer.getAddress(),
        });

      setUserReservesSummary(
        AaveUserReservesSummary.from(
          formatUserSummary({
            currentTimestamp: dayjs().unix(),
            userReserves: userReservesData.userReserves,
            userEmodeCategoryId: userReservesData.userEmodeCategoryId,
            formattedReserves: reserves,
            marketReferenceCurrencyDecimals:
              reservesData.baseCurrencyData.marketReferenceCurrencyDecimals,
            marketReferencePriceInUsd:
              reservesData.baseCurrencyData.marketReferenceCurrencyPriceInUsd,
          }),
        ),
      );
    },
    [],
  );

  useEffect(() => {
    if (
      !uiPoolDataProvider ||
      reserves.length === 0 ||
      !signer ||
      !reservesData
    ) {
      return;
    }

    fetchPoolData(uiPoolDataProvider, reserves, reservesData, signer);
  }, [uiPoolDataProvider, reserves, signer, reservesData, fetchPoolData]);

  return { userReservesSummary };
};
