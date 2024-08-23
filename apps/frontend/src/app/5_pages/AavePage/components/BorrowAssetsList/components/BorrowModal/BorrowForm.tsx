import React, { FC, useMemo, useState } from 'react';

import { t } from 'i18next';

import { getAssetData } from '@sovryn/contracts';
import {
  Button,
  Checkbox,
  ErrorBadge,
  ErrorLevel,
  Link,
  SimpleTable,
  SimpleTableRow,
} from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { BOB_CHAIN_ID } from '../../../../../../../config/chains';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { AssetAmountInput } from '../../../../../../2_molecules/AssetAmountInput/AssetAmountInput';
import { AssetRenderer } from '../../../../../../2_molecules/AssetRenderer/AssetRenderer';
import { config } from '../../../../../../../constants/aave';
import { useAaveBorrow } from '../../../../../../../hooks/aave/useAaveBorrow';
import { useAaveReservesData } from '../../../../../../../hooks/aave/useAaveReservesData';
import { useAaveUserReservesData } from '../../../../../../../hooks/aave/useAaveUserReservesData';
import { useDecimalAmountInput } from '../../../../../../../hooks/useDecimalAmountInput';
import { translations } from '../../../../../../../locales/i18n';
import { BorrowRateMode } from '../../../../../../../utils/aave/AaveBorrowTransactionsFactory';
import { CollateralRatioHealthBar } from '../../../CollateralRatioHealthBar/CollateralRatioHealthBar';

const pageTranslations = translations.aavePage;

type BorrowFormProps = {
  asset: string;
  onSuccess: () => unknown;
};

export const BorrowForm: FC<BorrowFormProps> = ({ asset }) => {
  const reserves = useAaveReservesData();
  const userReservesSummary = useAaveUserReservesData();
  const [borrowAsset, setBorrowAsset] = useState<string>(asset);
  const [borrowAmount, setBorrowAmount, borrowSize] = useDecimalAmountInput('');
  const [acknowledge, setAcknowledge] = useState<boolean>(false);
  const { handleBorrow } = useAaveBorrow({});

  const reserve = useMemo(() => {
    return reserves.find(r => r.symbol === borrowAsset);
  }, [reserves, borrowAsset]);

  const variableBorrowAPR = useMemo(() => {
    if (!reserve) return Decimal.from(0);
    return Decimal.from(reserve.variableBorrowAPR).mul(100);
  }, [reserve]);

  const maximumBorrowAmount = useMemo(() => {
    if (!reserve || !userReservesSummary) return Decimal.from(0);

    // deducted from hf=kte/borrowed => newhf=kte/borrowed+new_borrow => MinHealthFactor = newhf
    return userReservesSummary.borrowBalance.mul(
      userReservesSummary.healthFactor.div(config.MinHealthFactor).sub(1),
    );
  }, [userReservesSummary, reserve]);

  const borrowUsdAmount = useMemo(() => {
    return borrowSize.mul(reserve?.priceInUSD ?? 0);
  }, [borrowSize, reserve]);

  const borrowableAssetsOptions = useMemo(
    () =>
      reserves.map(r => ({
        value: r.symbol,
        label: (
          <AssetRenderer
            showAssetLogo
            asset={r.symbol}
            chainId={BOB_CHAIN_ID}
            assetClassName="font-medium"
          />
        ),
      })),
    [reserves],
  );

  const isValidBorrowAmount = useMemo(
    () => (borrowSize.gt(0) ? borrowSize.lte(maximumBorrowAmount) : true),
    [borrowSize, maximumBorrowAmount],
  );

  const collateralRatio = useMemo(() => {
    if (!userReservesSummary) return Decimal.from(0);
    const newHealthFactor = userReservesSummary.healthFactor
      .mul(userReservesSummary.borrowBalance)
      .div(userReservesSummary.borrowBalance.add(borrowUsdAmount));

    return newHealthFactor.div(userReservesSummary.currentLiquidationThreshold);
  }, [userReservesSummary, borrowUsdAmount]);

  const liquidationPrice = useMemo(() => {
    if (!borrowSize || !reserve || !userReservesSummary) {
      return Decimal.from(0);
    }

    return borrowSize
      .mul(userReservesSummary.currentLiquidationThreshold)
      .div(userReservesSummary.collateralBalance);
  }, [borrowSize, reserve, userReservesSummary]);

  const submitButtonDisabled = useMemo(
    () => !isValidBorrowAmount || borrowSize.lte(0) || !acknowledge || !reserve,
    [isValidBorrowAmount, borrowSize, acknowledge, reserve],
  );

  return (
    <form className="flex flex-col gap-6">
      <div className="space-y-3">
        <AssetAmountInput
          label={t(translations.aavePage.common.borrow)}
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
          value={
            <AmountRenderer
              value={variableBorrowAPR}
              suffix={'%'}
              precision={2}
            />
          }
        />
      </SimpleTable>

      <CollateralRatioHealthBar ratio={collateralRatio} />

      <SimpleTable>
        <SimpleTableRow
          label={t(translations.aavePage.borrowForm.liquidationPrice)}
          value={
            <AmountRenderer
              value={liquidationPrice}
              precision={2}
              prefix={'$'}
            />
          }
        />
        <SimpleTableRow
          label={t(translations.aavePage.borrowForm.tokenPrice, {
            token: borrowAsset,
          })}
          value={
            <AmountRenderer
              value={reserve?.priceInUSD ?? 0}
              precision={2}
              prefix={'$'}
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
            <Link text="Learn more" href="#learn-more" />
            {/* TODO: Add proper learn more href */}
          </span>
        }
      />

      <Button
        onClick={async () => {
          handleBorrow(
            borrowSize,
            await getAssetData(reserve!.symbol, BOB_CHAIN_ID),
            BorrowRateMode.VARIABLE,
          );
        }}
        disabled={submitButtonDisabled}
        text={t(translations.common.buttons.confirm)}
      />
    </form>
  );
};
