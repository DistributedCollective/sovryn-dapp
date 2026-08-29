import React, { FC, useMemo } from 'react';

import { t } from 'i18next';

import { HelperButton, SimpleTableRow, TooltipTrigger } from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { TOKEN_RENDER_PRECISION } from '../../../constants/currencies';
import { getTokenDisplayName } from '../../../constants/tokens';
import { translations } from '../../../locales/i18n';
import { getExitFeeAmount, getExitFeeDisplay } from '../../../utils/exitFee';
import { AmountRenderer } from '../AmountRenderer/AmountRenderer';

/** `rateBps / 100`, integer-safe (e.g. 50 -> "0.5", 100 -> "1"). */
const formatRate = (rateBps: number): string => {
  const value = rateBps / 100;
  return Number.isInteger(value) ? value.toFixed(0) : String(value);
};

export type ExitFeeTooltipContentProps = {
  fee: Decimal;
  rateBps: number;
  assetSymbol: string;
  precision?: number;
  /** Fixed-gross surfaces (e.g. surplus claim) display the exact fee. */
  approx?: boolean;
};

export const ExitFeeTooltipContent: FC<ExitFeeTooltipContentProps> = ({
  fee,
  rateBps,
  assetSymbol,
  precision = TOKEN_RENDER_PRECISION,
  approx = true,
}) => (
  <div className="flex flex-col gap-2">
    <span>
      {t(translations.exitFee.label, { rate: formatRate(rateBps) })}:{' '}
      <AmountRenderer
        value={fee}
        suffix={getTokenDisplayName(assetSymbol)}
        precision={precision}
        prefix={approx ? '~ ' : undefined}
        showRoundingPrefix={false}
      />
    </span>
    <span>{t(translations.exitFee.tooltip)}</span>
  </div>
);

export type ExitFeeRowProps = {
  gross: Decimal;
  rateBps: number;
  active: boolean;
  assetSymbol: string;
  precision?: number;
  /**
   * Required on purpose. The perimeter fails open, so a quote we could not get
   * and a quote of zero look identical in `active`/`rateBps`; making the caller
   * state which one this is stops the row from silently promising "no fee"
   * while the quote is still loading or the RPC is down.
   */
  unknown: boolean;
  loading?: boolean;
};

export const ExitFeeRow: FC<ExitFeeRowProps> = ({
  gross,
  rateBps,
  active,
  assetSymbol,
  precision = TOKEN_RENDER_PRECISION,
  unknown,
  loading = false,
}) => {
  const fee = useMemo(() => getExitFeeAmount(gross, rateBps), [gross, rateBps]);
  const display = getExitFeeDisplay({ active, rateBps, unknown, loading }, fee);

  if (display === 'none') {
    return null;
  }

  if (display === 'unknown') {
    return (
      <SimpleTableRow
        label={
          <span className="flex flex-row items-center gap-1 whitespace-nowrap">
            {t(translations.exitFee.unavailable)}
            <HelperButton
              content={t(translations.exitFee.unavailableTooltip)}
              trigger={TooltipTrigger.click}
              dataAttribute="exit-fee-unavailable-helper"
            />
          </span>
        }
        value="—"
        dataAttribute="exit-fee-unavailable"
      />
    );
  }

  return (
    <SimpleTableRow
      label={
        <span className="flex flex-row items-center gap-1 whitespace-nowrap">
          {t(translations.exitFee.youWillReceive)}
          <HelperButton
            content={
              <ExitFeeTooltipContent
                fee={fee}
                rateBps={rateBps}
                assetSymbol={assetSymbol}
                precision={precision}
              />
            }
            trigger={TooltipTrigger.click}
            dataAttribute="exit-fee-helper"
          />
        </span>
      }
      value={
        <AmountRenderer
          value={gross.sub(fee)}
          suffix={getTokenDisplayName(assetSymbol)}
          precision={precision}
          prefix="~ "
          showRoundingPrefix={false}
        />
      }
      dataAttribute="exit-fee-net"
    />
  );
};
