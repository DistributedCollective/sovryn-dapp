import React, { FC, useCallback, useMemo, useState } from 'react';

import { t } from 'i18next';

import {
  Button,
  ErrorBadge,
  ErrorLevel,
  SelectOption,
  SimpleTable,
  SimpleTableRow,
  Tabs,
  TabType,
} from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { BOB_CHAIN_ID } from '../../../../../../../config/chains';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { AssetAmountInput } from '../../../../../../2_molecules/AssetAmountInput/AssetAmountInput';
import { AssetRenderer } from '../../../../../../2_molecules/AssetRenderer/AssetRenderer';
import { MINIMUM_COLLATERAL_RATIO_LENDING_POOLS_AAVE } from '../../../../../../../constants/aave';
import { useAaveUserReservesData } from '../../../../../../../hooks/aave/useAaveUserReservesData';
import { useAaveWithdraw } from '../../../../../../../hooks/aave/useAaveWithdraw';
import { useDecimalAmountInput } from '../../../../../../../hooks/useDecimalAmountInput';
import { translations } from '../../../../../../../locales/i18n';
import { TAB_ITEMS } from './WithdrawForm.constants';

const pageTranslations = translations.aavePage;

type WithdrawFormProps = {
  asset: string;
  onComplete: () => void;
};

export const WithdrawForm: FC<WithdrawFormProps> = ({ asset, onComplete }) => {
  const { handleWithdraw } = useAaveWithdraw();
  const { summary } = useAaveUserReservesData();
  const [withdrawAsset, setWithdrawAsset] = useState(asset);
  const [withdrawAmount, setWithdrawAmount, withdrawSize] =
    useDecimalAmountInput('');

  const withdrawableAssetsOptions = useMemo(
    () =>
      summary.reserves.reduce((acc, r) => {
        if (r.supplied.lte(0)) {
          return acc;
        }

        return [
          ...acc,
          {
            value: r.asset,
            label: (
              <AssetRenderer
                showAssetLogo
                asset={r.asset}
                assetClassName="font-medium"
                chainId={BOB_CHAIN_ID}
              />
            ),
          },
        ];
      }, [] as SelectOption<string>[]),
    [summary],
  );

  const withdrawReserve = useMemo(
    () => summary.reserves.find(r => r.reserve.symbol === withdrawAsset),
    [withdrawAsset, summary],
  );

  const availableLiquidity = useMemo(() => {
    const reserve = withdrawReserve?.reserve;
    if (!reserve) {
      return Decimal.from(0);
    }

    return Decimal.from(reserve.availableLiquidity).toUnits(reserve.decimals);
  }, [withdrawReserve]);

  const maximumWithdrawAmount = useMemo(() => {
    if (!withdrawReserve) {
      return Decimal.from(0);
    }

    // min collateral at which we reach minimum collateral ratio
    const minCollateralUsd = MINIMUM_COLLATERAL_RATIO_LENDING_POOLS_AAVE.mul(
      withdrawReserve.borrowedUsd,
    );
    const maxUsdWithdrawal = summary.supplyBalance.sub(minCollateralUsd);

    return maxUsdWithdrawal.gt(withdrawReserve.suppliedUsd)
      ? withdrawReserve.supplied // we can withdraw all, we'll still have collateral on other asset
      : maxUsdWithdrawal.div(withdrawReserve.reserve.priceInUSD); // only partial withdraw
  }, [withdrawReserve, summary.supplyBalance]);

  const withdrawAmountUsd = useMemo(
    () => withdrawSize.mul(withdrawReserve?.reserve.priceInUSD ?? 0),
    [withdrawSize, withdrawReserve],
  );

  const remainingSupply = useMemo(
    () => withdrawReserve?.supplied.sub(withdrawSize) ?? Decimal.from(0),
    [withdrawSize, withdrawReserve?.supplied],
  );

  const [isValidWithdrawAmount, errorMessage] = useMemo(() => {
    if (withdrawSize.eq(0)) {
      return [true, ''];
    }

    const liquidityEnough = withdrawSize.lte(availableLiquidity);
    const balanceEnough = withdrawSize.lte(maximumWithdrawAmount);

    if (!liquidityEnough) {
      return [
        false,
        t(pageTranslations.withdrawForm.notLiquidityEnoughError, {
          maxLiquidity: availableLiquidity.toString(2),
        }),
      ];
    }
    if (!balanceEnough) {
      return [false, t(pageTranslations.withdrawForm.invalidAmountError)];
    }

    return [true, ''];
  }, [withdrawSize, maximumWithdrawAmount, availableLiquidity]);

  const submitButtonDisabled = useMemo(
    () => !isValidWithdrawAmount || withdrawSize.lte(0),
    [isValidWithdrawAmount, withdrawSize],
  );

  const onConfirm = useCallback(
    () =>
      handleWithdraw(
        withdrawSize,
        withdrawAsset,
        withdrawSize.eq(maximumWithdrawAmount),
        { onComplete },
      ),
    [
      handleWithdraw,
      withdrawSize,
      withdrawAsset,
      onComplete,
      maximumWithdrawAmount,
    ],
  );

  return (
    <form className="flex flex-col gap-6">
      <div className="space-y-2">
        <Tabs type={TabType.secondary} index={0} items={TAB_ITEMS} />

        <div className="space-y-3">
          <AssetAmountInput
            chainId={BOB_CHAIN_ID}
            amountValue={withdrawAmount}
            assetUsdValue={withdrawAmountUsd}
            onAmountChange={setWithdrawAmount}
            invalid={!isValidWithdrawAmount}
            maxAmount={maximumWithdrawAmount}
            assetOptions={withdrawableAssetsOptions}
            onAssetChange={setWithdrawAsset}
            assetValue={withdrawAsset}
            amountLabel={t(translations.common.amount)}
          />
          {!isValidWithdrawAmount && (
            <ErrorBadge
              level={ErrorLevel.Critical}
              message={errorMessage}
              dataAttribute="withdraw-amount-error"
            />
          )}
        </div>
      </div>

      <SimpleTable>
        <SimpleTableRow
          label={t(translations.aavePage.withdrawForm.remainingSupply)}
          value={
            <AmountRenderer
              value={remainingSupply.toNumber()}
              suffix={withdrawAsset}
            />
          }
        />
      </SimpleTable>

      <Button
        disabled={submitButtonDisabled}
        onClick={onConfirm}
        text={t(translations.common.buttons.confirm)}
      />
    </form>
  );
};
