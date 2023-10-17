import { useCallback, useEffect, useState } from 'react';

import { getProtocolContract } from '@sovryn/contracts';

import { DEFAULT_PARAMETER } from '../TreasuryStep.constants';

export const useParameterState = () => {
  const [initialState, setInitialState] = useState(DEFAULT_PARAMETER);

  const fetchTreasuryTypeContract = useCallback(() => {
    getProtocolContract(
      initialState.parametersStepExtraData?.treasuryType || '',
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
