import React, { FC } from 'react';

import { t } from 'i18next';

import { HelperButton, Icon } from '@sovryn/ui';

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

          {/* TODO: review amount renderer component */}
          <div className="text-right text-xs text-gray-30 font-medium">
            {pool.walletBalance} {pool.asset}
          </div>
        </div>

        {/* APR */}
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

          {/* TODO: review amount renderer component */}
          <div className="text-right text-xs text-gray-30 font-medium">
            {pool.apy}
          </div>
        </div>

        {/* Can be collateral */}
        <div className="grid grid-cols-2">
          <div className="flex items-center gap-1">
            <span className="text-xs font-medium text-gray-30">
              {t(translations.aavePage.lendAssetsList.canBeCollateral)}
            </span>
          </div>

          <div className="flex justify-end text-xs text-positive font-medium">
            {pool.canBeCollateral ? (
              <Icon icon="check" className="w-[10px]" />
            ) : null}
          </div>
        </div>
      </div>

      <LendAssetAction pool={pool} />
    </div>
  );
};
