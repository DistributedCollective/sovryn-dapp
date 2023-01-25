import React, { FC } from 'react';

import { useTranslation } from 'react-i18next';

import { SupportedTokens } from '@sovryn/contracts';
import { Button } from '@sovryn/ui';

import { useAssetBalance } from '../../../../../hooks/useAssetBalance';
import { translations } from '../../../../../locales/i18n';

export type ConnectedUserBannerProps = {
  openLOC: () => void;
};

export const ConnectedUserBanner: FC<ConnectedUserBannerProps> = ({
  openLOC,
}) => {
  const { t } = useTranslation();
  const { value, loading } = useAssetBalance(SupportedTokens.rbtc);

  if (loading) {
    return <div className="mb-9 h-8" />;
  }

  if (Number(value) === 0) {
    return (
      <div className="flex justify-end mb-9">
        <Button
          className="flex-1 md:flex-initial"
          text={t(translations.dashboardWelcomeBanner.fundWallet)}
        />
      </div>
    );
  }

  return (
    <div className="flex justify-end mb-9">
      <Button
        className="flex-1 md:flex-initial"
        onClick={openLOC}
        text={t(translations.dashboardWelcomeBanner.OpenCredit)}
      />
    </div>
  );
};
