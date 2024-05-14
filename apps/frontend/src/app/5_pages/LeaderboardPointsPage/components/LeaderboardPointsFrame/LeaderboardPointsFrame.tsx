import React, { FC, useCallback, useMemo, useState } from 'react';

import { t } from 'i18next';

import { Pagination, Paragraph, Table } from '@sovryn/ui';

import { useAccount } from '../../../../../hooks/useAccount';
import { translations } from '../../../../../locales/i18n';
import { ConnectWalletMessage } from '../../../LeaderboardPage/components/Leaderboard/components/BaseTable/components/ConnectWalletMessage/ConnectWalletMessage';
import {
  COLUMNS_CONFIG,
  MAXIMUM_USERS_TO_SHOW,
} from '../../LeaderboardPointsPage.constants';
import { generateRowTitle } from '../../LeaderboardPointsPage.utils';
import { useGetPoints } from '../../hooks/useGetPoints';
import styles from './LeaderboardPointsFrame.module.css';

const pageSize = MAXIMUM_USERS_TO_SHOW;

export const LeaderboardPointsFrame: FC = () => {
  const { account } = useAccount();
  const [page, setPage] = useState(0);

  const { connectedWalletPoints, points } = useGetPoints(pageSize, page);

  const onPageChange = useCallback(
    (value: number) => {
      if (points?.length < pageSize && value > page) {
        return;
      }
      setPage(value);
    },
    [page, points],
  );

  const isNextButtonDisabled = useMemo(
    () => points?.length < pageSize,
    [points],
  );

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
            rows={points}
            rowTitle={generateRowTitle}
            className={points.length > 0 && styles.table}
            dataAttribute="leaderboard-points-users-table"
          />
          <Pagination
            page={page}
            className="lg:pb-6 mt-3 lg:mt-6 justify-center lg:justify-start"
            onChange={onPageChange}
            itemsPerPage={pageSize}
            isNextButtonDisabled={isNextButtonDisabled}
            dataAttribute="deposit-collaterals-pagination"
          />
        </div>
      </div>
    </div>
  );
};
