import React, { FC, ReactElement } from 'react';

import { ChainId } from '@sovryn/ethers-provider';

import { useChainStore } from '../../../hooks/useChainStore';
import { NetworkBanner } from '../NetworkBanner/NetworkBanner';

type NetworkSwitchProps = {
  components: { [chain in ChainId]?: ReactElement };
};

export const NetworkSwitch: FC<NetworkSwitchProps> = ({ components }) => {
  const { currentChainId } = useChainStore();

  if (components[currentChainId] !== undefined) {
    return components[currentChainId] as ReactElement;
  } else {
    const requiredChainId = Object.keys(components)[0];
    return <NetworkBanner requiredChainId={requiredChainId} />;
  }
};
