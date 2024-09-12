import React, { FC, useCallback, useMemo, useState } from 'react';

import { t } from 'i18next';

import {
  Button,
  Checkbox,
  ErrorBadge,
  ErrorLevel,
  Link,
  SelectOption,
  SimpleTable,
  SimpleTableRow,
} from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { BOB_CHAIN_ID } from '../../../../../../../config/chains';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { AssetAmountInput } from '../../../../../../2_molecules/AssetAmountInput/AssetAmountInput';
import { AssetRenderer } from '../../../../../../2_molecules/AssetRenderer/AssetRenderer';
import { MINIMUM_COLLATERAL_RATIO_LENDING_POOLS_AAVE } from '../../../../../../../constants/aave';
import { useAaveBorrow } from '../../../../../../../hooks/aave/useAaveBorrow';
import { useAaveUserReservesData } from '../../../../../../../hooks/aave/useAaveUserReservesData';
import { useDecimalAmountInput } from '../../../../../../../hooks/useDecimalAmountInput';
import { translations } from '../../../../../../../locales/i18n';
import { BorrowRateMode } from '../../../../../../../types/aave';
import { AaveCalculations } from '../../../../../../../utils/aave/AaveCalculations';
import { CollateralRatioHealthBar } from '../../../CollateralRatioHealthBar/CollateralRatioHealthBar';

const pageTranslations = translations.aavePage;

type BorrowFormProps = {
  asset: string;
  onComplete: () => void;
};

export const BorrowForm: FC<BorrowFormProps> = ({ asset, onComplete }) => {
  const { summary } = useAaveUserReservesData();
  const [borrowAsset, setBorrowAsset] = useState<string>(asset);
  const [borrowAmount, setBorrowAmount, borrowSize] = useDecimalAmountInput('');
  const [acknowledge, setAcknowledge] = useState(false);
  const { handleBorrow } = useAaveBorrow();

  const borrowableAssetsOptions = useMemo(
    () =>
      summary.reserves.reduce((acc, r) => {
        if (r.reserve.borrowingEnabled) {
          acc.push({
            value: r.reserve.symbol,
            label: (
              <AssetRenderer
                showAssetLogo
                asset={r.reserve.symbol}
                chainId={BOB_CHAIN_ID}
                assetClassName="font-medium"
              />
            ),
          });
        }
        return acc;
      }, [] as SelectOption<string>[]),
    [summary.reserves],
  );

  const borrowReserve = useMemo(
    () => summary.reserves.find(r => r.reserve.symbol === borrowAsset),
    [summary.reserves, borrowAsset],
  );

  const borrowUsdAmount = useMemo(
    () => borrowSize.mul(borrowReserve?.reserve.priceInUSD ?? 0),
    [borrowSize, borrowReserve?.reserve.priceInUSD],
  );

  const maximumBorrowAmount = useMemo(
    () => borrowReserve?.availableToBorrow ?? Decimal.from(0),
    [borrowReserve?.availableToBorrow],
  );

  const newCollateralRatio = useMemo(
    () =>
      AaveCalculations.computeCollateralRatio(
        summary.collateralBalance,
        summary.borrowBalance.add(borrowUsdAmount),
      ),
    [summary.collateralBalance, summary.borrowBalance, borrowUsdAmount],
  );

  const liquidationPrice = useMemo(
    () =>
      AaveCalculations.computeLiquidationPrice(
        borrowSize,
        summary.currentLiquidationThreshold,
        summary.collateralBalance,
      ),
    [
      borrowSize,
      summary.currentLiquidationThreshold,
      summary.collateralBalance,
    ],
  );

  const borrowApr = useMemo(
    () => Decimal.from(borrowReserve?.reserve.variableBorrowAPR ?? 0).mul(100),
    [borrowReserve?.reserve.variableBorrowAPR],
  );

  const isValidBorrowAmount = useMemo(
    () => (borrowSize.gt(0) ? borrowSize.lte(maximumBorrowAmount) : true),
    [borrowSize, maximumBorrowAmount],
  );

  const onConfirm = useCallback(
    () =>
      handleBorrow(
        borrowSize,
        borrowReserve!.reserve.symbol,
        BorrowRateMode.VARIABLE,
        { onComplete },
      ),
    [onComplete, borrowSize, borrowReserve, handleBorrow],
  );

  const isConfirmDisabled = useMemo(
    () =>
      !isValidBorrowAmount ||
      borrowSize.lte(0) ||
      !acknowledge ||
      !borrowReserve,
    [isValidBorrowAmount, borrowSize, acknowledge, borrowReserve],
  );

  return (
    <form className="flex flex-col gap-6">
      <div className="space-y-3">
        <AssetAmountInput
          label={t(translations.aavePage.common.borrow)}
          chainId={BOB_CHAIN_ID}
          amountLabel={t(translations.common.amount)}
          amountValue={borrowAmount}
          assetUsdValue={borrowUsdAmount}
          onAmountChange={setBorrowAmount}
          maxAmount={maximumBorrowAmount}
          invalid={!isValidBorrowAmount}
          assetValue={borrowAsset}
          onAssetChange={setBorrowAsset}
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
          value={<AmountRenderer value={borrowApr} suffix="%" precision={2} />}
        />
      </SimpleTable>

      <CollateralRatioHealthBar
        ratio={Decimal.from(newCollateralRatio)}
        minimum={MINIMUM_COLLATERAL_RATIO_LENDING_POOLS_AAVE}
      />

      <SimpleTable>
        <SimpleTableRow
          label={t(translations.aavePage.borrowForm.liquidationPrice)}
          value={
            <AmountRenderer value={liquidationPrice} precision={2} prefix="$" />
          }
        />
        <SimpleTableRow
          label={t(translations.aavePage.borrowForm.tokenPrice, {
            token: borrowAsset,
          })}
          value={
            <AmountRenderer
              value={borrowReserve?.reserve.priceInUSD ?? 0}
              precision={2}
              prefix="$"
            />
          }
        />
      </SimpleTable>

      <Checkbox
        checked={acknowledge}
        onChangeValue={setAcknowledge}
        label={
          <span>
            {t(translations.aavePage.borrowForm.acknowledge)}{' '}
            <Link
              text={t(translations.aavePage.borrowForm.learnMore)}
              href="#learn-more"
            />
            {/* TODO: Add proper learn more href */}
          </span>
        }
      />

      <Button
        onClick={onConfirm}
        disabled={isConfirmDisabled}
        text={t(translations.common.buttons.confirm)}
      />
    </form>
  );
};
