import React, { FC, PropsWithChildren, useEffect, useState } from 'react';

import { t } from 'i18next';

import { Table } from '@sovryn/ui';

import { useAccount } from '../../../../../hooks/useAccount';
import { useBlockNumber } from '../../../../../hooks/useBlockNumber';
import { translations } from '../../../../../locales/i18n';
import { LendingHistoryItem } from '../../../../../utils/graphql/rsk/generated';
import { BaseConversionsHistoryFrame } from '../../../ConversionsHistoryFrame/components/BaseConversionsHistoryFrame/BaseConversionsHistoryFrame';
import { COLUMNS_CONFIG } from './LendingHistoryFrame.constants';
import { useGetLendingHistory } from './hooks/useGetLendingHistory';

export type LendingEvent = Omit<
  LendingHistoryItem,
  | 'id'
  | 'lender'
  | 'lendingPool'
  | 'transaction'
  | 'userLendingHistory'
  | 'asset'
> & {
  asset: string;
  transactionHash: string;
  amount: string;
};

export const LendingHistoryFrame: FC<PropsWithChildren> = ({ children }) => {
  const { account } = useAccount();
  const [page, setPage] = useState(0);
  const [rawTxs, setRawTxs] = useState<LendingEvent[]>([]);
  const [total, setTotal] = useState(0);

  const { value: block } = useBlockNumber();

  const { data, loading, refetch } = useGetLendingHistory(account);

  useEffect(() => {
    if (!loading && data?.user?.lendingHistory) {
      const flattenedTxs: LendingEvent[] = data.user.lendingHistory
        .map(
          val =>
            val?.lendingHistory?.map(item => ({
              amount: item.amount,
              asset: item.asset?.id || '',
              emittedBy: item.emittedBy,
              loanTokenAmount: item.loanTokenAmount,
              transactionHash: item.transaction?.id,
              timestamp: item.timestamp,
              type: item.type,
            })) || [],
        )
        .flat()
        .sort((a, b) => b.timestamp - a.timestamp);
      setRawTxs(flattenedTxs);
      setTotal(flattenedTxs.length);
    }
  }, [account, data, loading]);

  useEffect(() => {
    refetch();
  }, [refetch, block]);

  return (
    <BaseConversionsHistoryFrame
      //exportData={exportData}
      name="earn"
      table={
        <Table
          columns={COLUMNS_CONFIG}
          rows={rawTxs}
          //rowTitle={generateRowTitle}
          isLoading={loading}
          className="bg-gray-80 text-gray-10 lg:px-6 lg:py-4"
          noData={t(translations.common.tables.noData)}
          dataAttribute="earn-history-table"
        />
      }
      setPage={setPage}
      page={page}
      totalItems={total}
      isLoading={loading}
    >
      {children}
    </BaseConversionsHistoryFrame>
  );
};
