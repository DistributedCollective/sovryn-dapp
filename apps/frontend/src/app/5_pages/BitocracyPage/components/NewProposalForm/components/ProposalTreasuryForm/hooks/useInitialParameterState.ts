import { useCallback, useEffect, useState } from 'react';

import { getProtocolContract } from '@sovryn/contracts';

import { defaultChainId } from '../../../../../../../../config/chains';

import { DEFAULT_PARAMETER } from '../ProposalTreasuryForm.constants';

export const useInitialParameterState = () => {
  const [initialState, setInitialState] = useState(DEFAULT_PARAMETER);

  const fetchTreasuryTypeContract = useCallback(() => {
    getProtocolContract(
      initialState.parametersStepExtraData?.treasuryType || '',
      defaultChainId,
    )
      .then(contract => {
        setInitialState(prevState => ({
          ...prevState,
          target: contract.address,
        }));
      })
      .catch(error => {
        console.error('Error fetching contract:', error);
      });
  }, [initialState.parametersStepExtraData?.treasuryType]);

  useEffect(() => {
    fetchTreasuryTypeContract();
  }, [initialState.target, fetchTreasuryTypeContract]);

  return initialState;
};
