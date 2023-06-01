import { useMemo } from 'react';

import { OrderOptions } from '@sovryn/ui';

import { zeroClient } from '../../../../../../utils/clients';
import {
  StabilityDepositChange,
  StabilityDepositChange_Filter,
  StabilityDepositChange_OrderBy,
  useGetStabilityDepositChangesQuery,
} from '../../../../../../utils/graphql/zero/generated';

export const useGetStabilityPoolRewards = (
  account: string,
  pageSize: number,
  page: number,
  orderOptions: OrderOptions,
) => {
  const config = useMemo(
    () => ({
      skip: page * pageSize,
      pageSize,
      orderBy: orderOptions.orderBy as StabilityDepositChange_OrderBy,
      orderDirection: orderOptions.orderDirection,
      filters: {
        stabilityDepositOperation_in: [
          'withdrawGainToLineOfCredit',
          'withdrawCollateralGain',
        ],
        stabilityDeposit: account?.toLowerCase(),
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

    return data.stabilityDepositChanges;
  }, [data]);

  return { loading, data: stabilityDepositChanges as StabilityDepositChange[] };
};
