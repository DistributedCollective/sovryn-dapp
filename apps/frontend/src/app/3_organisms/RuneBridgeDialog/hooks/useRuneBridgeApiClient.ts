import React from 'react';

import { useCurrentChain } from '../../../../hooks/useChainStore';
import { isBobChain } from '../../../../utils/chain';
import { currentNetwork } from '../../../../utils/helpers';
import RuneBridgeClient from '../api/RuneBridgeClient';
import { endpoints } from '../config';
import { runesBobBridgeName, runesRskBridgeName } from '../constants';

export const useRuneBridgeApiClient = () => {
  const chainId = useCurrentChain();
  return React.useMemo(() => {
    const suffix = isBobChain(chainId)
      ? runesBobBridgeName
      : runesRskBridgeName;
    const baseUrl = `${endpoints[currentNetwork]}/api/v1/${suffix}`;
    return new RuneBridgeClient(baseUrl);
  }, [chainId]);
};
