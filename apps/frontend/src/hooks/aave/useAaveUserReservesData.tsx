import { UiPoolDataProvider } from '@aave/contract-helpers';
import { formatReserves, formatUserSummary } from '@aave/math-utils';

import { useCallback, useEffect, useMemo, useState } from 'react';

import dayjs from 'dayjs';

import { config } from '../../constants/aave';
import {
  AaveUserReservesSummary,
  AaveUserReservesSummaryFactory,
} from '../../utils/aave/AaveUserReservesSummary';
import { useAccount } from '../useAccount';
import { useBlockNumber } from '../useBlockNumber';

export const useAaveUserReservesData = (): AaveUserReservesSummary => {
  const { account, provider } = useAccount();
  const [value, setValue] = useState<AaveUserReservesSummary>(
    AaveUserReservesSummaryFactory.buildZeroSummary([]),
  );
  const { value: blockNumber } = useBlockNumber();
  const [processedBlock, setProcessedBlock] = useState<number | undefined>();

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

  const loadUserReservesData = useCallback(async () => {
    if (!account || !provider || !uiPoolDataProvider || !blockNumber) {
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
    const userSummary = formatUserSummary({
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
    });

    setValue(
      await AaveUserReservesSummaryFactory.buildSummary(
        provider,
        account,
        userSummary,
      ),
    );
    setProcessedBlock(blockNumber);
  }, [account, uiPoolDataProvider, blockNumber, provider]);

  useEffect(() => {
    if (blockNumber !== processedBlock) {
      loadUserReservesData();
    }
  }, [loadUserReservesData, processedBlock, blockNumber]);

  return value;
};
