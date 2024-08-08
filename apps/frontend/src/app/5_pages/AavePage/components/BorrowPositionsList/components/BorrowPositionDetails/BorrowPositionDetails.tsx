import React, { FC } from 'react';

import { t } from 'i18next';

import { HelperButton } from '@sovryn/ui';

import { translations } from '../../../../../../../locales/i18n';
import { BorrowPosition } from '../../BorrowPositionsList.types';
import { BorrowPositionAction } from '../BorrowPositionAction/BorrowPositionAction';

type BorrowPositionDetailsProps = {
  pool: BorrowPosition;
};

export const BorrowPositionDetails: FC<BorrowPositionDetailsProps> = ({
  pool,
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
            {pool.balance} {pool.asset}
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
            {pool.apr}
          </div>
        </div>

        {/* Apy type */}
        <div className="grid grid-cols-2">
          <div className="flex items-center gap-1">
            <span className="text-xs font-medium text-gray-30">
              {t(translations.aavePage.common.apyType)}
            </span>
          </div>
          <div className="flex justify-end text-xs text-positive font-medium">
            {pool.apyType}
          </div>
        </div>
      </div>

      <BorrowPositionAction pool={pool} />
    </div>
  );
};
