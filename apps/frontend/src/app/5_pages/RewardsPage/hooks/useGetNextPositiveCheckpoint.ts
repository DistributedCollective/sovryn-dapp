import { useCallback, useEffect, useState } from 'react';

import { getTokenContract, SupportedTokens } from '@sovryn/contracts';

import { useAccount } from '../../../../hooks/useAccount';
import { useGetProtocolContract } from '../../../../hooks/useGetContract';
import { getRskChainId } from '../../../../utils/chain';

const MAX_NEXT_POSITIVE_CHECKPOINT = 75;

type UserCheckpoint = {
  checkpointNum: string;
  hasFees: boolean;
  hasSkippedCheckpoints: boolean;
};

export const useGetNextPositiveCheckpoint = (
  token: SupportedTokens,
  totalTokenCheckpoints: number,
) => {
  const { account } = useAccount();
  const [userCheckpoint, setUserCheckpoint] = useState<UserCheckpoint>();
  const feeSharing = useGetProtocolContract('feeSharing');

  const updateNextPositiveCheckpoint = useCallback(async () => {
    if (!feeSharing) {
      return;
    }
    const tokenContract = await getTokenContract(token, getRskChainId());

    const processedCheckpoints = await feeSharing.processedCheckpoints(
      account,
      account ? tokenContract.address : null,
    );
    let userNextUnprocessedCheckpoint = Number(processedCheckpoints.toString());

    while (userNextUnprocessedCheckpoint < totalTokenCheckpoints) {
      const { hasFees, checkpointNum, hasSkippedCheckpoints } =
        await feeSharing.getNextPositiveUserCheckpoint(
          account,
          account ? tokenContract.address : null,
          userNextUnprocessedCheckpoint,
          MAX_NEXT_POSITIVE_CHECKPOINT,
        );

      userNextUnprocessedCheckpoint = Number(checkpointNum.toString());

      if (!!hasFees) {
        return setUserCheckpoint({
          checkpointNum: checkpointNum.toString(),
          hasFees,
          hasSkippedCheckpoints,
        });
      }
    }

    setUserCheckpoint({
      checkpointNum: '0',
      hasFees: false,
      hasSkippedCheckpoints: false,
    });
  }, [account, feeSharing, token, totalTokenCheckpoints]);

  useEffect(() => {
    if (totalTokenCheckpoints >= 0) {
      updateNextPositiveCheckpoint();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalTokenCheckpoints]);

  return { userCheckpoint, updateNextPositiveCheckpoint };
};
