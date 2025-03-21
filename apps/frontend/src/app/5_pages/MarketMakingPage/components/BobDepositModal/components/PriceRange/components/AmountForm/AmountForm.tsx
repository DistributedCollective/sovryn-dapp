import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { t } from 'i18next';

import { concDepositSkew } from '@sovryn/sdex';
import { Pool } from '@sovryn/sdk';
import {
  FormGroup,
  AmountInput,
  ErrorBadge,
  ErrorLevel,
  Toggle,
} from '@sovryn/ui';

import { AssetRenderer } from '../../../../../../../../2_molecules/AssetRenderer/AssetRenderer';
import { MaxButton } from '../../../../../../../../2_molecules/MaxButton/MaxButton';
import { useAccount } from '../../../../../../../../../hooks/useAccount';
import { useIsMounted } from '../../../../../../../../../hooks/useIsMounted';
import { translations } from '../../../../../../../../../locales/i18n';
import { calculateSecondaryDepositQty } from '../../../../../../../BobAmmPage/ambient-utils';
import { DEFAULT_RANGE_WIDTH } from '../../../../BobDepositModal.constants';
import { useDepositContext } from '../../../../contexts/BobDepositModalContext';
import { useGetMaxDeposit } from '../../../../hooks/useGetMaxDeposit';
import { useGetPoolInfo } from '../../../../hooks/useGetPoolInfo';
import { useSurplusCollateralBalance } from '../../../../hooks/useSurplusCollateralBalance';
import { useValidateDepositAmounts } from '../../../../hooks/useValidateDepositAmounts';

type AmountFormProps = {
  pool: Pool;
};

