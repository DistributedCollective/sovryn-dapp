import React, { FC } from 'react';

import { t } from 'i18next';

import { HelperButton } from '@sovryn/ui';

import { translations } from '../../../../../../../locales/i18n';
import { BorrowPoolAssetDetails } from '../../BorrowAssetsList.types';
import { BorrowAssetAction } from '../BorrowAssetAction/BorrowAssetAction';

const pageTranslations = translations.aavePage.borrowAssetsList;

type BorrowAssetDetailsProps = {
  pool: BorrowPoolAssetDetails;
};

export const BorrowAssetDetails: FC<BorrowAssetDetailsProps> = ({ pool }) => {
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {/* APR */}
        <div className="grid grid-cols-2">
          <div className="flex items-center gap-1">
            <span className="text-xs font-medium text-gray-30">
              {t(pageTranslations.apr)}
            </span>
            <HelperButton
              content={t(pageTranslations.aprInfo)}
              className="text-gray-30"
            />
          </div>
          <div className="text-right text-xs text-gray-30 font-medium">
            {pool.apr}
          </div>
        </div>

        {/* Available */}
        <div className="grid grid-cols-2">
          <div className="flex items-center gap-1">
            <span className="text-xs font-medium text-gray-30">
              {t(pageTranslations.available)}
            </span>
          </div>
          <div className="text-right text-xs text-gray-30 font-medium">
            {pool.available} {pool.asset}
          </div>
        </div>
      </div>

      <BorrowAssetAction pool={pool} />
    </div>
  );
};
