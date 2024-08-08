import React, { FC } from 'react';

import { t } from 'i18next';

import { NextBorrowInterestRate } from '../../5_pages/BorrowPage/components/BorrowAssetsTable/components/NextBorrowInterestRate/NextBorrowInterestRate';
import { NextSupplyInterestRate } from '../../5_pages/LendPage/components/NextSupplyInterestRate/NextSupplyInterestRate';
import { translations } from '../../../locales/i18n';
import { AssetRenderer } from '../AssetRenderer/AssetRenderer';

type AavePoolRowTitleProps = {
  asset: string;
  isBorrow?: boolean;
};

export const AavePoolRowTitle: FC<AavePoolRowTitleProps> = ({
  asset,
  isBorrow = false,
}) => (
  <div className="flex justify-between items-center w-full pr-3">
    <AssetRenderer
      dataAttribute={`${isBorrow ? 'borrow-table' : 'lend-frame'}-asset`}
      showAssetLogo
      asset={asset}
      className="mr-1"
    />
    <div className="pl-1 flex items-center">
      {isBorrow ? (
        <NextBorrowInterestRate asset={asset} />
      ) : (
        <NextSupplyInterestRate asset={asset} />
      )}
      <span className="text-gray-30 ml-1 font-medium">
        {isBorrow
          ? t(translations.fixedInterestPage.borrowAssetsTable.borrowAprMobile)
          : t(translations.lendPage.table.lendAprMobile)}
      </span>
    </div>
  </div>
);
