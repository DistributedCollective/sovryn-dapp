import React, { FC, useMemo, useState } from 'react';

import { t } from 'i18next';

import { getAssetData } from '@sovryn/contracts';
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
import { useAaveRepay } from '../../../../../../../hooks/aave/useAaveRepay';
import { useAaveUserReservesData } from '../../../../../../../hooks/aave/useAaveUserReservesData';
import { useAccount } from '../../../../../../../hooks/useAccount';
import { useAssetBalance } from '../../../../../../../hooks/useAssetBalance';
import { useDecimalAmountInput } from '../../../../../../../hooks/useDecimalAmountInput';
import { translations } from '../../../../../../../locales/i18n';
import { AaveCalculations } from '../../../../../../../utils/aave/AaveCalculations';
import { CollateralRatioHealthBar } from '../../../CollateralRatioHealthBar/CollateralRatioHealthBar';

const pageTranslations = translations.aavePage;

type RepayWithWalletBalanceFormProps = {
  asset: string;
  onSuccess: () => void;
};

export const RepayWithWalletBalanceForm: FC<
  RepayWithWalletBalanceFormProps
> = ({ asset, onSuccess }) => {
  const { account } = useAccount();
  const { handleRepay } = useAaveRepay();
  const userReservesSummary = useAaveUserReservesData();
  const [repayAsset, setRepayAsset] = useState<string>(asset);
  const [repayAmount, setRepayAmount, repaySize] = useDecimalAmountInput('');
  const { balance: repayAssetBalance } = useAssetBalance(
    repayAsset,
    BOB_CHAIN_ID,
    account,
  );

  const repayAssetsOptions = useMemo(
    () =>
      userReservesSummary.reserves
        .filter(r => r.borrowed.gt(0))
        .map(ba => ({
          value: ba.asset,
          label: (
            <AssetRenderer
              showAssetLogo
              asset={ba.asset}
              assetClassName="font-medium"
              chainId={BOB_CHAIN_ID}
            />
          ),
        })),
    [userReservesSummary],
  );

  const repayReserve = useMemo(() => {
    return userReservesSummary.reserves.find(
      r => r.reserve.symbol === repayAsset,
    );
  }, [userReservesSummary.reserves, repayAsset]);

  const maximumRepayAmount = useMemo(() => {
    return repayReserve
      ? repayReserve.borrowed.gt(repayAssetBalance)
        ? repayAssetBalance
        : repayReserve.borrowed
      : Decimal.from(0);
  }, [repayReserve, repayAssetBalance]);

  const repayUsdAmount = useMemo(() => {
    return repaySize.mul(repayReserve?.reserve.priceInUSD ?? 0);
  }, [repaySize, repayReserve]);

  const newDebtAmount = useMemo(() => {
    const newDebt = repayReserve?.borrowed
      ? repayReserve.borrowed.sub(repaySize)
      : Decimal.from(0);

    // avoid negatives:
    return newDebt.gt(0) ? newDebt : Decimal.from(0);
  }, [repayReserve?.borrowed, repaySize]);

  const newDebtAmountUSD = useMemo(() => {
    return newDebtAmount.mul(repayReserve?.reserve.priceInUSD ?? 0);
  }, [newDebtAmount, repayReserve]);

  const newCollateralRatio = useMemo(() => {
    return AaveCalculations.computeCollateralRatio(
      userReservesSummary.collateralBalance,
      userReservesSummary.borrowBalance.add(newDebtAmountUSD),
    );
  }, [userReservesSummary, newDebtAmountUSD]);

  const isValidRepayAmount = useMemo(
    () => (repaySize.gt(0) ? repaySize.lte(maximumRepayAmount) : true),
    [repaySize, maximumRepayAmount],
  );

  return (
    <form className="flex flex-col gap-6 relative">
      <div className="space-y-3">
        <AssetAmountInput
          maxAmount={maximumRepayAmount}
          amountLabel={t(translations.common.amount)}
          amountValue={repayAmount}
          onAmountChange={setRepayAmount}
          invalid={!isValidRepayAmount}
          assetValue={repayAsset}
          assetUsdValue={repayUsdAmount}
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
        ratio={newCollateralRatio}
        minimum={config.MinCollateralRatio}
      />

      <SimpleTable>
        <SimpleTableRow
          label={t(translations.aavePage.repayModal.remainingDebt)}
          value={
            <div className="space-y-1">
              <AmountTransition
                className="justify-end"
                from={{
                  precision: 2,
                  value: repayReserve?.borrowed ?? Decimal.from(0),
                  suffix: repayAsset,
                }}
                to={{ value: newDebtAmount, suffix: repayAsset, precision: 2 }}
              />
              <AmountTransition
                className="justify-end text-gray-40"
                from={{
                  precision: 2,
                  value: repayReserve?.borrowedUSD ?? Decimal.from(0),
                  prefix: '$',
                }}
                to={{
                  precision: 2,
                  value: newDebtAmountUSD,
                  prefix: '$',
                }}
              />
            </div>
          }
        />
        <SimpleTableRow
          label={t(translations.aavePage.common.collateralRatio)}
          value={
            <AmountTransition
              className="justify-end"
              from={{
                value: userReservesSummary.collateralRatio.mul(100),
                suffix: '%',
                precision: 2,
              }}
              to={{
                precision: 2,
                value: newCollateralRatio.mul(100),
                suffix: '%',
                className: 'text-primary-10',
                infiniteFrom: Decimal.from('10000'),
              }}
            />
          }
        />
      </SimpleTable>

      <Button
        disabled={!isValidRepayAmount}
        text={t(translations.common.buttons.confirm)}
        onClick={async () => {
          handleRepay(
            repaySize,
            await getAssetData(repayAsset, BOB_CHAIN_ID),
            repayReserve!.borrowRateMode,
            { onComplete: onSuccess },
          );
        }}
      />
    </form>
  );
};
