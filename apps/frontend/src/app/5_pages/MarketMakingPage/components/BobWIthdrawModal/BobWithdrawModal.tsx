import React, { FC, useEffect, useMemo, useState } from 'react';

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
import { usePoolSpotPrice } from '../AmbientMarketMaking/components/AmbientPoolPositions/hooks/usePoolSpotPrice';
import { AmbientLiquidityPool } from '../AmbientMarketMaking/utils/AmbientLiquidityPool';
import { AmountForm } from './components/AmountForm/AmountForm';
import { NewPoolStatistics } from './components/NewPoolStatistics/NewPoolStatistics';
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
  const { value: price } = usePoolSpotPrice(pool.base, pool.quote);

  const deposits = useAmbientPositionBalance(pool, position);

  const [baseTokenDecimals, setBaseTokenDecimals] = useState(0);
  const [quoteTokenDecimals, setQuoteTokenDecimals] = useState(0);

  const [depositedAmountBase, setDepositedAmountBase] = useState(Decimal.ZERO);
  const [depositedAmountQuote, setDepositedAmountQuote] = useState(
    Decimal.ZERO,
  );
  const [withdrawAmount, setWithdrawAmount] = useState(Decimal.ZERO);
  const [secondaryWithdrawAmount, setSecondaryWithdrawAmount] = useState(
    Decimal.ZERO,
  );
  const [withdrawLiquidity, setWithdrawLiquidity] = useState(Decimal.ZERO);
  const [poolPrice, setPoolPrice] = useState(0);
  const { poolTokens } = useGetPool(pool.base, pool.quote);

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
        ? bigNumberic(deposits?.positionLiq.toString() || '0')
        : bigNumberic(withdrawLiquidity.toString() || '0'),
    [withdrawLiquidity, isFullWithdrawal, deposits],
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

  useEffect(() => {
    const getDepositedAmounts = async () => {
      if (!croc || !poolTokens || !price) {
        setDepositedAmountBase(Decimal.ZERO);
        return;
      }

      const baseTokenDecimals = await poolTokens.tokenA.decimals;
      const quoteTokenDecimals = await poolTokens.tokenB.decimals;
      setBaseTokenDecimals(baseTokenDecimals);
      setQuoteTokenDecimals(quoteTokenDecimals);

      const sqrtPrice = Math.sqrt(price);
      setPoolPrice(sqrtPrice);
    };

    getDepositedAmounts();
  }, [croc, poolTokens, price]);

  useEffect(() => {
    if (withdrawAmount.gt(0) && isValidAmount && depositedAmountQuote.gt(0)) {
      if (position.positionType === PoolPositionType.ambient) {
        const amount = withdrawAmount.div(poolPrice);
        const convertedAmount = amount.mul(Math.pow(10, baseTokenDecimals));
        setWithdrawLiquidity(convertedAmount);
      } else if (position.positionType === PoolPositionType.concentrated) {
        const positionLiquidity = bigNumberic(
          deposits?.positionLiq.toString() || '0',
        );
        const percentage = withdrawAmount
          .mul(100)
          .div(depositedAmountBase)
          .toNumber();
        const percentageWithDecimal = Number(percentage.toFixed(2)) * 100;
        const withdraw = bigNumberic(
          positionLiquidity.mul(percentageWithDecimal).div(1e4),
        );
        setWithdrawLiquidity(decimalic(withdraw.toString()));
      }
    }

    if (
      secondaryWithdrawAmount.gt(0) &&
      isValidAmount &&
      depositedAmountBase.eq(0)
    ) {
      const amount = secondaryWithdrawAmount.mul(poolPrice);
      const convertedAmount = amount.mul(Math.pow(10, quoteTokenDecimals));
      setWithdrawLiquidity(convertedAmount);
    }
  }, [
    depositedAmountBase,
    withdrawAmount,
    isValidAmount,
    depositedAmountQuote,
    poolPrice,
    baseTokenDecimals,
    quoteTokenDecimals,
    position,
    deposits,
    secondaryWithdrawAmount,
  ]);

  useEffect(() => {
    if (deposits) {
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
    }
  }, [deposits, baseTokenDecimals, quoteTokenDecimals]);

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
