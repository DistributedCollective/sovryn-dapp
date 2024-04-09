import { useEffect, useMemo, useState } from 'react';

import { ContractInterface, ethers } from 'ethers';

import { ContractGroup, getContract } from '@sovryn/contracts';
import { ChainId, getProvider } from '@sovryn/ethers-provider';

import { RSK_CHAIN_ID } from '../config/chains';

import { useAccount } from './useAccount';
import { useIsMounted } from './useIsMounted';

export const useLoadContract = (
  contractName: string,
  group: ContractGroup,
  chain: ChainId = RSK_CHAIN_ID,
  customSigner?: ethers.providers.JsonRpcSigner,
) => {
  const isMounted = useIsMounted();
  const { signer: userSigner } = useAccount();

  const [address, setAddress] = useState<string | undefined>(undefined);
  const [abi, setAbi] = useState<ContractInterface | undefined>(undefined);

  const provider = useMemo(() => getProvider(chain), [chain]);

  useEffect(() => {
    getContract(contractName, group, chain)
      .then(result => {
        if (isMounted()) {
          setAddress(result.address);
          setAbi(result.abi);
        }
      })
      .catch(console.warn);
  }, [chain, contractName, group, isMounted]);

  return useMemo(() => {
    if (address && abi) {
      const signer = customSigner || userSigner || provider;

      return new ethers.Contract(address, abi, signer);
    }
  }, [address, abi, customSigner, userSigner, provider]);
};
