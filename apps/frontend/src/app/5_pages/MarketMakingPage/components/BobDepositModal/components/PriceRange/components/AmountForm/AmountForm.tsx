import React, { FC, useCallback } from 'react';

import { t } from 'i18next';

import { SupportedTokens } from '@sovryn/contracts';
import { FormGroup, AmountInput } from '@sovryn/ui';

import { AssetRenderer } from '../../../../../../../../2_molecules/AssetRenderer/AssetRenderer';
import { MaxButton } from '../../../../../../../../2_molecules/MaxButton/MaxButton';
import { useAccount } from '../../../../../../../../../hooks/useAccount';
import { translations } from '../../../../../../../../../locales/i18n';
import { AmmLiquidityPoolDictionary } from '../../../../../../utils/AmmLiquidityPoolDictionary';
import { useGetMaxDeposit } from '../../../../../AdjustAndDepositModal/hooks/useGetMaxDeposit';
import { useDepositContext } from '../../../../contexts/BobDepositModalContext';

// TODO: This will be a prop and will likely use a different set of pools
const POOL = AmmLiquidityPoolDictionary.list().filter(
  pool => pool.assetA === SupportedTokens.dllr,
)[0];

export const AmountForm: FC = () => {
  const { account } = useAccount();

  const {
    firstAssetValue,
    setFirstAssetValue,
    secondAssetValue,
    setSecondAssetValue,
  } = useDepositContext();

  // TODO: We will need a separate hook for Ambient pool deposits
  const { balanceTokenA, balanceTokenB } = useGetMaxDeposit(POOL, true);

  const handleFirstAssetMaxClick = useCallback(() => {
    setFirstAssetValue(balanceTokenA.toString());
  }, [balanceTokenA, setFirstAssetValue]);

  const handleSecondAssetMaxClick = useCallback(() => {
    setSecondAssetValue(balanceTokenB.toString());
  }, [balanceTokenB, setSecondAssetValue]);
  return (
    <>
      <FormGroup
        label={
          <div className="flex justify-end w-full">
            <MaxButton
              value={balanceTokenA}
              token={POOL.assetA}
              onClick={handleFirstAssetMaxClick}
            />
          </div>
        }
        labelElement="div"
        className="max-w-none mt-8"
        dataAttribute="bob-amm-pool-deposit-asset1"
      >
        <AmountInput
          value={firstAssetValue}
          onChangeText={setFirstAssetValue}
          maxAmount={balanceTokenA.toNumber()}
          label={t(translations.common.amount)}
          className="max-w-none"
          unit={<AssetRenderer asset={POOL.assetA} />}
          disabled={!account}
          placeholder="0"
        />
      </FormGroup>

      <FormGroup
        label={
          <div className="flex justify-end w-full">
            <MaxButton
              value={balanceTokenB}
              token={POOL.assetB}
              onClick={handleSecondAssetMaxClick}
            />
          </div>
        }
        labelElement="div"
        className="max-w-none mt-8"
        dataAttribute="bob-amm-pool-deposit-asset2"
      >
        <AmountInput
          value={secondAssetValue}
          onChangeText={setSecondAssetValue}
          maxAmount={balanceTokenB.toNumber()}
          label={t(translations.common.amount)}
          className="max-w-none"
          unit={<AssetRenderer asset={POOL.assetB} />}
          disabled={!account}
          placeholder="0"
        />
      </FormGroup>
    </>
  );
};
