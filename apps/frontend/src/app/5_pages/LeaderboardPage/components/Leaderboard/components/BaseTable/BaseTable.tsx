import React, { FC, useMemo } from 'react';

import { t } from 'i18next';

import { Table, Pagination } from '@sovryn/ui';

import { ConnectWalletMessage } from '../../../../../../2_molecules/ConnectWalletMessage/ConnectWalletMessage';
import { useAccount } from '../../../../../../../hooks/useAccount';
import { useHandlePagination } from '../../../../../../../hooks/useHandlePagination';
import { translations } from '../../../../../../../locales/i18n';
import {
  COLUMNS_CONFIG,
  PAGE_SIZE,
  STAKING_LEADERBOARD_URL,
  TRADING_LEADERBOARD_URL,
} from './BaseTable.constants';
import { TableType } from './BaseTable.types';
import { generateRowTitle } from './BaseTable.utils';
import { useGetData } from './hooks/useGetData';

type BaseTableProps = {
  type: TableType;
  tableSubtitle?: string;
};

export const BaseTable: FC<BaseTableProps> = ({ type, tableSubtitle }) => {
  const { account } = useAccount();

  const isStakingTable = useMemo(() => type === TableType.Staking, [type]);

  const dataUrl = useMemo(
    () => (isStakingTable ? STAKING_LEADERBOARD_URL : TRADING_LEADERBOARD_URL),
    [isStakingTable],
  );
  const { loading, users, connectedWalletRow } = useGetData(dataUrl);

  const { page, onPageChange, paginatedItems, isNextButtonDisabled } =
    useHandlePagination(users, PAGE_SIZE);

  return (
    <div className="p-4">
      <div className="my-8 mx-4 rounded">
        <Table
          rows={connectedWalletRow}
          columns={COLUMNS_CONFIG(true)}
          rowTitle={generateRowTitle}
          noData={
            !account ? (
              <ConnectWalletMessage
                text={t(translations.leaderboardPage.tables.connectWalletText)}
                ctaText={t(
                  translations.leaderboardPage.tables.connectWalletCta,
                )}
              />
            ) : (
              t(translations.leaderboardPage.tables.participantNotFound)
            )
          }
          isLoading={!!account && loading}
          flatMode={true}
        />
      </div>
      {tableSubtitle && (
        <div className="text-sm text-center mb-1">{tableSubtitle}</div>
      )}
      <div className="bg-gray-80 py-4 px-4 rounded">
        <Table
          columns={COLUMNS_CONFIG(false)}
          rows={paginatedItems}
          isLoading={loading}
          rowTitle={generateRowTitle}
          className="bg-gray-80 text-gray-10 lg:px-6 lg:py-4"
          dataAttribute="trading-leaderboard"
          preventExpandOnClickClass="prevent-row-click"
          flatMode={true}
        />
        <Pagination
          page={page}
          totalItems={users.length}
          className="lg:pb-6 mt-3 lg:mt-6 max-w-20"
          onChange={onPageChange}
          itemsPerPage={PAGE_SIZE}
          isNextButtonDisabled={isNextButtonDisabled}
          dataAttribute="trading-leaderboard-pagination"
        />
      </div>
    </div>
  );
};
