import React, { FC, useEffect, useMemo, useState } from 'react';

import { BigNumber } from 'ethers';
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

import { CurrentStatistics } from '../../../../2_molecules/CurrentStatistics/CurrentStatistics';
import { useCrocContext } from '../../../../../contexts/CrocContext';
import { translations } from '../../../../../locales/i18n';
import { decimalic } from '../../../../../utils/math';
import { PoolPositionType } from '../../MarketMakingPage.types';
import { AmbientPosition } from '../AmbientMarketMaking/AmbientMarketMaking.types';
import { AmbientLiquidityPool } from '../AmbientMarketMaking/utils/AmbientLiquidityPool';
import { CurrentBalance } from '../PoolsTable/components/CurrentBalance/CurrentBalance';
import { AmountForm } from './components/AmountForm/AmountForm';
import { NewPoolStatistics } from './components/NewPoolStatistics/NewPoolStatistics';
import { useGetPoolInfo } from './hooks/useGetPoolInfo';
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
  const { poolTokens } = useGetPoolInfo(pool.base, pool.quote);

  const currentLiquidity = useMemo(
    () =>
      position.positionType === PoolPositionType.ambient
        ? position.ambientLiq
        : position.positionType === PoolPositionType.concentrated
        ? position.concLiq
        : 0,
    [position],
  );

  const isFullWithdrawal = useMemo(
    () => withdrawAmount.eq(depositedAmountBase),
    [withdrawAmount, depositedAmountBase],
  );

  const withdraw = useMemo(
    () =>
      isFullWithdrawal
        ? BigNumber.from(currentLiquidity.toString())
        : BigNumber.from(withdrawLiquidity.toString()),
    [withdrawLiquidity, currentLiquidity, isFullWithdrawal],
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
      Number(withdrawAmount) <= 0 ||
      !isValidAmount,
    [depositedAmountBase, withdrawAmount, isValidAmount],
  );

  useEffect(() => {
    const getDepositedAmounts = async () => {
      if (!croc || !poolTokens) {
        setDepositedAmountBase(Decimal.ZERO);
        return;
      }
      const pool = croc.pool(
        poolTokens.tokenA.tokenAddr,
        poolTokens.tokenB.tokenAddr,
      );
      const spotPrice = await pool.spotPrice();
      const sqrtPrice = Math.sqrt(spotPrice);
      setPoolPrice(sqrtPrice);
      const baseAmount = decimalic(currentLiquidity).mul(sqrtPrice);
      const quoteAmount = decimalic(currentLiquidity).div(sqrtPrice);
      const convertedBaseAmount = baseAmount.div(Math.pow(10, 18));
      const convertedQuoteAmount = quoteAmount.div(Math.pow(10, 18));
      setDepositedAmountBase(convertedBaseAmount);
      setDepositedAmountQuote(convertedQuoteAmount);
    };

    getDepositedAmounts();
  }, [croc, poolTokens, currentLiquidity]);

  useEffect(() => {
    if (withdrawAmount.gt(0) && isValidAmount) {
      const amount = withdrawAmount.div(poolPrice);
      const convertedAmount = amount.mul(Math.pow(10, 18));
      setWithdrawLiquidity(convertedAmount);
    }
  }, [withdrawAmount, poolPrice, isValidAmount]);

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
            // value1={
            //   <PoolsTableReturns
            //     className="text-xs font-semibold"
            //     pool={pool}
            //   />
            // }
            value2={
              <CurrentBalance
                pool={null}
                poolAmbient={pool}
                balanceA={depositedAmountBase}
                balanceB={depositedAmountQuote}
              />
            }
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
