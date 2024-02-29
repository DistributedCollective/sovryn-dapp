import React, { FC, useMemo } from 'react';

import { t } from 'i18next';

import { Paragraph, Table } from '@sovryn/ui';

import { translations } from '../../../../../locales/i18n';
import { LendingPoolDictionary } from '../../../../../utils/LendingPoolDictionary';
import { COLUMNS_CONFIG, EXCLUDED_ASSETS } from './BorrowAssetsTable.constants';
import { generateRowTitle } from './BorrowAssetsTable.utils';

const lendPools = LendingPoolDictionary.list();

export const BorrowAssetsTable: FC = () => {
  const availablePools = useMemo(
    () => lendPools.filter(pool => !EXCLUDED_ASSETS.includes(pool.getAsset())),
    [],
  );

  return (
    <div className="flex flex-col mb-10 border border-solid rounded border-gray-50 px-4 md:px-6 py-12">
      <div className="flex justify-between items-center mb-3 md:mb-6">
        <Paragraph className="text-base font-medium">
          {t(translations.fixedInterestPage.borrowAssetsTable.title)}
        </Paragraph>
      </div>

      <div className="bg-gray-80 py-4 px-4 rounded">
        <Table
          columns={COLUMNS_CONFIG}
          rows={availablePools}
          rowTitle={generateRowTitle}
          className="text-gray-10 lg:px-6 lg:py-4 text-xs"
          noData={t(translations.common.tables.noData)}
          loadingData={t(translations.common.tables.loading)}
          dataAttribute="borrow-assets-table"
        />
      </div>
    </div>
  );
};
