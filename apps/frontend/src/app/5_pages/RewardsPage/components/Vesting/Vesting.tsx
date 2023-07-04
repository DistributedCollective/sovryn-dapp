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
    <>
      <Table
        columns={columnsConfig}
        rows={vestings}
        className="bg-gray-80 text-gray-10 lg:px-6 lg:py-4"
        noData={t(translations.common.tables.noData)}
        dataAttribute="funding-history-table"
        rowTitle={generateRowTitle}
      />
    </>
  );
};
