import React, { FC } from 'react';

import { t } from 'i18next';

import { ChainId } from '@sovryn/ethers-provider';

import { useRequiredChain } from './hooks/useRequiredChain';

type NetworkBannerProps = {
  requiredChainId: ChainId;
};

export const NetworkBanner: FC<NetworkBannerProps> = ({ requiredChainId }) => {
  const { requiredChain, invalidChain, updateChain } =
    useRequiredChain(requiredChainId);

  if (!invalidChain) {
    return null;
  }

  return (
    <div
      onClick={updateChain}
      className="container mt-2 mb-8 text-center p-2 cursor-pointer rounded-lg"
    >
      <div className="bg-warning p-4">
        {t('networkBanner.content', { network: requiredChain?.label })}
      </div>
    </div>
  );
};
