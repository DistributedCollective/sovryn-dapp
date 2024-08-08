import React, { FC } from 'react';

import { t } from 'i18next';

import { HelperButton } from '@sovryn/ui';

import { translations } from '../../../../../../../locales/i18n';
import { LendPosition } from '../../LendPositionsList.types';
import { LendPositionAction } from '../LendPositionAction/LendPositionAction';
import { ToggleCollateralAction } from '../ToggleCollateralAction/ToggleCollateralAction';

type LendPositionDetailsProps = {
  position: LendPosition;
};

export const LendPositionDetails: FC<LendPositionDetailsProps> = ({
  position,
}) => {
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {/* Available */}
        <div className="grid grid-cols-2">
          <div className="flex items-center gap-1">
            <span className="text-xs font-medium text-gray-30">
              {t(translations.aavePage.common.balance)}
            </span>
          </div>

          {/* TODO: review amount renderer component */}
          <div className="text-right text-xs text-gray-30 font-medium">
            {position.balance} {position.asset}
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
          <div className="text-right text-xs text-gray-30 font-medium">
            {position.apy}
          </div>
        </div>

        {/* Can be collateral */}
        <div className="grid grid-cols-2">
          <div className="flex items-center gap-1">
            <span className="text-xs font-medium text-gray-30">
              {t(translations.aavePage.lendAssetsList.canBeCollateral)}
            </span>
          </div>

          <div className="flex justify-end">
            <ToggleCollateralAction position={position} />
          </div>
        </div>
      </div>

      <LendPositionAction position={position} />
    </div>
  );
};
