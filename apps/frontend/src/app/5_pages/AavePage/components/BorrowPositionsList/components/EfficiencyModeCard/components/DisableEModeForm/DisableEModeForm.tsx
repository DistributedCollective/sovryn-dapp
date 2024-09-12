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
import {
  EMODE_DISABLED_ID,
  MINIMUM_COLLATERAL_RATIO_LENDING_POOLS_AAVE,
} from '../../../../../../../../../constants/aave';
import { useAaveSetUserEMode } from '../../../../../../../../../hooks/aave/useAaveSetUserEMode';
import { useAaveUserReservesData } from '../../../../../../../../../hooks/aave/useAaveUserReservesData';
import { translations } from '../../../../../../../../../locales/i18n';
import { EModeCategory } from '../../../../../../../../../types/aave';
import { CollateralRatioHealthBar } from '../../../../../CollateralRatioHealthBar/CollateralRatioHealthBar';
import { normalizeEModeSummary } from '../../EfficencyModeCard.utils';

type DisableEModeFormProps = {
  current: EModeCategory;
  onComplete: () => void;
};

export const DisableEModeForm: FC<DisableEModeFormProps> = ({
  current,
  onComplete,
}) => {
  const { handleDisableUserEMode } = useAaveSetUserEMode();
  const { userReservesData, reservesData, timestamp } =
    useAaveUserReservesData();

  const onConfirm = useCallback(
    () => handleDisableUserEMode({ onComplete }),
    [handleDisableUserEMode, onComplete],
  );

  const summaryAfterDisabled = useMemo(
    () =>
      normalizeEModeSummary(
        EMODE_DISABLED_ID,
        reservesData,
        userReservesData,
        timestamp,
      ),
    [userReservesData, reservesData, timestamp],
  );

  const isConfirmEnabled = useMemo(
    () => !summaryAfterDisabled.liquidationRisk,
    [summaryAfterDisabled.liquidationRisk],
  );

  return (
    <div className="space-y-6">
      {summaryAfterDisabled.liquidationRisk && (
        <ErrorBadge
          level={ErrorLevel.Critical}
          message={t(translations.aavePage.eMode.liquidationRiskWarning)}
          dataAttribute="liquidation-risk-warning"
        />
      )}

      <CollateralRatioHealthBar
        ratio={summaryAfterDisabled.collateralRatio}
        minimum={MINIMUM_COLLATERAL_RATIO_LENDING_POOLS_AAVE}
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
                value={Decimal.from(current?.ltv ?? 0)}
                precision={2}
                suffix="%"
              />
              <Icon
                icon={IconNames.ARROW_RIGHT}
                className="h-2 flex-shrink-0"
              />
              <AmountRenderer
                value={summaryAfterDisabled.ltv}
                precision={2}
                suffix="%"
              />
            </div>
          }
        />
      </SimpleTable>

      <Button
        className="w-full"
        disabled={!isConfirmEnabled}
        text={t(translations.aavePage.eMode.disableEMode)}
        onClick={onConfirm}
      />
    </div>
  );
};
