import React, { FC, useCallback, useMemo, useState } from 'react';

import { t } from 'i18next';

import { FormGroup, AmountInput, Button, ButtonStyle } from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { AssetRenderer } from '../../../../../../2_molecules/AssetRenderer/AssetRenderer';
import { MaxButton } from '../../../../../../2_molecules/MaxButton/MaxButton';
import { useAccount } from '../../../../../../../hooks/useAccount';
import { translations } from '../../../../../../../locales/i18n';
import { AmmLiquidityPool } from '../../../../utils/AmmLiquidityPool';
import { PERCENTAGE_OPTIONS } from './AmountForm.constants';
import { renderPercentageClassName } from './AmountForm.utils';

type AmountFormProps = {
  primaryTokenBalance: Decimal;
  secondaryTokenBalance: Decimal;
  pool: AmmLiquidityPool;
};

export const AmountForm: FC<AmountFormProps> = ({
  primaryTokenBalance,
  secondaryTokenBalance,
  pool,
}) => {
  const { account } = useAccount();

  const [withdrawAmount, setWithdrawAmount] = useState(Decimal.ZERO);
  const [secondaryWithdrawAmount, setSecondaryWithdrawAmount] = useState(
    Decimal.ZERO,
  );

  const onPercentageButtonClick = useCallback(
    (percentage: number) => {
      setWithdrawAmount(primaryTokenBalance.mul(percentage / 100));
      setSecondaryWithdrawAmount(secondaryTokenBalance.mul(percentage / 100));
    },
    [primaryTokenBalance, secondaryTokenBalance],
  );

  const onMaxClick = useCallback(() => {
    setWithdrawAmount(primaryTokenBalance);
    setSecondaryWithdrawAmount(secondaryTokenBalance);
  }, [primaryTokenBalance, secondaryTokenBalance]);

  const onAmountChange = useCallback(
    (value: string) => {
      const decimalAmount = Decimal.from(value);
      setWithdrawAmount(decimalAmount);

      const percentage = primaryTokenBalance.div(decimalAmount);
      setSecondaryWithdrawAmount(secondaryTokenBalance.div(percentage));
    },
    [primaryTokenBalance, secondaryTokenBalance],
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
          <div className="flex justify-end w-full">
            <MaxButton
              value={primaryTokenBalance}
              token={pool.assetA}
              onClick={onMaxClick}
            />
          </div>
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
          unit={<AssetRenderer asset={pool.assetA} />}
          disabled={!account}
          placeholder="0"
        />
      </FormGroup>

      <AmountInput
        value={secondaryWithdrawAmount.toString()}
        readOnly
        label={t(translations.common.amount)}
        className="max-w-none"
        unit={<AssetRenderer asset={pool.assetB} />}
        placeholder="0"
      />
    </>
  );
};
