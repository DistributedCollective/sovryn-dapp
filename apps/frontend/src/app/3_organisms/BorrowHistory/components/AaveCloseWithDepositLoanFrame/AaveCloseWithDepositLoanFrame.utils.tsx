import { formatUnits } from 'ethers/lib/utils';

import { Decimal } from '@sovryn/utils';

import { UserRepayTransactionsQuery } from '../../../../../utils/graphql/bobAave/generated';
import { NewBorrowHistoryItem } from './AaveCloseWithDepositLoanFrame.types';

export const normalizeUserRepayTransactions = (
  data: UserRepayTransactionsQuery,
): NewBorrowHistoryItem[] => {
  if (!data) {
    return [];
  }

  return data.userTransactions.reduce((acc, tx) => {
    if (tx.__typename !== 'Repay') {
      return acc;
    }

    return [
      ...acc,
      {
        id: tx.id,
        amount: Decimal.from(
          formatUnits(tx.amount, tx.reserve.decimals),
        ).toString(2),
        timestamp: tx.timestamp,
        hash: tx.txHash,
        reserve: {
          symbol: tx.reserve.symbol,
          decimals: tx.reserve.decimals,
          name: tx.reserve.name,
          underlyingAsset: tx.reserve.underlyingAsset,
          assetPriceUSD: tx.assetPriceUSD,
        },
      } as NewBorrowHistoryItem,
    ];
  }, [] as NewBorrowHistoryItem[]);
};
