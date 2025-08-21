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
import {
  DEFAULT_HISTORY_FRAME_PAGE_SIZE,
  EXPORT_RECORD_LIMIT,
} from '../../../../../constants/general';
import { useNotificationContext } from '../../../../../contexts/NotificationContext';
import { useAccount } from '../../../../../hooks/useAccount';
import { useMaintenance } from '../../../../../hooks/useMaintenance';
import { translations } from '../../../../../locales/i18n';
import { rskClient } from '../../../../../utils/clients';
import {
  RewardsEarnedAction,
  RewardsEarnedHistoryItem_OrderBy,
  useGetRewardsEarnedHistoryLazyQuery,
} from '../../../../../utils/graphql/rsk/generated';
import { dateFormat } from '../../../../../utils/helpers';
import { decimalic } from '../../../../../utils/math';
import {
  RewardHistoryProps,
  RewardHistoryType,
} from '../../RewardHistory.types';
import { rewardHistoryOptions } from '../../RewardHistory.utils';
import { COLUMNS_CONFIG } from './RewardsEarnedHistory.constants';
import {
  generateRowTitle,
  getTransactionType,
} from './RewardsEarnedHistory.utils';
import { useGetRewardsEarned } from './hooks/useGetRewardsEarned';

const pageSize = DEFAULT_HISTORY_FRAME_PAGE_SIZE;

export const RewardsEarnedHistory: FC<RewardHistoryProps> = ({
  selectedHistoryType,
  onChangeRewardHistory,
}) => {
  const { account } = useAccount();
  const { addNotification } = useNotificationContext();
  const { checkMaintenance, States } = useMaintenance();

  const [page, setPage] = useState(0);

  const [orderOptions, setOrderOptions] = useState<OrderOptions>({
    orderBy: 'timestamp',
    orderDirection: OrderDirection.Desc,
  });

  const historyAction = useMemo(() => {
    switch (selectedHistoryType) {
      case RewardHistoryType.liquidityMiningRewards:
        return [RewardsEarnedAction.RewardClaimed];
      case RewardHistoryType.stakingRevenue:
        return [RewardsEarnedAction.UserFeeWithdrawn];
      case RewardHistoryType.stakingSubsidies:
        return [RewardsEarnedAction.StakingRewardWithdrawn];
      default:
        return [RewardsEarnedAction.RewardClaimed];
    }
  }, [selectedHistoryType]);

  const { data, loading } = useGetRewardsEarned(
    account,
    pageSize,
    page,
    orderOptions,
    historyAction,
  );

  const [getRewards] = useGetRewardsEarnedHistoryLazyQuery({
    client: rskClient,
  });

  const onPageChange = useCallback(
    (value: number) => {
      if (data?.length < pageSize && value > page) {
        return;
      }
      setPage(value);
    },
    [page, data],
  );

  const isNextButtonDisabled = useMemo(
    () => !loading && data?.length < pageSize,
    [loading, data],
  );

  const exportData = useCallback(async () => {
    const { data } = await getRewards({
      variables: {
        user: account.toLowerCase(),
        skip: 0,
        pageSize: EXPORT_RECORD_LIMIT,
        orderBy: RewardsEarnedHistoryItem_OrderBy.Timestamp,
        orderDirection: OrderDirection.Desc,
        actions: historyAction,
      },
    });
    let list = data?.rewardsEarnedHistoryItems || [];

    if (!list.length) {
      addNotification({
        type: NotificationType.warning,
        title: t(translations.common.tables.actions.noDataToExport),
        content: '',
        dismissible: true,
        id: nanoid(),
      });
    }

    return list.map(tx => ({
      timestamp: dateFormat(tx.timestamp),
      transactionType: getTransactionType(tx.action),
      amount: decimalic(tx.amount || '').toString(),
      token: tx.token,
      transactionID: tx.id,
    }));
  }, [account, addNotification, getRewards, historyAction]);

  useEffect(() => {
    setPage(0);
  }, [orderOptions]);

  const exportLocked = checkMaintenance(States.ZERO_EXPORT_CSV);

  return (
    <>
      <div className="flex-row items-center gap-4 mb-7 flex justify-center lg:justify-start">
        <Select
          dataAttribute={`reward-history-${selectedHistoryType}`}
          value={selectedHistoryType}
          onChange={onChangeRewardHistory}
          options={rewardHistoryOptions}
          className="min-w-36 w-full lg:w-auto"
        />
        <div className="flex-row items-center ml-2 gap-4 hidden lg:inline-flex">
          <ExportCSV
            getData={exportData}
            filename={selectedHistoryType}
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
          dataAttribute="subsidy-history-reward-table"
        />
        <Pagination
          page={page}
          className="lg:pb-6 mt-3 lg:mt-6 justify-center lg:justify-start"
          onChange={onPageChange}
          itemsPerPage={pageSize}
          isNextButtonDisabled={isNextButtonDisabled}
          dataAttribute="subsidy-history-reward-pagination"
        />
      </div>
    </>
  );
};
