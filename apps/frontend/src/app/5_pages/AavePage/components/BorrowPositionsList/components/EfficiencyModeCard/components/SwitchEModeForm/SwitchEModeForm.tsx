import { formatReserves, formatUserSummary } from '@aave/math-utils';

import React, { FC, useCallback, useMemo, useState } from 'react';

import { t } from 'i18next';

import {
  Button,
  ErrorBadge,
  ErrorLevel,
  Icon,
  IconNames,
  Paragraph,
  Select,
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

type SwitchEModeFormProps = {
  current: EModeCategory;
  categories: EModeCategory[];
  onComplete: () => void;
};

export const SwitchEModeForm: FC<SwitchEModeFormProps> = ({
  current,
  categories,
  onComplete,
}) => {
  const { handleSetUserEMode } = useAaveSetUserEMode();
  const [category, setCategory] = useState<string>('');
  const { summary, userReservesData, reservesData, timestamp } =
    useAaveUserReservesData();

  const categoriesOptions = useMemo(() => {
    return categories
      .filter(c => c.id !== current.id)
      .map(category => ({
        label: category.label,
        value: String(category.id),
      }));
  }, [categories, current?.id]);

  const selectedCategory = useMemo(() => {
    return categories.find(c => c.id === Number(category));
  }, [category, categories]);

  const newSummary = useMemo(() => {
    if (!userReservesData || !reservesData) {
      return;
    }

    const {
      marketReferenceCurrencyDecimals,
      marketReferenceCurrencyPriceInUsd: marketReferencePriceInUsd,
    } = reservesData.baseCurrencyData;
    return formatUserSummary({
      userEmodeCategoryId: selectedCategory?.id ?? 0,
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
  }, [userReservesData, reservesData, timestamp, selectedCategory?.id]);

  const newCollateralRatio = useMemo(() => {
    if (!newSummary) {
      return Decimal.from(0);
    }
    return AaveCalculations.computeCollateralRatio(
      Decimal.from(newSummary.totalCollateralUSD),
      Decimal.from(newSummary.totalBorrowsUSD),
    );
  }, [newSummary]);

  const positionsInOtherCategories = useMemo(() => {
    return summary.reserves.some(
      r => r.reserve.eModeCategoryId !== Number(category) && r.borrowed.gt(0),
    );
  }, [summary, category]);

  const confirmEnabled = useMemo(() => {
    // cannot switch if undercollateralized or have positions in other categories
    return (
      Decimal.from(newSummary?.healthFactor ?? 0).lte(1) &&
      !positionsInOtherCategories &&
      selectedCategory
    );
  }, [newSummary, positionsInOtherCategories, selectedCategory]);

  const onConfirm = useCallback(() => {
    if (!selectedCategory) return;
    handleSetUserEMode(selectedCategory, { onComplete });
  }, [handleSetUserEMode, selectedCategory, onComplete]);

  return (
    <div className="space-y-6">
      <div>
        <Paragraph className="mb-1 text-gray-30 font-medium text-xs">
          {t(translations.aavePage.eMode.selectCategory)}
        </Paragraph>

        <Select
          value={category}
          onChange={setCategory}
          options={categoriesOptions}
          className="w-full"
        />
      </div>

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
                {selectedCategory?.label ?? '-'}
              </span>
            </div>
          }
        />
        <SimpleTableRow
          label={t(translations.aavePage.eMode.availableAssets)}
          value={selectedCategory?.assets.join(', ')}
        />
        <SimpleTableRow
          label={t(translations.aavePage.eMode.maxLoanToValue)}
          value={
            <div className={'flex items-center justify-end gap-1'}>
              <AmountRenderer value={current?.ltv} precision={2} suffix="%" />
              <Icon
                icon={IconNames.ARROW_RIGHT}
                className="h-2 flex-shrink-0"
              />
              <AmountRenderer
                value={Decimal.from(selectedCategory?.ltv ?? 0)}
                precision={2}
                suffix="%"
              />
            </div>
          }
        />
      </SimpleTable>

      {positionsInOtherCategories && (
        <ErrorBadge
          level={ErrorLevel.Critical}
          message={t(translations.aavePage.eMode.positionsMustBeClosed, {
            category,
          })}
          dataAttribute="positions-must-be-closed-error"
        />
      )}

      <Button
        className="w-full"
        disabled={!confirmEnabled}
        text={t(translations.aavePage.eMode.switchCategory)}
        onClick={onConfirm}
      />
    </div>
  );
};
