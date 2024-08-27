import React, { FC } from 'react';

import classNames from 'classnames';
import { t } from 'i18next';

import { HelperButton, Icon, IconNames, SimpleTableRow } from '@sovryn/ui';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { AssetAmountPriceRenderer } from '../../../../../../2_molecules/AssetAmountPriceRenderer/AssetAmountPriceRenderer';
import { translations } from '../../../../../../../locales/i18n';
import { LendPoolDetails } from '../../LendAssetsList.types';
import { LendAssetAction } from '../LendAssetAction/LendAssetAction';

type LendAssetDetailsProps = {
  pool: LendPoolDetails;
};

export const LendAssetDetails: FC<LendAssetDetailsProps> = ({ pool }) => (
  <div className="space-y-3">
    <div>
      <SimpleTableRow
        label={t(translations.aavePage.lendAssetsList.walletBalance)}
        value={
          <AssetAmountPriceRenderer
            value={pool.walletBalance}
            asset={pool.asset}
          />
        }
      />

      <SimpleTableRow
        label={
          <span className="text-xs font-medium text-gray-30 flex gap-1 items-center">
            {t(translations.aavePage.common.apy)}
            <HelperButton content={t(translations.aavePage.common.apyInfo)} />
          </span>
        }
        value={<AmountRenderer value={pool.apy} suffix="%" />}
      />

      <SimpleTableRow
        label={t(translations.aavePage.lendAssetsList.canBeCollateral)}
        valueClassName="flex justify-end"
        value={
          <Icon
            icon={pool.canBeCollateral ? IconNames.CHECK : IconNames.X_MARK}
            className={classNames(
              'w-[10px]',
              pool.canBeCollateral ? 'text-positive' : 'text-negative',
            )}
          />
        }
      />
    </div>

    <LendAssetAction pool={pool} />
  </div>
);
