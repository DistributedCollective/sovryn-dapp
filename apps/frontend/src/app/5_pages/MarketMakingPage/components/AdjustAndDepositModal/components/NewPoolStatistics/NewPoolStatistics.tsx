import React, { FC, useMemo } from 'react';

import classNames from 'classnames';
import { t } from 'i18next';

import { HelperButton, SimpleTable, SimpleTableRow } from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import {
  BITCOIN,
  BTC_RENDER_PRECISION,
  TOKEN_RENDER_PRECISION,
} from '../../../../../../../constants/currencies';
import { translations } from '../../../../../../../locales/i18n';
import { COMMON_SYMBOLS } from '../../../../../../../utils/asset';
import { decimalic } from '../../../../../../../utils/math';
import { useGetAccumulatedReward } from '../../../../hooks/useGetAccumulatedReward';
import { useGetExpectedTokenAmount } from '../../../../hooks/useGetExpectedTokenAmount';
import { useGetUserInfo } from '../../../../hooks/useGetUserInfo';
import { AmmLiquidityPool } from '../../../../utils/AmmLiquidityPool';
import { AdjustType } from '../../AdjustAndDepositModal.types';
import { useGetPoolBalanceAndRewards } from '../../hooks/useGetPoolBalanceAndRewards';

const pageTranslations =
  translations.marketMakingPage.adjustAndDepositModal.newPoolStatistics;

type NewPoolStatisticsProps = {
  value: string;
  asset: string;
  decimalAmount: Decimal;
  isInitialDeposit: boolean;
  adjustType: AdjustType;
  pool: AmmLiquidityPool;
};

export const NewPoolStatistics: FC<NewPoolStatisticsProps> = ({
  value,
  asset,
  decimalAmount,
  isInitialDeposit,
  adjustType,
  pool,
}) => {
  const tokenA = useMemo(() => pool.assetA, [pool.assetA]);
  const { balanceA, balanceB } = useGetUserInfo(pool);
  const { reward } = useGetAccumulatedReward(pool.poolTokenA);

  const isTokenA = useMemo(() => asset === pool.assetA, [asset, pool.assetA]);
  const isV2Pool = useMemo(
    () => pool.converterVersion === 2,
    [pool.converterVersion],
  );

  const isDeposit = useMemo(
    () => adjustType === AdjustType.Deposit || isInitialDeposit,
    [adjustType, isInitialDeposit],
  );

  const decimalValue = useMemo(() => decimalic(value), [value]);

  const expectedTokenAmount = useGetExpectedTokenAmount(pool, decimalValue);
  const isAmountZero = useMemo(() => decimalAmount.isZero(), [decimalAmount]);

  const newPoolBalanceA = useMemo(() => {
    if (isV2Pool && !isTokenA) {
      return balanceA;
    }

    return isDeposit ? balanceA.add(decimalValue) : balanceA.sub(decimalValue);
  }, [isV2Pool, isTokenA, isDeposit, balanceA, decimalValue]);

  const newPoolBalanceB = useMemo(() => {
    if (isV2Pool) {
      if (isTokenA) {
        return balanceB;
      }
      return isDeposit
        ? balanceB.add(decimalValue)
        : balanceB.sub(decimalValue);
    }

    return adjustType === AdjustType.Deposit || isInitialDeposit
      ? balanceB.add(expectedTokenAmount)
      : decimalAmount.eq(balanceA)
      ? Decimal.ZERO
      : balanceB.sub(expectedTokenAmount);
  }, [
    isTokenA,
    isV2Pool,
    adjustType,
    isInitialDeposit,
    balanceB,
    expectedTokenAmount,
    decimalAmount,
    balanceA,
    isDeposit,
    decimalValue,
  ]);

  const { weeklyRewardsEstimation } = useGetPoolBalanceAndRewards(
    pool,
    newPoolBalanceA,
    newPoolBalanceB,
    isTokenA,
    isV2Pool,
  );

  return (
    <SimpleTable className="mt-6">
      <SimpleTableRow
        label={t(pageTranslations.newPoolBalance)}
        value={
          decimalAmount.isZero() ? (
            t(translations.common.na)
          ) : (
            <AmountRenderer value={newPoolBalanceA} suffix={tokenA} />
          )
        }
        valueClassName={classNames(!isAmountZero && 'text-primary-10')}
      />
      {!isAmountZero && newPoolBalanceB.gt(0) && (
        <SimpleTableRow
          label=""
          value={
            <AmountRenderer
              value={newPoolBalanceB}
              suffix={BITCOIN}
              precision={BTC_RENDER_PRECISION}
            />
          }
          valueClassName="text-primary-10"
        />
      )}
      {!isInitialDeposit && reward.gt(0) && (
        <SimpleTableRow
          label={t(pageTranslations.transferRewards)}
          value={
            <AmountRenderer
              value={reward}
              suffix={COMMON_SYMBOLS.SOV}
              precision={TOKEN_RENDER_PRECISION}
            />
          }
        />
      )}
      <SimpleTableRow
        label={
          <span className="flex items-center gap-1">
            {t(pageTranslations.weeklyRewardsEstimation)}{' '}
            <HelperButton
              tooltipClassName="max-w-56 md:max-w-96"
              content={t(pageTranslations.weeklyRewardsEstimationInfo)}
            />
          </span>
        }
        value={
          isAmountZero ? (
            t(translations.common.na)
          ) : (
            <AmountRenderer
              value={weeklyRewardsEstimation}
              suffix={BITCOIN}
              precision={BTC_RENDER_PRECISION}
            />
          )
        }
        valueClassName={classNames(!isAmountZero && 'text-primary-10')}
      />
    </SimpleTable>
  );
};
