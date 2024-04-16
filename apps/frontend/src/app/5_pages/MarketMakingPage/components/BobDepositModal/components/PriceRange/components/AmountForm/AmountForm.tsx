import React, { FC, useCallback } from 'react';

import { t } from 'i18next';

import { FormGroup, AmountInput } from '@sovryn/ui';

import { BOB_CHAIN_ID } from '../../../../../../../../../config/chains';

import { AssetRenderer } from '../../../../../../../../2_molecules/AssetRenderer/AssetRenderer';
import { MaxButton } from '../../../../../../../../2_molecules/MaxButton/MaxButton';
import { useAccount } from '../../../../../../../../../hooks/useAccount';
import { useAssetBalance } from '../../../../../../../../../hooks/useAssetBalance';
import { translations } from '../../../../../../../../../locales/i18n';
import { POOL_ASSET_A, POOL_ASSET_B } from '../../../../BobDepositModal';
import { useDepositContext } from '../../../../contexts/BobDepositModalContext';
import { useGetMaxDeposit } from '../../../../hooks/useGetMaxDeposit';

export const AmountForm: FC = () => {
  const { account } = useAccount();

  const {
    firstAssetValue,
    setFirstAssetValue,
    secondAssetValue,
    setSecondAssetValue,
  } = useDepositContext();

  const { balance: balanceTokenA } = useAssetBalance(
    POOL_ASSET_A,
    BOB_CHAIN_ID,
  );

  const { balanceTokenB } = useGetMaxDeposit(POOL_ASSET_A, POOL_ASSET_B);

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
              token={POOL_ASSET_A}
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
          onChangeText={setFirstAssetValue}
          maxAmount={balanceTokenA.toNumber()}
          label={t(translations.common.amount)}
          className="max-w-none"
          unit={<AssetRenderer asset={POOL_ASSET_A} />}
          disabled={!account}
          placeholder="0"
        />
      </FormGroup>

      <FormGroup
        label={
          <div className="flex justify-end w-full">
            <MaxButton
              value={balanceTokenB}
              token={POOL_ASSET_B}
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
          onChangeText={setSecondAssetValue}
          maxAmount={balanceTokenB.toNumber()}
          label={t(translations.common.amount)}
          className="max-w-none"
          unit={<AssetRenderer asset={POOL_ASSET_B} />}
          disabled={!account}
          placeholder="0"
        />
      </FormGroup>
    </>
  );
};
