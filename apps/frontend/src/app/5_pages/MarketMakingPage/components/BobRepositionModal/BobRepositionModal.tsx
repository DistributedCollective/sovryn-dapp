import React, { FC, useCallback, useEffect, useMemo } from 'react';

import { t } from 'i18next';

import { CrocEnv, CrocReposition, priceToTick } from '@sovryn/sdex';
import {
  Button,
  ButtonStyle,
  ButtonType,
  Dialog,
  DialogBody,
  DialogHeader,
} from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { BOB_CHAIN_ID } from '../../../../../config/chains';

import { CurrentStatistics } from '../../../../2_molecules/CurrentStatistics/CurrentStatistics';
import { translations } from '../../../../../locales/i18n';
import { decimalic } from '../../../../../utils/math';
import { AmbientPosition } from '../AmbientMarketMaking/AmbientMarketMaking.types';
import { AmbientPositionBalance } from '../AmbientMarketMaking/components/AmbientPoolPositions/components/AmbientPositionBalance/AmbientPositionBalance';
import { AmbientLiquidityPool } from '../AmbientMarketMaking/utils/AmbientLiquidityPool';
import {
  MAXIMUM_PRICE,
  MINIMUM_PRICE,
} from '../BobDepositModal/BobDepositModal.constants';
import { BalancedRange } from '../BobDepositModal/components/PriceRange/components/BalancedRange/BalancedRange';
import { useDepositContext } from '../BobDepositModal/contexts/BobDepositModalContext';
import { useGetPoolInfo } from '../BobDepositModal/hooks/useGetPoolInfo';
import { mintArgsForReposition } from './BobRepositionModal.utils';
import { NewPoolStatistics } from './components/NewPoolStatistics/NewPoolStatistics';
import { useHandleSubmit } from './hooks/useHandleSubmit';

const pageTranslations = translations.bobMarketMakingPage.repositionModal;

type BobRepositionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  pool: AmbientLiquidityPool;
  position: AmbientPosition;
};

export const BobRepositionModal: FC<BobRepositionModalProps> = ({
  isOpen,
  onClose,
  pool,
  position,
}) => {
  const {
    rangeWidth,
    minimumPrice,
    maximumPrice,
    firstAssetValue,
    secondAssetValue,
    lowerBoundaryPercentage,
    upperBoundaryPercentage,
    setMinimumPrice,
    setMaximumPrice,
    setFirstAssetValue,
    setSecondAssetValue,
  } = useDepositContext();
  const { base, quote } = useMemo(() => pool, [pool]);

  const { spotPrice: currentPrice } = useGetPoolInfo(base, quote);

  const calculatePrice = useCallback(
    (percentage: number) =>
      Decimal.from(currentPrice)
        .add(Decimal.from(currentPrice).mul(Decimal.from(percentage).div(100)))
        .toNumber(),
    [currentPrice],
  );

  const lowTick = useMemo(() => priceToTick(minimumPrice), [minimumPrice]);
  const highTick = useMemo(() => priceToTick(maximumPrice), [maximumPrice]);

  const updatePrice = useCallback(
    (isMinimumPrice: boolean, value: number) => {
      if (value === 0) {
        return currentPrice;
      }

      if (value === 100) {
        return isMinimumPrice ? MINIMUM_PRICE : MAXIMUM_PRICE;
      }

      const priceDifference = Decimal.from(currentPrice).mul(
        Decimal.from(value).div(100),
      );

      if (isMinimumPrice) {
        const result = decimalic(currentPrice).sub(priceDifference);

        return result.lt(0) ? 0 : result.toNumber();
      }

      return decimalic(currentPrice).add(priceDifference).toNumber();
    },
    [currentPrice],
  );

  const handleSubmit = useHandleSubmit(base, quote, position, onClose);

  useEffect(() => {
    setMinimumPrice(updatePrice(true, rangeWidth));
    setMaximumPrice(updatePrice(false, rangeWidth));
  }, [rangeWidth, setMaximumPrice, setMinimumPrice, updatePrice]);

  useEffect(() => {
    setFirstAssetValue('0');
    setSecondAssetValue('0');
  }, [setFirstAssetValue, setSecondAssetValue, rangeWidth, lowTick, highTick]);

  useEffect(() => {
    const crocEnv = new CrocEnv(BOB_CHAIN_ID);

    if (position && crocEnv) {
      const pool = crocEnv.pool(
        position.base,
        position.quote,
        position.poolIdx,
      );

      const repo = new CrocReposition(pool, {
        liquidity: decimalic(position.concLiq).toString(),
        burn: [position.bidTick, position.askTick],
        mint: mintArgsForReposition(lowTick, highTick),
      });

      repo.postBalance().then(([base, quote]: [number, number]) => {
        setFirstAssetValue(base.toString());
        setSecondAssetValue(quote.toString());
      });
    }
  }, [
    position,
    setFirstAssetValue,
    setSecondAssetValue,
    minimumPrice,
    maximumPrice,
    lowTick,
    highTick,
  ]);

  useEffect(() => {
    const calculatedMinimumPrice = calculatePrice(lowerBoundaryPercentage);
    const calculatedMaximumPrice = calculatePrice(upperBoundaryPercentage);

    if (calculatedMinimumPrice) {
      setMinimumPrice(calculatedMinimumPrice);
    }

    if (calculatedMaximumPrice) {
      setMaximumPrice(calculatedMaximumPrice);
    }
  }, [
    calculatePrice,
    lowerBoundaryPercentage,
    upperBoundaryPercentage,
    setMinimumPrice,
    setMaximumPrice,
  ]);

  return (
    <>
      <Dialog disableFocusTrap isOpen={isOpen}>
        <DialogHeader title={t(pageTranslations.title)} onClose={onClose} />
        <DialogBody>
          <div className="bg-gray-90 p-4 rounded mb-4">
            <CurrentStatistics
              symbol={base}
              symbol2={quote}
              className="flex justify-between"
              label1={t(pageTranslations.currentBalance)}
              value1={
                <AmbientPositionBalance pool={pool} position={position} />
              }
            />
          </div>

          <BalancedRange pool={pool} />
          <NewPoolStatistics
            pool={pool}
            baseAmount={firstAssetValue}
            quoteAmount={secondAssetValue}
          />

          <Button
            type={ButtonType.submit}
            style={ButtonStyle.primary}
            text={t(translations.common.buttons.confirm)}
            className="w-full mt-6"
            onClick={handleSubmit}
            dataAttribute="reposition-liquidity-confirm-button"
          />
        </DialogBody>
      </Dialog>
    </>
  );
};
