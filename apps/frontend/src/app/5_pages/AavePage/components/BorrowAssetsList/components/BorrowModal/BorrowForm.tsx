import React, { FC, useCallback, useMemo, useState } from 'react';

import { t } from 'i18next';

import {
  AmountInput,
  Button,
  Checkbox,
  ErrorBadge,
  ErrorLevel,
  HealthBar,
  Link,
  Paragraph,
  ParagraphSize,
  Select,
  SimpleTable,
  SimpleTableRow,
} from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { AssetRenderer } from '../../../../../../2_molecules/AssetRenderer/AssetRenderer';
import { useDecimalAmountInput } from '../../../../../../../hooks/useDecimalAmountInput';
import { translations } from '../../../../../../../locales/i18n';
import { getCollateralRatioThresholds } from './BorrowForm.utils';

const pageTranslations = translations.aavePage;

type BorrowFormProps = {
  onSuccess: () => unknown;
};

export const BorrowForm: FC<BorrowFormProps> = () => {
  const assetPrice = 3258.47; // TODO: this is mocked data. Replace with proper hook
  const totalBorrow = Decimal.from(10); // TODO: this is mocked data. Replace with proper hook
  const collateralToLoanRate = Decimal.from(10); // TODO: this is mocked data. Replace with proper hook
  const collateralSize = Decimal.from(10); // TODO: this is mockd data. Replace with proper hook
  const borrowableAssets = useMemo(() => ['BTC', 'SOV'], []); // TODO: this is mocked data. Replace with proper hook
  const [maximumBorrowAmount] = useState<Decimal>(Decimal.from(10)); // TODO: this is mocked data. Replace with proper hook
  const [borrowAsset, setBorrowAsset] = useState<string>(borrowableAssets[0]);
  const [borrowAmount, setBorrowAmount, borrowSize] = useDecimalAmountInput('');
  const [acknowledge, setAcknowledge] = useState<boolean>(false);

  const onBorrowAssetChange = useCallback(v => {
    setBorrowAsset(v);
  }, []);

  const borrowableAssetsOptions = useMemo(
    () =>
      borrowableAssets.map(token => ({
        value: token,
        label: (
          <AssetRenderer
            showAssetLogo
            asset={token}
            assetClassName="font-medium"
          />
        ),
      })),
    [borrowableAssets],
  );

  const isValidBorrowAmount = useMemo(
    () => (borrowSize.gt(0) ? borrowSize.lte(maximumBorrowAmount) : true),
    [borrowSize, maximumBorrowAmount],
  );

  const remainingSupply = useMemo(
    () => maximumBorrowAmount.sub(borrowSize),
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

  const submitButtonDisabled = useMemo(
    () => !isValidBorrowAmount || borrowSize.lte(0) || !acknowledge,
    [isValidBorrowAmount, borrowSize, acknowledge],
  );

  return (
    <form className="flex flex-col gap-6">
      <div className="space-y-3">
        <div className="flex justify-between items-end">
          <Paragraph size={ParagraphSize.base} className="font-medium">
            {t(translations.aavePage.common.borrow)}
          </Paragraph>

          <span className="text-xs underline">
            (Max{' '}
            <AmountRenderer
              value={maximumBorrowAmount}
              suffix={borrowAsset}
              prefix="~"
            />
            )
          </span>
        </div>

        <div>
          <div className="flex space-x-3">
            <div className="text-right flex-grow space-y-1">
              <AmountInput
                label={t(translations.common.amount)}
                value={borrowAmount}
                onChangeText={setBorrowAmount}
                placeholder="0"
                invalid={!isValidBorrowAmount}
              />
              <div className=" pr-4">
                <AmountRenderer
                  className="text-gray-40"
                  value={0} // TODO: usd equivalent
                  prefix="$"
                />
              </div>
            </div>

            <Select
              value={borrowAsset}
              onChange={onBorrowAssetChange}
              options={borrowableAssetsOptions}
              labelRenderer={({ value }) => (
                <AssetRenderer
                  dataAttribute="borrow-asset-asset"
                  showAssetLogo
                  asset={value}
                />
              )}
              className="min-w-[6.7rem]"
              menuClassName="max-h-[10rem] sm:max-h-[20rem]"
              dataAttribute="borrow-asset-select"
            />
          </div>
        </div>
        <div>
          {!isValidBorrowAmount && (
            <ErrorBadge
              level={ErrorLevel.Critical}
              message={t(pageTranslations.borrowForm.invalidAmountError)}
              dataAttribute="borrow-amount-error"
            />
          )}
        </div>
      </div>

      <SimpleTable>
        <SimpleTableRow
          label={t(translations.aavePage.borrowForm.borrowApr)}
          value={
            <AmountRenderer
              value={remainingSupply.toNumber()}
              suffix={borrowAsset}
            />
          }
        />
      </SimpleTable>

      <div>
        <div className="flex flex-row justify-between items-center mt-6 mb-3">
          <div className="flex flex-row justify-start items-center gap-2">
            <span>{t(translations.aavePage.borrowForm.collateralRatio)}</span>
          </div>
          <div className="">
            <AmountRenderer value={collateralRatio.toString()} suffix="%" />
          </div>
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
          value={t(translations.aavePage.common['n/a'])}
        />
        <SimpleTableRow
          label={t(translations.aavePage.borrowForm.tokenPrice, {
            token: borrowAsset,
          })}
          value={<AmountRenderer value={assetPrice} prefix={'$'} />}
        />
      </SimpleTable>

      <Checkbox
        checked={acknowledge}
        onChangeValue={setAcknowledge}
        label={
          <span>
            {t(translations.aavePage.borrowForm.acknowledge)}{' '}
            <Link text="Learn more" href="#learn-more" />{' '}
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
