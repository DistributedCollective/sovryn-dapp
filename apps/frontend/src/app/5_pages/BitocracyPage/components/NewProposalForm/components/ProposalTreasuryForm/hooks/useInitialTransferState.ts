import { useCallback, useEffect, useState } from 'react';

import { getProtocolContract } from '@sovryn/contracts';

import { defaultChainId } from '../../../../../../../../config/chains';

import { initialTransferState } from '../ProposalTreasuryForm.constants';

export const useInitialTransferState = () => {
  const [initialTransfer, setInitialTransfer] = useState(initialTransferState);

  const fetchTreasuryTypeContract = useCallback(() => {
    getProtocolContract(initialTransfer.treasuryType, defaultChainId)
      .then(contract => {
        setInitialTransfer(prevTransfer => ({
          ...prevTransfer,
          treasuryTypeContract: contract.address,
        }));
      })
      .catch(error => {
        console.error('Error fetching contract:', error);
      });
  }, [initialTransfer.treasuryType]);

  useEffect(() => {
    fetchTreasuryTypeContract();
  }, [initialTransfer.treasuryType, fetchTreasuryTypeContract]);

  return initialTransfer;
};
