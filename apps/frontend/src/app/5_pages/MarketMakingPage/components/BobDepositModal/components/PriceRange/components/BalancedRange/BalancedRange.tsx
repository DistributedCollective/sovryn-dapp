import React, { FC, useCallback, useMemo } from 'react';

import { t } from 'i18next';

import {
  Button,
  ButtonStyle,
  SimpleTable,
  SimpleTableRow,
  Slider,
} from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { AmountRenderer } from '../../../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { translations } from '../../../../../../../../../locales/i18n';
import { decimalic } from '../../../../../../../../../utils/math';
import { POOL_ASSET_A, POOL_ASSET_B } from '../../../../BobDepositModal';
import {
  MAXIMUM_PRICE,
  MINIMUM_PRICE,
} from '../../../../BobDepositModal.constants';
import { useDepositContext } from '../../../../contexts/BobDepositModalContext';
import { useGetPoolInfo } from '../../../../hooks/useGetPoolInfo';
import { BUTTON_OPTIONS, INFINITE } from './BalancedRange.constants';
import { renderRangeWidthClassName } from './BalancedRange.utils';

export const BalancedRange: FC = () => {
  const { rangeWidth, setRangeWidth } = useDepositContext();

  const isInfiniteRange = useMemo(() => rangeWidth === 100, [rangeWidth]);

  const { price: currentPrice } = useGetPoolInfo(POOL_ASSET_A, POOL_ASSET_B);

  const priceDifference = useMemo(
    () => Decimal.from(currentPrice).mul(Decimal.from(rangeWidth).div(100)),
    [currentPrice, rangeWidth],
  );

  const minimumPrice = useMemo(() => {
    if (rangeWidth === 0) {
      return currentPrice;
    }

    if (rangeWidth === 100) {
      return MINIMUM_PRICE;
    }

    const result = decimalic(currentPrice).sub(priceDifference);

    return result.lt(0) ? 0 : result.toNumber();
  }, [currentPrice, priceDifference, rangeWidth]);

  const maximumPrice = useMemo(() => {
    if (rangeWidth === 0) {
      return currentPrice;
    }

    if (rangeWidth === 100) {
      return MAXIMUM_PRICE;
    }

    return decimalic(currentPrice).add(priceDifference).toNumber();
  }, [currentPrice, priceDifference, rangeWidth]);

  const onRangeChange = useCallback(
    (value: number) => {
      setRangeWidth(value);
    },
    [setRangeWidth],
  );

  return (
    <>
      <div className="flex items-center flex-col">
        <div className="text-xs font-medium text-gray-30">
          {t(translations.bobMarketMakingPage.depositModal.rangeWidth)}
        </div>
        <div className="bg-gray-80 rounded text-gray-10 text-sm font-medium px-12 py-2 mt-2">
          {!isInfiniteRange ? `~ ${rangeWidth}%` : INFINITE}
        </div>
      </div>

      <div className="flex justify-center mt-4">
        {BUTTON_OPTIONS.map(item => (
          <Button
            text={item === 100 ? INFINITE : `${item}%`}
            key={item}
            onClick={() => onRangeChange(item)}
            style={ButtonStyle.secondary}
            className={renderRangeWidthClassName(rangeWidth, item)}
          />
        ))}
      </div>

      <div className="px-4 mt-4">
        <Slider onChange={onRangeChange} value={rangeWidth} />
      </div>

      <SimpleTable className="mt-12">
        <SimpleTableRow
          label={t(translations.bobMarketMakingPage.depositModal.minPrice)}
          value={<AmountRenderer value={minimumPrice} suffix={POOL_ASSET_B} />}
        />
        <SimpleTableRow
          label={t(translations.bobMarketMakingPage.depositModal.maxPrice)}
          value={<AmountRenderer value={maximumPrice} suffix={POOL_ASSET_B} />}
        />
      </SimpleTable>
    </>
  );
};
