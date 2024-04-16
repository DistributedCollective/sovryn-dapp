import React, { FC, useCallback } from 'react';

import { t } from 'i18next';

import { RSK_CHAIN_ID } from '../../../../../../../config/chains';

import { useChainStore } from '../../../../../../../hooks/useChainStore';
import { translations } from '../../../../../../../locales/i18n';

export const RSKBanner: FC = () => {
  const { setCurrentChainId } = useChainStore();
  const updateChain = useCallback(
    () => setCurrentChainId(RSK_CHAIN_ID),
    [setCurrentChainId],
  );

  return (
    <div
      onClick={updateChain}
      className="container mb-2 text-center p-2 cursor-pointer rounded-lg"
    >
      <div className="bg-warning p-4">
        {t(translations.ambientMarketMaking.banner)}
      </div>
    </div>
  );
};
