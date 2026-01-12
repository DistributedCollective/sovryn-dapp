import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { BigNumber } from 'ethers';
import { t } from 'i18next';

import { Pool } from '@sovryn/sdk';
import {
  Button,
  ButtonStyle,
  ButtonType,
  Dialog,
  DialogBody,
  DialogHeader,
  ErrorBadge,
  ErrorLevel,
  HelperButton,
} from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { CurrentStatistics } from '../../../../2_molecules/CurrentStatistics/CurrentStatistics';
import { useCrocContext } from '../../../../../contexts/CrocContext';
import { useAccount } from '../../../../../hooks/useAccount';
import { useIsMounted } from '../../../../../hooks/useIsMounted';
import { useMaintenance } from '../../../../../hooks/useMaintenance';
import { translations } from '../../../../../locales/i18n';
import { bigNumberic, decimalic } from '../../../../../utils/math';
import { PoolPositionType } from '../../MarketMakingPage.types';
import { useGetPool } from '../../hooks/useGetPool';
import { AmbientPosition } from '../AmbientMarketMaking/AmbientMarketMaking.types';
import { AmbientPositionBalance } from '../AmbientMarketMaking/components/AmbientPoolPositions/components/AmbientPositionBalance/AmbientPositionBalance';
import { useAmbientPositionBalance } from '../AmbientMarketMaking/components/AmbientPoolPositions/hooks/useAmbientPositionBalance';
import { useGetLpTokenBalance } from '../AmbientMarketMaking/hooks/useGetLpTokenBalance';
import { useGetPoolInfo } from '../BobDepositModal/hooks/useGetPoolInfo';
import { AmountForm } from './components/AmountForm/AmountForm';
import { NewPoolStatistics } from './components/NewPoolStatistics/NewPoolStatistics';
import { useGetTokenDecimals } from './hooks/useGetTokenDecimals';
import { useHandleSubmit } from './hooks/useHandleSubmit';

const pageTranslations = translations.bobMarketMakingPage.withdrawModal;

type BobWithdrawModalProps = {
  isOpen: boolean;
  onClose: () => void;
  pool: Pool;
  position: AmbientPosition;
};

