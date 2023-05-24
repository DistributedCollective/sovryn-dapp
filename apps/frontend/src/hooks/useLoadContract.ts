import { useEffect, useMemo, useState } from 'react';

import { ContractInterface, ethers } from 'ethers';

import { ContractGroup, getContract } from '@sovryn/contracts';
import { ChainId, getProvider } from '@sovryn/ethers-provider';

import { defaultChainId } from '../config/chains';

import { useAccount } from './useAccount';
import { useIsMounted } from './useIsMounted';

export const useLoadContract = (
  contractName: string,
  group: ContractGroup,
  chain: ChainId = defaultChainId,
  customSigner?: ethers.providers.JsonRpcSigner,
) => {
  const isMounted = useIsMounted();
  const { signer: userSigner } = useAccount();
  const provider = getProvider(chain);

  const [address, setAddress] = useState<string | undefined>(undefined);
  const [abi, setAbi] = useState<ContractInterface | undefined>(undefined);

  useEffect(() => {
    getContract(contractName, group, chain).then(result => {
      if (isMounted()) {
        setAddress(result.address);
        setAbi(result.abi);
      }
    });
  }, [chain, contractName, group, isMounted]);

  return useMemo(() => {
    if (address && abi) {
      const signer = customSigner || userSigner || provider;

      return new ethers.Contract(address, abi, signer);
    }
  }, [address, abi, customSigner, userSigner, provider]);
};
