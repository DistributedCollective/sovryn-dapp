import React from 'react';

import { t } from 'i18next';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { translations } from '../../../../../locales/i18n';
import { dateFormat } from '../../../../../utils/helpers';
import { normalizeSuffix, getAmountPrecision } from './OpenLoans.utils';
import { LoanItem } from './OpenLoansTable.types';
import { AdjustLoanButton } from './components/AdjustLoanButton/AdjustLoanButton';
import { ExtendLoanButton } from './components/ExtendLoanButton/ExtendLoanButton';

const translation = translations.fixedInterestPage.openLoansTable.columns;

export const COLUMNS_CONFIG = [
  {
    id: 'debt',
    title: t(translation.debt),
    cellRenderer: (item: LoanItem) => (
      <AmountRenderer
        value={item.debt}
        suffix={normalizeSuffix(item.debtAsset)}
        precision={getAmountPrecision(item.debtAsset)}
      />
    ),
  },
  {
    id: 'collateral',
    title: t(translation.collateral),
    cellRenderer: (item: LoanItem) => (
      <AmountRenderer
        value={item.collateral}
        suffix={normalizeSuffix(item.collateralAsset)}
        precision={getAmountPrecision(item.collateralAsset)}
      />
    ),
  },
  {
    id: 'collateralRatio',
    title: t(translation.collateralRatio),
    cellRenderer: (item: LoanItem) => (
      <AmountRenderer value={item.collateralRatio} suffix="%" />
    ),
  },
  {
    id: 'liquidationPrice',
    title: t(translation.liquidationPrice),
    cellRenderer: (item: LoanItem) => (
      <>
        <AmountRenderer
          value={item.liquidationPrice}
          suffix={normalizeSuffix(item.collateralAsset)}
          precision={getAmountPrecision(item.collateralAsset)}
        />
      </>
    ),
  },
  {
    id: 'apr',
    title: t(translation.apr),
    cellRenderer: (item: LoanItem) => (
      <AmountRenderer value={item.apr} suffix="%" />
    ),
  },
  {
    id: 'rolloverDate',
    title: t(translation.rolloverDate),
    cellRenderer: (item: LoanItem) => <>{dateFormat(item.rolloverDate)}</>,
  },
  {
    id: '',
    title: '',
    cellRenderer: (item: LoanItem) => (
      <div className="flex gap-4 justify-end">
        <AdjustLoanButton loan={item} />
        <ExtendLoanButton loan={item} />
      </div>
    ),
  },
];
