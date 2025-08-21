import React, { FC, useMemo } from 'react';

import classNames from 'classnames';
import { t } from 'i18next';

import { Button } from '@sovryn/ui';

import { useAssetBalance } from '../../../../../hooks/useAssetBalance';
import { translations } from '../../../../../locales/i18n';
import { COMMON_SYMBOLS } from '../../../../../utils/asset';

export type OpenLocButtonProps = {
  openLOC: () => void;
  className?: string;
};

export const OpenLocButton: FC<OpenLocButtonProps> = ({
  openLOC,
  className,
}) => {
  const { balance, loading } = useAssetBalance(COMMON_SYMBOLS.BTC);

  const hasRbtcBalance = useMemo(() => Number(balance) !== 0, [balance]);

  if (!hasRbtcBalance) {
    return null;
  }

  if (loading) {
    return <div className="mb-9 h-8" />;
  }

  return (
    <div
      className={classNames(
        'flex justify-center md:justify-end mb-9',
        className,
      )}
    >
      <Button
        className="flex-1 md:flex-initial max-w-[20.5rem] md:max-w-none "
        onClick={openLOC}
        text={t(translations.zeroPage.dashboardWelcomeBanner.OpenCredit)}
        dataAttribute="zero-loc-open"
      />
    </div>
  );
};
