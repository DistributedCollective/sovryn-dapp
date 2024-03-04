import { useEffect, useMemo, useState } from 'react';

import dayjs from 'dayjs';

import { RSK_CHAIN_ID } from '../../../../../../config/chains';

import { useBlockNumber } from '../../../../../../hooks/useBlockNumber';
import { useIsMounted } from '../../../../../../hooks/useIsMounted';
import { rskClient } from '../../../../../../utils/clients';
import { useGetVestingUnlockBalanceQuery } from '../../../../../../utils/graphql/rsk/generated';
import { VestingContractTableRecord } from '../Vesting.types';
import { useGetLastTokensWithdraw } from './useGetLastTokensWithdraw';

export const useGetUnlockedBalance = (item: VestingContractTableRecord) => {
  const {
    lastWithdrawTimestamp,
    loading: loadingTimestamp,
    refetch,
  } = useGetLastTokensWithdraw(item.address);

  const [currentTimestamp, setCurrentTimestamp] = useState(dayjs().unix());

  const { value: block } = useBlockNumber(RSK_CHAIN_ID);
  const isMounted = useIsMounted();

  useEffect(() => {
    setCurrentTimestamp(dayjs().unix());
  }, [lastWithdrawTimestamp]);

  useEffect(() => {
    if (!isMounted || !block || loadingTimestamp) {
      return;
    }

    refetch();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [block]);

  const lastWithdraw = useMemo(
    () => lastWithdrawTimestamp ?? dayjs().subtract(4, 'year').unix(),
    [lastWithdrawTimestamp],
  );

  const { loading: loadingBalance, data } = useGetVestingUnlockBalanceQuery({
    variables: {
      vestingAddress: item.address,
      timestamp: lastWithdraw,
      currentTimestamp,
    },
    client: rskClient,
  });

  const stakeHistory = useMemo(
    () => data?.vestingContracts[0].stakeHistory,
    [data?.vestingContracts],
  );

  const result = useMemo(
    () =>
      stakeHistory?.reduce((acc, item) => acc + Number(item.amount), 0) || 0,
    [stakeHistory],
  );

  const isLoading = useMemo(
    () => loadingTimestamp || loadingBalance,
    [loadingTimestamp, loadingBalance],
  );

  return { isLoading, result };
};
