import React, { FC, useMemo } from 'react';

import { t } from 'i18next';

import { SupportedTokens } from '@sovryn/contracts';
import { SimpleTable, SimpleTableRow } from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { translations } from '../../../../../../../locales/i18n';
import { decimalic } from '../../../../../../../utils/math';
import { AmmLiquidityPool } from '../../../../utils/AmmLiquidityPool';
import { AdjustType } from '../../AdjustAndDepositModal.types';

// TODO: Fetch rewards in the component. If you want to test the functionality, set it to Decimal.ONE
const transferRewards = Decimal.ZERO; // Decimal.ONE

// TODO: Fetch weekly rewards estimation in the component. If you want to test the functionality, set it to Decimal.ONE
const weeklyRewardsEstimation = Decimal.ONE; // Decimal.ONE

// TODO: Fetch initialPoolBalance in the component.
const initialPoolBalance = decimalic(20);

const pageTranslations =
  translations.marketMakingPage.adjustAndDepositModal.newPoolStatistics;

type NewPoolStatisticsProps = {
  amount: Decimal;
  isInitialDeposit: boolean;
  adjustType: AdjustType;
  pool: AmmLiquidityPool;
};

export const NewPoolStatistics: FC<NewPoolStatisticsProps> = ({
  amount,
  isInitialDeposit,
  adjustType,
  pool,
}) => {
  const token = useMemo(() => pool.assetA, [pool.assetA]);

  const newPoolBalance = useMemo(
    () =>
      adjustType === AdjustType.Deposit || isInitialDeposit
        ? initialPoolBalance.add(amount)
        : initialPoolBalance.sub(amount),
    [adjustType, amount, isInitialDeposit],
  );

  return (
    <SimpleTable className="mt-6">
      <SimpleTableRow
        label={t(pageTranslations.newPoolBalance)}
        value={
          amount.isZero() ? (
            t(translations.common.na)
          ) : (
            <AmountRenderer value={newPoolBalance} suffix={token} />
          )
        }
      />
      {!isInitialDeposit && (
        <SimpleTableRow
          label={t(pageTranslations.transferRewards)}
          value={
            transferRewards.isZero() ? (
              t(translations.common.na)
            ) : (
              <AmountRenderer
                value={transferRewards}
                suffix={SupportedTokens.sov}
              />
            )
          }
        />
      )}
      <SimpleTableRow
        label={t(pageTranslations.weeklyRewardsEstimation)}
        value={
          weeklyRewardsEstimation.isZero() ? (
            t(translations.common.na)
          ) : (
            <AmountRenderer
              value={weeklyRewardsEstimation}
              suffix={SupportedTokens.sov}
            />
          )
        }
      />
    </SimpleTable>
  );
};
