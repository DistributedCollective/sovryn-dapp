import React, { FC, useCallback, useMemo, useState } from 'react';

import { t } from 'i18next';

import {
  Button,
  ErrorBadge,
  ErrorLevel,
  Paragraph,
  Select,
  SimpleTable,
  SimpleTableRow,
} from '@sovryn/ui';

import { AmountRenderer } from '../../../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { useAaveSetUserEMode } from '../../../../../../../../../hooks/aave/useAaveSetUserEMode';
import { useAaveUserReservesData } from '../../../../../../../../../hooks/aave/useAaveUserReservesData';
import { translations } from '../../../../../../../../../locales/i18n';
import { EModeCategory } from '../../../../../../../../../types/aave';

type EnableEModeFormProps = {
  categories: EModeCategory[];
  onComplete: () => void;
};

export const EnableEModeForm: FC<EnableEModeFormProps> = ({
  categories,
  onComplete,
}) => {
  const [category, setCategory] = useState(String(categories[0]?.id));
  const { summary } = useAaveUserReservesData();
  const { handleSetUserEMode } = useAaveSetUserEMode();

  const categoriesOptions = useMemo(() => {
    return categories.map(category => ({
      label: category.label,
      value: String(category?.id),
    }));
  }, [categories]);

  const selectedCategory = useMemo(() => {
    return categories.find(c => c?.id === Number(category));
  }, [category, categories]);

  const positionsInOtherCategories = useMemo(() => {
    return summary.reserves.some(
      r => r.reserve.eModeCategoryId !== Number(category) && r.borrowed.gt(0),
    );
  }, [summary, category]);

  const onConfirmClick = useCallback(() => {
    if (!selectedCategory) return;
    handleSetUserEMode(selectedCategory, { onComplete });
  }, [handleSetUserEMode, selectedCategory, onComplete]);

  return (
    <div className="space-y-6">
      <ErrorBadge
        level={ErrorLevel.Warning}
        message={t(translations.aavePage.eMode.limitationsWarning)}
        dataAttribute="limitations-warning"
      />

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

      <SimpleTable>
        <SimpleTableRow
          label={t(translations.aavePage.eMode.availableAssets)}
          value={selectedCategory?.assets.join(', ')}
        />
        <SimpleTableRow
          label={t(translations.aavePage.eMode.maxLoanToValue)}
          value={
            <AmountRenderer
              value={selectedCategory ? selectedCategory.ltv.div(100) : 0}
              suffix="%"
              precision={2}
            />
          }
        />
      </SimpleTable>

      {positionsInOtherCategories && (
        <ErrorBadge
          level={ErrorLevel.Critical}
          message={t(translations.aavePage.eMode.positionsMustBeClosed, {
            category: selectedCategory?.label,
          })}
          dataAttribute="positions-must-be-closed-error"
        />
      )}

      <Button
        className="w-full"
        disabled={positionsInOtherCategories}
        text={t(translations.common.buttons.confirm)}
        onClick={onConfirmClick}
      />
    </div>
  );
};
