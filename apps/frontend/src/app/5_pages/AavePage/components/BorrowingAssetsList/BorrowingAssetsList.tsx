import React, { FC, useState } from 'react';

import { t } from 'i18next';

import { Accordion, Table } from '@sovryn/ui';

import { AavePoolRowTitle } from '../../../../2_molecules/AavePoolRowTitle/AavePoolRowTitle';
import { translations } from '../../../../../locales/i18n';
import { COLUMNS_CONFIG } from './BorrowingAssetsList.constants';

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
        columns={COLUMNS_CONFIG}
        // className='bg-blue-2 '
        rowClassName="bg-blue-2"
        // expandedClassNames='bg-blue-2'
        rowTitle={r => <AavePoolRowTitle asset={r.asset} />}
        rows={[
          {
            asset: 'BTC',
            apr: 2,
            available: 12.34,
          },
        ]}
      />
    </Accordion>
  );
};
