import React, { FC, useCallback, useMemo, useState } from 'react';

import { t } from 'i18next';

import { Bin } from '@sovryn/joe-sdk-v2';
import {
  AmountInput,
  Button,
  ButtonStyle,
  ErrorBadge,
  ErrorLevel,
  FormGroup,
} from '@sovryn/ui';

import { useAmountInput } from '../../../../../hooks/useAmountInput';
import { translations } from '../../../../../locales/i18n';
import { LiquidityBookPool } from '../../LiquidityBookPage.types';
import { MAX_BIN_RANGE } from './constants';

type LiquidityPriceFormProps = {
  pool: LiquidityBookPool;
  min: number;
  max: number;
  onChange: (min: number, max: number) => void;
};

enum PriceType {
  range,
  radius,
}

export const LiquidityPriceForm: FC<LiquidityPriceFormProps> = ({
  pool,
  min,
  max,
  onChange,
}) => {
  const baseSymbol = pool.pair[0].symbol!;
  const quoteSymbol = pool.pair[1].symbol!;

  const [type, setType] = useState(PriceType.range);
  const [targetPrice, setTargetPrice] = useAmountInput(
    Bin.getPriceFromId(pool.activeBinId, pool.binStep).toString(),
  );
  const [radius, setRadius] = useState(Math.round((max - min) / 2).toString());

  const minPrice = useMemo(
    () => Bin.getPriceFromId(min, pool.binStep).toString(),
    [min, pool.binStep],
  );
  const maxPrice = useMemo(
    () => Bin.getPriceFromId(max, pool.binStep).toString(),
    [max, pool.binStep],
  );

  const handleMinChange = useCallback(
    (value: string) => {
      const newMin = Bin.getIdFromPrice(Number(value), pool.binStep);
      if (newMin <= max) {
        onChange(newMin, max);
      }
    },
    [max, onChange, pool.binStep],
  );
  const handleMaxChange = useCallback(
    (value: string) => {
      const newMax = Bin.getIdFromPrice(Number(value), pool.binStep);
      if (newMax >= min) {
        onChange(min, newMax);
      }
    },
    [min, onChange, pool.binStep],
  );
  const handleSetRewardedRange = useCallback(() => {
    onChange(pool.activeBinId, pool.activeBinId);
    setRadius('1');
  }, [onChange, pool.activeBinId]);

  const handleTargetPrice = useCallback(
    (value: string) => {
      const price = Number(value);
      const targetBin = Bin.getIdFromPrice(Number(targetPrice), pool.binStep);
      const newMin = targetBin - Number(radius);
      const newMax = targetBin + Number(radius);
      setRadius(radius);
      onChange(newMin, newMax);
      setTargetPrice(price.toString());
    },
    [onChange, pool.binStep, radius, setTargetPrice, targetPrice],
  );

  const handleRadius = useCallback(
    (value: string) => {
      const radius = Math.round(Math.max(Number(value), 0));
      const targetBin = Bin.getIdFromPrice(Number(targetPrice), pool.binStep);
      const newMin = targetBin - radius;
      const newMax = targetBin + radius;
      setRadius(radius.toString());
      onChange(newMin, newMax);
    },
    [onChange, pool.binStep, targetPrice],
  );

  const isRangeInvalid = useMemo(() => max - min >= MAX_BIN_RANGE, [max, min]);

  return (
    <>
      <div className="flex justify-end items-center gap-4 my-4">
        <Button
          onClick={() => setType(PriceType.range)}
          style={
            type === PriceType.range
              ? ButtonStyle.primary
              : ButtonStyle.secondary
          }
          text={t(translations.liquidityBookDeposit.types.range)}
        />
        <Button
          onClick={() => setType(PriceType.radius)}
          style={
            type === PriceType.radius
              ? ButtonStyle.primary
              : ButtonStyle.secondary
          }
          text={t(translations.liquidityBookDeposit.types.radius)}
        />
      </div>
      <h2>{t(translations.liquidityBookDeposit.price)}</h2>
      {type === PriceType.range ? (
        <>
          <div className="flex flex-row justify-between space-x-4">
            <FormGroup label={t(translations.liquidityBookDeposit.minPrice)}>
              <AmountInput
                value={minPrice}
                onChangeText={handleMinChange}
                unit={t(translations.liquidityBookDeposit.priceFormat, {
                  quote: quoteSymbol,
                  base: baseSymbol,
                })}
              />
            </FormGroup>
            <FormGroup label={t(translations.liquidityBookDeposit.maxPrice)}>
              <AmountInput
                value={maxPrice}
                onChangeText={handleMaxChange}
                unit={t(translations.liquidityBookDeposit.priceFormat, {
                  quote: quoteSymbol,
                  base: baseSymbol,
                })}
              />
            </FormGroup>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-row justify-between space-x-4">
            <FormGroup label={t(translations.liquidityBookDeposit.targetPrice)}>
              <AmountInput
                value={targetPrice}
                onChangeText={handleTargetPrice}
                unit={t(translations.liquidityBookDeposit.priceFormat, {
                  quote: quoteSymbol,
                  base: baseSymbol,
                })}
              />
            </FormGroup>
            <FormGroup label={t(translations.liquidityBookDeposit.radius)}>
              <AmountInput value={radius} onChangeText={handleRadius} />
            </FormGroup>
          </div>
          <div className="flex flex-row justify-between space-x-4 mt-4">
            <FormGroup label={t(translations.liquidityBookDeposit.rangeMin)}>
              <AmountInput
                value={minPrice}
                readOnly
                unit={t(translations.liquidityBookDeposit.priceFormat, {
                  quote: quoteSymbol,
                  base: baseSymbol,
                })}
              />
            </FormGroup>
            <FormGroup label={t(translations.liquidityBookDeposit.rangeMax)}>
              <AmountInput
                value={maxPrice}
                readOnly
                unit={t(translations.liquidityBookDeposit.priceFormat, {
                  quote: quoteSymbol,
                  base: baseSymbol,
                })}
              />
            </FormGroup>
          </div>
        </>
      )}

      {isRangeInvalid && (
        <ErrorBadge
          level={ErrorLevel.Critical}
          message={t(translations.liquidityBookDeposit.errors.invalidRange)}
          dataAttribute="bob-deposit-base-amount-error"
        />
      )}

      <div className="mt-4 flex flex-row justify-end">
        <Button
          onClick={handleSetRewardedRange}
          text={t(translations.liquidityBookDeposit.setRewardedRange)}
          style={ButtonStyle.ghost}
        />
      </div>
    </>
  );
};
