import React, { FC, useMemo } from 'react';

import classNames from 'classnames';
import { t } from 'i18next';
import CountUp from 'react-countup';

import {
  Button,
  ButtonSize,
  ButtonStyle,
  HelperButton,
  SimpleTable,
  TooltipTrigger,
} from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { RedemptionDialogButton } from '../../5_pages/ZeroPage/components/RedemptionDialog/RedemptionDialogButton';
import {
  BITCOIN,
  BTC_RENDER_PRECISION,
  TOKEN_RENDER_PRECISION,
} from '../../../constants/currencies';
import { useZeroExitDelayQuote } from '../../../hooks/exitDelay/useZeroExitDelayQuote';
import { useZeroClaimExitFee } from '../../../hooks/exitFee/useZeroClaimExitFee';
import { translations } from '../../../locales/i18n';
import { COMMON_SYMBOLS } from '../../../utils/asset';
import { getExitDelayDisplay } from '../../../utils/exitDelay';
import {
  SURFACE_ZERO_CLAIM_SURPLUS,
  getExitFeeDisplay,
} from '../../../utils/exitFee';
import { AmountRenderer } from '../AmountRenderer/AmountRenderer';
import { ExitDelayRow } from '../ExitDelayRow/ExitDelayRow';
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

  // The claim is a Zero exit: its fee is quoted through BorrowerOperations'
  // own controller pointer for this surplus, and its withdrawal delay for the
  // claim surface.
  const claimFee = useZeroClaimExitFee(withdrawalSurplus);
  const showSurplusExitFee =
    getExitFeeDisplay(claimFee, claimFee.feeAmount) === 'charged';
  // The claim's fee row stays hidden for this too — the chain fails open, so
  // an unread quote is not a stated fee — but the figure below states the
  // whole surplus as what the borrower will get, which needs its own
  // qualifier when the quote never arrived.
  const surplusFeeUnknown = !showSurplusExitFee && claimFee.unknown;

  const claimDelay = useZeroExitDelayQuote(SURFACE_ZERO_CLAIM_SURPLUS);
  const showClaimDelay = getExitDelayDisplay(claimDelay) !== 'none';

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
                        fee={claimFee.feeAmount}
                        rateBps={claimFee.rateBps}
                        assetSymbol={COMMON_SYMBOLS.BTC}
                        precision={BTC_RENDER_PRECISION}
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
                  value={claimFee.netAmount}
                  suffix={BITCOIN}
                  precision={BTC_RENDER_PRECISION}
                  // The fee is set when the claim executes, so the net is
                  // marked approximate like every other fee row.
                  prefix="~ "
                  showRoundingPrefix={false}
                />
              ) : (
                `${withdrawalSurplus} ${BITCOIN}`
              )
            }
            note={
              surplusFeeUnknown ? (
                <div
                  className="mt-2 text-xs text-gray-30"
                  data-test-id="exit-fee-unknown-notice"
                >
                  {t(translations.exitFee.unknownNotice)}
                </div>
              ) : undefined
            }
          />
        )}
        {hasWithdrawalSurplus && showClaimDelay && (
          <SimpleTable
            className="md:min-w-60"
            dataAttribute="loc-status-surplus-delay"
          >
            <ExitDelayRow
              delaySeconds={claimDelay.delaySeconds}
              unknown={claimDelay.unknown}
              loading={claimDelay.loading}
            />
          </SimpleTable>
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
            // Until the delay and fee quotes arrive the card cannot say
            // whether the claim is paid now, held, or what it costs.
            disabled={claimDelay.loading || claimFee.loading}
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
