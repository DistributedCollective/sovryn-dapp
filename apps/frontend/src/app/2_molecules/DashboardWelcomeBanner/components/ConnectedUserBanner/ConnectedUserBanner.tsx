import React, { FC, useCallback, useMemo, useState } from 'react';

import { t } from 'i18next';

import { SupportedTokens } from '@sovryn/contracts';
import { Button } from '@sovryn/ui';

import { FastBtcDialog } from '../../../../3_organisms/FastBtcDialog/FastBtcDialog';
import { useAssetBalance } from '../../../../../hooks/useAssetBalance';
import { translations } from '../../../../../locales/i18n';

export type ConnectedUserBannerProps = {
  openLOC: () => void;
};

export const ConnectedUserBanner: FC<ConnectedUserBannerProps> = ({
  openLOC,
}) => {
  const { value, loading } = useAssetBalance(SupportedTokens.rbtc);
  const [isFastBtcDialogOpen, setIsFastBtcDialogOpen] = useState(false);

  const openFastBtcDialog = useCallback(() => setIsFastBtcDialogOpen(true), []);
  const closeFastBtcDialog = useCallback(
    () => setIsFastBtcDialogOpen(false),
    [],
  );

  const hasRbtcBalance = useMemo(() => Number(value) !== 0, [value]);

  const onClickHandler = useMemo(
    () => (hasRbtcBalance ? openLOC : openFastBtcDialog),
    [hasRbtcBalance, openLOC, openFastBtcDialog],
  );

  const dataAttribute = useMemo(
    () => (hasRbtcBalance ? 'zero-loc-open' : 'zero-fund'),
    [hasRbtcBalance],
  );

  const buttonText = useMemo(
    () =>
      hasRbtcBalance
        ? t(translations.dashboardWelcomeBanner.OpenCredit)
        : t(translations.dashboardWelcomeBanner.fundWallet),
    [hasRbtcBalance],
  );

  if (loading) {
    return <div className="mb-9 h-8" />;
  }

  return (
    <div className="flex justify-end mb-9">
      <Button
        className="flex-1 md:flex-initial"
        onClick={onClickHandler}
        text={buttonText}
        dataAttribute={dataAttribute}
      />
      <FastBtcDialog
        isOpen={isFastBtcDialogOpen}
        onClose={closeFastBtcDialog}
        shouldHideSend
      />
    </div>
  );
};
