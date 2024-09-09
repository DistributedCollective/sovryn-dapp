import { Decimal } from '@sovryn/utils';

import { AAVE_CONTRACT_ADDRESSES } from '../../../../../constants/aave';
import { Reserve } from '../../../../../hooks/aave/useAaveReservesData';
import { getBobExplorerUrl } from '../../../../../utils/helpers';

export const normalizeBorrowStats = (reserve: Reserve) => ({
  apr: Decimal.from(reserve.variableBorrowAPR).mul(100),
  totalBorrowed: Decimal.from(reserve.totalDebt),
  totalBorrowedUSD: Decimal.from(reserve.totalDebtUSD),
  borrowCap: Decimal.from(reserve.borrowCap),
  borrowCapUSD: Decimal.from(reserve.borrowCapUSD),
  borrowedPercentage: Decimal.from(reserve.totalDebtUSD)
    .div(Decimal.from(reserve.debtCeilingUSD))
    .mul(100),
  reserveFactor: Decimal.from(reserve.reserveFactor).mul(100),
  collectorContractLink: `${getBobExplorerUrl()}/address/${
    AAVE_CONTRACT_ADDRESSES.TREASURY
  }`,
});
