import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { t } from 'i18next';

import { Pagination, Paragraph, Table } from '@sovryn/ui';

import { DEFAULT_PAGE_SIZE } from '../../../../../constants/general';
import { useAccount } from '../../../../../hooks/useAccount';
import { translations } from '../../../../../locales/i18n';
import { generateRowTitle } from './VestingStakeFrame.utils';
import { COLUMNS_CONFIG } from './VestingStakesFrame.constants';
import { useGetVestingContracts } from './hooks/useGetVestingContracts';

const pageSize = DEFAULT_PAGE_SIZE;

export const VestingStakesFrame: FC = () => {
  const { account } = useAccount();

  const [page, setPage] = useState(0);

  const { data: vestings, loading } = useGetVestingContracts(page, pageSize);
  console.log('vestings', vestings);

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

  useEffect(() => {
    setPage(0);
  }, []);

  return (
    <div className="flex flex-col">
      <Paragraph className="text-base font-medium mb-3 md:mb-6">
        {t(translations.stakePage.table.vestingStakes)}
      </Paragraph>

      <div className="bg-gray-80 py-4 px-4 rounded">
        <Table
          columns={COLUMNS_CONFIG}
          rows={vestings}
          rowTitle={generateRowTitle}
          isLoading={loading}
          className="text-gray-10 lg:px-6 lg:py-4 text-xs"
          noData={
            <span className="italic">
              {account
                ? t(translations.stakePage.table.noVestingStakes)
                : t(translations.stakePage.table.notConnected)}
            </span>
          }
          dataAttribute="vesting-stakes-table"
        />
        {account && (
          <Pagination
            page={page}
            className="lg:pb-6 mt-3 lg:mt-6 justify-center lg:justify-start"
            onChange={onPageChange}
            itemsPerPage={DEFAULT_PAGE_SIZE}
            isNextButtonDisabled={isNextButtonDisabled}
            dataAttribute="vesting-stakes-pagination"
          />
        )}
      </div>
    </div>
  );
};
