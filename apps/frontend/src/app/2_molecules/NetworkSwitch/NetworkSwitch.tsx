import React, { FC, ReactElement, useMemo } from 'react';

import { ChainId } from '@sovryn/ethers-provider';

import { useChainStore } from '../../../hooks/useChainStore';
import { NetworkBanner } from '../NetworkBanner/NetworkBanner';

type NetworkSwitchProps = {
  components: { [chain in ChainId]?: ReactElement };
};

export const NetworkSwitch: FC<NetworkSwitchProps> = ({ components }) => {
  const { currentChainId } = useChainStore();

  const componentToRender = React.useMemo(() => {
    return (
      components[currentChainId] || (
        <NetworkBanner requiredChainId={Object.keys(components)[0]} />
      )
    );
  }, [currentChainId, components]);

  return componentToRender;
};
