import React, { FC, useMemo, useState } from 'react';

import { t } from 'i18next';

import {
  Button,
  ErrorBadge,
  ErrorLevel,
  HelperButton,
  SimpleTable,
  SimpleTableRow,
} from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { AmountTransition } from '../../../../../../2_molecules/AmountTransition/AmountTransition';
import { AssetAmountInput } from '../../../../../../2_molecules/AssetAmountInput/AssetAmountInput';
import { AssetRenderer } from '../../../../../../2_molecules/AssetRenderer/AssetRenderer';
import { config } from '../../../../../../../constants/aave';
import { useDecimalAmountInput } from '../../../../../../../hooks/useDecimalAmountInput';
import { translations } from '../../../../../../../locales/i18n';
import { CollateralRatioHealthBar } from '../../../CollateralRatioHealthBar/CollateralRatioHealthBar';

const pageTranslations = translations.aavePage;

type RepayWithCollateralFormProps = {
  onSuccess: () => void;
};

export const RepayWithCollateralForm: FC<RepayWithCollateralFormProps> = () => {
  const assetPrice = 3258.47; // TODO: this is mocked data. Replace with proper hook
  const totalBorrowed = Decimal.from(10); // TODO: this is mocked data. Replace with proper hook
  const collateralToLoanRate = Decimal.from(10); // TODO: this is mocked data. Replace with proper hook
  const collateralSize = Decimal.from(10); // TODO: this is mockd data. Replace with proper hook
  const assets = useMemo(() => ['BTC', 'SOV'], []); // TODO: this is mocked data. Replace with proper hook
  const [maximumRepayAmount] = useState(Decimal.from(10)); // TODO: this is mocked data. Replace with proper hook
  const [maximumRepayWithAmount] = useState(Decimal.from(10)); // TODO: this is mocked data. Replace with proper hook
  const [repayAsset, setRepayAsset] = useState<string>(assets[0]);
  const [repayAmount, setRepayAmount, repaySize] = useDecimalAmountInput('');
  const [repayWithAsset, setRepayWithAsset] = useState<string>(assets[0]);
  const [repayWithAmount, setRepayWithAmount, repayWithSize] =
    useDecimalAmountInput('');

  const repayAssetsOptions = useMemo(
    () =>
      assets.map(token => ({
        value: token,
        label: (
          <AssetRenderer
            showAssetLogo
            asset={token}
            assetClassName="font-medium"
          />
        ),
      })),
    [assets],
  );

  const remainingDebt = useMemo(
    () => maximumRepayAmount.sub(repaySize),
    [repaySize, maximumRepayAmount],
  );

  const collateralRatio = useMemo(() => {
    if ([collateralSize, totalBorrowed, repaySize].some(v => v.isZero())) {
      return Decimal.from(0);
    }

    return collateralSize.mul(collateralToLoanRate).div(totalBorrowed).mul(100);
  }, [collateralSize, totalBorrowed, repaySize, collateralToLoanRate]);

  // TODO: add more validations
  const isValidRepayAmount = useMemo(
    () => (repaySize.gt(0) ? repaySize.lte(maximumRepayAmount) : true),
    [repaySize, maximumRepayAmount],
  );

  // TODO: add more validations
  const isValidRepayWithAmount = useMemo(
    () =>
      repayWithSize.gt(0) ? repayWithSize.lte(maximumRepayWithAmount) : true,
    [repayWithSize, maximumRepayWithAmount],
  );

  // TODO: add more validations
  const submitButtonDisabled = useMemo(
    () =>
      !isValidRepayAmount ||
      repaySize.lte(0) ||
      !isValidRepayWithAmount ||
      repayWithSize.lte(0),
    [isValidRepayAmount, repaySize, isValidRepayWithAmount, repayWithSize],
  );

  return (
    <form className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <AssetAmountInput
          label={t(translations.aavePage.repayModal.expectedAmountToRepay)}
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

      <div className="flex flex-col gap-3">
        <AssetAmountInput
          label={t(translations.aavePage.repayModal.collateralToRepayWith)}
          maxAmount={maximumRepayWithAmount}
          amountLabel={t(translations.common.amount)}
          amountValue={repayWithAmount}
          onAmountChange={setRepayWithAmount}
          invalid={!isValidRepayWithAmount}
          assetValue={repayWithAsset}
          onAssetChange={setRepayWithAsset}
          assetOptions={repayAssetsOptions}
        />

        {!isValidRepayWithAmount && (
          <ErrorBadge
            level={ErrorLevel.Critical}
            message={t(pageTranslations.repayModal.invalidAmountError)}
            dataAttribute="repay-with-amount-error"
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
              from={{ value: remainingDebt, suffix: '%' }}
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
        <SimpleTableRow
          label={
            <div className="flex space-x-1">
              <span>{t(translations.aavePage.repayModal.priceImpact)}</span>{' '}
              <HelperButton
                content={t(translations.aavePage.repayModal.priceImpactInfo)}
              />
            </div>
          }
          value={<AmountRenderer value={assetPrice} prefix="$" />}
        />
      </SimpleTable>

      <Button
        disabled={submitButtonDisabled}
        text={t(translations.common.buttons.confirm)}
      />
    </form>
  );
};
