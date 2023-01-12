import React, { FC, ReactNode, useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { HelperButton } from '@sovryn/ui';

import { CRatioIndicator } from '../../2_molecules/LOCStatus/components/CRatioIndicator/CRatioIndicator';
import { formatValue } from '../../../utils/math';

export type CurrentTroveDataProps = {
  creditValue: string;
  collateralValue: string;
  rbtcPrice: string;
  className?: string;
};

export const CurrentTroveData: FC<CurrentTroveDataProps> = ({
  className,
  creditValue,
  rbtcPrice,
  collateralValue,
}) => {
  const { t } = useTranslation();
  const collateralRatio = useMemo(
    () =>
      ((parseFloat(collateralValue) * parseFloat(rbtcPrice)) /
        parseFloat(creditValue)) *
      100,
    [collateralValue, creditValue, rbtcPrice],
  );

  return (
    <div className={className}>
      <div className="w-full flex flex-row justify-between items-center mb-12 gap-4">
        <Column
          label={t('LOCStatus.currentDebt')}
          value={`${formatValue(Number(creditValue), 2)} ZUSD`}
        />
        <Column
          label={t('LOCStatus.currentCollateral')}
          value={`${formatValue(Number(collateralValue), 4)} RBTC`}
        />
        <Column
          label={
            <div className="flex items-center">
              {t('LOCStatus.collateralRatio')}
              <HelperButton className="ml-1.5" content="Collateral Ratio" />
            </div>
          }
          value={
            <div className="flex flex-row justify-start items-center">
              <CRatioIndicator className="mr-2" value={collateralRatio} />
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
