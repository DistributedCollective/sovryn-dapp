import { useEffect, useState } from 'react';

import { Decimal } from '@sovryn/utils';

import { RSK_CHAIN_ID } from '../../../../config/chains';

import { useLoadContract } from '../../../../hooks/useLoadContract';
import { asyncCall } from '../../../../store/rxjs/provider-cache';

export const useGetOriginationFee = () => {
  const [originationFee, setOriginationFee] = useState(Decimal.ZERO);
  const contract = useLoadContract('protocol', 'protocol', RSK_CHAIN_ID);

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
