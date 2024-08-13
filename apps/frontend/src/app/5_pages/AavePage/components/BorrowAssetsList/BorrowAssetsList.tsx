import React, { FC, useCallback, useState } from 'react';

import { t } from 'i18next';

import { Accordion, Table } from '@sovryn/ui';

import { AaveRowTitle } from '../../../../2_molecules/AavePoolRowTitle/AavePoolRowTitle';
import { translations } from '../../../../../locales/i18n';
import { COLUMNS_CONFIG } from './BorrowAssetsList.constants';
import { BorrowPoolDetails } from './BorrowAssetsList.types';
import { BorrowAssetDetails } from './components/BorrowAssetDetails/BorrowAssetDetails';

const pageTranslations = translations.aavePage.borrowAssetsList;

type BorrowAssetsListProps = {};

export const BorrowAssetsList: FC<BorrowAssetsListProps> = () => {
  const [open, setOpen] = useState<boolean>(true);

  const rowTitleRenderer = useCallback(
    r => <AaveRowTitle asset={r.asset} value={r.apr} suffix="%" label="APY" />,
    [],
  );
  const mobileRenderer = useCallback(p => <BorrowAssetDetails pool={p} />, []);

  // TODO: just a mock for now
  const borrowPools: BorrowPoolDetails[] = [
    {
      asset: 'BTC',
      apr: 2.01,
      available: 12.34,
      availableUsd: 100,
    },
    {
      asset: 'ETH',
      apr: 2.01,
      available: 12.34,
      availableUsd: 100,
    },
  ];

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
        className="mt-3"
        columns={COLUMNS_CONFIG}
        rowClassName="bg-gray-80"
        accordionClassName="bg-gray-60 border border-gray-70"
        rowTitle={rowTitleRenderer}
        mobileRenderer={mobileRenderer}
        rows={borrowPools}
      />
    </Accordion>
  );
};
