import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { t } from 'i18next';

import { Button, Pagination, Table } from '@sovryn/ui';

import { useAccount } from '../../../../../../../hooks/useAccount';
import { useWalletConnect } from '../../../../../../../hooks/useWalletConnect';
import { translations } from '../../../../../../../locales/i18n';
import { User } from '../../Leaderboard.types';
import {
  COLUMNS_CONFIG,
  TRADING_LEADERBOARD_URL,
} from './TradingLeaderboard.constants';
import { generateRowTitle, parseBadges } from './TradingLeaderboard.utils';

const pageSize = 20;

export const TradingLeaderboard: FC = () => {
  const { account } = useAccount();
  const [users, setUsers] = useState<User[]>([]);
  const { connectWallet } = useWalletConnect();

  const connectWalletMessage = useMemo(
    () => (
      <div className="flex items-center justify-center bg-gray-70 lg:bg-gray-90 px-2.5 py-3 lg:p-0 rounded">
        <div className="text-xs font-medium italic mr-4">
          {t(translations.leaderboardPage.tables.connectWalletText)}
        </div>
        <Button
          text={t(translations.leaderboardPage.tables.connectWalletCta)}
          onClick={connectWallet}
          className="text-sm font-medium"
        />
      </div>
    ),
    [connectWallet],
  );

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

  const connectedWalletRow = useMemo(() => {
    if (account && users.length > 0) {
      const user = users.find(
        item => item.wallet.toLowerCase() === account.toLowerCase(),
      );

      if (user) {
        return [user];
      }
      return [];
    }
    return [];
  }, [account, users]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      <div className="p-4">
        <div className="mt-4 text-sm font-medium text-gray-30 text-end">
          {t(translations.leaderboardPage.tables.trading.pointsInfo)}
        </div>
        <div className="mt-8 mb-8 rounded">
          <Table
            rows={connectedWalletRow}
            columns={COLUMNS_CONFIG(true)}
            rowTitle={generateRowTitle}
            noData={!account ? connectWalletMessage : 'No data'}
            flatMode={true}
          />
        </div>
        <div className="bg-gray-80 py-4 px-4 rounded">
          <Table
            columns={COLUMNS_CONFIG(false)}
            rows={paginatedUsers}
            rowTitle={generateRowTitle}
            className="bg-gray-80 text-gray-10 lg:px-6 lg:py-4"
            dataAttribute="trading-leaderboard"
            preventExpandOnClickClass="prevent-row-click"
            flatMode={true}
          />
          <Pagination
            page={page}
            className="lg:pb-6 mt-3 lg:mt-6 justify-center lg:justify-start w-[5rem]"
            onChange={onPageChange}
            itemsPerPage={pageSize}
            isNextButtonDisabled={isNextButtonDisabled}
            dataAttribute="trading-leaderboard-pagination"
          />
        </div>
      </div>
    </>
  );
};
