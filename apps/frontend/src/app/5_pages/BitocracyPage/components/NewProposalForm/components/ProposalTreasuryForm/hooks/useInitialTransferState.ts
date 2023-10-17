import { useCallback, useEffect, useState } from 'react';

import { getProtocolContract } from '@sovryn/contracts';

import { defaultChainId } from '../../../../../../../../config/chains';

import { DEFAULT_TRANSFER } from '../ProposalTreasuryForm.constants';

export const useInitialTransferState = () => {
  const [initialTransfer, setInitialTransfer] = useState(DEFAULT_TRANSFER);

  const fetchTreasuryTypeContract = useCallback(() => {
    getProtocolContract(
      initialTransfer.parametersStepExtraData?.treasuryType || '',
      defaultChainId,
    )
      .then(contract => {
        setInitialTransfer(prevTransfer => ({
          ...prevTransfer,
          parametersStepExtraData: {
            ...prevTransfer.parametersStepExtraData,
            treasuryTypeContract: contract.address,
          },
        }));
      })
      .catch(error => {
        console.error('Error fetching contract:', error);
      });
  }, [initialTransfer.parametersStepExtraData?.treasuryType]);

  useEffect(() => {
    fetchTreasuryTypeContract();
  }, [
    initialTransfer.parametersStepExtraData?.treasuryType,
    fetchTreasuryTypeContract,
  ]);

  return initialTransfer;
};
