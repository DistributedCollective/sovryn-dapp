import React, { FC, ReactNode, useMemo } from 'react';

import { t } from 'i18next';

import { Decimal } from '@sovryn/utils';

import { AmountRenderer } from '../../2_molecules/AmountRenderer/AmountRenderer';
import { CRatioIndicator } from '../../2_molecules/LOCStatus/components/CRatioIndicator/CRatioIndicator';
import { BITCOIN } from '../../../constants/currencies';
import { formatValue } from '../../../utils/math';
import {
  TOKEN_RENDER_PRECISION,
  BTC_RENDER_PRECISION,
  DEBT_TOKEN,
} from './constants';

type CurrentTroveDataProps = {
  debt: Decimal;
  collateral: Decimal;
  rbtcPrice: Decimal;
  className?: string;
};

export const CurrentTroveData: FC<CurrentTroveDataProps> = ({
  className,
  debt,
  rbtcPrice,
  collateral,
}) => {
  const collateralRatio = useMemo(
    () => collateral.mul(rbtcPrice).div(debt).mul(100),
    [collateral, debt, rbtcPrice],
  );
  return (
    <div className={className}>
      <div className="w-full flex flex-row justify-between items-center mb-12 gap-4">
        <Column
          label={t('LOCStatus.currentDebt')}
          value={
            <AmountRenderer
              value={debt}
              suffix={DEBT_TOKEN}
              precision={TOKEN_RENDER_PRECISION}
            />
          }
        />
        <Column
          label={t('LOCStatus.currentCollateral')}
          value={
            <AmountRenderer
              value={collateral}
              suffix={BITCOIN}
              precision={BTC_RENDER_PRECISION}
            />
          }
        />
        <Column
          label={t('LOCStatus.collateralRatio')}
          value={
            <div className="flex flex-row justify-start items-center">
              <CRatioIndicator
                className="mr-2"
                value={collateralRatio.toNumber()}
              />
              {formatValue(collateralRatio)}%
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
    <div className="text-gray-10 font-medium text-base">{value}</div>
  </div>
);
