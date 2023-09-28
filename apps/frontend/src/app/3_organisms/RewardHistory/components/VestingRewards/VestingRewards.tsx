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
import { useMaintenance } from '../../../../../hooks/useMaintenance';
import { translations } from '../../../../../locales/i18n';
import { rskClient } from '../../../../../utils/clients';
import {
  VestingHistoryItem_OrderBy,
  useGetVestingHistoryItemsLazyQuery,
} from '../../../../../utils/graphql/rsk/generated';
import { dateFormat } from '../../../../../utils/helpers';
import { decimalic } from '../../../../../utils/math';
import { RewardHistoryProps } from '../../RewardHistory.types';
import { rewardHistoryOptions } from '../../RewardHistory.utils';
import { COLUMNS_CONFIG } from './VestingRewards.constants';
import { generateRowTitle, getTransactionType } from './VestingRewards.utils';
import { useGetVestingContractsId } from './hooks/useGetVestingContractsId';
import { useGetVestingHistoryItems } from './hooks/useGetVestingHistoryItems';

const pageSize = DEFAULT_HISTORY_FRAME_PAGE_SIZE;

export const VestingRewards: FC<RewardHistoryProps> = ({
  selectedHistoryType,
  onChangeRewardHistory,
}) => {
  const [page, setPage] = useState(0);
  const { data: vestings, loading: loadingVestingContracts } =
    useGetVestingContractsId();

  const { addNotification } = useNotificationContext();
  const { checkMaintenance, States } = useMaintenance();

  const [orderOptions, setOrderOptions] = useState<OrderOptions>({
    orderBy: 'timestamp',
    orderDirection: OrderDirection.Desc,
  });

  const { data, loading } = useGetVestingHistoryItems(
    vestings || [],
    pageSize,
    page,
    orderOptions,
  );

  const [getVestingHistoryItems] = useGetVestingHistoryItemsLazyQuery({
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
    () => !loading && data?.length < pageSize && !loadingVestingContracts,
    [loading, data, loadingVestingContracts],
  );

  const exportData = useCallback(async () => {
    const { data } = await getVestingHistoryItems({
      variables: {
        stakers: vestings,
        skip: 0,
        pageSize: EXPORT_RECORD_LIMIT,
        orderBy: VestingHistoryItem_OrderBy.Timestamp,
        orderDirection: OrderDirection.Desc,
      },
    });
    let list = data?.vestingHistoryItems || [];

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
      amount: decimalic(tx.amount).toString(),
      transactionID: tx.transaction.id,
    }));
  }, [addNotification, vestings, getVestingHistoryItems]);

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
        />
        <div className="flex-row items-center ml-2 gap-4 hidden lg:inline-flex">
          <ExportCSV
            getData={exportData}
            filename="vesting-rewards"
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
          dataAttribute="vesting-reward-history-table"
        />
        <Pagination
          page={page}
          className="lg:pb-6 mt-3 lg:mt-6 justify-center lg:justify-start"
          onChange={onPageChange}
          itemsPerPage={pageSize}
          isNextButtonDisabled={isNextButtonDisabled}
          dataAttribute="vesting-reward-history-pagination"
        />
      </div>
    </>
  );
};
