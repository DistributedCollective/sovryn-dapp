import { useCallback, useEffect, useState } from 'react';

import { useGetProtocolContract } from '../../../../hooks/useGetContract';
import { getRskChainId } from '../../../../utils/chain';

export const useGetKickoffTs = () => {
  const stakingContract = useGetProtocolContract('staking', getRskChainId());
  const [kickoffTs, setKickoffTs] = useState(0);

  const getKickoffTs = useCallback(async () => {
    const getKickoffTs = await stakingContract?.kickoffTS();
    if (getKickoffTs) {
      setKickoffTs(Number(getKickoffTs));
    }
  }, [stakingContract]);

  useEffect(() => {
    getKickoffTs();
  }, [getKickoffTs]);

  return { kickoffTs };
};
