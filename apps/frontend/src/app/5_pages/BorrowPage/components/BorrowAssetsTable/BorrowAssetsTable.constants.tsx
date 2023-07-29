import React from 'react';

import { t } from 'i18next';

import { AssetRenderer } from '../../../../2_molecules/AssetRenderer/AssetRenderer';
import { translations } from '../../../../../locales/i18n';
import { LendingPool } from '../../../../../utils/LendingPool';
import { AcceptedCollateral } from './components/AcceptedCollateral/AcceptedCollateral';
import { NewLoanButton } from './components/NewLoanButton/NewLoanButton';

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
    cellRenderer: (pool: LendingPool) => <div>2%</div>,
  },
  {
    id: 'availableSupply',
    title: t(translation.availableSupply),
    cellRenderer: (pool: LendingPool) => <div>100</div>,
  },
  {
    id: 'acceptedCollateral',
    title: t(translation.acceptedCollateral),
    cellRenderer: (pool: LendingPool) => <AcceptedCollateral pool={pool} />,
  },
  {
    id: 'minCollateralRatio',
    title: t(translation.minCollateralRatio),
    cellRenderer: (pool: LendingPool) => <div>110%</div>,
  },
  {
    id: '',
    title: '',
    cellRenderer: () => <NewLoanButton />,
  },
];
