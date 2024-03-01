import React, { FC, useMemo } from 'react';

import { ChainId } from '@sovryn/ethers-provider';

import { chains } from '../../../config/chains';

import { useCurrentChain } from '../../../hooks/useChainStore';

type NetworkBannerProps = {
  requiredChainId: ChainId;
};

export const NetworkBanner: FC<NetworkBannerProps> = ({ requiredChainId }) => {
  const currentChainId = useCurrentChain();
  const requiredChain = useMemo(
    () => chains.find(chain => chain.id === requiredChainId),
    [requiredChainId],
  );

  if (currentChainId === requiredChainId) {
    return null;
  }

  return (
    <div className="container mb-12 text-center p-2">
      <div className="bg-warning p-4">
        This page is only available on {requiredChain?.label} network. Please
        switch your wallet to the correct network.
      </div>
    </div>
  );
};
