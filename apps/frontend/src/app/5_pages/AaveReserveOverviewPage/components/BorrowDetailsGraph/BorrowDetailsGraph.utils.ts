import { Decimal } from '@sovryn/utils';

import { config } from '../../../../../constants/aave';
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
    .mul(100)
    .toString(0),
  collectorContractLink: `${getBobExplorerUrl()}/address/${
    config.TreasuryAddress
  }`,
  reserveFactor: Decimal.from(reserve.reserveFactor).mul(100),
});
