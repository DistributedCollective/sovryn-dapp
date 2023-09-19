import React, { FC } from 'react';

import { t } from 'i18next';

import { AssetRenderer } from '../../2_molecules/AssetRenderer/AssetRenderer';
import { NextBorrowInterestRate } from '../../5_pages/BorrowPage/components/BorrowAssetsTable/components/NextBorrowInterestRate/NextBorrowInterestRate';
import { NextSupplyInterestRate } from '../../5_pages/LendPage/components/NextSupplyInterestRate/NextSupplyInterestRate';
import { translations } from '../../../locales/i18n';
import { LendingPool } from '../../../utils/LendingPool';

type FixedInterestPoolRowTitleProps = {
  pool: LendingPool;
  isBorrow?: boolean;
};

export const FixedInterestPoolRowTitle: FC<FixedInterestPoolRowTitleProps> = ({
  pool,
  isBorrow = false,
}) => (
  <div className="flex justify-between items-center w-full">
    <AssetRenderer
      dataAttribute={`${isBorrow ? 'borrow-table' : 'lend-frame'}-asset`}
      showAssetLogo
      asset={pool.getAsset()}
      className="mr-1"
    />
    <div className="pl-1 flex items-center">
      {isBorrow ? (
        <NextBorrowInterestRate asset={pool.getAsset()} />
      ) : (
        <NextSupplyInterestRate asset={pool.getAsset()} />
      )}
      <span className="text-gray-30 ml-1 font-medium">
        {isBorrow
          ? t(translations.fixedInterestPage.borrowAssetsTable.borrowAprMobile)
          : t(translations.lendPage.table.lendApyMobile)}
      </span>
    </div>
  </div>
);
