import React, { FC, useMemo } from 'react';

import { t } from 'i18next';

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
  const { balance, loading } = useAssetBalance(SupportedTokens.rbtc);

  const hasRbtcBalance = useMemo(() => Number(balance) !== 0, [balance]);

  if (!hasRbtcBalance) {
    return null;
  }

  if (loading) {
    return <div className="mb-9 h-8" />;
  }

  return (
    <div className="flex justify-center md:justify-end mb-9">
      <Button
        className="flex-1 md:flex-initial max-w-[20.5rem] md:max-w-none "
        onClick={openLOC}
        text={t(translations.zeroPage.dashboardWelcomeBanner.OpenCredit)}
        dataAttribute="zero-loc-open"
      />
    </div>
  );
};
