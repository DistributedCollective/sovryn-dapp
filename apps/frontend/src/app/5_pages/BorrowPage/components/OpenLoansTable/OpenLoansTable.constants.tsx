import React from 'react';

import { t } from 'i18next';

import { translations } from '../../../../../locales/i18n';
import { LoanItem } from './OpenLoansTable.types';
import { AdjustLoanButton } from './components/AdjustLoanButton/AdjustLoanButton';
import { ExtendLoanButton } from './components/ExtendLoanButton/ExtendLoanButton';

const translation = translations.fixedInterestPage.openLoansTable.columns;

export const COLUMNS_CONFIG = [
  {
    id: 'debt',
    title: t(translation.debt),
    cellRenderer: (item: LoanItem) => <>{`${item.debt} ${item.debtAsset}`}</>,
  },
  {
    id: 'collateral',
    title: t(translation.collateral),
    cellRenderer: (item: LoanItem) => (
      <>{`${item.collateral} ${item.collateralAsset}`}</>
    ),
  },
  {
    id: 'collateralRatio',
    title: t(translation.collateralRatio),
    cellRenderer: (item: LoanItem) => <div>{item.collateralRatio}%</div>,
  },
  {
    id: 'liquidationPrice',
    title: t(translation.liquidationPrice),
    cellRenderer: (item: LoanItem) => (
      <>{`${item.liquidationPrice} ${item.collateralAsset}`}</>
    ),
  },
  {
    id: 'apr',
    title: t(translation.apr),
    cellRenderer: (item: LoanItem) => <div>{item.apr}%</div>,
  },
  {
    id: 'rolloverDate',
    title: t(translation.rolloverDate),
    cellRenderer: (item: LoanItem) => <div>{item.rolloverDate}</div>,
  },
  {
    id: '',
    title: '',
    cellRenderer: () => <AdjustLoanButton />,
  },
  {
    id: '',
    title: '',
    cellRenderer: () => <ExtendLoanButton />,
  },
];
