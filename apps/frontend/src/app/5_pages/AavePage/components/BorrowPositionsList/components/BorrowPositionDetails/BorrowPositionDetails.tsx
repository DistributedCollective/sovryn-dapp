import React, { FC } from 'react';

import { t } from 'i18next';

import { HelperButton } from '@sovryn/ui';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { translations } from '../../../../../../../locales/i18n';
import { BorrowPosition } from '../../BorrowPositionsList.types';
import { BorrowPositionAction } from '../BorrowPositionAction/BorrowPositionAction';

type BorrowPositionDetailsProps = {
  position: BorrowPosition;
};

export const BorrowPositionDetails: FC<BorrowPositionDetailsProps> = ({
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

          <div className="text-right text-xs text-gray-30 font-medium">
            <AmountRenderer value={position.balance} suffix={position.asset} />
          </div>
        </div>

        {/* APR */}
        <div className="grid grid-cols-2">
          <div className="flex items-center gap-1">
            <span className="text-xs font-medium text-gray-30">
              {t(translations.aavePage.common.apr)}
            </span>
            <HelperButton
              content={t(translations.aavePage.common.aprInfo)}
              className="text-gray-30"
            />
          </div>

          <div className="text-right text-xs text-gray-30 font-medium">
            <AmountRenderer value={position.apr} suffix="%" />
          </div>
        </div>

        {/* Apy type */}
        <div className="grid grid-cols-2">
          <div className="flex items-center gap-1">
            <span className="text-xs font-medium text-gray-30">
              {t(translations.aavePage.common.apyType)}
            </span>
          </div>

          <div className="text-right text-xs text-gray-30 font-medium">
            {t(translations.aavePage.common[position.apyType])}
          </div>
        </div>
      </div>

      <BorrowPositionAction position={position} />
    </div>
  );
};
