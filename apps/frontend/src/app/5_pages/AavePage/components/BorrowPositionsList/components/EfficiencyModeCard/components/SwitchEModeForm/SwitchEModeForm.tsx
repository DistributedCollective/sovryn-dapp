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
  SelectOption,
  SimpleTable,
  SimpleTableRow,
} from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { AmountRenderer } from '../../../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { MINIMUM_COLLATERAL_RATIO_LENDING_POOLS_AAVE } from '../../../../../../../../../constants/aave';
import { useAaveSetUserEMode } from '../../../../../../../../../hooks/aave/useAaveSetUserEMode';
import { useAaveUserReservesData } from '../../../../../../../../../hooks/aave/useAaveUserReservesData';
import { translations } from '../../../../../../../../../locales/i18n';
import { EModeCategory } from '../../../../../../../../../types/aave';
import { CollateralRatioHealthBar } from '../../../../../CollateralRatioHealthBar/CollateralRatioHealthBar';
import { normalizeEModeSummary } from '../../EfficencyModeCard.utils';

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
    return categories.reduce((acc, category) => {
      if (category.id === current?.id) {
        return acc; // skip current category
      }

      return [
        ...acc,
        {
          label: category.label,
          value: String(category.id),
        },
      ];
    }, [] as SelectOption[]);
  }, [categories, current?.id]);

  const selectedCategory = useMemo(() => {
    return categories.find(c => c.id === Number(category));
  }, [category, categories]);

  const summaryAfterSwitch = useMemo(() => {
    return normalizeEModeSummary(
      selectedCategory?.id ?? 0,
      reservesData,
      userReservesData,
      timestamp,
    );
  }, [userReservesData, reservesData, timestamp, selectedCategory?.id]);

  const positionsInOtherCategories = useMemo(() => {
    return summary.reserves.some(
      r => r.reserve.eModeCategoryId !== Number(category) && r.borrowed.gt(0),
    );
  }, [summary, category]);

  const confirmEnabled = useMemo(() => {
    // cannot switch if undercollateralized or have positions in other categories
    return (
      !summaryAfterSwitch.liquidationRisk &&
      !positionsInOtherCategories &&
      selectedCategory
    );
  }, [summaryAfterSwitch, positionsInOtherCategories, selectedCategory]);

  const onConfirm = useCallback(() => {
    handleSetUserEMode(selectedCategory!, { onComplete });
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
        ratio={summaryAfterSwitch.collateralRatio}
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
