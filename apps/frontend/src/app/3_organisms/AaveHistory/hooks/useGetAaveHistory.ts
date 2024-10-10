// import { useMemo } from 'react';

// import { OrderOptions } from '@sovryn/ui';

// import { bobAaveClient } from '../../../../utils/clients';
// import {
//   OrderDirection,
//   UserTransaction_OrderBy,
// } from '../../../../utils/graphql/bobAave/generated';

// export const useGetUserTransactions = (
//   account: string,
//   pageSize: number,
//   page: number,
//   orderOptions: OrderOptions,
// ) => {
//   const config = useMemo(
//     () => ({
//       userAddress: account?.toLowerCase(),
//       skip: page * pageSize,
//       first: pageSize,
//       orderBy: orderOptions.orderBy as UserTransaction_OrderBy,
//       orderDirection: orderOptions.orderDirection as OrderDirection,
//     }),
//     [
//       account,
//       orderOptions.orderBy,
//       orderOptions.orderDirection,
//       page,
//       pageSize,
//     ],
//   );

//   return useUserTransactionsQuery({
//     variables: config,
//     client: bobAaveClient,
//   });
// };

export const a = () => {};
