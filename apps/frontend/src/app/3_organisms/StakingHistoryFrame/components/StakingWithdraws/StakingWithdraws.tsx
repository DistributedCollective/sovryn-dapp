import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { t } from 'i18next';
import { nanoid } from 'nanoid';

import {
  ErrorBadge,
  ErrorLevel,
  NotificationType,
  OrderDirection,
  OrderOptions,
  Pagination,
  Select,
  Table,
} from '@sovryn/ui';

import { ExportCSV } from '../../../../2_molecules/ExportCSV/ExportCSV';
import { SOV } from '../../../../../constants/currencies';
import {
  DEFAULT_HISTORY_FRAME_PAGE_SIZE,
  EXPORT_RECORD_LIMIT,
} from '../../../../../constants/general';
import { useNotificationContext } from '../../../../../contexts/NotificationContext';
import { useAccount } from '../../../../../hooks/useAccount';
import { useCurrentChain } from '../../../../../hooks/useChainStore';
import { useMaintenance } from '../../../../../hooks/useMaintenance';
import { translations } from '../../../../../locales/i18n';
import { SubgraphType, getSubgraphClient } from '../../../../../utils/clients';
import {
  useGetStakingWithdrawsLazyQuery,
  V2StakingWithdrawn_OrderBy,
} from '../../../../../utils/graphql/rsk/generated';
import { dateFormat } from '../../../../../utils/helpers';
import { stakingHistoryOptions } from '../../StakingHistoryFrame.constants';
import { StakingHistoryProps } from '../../StakingHistoryFrame.type';
import { COLUMNS_CONFIG } from './StakingWithdraws.constants';
import { generateRowTitle } from './StakingWithdraws.utils';
import { useGetStakingWithdraws } from './hooks/useGetStakingWithdraws';

const pageSize = DEFAULT_HISTORY_FRAME_PAGE_SIZE;

export const StakingWithdraws: FC<StakingHistoryProps> = ({
  onChangeHistoryType,
  selectedHistoryType,
}) => {
  const chainId = useCurrentChain();
  const { account } = useAccount();
  const { addNotification } = useNotificationContext();

  const [page, setPage] = useState(0);

  const { checkMaintenance, States } = useMaintenance();
  const exportLocked = checkMaintenance(States.ZERO_EXPORT_CSV);

  const [orderOptions, setOrderOptions] = useState<OrderOptions>({
    orderBy: 'timestamp',
    orderDirection: OrderDirection.Desc,
  });

  const { data, loading } = useGetStakingWithdraws(
    account,
    pageSize,
    page,
    orderOptions,
  );

  const [getStakes] = useGetStakingWithdrawsLazyQuery({
    client: getSubgraphClient(SubgraphType.STAKING, chainId),
  });

  const onPageChange = useCallback(
    (value: number) => {
      if (data.length < pageSize && value > page) {
        return;
      }
      setPage(value);
    },
    [page, data.length],
  );

  const isNextButtonDisabled = useMemo(
    () => !loading && data?.length < pageSize,
    [loading, data],
  );

  const exportData = useCallback(async () => {
    const { data } = await getStakes({
      variables: {
        user: account,
        skip: 0,
        pageSize: EXPORT_RECORD_LIMIT,
        orderBy: orderOptions.orderBy as V2StakingWithdrawn_OrderBy,
        orderDirection: orderOptions.orderDirection,
      },
    });

    let list = data?.v2StakingWithdrawns || [];

    if (!list || !list.length) {
      addNotification({
        type: NotificationType.warning,
        title: t(translations.common.tables.actions.noDataToExport),
        content: '',
        dismissible: true,
        id: nanoid(),
      });
    }

    return list.map(item => ({
      timestamp: dateFormat(item.timestamp),
      transactionType: t(translations.stakingHistory.unstake),
      amount: `-${item.amount}`,
      token: SOV,
      lockedUntil: dateFormat(item.until),
      TXID: item.id.split('-')[0],
    }));
  }, [
    getStakes,
    account,
    orderOptions.orderBy,
    orderOptions.orderDirection,
    addNotification,
  ]);

  useEffect(() => {
    setPage(0);
  }, [orderOptions]);

  return (
    <>
      <div className="flex-row items-center gap-4 mb-7 flex justify-center lg:justify-start">
        <Select
          dataAttribute={`staking-history-${selectedHistoryType}`}
          value={selectedHistoryType}
          onChange={onChangeHistoryType}
          options={stakingHistoryOptions}
          className="min-w-36 w-full lg:w-auto"
        />
        <div className="flex-row items-center ml-2 gap-4 hidden lg:inline-flex">
          <ExportCSV
            getData={exportData}
            filename="unstake"
            disabled={!data || data.length === 0 || exportLocked}
          />
          {exportLocked && (
            <ErrorBadge
              level={ErrorLevel.Warning}
              message={t(translations.maintenanceMode.featureDisabled)}
            />
          )}
        </div>
      </div>
      <div className="bg-gray-80 py-4 px-4 rounded">
        <Table
          setOrderOptions={setOrderOptions}
          orderOptions={orderOptions}
          columns={COLUMNS_CONFIG}
          rows={data}
          rowTitle={generateRowTitle}
          isLoading={loading}
          className="bg-gray-80 text-gray-10 lg:px-6 lg:py-4"
          noData={t(translations.common.tables.noData)}
          loadingData={t(translations.common.tables.loading)}
          dataAttribute="staking-withdrawns-history-table"
        />
        <Pagination
          page={page}
          className="lg:pb-6 mt-3 lg:mt-6 justify-center lg:justify-start"
          onChange={onPageChange}
          itemsPerPage={pageSize}
          isNextButtonDisabled={isNextButtonDisabled}
          dataAttribute="staking-withdrawns-history-pagination"
        />
      </div>
    </>
  );
};
