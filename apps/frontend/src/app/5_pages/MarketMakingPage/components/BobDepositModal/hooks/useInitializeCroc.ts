import { useRef, useEffect } from 'react';

import { CrocEnv } from '@sovryn/ambient-sdk';
import { getProvider } from '@sovryn/ethers-provider';

import { BOB_CHAIN_ID } from '../../../../../../config/chains';

import { useAccount } from '../../../../../../hooks/useAccount';

const CHAIN_ID = BOB_CHAIN_ID;

export const useInitializeCroc = () => {
  const croc = useRef<CrocEnv>();
  const { signer } = useAccount();

  useEffect(() => {
    if (!signer) return;
    croc.current = new CrocEnv(getProvider(CHAIN_ID), signer);
  }, [signer]);

  return croc;
};
