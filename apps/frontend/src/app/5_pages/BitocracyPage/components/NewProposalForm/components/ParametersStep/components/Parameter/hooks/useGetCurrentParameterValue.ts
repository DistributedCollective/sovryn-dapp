import { useEffect, useMemo, useState } from 'react';

import { BigNumber } from 'ethers';

import { ContractGroup } from '@sovryn/contracts';

import { useLoadContract } from '../../../../../../../../../../hooks/useLoadContract';
import { getContractDetails } from '../../../ParametersStep.utils';

export const useGetCurrentParameterValue = (
  parameter: string,
  contract: string,
) => {
  const [parameterValue, setParameterValue] = useState('');
  const [contractAddress, setContractAddress] = useState('');
  const { contractName, contractGroup } = useMemo(
    () => getContractDetails(contract),
    [contract],
  );

  const loadedContract = useLoadContract(
    contractName,
    contractGroup as ContractGroup,
  );

  useEffect(() => {
    const fetchParameter = async () => {
      if (!loadedContract || !parameter || parameter === 'custom') {
        return;
      }

      const parameterResult = await loadedContract[parameter]();

      setContractAddress(loadedContract.address);

      if (parameterResult !== null && parameterResult !== undefined) {
        setParameterValue(
          typeof parameterResult === 'object'
            ? BigNumber.from(parameterResult).toString()
            : String(parameterResult),
        );
      } else {
        console.error(
          `Function '${parameter}' does not exist on the contract.`,
        );
        setContractAddress('');
        setParameterValue('');
      }
    };

    fetchParameter();
  }, [loadedContract, parameter]);

  return { parameterValue, contractAddress };
};
