import React, { FC } from 'react';

import { t } from 'i18next';

import { Table } from '@sovryn/ui';

import { translations } from '../../../../../locales/i18n';
import { columnsConfig } from './Vestings.constants';
import { generateRowTitle } from './Vestings.utils';
import { useGetVestingContracts } from './hooks/useGetVestingContracts';

export const Vesting: FC = () => {
  const vestings = useGetVestingContracts();

  return (
    <div className="lg:bg-gray-80 lg:py-4 lg:px-4 rounded w-full">
      <Table
        columns={columnsConfig}
        rows={vestings}
        noData={t(translations.common.tables.noData)}
        dataAttribute="funding-history-table"
        rowTitle={generateRowTitle}
      />
    </div>
  );
};
