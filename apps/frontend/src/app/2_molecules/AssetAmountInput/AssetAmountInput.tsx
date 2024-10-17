import React, { FC, useCallback } from 'react';

import { AmountInput, Paragraph, Select, SelectOption } from '@sovryn/ui';
import { Decimal, Decimalish } from '@sovryn/utils';

import { AmountRenderer } from '../AmountRenderer/AmountRenderer';
import { AssetRenderer } from '../AssetRenderer/AssetRenderer';
import { MaxButton } from '../MaxButton/MaxButton';

type AssetAmountInputProps = {
  label?: string;
  chainId?: string | undefined;
  maxAmount?: Decimalish;
  invalid?: boolean;
  amountLabel?: string;
  amountValue?: string | number;
  onAmountChange?: (value: string) => void;
  assetValue: string;
  assetUsdValue?: Decimalish;
  assetOptions: SelectOption<string>[];
  onAssetChange: (asset: string) => void;
};

export const AssetAmountInput: FC<AssetAmountInputProps> = ({
  label,
  chainId,
  maxAmount,
  amountLabel,
  amountValue,
  onAmountChange,
  invalid,
  assetValue,
  assetUsdValue,
  assetOptions,
  onAssetChange,
}) => {
  const assetOptionRenderer = useCallback(
    ({ value }) => (
      <AssetRenderer
        chainId={chainId}
        dataAttribute="asset-amount"
        showAssetLogo
        asset={value}
      />
    ),
    [chainId],
  );

  return (
    <div>
      {label && (
        <Paragraph className="mb-1 text-gray-30 font-medium text-xs">
          {label}
        </Paragraph>
      )}

      <div className="relative">
        {maxAmount !== undefined && (
          <span className="absolute right-0 -top-3 -translate-y-1/2">
            <MaxButton
              token={assetValue}
              value={maxAmount}
              precision={2}
              onClick={() =>
                onAmountChange &&
                onAmountChange(Decimal.from(maxAmount).toString())
              }
            />
          </span>
        )}

        <div className="flex space-x-3">
          <div className="text-right flex-grow space-y-1">
            <AmountInput
              label={amountLabel}
              value={amountValue}
              onChangeText={onAmountChange}
              placeholder="0"
              invalid={invalid}
            />
            <AmountRenderer
              className="text-gray-40 mr-4"
              value={assetUsdValue ?? 0}
              precision={2}
              prefix="$"
            />
          </div>

          <Select
            value={assetValue}
            onChange={onAssetChange}
            options={assetOptions}
            labelRenderer={assetOptionRenderer}
            className="min-w-[6.7rem]"
            menuClassName="max-h-[10rem] sm:max-h-[20rem]"
          />
        </div>
      </div>
    </div>
  );
};
