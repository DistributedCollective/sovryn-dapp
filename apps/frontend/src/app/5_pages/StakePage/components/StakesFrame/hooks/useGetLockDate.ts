import { useEffect, useState } from 'react';

import { useGetProtocolContract } from '../../../../../../hooks/useGetContract';
import { asyncCall } from '../../../../../../store/rxjs/provider-cache';

export const useGetLockDate = (timestamp: number) => {
  const stakingContract = useGetProtocolContract('staking');
  const [lockDate, setLockDate] = useState(0);

  useEffect(() => {
    const getLockDate = async () => {
      if (timestamp !== 0 && stakingContract) {
        const date = await asyncCall(
          `staking/timestampToLockDate/${timestamp}`,
          () => stakingContract.timestampToLockDate(timestamp),
        );
        setLockDate(Number(date));
      }
    };

    getLockDate();
  }, [timestamp, stakingContract]);

  return { lockDate };
};
