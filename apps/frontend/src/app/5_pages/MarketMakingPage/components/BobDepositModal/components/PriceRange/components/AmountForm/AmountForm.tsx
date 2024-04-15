import React, { FC, useCallback, useMemo } from 'react';

import { t } from 'i18next';

import { FormGroup, AmountInput } from '@sovryn/ui';

import { AssetRenderer } from '../../../../../../../../2_molecules/AssetRenderer/AssetRenderer';
import { MaxButton } from '../../../../../../../../2_molecules/MaxButton/MaxButton';
import { useAccount } from '../../../../../../../../../hooks/useAccount';
import { useAssetBalance } from '../../../../../../../../../hooks/useAssetBalance';
import { useCurrentChain } from '../../../../../../../../../hooks/useChainStore';
import { translations } from '../../../../../../../../../locales/i18n';
import { AmbientLiquidityPool } from '../../../../../AmbientMarketMaking/utils/AmbientLiquidityPool';
import { useDepositContext } from '../../../../contexts/BobDepositModalContext';
import { useGetMaxDeposit } from '../../../../hooks/useGetMaxDeposit';
import { useGetPoolInfo } from '../../../../hooks/useGetPoolInfo';

type AmountFormProps = {
  pool: AmbientLiquidityPool;
};

export const AmountForm: FC<AmountFormProps> = ({ pool }) => {
  const { account } = useAccount();
  const { base, quote } = useMemo(() => pool, [pool]);
  const { price } = useGetPoolInfo(base, quote);

  const chainId = useCurrentChain();

  const {
    firstAssetValue,
    setFirstAssetValue,
    secondAssetValue,
    setSecondAssetValue,
  } = useDepositContext();

  const { balance: balanceTokenA } = useAssetBalance(base, chainId);

  const { balanceTokenB } = useGetMaxDeposit(base, quote);

  const handleFirstAssetMaxClick = useCallback(() => {
    setFirstAssetValue(balanceTokenA.toString());
    setSecondAssetValue(String(balanceTokenA.toNumber() * price));
  }, [balanceTokenA, price, setFirstAssetValue, setSecondAssetValue]);

  const handleSecondAssetMaxClick = useCallback(() => {
    setSecondAssetValue(balanceTokenB.toString());
    setFirstAssetValue(String(balanceTokenB.toNumber() / price));
  }, [balanceTokenB, price, setFirstAssetValue, setSecondAssetValue]);

  const onFirstAssetChange = useCallback(
    (value: string) => {
      setFirstAssetValue(value);
      if (price === 0) {
        return;
      }

      setSecondAssetValue(String(Number(value) * price));
    },
    [price, setFirstAssetValue, setSecondAssetValue],
  );

  const onSecondAssetChange = useCallback(
    (value: string) => {
      setSecondAssetValue(value);
      if (price === 0) {
        return;
      }

      setFirstAssetValue(String(Number(value) / price));
    },
    [price, setFirstAssetValue, setSecondAssetValue],
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
          placeholder="0"
        />
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
          placeholder="0"
        />
      </FormGroup>
    </>
  );
};
