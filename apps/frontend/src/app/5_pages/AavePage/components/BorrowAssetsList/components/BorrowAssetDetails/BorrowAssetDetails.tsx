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
  onBorrowClick: () => void;
};

export const BorrowAssetDetails: FC<BorrowAssetDetailsProps> = ({
  pool,
  onBorrowClick,
}) => (
  <div className="space-y-3">
    <div>
      {/* APY */}
      <SimpleTableRow
        label={
          <span className="text-xs font-medium text-gray-30 items-center flex gap-1">
            {t(pageTranslations.common.apy)}{' '}
            <HelperButton content={t(pageTranslations.common.apyInfo)} />
          </span>
        }
        value={<AmountRenderer value={pool.apy} suffix="%" />}
      />

      {/* Available */}
      <SimpleTableRow
        label={t(pageTranslations.borrowAssetsList.available)}
        value={
          pool.available && pool.availableUSD ? (
            <AssetAmountPriceRenderer
              value={pool.available}
              valueUSD={pool.availableUSD}
              asset={pool.asset}
            />
          ) : (
            <span>-</span>
          )
        }
      />
    </div>

    <BorrowAssetAction onBorrowClick={onBorrowClick} />
  </div>
);
