import React, { FC, useCallback, useMemo, useState } from 'react';

import { t } from 'i18next';

import {
  AmountInput,
  Button,
  ErrorBadge,
  ErrorLevel,
  Select,
  SimpleTable,
  SimpleTableRow,
  Tabs,
  TabType,
} from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { AssetRenderer } from '../../../../../../2_molecules/AssetRenderer/AssetRenderer';
import { useDecimalAmountInput } from '../../../../../../../hooks/useDecimalAmountInput';
import { translations } from '../../../../../../../locales/i18n';

const pageTranslations = translations.aavePage;

type WithdrawFormProps = {
  onSuccess: () => unknown;
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

  const withdrawLabelRenderer = useCallback(
    ({ value }) => (
      <AssetRenderer
        dataAttribute="withdraw-asset-select"
        showAssetLogo
        asset={value}
      />
    ),
    [],
  );

  return (
    <form className="flex flex-col gap-6">
      <div className="space-y-3">
        <div className="flex justify-between items-end">
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
          <span className="text-xs underline">
            (Max{' '}
            <AmountRenderer
              value={maximumWithdrawAmount}
              suffix={withdrawAsset}
              prefix="~"
            />
            )
          </span>
        </div>

        <div className="flex space-x-3">
          <div className="text-right flex-grow space-y-1">
            <AmountInput
              label={t(translations.common.amount)}
              value={withdrawAmount}
              onChangeText={setWithdrawAmount}
              placeholder="0"
              invalid={!isValidWithdrawAmount}
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
            value={withdrawAsset}
            onChange={onWithdrawAssetChange}
            options={withdrawableAssetsOptions}
            labelRenderer={withdrawLabelRenderer}
            className="min-w-[6.7rem]"
            menuClassName="max-h-[10rem] sm:max-h-[20rem]"
            dataAttribute="withdraw-asset-select"
          />
        </div>
      </div>

      <div>
        {!isValidWithdrawAmount && (
          <ErrorBadge
            level={ErrorLevel.Critical}
            message={t(pageTranslations.withdrawForm.invalidAmountError)}
            dataAttribute="withdraw-amount-error"
          />
        )}
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
