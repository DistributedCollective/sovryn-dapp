import React, { FC, useCallback, useState } from 'react';

import {
  AmountInput,
  Paragraph,
  ParagraphSize,
  Select,
  SelectOption,
} from '@sovryn/ui';
import { Decimal, Decimalish } from '@sovryn/utils';

import { AmountRenderer } from '../AmountRenderer/AmountRenderer';
import { AssetRenderer } from '../AssetRenderer/AssetRenderer';
import { MaxButton } from '../MaxButton/MaxButton';

type AssetAmountInputProps = {
  label?: string;
  maxAmount?: Decimalish;
  invalid?: boolean;
  amountLabel?: string;
  amountValue?: string | number;
  onAmountChange?: (value: string) => unknown;
  assetValue: string;
  assetOptions: SelectOption<string>[];
  onAssetChange: (asset: string) => unknown;
};

export const AssetAmountInput: FC<AssetAmountInputProps> = ({
  label,
  maxAmount,
  amountLabel,
  amountValue,
  onAmountChange,
  invalid,
  assetValue,
  assetOptions,
  onAssetChange,
}) => {
  const [assetUsdValue] = useState(0); // TODO: mock

  const assetOptionRenderer = useCallback(
    ({ value }) => (
      <AssetRenderer dataAttribute="asset-amount" showAssetLogo asset={value} />
    ),
    [],
  );

  return (
    <div>
      {label && (
        <Paragraph
          size={ParagraphSize.base}
          className="mb-1 text-gray-30 font-medium"
        >
          {label}
        </Paragraph>
      )}

      <div className="relative">
        {maxAmount !== undefined && (
          <span className="absolute right-0 -top-3 -translate-y-1/2">
            <MaxButton
              token={assetValue}
              value={maxAmount ?? 0}
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
              value={assetUsdValue}
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
            dataAttribute="asset-select"
          />
        </div>
      </div>
    </div>
  );
};
