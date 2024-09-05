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

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { AssetAmountInput } from '../../../../../../2_molecules/AssetAmountInput/AssetAmountInput';
import { AssetRenderer } from '../../../../../../2_molecules/AssetRenderer/AssetRenderer';
import { useDecimalAmountInput } from '../../../../../../../hooks/useDecimalAmountInput';
import { translations } from '../../../../../../../locales/i18n';

const pageTranslations = translations.aavePage;

type WithdrawFormProps = {
  onSuccess: () => void;
};

export const WithdrawForm: FC<WithdrawFormProps> = () => {
  const withdrawableAssets = useMemo(() => ['BTC', 'SOV'], []); // TODO: this is mocked data. Replace with proper hook
  const [maximumWithdrawAmount] = useState<Decimal>(Decimal.from(10)); // TODO: this is mocked data. Replace with proper hook
  const [withdrawAsset, setWithdrawAsset] = useState<string>(
    withdrawableAssets[0],
  );
  const [withdrawAmount, setWithdrawAmount, withdrawSize] =
    useDecimalAmountInput('');

  const onWithdrawAssetChange = useCallback(v => {
    setWithdrawAsset(v);
  }, []);

  const withdrawableAssetsOptions = useMemo(
    () =>
      withdrawableAssets.map(token => ({
        value: token,
        label: (
          <AssetRenderer
            showAssetLogo
            asset={token}
            assetClassName="font-medium"
          />
        ),
      })),
    [withdrawableAssets],
  );

  const isValidWithdrawAmount = useMemo(
    () => (withdrawSize.gt(0) ? withdrawSize.lte(maximumWithdrawAmount) : true),
    [withdrawSize, maximumWithdrawAmount],
  );

  const remainingSupply = useMemo(
    () => maximumWithdrawAmount.sub(withdrawSize),
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
            onAmountChange={setWithdrawAmount}
            invalid={!isValidWithdrawAmount}
            maxAmount={maximumWithdrawAmount}
            assetOptions={withdrawableAssetsOptions}
            onAssetChange={onWithdrawAssetChange}
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
        text={t(translations.common.buttons.confirm)}
      />
    </form>
  );
};
