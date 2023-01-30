import { useCallback, useMemo, useState } from 'react';

import { ContractInterface, ethers } from 'ethers';

import { getProtocolContract } from '@sovryn/contracts';
import { ChainId } from '@sovryn/ethers-provider';

import { defaultChainId } from '../config/chains';
import { useAccount } from './useAccount';

export const useGetProtocolContract = (
  contractName: string,
  chain: ChainId = defaultChainId,
  customSigner?: ethers.providers.JsonRpcSigner,
) => {
  const { signer: userSigner } = useAccount();

  const [address, setAddress] = useState<string | undefined>(undefined);
  const [abi, setAbi] = useState<ContractInterface | undefined>(undefined);

  const getContractDetails = useCallback(async () => {
    const result = await getProtocolContract(contractName, chain);

    return result;
  }, [chain, contractName]);

  const contract = useMemo(() => {
    getContractDetails().then(result => {
      setAddress(result.address);
      setAbi(result.abi);
    });

    if (address && abi) {
      const signer = customSigner || userSigner;

      return new ethers.Contract(address, abi, signer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getContractDetails, address, abi]);

  return contract;
};
