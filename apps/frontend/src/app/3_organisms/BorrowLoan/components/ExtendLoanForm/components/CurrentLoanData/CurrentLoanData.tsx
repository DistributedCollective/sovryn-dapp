import React, { FC, ReactNode, useMemo } from 'react';

import { t } from 'i18next';

import { SupportedTokens } from '@sovryn/contracts';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { CRatioIndicator } from '../../../../../../2_molecules/LOCStatus/components/CRatioIndicator/CRatioIndicator';
import {
  BITCOIN,
  BTC_RENDER_PRECISION,
  TOKEN_RENDER_PRECISION,
} from '../../../../../../../constants/currencies';
import { translations } from '../../../../../../../locales/i18n';

type CurrentLoanDataProps = {
  debt: number;
  debtToken: SupportedTokens;
  collateral: number;
  collateralToken: SupportedTokens;
  collateralRatio: number;
  className?: string;
};

const pageTranslations = translations.fixedInterestPage.adjustLoanDialog;

export const CurrentLoanData: FC<CurrentLoanDataProps> = ({
  debt,
  debtToken,
  collateral,
  collateralToken,
  collateralRatio,
  className,
}) => {
  const isTokenRbtc = useMemo(
    () => debtToken === SupportedTokens.rbtc,
    [debtToken],
  );

  return (
    <div className={className}>
      <div className="w-full flex flex-row justify-between items-center mb-6 gap-4">
        <Column
          label={t(pageTranslations.currentDebt)}
          value={
            <AmountRenderer
              value={debt}
              suffix={isTokenRbtc ? BITCOIN : debtToken}
              precision={
                isTokenRbtc ? BTC_RENDER_PRECISION : TOKEN_RENDER_PRECISION
              }
            />
          }
        />
        <Column
          label={t(pageTranslations.currentCollateral)}
          value={
            <AmountRenderer
              value={collateral}
              suffix={collateralToken}
              precision={
                isTokenRbtc ? BTC_RENDER_PRECISION : TOKEN_RENDER_PRECISION
              }
            />
          }
        />
        <Column
          label={t(pageTranslations.collateralRatio)}
          value={
            <div className="flex flex-row justify-start items-center">
              <CRatioIndicator className="mr-2" value={collateralRatio} />
              <AmountRenderer value={collateralRatio} suffix="%" />
            </div>
          }
        />
      </div>
    </div>
  );
};

type ColumnProps = {
  label: ReactNode;
  value: ReactNode;
};
const Column: FC<ColumnProps> = ({ label, value }) => (
  <div>
    <div className="text-gray-30 text-xs">{label}</div>
    <div className="text-gray-10 font-medium text-sm">{value}</div>
  </div>
);
