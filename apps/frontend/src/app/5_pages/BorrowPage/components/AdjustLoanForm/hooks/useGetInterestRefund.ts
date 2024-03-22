import { useEffect, useState } from 'react';

import { Decimal } from '@sovryn/utils';

import { RSK_CHAIN_ID } from '../../../../../../config/chains';

import { useLoadContract } from '../../../../../../hooks/useLoadContract';

export const useGetInterestRefund = (loanId: string) => {
  const [interestRefund, setInterestRefund] = useState(Decimal.ZERO);
  const contract = useLoadContract('protocol', 'protocol', RSK_CHAIN_ID);

  useEffect(() => {
    const fetchInterestRefund = async () => {
      if (!contract || interestRefund.gt(0)) {
        return;
      }

      const loanInterestData = await contract.getLoanInterestData(loanId);
      if (loanInterestData && loanInterestData.interestDepositRemaining) {
        setInterestRefund(
          Decimal.fromBigNumberString(
            loanInterestData.interestDepositRemaining,
          ),
        );
      }
    };

    fetchInterestRefund();
  }, [contract, interestRefund, loanId]);

  return interestRefund;
};
