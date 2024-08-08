import React, { FC } from 'react';

import { t } from 'i18next';

import { HelperButton, Icon, IconNames } from '@sovryn/ui';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { translations } from '../../../../../../../locales/i18n';
import { LendPoolDetails } from '../../LendAssetsList.types';
import { LendAssetAction } from '../LendAssetAction/LendAssetAction';

type LendAssetDetailsProps = {
  pool: LendPoolDetails;
};

export const LendAssetDetails: FC<LendAssetDetailsProps> = ({ pool }) => {
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {/* Available */}
        <div className="grid grid-cols-2">
          <div className="flex items-center gap-1">
            <span className="text-xs font-medium text-gray-30">
              {t(translations.aavePage.lendAssetsList.walletBalance)}
            </span>
          </div>

          <div className="text-right text-xs text-gray-30 font-medium">
            <AmountRenderer value={pool.walletBalance} suffix={pool.asset} />
          </div>
        </div>

        {/* APY */}
        <div className="grid grid-cols-2">
          <div className="flex items-center gap-1">
            <span className="text-xs font-medium text-gray-30">
              {t(translations.aavePage.common.apy)}
            </span>
            <HelperButton
              content={t(translations.aavePage.common.apyInfo)}
              className="text-gray-30"
            />
          </div>

          <div className="text-right text-xs text-gray-30 font-medium">
            <AmountRenderer value={pool.apy} suffix="%" />
          </div>
        </div>

        {/* Can be collateral */}
        <div className="grid grid-cols-2">
          <div className="flex items-center gap-1">
            <span className="text-xs font-medium text-gray-30">
              {t(translations.aavePage.lendAssetsList.canBeCollateral)}
            </span>
          </div>

          <div className="flex justify-end text-xs  font-medium">
            {pool.canBeCollateral ? (
              <Icon icon={IconNames.CHECK} className="w-[10px] text-positive" />
            ) : (
              <Icon
                icon={IconNames.X_MARK}
                className="w-[10px] text-negative"
              />
            )}
          </div>
        </div>
      </div>

      <LendAssetAction pool={pool} />
    </div>
  );
};
