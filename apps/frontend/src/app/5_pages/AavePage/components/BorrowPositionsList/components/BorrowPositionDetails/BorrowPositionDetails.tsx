import React, { FC } from 'react';

import { t } from 'i18next';

import { HelperButton, SimpleTableRow } from '@sovryn/ui';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { AssetAmountPriceRenderer } from '../../../../../../2_molecules/AssetAmountPriceRenderer/AssetAmountPriceRenderer';
import { translations } from '../../../../../../../locales/i18n';
import { BorrowPosition } from '../../BorrowPositionsList.types';
import { BorrowPositionAction } from '../BorrowPositionAction/BorrowPositionAction';

type BorrowPositionDetailsProps = {
  position: BorrowPosition;
};

export const BorrowPositionDetails: FC<BorrowPositionDetailsProps> = ({
  position,
}) => (
  <div className="space-y-3">
    <div>
      <SimpleTableRow
        label={t(translations.aavePage.common.balance)}
        value={
          <AssetAmountPriceRenderer
            value={position.balance}
            asset={position.asset}
          />
        }
      />

      <SimpleTableRow
        label={
          <span className="text-xs font-medium text-gray-30 flex items-center gap-1">
            {t(translations.aavePage.common.apr)}
            <HelperButton content={t(translations.aavePage.common.aprInfo)} />
          </span>
        }
        value={<AmountRenderer value={position.apr} suffix="%" />}
      />

      <SimpleTableRow
        label={t(translations.aavePage.common.apyType)}
        value={t(translations.aavePage.common[position.apyType])}
      />
    </div>

    <BorrowPositionAction position={position} />
  </div>
);
