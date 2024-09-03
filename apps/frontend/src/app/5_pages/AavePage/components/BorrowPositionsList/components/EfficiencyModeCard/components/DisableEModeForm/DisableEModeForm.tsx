import { formatReserves, formatUserSummary } from '@aave/math-utils';

import React, { FC, useCallback, useMemo } from 'react';

import { t } from 'i18next';

import {
  Button,
  ErrorBadge,
  ErrorLevel,
  Icon,
  IconNames,
  SimpleTable,
  SimpleTableRow,
} from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { AmountRenderer } from '../../../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { config } from '../../../../../../../../../constants/aave';
import { useAaveSetUserEMode } from '../../../../../../../../../hooks/aave/useAaveSetUserEMode';
import { useAaveUserReservesData } from '../../../../../../../../../hooks/aave/useAaveUserReservesData';
import { translations } from '../../../../../../../../../locales/i18n';
import { EModeCategory } from '../../../../../../../../../types/aave';
import { AaveCalculations } from '../../../../../../../../../utils/aave/AaveCalculations';
import { CollateralRatioHealthBar } from '../../../../../CollateralRatioHealthBar/CollateralRatioHealthBar';

type DisableEModeFormProps = {
  current: EModeCategory;
};

export const DisableEModeForm: FC<DisableEModeFormProps> = ({ current }) => {
  const { handleDisableUserEMode } = useAaveSetUserEMode();
  const { userReservesData, reservesData, timestamp } =
    useAaveUserReservesData();

  const onConfirm = useCallback(() => {
    handleDisableUserEMode();
  }, [handleDisableUserEMode]);

  const newSummary = useMemo(() => {
    if (!userReservesData || !reservesData) {
      return;
    }

    const {
      marketReferenceCurrencyDecimals,
      marketReferenceCurrencyPriceInUsd: marketReferencePriceInUsd,
    } = reservesData.baseCurrencyData;
    return formatUserSummary({
      userEmodeCategoryId: 0, // disable mode
      currentTimestamp: timestamp,
      marketReferencePriceInUsd,
      marketReferenceCurrencyDecimals,
      userReserves: userReservesData.userReserves,
      formattedReserves: formatReserves({
        currentTimestamp: timestamp,
        marketReferencePriceInUsd,
        marketReferenceCurrencyDecimals,
        reserves: reservesData.reservesData,
      }),
    });
  }, [userReservesData, reservesData, timestamp]);

  const newCollateralRatio = useMemo(() => {
    if (!newSummary) {
      return Decimal.from(0);
    }
    return AaveCalculations.computeCollateralRatio(
      Decimal.from(newSummary.totalCollateralUSD),
      Decimal.from(newSummary.totalBorrowsUSD),
    );
  }, [newSummary]);

  const liquidationRisk = useMemo(() => {
    if (newSummary?.healthFactor === '-1') {
      return false;
    }
    return Decimal.from(newSummary?.healthFactor ?? 0).lte(1);
  }, [newSummary?.healthFactor]);

  const confirmEnabled = useMemo(() => {
    // cannot disable if undercollateralized
    return !liquidationRisk;
  }, [liquidationRisk]);

  return (
    <div className="space-y-6">
      {liquidationRisk && (
        <ErrorBadge
          level={ErrorLevel.Critical}
          message={t(translations.aavePage.eMode.liquidationRiskWarning)}
          dataAttribute="liquidation-risk-warning"
        />
      )}

      <CollateralRatioHealthBar
        ratio={newCollateralRatio}
        minimum={config.MinCollateralRatio}
      />

      <SimpleTable>
        <SimpleTableRow
          label={t(translations.aavePage.eMode.eModeCategory)}
          value={
            <div className={'flex items-center justify-end gap-1'}>
              <span>{current?.label}</span>
              <Icon
                icon={IconNames.ARROW_RIGHT}
                className="h-2 flex-shrink-0"
              />
              <span className="text-primary-10">
                {t(translations.aavePage.eMode.none)}
              </span>
            </div>
          }
        />
        <SimpleTableRow
          label={t(translations.aavePage.eMode.availableAssets)}
          value={
            <div className={'flex items-center justify-end gap-1'}>
              <span>{current?.assets.join(', ')}</span>
              <Icon
                icon={IconNames.ARROW_RIGHT}
                className="h-2 flex-shrink-0"
              />
              <span className="text-primary-10">
                {t(translations.aavePage.eMode.allAssets)}
              </span>
            </div>
          }
        />
        <SimpleTableRow
          label={t(translations.aavePage.eMode.maxLoanToValue)}
          value={
            <div className={'flex items-center justify-end gap-1'}>
              <AmountRenderer
                value={Decimal.from(current?.ltv ?? 0).div(100)}
                precision={2}
                suffix="%"
              />
              <Icon
                icon={IconNames.ARROW_RIGHT}
                className="h-2 flex-shrink-0"
              />
              <AmountRenderer
                value={Decimal.from(newSummary?.currentLoanToValue ?? 0).mul(
                  100,
                )}
                precision={2}
                suffix="%"
              />
            </div>
          }
        />
      </SimpleTable>

      <Button
        className="w-full"
        disabled={!confirmEnabled}
        text={t(translations.aavePage.eMode.disableEMode)}
        onClick={onConfirm}
      />
    </div>
  );
};
