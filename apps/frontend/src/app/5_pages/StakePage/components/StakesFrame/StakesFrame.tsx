import React, { FC, useCallback, useMemo, useState } from 'react';

import { t } from 'i18next';

import { Pagination, Paragraph, Table } from '@sovryn/ui';

import { DEFAULT_PAGE_SIZE } from '../../../../../constants/general';
import { useAccount } from '../../../../../hooks/useAccount';
import { translations } from '../../../../../locales/i18n';
import { useGetStakingBalanceOf } from '../../hooks/useGetStakingBalanceOf';
import { AddStakeRenderer } from '../AddStakeRenderer/AddStakeRenderer';
import { COLUMNS_CONFIG } from './StakesFrame.constants';
import { generateRowTitle } from './StakesFrame.utils';
import { useGetStakes } from './hooks/useGetStakes';

const pageSize = DEFAULT_PAGE_SIZE;

export const StakesFrame: FC = () => {
  const { account } = useAccount();
  const { stakes, loading } = useGetStakes();
  const { balance } = useGetStakingBalanceOf(account);

  const hasStakedValue = useMemo(() => Number(balance) > 0, [balance]);

  const [page, setPage] = useState(0);

  const onPageChange = useCallback(
    (value: number) => {
      if (stakes.length < pageSize && value > page) {
        return;
      }
      setPage(value);
    },
    [page, stakes.length],
  );

  const paginatedStakes = useMemo(() => {
    if (stakes) {
      return stakes.slice(page * pageSize, (page + 1) * pageSize);
    }
    return [];
  }, [page, stakes]);

  const isNextButtonDisabled = useMemo(
    () =>
      !loading &&
      (stakes?.length <= pageSize || paginatedStakes?.length < pageSize),
    [loading, paginatedStakes?.length, stakes?.length],
  );

  return (
    <div className="flex flex-col mb-10">
      <div className="flex justify-between items-center mb-3 md:mb-6">
        <Paragraph className="text-base font-medium">
          {t(translations.stakePage.table.stakes)}
        </Paragraph>
        <div className="md:inline-block hidden">
          {account && <AddStakeRenderer hasStakedValue={hasStakedValue} />}
        </div>
      </div>

      <div className="bg-gray-80 py-4 px-4 rounded">
        <Table
          columns={COLUMNS_CONFIG}
          rows={paginatedStakes}
          rowTitle={generateRowTitle}
          isLoading={loading}
          className="text-gray-10 lg:px-6 lg:py-4 text-xs"
          noData={
            <span className="italic">
              {account
                ? t(translations.stakePage.table.noStakes)
                : t(translations.stakePage.table.notConnected)}
            </span>
          }
          dataAttribute="stakes-table"
        />
        {account && (
          <Pagination
            page={page}
            className="lg:pb-6 mt-3 lg:mt-6 justify-center lg:justify-start"
            onChange={onPageChange}
            itemsPerPage={pageSize}
            isNextButtonDisabled={isNextButtonDisabled}
            totalItems={stakes?.length || 0}
            dataAttribute="stakes-pagination"
          />
        )}
      </div>
    </div>
  );
};
