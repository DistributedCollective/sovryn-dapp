import React, { FC, useCallback, useMemo, useState } from 'react';

import { t } from 'i18next';

import {
  Button,
  ErrorBadge,
  ErrorLevel,
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
import { useAaveUserReservesData } from '../../../../../../../hooks/aave/useAaveUserReservesData';
import { useAaveWithdraw } from '../../../../../../../hooks/aave/useAaveWithdraw';
import { useDecimalAmountInput } from '../../../../../../../hooks/useDecimalAmountInput';
import { translations } from '../../../../../../../locales/i18n';

const pageTranslations = translations.aavePage;

type WithdrawFormProps = {
  asset: string;
  onComplete: () => void;
};

export const WithdrawForm: FC<WithdrawFormProps> = ({ asset, onComplete }) => {
  const { handleWithdraw } = useAaveWithdraw();
  const { summary } = useAaveUserReservesData();
  const [withdrawAsset, setWithdrawAsset] = useState<string>(asset);
  const [withdrawAmount, setWithdrawAmount, withdrawSize] =
    useDecimalAmountInput('');

  const withdrawableAssetsOptions = useMemo(
    () =>
      summary.reserves
        .filter(r => r.supplied.gt(0))
        .map(sa => ({
          value: sa.asset,
          label: (
            <AssetRenderer
              showAssetLogo
              asset={sa.asset}
              assetClassName="font-medium"
              chainId={BOB_CHAIN_ID}
            />
          ),
        })),
    [summary],
  );

  const withdrawReserve = useMemo(() => {
    return summary.reserves.find(r => r.reserve.symbol === withdrawAsset);
  }, [withdrawAsset, summary]);

  const maximumWithdrawAmount: Decimal = useMemo(() => {
    return withdrawReserve ? withdrawReserve.supplied : Decimal.from(0);
  }, [withdrawReserve]);

  const withdrawAmountUsd: Decimal = useMemo(() => {
    return withdrawReserve
      ? withdrawSize.mul(withdrawReserve.reserve.priceInUSD)
      : Decimal.from(0);
  }, [withdrawSize, withdrawReserve]);

  const remainingSupply = useMemo(
    () => maximumWithdrawAmount.sub(withdrawSize),
    [withdrawSize, maximumWithdrawAmount],
  );

  const isValidWithdrawAmount = useMemo(
    () => (withdrawSize.gt(0) ? withdrawSize.lte(maximumWithdrawAmount) : true),
    [withdrawSize, maximumWithdrawAmount],
  );

  const submitButtonDisabled = useMemo(
    () => !isValidWithdrawAmount || withdrawSize.lte(0),
    [isValidWithdrawAmount, withdrawSize],
  );

  const tabItems = useMemo(
    () => [
      // For now just withdraw is supported
      {
        activeClassName: 'text-primary-20',
        dataAttribute: 'withdraw',
        label: t(translations.common.withdraw),
      },
    ],
    [],
  );

  const onConfirm = useCallback(() => {
    handleWithdraw(
      withdrawSize,
      withdrawAsset,
      withdrawSize.eq(maximumWithdrawAmount),
      { onComplete },
    );
  }, [
    handleWithdraw,
    withdrawSize,
    withdrawAsset,
    onComplete,
    maximumWithdrawAmount,
  ]);

  return (
    <form className="flex flex-col gap-6">
      <div className="space-y-2">
        <Tabs type={TabType.secondary} index={0} items={tabItems} />

        <div className="space-y-3">
          <AssetAmountInput
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
              message={t(pageTranslations.withdrawForm.invalidAmountError)}
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
