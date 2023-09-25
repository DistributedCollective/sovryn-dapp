import React from 'react';

import { t } from 'i18next';

import { HelperButton } from '@sovryn/ui';

import { AssetRenderer } from '../../../../2_molecules/AssetRenderer/AssetRenderer';
import { MINIMUM_COLLATERAL_RATIO_BORROWING_MAINTENANCE } from '../../../../../constants/lending';
import { translations } from '../../../../../locales/i18n';
import { LendingPool } from '../../../../../utils/LendingPool';
import { AcceptedCollateral } from '../../../LendPage/components/AcceptedCollateral/AcceptedCollateral';
import { normalizeToken } from '../AdjustLoanForm/AdjustLoanForm.utils';
import { AvailableSupply } from './components/AvailableSupply/AvailableSupply';
import { NewLoanButton } from './components/NewLoanButton/NewLoanButton';
import { NextBorrowInterestRate } from './components/NextBorrowInterestRate/NextBorrowInterestRate';

const translation = translations.fixedInterestPage.borrowAssetsTable.columns;

export const COLUMNS_CONFIG = [
  {
    id: 'asset',
    title: t(translation.asset),
    cellRenderer: (pool: LendingPool) => (
      <AssetRenderer
        dataAttribute="borrow-asset"
        showAssetLogo
        asset={pool.getAsset()}
        className="lg:justify-start justify-end"
      />
    ),
  },
  {
    id: 'borrowApr',
    title: t(translation.borrowApr),
    cellRenderer: (pool: LendingPool) => (
      <NextBorrowInterestRate asset={normalizeToken(pool.getAsset())} />
    ),
  },
  {
    id: 'availableSupply',
    title: t(translation.availableSupply),
    cellRenderer: (pool: LendingPool) => <AvailableSupply pool={pool} />,
  },
  {
    id: 'acceptedCollateral',
    title: t(translation.acceptedCollateral),
    cellRenderer: (pool: LendingPool) => <AcceptedCollateral pool={pool} />,
  },
  {
    id: 'minCollateralRatio',
    title: (
      <span className="flex items-center gap-1">
        {t(
          translations.fixedInterestPage.borrowAssetsTable.columns
            .minCollateralRatio,
        )}
        <HelperButton
          content={t(
            translations.fixedInterestPage.borrowAssetsTable.columns
              .minCollateralRatioTooltip,
          )}
        />
      </span>
    ),
    cellRenderer: () => (
      <div>
        {MINIMUM_COLLATERAL_RATIO_BORROWING_MAINTENANCE.mul(100).toString()}%
      </div>
    ),
  },
  {
    id: '',
    title: '',
    cellRenderer: (pool: LendingPool) => <NewLoanButton pool={pool} />,
    labelClassName: 'hidden lg:table-cell',
    valueClassName: 'w-full lg:w-auto',
    className: 'flex',
  },
];