export const AmountForm: FC<AmountFormProps> = ({ pool }) => {
  const isMounted = useIsMounted();
  const { account } = useAccount();
  const { base, quote } = useMemo(() => pool, [pool]);
  const { price, spotPrice, poolTokens } = useGetPoolInfo(pool);

  const { isFirstAssetValueInvalid, isSecondAssetValueInvalid } =
    useValidateDepositAmounts(base.symbol, quote.symbol);

  const tokenASurplus = useSurplusCollateralBalance(
    poolTokens?.tokenA.tokenAddr,
  );
  const tokenBSurplus = useSurplusCollateralBalance(
    poolTokens?.tokenB.tokenAddr,
  );
  console.log({
    tokenASurplus,
    tokenBSurplus,
  });
  const [useSurplusA, setUseSurplusA] = useState(false);
  const [useSurplusB, setUseSurplusB] = useState(false);

  const {
    firstAssetValue,
    setFirstAssetValue,
    secondAssetValue,
    setSecondAssetValue,
    setUsesBaseToken,
    minimumPrice,
    maximumPrice,
    isBalancedRange,
    rangeWidth,
    usesBaseToken,
    isFirstAssetOutOfRange,
    isSecondAssetOutOfRange,
    setIsFirstAssetOutOfRange,
    setIsSecondAssetOutOfRange,
    setRangeWidth,
    setLowerBoundaryPercentage,
    setUpperBoundaryPercentage,
  } = useDepositContext();

  const depositSkew = useMemo(
    () => concDepositSkew(spotPrice, minimumPrice, maximumPrice),
    [spotPrice, minimumPrice, maximumPrice],
  );

  const getOtherTokenQuantity = useCallback(
    async (
      inputValue: string,
      primaryToken: 'A' | 'B',
      isTokenABase: boolean,
    ) => {
      if (spotPrice === undefined || !isMounted()) {
        return;
      }

      const tokenQuantity = calculateSecondaryDepositQty(
        spotPrice,
        (await poolTokens?.tokenA.decimals) || 18,
        (await poolTokens?.tokenB.decimals) || 18,
        inputValue,
        primaryToken === 'A',
        isTokenABase,
        isBalancedRange && rangeWidth === 100,
        depositSkew,
      );
      return tokenQuantity;
    },
    [
      depositSkew,
      isBalancedRange,
      isMounted,
      poolTokens?.tokenA.decimals,
      poolTokens?.tokenB.decimals,
      rangeWidth,
      spotPrice,
    ],
  );

  const { balanceTokenA, balanceTokenB } = useGetMaxDeposit(
    base.symbol,
    quote.symbol,
  );

  const handleFirstAssetMaxClick = useCallback(async () => {
    setFirstAssetValue(balanceTokenA.toString());

    const secondAssetQuantity = await getOtherTokenQuantity(
      balanceTokenA.toString(),
      'A',
      true,
    );

    setSecondAssetValue(secondAssetQuantity);
    setUsesBaseToken(true);
  }, [
    balanceTokenA,
    getOtherTokenQuantity,
    setFirstAssetValue,
    setSecondAssetValue,
    setUsesBaseToken,
  ]);

  const handleSecondAssetMaxClick = useCallback(async () => {
    setSecondAssetValue(balanceTokenB.toString());

    const firstAssetQuantity = await getOtherTokenQuantity(
      balanceTokenB.toString(),
      'B',
      true,
    );

    setFirstAssetValue(firstAssetQuantity);
    setUsesBaseToken(false);
  }, [
    balanceTokenB,
    getOtherTokenQuantity,
    setFirstAssetValue,
    setSecondAssetValue,
    setUsesBaseToken,
  ]);

  const onFirstAssetChange = useCallback(
    async (value: string) => {
      setUsesBaseToken(true);
      setFirstAssetValue(value);
      if (price === 0) {
        return;
      }

      const secondAssetQuantity = await getOtherTokenQuantity(value, 'A', true);

      setSecondAssetValue(secondAssetQuantity);
    },
    [
      price,
      setFirstAssetValue,
      setSecondAssetValue,
      setUsesBaseToken,
      getOtherTokenQuantity,
    ],
  );

  const onSecondAssetChange = useCallback(
    async (value: string) => {
      setUsesBaseToken(false);
      setSecondAssetValue(value);
      if (price === 0) {
        return;
      }

      const firstAssetQuantity = await getOtherTokenQuantity(value, 'B', true);

      setFirstAssetValue(firstAssetQuantity);
    },
    [
      price,
      setFirstAssetValue,
      setSecondAssetValue,
      setUsesBaseToken,
      getOtherTokenQuantity,
    ],
  );

  const handleRangeChange = useCallback(async () => {
    if (usesBaseToken) {
      if (firstAssetValue === '0') {
        return;
      }
      const secondAssetQuantity = await getOtherTokenQuantity(
        firstAssetValue,
        'A',
        true,
      );
      if (secondAssetQuantity !== null) {
        setSecondAssetValue(secondAssetQuantity);
      }
    } else {
      if (secondAssetValue === '0') {
        return;
      }
      const firstAssetQuantity = await getOtherTokenQuantity(
        secondAssetValue,
        'B',
        true,
      );
      if (firstAssetQuantity !== null) {
        setFirstAssetValue(firstAssetQuantity);
      }
    }
  }, [
    usesBaseToken,
    getOtherTokenQuantity,
    firstAssetValue,
    setSecondAssetValue,
    secondAssetValue,
    setFirstAssetValue,
  ]);

  const isInvalidPriceRange = useMemo(
    () => minimumPrice > maximumPrice,
    [minimumPrice, maximumPrice],
  );

  const isFirstValueDisabled = useMemo(
    () =>
      !account ||
      (isFirstAssetOutOfRange && !isBalancedRange) ||
      isInvalidPriceRange,
    [account, isFirstAssetOutOfRange, isBalancedRange, isInvalidPriceRange],
  );

  const isSecondValueDisabled = useMemo(
    () =>
      !account ||
      (isSecondAssetOutOfRange && !isBalancedRange) ||
      isInvalidPriceRange,
    [account, isSecondAssetOutOfRange, isBalancedRange, isInvalidPriceRange],
  );

  useEffect(() => {
    if (isFirstValueDisabled && !isBalancedRange) {
      setFirstAssetValue('0');
      setUsesBaseToken(false);
    } else if (firstAssetValue === '0') {
      onSecondAssetChange(secondAssetValue);
    }
  }, [
    firstAssetValue,
    isBalancedRange,
    isFirstValueDisabled,
    onSecondAssetChange,
    secondAssetValue,
    setFirstAssetValue,
    setUsesBaseToken,
  ]);

  useEffect(() => {
    if (isSecondValueDisabled && !isBalancedRange) {
      setSecondAssetValue('0');
      setUsesBaseToken(true);
    } else if (secondAssetValue === '0') {
      onFirstAssetChange(firstAssetValue);
    }
  }, [
    firstAssetValue,
    isBalancedRange,
    isSecondValueDisabled,
    onFirstAssetChange,
    secondAssetValue,
    setSecondAssetValue,
    setUsesBaseToken,
  ]);

  useEffect(() => {
    if (isBalancedRange) {
      setIsFirstAssetOutOfRange(false);
      setIsSecondAssetOutOfRange(false);
      setLowerBoundaryPercentage(DEFAULT_RANGE_WIDTH * -1);
      setUpperBoundaryPercentage(DEFAULT_RANGE_WIDTH);
    }
    handleRangeChange();
  }, [
    handleRangeChange,
    isBalancedRange,
    setRangeWidth,
    setIsFirstAssetOutOfRange,
    setIsSecondAssetOutOfRange,
    setLowerBoundaryPercentage,
    setUpperBoundaryPercentage,
    firstAssetValue,
    secondAssetValue,
  ]);

  return (
    <>
      <FormGroup
        label={
          <div className="flex justify-end w-full">
            <MaxButton
              value={balanceTokenA}
              token={base.symbol}
              onClick={handleFirstAssetMaxClick}
            />
          </div>
        }
        labelElement="div"
        className="max-w-none mt-6"
        dataAttribute="bob-amm-pool-deposit-asset1"
      >
        <AmountInput
          value={firstAssetValue}
          onChangeText={onFirstAssetChange}
          maxAmount={balanceTokenA.toNumber()}
          label={t(translations.common.amount)}
          className="max-w-none"
          unit={<AssetRenderer asset={base.symbol} />}
          disabled={isFirstValueDisabled}
          invalid={isFirstAssetValueInvalid}
          placeholder="0"
        />
        <Toggle
          checked={useSurplusA}
          onChange={() => setUseSurplusA(!useSurplusA)}
          className="mt-2"
          label={t(translations.bobMarketMakingPage.depositModal.allowSurplus)}
        />
        {isFirstAssetValueInvalid && (
          <ErrorBadge
            level={ErrorLevel.Critical}
            message={t(translations.common.invalidAmountError)}
            dataAttribute="bob-deposit-base-amount-error"
          />
        )}
        {isFirstValueDisabled && !isInvalidPriceRange && (
          <ErrorBadge
            level={ErrorLevel.Warning}
            message={t(
              translations.bobMarketMakingPage.depositModal.form
                .outOfRangeWarning,
            )}
            dataAttribute="bob-deposit-base-amount-warning"
          />
        )}
      </FormGroup>

      <FormGroup
        label={
          <div className="flex justify-end w-full">
            <MaxButton
              value={balanceTokenB}
              token={quote.symbol}
              onClick={handleSecondAssetMaxClick}
            />
          </div>
        }
        labelElement="div"
        className="max-w-none mt-6"
        dataAttribute="bob-amm-pool-deposit-asset2"
      >
        <AmountInput
          value={secondAssetValue}
          onChangeText={onSecondAssetChange}
          maxAmount={balanceTokenB.toNumber()}
          label={t(translations.common.amount)}
          className="max-w-none"
          unit={<AssetRenderer asset={quote.symbol} />}
          disabled={isSecondValueDisabled}
          invalid={isSecondAssetValueInvalid}
          placeholder="0"
        />
        <Toggle
          checked={useSurplusB}
          onChange={() => setUseSurplusB(!useSurplusB)}
          className="mt-2"
          label={t(translations.bobMarketMakingPage.depositModal.allowSurplus)}
        />
        {isSecondAssetValueInvalid && (
          <ErrorBadge
            level={ErrorLevel.Critical}
            message={t(translations.common.invalidAmountError)}
            dataAttribute="bob-deposit-quote-amount-error"
          />
        )}
        {isSecondValueDisabled && !isInvalidPriceRange && (
          <ErrorBadge
            level={ErrorLevel.Warning}
            message={t(
              translations.bobMarketMakingPage.depositModal.form
                .outOfRangeWarning,
            )}
            dataAttribute="bob-deposit-quote-amount-warning"
          />
        )}
      </FormGroup>
      {isInvalidPriceRange && (
        <ErrorBadge
          level={ErrorLevel.Critical}
          message={t(
            translations.bobMarketMakingPage.depositModal.form
              .invalidPriceRange,
          )}
          dataAttribute="bob-deposit-both-amount-warning"
        />
      )}
    </>
  );
};
