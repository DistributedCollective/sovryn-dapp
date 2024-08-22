import React, { FC, useMemo, useState } from 'react';

import { t } from 'i18next';

import { getAssetData } from '@sovryn/contracts';
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
import { useAaveReservesData } from '../../../../../../../hooks/aave/useAaveReservesData';
import { useAaveUserReservesData } from '../../../../../../../hooks/aave/useAaveUserReservesData';
import { useAaveWithdraw } from '../../../../../../../hooks/aave/useAaveWithdraw';
import { useDecimalAmountInput } from '../../../../../../../hooks/useDecimalAmountInput';
import { translations } from '../../../../../../../locales/i18n';

const pageTranslations = translations.aavePage;

type WithdrawFormProps = {
  asset: string;
  onSuccess: () => unknown;
};

export const WithdrawForm: FC<WithdrawFormProps> = ({ asset }) => {
  const { handleWithdraw } = useAaveWithdraw({});
  const reserves = useAaveReservesData();
  const userReservesSummary = useAaveUserReservesData();
  const [withdrawAsset, setWithdrawAsset] = useState<string>(asset);
  const [withdrawAmount, setWithdrawAmount, withdrawSize] =
    useDecimalAmountInput('');

  const withdrawableAssetsOptions = useMemo(
    () =>
      !userReservesSummary
        ? []
        : userReservesSummary.suppliedAssets.map(sa => ({
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
    [userReservesSummary],
  );

  const maximumWithdrawAmount: Decimal = useMemo(() => {
    if (!userReservesSummary) return Decimal.from(0);
    const sa = userReservesSummary.suppliedAssets.find(
      sa => sa.asset === withdrawAsset,
    );
    return sa ? sa.supplied : Decimal.from(0);
  }, [userReservesSummary, withdrawAsset]);

  const withdrawAmountUsd: Decimal = useMemo(() => {
    if (!reserves) return Decimal.from(0);
    const reserve = reserves.find(r => r.symbol === withdrawAsset);

    return reserve ? withdrawSize.mul(reserve.priceInUSD) : Decimal.from(0);
  }, [withdrawSize, reserves, withdrawAsset]);

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

  return (
    <form className="flex flex-col gap-6">
      <div className="space-y-2">
        <Tabs
          type={TabType.secondary}
          index={0}
          items={[
            // For now just withdraw is supported
            {
              activeClassName: 'text-primary-20',
              dataAttribute: 'withdraw',
              label: t(translations.common.withdraw),
            },
          ]}
        />

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
        onClick={async () => {
          handleWithdraw(
            withdrawSize,
            await getAssetData(withdrawAsset, BOB_CHAIN_ID),
          );
        }}
        text={t(translations.common.buttons.confirm)}
      />
    </form>
  );
};
