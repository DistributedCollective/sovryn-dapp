import React, { FC } from 'react';

import { t } from 'i18next';

import { HelperButton, SimpleTableRow } from '@sovryn/ui';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { AssetAmountPriceRenderer } from '../../../../../../2_molecules/AssetAmountPriceRenderer/AssetAmountPriceRenderer';
import { translations } from '../../../../../../../locales/i18n';
import { BorrowPosition } from '../../BorrowPositionsList.types';
import { BorrowPositionAction } from '../BorrowPositionAction/BorrowPositionAction';
import { BorrowRateModeSelect } from '../BorrowRateModeSelect/BorrowRateModeSelect';

type BorrowPositionDetailsProps = {
  position: BorrowPosition;
  onRepayClick: () => void;
};

export const BorrowPositionDetails: FC<BorrowPositionDetailsProps> = ({
  position,
  onRepayClick,
}) => (
  <div className="space-y-3">
    <div>
      {/* Balance */}
      <SimpleTableRow
        label={t(translations.aavePage.common.balance)}
        value={
          <AssetAmountPriceRenderer
            asset={position.asset}
            value={position.borrowed}
            valueUsd={position.borrowedUsd}
          />
        }
      />

      {/* APR */}
      <SimpleTableRow
        label={
          <span className="text-xs font-medium text-gray-30 flex items-center gap-1">
            {t(translations.aavePage.common.apr)}
            <HelperButton content={t(translations.aavePage.common.aprInfo)} />
          </span>
        }
        value={<AmountRenderer value={position.apy} suffix="%" precision={2} />}
      />

      {/* Apy type */}
      <SimpleTableRow
        label={t(translations.aavePage.common.apyType)}
        valueClassName="flex justify-end"
        value={<BorrowRateModeSelect position={position} />}
      />
    </div>

    <BorrowPositionAction onRepayClick={onRepayClick} />
  </div>
);
