import React, { FC, useCallback, useMemo, useState } from 'react';

import { t } from 'i18next';

import { Pagination, Table } from '@sovryn/ui';

import { DEFAULT_PAGE_SIZE } from '../../../../../constants/general';
import { useAccount } from '../../../../../hooks/useAccount';
import { translations } from '../../../../../locales/i18n';
import { columnsConfig } from './Vestings.constants';
import { generateRowTitle } from './Vestings.utils';
import { useGetVestingContracts } from './hooks/useGetVestingContracts';

const pageSize = DEFAULT_PAGE_SIZE;

export const Vesting: FC = () => {
  const [page, setPage] = useState(0);
  const { data: vestings, loading } = useGetVestingContracts(page, pageSize);
  const { account } = useAccount();

  const onPageChange = useCallback(
    (value: number) => {
      if (!vestings || (vestings?.length < pageSize && value > page)) {
        return;
      }
      setPage(value);
    },
    [page, vestings],
  );

  const isNextButtonDisabled = useMemo(
    () => !loading && (!vestings || vestings.length < pageSize),
    [loading, vestings],
  );

  return (
    <div className="lg:bg-gray-80 lg:py-4 lg:px-4 rounded w-full">
      <Table
        columns={columnsConfig}
        rows={vestings}
        noData={
          <span className="italic">
            {account
              ? t(translations.rewardPage.vesting.table.noRewards)
              : t(translations.rewardPage.vesting.table.notConnected)}
          </span>
        }
        dataAttribute="funding-history-table"
        rowTitle={generateRowTitle}
      />
      <Pagination
        page={page}
        className="lg:pb-6 mt-3 lg:mt-6 justify-center lg:justify-start"
        onChange={onPageChange}
        itemsPerPage={pageSize}
        isNextButtonDisabled={isNextButtonDisabled}
        dataAttribute="funding-history-pagination"
      />
    </div>
  );
};