import React, { FC } from 'react';

import { t } from 'i18next';

import { Pagination, Table } from '@sovryn/ui';

import { useAccount } from '../../../../../../../hooks/useAccount';
import { translations } from '../../../../../../../locales/i18n';
import { useGetConnectWalletMessage } from '../../hooks/useGetConnectWalletMessage';
import { COLUMNS_CONFIG, PAGE_SIZE } from './TradingLeaderboard.constants';
import { generateRowTitle } from './TradingLeaderboard.utils';
import { useGetData } from './hooks/useGetData';
import { useHandlePagination } from './hooks/useHandlePagination';

export const TradingLeaderboard: FC = () => {
  const { account } = useAccount();

  const { users, connectedWalletRow } = useGetData();
  const connectWalletMessage = useGetConnectWalletMessage();
  const { page, onPageChange, paginatedUsers, isNextButtonDisabled } =
    useHandlePagination(users);

  return (
    <div className="p-4">
      <div className="mt-4 text-sm font-medium text-gray-30 text-end">
        {t(translations.leaderboardPage.tables.trading.pointsInfo)}
      </div>
      <div className="mt-8 mb-8 rounded">
        <Table
          rows={connectedWalletRow}
          columns={COLUMNS_CONFIG(true)}
          rowTitle={generateRowTitle}
          noData={
            !account
              ? connectWalletMessage
              : t(translations.common.tables.noData)
          }
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
          itemsPerPage={PAGE_SIZE}
          isNextButtonDisabled={isNextButtonDisabled}
          dataAttribute="trading-leaderboard-pagination"
        />
      </div>
    </div>
  );
};
