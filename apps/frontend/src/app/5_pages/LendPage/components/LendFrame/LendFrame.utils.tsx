import React from 'react';

import { t } from 'i18next';

import { AssetRenderer } from '../../../../2_molecules/AssetRenderer/AssetRenderer';
import { translations } from '../../../../../locales/i18n';
import { LendingPool } from '../../utils/LendingPool';
import { NextSupplyInterestRate } from '../NextSupplyInterestRate/NextSupplyInterestRate';

export const generateRowTitle = (pool: LendingPool) => (
  <div className="flex justify-between items-center w-full">
    <AssetRenderer
      dataAttribute="lend-frame-asset"
      showAssetLogo
      asset={pool.getAsset()}
      className="mr-1"
    />
    <div className="pl-1 flex items-center">
      <NextSupplyInterestRate asset={pool.getAsset()} />
      <span className="text-gray-30 ml-1 font-medium">
        {t(translations.lendPage.table.lendApyMobile)}
      </span>
    </div>
  </div>
);
