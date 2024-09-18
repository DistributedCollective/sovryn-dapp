import React, { FC, useCallback } from 'react';

import { t } from 'i18next';

import {
  Dropdown,
  DropdownMode,
  FilterPill,
  Menu,
  MenuItem,
  SelectOption,
} from '@sovryn/ui';

import { AssetRenderer } from '../../../../2_molecules/AssetRenderer/AssetRenderer';
import { useCurrentChain } from '../../../../../hooks/useChainStore';
import { translations } from '../../../../../locales/i18n';
import { CategoryType } from '../../ConvertPage.types';

type CategoryDropdownProps = {
  token: string;
  selectedCategories: CategoryType[];
  tokenOptions: SelectOption<string>[];
  onCategorySelect: (category: CategoryType) => void;
  onTokenChange: (token: string) => void;
  dataAttribute: string;
};

export const CategoryDropdown: FC<CategoryDropdownProps> = ({
  token,
  selectedCategories,
  tokenOptions,
  onCategorySelect,
  onTokenChange,
  dataAttribute,
}) => {
  const currentChainId = useCurrentChain();

  const getAssetRenderer = useCallback(
    (token: string) =>
      token ? (
        <AssetRenderer
          showAssetLogo
          asset={token}
          chainId={currentChainId}
          assetClassName="font-medium"
        />
      ) : (
        t(translations.common.select)
      ),
    [currentChainId],
  );

  return (
    <Dropdown
      text={getAssetRenderer(token)}
      className="min-w-[6.7rem] flex-none border border-gray-70"
      dropdownClassName="max-h-[12rem] sm:max-h-[14.5rem] border border-gray-70 rounded min-w-48"
      mode={DropdownMode.right}
      dataAttribute={dataAttribute}
    >
      <div className="items-center flex-wrap bg-gray-80 p-3 grid grid-cols-2 gap-2">
        {Object.values(CategoryType).map(category => (
          <FilterPill
            text={category}
            key={category}
            isActive={selectedCategories.includes(category)}
            onClick={() => onCategorySelect(category)}
          />
        ))}
      </div>
      <Menu>
        {tokenOptions.map(tokenOption => (
          <MenuItem
            key={tokenOption.value}
            text={tokenOption.label}
            onClick={() => onTokenChange(tokenOption.value)}
            isActive={tokenOption.value === token}
          />
        ))}
        {tokenOptions.length === 0 && (
          <MenuItem
            text={t(translations.convertPage.form.noDestinationTokens)}
            disabled
          />
        )}
      </Menu>
    </Dropdown>
  );
};
