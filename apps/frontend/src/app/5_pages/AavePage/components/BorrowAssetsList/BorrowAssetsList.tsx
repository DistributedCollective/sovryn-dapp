import React, { FC, useState } from 'react';

import { t } from 'i18next';

import { Accordion, Table } from '@sovryn/ui';

import { AavePoolRowTitle } from '../../../../2_molecules/AavePoolRowTitle/AavePoolRowTitle';
import { translations } from '../../../../../locales/i18n';
import { COLUMNS_CONFIG } from './BorrowAssetsList.constants';
import { BorrowAssetDetails } from './components/BorrowAssetDetails/BorrowAssetDetails';

const pageTranslations = translations.aavePage.borrowAssetsList;

type BorrowAssetsListProps = {
  account?: string;
};

export const BorrowAssetsList: FC<BorrowAssetsListProps> = ({ account }) => {
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
      <div className="pt-3">
        <Table
          columns={COLUMNS_CONFIG}
          rowClassName="bg-gray-80"
          accordionClassName="bg-gray-60 border border-gray-70"
          rowTitle={r => <AavePoolRowTitle asset={r.asset} />}
          rows={[
            // TODO: just a mock for now
            {
              asset: 'BTC',
              apr: 2,
              available: 12.34,
              availableUsd: 100,
            },
            {
              asset: 'ETH',
              apr: 2,
              available: 12.34,
              availableUsd: 100,
            },
          ]}
          mobileRenderer={p => <BorrowAssetDetails pool={p} />}
        />
      </div>
    </Accordion>
  );
};
