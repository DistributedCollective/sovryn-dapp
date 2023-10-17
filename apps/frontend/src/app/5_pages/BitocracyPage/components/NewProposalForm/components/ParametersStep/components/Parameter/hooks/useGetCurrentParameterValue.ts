import { useCallback, useEffect, useMemo, useState } from 'react';

import { BigNumber } from 'ethers';

import { ContractGroup } from '@sovryn/contracts';

import { useLoadContract } from '../../../../../../../../../../hooks/useLoadContract';
import { asyncCall } from '../../../../../../../../../../store/rxjs/provider-cache';
import { getContractDetails } from '../../../ParametersStep.utils';

export const useGetCurrentParameterValue = (
  parameter: string,
  contract: string,
) => {
  const [parameterValue, setParameterValue] = useState<string>('');

  const { contractName, contractGroup } = useMemo(
    () => getContractDetails(contract),
    [contract],
  );

  const loadedContract = useLoadContract(
    contractName,
    contractGroup as ContractGroup,
  );

  const fetchParameterValue = useCallback(async () => {
    if (!loadedContract || parameter === '') {
      return;
    }

    try {
      const parameterValue = await asyncCall(
        `newProposal/${contract}/${parameter}`,
        () => loadedContract[parameter](),
      );

      if (parameterValue !== null || parameterValue !== undefined) {
        if (typeof parameterValue === 'object') {
          setParameterValue(BigNumber.from(parameterValue).toString());
        } else {
          setParameterValue(String(parameterValue));
        }
      }
    } catch (error) {
      console.error(`Error fetching parameter value: ${error}`);
    }
  }, [contract, loadedContract, parameter]);

  useEffect(() => {
    fetchParameterValue();
  }, [fetchParameterValue]);

  return parameterValue;
};
