import React, { FC } from 'react';

import { t } from 'i18next';

import { HelperButton, SimpleTableRow } from '@sovryn/ui';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { AssetAmountPriceRenderer } from '../../../../../../2_molecules/AssetAmountPriceRenderer/AssetAmountPriceRenderer';
import { translations } from '../../../../../../../locales/i18n';
import { BorrowPoolDetails } from '../../BorrowAssetsList.types';
import { BorrowAssetAction } from '../BorrowAssetAction/BorrowAssetAction';

const pageTranslations = translations.aavePage;

type BorrowAssetDetailsProps = {
  pool: BorrowPoolDetails;
};

export const BorrowAssetDetails: FC<BorrowAssetDetailsProps> = ({ pool }) => {
  return (
    <div className="space-y-3">
      <div>
        {/* APR */}
        <SimpleTableRow
          label={
            <span className="text-xs font-medium text-gray-30 items-center flex gap-1">
              {t(pageTranslations.common.apr)}{' '}
              <HelperButton content={t(pageTranslations.common.aprInfo)} />
            </span>
          }
          value={<AmountRenderer value={pool.apr} suffix={'%'} />}
        />

        {/* Available */}
        <SimpleTableRow
          label={t(pageTranslations.borrowAssetsList.available)}
          value={
            <AssetAmountPriceRenderer
              value={pool.available}
              asset={pool.asset}
            />
          }
        />
      </div>

      <BorrowAssetAction pool={pool} />
    </div>
  );
};
