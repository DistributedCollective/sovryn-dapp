import React, { FC } from 'react';

import { t } from 'i18next';

import { HelperButton } from '@sovryn/ui';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
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
        {/* Balance */}
        <div className="grid grid-cols-2">
          <div className="flex items-center gap-1">
            <span className="text-xs font-medium text-gray-30">
              {t(translations.aavePage.common.balance)}
            </span>
          </div>

          <div className="text-right text-xs text-gray-30 font-medium">
            <AmountRenderer value={position.balance} suffix={position.asset} />
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
            <AmountRenderer value={position.apy} suffix={'%'} />
          </div>
        </div>

        {/* Can be collateral */}
        <div className="grid grid-cols-2">
          <div className="flex items-center gap-1">
            <span className="text-xs font-medium text-gray-30">
              {t(translations.aavePage.lendPositionsList.usedAsCollateral)}
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
