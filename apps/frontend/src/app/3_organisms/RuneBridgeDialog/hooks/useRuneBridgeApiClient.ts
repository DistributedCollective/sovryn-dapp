import React from 'react';

import { useCurrentChain } from '../../../../hooks/useChainStore';
import { currentNetwork } from '../../../../utils/helpers';
import { getBridgeName } from '../RuneBridgeDialog.utils';
import RuneBridgeClient from '../api/RuneBridgeClient';
import { endpoints } from '../config';

export const useRuneBridgeApiClient = () => {
  const chainId = useCurrentChain();
  return React.useMemo(() => {
    const suffix = getBridgeName(chainId);
    const baseUrl = `${endpoints[currentNetwork]}/api/v1/${suffix}`;
    return new RuneBridgeClient(baseUrl);
  }, [chainId]);
};
