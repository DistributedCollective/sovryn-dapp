import { useCallback, useEffect, useState } from 'react';

import { useGetProtocolContract } from '../../../../hooks/useGetContract';
import { asyncCall } from '../../../../store/rxjs/provider-cache';
import { getRskChainId } from '../../../../utils/chain';

export const useGetKickoffTs = () => {
  const stakingContract = useGetProtocolContract('staking', getRskChainId());
  const [kickoffTs, setKickoffTs] = useState(0);

  const getKickoffTs = useCallback(async () => {
    const result = await asyncCall(
      'staking/kickoffTS',
      () => stakingContract?.kickoffTS(),
      { ttl: 1800_000 },
    );
    if (result) {
      setKickoffTs(Number(result));
    }
  }, [stakingContract]);

  useEffect(() => {
    getKickoffTs();
  }, [getKickoffTs]);

  return { kickoffTs };
};
