import React, { FC, useMemo, useState } from 'react';

import { t } from 'i18next';

import {
  Button,
  ErrorBadge,
  ErrorLevel,
  SimpleTable,
  SimpleTableRow,
} from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { BOB_CHAIN_ID } from '../../../../../../../config/chains';

import { AmountTransition } from '../../../../../../2_molecules/AmountTransition/AmountTransition';
import { AssetAmountInput } from '../../../../../../2_molecules/AssetAmountInput/AssetAmountInput';
import { AssetRenderer } from '../../../../../../2_molecules/AssetRenderer/AssetRenderer';
import { config } from '../../../../../../../constants/aave';
import { useDecimalAmountInput } from '../../../../../../../hooks/useDecimalAmountInput';
import { translations } from '../../../../../../../locales/i18n';
import { CollateralRatioHealthBar } from '../../../CollateralRatioHealthBar/CollateralRatioHealthBar';

const pageTranslations = translations.aavePage;

type RepayWithWalletBalanceFormProps = {
  onSuccess: () => void;
};

export const RepayWithWalletBalanceForm: FC<
  RepayWithWalletBalanceFormProps
> = () => {
  const totalBorrowed = Decimal.from(10); // TODO: this is mocked data. Replace with proper hook
  const collateralToLoanRate = Decimal.from(10); // TODO: this is mocked data. Replace with proper hook
  const collateralSize = Decimal.from(10); // TODO: this is mockd data. Replace with proper hook
  const assetsToRepay = useMemo(() => ['BTC', 'SOV'], []); // TODO: this is mocked data. Replace with proper hook
  const [maximumRepayAmount] = useState(Decimal.from(10)); // TODO: this is mocked data. Replace with proper hook
  const [repayAsset, setRepayAsset] = useState<string>(assetsToRepay[0]);
  const [repayAmount, setRepayAmount, repaySize] = useDecimalAmountInput('');

  const repayAssetsOptions = useMemo(
    () =>
      assetsToRepay.map(token => ({
        value: token,
        label: (
          <AssetRenderer
            showAssetLogo
            asset={token}
            assetClassName="font-medium"
          />
        ),
      })),
    [assetsToRepay],
  );

  const isValidRepayAmount = useMemo(
    () => (repaySize.gt(0) ? repaySize.lte(maximumRepayAmount) : true),
    [repaySize, maximumRepayAmount],
  );

  const collateralRatio = useMemo(() => {
    if ([collateralSize, totalBorrowed, repaySize].some(v => v.isZero())) {
      return Decimal.from(0);
    }

    return collateralSize.mul(collateralToLoanRate).div(totalBorrowed).mul(100);
  }, [collateralSize, totalBorrowed, repaySize, collateralToLoanRate]);

  // TODO: Add validations
  const submitButtonDisabled = useMemo(
    () => !isValidRepayAmount || repaySize.lte(0),
    [isValidRepayAmount, repaySize],
  );

  return (
    <form className="flex flex-col gap-6 relative">
      <div className="space-y-3">
        <AssetAmountInput
          chainId={BOB_CHAIN_ID}
          maxAmount={maximumRepayAmount}
          amountLabel={t(translations.common.amount)}
          amountValue={repayAmount}
          onAmountChange={setRepayAmount}
          invalid={!isValidRepayAmount}
          assetValue={repayAsset}
          onAssetChange={setRepayAsset}
          assetOptions={repayAssetsOptions}
        />

        {!isValidRepayAmount && (
          <ErrorBadge
            level={ErrorLevel.Critical}
            message={t(pageTranslations.repayModal.invalidAmountError)}
            dataAttribute="repay-amount-error"
          />
        )}
      </div>

      <CollateralRatioHealthBar
        ratio={collateralRatio}
        minimum={config.MinCollateralRatio}
      />

      <SimpleTable>
        <SimpleTableRow
          label={t(translations.aavePage.repayModal.remainingDebt)}
          value={
            <AmountTransition
              className="justify-end"
              from={{ value: 0.002429, suffix: '%' }}
              to={{ value: 0, suffix: '%', className: 'text-primary-10' }}
            />
          }
        />
        <SimpleTableRow
          label={t(translations.aavePage.repayModal.newCollateralBalance)}
          value={
            <div className="space-y-1">
              <AmountTransition
                className="justify-end"
                from={{ value: 10, suffix: 'USDT' }}
                to={{ value: 10, suffix: 'USDT' }}
              />
              <AmountTransition
                className="justify-end text-gray-40"
                from={{ value: 10, prefix: '$' }}
                to={{ value: 10, prefix: '$' }}
              />
            </div>
          }
        />
      </SimpleTable>

      <Button
        disabled={submitButtonDisabled}
        text={t(translations.common.buttons.confirm)}
      />
    </form>
  );
};
