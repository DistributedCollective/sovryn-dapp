import { formatUnits } from 'ethers/lib/utils';

import { Decimal } from '@sovryn/utils';

import { UserLiquidationsTransactionsQuery } from '../../../../../utils/graphql/bobAave/generated';
import { LiquidationHistoryItem } from './AaveLiquidationLoanFrame.types';

export const normalizeUserLiquidationTransactions = (
  data: UserLiquidationsTransactionsQuery,
): LiquidationHistoryItem[] => {
  if (!data) {
    return [];
  }

  return data.userTransactions.reduce((acc, tx) => {
    if (tx.__typename !== 'LiquidationCall') {
      return acc;
    }

    return [
      ...acc,
      {
        id: tx.id,
        collateralAmount: Decimal.from(
          formatUnits(tx.collateralAmount, tx.collateralReserve.decimals),
        ).toString(2),
        collateralReserve: {
          decimals: tx.collateralReserve.decimals,
          name: tx.collateralReserve.name,
          symbol: tx.collateralReserve.symbol,
          underlyingAsset: tx.collateralReserve.underlyingAsset,
        },
        timestamp: tx.timestamp,
        hash: tx.txHash,
        debtAmount: Decimal.from(
          formatUnits(tx.principalAmount, tx.principalReserve.decimals),
        ).toString(2),
        debtReserve: {
          symbol: tx.principalReserve.symbol,
          decimals: tx.principalReserve.decimals,
          name: tx.principalReserve.name,
          underlyingAsset: tx.principalReserve.underlyingAsset,
        },
      } as LiquidationHistoryItem,
    ];
  }, [] as LiquidationHistoryItem[]);
};
