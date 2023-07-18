import { useMemo } from 'react';

import { SupportedTokens } from '@sovryn/contracts';

import { useGetTokenContract } from '../../../../hooks/useGetContract';
import { getMaxProcessableCheckpoints } from '../../../../utils/helpers';
import { useGetNextPositiveCheckpoint } from './useGetNextPositiveCheckpoint';
import { useGetTotalTokenCheckpoints } from './useGetTotalTokenCheckpoints';

export const useGetTokenCheckpoints = (token: SupportedTokens) => {
  const tokenContract = useGetTokenContract(token);
  const { maxCheckpoints } = useGetTotalTokenCheckpoints(
    tokenContract?.address!,
  );

  const { userCheckpoint } = useGetNextPositiveCheckpoint(
    tokenContract?.address!,
    Number(maxCheckpoints),
  );

  const maxWithdrawCheckpoint = useMemo(() => {
    if (!userCheckpoint || !maxCheckpoints) {
      return 0;
    }

    return Number(maxCheckpoints) > getMaxProcessableCheckpoints(token)
      ? String(getMaxProcessableCheckpoints(token))
      : Number(maxCheckpoints);
  }, [userCheckpoint, maxCheckpoints, token]);

  return {
    userCheckpoint,
    maxWithdrawCheckpoint,
  };
};
