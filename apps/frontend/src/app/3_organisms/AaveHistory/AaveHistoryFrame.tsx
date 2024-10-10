// import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

// import { t } from 'i18next';
// import { nanoid } from 'nanoid';

// import {
//   NotificationType,
//   OrderDirection,
//   OrderOptions,
//   Pagination,
//   Table,
// } from '@sovryn/ui';

// import { ExportCSV } from '../../2_molecules/ExportCSV/ExportCSV';
// import { BITCOIN } from '../../../constants/currencies';
// import {
//   DEFAULT_HISTORY_FRAME_PAGE_SIZE,
//   EXPORT_RECORD_LIMIT,
// } from '../../../constants/general';
// import { useNotificationContext } from '../../../contexts/NotificationContext';
// import { useAccount } from '../../../hooks/useAccount';
// import { useBlockNumber } from '../../../hooks/useBlockNumber';
// import { translations } from '../../../locales/i18n';
// import { bobAaveClient } from '../../../utils/clients';
// import {
//   BitcoinTransfer,
//   BitcoinTransfer_OrderBy,
// } from '../../../utils/graphql/rsk/generated';
// import { dateFormat } from '../../../utils/helpers';
// import { AaveHistoryType } from './AaveHistoryFrame.types';
// import {
//   columnsConfig,
//   generateRowTitle,
//   transactionTypeRenderer,
// } from './AaveHistoryFrame.utils';
// import { useGetUserTransactions } from './hooks/useGetAaveHistory';
// import {
//   UserTransaction,
//   UserTransaction_OrderBy,
//   useUserTransactionsLazyQuery,
// } from '../../../utils/graphql/bobAave/generated';

// const pageSize = DEFAULT_HISTORY_FRAME_PAGE_SIZE;

// export const AaveHistory: FC = () => {
//   const { account } = useAccount();
//   const { addNotification } = useNotificationContext();
//   const { value: block } = useBlockNumber();

//   const [page, setPage] = useState(0);

//   const [orderOptions, setOrderOptions] = useState<OrderOptions>({
//     orderBy: 'createdAtTimestamp',
//     orderDirection: OrderDirection.Desc,
//   });

//   const { data, loading, refetch } = useGetUserTransactions(
//     account,
//     pageSize,
//     page,
//     orderOptions,
//   );

//   useEffect(() => {
//     console.log(loading, data);
//   }, [loading, data]);

//   useEffect(() => {
//     refetch();
//   }, [refetch, block]);

//   const [getAaveHistory] = useUserTransactionsLazyQuery({
//     client: bobAaveClient,
//   });

//   const transactions = useMemo(
//     () => (data?.userTransactions as UserTransaction[]) || [],
//     [data],
//   );

//   const onPageChange = useCallback(
//     (value: number) => {
//       if (transactions.length < pageSize && value > page) {
//         return;
//       }
//       setPage(value);
//     },
//     [page, transactions.length],
//   );

//   const isNextButtonDisabled = useMemo(
//     () => !loading && transactions?.length < pageSize,
//     [loading, transactions],
//   );

//   const exportData = useCallback(async () => {
//     const { data } = await getAaveHistory({
//       variables: {
//         userAddress: account,
//         skip: 0,
//         first: EXPORT_RECORD_LIMIT,
//         orderBy: orderOptions.orderBy as UserTransaction_OrderBy,
//         orderDirection: orderOptions.orderDirection as OrderDirection,
//       },
//     });

//     let transactions = data?.userTransactions || [];

//     if (!transactions || !transactions.length) {
//       addNotification({
//         type: NotificationType.warning,
//         title: t(translations.common.tables.actions.noDataToExport),
//         content: '',
//         dismissible: true,
//         id: nanoid(),
//       });
//     }

//     const transactionData:AaveHistoryType[]  = transactions.map((item: UserTransaction) => {
//       return {
//           amount: item.,
//           decimals: item.decimals,
//           symbol: item.symbol,
//           timestamp: item.timestamp,
//           txHash: item.txHash,
//           type: item.type
//       };
//     });

//     return transactionData.map(({ ...item }) => ({
//       timestamp: dateFormat(item.timestamp),
//       type: item.type,
//       sent: item.sent,
//       received: item.received,
//       serviceFee: item.serviceFee,
//       token: BITCOIN,
//       txHash: item.txHash,
//     }));
//   }, [account, addNotification, getAaveHistory, orderOptions]);

//   useEffect(() => {
//     setPage(0);
//   }, [orderOptions]);

//   return (
//     <>
//       <ExportCSV
//         getData={exportData}
//         filename="funding"
//         className="mb-7 hidden lg:inline-flex"
//         disabled={!transactions || transactions.length === 0}
//       />
//       <div className="bg-gray-80 py-4 px-4 rounded">
//         {/* <Table
//           setOrderOptions={setOrderOptions}
//           orderOptions={orderOptions}
//           columns={columnsConfig}
//           rows={fundingHistory}
//           rowTitle={generateRowTitle}
//           isLoading={loading}
//           className="bg-gray-80 text-gray-10 lg:px-6 lg:py-4"
//           noData={t(translations.common.tables.noData)}
//           loadingData={t(translations.common.tables.loading)}
//           dataAttribute="funding-history-table"
//         /> */}
//         <Pagination
//           page={page}
//           className="lg:pb-6 mt-3 lg:mt-6 justify-center lg:justify-start"
//           onChange={onPageChange}
//           itemsPerPage={pageSize}
//           isNextButtonDisabled={isNextButtonDisabled}
//           dataAttribute="funding-history-pagination"
//         />
//       </div>
//     </>
//   );
// };
export const columnsConfig = [];
