import React, { FC, useCallback, useMemo } from 'react';

import { t } from 'i18next';

import { Pool } from '@sovryn/sdk';
import { FormGroup, AmountInput, Button, ButtonStyle } from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { AssetRenderer } from '../../../../../../2_molecules/AssetRenderer/AssetRenderer';
import { MaxButton } from '../../../../../../2_molecules/MaxButton/MaxButton';
import { useAccount } from '../../../../../../../hooks/useAccount';
import { translations } from '../../../../../../../locales/i18n';
import { PERCENTAGE_OPTIONS } from './AmountForm.constants';
import { renderPercentageClassName } from './AmountForm.utils';

type AmountFormProps = {
  primaryTokenBalance: Decimal;
  secondaryTokenBalance: Decimal;
  withdrawAmount: Decimal;
  setWithdrawAmount: (value: Decimal) => void;
  secondaryWithdrawAmount: Decimal;
  setSecondaryWithdrawAmount: (value: Decimal) => void;
  pool: Pool;
};

export const AmountForm: FC<AmountFormProps> = ({
  primaryTokenBalance,
  secondaryTokenBalance,
  withdrawAmount,
  setWithdrawAmount,
  secondaryWithdrawAmount,
  setSecondaryWithdrawAmount,
  pool,
}) => {
  const { account } = useAccount();

  const onPercentageButtonClick = useCallback(
    (percentage: number) => {
      setWithdrawAmount(primaryTokenBalance.mul(percentage / 100));
      setSecondaryWithdrawAmount(secondaryTokenBalance.mul(percentage / 100));
    },
    [
      primaryTokenBalance,
      secondaryTokenBalance,
      setSecondaryWithdrawAmount,
      setWithdrawAmount,
    ],
  );

  const onMaxClick = useCallback(() => {
    setWithdrawAmount(primaryTokenBalance);
    setSecondaryWithdrawAmount(secondaryTokenBalance);
  }, [
    primaryTokenBalance,
    secondaryTokenBalance,
    setSecondaryWithdrawAmount,
    setWithdrawAmount,
  ]);

  const onAmountChange = useCallback(
    (value: string) => {
      const decimalAmount = Decimal.from(value);
      setWithdrawAmount(decimalAmount);

      const percentage = primaryTokenBalance.div(decimalAmount);
      setSecondaryWithdrawAmount(secondaryTokenBalance.div(percentage));
    },
    [
      primaryTokenBalance,
      secondaryTokenBalance,
      setSecondaryWithdrawAmount,
      setWithdrawAmount,
    ],
  );

  const onSecondaryAmountChange = useCallback(
    (value: string) => {
      const decimalAmount = Decimal.from(value);
      setSecondaryWithdrawAmount(decimalAmount);
    },
    [setSecondaryWithdrawAmount],
  );

  const withdrawAmountPercentage = useMemo(
    (): number =>
      withdrawAmount === Decimal.ZERO
        ? 0
        : withdrawAmount.div(primaryTokenBalance).mul(100).toNumber(),
    [primaryTokenBalance, withdrawAmount],
  );

  return (
    <>
      <div className="flex justify-center mt-8">
        {PERCENTAGE_OPTIONS.map(item => (
          <Button
            text={`${item}%`}
            key={item}
            onClick={() => onPercentageButtonClick(item)}
            style={ButtonStyle.secondary}
            className={renderPercentageClassName(
              withdrawAmountPercentage,
              item,
            )}
          />
        ))}
      </div>

      <FormGroup
        label={
          primaryTokenBalance.gt(0) && (
            <div className="flex justify-end w-full">
              <MaxButton
                value={primaryTokenBalance}
                token={pool.base.symbol}
                onClick={onMaxClick}
              />
            </div>
          )
        }
        labelElement="div"
        className="max-w-none my-6"
        dataAttribute="bob-amm-pool-deposit-asset1"
      >
        <AmountInput
          value={withdrawAmount.toString()}
          onChangeText={onAmountChange}
          maxAmount={primaryTokenBalance.toNumber()}
          label={t(translations.common.amount)}
          className="max-w-none"
          unit={<AssetRenderer asset={pool.base.symbol} />}
          disabled={!account || Number(primaryTokenBalance) === 0}
          placeholder="0"
        />
      </FormGroup>

      <FormGroup
        label={
          secondaryTokenBalance.gt(0) &&
          Number(primaryTokenBalance) === 0 && (
            <div className="flex justify-end w-full">
              <MaxButton
                value={secondaryTokenBalance}
                token={pool.quote.symbol}
                onClick={onMaxClick}
              />
            </div>
          )
        }
        labelElement="div"
        className="max-w-none my-6"
        dataAttribute="bob-amm-pool-deposit-asset2"
      >
        <AmountInput
          value={secondaryWithdrawAmount.toString()}
          onChangeText={onSecondaryAmountChange}
          maxAmount={secondaryTokenBalance.toNumber()}
          label={t(translations.common.amount)}
          className="max-w-none"
          unit={<AssetRenderer asset={pool.quote.symbol} />}
          disabled={!account || Number(secondaryTokenBalance) === 0}
          placeholder="0"
          readOnly={Number(primaryTokenBalance) > 0}
        />
      </FormGroup>
    </>
  );
};
