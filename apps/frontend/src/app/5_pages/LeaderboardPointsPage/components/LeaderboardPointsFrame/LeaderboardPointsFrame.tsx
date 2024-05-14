import React, { FC } from 'react';

import { t } from 'i18next';

import { Pagination, Paragraph, Table } from '@sovryn/ui';

import { useAccount } from '../../../../../hooks/useAccount';
import { useHandlePagination } from '../../../../../hooks/useHandlePagination';
import { translations } from '../../../../../locales/i18n';
import { ConnectWalletMessage } from '../../../LeaderboardPage/components/Leaderboard/components/BaseTable/components/ConnectWalletMessage/ConnectWalletMessage';
import {
  COLUMNS_CONFIG,
  MAXIMUM_USERS_TO_SHOW,
} from '../../LeaderboardPointsPage.constants';
import { generateRowTitle } from '../../LeaderboardPointsPage.utils';
import { useGetPoints } from '../../hooks/useGetPoints';

const pageSize = MAXIMUM_USERS_TO_SHOW;

export const LeaderboardPointsFrame: FC = () => {
  const { account } = useAccount();
  const { connectedWalletPoints, points } = useGetPoints();

  const { page, onPageChange, paginatedItems, isNextButtonDisabled } =
    useHandlePagination(points, pageSize);

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-3 md:mb-6">
        <Paragraph className="text-2xl font-medium lg:pt-6 py-4 lg:px-8 lg:pb-8">
          {t(translations.leaderboardPointsPage.table.leaderboard)}
        </Paragraph>
      </div>

      <div className="lg:border rounded lg:p-6">
        <div className="lg:p-4">
          <Table
            columns={COLUMNS_CONFIG(true)}
            rows={connectedWalletPoints}
            rowTitle={generateRowTitle}
            className="text-gray-10 lg:px-6 lg:py-4 text-xs mb-5"
            dataAttribute="leaderboard-points-user-table"
            noData={
              !account ? (
                <ConnectWalletMessage />
              ) : (
                t(translations.common.tables.noData)
              )
            }
          />
        </div>

        <div className="lg:bg-gray-80 lg:p-4 rounded">
          <Table
            columns={COLUMNS_CONFIG()}
            rows={paginatedItems}
            rowTitle={generateRowTitle}
            className="text-gray-10 lg:px-6 lg:py-4 text-xs"
            dataAttribute="leaderboard-points-users-table"
          />
          <Pagination
            page={page}
            totalItems={points.length}
            className="lg:pb-6 mt-3 lg:mt-6 lg:max-w-3xl flex flex-wrap lg:flex-nowrap"
            onChange={onPageChange}
            itemsPerPage={pageSize}
            isNextButtonDisabled={isNextButtonDisabled}
            dataAttribute="leaderboard-points-users-pagination"
          />
        </div>
      </div>
    </div>
  );
};
