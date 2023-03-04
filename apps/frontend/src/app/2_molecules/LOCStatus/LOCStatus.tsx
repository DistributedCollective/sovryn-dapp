import React, { FC } from 'react';

import classNames from 'classnames';
import { t } from 'i18next';
import CountUp from 'react-countup';

import { Button, ButtonSize, ButtonStyle, HelperButton } from '@sovryn/ui';

import {
  TOKEN_RENDER_PRECISION,
  BTC_RENDER_PRECISION,
} from '../../3_organisms/ZeroLocForm/constants';
import { Bitcoin } from '../../../utils/constants';
import { AmountRenderer } from '../AmountRenderer/AmountRenderer';
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
  const hasWithdrawalSurplus = withdrawalSurplus > 0;
  const showOpenLOC = !hasWithdrawalSurplus && collateral > 0;

  return (
    <div
      className={classNames(
        'bg-gray-80 md:bg-gray-90 py-7 px-6 rounded flex justify-between flex-wrap gap-6 items-center',
        className,
      )}
    >
      <div className="flex items-center flex-wrap gap-6">
        {hasWithdrawalSurplus && (
          <LOCStat
            label={t('LOCStatus.withdrawalSurplus')}
            value={`${withdrawalSurplus} ${Bitcoin}`}
          />
        )}
        {showOpenLOC && (
          <>
            <LOCStat
              label={t('LOCStatus.currentCollateral')}
              value={
                <AmountRenderer
                  value={collateral}
                  suffix={Bitcoin}
                  precision={BTC_RENDER_PRECISION}
                  dataAttribute="loc-status-collateral"
                  isAnimated
                />
              }
            />
            <LOCStat
              label={t('LOCStatus.currentDebt')}
              value={
                <AmountRenderer
                  value={debt}
                  suffix={debtSymbol}
                  precision={TOKEN_RENDER_PRECISION}
                  dataAttribute="loc-status-debt"
                  isAnimated
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

      <div className="flex flex-wrap gap-6 justify-center w-full md:w-auto">
        {hasWithdrawalSurplus && (
          <Button
            text={t('LOCStatus.withdraw')}
            style={ButtonStyle.primary}
            size={ButtonSize.large}
            onClick={onWithdraw}
            className="px-12 xl:px-6"
            dataAttribute="zero-loc-surplus-withdraw"
          />
        )}
        {showOpenLOC && (
          <>
            <Button
              text={t('LOCStatus.adjust')}
              style={ButtonStyle.primary}
              size={ButtonSize.large}
              onClick={onAdjust}
              className="px-12 xl:px-6"
              dataAttribute="zero-loc-adjust"
            />
            <Button
              text={t('LOCStatus.close')}
              style={ButtonStyle.secondary}
              size={ButtonSize.large}
              onClick={onClose}
              className="px-12 xl:px-6"
              dataAttribute="zero-loc-close"
            />
          </>
        )}
      </div>
    </div>
  );
};
