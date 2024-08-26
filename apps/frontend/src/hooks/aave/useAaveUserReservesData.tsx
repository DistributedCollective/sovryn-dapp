import { UiPoolDataProvider } from '@aave/contract-helpers';
import { formatReserves, formatUserSummary } from '@aave/math-utils';

import { useMemo } from 'react';

import dayjs from 'dayjs';

import { BOB_CHAIN_ID } from '../../config/chains';

import { config } from '../../constants/aave';
import { AaveUserReservesSummary } from '../../utils/aave/AaveUserReservesSummary';
import { useCachedData } from '../useCachedData';

type UserReservesData = AaveUserReservesSummary | null;

export const useAaveUserReservesData = (): UserReservesData => {
  const provider = config.provider;
  const account = '0xF754D0f4de0e815b391D997Eeec5cD07E59858F0';
  // const { account, provider } = useAccount(); TODO: activate this instead of 2 above once calculations in bob are possible

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

  const { value } = useCachedData<UserReservesData>(
    `AaveUserReservesData/${account}`,
    BOB_CHAIN_ID,
    async () => {
      if (!account || !uiPoolDataProvider) {
        return null;
      }

      const [reservesData, userReservesData] = await Promise.all([
        uiPoolDataProvider.getReservesHumanized({
          lendingPoolAddressProvider: config.PoolAddressesProviderAddress,
        }),
        uiPoolDataProvider.getUserReservesHumanized({
          lendingPoolAddressProvider: config.PoolAddressesProviderAddress,
          user: account,
        }),
      ]);
      const {
        marketReferenceCurrencyDecimals,
        marketReferenceCurrencyPriceInUsd: marketReferencePriceInUsd,
      } = reservesData.baseCurrencyData;
      const currentTimestamp = dayjs().unix();

      return AaveUserReservesSummary.from(
        formatUserSummary({
          currentTimestamp,
          marketReferencePriceInUsd,
          marketReferenceCurrencyDecimals,
          userReserves: userReservesData.userReserves,
          userEmodeCategoryId: userReservesData.userEmodeCategoryId,
          formattedReserves: formatReserves({
            currentTimestamp,
            marketReferencePriceInUsd,
            marketReferenceCurrencyDecimals,
            reserves: reservesData.reservesData,
          }),
        }),
      );
    },
    [uiPoolDataProvider, account],
    null,
    { ttl: 1000 * 60, fallbackToPreviousResult: true },
  );

  return value;
};
