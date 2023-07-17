import { useMemo } from 'react';

import dayjs from 'dayjs';

import { useGetVestingUnlockBalanceQuery } from '../../../../../../utils/graphql/rsk/generated';
import { VestingContractTableRecord } from '../Vesting.types';
import { useGetLastTokensWithdraw } from './useGetLastTokensWithdraw';

export const useGetUnlockedBalance = (item: VestingContractTableRecord) => {
  const lastWithdrawTimestamp = useGetLastTokensWithdraw(item.address);

  const { loading, data } = useGetVestingUnlockBalanceQuery({
    variables: {
      vestingAddress: item.address,
      timestamp: lastWithdrawTimestamp,
      currentTimestamp: dayjs().unix(),
    },
  });

  const stakeHistory = useMemo(
    () => data?.vestingContracts[0].stakeHistory,
    [data?.vestingContracts],
  );

  const result = useMemo(
    () => stakeHistory?.reduce((acc, item) => acc + Number(item.amount), 0),
    [stakeHistory],
  );

  return { loading, result };
};
