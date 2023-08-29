import { useEffect, useState } from 'react';

import { Decimal } from '@sovryn/utils';

import { defaultChainId } from '../../../../../../config/chains';

import { useLoadContract } from '../../../../../../hooks/useLoadContract';

export const useGetOriginationFee = () => {
  const [originationFee, setOriginationFee] = useState(Decimal.ZERO);
  const contract = useLoadContract('protocol', 'protocol', defaultChainId);

  useEffect(() => {
    const fetchOriginationFee = async () => {
      if (!contract) {
        return;
      }

      const result = await contract.borrowingFeePercent();

      if (result) {
        setOriginationFee(Decimal.fromBigNumberString(result));
      }
    };

    fetchOriginationFee();
  }, [contract]);

  return originationFee;
};
