import React, { FC, useCallback, useMemo } from 'react';

import { t } from 'i18next';

import { concDepositSkew } from '@sovryn/sdex';
import { FormGroup, AmountInput, ErrorBadge, ErrorLevel } from '@sovryn/ui';

import { AssetRenderer } from '../../../../../../../../2_molecules/AssetRenderer/AssetRenderer';
import { MaxButton } from '../../../../../../../../2_molecules/MaxButton/MaxButton';
import { useAccount } from '../../../../../../../../../hooks/useAccount';
import { useIsMounted } from '../../../../../../../../../hooks/useIsMounted';
import { translations } from '../../../../../../../../../locales/i18n';
import { calculateSecondaryDepositQty } from '../../../../../../../BobAmmPage/ambient-utils';
import { AmbientLiquidityPool } from '../../../../../AmbientMarketMaking/utils/AmbientLiquidityPool';
import { useDepositContext } from '../../../../contexts/BobDepositModalContext';
import { useGetMaxDeposit } from '../../../../hooks/useGetMaxDeposit';
import { useGetPoolInfo } from '../../../../hooks/useGetPoolInfo';
import { useValidateDepositAmounts } from '../../../../hooks/useValidateDepositAmounts';

type AmountFormProps = {
  pool: AmbientLiquidityPool;
};

export const AmountForm: FC<AmountFormProps> = ({ pool }) => {
  const isMounted = useIsMounted();
  const { account } = useAccount();
  const { base, quote } = useMemo(() => pool, [pool]);
  const { price, spotPrice, poolTokens } = useGetPoolInfo(base, quote);

  const { isFirstAssetValueInvalid, isSecondAssetValueInvalid } =
    useValidateDepositAmounts(base, quote);

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

  const { balanceTokenA, balanceTokenB } = useGetMaxDeposit(base, quote);

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

  return (
    <>
      <FormGroup
        label={
          <div className="flex justify-end w-full">
            <MaxButton
              value={balanceTokenA}
              token={base}
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
          unit={<AssetRenderer asset={base} />}
          disabled={!account}
          invalid={isFirstAssetValueInvalid}
          placeholder="0"
        />
        {isFirstAssetValueInvalid && (
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
              value={balanceTokenB}
              token={quote}
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
          unit={<AssetRenderer asset={quote} />}
          disabled={!account}
          invalid={isSecondAssetValueInvalid}
          placeholder="0"
        />
        {isSecondAssetValueInvalid && (
          <ErrorBadge
            level={ErrorLevel.Critical}
            message={t(translations.common.invalidAmountError)}
            dataAttribute="bob-deposit-quote-amount-error"
          />
        )}
      </FormGroup>
    </>
  );
};
