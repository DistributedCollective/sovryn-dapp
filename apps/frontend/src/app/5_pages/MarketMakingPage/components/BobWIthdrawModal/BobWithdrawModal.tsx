import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { t } from 'i18next';

import {
  Button,
  ButtonStyle,
  ButtonType,
  Dialog,
  DialogBody,
  DialogHeader,
  ErrorBadge,
  ErrorLevel,
} from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { CurrentStatistics } from '../../../../2_molecules/CurrentStatistics/CurrentStatistics';
import { useCrocContext } from '../../../../../contexts/CrocContext';
import { translations } from '../../../../../locales/i18n';
import { bigNumberic, decimalic } from '../../../../../utils/math';
import { PoolPositionType } from '../../MarketMakingPage.types';
import { useGetPool } from '../../hooks/useGetPool';
import { AmbientPosition } from '../AmbientMarketMaking/AmbientMarketMaking.types';
import { AmbientPositionBalance } from '../AmbientMarketMaking/components/AmbientPoolPositions/components/AmbientPositionBalance/AmbientPositionBalance';
import { useAmbientPositionBalance } from '../AmbientMarketMaking/components/AmbientPoolPositions/hooks/useAmbientPositionBalance';
import { AmbientLiquidityPool } from '../AmbientMarketMaking/utils/AmbientLiquidityPool';
import { useGetPoolInfo } from '../BobDepositModal/hooks/useGetPoolInfo';
import { AmountForm } from './components/AmountForm/AmountForm';
import { NewPoolStatistics } from './components/NewPoolStatistics/NewPoolStatistics';
import { useGetTokenDecimals } from './hooks/useGetTokenDecimals';
import { useHandleSubmit } from './hooks/useHandleSubmit';

const pageTranslations = translations.bobMarketMakingPage.withdrawModal;

type BobWithdrawModalProps = {
  isOpen: boolean;
  onClose: () => void;
  pool: AmbientLiquidityPool;
  position: AmbientPosition;
};

