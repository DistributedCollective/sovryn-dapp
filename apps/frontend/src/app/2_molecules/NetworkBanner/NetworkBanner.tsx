import React, { FC, useMemo } from 'react';

import { t } from 'i18next';

import { ChainId } from '@sovryn/ethers-provider';

import { APP_CHAIN_LIST } from '../../../config/chains';

import { useCurrentChain } from '../../../hooks/useChainStore';

type NetworkBannerProps = {
  requiredChainId: ChainId;
};

export const NetworkBanner: FC<NetworkBannerProps> = ({ requiredChainId }) => {
  const currentChainId = useCurrentChain();
  const requiredChain = useMemo(
    () => APP_CHAIN_LIST.find(chain => chain.id === requiredChainId),
    [requiredChainId],
  );

  if (currentChainId === requiredChainId) {
    return null;
  }

  return (
    <div className="container mb-12 text-center p-2">
      <div className="bg-warning p-4">
        {t('networkBanner.content', { network: requiredChain?.label })}
      </div>
    </div>
  );
};
