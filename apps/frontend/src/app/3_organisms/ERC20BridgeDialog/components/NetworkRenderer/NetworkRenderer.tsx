import React, { FC } from 'react';

import classNames from 'classnames';

import { ChainIds } from '@sovryn/ethers-provider';

import { useBridgeService } from '../../hooks/useBridgeService';
import { getNetworkIcon } from './NetworkRenderer.utils';

type NetworkRendererProps = {
  chainId?: ChainIds;
  className?: string;
};

export const NetworkRenderer: FC<NetworkRendererProps> = ({
  chainId,
  className,
}) => {
  const bridgeService = useBridgeService();

  if (!bridgeService || !chainId) {
    return null;
  }

  const networkConfig = bridgeService.getNetworkConfig(chainId);

  if (!networkConfig) {
    return null;
  }

  return (
    <div className={classNames('flex items-center gap-2', className)}>
      <img
        className="w-5 h-5 rounded-full"
        src={getNetworkIcon(chainId)}
        alt={networkConfig.name}
      />
      <span>{networkConfig.name}</span>
    </div>
  );
};
