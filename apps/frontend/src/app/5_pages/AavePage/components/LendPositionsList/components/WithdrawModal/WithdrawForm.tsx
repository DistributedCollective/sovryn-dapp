import React, { FC, useCallback, useMemo, useState } from 'react';

import { t } from 'i18next';

import {
  AmountInput,
  Button,
  Select,
  SimpleTable,
  SimpleTableRow,
  Tabs,
  TabType,
} from '@sovryn/ui';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { AssetRenderer } from '../../../../../../2_molecules/AssetRenderer/AssetRenderer';
import { useDecimalAmountInput } from '../../../../../../../hooks/useDecimalAmountInput';
import { translations } from '../../../../../../../locales/i18n';

type WithdrawFormProps = {};

export const WithdrawForm: FC<WithdrawFormProps> = () => {
  const withdrawableAssets = useMemo(() => ['BTC', 'SOV'], []); // TODO: Mock data
  const [withdrawAsset, setWithdrawAsset] = useState<string>(
    withdrawableAssets[0],
  );
  const [maxWithdrawableAmount] = useState(10);
  const [withdrawAmount, setWithdrawAmount] = useDecimalAmountInput('');

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
                label: 'Withdraw',
              },
            ]}
          />
          <span className="text-xs underline">
            (Max{' '}
            <AmountRenderer
              value={maxWithdrawableAmount}
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
            labelRenderer={({ value }) => (
              <AssetRenderer
                dataAttribute="new-loan-collateral-asset"
                showAssetLogo
                asset={value}
              />
            )}
            className="min-w-[6.7rem]"
            menuClassName="max-h-[10rem] sm:max-h-[20rem]"
            dataAttribute="new-loan-collateral-select"
          />
        </div>
      </div>

      <div>
        <SimpleTable>
          <SimpleTableRow
            label={'Remaining'}
            value={<AmountRenderer value={1} suffix={withdrawAsset} />}
          />
        </SimpleTable>
      </div>

      <Button text="Confirm" />
    </form>
  );
};
