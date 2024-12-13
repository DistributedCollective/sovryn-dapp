import React, { FC } from 'react';

import { t } from 'i18next';

import { HelperButton, SimpleTableRow } from '@sovryn/ui';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { AssetAmountPriceRenderer } from '../../../../../../2_molecules/AssetAmountPriceRenderer/AssetAmountPriceRenderer';
import { translations } from '../../../../../../../locales/i18n';
import { LendPosition } from '../../LendPositionsList.types';
import { LendPositionAction } from '../LendPositionAction/LendPositionAction';
import { ToggleCollateralAction } from '../ToggleCollateralAction/ToggleCollateralAction';

type LendPositionDetailsProps = {
  position: LendPosition;
  onWithdrawClick: (asset: string) => void;
};

export const LendPositionDetails: FC<LendPositionDetailsProps> = ({
  position,
  onWithdrawClick,
}) => (
  <div className="space-y-3">
    <div>
      {/* Balance */}
      <SimpleTableRow
        label={t(translations.aavePage.common.balance)}
        value={
          <AssetAmountPriceRenderer
            value={position.supplied}
            valueUsd={position.suppliedUsd}
            asset={position.asset}
          />
        }
      />

      {/* APY */}
      <SimpleTableRow
        label={
          <span className="text-xs font-medium text-gray-30 flex gap-1 items-center">
            {t(translations.aavePage.common.apy)}
            <HelperButton
              content={t(translations.aavePage.common.apyInfo)}
              className="text-gray-30"
            />
          </span>
        }
        value={<AmountRenderer value={position.apy} suffix="%" />}
      />

      {/* Can be collateral */}
      <SimpleTableRow
        label={t(translations.aavePage.lendPositionsList.usedAsCollateral)}
        value={<ToggleCollateralAction position={position} />}
      />
    </div>

    <LendPositionAction
      onWithdrawClick={() => onWithdrawClick(position.asset)}
    />
  </div>
);
