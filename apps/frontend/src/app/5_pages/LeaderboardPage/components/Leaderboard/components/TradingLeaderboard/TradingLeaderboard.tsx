import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { Pagination, Table } from '@sovryn/ui';

import { DEFAULT_PAGE_SIZE } from '../../../../../../../constants/general';
import { User } from '../../Leaderboard.types';
import {
  COLUMNS_CONFIG,
  TRADING_LEADERBOARD_URL,
} from './TradingLeaderboard.constants';
import { parseBadges } from './TradingLeaderboard.utils';

const pageSize = DEFAULT_PAGE_SIZE;

export const TradingLeaderboard: FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  const [page, setPage] = useState(0);

  const onPageChange = useCallback(
    (value: number) => {
      if (users?.length < pageSize && value > page) {
        return;
      }

      setPage(value);
    },
    [page, users?.length],
  );

  const paginatedUsers = useMemo(() => {
    if (users) {
      return users.slice(page * pageSize, (page + 1) * pageSize);
    }
    return [];
  }, [page, users]);

  const isNextButtonDisabled = useMemo(
    () => users?.length <= pageSize || paginatedUsers?.length < pageSize,
    [paginatedUsers?.length, users?.length],
  );

  // TODO: Create a separate hook for data fetching
  const fetchData = useCallback(async () => {
    const response = await fetch(TRADING_LEADERBOARD_URL);

    if (response.ok) {
      const data = await response.json();

      if (data) {
        const result = data?.query_result?.data?.rows;

        if (result?.length > 0) {
          setUsers(
            result.map(item => ({
              rank: item.rank,
              wallet: item.user,
              points: item.points,
              badges: parseBadges(item),
            })),
          );
        }
      }
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      {users && (
        <div className="bg-gray-80 py-4 px-4 rounded">
          <Table
            columns={COLUMNS_CONFIG}
            rows={paginatedUsers}
            // rowTitle={generateRowTitle}
            // isLoading={loading}
            className="bg-gray-80 text-gray-10 lg:px-6 lg:py-4"
            // noData={noDataLabel}
            // loadingData={t(translations.common.tables.loading)}
            dataAttribute="trading-leaderboard"
          />
          <Pagination
            page={page}
            className="lg:pb-6 mt-3 lg:mt-6 justify-center lg:justify-start w-[5rem]"
            onChange={onPageChange}
            totalItems={users.length}
            itemsPerPage={pageSize}
            isNextButtonDisabled={isNextButtonDisabled}
            dataAttribute="trading-leaderboard-pagination"
          />
        </div>
      )}
    </>
  );
};
