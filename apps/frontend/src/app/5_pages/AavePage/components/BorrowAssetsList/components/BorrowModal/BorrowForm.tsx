import React, { FC, useCallback, useMemo, useState } from 'react';

import { t } from 'i18next';

import {
  Button,
  Checkbox,
  ErrorBadge,
  ErrorLevel,
  HealthBar,
  Link,
  SimpleTable,
  SimpleTableRow,
} from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { AssetAmountInput } from '../../../../../../2_molecules/AssetAmountInput/AssetAmountInput';
import { AssetRenderer } from '../../../../../../2_molecules/AssetRenderer/AssetRenderer';
import { useDecimalAmountInput } from '../../../../../../../hooks/useDecimalAmountInput';
import { translations } from '../../../../../../../locales/i18n';
import { getCollateralRatioThresholds } from './BorrowForm.utils';

const pageTranslations = translations.aavePage;

type BorrowFormProps = {
  onSuccess: () => void;
};

export const BorrowForm: FC<BorrowFormProps> = () => {
  const assetPrice = 3258.47; // TODO: this is mocked data. Replace with proper hook
  const totalBorrow = Decimal.from(10); // TODO: this is mocked data. Replace with proper hook
  const collateralToLoanRate = Decimal.from(10); // TODO: this is mocked data. Replace with proper hook
  const collateralSize = Decimal.from(10); // TODO: this is mockd data. Replace with proper hook
  const availablePools = useMemo(() => ['BTC', 'SOV'], []); // TODO: this is mocked data. Replace with proper hook
  const [maximumBorrowAmount] = useState<Decimal>(Decimal.from(10)); // TODO: this is mocked data. Replace with proper hook
  const [borrowApr] = useState(2);
  const [borrowAsset, setBorrowAsset] = useState<string>(availablePools[0]);
  const [borrowAmount, setBorrowAmount, borrowSize] = useDecimalAmountInput('');
  const [acknowledge, setAcknowledge] = useState<boolean>(false);

  const onBorrowAssetChange = useCallback(v => {
    setBorrowAsset(v);
  }, []);

  const borrowableAssetsOptions = useMemo(
    () =>
      availablePools.map(token => ({
        value: token,
        label: (
          <AssetRenderer
            showAssetLogo
            asset={token}
            assetClassName="font-medium"
          />
        ),
      })),
    [availablePools],
  );

  const isValidBorrowAmount = useMemo(
    () => (borrowSize.gt(0) ? borrowSize.lte(maximumBorrowAmount) : true),
    [borrowSize, maximumBorrowAmount],
  );

  const collateralRatioThresholds = useMemo(
    () => getCollateralRatioThresholds(),
    [],
  );

  const collateralRatio = useMemo(() => {
    if ([collateralSize, totalBorrow, borrowSize].some(v => v.isZero())) {
      return Decimal.ZERO;
    }

    return collateralSize.mul(collateralToLoanRate).div(totalBorrow).mul(100);
  }, [collateralSize, totalBorrow, borrowSize, collateralToLoanRate]);

  // TODO: expand validations
  const submitButtonDisabled = useMemo(
    () => !isValidBorrowAmount || borrowSize.lte(0) || !acknowledge,
    [isValidBorrowAmount, borrowSize, acknowledge],
  );

  return (
    <form className="flex flex-col gap-6">
      <div className="space-y-3">
        <AssetAmountInput
          label={t(translations.aavePage.common.borrow)}
          amountLabel={t(translations.common.amount)}
          amountValue={borrowAmount}
          onAmountChange={setBorrowAmount}
          maxAmount={maximumBorrowAmount}
          invalid={!isValidBorrowAmount}
          assetValue={borrowAsset}
          onAssetChange={onBorrowAssetChange}
          assetOptions={borrowableAssetsOptions}
        />

        {!isValidBorrowAmount && (
          <ErrorBadge
            level={ErrorLevel.Critical}
            message={t(pageTranslations.borrowForm.invalidAmountError)}
            dataAttribute="borrow-amount-error"
          />
        )}
      </div>

      <SimpleTable>
        <SimpleTableRow
          label={t(translations.aavePage.borrowForm.borrowApr)}
          value={<AmountRenderer value={borrowApr} suffix={'%'} />}
        />
      </SimpleTable>

      <div>
        <div className="flex flex-row justify-between items-center mt-6 mb-3">
          <div className="flex flex-row justify-start items-center gap-2">
            <span>{t(translations.aavePage.borrowForm.collateralRatio)}</span>
          </div>
          <AmountRenderer value={collateralRatio.toString()} suffix="%" />
        </div>

        <HealthBar
          start={collateralRatioThresholds.START}
          middleStart={collateralRatioThresholds.MIDDLE_START}
          middleEnd={collateralRatioThresholds.MIDDLE_END}
          end={collateralRatioThresholds.END}
          value={collateralRatio.toNumber()}
        />
      </div>

      <SimpleTable>
        <SimpleTableRow
          label={t(translations.aavePage.borrowForm.liquidationPrice)}
          value={<span>{t(translations.common.na)}</span>}
        />
        <SimpleTableRow
          label={t(translations.aavePage.borrowForm.tokenPrice, {
            token: borrowAsset,
          })}
          value={<AmountRenderer value={assetPrice} prefix="$" />}
        />
      </SimpleTable>

      <Checkbox
        checked={acknowledge}
        onChangeValue={setAcknowledge}
        label={
          <span>
            {t(translations.aavePage.borrowForm.acknowledge)}{' '}
            <Link
              text={translations.aavePage.borrowForm.learnMore}
              href="#learn-more"
            />
            {/* TODO: Add proper learn more href */}
          </span>
        }
      />

      <Button
        disabled={submitButtonDisabled}
        text={t(translations.common.buttons.confirm)}
      />
    </form>
  );
};
