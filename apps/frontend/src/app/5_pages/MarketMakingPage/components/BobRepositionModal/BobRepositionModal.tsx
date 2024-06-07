import React, { FC, useEffect, useMemo } from 'react';

import { t } from 'i18next';

import {
  Button,
  ButtonStyle,
  ButtonType,
  Dialog,
  DialogBody,
  DialogHeader,
} from '@sovryn/ui';

import { CurrentStatistics } from '../../../../2_molecules/CurrentStatistics/CurrentStatistics';
import { translations } from '../../../../../locales/i18n';
import { AmbientPosition } from '../AmbientMarketMaking/AmbientMarketMaking.types';
import {
  adjustPriceByPercentage,
  calculateBoundedPrice,
} from '../AmbientMarketMaking/components/AmbientPoolPositions/AmbientPoolPositions.utils';
import { AmbientPositionBalance } from '../AmbientMarketMaking/components/AmbientPoolPositions/components/AmbientPositionBalance/AmbientPositionBalance';
import { AmbientLiquidityPool } from '../AmbientMarketMaking/utils/AmbientLiquidityPool';
import { BalancedRange } from '../BobDepositModal/components/PriceRange/components/BalancedRange/BalancedRange';
import { useDepositContext } from '../BobDepositModal/contexts/BobDepositModalContext';
import { useGetPoolInfo } from '../BobDepositModal/hooks/useGetPoolInfo';
import { NewPoolStatistics } from './components/NewPoolStatistics/NewPoolStatistics';
import { useGetBalances } from './hooks/useGetBalances';
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

  const { spotPrice: currentPrice } = useGetPoolInfo(pool.base, pool.quote);

  const handleSubmit = useHandleSubmit(base, quote, position, onClose);

  const [baseValue, quoteValue] = useGetBalances(pool, position, rangeWidth);

  useEffect(() => {
    setFirstAssetValue(baseValue);
    setSecondAssetValue(quoteValue);
  }, [baseValue, quoteValue, setFirstAssetValue, setSecondAssetValue]);

  useEffect(() => {
    setMinimumPrice(calculateBoundedPrice(true, rangeWidth, currentPrice));
    setMaximumPrice(calculateBoundedPrice(false, rangeWidth, currentPrice));
  }, [rangeWidth, setMaximumPrice, setMinimumPrice, currentPrice]);

  useEffect(() => {
    const calculatedMinimumPrice = adjustPriceByPercentage(
      lowerBoundaryPercentage,
      currentPrice,
    );
    const calculatedMaximumPrice = adjustPriceByPercentage(
      upperBoundaryPercentage,
      currentPrice,
    );

    if (calculatedMinimumPrice) {
      setMinimumPrice(calculatedMinimumPrice);
    }

    if (calculatedMaximumPrice) {
      setMaximumPrice(calculatedMaximumPrice);
    }
  }, [
    currentPrice,
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