export const BobWithdrawModal: FC<BobWithdrawModalProps> = ({
  isOpen,
  onClose,
  pool,
  position,
}) => {
  const { croc } = useCrocContext();
  const deposits = useAmbientPositionBalance(pool, position);

  const [depositedAmountBase, setDepositedAmountBase] = useState(Decimal.ZERO);
  const [depositedAmountQuote, setDepositedAmountQuote] = useState(
    Decimal.ZERO,
  );
  const [totalLiquidity, setTotalLiquidity] = useState('0');
  const [withdrawAmount, setWithdrawAmount] = useState(Decimal.ZERO);
  const [secondaryWithdrawAmount, setSecondaryWithdrawAmount] = useState(
    Decimal.ZERO,
  );
  const { spotPrice: price } = useGetPoolInfo(pool.base, pool.quote);
  const [sqrtPrice, setSqrtPrice] = useState(0);
  const [withdrawLiquidity, setWithdrawLiquidity] = useState(Decimal.ZERO);
  const { poolTokens } = useGetPool(pool.base, pool.quote);
  const { baseTokenDecimals, quoteTokenDecimals } = useGetTokenDecimals(
    poolTokens?.tokenA,
    poolTokens?.tokenB,
  );

  const updateLiquidity = useCallback(async () => {
    try {
      if (!croc || !position) return;
      const pos = croc.positions(
        position.base,
        position.quote,
        position.user,
        pool.poolIndex,
      );

      let liquidity;

      if (position.positionType === PoolPositionType.ambient) {
        if (pool.lpTokenAddress) {
          const wallet = await croc
            .token(pool.lpTokenAddress)
            .wallet(position.user);
          liquidity = wallet;
        } else {
          liquidity = (await pos.queryAmbient()).seeds;
        }
      } else {
        liquidity = (
          await pos.queryRangePos(position.bidTick, position.askTick)
        ).liq;
      }

      setTotalLiquidity(liquidity.toString());
    } catch (error) {
      console.error(error);
    }
  }, [croc, pool.lpTokenAddress, pool.poolIndex, position]);

  const isFullWithdrawal = useMemo(
    () =>
      withdrawAmount.eq(depositedAmountBase) &&
      secondaryWithdrawAmount.eq(depositedAmountQuote),
    [
      withdrawAmount,
      depositedAmountBase,
      secondaryWithdrawAmount,
      depositedAmountQuote,
    ],
  );

  const withdraw = useMemo(
    () =>
      isFullWithdrawal
        ? bigNumberic(totalLiquidity)
        : bigNumberic((withdrawLiquidity.toString() || '0').split('.')[0]),
    [withdrawLiquidity, isFullWithdrawal, totalLiquidity],
  );

  const handleSubmit = useHandleSubmit(
    withdraw,
    isFullWithdrawal,
    pool,
    position,
    onClose,
  );

  const isValidAmount = useMemo(
    () => Number(withdrawAmount) <= Number(depositedAmountBase),
    [withdrawAmount, depositedAmountBase],
  );

  const isSubmitDisabled = useMemo(
    () =>
      !depositedAmountBase ||
      !withdrawAmount ||
      !secondaryWithdrawAmount ||
      (Number(withdrawAmount) === 0 && Number(secondaryWithdrawAmount) === 0) ||
      !isValidAmount,
    [
      depositedAmountBase,
      withdrawAmount,
      isValidAmount,
      secondaryWithdrawAmount,
    ],
  );

  const handleAmbientPosition = useCallback(() => {
    const amount = withdrawAmount.div(sqrtPrice);
    const convertedAmount = amount.mul(Math.pow(10, baseTokenDecimals));
    setWithdrawLiquidity(convertedAmount);
  }, [withdrawAmount, sqrtPrice, baseTokenDecimals]);

  const handleConcentratedPosition = useCallback(() => {
    const percentage = withdrawAmount
      .mul(100)
      .div(depositedAmountBase)
      .toNumber();
    const percentageWithDecimal = Number(percentage.toFixed(2)) * 100;
    const withdraw = bigNumberic(totalLiquidity)
      .mul(percentageWithDecimal)
      .div(1e4);

    setWithdrawLiquidity(decimalic(withdraw.toString()));
  }, [withdrawAmount, depositedAmountBase, totalLiquidity]);

  const handleSecondaryWithdraw = useCallback(() => {
    const amount = secondaryWithdrawAmount.mul(sqrtPrice);
    const convertedAmount = amount.mul(Math.pow(10, quoteTokenDecimals));
    setWithdrawLiquidity(convertedAmount);
  }, [secondaryWithdrawAmount, sqrtPrice, quoteTokenDecimals]);

  useEffect(() => {
    if (!isValidAmount) {
      return;
    }

    if (
      withdrawAmount.gt(0) &&
      depositedAmountQuote.gt(0) &&
      baseTokenDecimals
    ) {
      if (position.positionType === PoolPositionType.ambient) {
        handleAmbientPosition();
      } else if (position.positionType === PoolPositionType.concentrated) {
        handleConcentratedPosition();
      }
    }

    if (
      secondaryWithdrawAmount.gt(0) &&
      depositedAmountBase.eq(0) &&
      quoteTokenDecimals
    ) {
      handleSecondaryWithdraw();
    }
  }, [
    depositedAmountBase,
    withdrawAmount,
    isValidAmount,
    depositedAmountQuote,
    sqrtPrice,
    baseTokenDecimals,
    quoteTokenDecimals,
    position,
    deposits,
    secondaryWithdrawAmount,
    handleAmbientPosition,
    handleConcentratedPosition,
    handleSecondaryWithdraw,
  ]);

  useEffect(() => {
    if (position && croc) {
      updateLiquidity();
    }
  }, [position, croc, updateLiquidity]);

  useEffect(() => {
    if (deposits && price) {
      setDepositedAmountBase(
        decimalic(deposits?.positionLiqBase || '0').div(
          Math.pow(10, baseTokenDecimals),
        ),
      );
      setDepositedAmountQuote(
        decimalic(deposits?.positionLiqQuote || '0').div(
          Math.pow(10, quoteTokenDecimals),
        ),
      );
      setSqrtPrice(Math.sqrt(price));
    }
  }, [deposits, baseTokenDecimals, quoteTokenDecimals, price]);

  return (
    <Dialog disableFocusTrap isOpen={isOpen}>
      <DialogHeader title={t(pageTranslations.title)} onClose={onClose} />
      <DialogBody>
        <div className="bg-gray-90 p-4 rounded">
          <CurrentStatistics
            symbol={pool.base}
            symbol2={pool.quote}
            label1={t(pageTranslations.returnRate)}
            label2={t(pageTranslations.currentBalance)}
            value1={<AmountRenderer value={position.aprEst * 100} suffix="%" />}
            value2={<AmbientPositionBalance pool={pool} position={position} />}
          />
        </div>

        <AmountForm
          primaryTokenBalance={depositedAmountBase}
          secondaryTokenBalance={depositedAmountQuote}
          withdrawAmount={withdrawAmount}
          secondaryWithdrawAmount={secondaryWithdrawAmount}
          setWithdrawAmount={setWithdrawAmount}
          setSecondaryWithdrawAmount={setSecondaryWithdrawAmount}
          pool={pool}
        />

        {!isValidAmount && (
          <ErrorBadge
            level={ErrorLevel.Critical}
            message={t(pageTranslations.form.invalidAmountError)}
            dataAttribute="withdraw-liquidity-from-amount-error"
          />
        )}

        <NewPoolStatistics
          baseAmount={depositedAmountBase.sub(withdrawAmount)}
          quoteAmount={depositedAmountQuote.sub(secondaryWithdrawAmount)}
          pool={pool}
        />

        <Button
          type={ButtonType.submit}
          style={ButtonStyle.primary}
          text={t(translations.common.buttons.confirm)}
          className="w-full mt-6"
          onClick={handleSubmit}
          dataAttribute="withdraw-liquidity-confirm-button"
          disabled={isSubmitDisabled}
        />
      </DialogBody>
    </Dialog>
  );
};
