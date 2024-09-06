import React, { FC, useCallback, useMemo, useState } from 'react';

import { t } from 'i18next';

import {
  Button,
  ErrorBadge,
  ErrorLevel,
  SimpleTable,
  SimpleTableRow,
} from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { BOB_CHAIN_ID } from '../../../../../../../config/chains';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { AssetAmountInput } from '../../../../../../2_molecules/AssetAmountInput/AssetAmountInput';
import { AssetRenderer } from '../../../../../../2_molecules/AssetRenderer/AssetRenderer';
import { useAaveReservesData } from '../../../../../../../hooks/aave/useAaveReservesData';
import { useAaveSupply } from '../../../../../../../hooks/aave/useAaveSupply';
import { useAccount } from '../../../../../../../hooks/useAccount';
import { useAssetBalance } from '../../../../../../../hooks/useAssetBalance';
import { useDecimalAmountInput } from '../../../../../../../hooks/useDecimalAmountInput';
import { translations } from '../../../../../../../locales/i18n';

const pageTranslations = translations.aavePage;

type LendFormProps = {
  asset: string;
  onComplete: () => void;
};

export const LendForm: FC<LendFormProps> = ({
  asset: initialAsset,
  onComplete,
}) => {
  const { account } = useAccount();
  const { reserves } = useAaveReservesData();
  const [lendAsset, setLendAsset] = useState(initialAsset);
  const [lendAmount, setLendAmount, lendSize] = useDecimalAmountInput('');
  const { balance: lendAssetBalance } = useAssetBalance(
    lendAsset,
    BOB_CHAIN_ID,
    account,
  );
  const { handleDeposit } = useAaveSupply();

  const lendAssetsOptions = useMemo(
    () =>
      reserves.map(r => ({
        value: r.symbol,
        label: (
          <AssetRenderer
            showAssetLogo
            asset={r.symbol}
            assetClassName="font-medium"
            chainId={BOB_CHAIN_ID}
          />
        ),
      })),
    [reserves],
  );

  const reserve = useMemo(() => {
    return reserves.find(r => r.symbol === lendAsset) ?? reserves[0];
  }, [reserves, lendAsset]);

  const assetUsdValue = useMemo(() => {
    return Decimal.from(reserve?.priceInUSD ?? 0).mul(lendSize);
  }, [reserve, lendSize]);

  const supplyApy = useMemo(() => {
    return Decimal.from(reserve?.supplyAPY ?? 0).mul(100);
  }, [reserve]);

  const isValidLendAmount = useMemo(
    () => (lendSize.gt(0) ? lendSize.lte(lendAssetBalance) : true),
    [lendSize, lendAssetBalance],
  );

  const isDepositEnabled = useMemo(
    () => lendSize.gt(0) && isValidLendAmount,
    [lendSize, isValidLendAmount],
  );

  const onConfirm = useCallback(() => {
    handleDeposit(lendSize, reserve.symbol, { onComplete });
  }, [handleDeposit, lendSize, reserve, onComplete]);

  return (
    <form className="flex flex-col gap-6">
      <div>
        <AssetAmountInput
          chainId={BOB_CHAIN_ID}
          label={t(translations.aavePage.common.lend)}
          maxAmount={lendAssetBalance}
          amountLabel={t(translations.common.amount)}
          amountValue={lendAmount}
          onAmountChange={setLendAmount}
          invalid={!isValidLendAmount}
          assetValue={lendAsset}
          assetUsdValue={assetUsdValue}
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
          value={<AmountRenderer value={supplyApy} suffix="%" precision={2} />}
        />
        <SimpleTableRow
          label={t(translations.aavePage.lendModal.collateralization)}
          value={t(
            reserve?.usageAsCollateralEnabled
              ? translations.aavePage.lendModal.enabled
              : translations.aavePage.lendModal.disabled,
          )}
        />
      </SimpleTable>

      <Button
        disabled={!isDepositEnabled}
        onClick={onConfirm}
        text={t(translations.aavePage.lendModal.deposit)}
      />
    </form>
  );
};
