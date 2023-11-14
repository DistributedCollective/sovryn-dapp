import React, { FC, useEffect, useMemo, useState } from 'react';

import classNames from 'classnames';
import { ethers } from 'ethers';
import { t } from 'i18next';

import { SupportedTokens, getTokenContract } from '@sovryn/contracts';
import { getProvider } from '@sovryn/ethers-provider';
import { SimpleTable, SimpleTableRow } from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { defaultChainId } from '../../../../../../../config/chains';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import {
  BITCOIN,
  BTC_RENDER_PRECISION,
  TOKEN_RENDER_PRECISION,
} from '../../../../../../../constants/currencies';
import { useGetRBTCPrice } from '../../../../../../../hooks/zero/useGetRBTCPrice';
import { translations } from '../../../../../../../locales/i18n';
import { decimalic, fromWei } from '../../../../../../../utils/math';
import { useGetAccumulatedReward } from '../../../../hooks/useGetAccumulatedReward';
import { useGetExpectedTokenAmount } from '../../../../hooks/useGetExpectedTokenAmount';
import { useGetUserInfo } from '../../../../hooks/useGetUserInfo';
import { AmmLiquidityPool } from '../../../../utils/AmmLiquidityPool';
import { AdjustType } from '../../AdjustAndDepositModal.types';

const pageTranslations =
  translations.marketMakingPage.adjustAndDepositModal.newPoolStatistics;

const WEEKLY_REWARDS_AMOUNT = '20000';

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
  const tokenA = useMemo(() => pool.assetA, [pool.assetA]);
  const { balanceA, balanceB } = useGetUserInfo(pool);
  const { price: rbtcPrice } = useGetRBTCPrice();
  const { reward } = useGetAccumulatedReward(pool.poolTokenA);
  const { reward: accumulatedRewards } = useGetUserInfo(pool);

  const renderRewards = useMemo(
    () =>
      fromWei(decimalic(reward).add(decimalic(accumulatedRewards)).toString()),
    [reward, accumulatedRewards],
  );
  const [weeklyRewardsEstimation, setWeeklyRewardsEstimation] = useState('0');

  const { amount: expectedTokenAmount } = useGetExpectedTokenAmount(
    pool,
    amount,
  );

  const newPoolBalanceA = useMemo(
    () =>
      adjustType === AdjustType.Deposit || isInitialDeposit
        ? decimalic(balanceA).add(amount).toNumber().toFixed(0)
        : decimalic(balanceA).sub(amount).toNumber().toFixed(0),
    [adjustType, amount, isInitialDeposit, balanceA],
  );

  const newPoolBalanceB = useMemo(
    () =>
      adjustType === AdjustType.Deposit || isInitialDeposit
        ? decimalic(balanceB).add(expectedTokenAmount).toNumber().toFixed(0)
        : amount.eq(balanceA)
        ? '0'
        : decimalic(balanceB).sub(expectedTokenAmount).toNumber().toFixed(0),
    [
      adjustType,
      expectedTokenAmount,
      isInitialDeposit,
      balanceB,
      amount,
      balanceA,
    ],
  );

  useEffect(() => {
    const fetchPoolBalance = async () => {
      const { address, abi } = await getTokenContract(
        SupportedTokens.wrbtc,
        defaultChainId,
      );
      const contract = new ethers.Contract(
        address,
        abi,
        getProvider(defaultChainId),
      );
      const poolBalance = await contract.balanceOf(pool.converter);
      if (poolBalance) {
        const value = decimalic(newPoolBalanceA)
          .div(decimalic(poolBalance.toString()))
          .mul(decimalic(WEEKLY_REWARDS_AMOUNT))
          .mul(decimalic(rbtcPrice))
          .toNumber()
          .toFixed(0);
        setWeeklyRewardsEstimation(value);
      }
    };
    fetchPoolBalance();
  }, [newPoolBalanceA, pool.converter, pool.assetB, rbtcPrice]);

  return (
    <SimpleTable className="mt-6">
      <SimpleTableRow
        label={t(pageTranslations.newPoolBalance)}
        value={
          amount.isZero() ? (
            t(translations.common.na)
          ) : (
            <AmountRenderer value={fromWei(newPoolBalanceA)} suffix={tokenA} />
          )
        }
        valueClassName={classNames(amount.gt(0) && 'text-primary-10')}
      />
      {amount.gt(0) && Number(newPoolBalanceB) > 0 && (
        <SimpleTableRow
          label=""
          value={
            <AmountRenderer
              value={fromWei(decimalic(newPoolBalanceB).toString())}
              suffix={BITCOIN}
              precision={BTC_RENDER_PRECISION}
            />
          }
          valueClassName={classNames(amount.gt(0) && 'text-primary-10')}
        />
      )}
      {!isInitialDeposit && Number(renderRewards) > 0 && (
        <SimpleTableRow
          label={t(pageTranslations.transferRewards)}
          value={
            <AmountRenderer
              value={renderRewards}
              suffix={SupportedTokens.sov}
              precision={TOKEN_RENDER_PRECISION}
            />
          }
        />
      )}
      <SimpleTableRow
        label={t(pageTranslations.weeklyRewardsEstimation)}
        value={
          amount.isZero() ? (
            t(translations.common.na)
          ) : (
            <AmountRenderer
              value={fromWei(weeklyRewardsEstimation)}
              suffix={BITCOIN}
              precision={BTC_RENDER_PRECISION}
            />
          )
        }
        valueClassName={classNames(amount.gt(0) && 'text-primary-10')}
      />
    </SimpleTable>
  );
};
