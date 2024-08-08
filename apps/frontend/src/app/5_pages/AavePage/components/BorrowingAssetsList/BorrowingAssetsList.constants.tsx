import React from 'react';

import { Align, Button, ButtonStyle } from '@sovryn/ui';

import { AssetRenderer } from '../../../../2_molecules/AssetRenderer/AssetRenderer';
import { AssetRowElement } from './BorrowingAssetsList.types';

export const COLUMNS_CONFIG = [
  {
    id: 'asset',
    title: 'Asset', // TODO: transalations
    cellRenderer: (asset: AssetRowElement) => (
      <AssetRenderer
        dataAttribute="borrow-asset"
        showAssetLogo
        asset={asset.asset}
        className="lg:justify-start justify-end"
      />
    ),
    align: Align.center,
    sortable: true,
  },
  {
    id: 'available',
    title: 'Available',
    sortable: true,
    align: Align.center,
  },
  {
    id: 'apr',
    title: 'APR', // TODO: transalations
    sortable: true,
    align: Align.center,
  },
  {
    id: 'actions',
    align: Align.center,
    title: ' ',
    // TODO: create component here
    cellRenderer: (asset: AssetRowElement) => (
      <div className="hidden lg:flex space-x-2">
        <Button text="Borrow" />
        <Button text="Details" style={ButtonStyle.secondary} />
      </div>
    ),
  },
];
