import React, { FC } from 'react';

import classNames from 'classnames';
import CountUp from 'react-countup';
import { useTranslation } from 'react-i18next';

import { Button, ButtonSize, ButtonStyle, HelperButton } from '@sovryn/ui';

import { COLLATERAL_TOKEN } from '../../3_organisms/ZeroLocForm/constants';
import { formatValue } from '../../../utils/math';
import { CRatioIndicator } from './components/CRatioIndicator/CRatioIndicator';
import { LOCStat } from './components/LOCStat/LOCStat';

export type LOCStatusProps = {
  className?: string;
  withdrawalSurplus?: number;
  collateral?: number;
  debt?: number;
  debtSymbol?: string;
  cRatio?: number;
  onAdjust?: () => void;
  onClose?: () => void;
  onWithdraw?: () => void;
};

export const LOCStatus: FC<LOCStatusProps> = ({
  withdrawalSurplus = 0,
  collateral = 0,
  debt = 0,
  cRatio = 0,
  onAdjust,
  onClose,
  onWithdraw,
  className,
  debtSymbol = '',
}) => {
  const { t } = useTranslation();
  const showOpenLOC = withdrawalSurplus === 0 && collateral > 0;

  return (
    <div
      className={classNames(
        'bg-gray-80 md:bg-gray-90 py-7 px-6 rounded flex justify-between flex-wrap gap-6',
        className,
      )}
    >
      <div className="flex items-center flex-wrap gap-6">
        {withdrawalSurplus > 0 && (
          <LOCStat
            label={t('LOCStatus.withdrawalSurplus')}
            value={`${withdrawalSurplus} RBTC`}
          />
        )}
        {showOpenLOC && (
          <>
            <LOCStat
              label={t('LOCStatus.currentCollateral')}
              value={`${formatValue(
                Number(collateral),
                4,
              )} ${COLLATERAL_TOKEN.toUpperCase()}`}
            />
            <LOCStat
              label={t('LOCStatus.currentDebt')}
              value={
                <CountUp
                  duration={0.7}
                  separator=","
                  suffix={` ${debtSymbol}`}
                  end={debt}
                />
              }
            />
            <LOCStat
              label={
                <div className="flex items-center">
                  {t('LOCStatus.collateralRatio')}
                  <HelperButton className="ml-1.5" content="Collateral Ratio" />
                </div>
              }
              value={
                <div className="flex items-center">
                  <CRatioIndicator className="mr-3" value={cRatio} />
                  <CountUp duration={0.7} suffix="%" end={cRatio} />
                </div>
              }
            />
          </>
        )}
      </div>

      <div className="hidden md:flex flex-wrap gap-6">
        {withdrawalSurplus > 0 && (
          <Button
            text={t('LOCStatus.withdraw')}
            style={ButtonStyle.primary}
            size={ButtonSize.large}
            onClick={onWithdraw}
          />
        )}
        {showOpenLOC && (
          <>
            <Button
              text={t('LOCStatus.adjust')}
              style={ButtonStyle.primary}
              size={ButtonSize.large}
              onClick={onAdjust}
            />
            <Button
              text={t('LOCStatus.close')}
              style={ButtonStyle.secondary}
              size={ButtonSize.large}
              onClick={onClose}
            />
          </>
        )}
      </div>
    </div>
  );
};
