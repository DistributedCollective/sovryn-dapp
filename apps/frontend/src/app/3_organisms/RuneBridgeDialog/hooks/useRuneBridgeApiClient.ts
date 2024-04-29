import React from 'react';

import { useCurrentChain } from '../../../../hooks/useChainStore';
import { isBobChain } from '../../../../utils/chain';
import { currentNetwork } from '../../../../utils/helpers';
import runeBridgeClient from '../api/RuneBridgeClient';
import { endpoints } from '../config';

export const useRuneBridgeApiClient = () => {
  const chainId = useCurrentChain();
  return React.useMemo(() => {
    const suffix = isBobChain(chainId) ? 'runesbob' : 'runes';
    const baseUrl = `${endpoints[currentNetwork]}/api/v1/${suffix}`;
    return new runeBridgeClient(baseUrl);
  }, [chainId]);
};
