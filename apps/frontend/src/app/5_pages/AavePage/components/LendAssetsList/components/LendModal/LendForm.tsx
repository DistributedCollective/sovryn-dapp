import React, { FC, useMemo, useState } from 'react';

import { t } from 'i18next';

import {
  Button,
  ErrorBadge,
  ErrorLevel,
  SimpleTable,
  SimpleTableRow,
} from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { AssetAmountInput } from '../../../../../../2_molecules/AssetAmountInput/AssetAmountInput';
import { AssetRenderer } from '../../../../../../2_molecules/AssetRenderer/AssetRenderer';
import { useDecimalAmountInput } from '../../../../../../../hooks/useDecimalAmountInput';
import { translations } from '../../../../../../../locales/i18n';

const pageTranslations = translations.aavePage;

type LendFormProps = {
  onSuccess: () => unknown;
};

export const LendForm: FC<LendFormProps> = () => {
  const lendApy = 4.01; // TODO: this is mocked data. Replace with proper hook
  const lendAssets = useMemo(() => ['BTC', 'SOV'], []); // TODO: this is mocked data. Replace with proper hook
  const [maximumLendAmount] = useState<Decimal>(Decimal.from(10)); // TODO: this is mocked data. Replace with proper hook
  const [lendAsset, setLendAsset] = useState<string>(lendAssets[0]);
  const [lendAmount, setLendAmount, lendSize] = useDecimalAmountInput('');

  const lendAssetsOptions = useMemo(
    () =>
      lendAssets.map(token => ({
        value: token,
        label: (
          <AssetRenderer
            showAssetLogo
            asset={token}
            assetClassName="font-medium"
          />
        ),
      })),
    [lendAssets],
  );

  const isValidLendAmount = useMemo(
    () => (lendSize.gt(0) ? lendSize.lte(maximumLendAmount) : true),
    [lendSize, maximumLendAmount],
  );

  const submitButtonDisabled = useMemo(
    () => !isValidLendAmount || lendSize.lte(0),
    [isValidLendAmount, lendSize],
  );

  return (
    <form className="flex flex-col gap-6">
      <div>
        <AssetAmountInput
          label={t(translations.aavePage.common.lend)}
          maxAmount={maximumLendAmount}
          amountLabel={t(translations.common.amount)}
          amountValue={lendAmount}
          onAmountChange={setLendAmount}
          invalid={!isValidLendAmount}
          assetValue={lendAsset}
          onAssetChange={setLendAsset}
          assetOptions={lendAssetsOptions}
        />

        {!isValidLendAmount && (
          <ErrorBadge
            level={ErrorLevel.Critical}
            message={t(pageTranslations.lendModal.invalidAmountError)}
            dataAttribute="lend-amount-error"
          />
        )}
      </div>

      <SimpleTable>
        <SimpleTableRow
          label={t(translations.aavePage.lendModal.lendApy)}
          value={<AmountRenderer value={lendApy} suffix={'%'} />}
        />
        <SimpleTableRow
          label={t(translations.aavePage.lendModal.collateralization)}
          value={t(translations.aavePage.lendModal.enabled)}
        />
      </SimpleTable>

      <Button
        disabled={submitButtonDisabled}
        text={t(translations.aavePage.lendModal.deposit)}
      />
    </form>
  );
};