export const BobWithdrawModal: FC<BobWithdrawModalProps> = ({
  isOpen,
  onClose,
  pool,
  position,
}) => {
  const { account } = useAccount();
  const { croc } = useCrocContext();
  const isMounted = useIsMounted();
  const { checkMaintenance, States } = useMaintenance();
  const withdrawLocked = checkMaintenance(States.BOB_WITHDRAW_LIQUIDITY);
  const lpTokenBalance = useGetLpTokenBalance(pool);

  const [depositedAmountBase, setDepositedAmountBase] = useState(Decimal.ZERO);
  const [depositedAmountQuote, setDepositedAmountQuote] = useState(
    Decimal.ZERO,
  );
  const [totalLiquidity, setTotalLiquidity] = useState('0');
  const [withdrawAmount, setWithdrawAmount] = useState(Decimal.ZERO);
  const [secondaryWithdrawAmount, setSecondaryWithdrawAmount] = useState(
    Decimal.ZERO,
  );
  const { spotPrice: price, price: displayPrice } = useGetPoolInfo(pool);
  const [sqrtPrice, setSqrtPrice] = useState(0);
  const [withdrawLiquidity, setWithdrawLiquidity] = useState(Decimal.ZERO);
  const { poolTokens } = useGetPool(pool);
  const { baseTokenDecimals, quoteTokenDecimals } = useGetTokenDecimals(
    poolTokens?.tokenA,
    poolTokens?.tokenB,
  );

  const updatedPosition = useMemo(
    () => ({ ...position, ambientLiq: lpTokenBalance }),
    [position, lpTokenBalance],
  );

  const deposits = useAmbientPositionBalance(
    pool,
    updatedPosition,
    displayPrice,
  );

  const updateLiquidity = useCallback(async () => {
    try {
      if (!croc || !position) {
        return;
      }

      const pos = croc.positions(
        position.base,
        position.quote,
        account,
        pool.extra.poolIdx,
      );

      let liquidity;

      if (position.positionType === PoolPositionType.ambient) {
        if (pool.extra.lpToken) {
          liquidity = BigNumber.from(lpTokenBalance);
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
  }, [croc, position, account, lpTokenBalance, pool]);

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

  const handleSubmit = useHandleSubmit(withdraw, pool, position, onClose);

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
      !isValidAmount ||
      withdrawLocked,
    [
      depositedAmountBase,
      withdrawAmount,
      isValidAmount,
      secondaryWithdrawAmount,
      withdrawLocked,
    ],
  );

  const handleAmbientPosition = useCallback(() => {
    const amount = withdrawAmount.div(sqrtPrice);
    const convertedAmount = amount.mul(Math.pow(10, pool.base.decimals));
    setWithdrawLiquidity(convertedAmount);
  }, [withdrawAmount, sqrtPrice, pool.base.decimals]);

  const handleConcentratedPosition = useCallback(() => {
    if (withdrawAmount.eq(0) && secondaryWithdrawAmount.gt(0)) {
      const percentage = secondaryWithdrawAmount
        .mul(100)
        .div(depositedAmountQuote)
        .toNumber();
      const percentageWithDecimal = Number((percentage * 100).toFixed(0));

      const withdraw = bigNumberic(totalLiquidity)
        .mul(percentageWithDecimal)
        .div(1e4);
      setWithdrawLiquidity(decimalic(withdraw.toString()));
    } else {
      const percentage = withdrawAmount
        .mul(100)
        .div(depositedAmountBase)
        .toNumber();
      const percentageWithDecimal = Number((percentage * 100).toFixed(0));

      const withdraw = bigNumberic(totalLiquidity)
        .mul(percentageWithDecimal)
        .div(1e4);
      setWithdrawLiquidity(decimalic(withdraw.toString()));
    }
  }, [
    withdrawAmount,
    depositedAmountBase,
    totalLiquidity,
    secondaryWithdrawAmount,
    depositedAmountQuote,
  ]);

  useEffect(() => {
    if (!isValidAmount) {
      return;
    }

    if (position.positionType === PoolPositionType.ambient) {
      handleAmbientPosition();
    } else {
      handleConcentratedPosition();
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
  ]);

  useEffect(() => {
    if (position && croc && isMounted()) {
      updateLiquidity();
    }
  }, [position, croc, updateLiquidity, isMounted]);

  useEffect(() => {
    if (deposits && price) {
      setDepositedAmountBase(
        decimalic(deposits?.positionLiqBase || '0').toUnits(pool.base.decimals),
      );
      setDepositedAmountQuote(
        decimalic(deposits?.positionLiqQuote || '0').toUnits(
          pool.quote.decimals,
        ),
      );
      setSqrtPrice(Math.sqrt(price));
    }
  }, [deposits, pool.base.decimals, pool.quote.decimals, price]);

  return (
    <Dialog disableFocusTrap isOpen={isOpen}>
      <DialogHeader title={t(pageTranslations.title)} onClose={onClose} />
      <DialogBody>
        <div className="bg-gray-90 p-4 rounded">
          <CurrentStatistics
            symbol={pool.base.symbol}
            symbol2={pool.quote.symbol}
            label1={
              <>
                {t(pageTranslations.returnRate)}
                <div className="inline-block h-full ml-1">
                  <div className="flex-row justify-end h-full">
                    <HelperButton
                      content={
                        <>
                          {t(
                            translations.ambientMarketMaking.positionsTable
                              .aprInfo,
                          )}
                        </>
                      }
                    />
                  </div>
                </div>
              </>
            }
            label2={t(pageTranslations.currentBalance)}
            value1={
              <AmountRenderer
                value={Number(position.aprEst) * 100}
                suffix="%"
              />
            }
            value2={
              <AmbientPositionBalance
                pool={pool}
                position={position}
                priceOverride={displayPrice}
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
          position={position}
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
