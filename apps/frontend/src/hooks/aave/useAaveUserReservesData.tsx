import {
  ReservesDataHumanized,
  UiPoolDataProvider,
} from '@aave/contract-helpers';

import { useCallback, useEffect, useMemo, useState } from 'react';

import dayjs from 'dayjs';

import { config } from '../../constants/aave';
import { UserReservesData } from '../../types/aave';
import {
  AaveUserReservesSummary,
  AaveUserReservesSummaryFactory,
} from '../../utils/aave/AaveUserReservesSummary';
import { useAccount } from '../useAccount';
import { useBlockNumber } from '../useBlockNumber';

export const useAaveUserReservesData = (): {
  summary: AaveUserReservesSummary;
  reservesData: ReservesDataHumanized | undefined;
  userReservesData: UserReservesData | undefined;
  timestamp: number;
} => {
  const { account, provider } = useAccount();
  const { value: blockNumber } = useBlockNumber();
  const [processedBlock, setProcessedBlock] = useState<number | undefined>();
  const [timestamp, setTimeStamp] = useState<number>(0);
  const [reservesData, setReservesData] = useState<ReservesDataHumanized>();
  const [userReservesData, setUserReservesData] = useState<UserReservesData>();
  const [summary, setSummary] = useState<AaveUserReservesSummary>(
    AaveUserReservesSummaryFactory.buildZeroSummary([]),
  );

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
    const currentTimestamp = dayjs().unix();

    setReservesData(reservesData);
    setUserReservesData(userReservesData);
    setTimeStamp(currentTimestamp);

    setSummary(
      await AaveUserReservesSummaryFactory.buildSummary({
        provider,
        account,
        reservesData,
        userReservesData,
        currentTimestamp,
      }),
    );
    setProcessedBlock(blockNumber);
  }, [account, uiPoolDataProvider, blockNumber, provider]);

  useEffect(() => {
    if (blockNumber !== processedBlock) {
      loadUserReservesData();
    }
  }, [loadUserReservesData, processedBlock, blockNumber]);

  return { summary, reservesData, userReservesData, timestamp };
};
