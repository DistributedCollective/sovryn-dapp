import React, { FC, useMemo } from 'react';

import classNames from 'classnames';
import { constants } from 'ethers';
import { t } from 'i18next';
import CountUp from 'react-countup';

import {
  Button,
  ButtonSize,
  ButtonStyle,
  HelperButton,
  TooltipTrigger,
} from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { RedemptionDialogButton } from '../../5_pages/ZeroPage/components/RedemptionDialog/RedemptionDialogButton';
import {
  BITCOIN,
  BTC_RENDER_PRECISION,
  TOKEN_RENDER_PRECISION,
} from '../../../constants/currencies';
import { useExitFeeRate } from '../../../hooks/exitFee/useExitFeeRate';
import { COMMON_SYMBOLS } from '../../../utils/asset';
import {
  SURFACE_ZERO_CLAIM_SURPLUS,
  getExitFeeAmount,
  isExitFeeShown,
} from '../../../utils/exitFee';
import { AmountRenderer } from '../AmountRenderer/AmountRenderer';
import { ExitFeeTooltipContent } from '../ExitFeeRow/ExitFeeRow';
import { CRatioIndicator } from './components/CRatioIndicator/CRatioIndicator';
import { LOCStat } from './components/LOCStat/LOCStat';

export type LOCStatusProps = {
  className?: string;
  withdrawalSurplus?: Decimal;
  collateral?: Decimal;
  debt?: Decimal;
  debtSymbol?: string;
  cRatio?: Decimal;
  onAdjust?: () => void;
  onClose?: () => void;
  onWithdraw?: () => void;
};

export const LOCStatus: FC<LOCStatusProps> = ({
  withdrawalSurplus = Decimal.ZERO,
  collateral = Decimal.ZERO,
  debt = Decimal.ZERO,
  cRatio = Decimal.ZERO,
  onAdjust,
  onClose,
  onWithdraw,
  className,
  debtSymbol = '',
}) => {
  const hasWithdrawalSurplus = withdrawalSurplus.gt(0);
  const showOpenLOC = !hasWithdrawalSurplus && collateral.gt(0);

  const ratio = useMemo(() => parseInt(cRatio.toString()), [cRatio]);

  const { active: exitFeeActive, rateBps: exitFeeRateBps } = useExitFeeRate(
    SURFACE_ZERO_CLAIM_SURPLUS,
    constants.AddressZero, // ethers constants — subProduct dimension unused for Zero
  );
  const surplusExitFee = useMemo(
    () => getExitFeeAmount(withdrawalSurplus, exitFeeRateBps),
    [withdrawalSurplus, exitFeeRateBps],
  );
  const showSurplusExitFee = isExitFeeShown(
    exitFeeActive,
    exitFeeRateBps,
    surplusExitFee,
  );

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
            label={
              showSurplusExitFee ? (
                <span className="flex flex-row items-center gap-1 whitespace-nowrap">
                  {t('LOCStatus.withdrawalSurplus')}
                  <HelperButton
                    content={
                      <ExitFeeTooltipContent
                        fee={surplusExitFee}
                        rateBps={exitFeeRateBps}
                        assetSymbol={COMMON_SYMBOLS.BTC}
                        precision={BTC_RENDER_PRECISION}
                        approx={false}
                      />
                    }
                    trigger={TooltipTrigger.click}
                    dataAttribute="exit-fee-helper"
                  />
                </span>
              ) : (
                t('LOCStatus.withdrawalSurplus')
              )
            }
            value={
              showSurplusExitFee ? (
                <AmountRenderer
                  value={withdrawalSurplus.sub(surplusExitFee)}
                  suffix={BITCOIN}
                  precision={BTC_RENDER_PRECISION}
                />
              ) : (
                `${withdrawalSurplus} ${BITCOIN}`
              )
            }
          />
        )}
        {showOpenLOC && (
          <>
            <LOCStat
              label={t('LOCStatus.currentCollateral')}
              value={
                <AmountRenderer
                  value={collateral}
                  suffix={BITCOIN}
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
              label={t('LOCStatus.collateralRatio')}
              value={
                <div className="flex items-center">
                  <CRatioIndicator className="mr-3" value={ratio} />
                  <CountUp duration={0.7} suffix="%" end={ratio} />
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
            className="flex-1"
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
              className="flex-1"
              dataAttribute="zero-loc-adjust"
            />
            <Button
              text={t('LOCStatus.close')}
              style={ButtonStyle.secondary}
              size={ButtonSize.large}
              onClick={onClose}
              className="flex-1"
              dataAttribute="zero-loc-close"
            />
          </>
        )}

        <RedemptionDialogButton size={ButtonSize.large} />
      </div>
    </div>
  );
};
