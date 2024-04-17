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
  Paragraph,
  ParagraphSize,
  Select,
  Table,
} from '@sovryn/ui';

import { RSK_CHAIN_ID } from '../../../../../config/chains';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { ExportCSV } from '../../../../2_molecules/ExportCSV/ExportCSV';
import { TxIdWithNotification } from '../../../../2_molecules/TxIdWithNotification/TransactionIdWithNotification';
import {
  SOV,
  TOKEN_RENDER_PRECISION,
} from '../../../../../constants/currencies';
import {
  DEFAULT_HISTORY_FRAME_PAGE_SIZE,
  EXPORT_RECORD_LIMIT,
} from '../../../../../constants/general';
import { useNotificationContext } from '../../../../../contexts/NotificationContext';
import { useAccount } from '../../../../../hooks/useAccount';
import { useMaintenance } from '../../../../../hooks/useMaintenance';
import { translations } from '../../../../../locales/i18n';
import { getChainById } from '../../../../../utils/chain';
import { zeroClient } from '../../../../../utils/clients';
import {
  SovDistribution,
  SovDistribution_OrderBy,
  useGetSubsidyLazyQuery,
} from '../../../../../utils/graphql/zero/generated';
import { dateFormat } from '../../../../../utils/helpers';
import { fromWei } from '../../../../../utils/math';
import { RewardHistoryProps } from '../../RewardHistory.types';
import { rewardHistoryOptions } from '../../RewardHistory.utils';
import { useGetStabilityPoolSubsidies } from './hooks/useGetStabilityPoolSubsidies';

const pageSize = DEFAULT_HISTORY_FRAME_PAGE_SIZE;

const generateRowTitle = (tx: SovDistribution) => (
  <Paragraph size={ParagraphSize.small} className="text-left">
    {t(
      translations.subsidyHistory.stabilityPoolOperation
        .withdrawStabilityPoolSubsidy,
    )}
    {' - '}
    {dateFormat(tx.timestamp)}
  </Paragraph>
);

export const StabilityPoolSubsidies: FC<RewardHistoryProps> = ({
  selectedHistoryType,
  onChangeRewardHistory,
}) => {
  const { account } = useAccount();
  const { addNotification } = useNotificationContext();
  const { checkMaintenance, States } = useMaintenance();

  const [page, setPage] = useState(0);
  const chain = getChainById(RSK_CHAIN_ID);

  const [orderOptions, setOrderOptions] = useState<OrderOptions>({
    orderBy: 'timestamp',
    orderDirection: OrderDirection.Desc,
  });

  const { data, loading } = useGetStabilityPoolSubsidies(
    account,
    pageSize,
    page,
    orderOptions,
  );

  const [getSovDistribution] = useGetSubsidyLazyQuery({
    client: zeroClient,
  });

  const renderAmount = useCallback(
    (tx: SovDistribution) => (
      <>
        {tx.amount ? (
          <AmountRenderer
            value={fromWei(tx.amount).toString()}
            suffix={SOV}
            precision={TOKEN_RENDER_PRECISION}
            dataAttribute="subsidy-history-reward-amount"
          />
        ) : (
          '-'
        )}
      </>
    ),
    [],
  );

  const columns = useMemo(
    () => [
      {
        id: 'timestamp',
        title: t(translations.common.tables.columnTitles.timestamp),
        cellRenderer: (tx: SovDistribution) => dateFormat(tx.timestamp),
        sortable: true,
      },
      {
        id: 'stabilityPoolOperation',
        title: t(translations.common.tables.columnTitles.transactionType),
        cellRenderer: () =>
          t(
            translations.subsidyHistory.stabilityPoolOperation
              .withdrawStabilityPoolSubsidy,
          ),
      },
      {
        id: 'amount',
        title: t(translations.common.tables.columnTitles.amount),
        cellRenderer: renderAmount,
      },
      {
        id: 'transactionID',
        title: t(translations.common.tables.columnTitles.transactionID),
        cellRenderer: (tx: SovDistribution) => (
          <TxIdWithNotification
            href={`${chain?.blockExplorerUrl}/tx/${tx.id.split('/')[0]}`}
            value={tx.id.split('/')[0]}
            dataAttribute="subsidy-history-reward-address-id"
          />
        ),
      },
    ],
    [chain?.blockExplorerUrl, renderAmount],
  );

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
    const { data } = await getSovDistribution({
      variables: {
        user: account,
        skip: 0,
        pageSize: EXPORT_RECORD_LIMIT,
        orderBy: SovDistribution_OrderBy.Timestamp,
        orderDirection: OrderDirection.Desc,
      },
    });
    let list = data?.sovdistributions || [];

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
      stabilityPoolOperation: t(
        translations.subsidyHistory.stabilityPoolOperation
          .withdrawStabilityPoolSubsidy,
      ),
      amount: fromWei(tx.amount || ''),
      token: SOV,
      transactionID: tx.id,
    }));
  }, [account, addNotification, getSovDistribution]);

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
            filename="stability-pool-subsidies"
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
          columns={columns}
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
