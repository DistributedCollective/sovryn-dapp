import React, { FC, useCallback } from 'react';

import {
  AmountInput,
  Paragraph,
  ParagraphSize,
  Select,
  SelectOption,
} from '@sovryn/ui';
import { Decimalish } from '@sovryn/utils';

import { AmountRenderer } from '../AmountRenderer/AmountRenderer';
import { AssetRenderer } from '../AssetRenderer/AssetRenderer';

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
  const assetOptionRenderer = useCallback(
    ({ value }) => (
      <AssetRenderer
        dataAttribute="borrow-asset-asset"
        showAssetLogo
        asset={value}
      />
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
          <span className="text-xs underline absolute right-0 -top-3 -translate-y-1/2">
            (Max{' '}
            <AmountRenderer value={maxAmount} suffix={assetValue} prefix="~" />)
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
            <div className="pr-4">
              <AmountRenderer
                className="text-gray-40"
                value={0} // TODO: usd equivalent
                prefix="$"
              />
            </div>
          </div>

          <Select
            value={assetValue}
            onChange={onAssetChange}
            options={assetOptions}
            labelRenderer={assetOptionRenderer}
            className="min-w-[6.7rem]"
            menuClassName="max-h-[10rem] sm:max-h-[20rem]"
            dataAttribute="borrow-asset-select"
          />
        </div>
      </div>
    </div>
  );
};
