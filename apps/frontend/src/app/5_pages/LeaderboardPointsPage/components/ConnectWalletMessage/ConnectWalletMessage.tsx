import React from 'react';

import { t } from 'i18next';

import { Button } from '@sovryn/ui';

import { useWalletConnect } from '../../../../../hooks';
import { translations } from '../../../../../locales/i18n';

export const ConnectWalletMessage = () => {
  const { connectWallet } = useWalletConnect();

  return (
    <div className="flex items-center justify-center bg-gray-70 lg:bg-gray-90 px-2.5 py-3 lg:p-0 rounded">
      <div className="text-xs font-medium italic mr-4">
        {t(translations.leaderboardPointsPage.connectWalletText)}
      </div>
      <Button
        text={t(translations.leaderboardPointsPage.connectWalletCta)}
        onClick={connectWallet}
        className="text-sm font-medium"
      />
    </div>
  );
};
