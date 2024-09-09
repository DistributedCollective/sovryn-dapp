import React, { FC, useCallback, useMemo, useState } from 'react';

import { t } from 'i18next';

import { LiquidityDistribution } from '@sovryn/joe-sdk-v2';
import {
  AmountInput,
  Button,
  ButtonStyle,
  ErrorBadge,
  ErrorLevel,
  FormGroup,
} from '@sovryn/ui';

import { AssetRenderer } from '../../../../2_molecules/AssetRenderer/AssetRenderer';
import { CurrentStatistics } from '../../../../2_molecules/CurrentStatistics/CurrentStatistics';
import { MaxButton } from '../../../../2_molecules/MaxButton/MaxButton';
import { useAmountInput } from '../../../../../hooks/useAmountInput';
import { useAssetBalance } from '../../../../../hooks/useAssetBalance';
import { useCurrentChain } from '../../../../../hooks/useChainStore';
import { translations } from '../../../../../locales/i18n';
import { decimalic } from '../../../../../utils/math';
import { LiquidityBookPool } from '../../LiquidityBookPage.types';
import { useHandleLiquidity } from '../../hooks/useHandleLiquidity';
import { LiquidityPriceForm } from './LiquidityPriceForm';

type ContentProps = {
  pool: LiquidityBookPool;
  onClose: () => void;
};

export const Content: FC<ContentProps> = ({ pool, onClose }) => {
  const chainId = useCurrentChain();
  const baseSymbol = pool.pair[0].symbol!;
  const quoteSymbol = pool.pair[1].symbol!;

  const { balance: baseBalance } = useAssetBalance(baseSymbol, chainId);
  const { balance: quoteBalance } = useAssetBalance(quoteSymbol, chainId);

  const [baseAmount, onBaseAmountChange] = useAmountInput('');
  const [quoteAmount, onQuoteAmountChange] = useAmountInput('');

  const [shape, setShape] = useState<LiquidityDistribution>(
    LiquidityDistribution.SPOT,
  );

  const [min, setMin] = useState<number>(pool.activeBinId - 25);
  const [max, setMax] = useState<number>(pool.activeBinId + 25);

  const handleMaxBase = useCallback(
    () => onBaseAmountChange(baseBalance.toString()),
    [baseBalance, onBaseAmountChange],
  );

  const handleMaxQuote = useCallback(
    () => onQuoteAmountChange(quoteBalance.toString()),
    [onQuoteAmountChange, quoteBalance],
  );

  const handleRange = useCallback((min: number, max: number) => {
    setMin(min);
    setMax(max);
  }, []);

  const isBaseInvalid = useMemo(
    () => decimalic(baseAmount).gt(baseBalance),
    [baseAmount, baseBalance],
  );
  const isQuoteInvalid = useMemo(
    () => decimalic(quoteAmount).gt(quoteBalance),
    [quoteAmount, quoteBalance],
  );

  const { handleDeposit } = useHandleLiquidity(pool);

  const handleSubmit = useCallback(
    () => handleDeposit(baseAmount, quoteAmount, shape, min, max, onClose),
    [baseAmount, handleDeposit, max, min, onClose, quoteAmount, shape],
  );

  const submitDisabled = useMemo(() => {
    if (isBaseInvalid || isQuoteInvalid) {
      return true;
    }
    if (max - min > 60) {
      return true;
    }
    if (decimalic(baseAmount).isZero() || decimalic(quoteAmount).isZero()) {
      return true;
    }
  }, [baseAmount, isBaseInvalid, isQuoteInvalid, max, min, quoteAmount]);

  return (
    <>
      <div className="bg-gray-90 p-4 rounded">
        <CurrentStatistics
          symbol={baseSymbol}
          symbol2={quoteSymbol}
          className="flex justify-between"
        />
      </div>

      <FormGroup
        label={
          <div className="flex justify-end w-full">
            <MaxButton
              value={baseBalance}
              token={baseSymbol}
              onClick={handleMaxBase}
            />
          </div>
        }
        labelElement="div"
        className="max-w-none mt-6"
        dataAttribute="bob-amm-pool-deposit-asset1"
      >
        <AmountInput
          value={baseAmount}
          onChangeText={onBaseAmountChange}
          maxAmount={baseBalance.toNumber()}
          label={t(translations.common.amount)}
          className="max-w-none"
          unit={<AssetRenderer asset={baseSymbol} />}
          invalid={isBaseInvalid}
          placeholder="0"
        />
        {isBaseInvalid && (
          <ErrorBadge
            level={ErrorLevel.Critical}
            message={t(translations.common.invalidAmountError)}
            dataAttribute="bob-deposit-base-amount-error"
          />
        )}
      </FormGroup>

      <FormGroup
        label={
          <div className="flex justify-end w-full">
            <MaxButton
              value={quoteBalance}
              token={quoteSymbol}
              onClick={handleMaxQuote}
            />
          </div>
        }
        labelElement="div"
        className="max-w-none mt-6"
        dataAttribute="bob-amm-pool-deposit-asset1"
      >
        <AmountInput
          value={quoteAmount}
          onChangeText={onQuoteAmountChange}
          maxAmount={quoteBalance.toNumber()}
          label={t(translations.common.amount)}
          className="max-w-none"
          unit={<AssetRenderer asset={quoteSymbol} />}
          invalid={isQuoteInvalid}
          placeholder="0"
        />
        {isQuoteInvalid && (
          <ErrorBadge
            level={ErrorLevel.Critical}
            message={t(translations.common.invalidAmountError)}
            dataAttribute="bob-deposit-base-amount-error"
          />
        )}
      </FormGroup>

      <h2 className="my-4">Shape</h2>

      <div className="flex flex-row justify-between gap-x-4">
        <Button
          onClick={() => setShape(LiquidityDistribution.SPOT)}
          text="Spot"
          style={
            shape === LiquidityDistribution.SPOT
              ? ButtonStyle.primary
              : ButtonStyle.secondary
          }
        />
        <Button
          onClick={() => setShape(LiquidityDistribution.CURVE)}
          text="Curve"
          style={
            shape === LiquidityDistribution.CURVE
              ? ButtonStyle.primary
              : ButtonStyle.secondary
          }
        />
        <Button
          onClick={() => setShape(LiquidityDistribution.BID_ASK)}
          text="Bid-Ask"
          style={
            shape === LiquidityDistribution.CURVE
              ? ButtonStyle.primary
              : ButtonStyle.secondary
          }
        />
      </div>

      <LiquidityPriceForm
        pool={pool}
        min={min}
        max={max}
        onChange={handleRange}
      />

      <Button
        onClick={handleSubmit}
        text="Confirm"
        className="w-full mt-4"
        style={ButtonStyle.primary}
        disabled={submitDisabled}
      />
    </>
  );
};
