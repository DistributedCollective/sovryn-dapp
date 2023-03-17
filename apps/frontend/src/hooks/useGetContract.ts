import { useEffect, useMemo, useState } from 'react';

import { ContractInterface, ethers } from 'ethers';

import { getProtocolContract } from '@sovryn/contracts';
import { ChainId } from '@sovryn/ethers-provider';

import { defaultChainId } from '../config/chains';

import { useAccount } from './useAccount';
import { useIsMounted } from './useIsMounted';

export const useGetProtocolContract = (
  contractName: string,
  chain: ChainId = defaultChainId,
  customSigner?: ethers.providers.JsonRpcSigner,
) => {
  const isMounted = useIsMounted();
  const { signer: userSigner } = useAccount();

  const [address, setAddress] = useState<string | undefined>(undefined);
  const [abi, setAbi] = useState<ContractInterface | undefined>(undefined);

  useEffect(() => {
    if (isMounted()) {
      getProtocolContract(contractName, chain).then(result => {
        if (isMounted()) {
          setAddress(result.address);
          setAbi(result.abi);
        }
      });
    }
  }, [chain, contractName, isMounted]);

  return useMemo(() => {
    if (address && abi) {
      const signer = customSigner || userSigner;

      return new ethers.Contract(address, abi, signer);
    }
  }, [address, abi, customSigner, userSigner]);
};
