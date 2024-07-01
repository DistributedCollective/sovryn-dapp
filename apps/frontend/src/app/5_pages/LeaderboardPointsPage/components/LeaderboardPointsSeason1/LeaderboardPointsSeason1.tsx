import React, { FC } from 'react';

import { t } from 'i18next';

import { Pagination, Table } from '@sovryn/ui';

import { ConnectWalletMessage } from '../../../../2_molecules/ConnectWalletMessage/ConnectWalletMessage';
import { useAccount } from '../../../../../hooks/useAccount';
import { useHandlePagination } from '../../../../../hooks/useHandlePagination';
import { translations } from '../../../../../locales/i18n';
import { generateRowTitle } from '../../LeaderboardPointsPage.utils';
import {
  COLUMNS_CONFIG,
  PAGE_SIZE,
} from './LeaderboardPointsSeason1.constants';
import { useGetPoints } from './hooks/useGetPoints';

export const LeaderboardPointsSeason1: FC = () => {
  const { account } = useAccount();
  const { connectedWalletPoints, points } = useGetPoints();

  const { page, onPageChange, paginatedItems, isNextButtonDisabled } =
    useHandlePagination(points, PAGE_SIZE);

  return (
    <div className="flex flex-col md:pt-0 pt-6">
      <div className="lg:border rounded lg:p-6">
        <div className="lg:p-4">
          <Table
            columns={COLUMNS_CONFIG(true)}
            rows={connectedWalletPoints}
            rowTitle={row => generateRowTitle(row.id, row.wallet)}
            className="text-gray-10 lg:px-6 lg:py-4 text-xs mb-5"
            dataAttribute="leaderboard-points-user-table"
            noData={
              !account ? (
                <ConnectWalletMessage
                  text={t(translations.leaderboardPointsPage.connectWalletText)}
                  ctaText={t(
                    translations.leaderboardPointsPage.connectWalletCta,
                  )}
                />
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
            rowTitle={row => generateRowTitle(row.id, row.wallet)}
            className="text-gray-10 lg:px-6 lg:py-4 text-xs"
            dataAttribute="leaderboard-points-users-table-season-1"
          />
          <Pagination
            page={page}
            totalItems={points.length}
            className="lg:pb-6 mt-3 lg:mt-6 lg:max-w-3xl flex flex-wrap lg:flex-nowrap"
            onChange={onPageChange}
            itemsPerPage={PAGE_SIZE}
            isNextButtonDisabled={isNextButtonDisabled}
            dataAttribute="leaderboard-points-users-pagination-season-1"
          />
        </div>
      </div>
    </div>
  );
};
