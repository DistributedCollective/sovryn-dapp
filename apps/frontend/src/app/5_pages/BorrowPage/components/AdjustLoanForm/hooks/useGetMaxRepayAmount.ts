import { useMemo } from 'react';

import { Decimal } from '@sovryn/utils';

import { LoanItem } from '../../../../../5_pages/BorrowPage/components/OpenLoansTable/OpenLoansTable.types';
import { useMaxAssetBalance } from '../../../../../../hooks/useMaxAssetBalance';
import { decimalic } from '../../../../../../utils/math';
import { useGetInterestRefund } from './useGetInterestRefund';

export const useGetMaxRepayAmount = (loanToken: string, loan: LoanItem) => {
  const { balance: loanTokenBalance } = useMaxAssetBalance(loanToken);
  const interestRefund = useGetInterestRefund(loan.id);
  const totalDebt = useMemo(() => decimalic(loan.debt.toString()), [loan.debt]);

  const maximumRepayAmount: Decimal = useMemo(
    () => totalDebt.sub(interestRefund),
    [interestRefund, totalDebt],
  );

  const maximumAvailableRepayAmount = useMemo(
    () =>
      Math.min(maximumRepayAmount.toNumber(), Number(loanTokenBalance)) < 0
        ? Decimal.ZERO
        : Math.min(maximumRepayAmount.toNumber(), Number(loanTokenBalance)),
    [loanTokenBalance, maximumRepayAmount],
  );

  return {
    maximumRepayAmount,
    maximumAvailableRepayAmount: Decimal.from(maximumAvailableRepayAmount),
  };
};
