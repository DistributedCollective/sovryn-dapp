import {
  ReservesDataHumanized,
  UiPoolDataProvider,
} from '@aave/contract-helpers';

import { useCallback, useEffect, useState } from 'react';

import dayjs from 'dayjs';

import { getProvider } from '@sovryn/ethers-provider';

import { BOB_CHAIN_ID } from '../../config/chains';

import { config } from '../../constants/aave';
import { UserReservesData } from '../../types/aave';
import {
  AaveUserReservesSummary,
  AaveUserReservesSummaryFactory,
} from '../../utils/aave/AaveUserReservesSummary';
import { useAccount } from '../useAccount';
import { useBlockNumber } from '../useBlockNumber';

const uiPoolDataProvider = new UiPoolDataProvider({
  provider: getProvider(BOB_CHAIN_ID),
  uiPoolDataProviderAddress: config.UiPoolDataProviderV3Address,
  chainId: Number(BOB_CHAIN_ID),
});

export const useAaveUserReservesData = (): {
  summary: AaveUserReservesSummary;
  reservesData: ReservesDataHumanized | undefined;
  userReservesData: UserReservesData | undefined;
  timestamp: number;
  loading: boolean;
} => {
  const { account } = useAccount();
  const { value: blockNumber } = useBlockNumber();
  const [processedBlock, setProcessedBlock] = useState<number | undefined>();
  const [timestamp, setTimeStamp] = useState<number>(0);
  const [reservesData, setReservesData] = useState<ReservesDataHumanized>();
  const [userReservesData, setUserReservesData] = useState<UserReservesData>();
  const [summary, setSummary] = useState<AaveUserReservesSummary>(
    AaveUserReservesSummaryFactory.buildZeroSummary([]),
  );
  const [loading, setLoading] = useState(false);

  const loadUserReservesData = useCallback(async () => {
    if (!account || !blockNumber) {
      return null;
    }

    try {
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
          provider: getProvider(BOB_CHAIN_ID),
          account,
          reservesData,
          userReservesData,
          currentTimestamp,
        }),
      );
      setProcessedBlock(blockNumber);
    } catch (e) {
      console.error(e);
    }
  }, [account, blockNumber]);

  useEffect(() => {
    if (blockNumber !== processedBlock) {
      setLoading(true);
      loadUserReservesData().finally(() => setLoading(false));
    }
  }, [loadUserReservesData, processedBlock, blockNumber]);

  useEffect(() => {
    setLoading(true);
    setProcessedBlock(-1);
  }, [account]);

  return { summary, reservesData, userReservesData, timestamp, loading };
};
