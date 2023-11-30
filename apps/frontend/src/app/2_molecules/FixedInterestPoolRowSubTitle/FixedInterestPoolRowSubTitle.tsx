import React, { FC, useMemo } from 'react';

import { t } from 'i18next';

import { HelperButton } from '@sovryn/ui';

import { LendFrameBalance } from '../../5_pages/LendPage/components/LendFrame/components/LendFrameBalance/LendFrameBalance';
import { useGetAssetBalanceOf } from '../../5_pages/LendPage/components/LendFrame/components/LendFrameBalance/hooks/useGetAssetBalanceOf';
import { LendFrameInterestEarned } from '../../5_pages/LendPage/components/LendFrame/components/LendFrameInterestEarned/LendFrameInterestEarned';
import { NextSupplyInterestRate } from '../../5_pages/LendPage/components/NextSupplyInterestRate/NextSupplyInterestRate';
import { useAccount } from '../../../hooks/useAccount';
import { translations } from '../../../locales/i18n';
import { LendingPool } from '../../../utils/LendingPool';

type FixedInterestPoolRowSubTitleProps = {
  pool: LendingPool;
};

export const FixedInterestPoolRowSubTitle: FC<
  FixedInterestPoolRowSubTitleProps
> = ({ pool }) => {
  const asset = useMemo(() => pool.getAsset(), [pool]);
  const { account } = useAccount();
  const { assetBalance } = useGetAssetBalanceOf(asset);

  if (!account || Number(assetBalance) === 0) {
    return null;
  }

  return (
    <div className="text-gray-30 text-xs font-medium bg-gray-70 rounded-b rounded-t-none px-4 pb-2 -mt-2">
      <div className="flex justify-between items-center w-full mb-2">
        <span className="flex items-center gap-1">
          {t(translations.lendPage.table.lendApr)}{' '}
          <HelperButton content={t(translations.lendPage.table.lendAprInfo)} />
        </span>
        <NextSupplyInterestRate
          asset={pool.getAsset()}
          className="text-xs pr-0"
        />
      </div>

      <div className="flex justify-between items-center w-full mb-2">
        <span>{t(translations.lendPage.table.balance)}</span>
        <LendFrameBalance pool={pool} />
      </div>

      <div className="flex justify-between items-center w-full">
        <span className="flex items-center gap-1">
          {t(translations.lendPage.table.interestEarned)}{' '}
          <HelperButton
            content={t(translations.lendPage.table.interestEarnedInfo)}
          />
        </span>
        <LendFrameInterestEarned pool={pool} />
      </div>
    </div>
  );
};
