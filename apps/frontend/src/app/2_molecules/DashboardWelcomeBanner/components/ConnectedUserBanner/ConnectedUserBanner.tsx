import React, { FC, useMemo } from 'react';

import { t } from 'i18next';

import { SupportedTokens } from '@sovryn/contracts';
import { Button } from '@sovryn/ui';

import { useAssetBalance } from '../../../../../hooks/useAssetBalance';
import { translations } from '../../../../../locales/i18n';
import { sharedState } from '../../../../../store/rxjs/shared-state';

export type ConnectedUserBannerProps = {
  openLOC: () => void;
};

export const ConnectedUserBanner: FC<ConnectedUserBannerProps> = ({
  openLOC,
}) => {
  const { value, loading } = useAssetBalance(SupportedTokens.rbtc);

  const hasRbtcBalance = useMemo(() => Number(value) !== 0, [value]);

  const onClickHandler = useMemo(
    () =>
      hasRbtcBalance
        ? openLOC
        : () => sharedState.actions.openFastBtcDialog(true),
    [hasRbtcBalance, openLOC],
  );

  const dataAttribute = useMemo(
    () => (hasRbtcBalance ? 'zero-loc-open' : 'zero-fund'),
    [hasRbtcBalance],
  );

  const buttonText = useMemo(
    () =>
      hasRbtcBalance
        ? t(translations.zeroPage.dashboardWelcomeBanner.OpenCredit)
        : t(translations.zeroPage.dashboardWelcomeBanner.fundWallet),
    [hasRbtcBalance],
  );

  if (loading) {
    return <div className="mb-9 h-8" />;
  }

  return (
    <div className="flex justify-center md:justify-end mb-9">
      <Button
        className="flex-1 md:flex-initial max-w-[20.5rem] md:max-w-none "
        onClick={onClickHandler}
        text={buttonText}
        dataAttribute={dataAttribute}
      />
    </div>
  );
};
