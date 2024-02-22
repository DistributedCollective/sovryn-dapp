import React, { FC, useMemo } from 'react';

import { t } from 'i18next';

import { Table, Pagination } from '@sovryn/ui';

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
import { ConnectWalletMessage } from './components/ConnectWalletMessage/ConnectWalletMessage';
import { useGetData } from './hooks/useGetData';

type BaseTableProps = {
  type: TableType;
};

export const BaseTable: FC<BaseTableProps> = ({ type }) => {
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
      <div className="mt-4 text-sm font-medium text-gray-30 text-end">
        {t(
          translations.leaderboardPage.tables[
            isStakingTable ? 'staking' : 'trading'
          ].pointsInfo,
        )}
      </div>
      <div className="mt-8 mb-8 rounded">
        <Table
          rows={connectedWalletRow}
          columns={COLUMNS_CONFIG(true)}
          rowTitle={generateRowTitle}
          noData={
            !account ? (
              <ConnectWalletMessage />
            ) : (
              t(translations.common.tables.noData)
            )
          }
          isLoading={!!account && loading}
          flatMode={true}
        />
      </div>
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
