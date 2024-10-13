import { t } from 'i18next';

import { Decimal } from '@sovryn/utils';

import { RAY } from '../../../../../constants/aave';
import { translations } from '../../../../../locales/i18n';
import { BorrowRateMode } from '../../../../../types/aave';
import { UserSwapBorrowRateTransactionsQuery } from '../../../../../utils/graphql/bobAave/generated';
import { SwapBorrowRateModeHistoryItem } from './AaveSwapRateModeLoanFrame.types';

export const normalizeUserLiquidationTransactions = (
  data: UserSwapBorrowRateTransactionsQuery,
): SwapBorrowRateModeHistoryItem[] => {
  if (!data) {
    return [];
  }

  return data.userTransactions.reduce((acc, tx) => {
    if (tx.__typename !== 'SwapBorrowRate') {
      return acc;
    }

    return [
      ...acc,
      {
        id: tx.id,
        from: t(
          translations.loanHistory.table[
            tx.borrowRateModeFrom === BorrowRateMode.STABLE
              ? 'stable'
              : 'variable'
          ],
        ),
        to:
          tx.borrowRateModeTo === BorrowRateMode.STABLE ? 'Stable' : 'Variable',
        timestamp: tx.timestamp,
        hash: tx.txHash,
        variableBorrowRate: Decimal.from(tx.variableBorrowRate)
          .div(RAY)
          .toString(2),
        stableBorrowRate: Decimal.from(tx.stableBorrowRate)
          .div(RAY)
          .toString(2),
        reserve: {
          symbol: tx.reserve.symbol,
          decimals: tx.reserve.decimals,
          name: tx.reserve.name,
          underlyingAsset: tx.reserve.underlyingAsset,
        },
      },
    ];
  }, [] as SwapBorrowRateModeHistoryItem[]);
};
