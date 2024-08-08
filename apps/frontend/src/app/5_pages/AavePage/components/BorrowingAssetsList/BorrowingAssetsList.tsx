import React, { FC, useState } from 'react';

import { t } from 'i18next';

import {
  Accordion,
  Align,
  Button,
  ButtonStyle,
  HelperButton,
  Table,
} from '@sovryn/ui';

import { AavePoolRowTitle } from '../../../../2_molecules/AavePoolRowTitle/AavePoolRowTitle';
import { AssetRenderer } from '../../../../2_molecules/AssetRenderer/AssetRenderer';
import { translations } from '../../../../../locales/i18n';
import { AssetRowElement } from './BorrowingAssetsList.types';

const pageTranslations = translations.aavePage.borrowingAssetsList;

type BorrowingAssetsListProps = {
  account?: string;
};

export const BorrowingAssetsList: FC<BorrowingAssetsListProps> = ({
  account,
}) => {
  const [open, setOpen] = useState<boolean>(true);

  return (
    <Accordion
      label={
        <span className="text-base font-medium">
          {t(pageTranslations.title)}
        </span>
      }
      className="bg-gray-70 px-4 py-3 rounded space-y-3 lg:bg-gray-90 lg:p-6"
      labelClassName="justify-between  h-7 flex items-center"
      open={open}
      onClick={setOpen}
    >
      <Table
        columns={[
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
              <div className="hidden lg:flex space-x-2 justify-end">
                <Button text="Borrow" />
                <Button text="Details" style={ButtonStyle.secondary} />
              </div>
            ),
          },
        ]}
        rowClassName="bg-gray-80"
        accordionClassName="bg-gray-60 border border-gray-70"
        rowTitle={r => <AavePoolRowTitle asset={r.asset} />}
        rows={[
          {
            asset: 'BTC',
            apr: 2,
            available: 12.34,
          },
          {
            asset: 'ETH',
            apr: 2,
            available: 12.34,
          },
        ]}
        mobileRenderer={r => (
          <div className="space-y-3">
            <div className="space-y-2">
              {/* APR */}
              <div className="grid grid-cols-2">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium text-gray-30">APR</span>
                  <HelperButton content="TODO:" className="text-gray-30" />
                </div>
                <div className="text-right text-xs text-gray-30 font-medium">
                  {r.apr}
                </div>
              </div>

              {/* Available */}
              <div className="grid grid-cols-2">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium text-gray-30">
                    Available
                  </span>
                </div>
                <div className="text-right text-xs text-gray-30 font-medium">
                  {r.available} {r.asset}
                </div>
              </div>
            </div>

            {/* Actions TODO: same component as above */}
            <div className="grid grid-cols-2 gap-2">
              <Button text="Borrow" />
              <Button text="Details" style={ButtonStyle.secondary} />
            </div>
          </div>
        )}
      />
    </Accordion>
  );
};
