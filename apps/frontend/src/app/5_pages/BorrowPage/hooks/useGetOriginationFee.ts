import { useEffect, useState } from 'react';

import { Decimal } from '@sovryn/utils';

import { useLoadContract } from '../../../../hooks/useLoadContract';
import { asyncCall } from '../../../../store/rxjs/provider-cache';
import { useCurrentChain } from '../../../../hooks/useChainStore';

export const useGetOriginationFee = () => {
  const currentChainId = useCurrentChain();
  const [originationFee, setOriginationFee] = useState(Decimal.ZERO);
  const contract = useLoadContract('protocol', 'protocol', currentChainId);

  useEffect(() => {
    const fetchOriginationFee = async () => {
      if (!contract) {
        return;
      }

      const result = await asyncCall('protocol/borrowingFeePercent', () =>
        contract.borrowingFeePercent(),
      );

      if (result) {
        setOriginationFee(Decimal.fromBigNumberString(result));
      }
    };

    fetchOriginationFee();
  }, [contract]);

  return originationFee;
};
