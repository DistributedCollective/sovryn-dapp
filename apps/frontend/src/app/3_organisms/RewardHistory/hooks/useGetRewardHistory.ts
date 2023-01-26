import { useMemo } from 'react';

import { OrderOptions } from '@sovryn/ui';

import { zeroClient } from '../../../../utils/clients';
import {
  StabilityDepositChange_Filter,
  StabilityDepositChange_OrderBy,
  useGetStabilityDepositChangesQuery,
} from '../../../../utils/graphql/zero/generated';

export const useGetRewardHistory = (
  account: string,
  pageSize: number,
  page: number,
  orderOptions: OrderOptions,
) => {
  const config = useMemo(
    () => ({
      skip: page * pageSize,
      pageSize,
      orderBy:
        (orderOptions.orderBy as StabilityDepositChange_OrderBy) || undefined,
      orderDirection: orderOptions.orderDirection || undefined,
      filters: {
        stabilityDepositOperation_in: [
          'withdrawGainToLineOfCredit',
          'withdrawCollateralGain',
        ],
        stabilityDeposit: account,
      } as StabilityDepositChange_Filter,
    }),
    [page, orderOptions, pageSize, account],
  );

  const { loading, data } = useGetStabilityDepositChangesQuery({
    variables: config,
    client: zeroClient,
  });

  const stabilityDepositChanges = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.stabilityDepositChanges.map(tx => ({
      sequenceNumber: tx.sequenceNumber,
      depositedAmountChange: tx.depositedAmountChange,
      stabilityDepositOperation: tx.stabilityDepositOperation,
      collateralGain: tx.collateralGain || '',
      timestamp: tx.transaction.timestamp,
      hash: tx.transaction.id,
    }));
  }, [data]);

  return { loading, data: stabilityDepositChanges };
};
