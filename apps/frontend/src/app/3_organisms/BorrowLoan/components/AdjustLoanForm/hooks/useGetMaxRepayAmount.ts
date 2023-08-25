import { useMemo } from 'react';

import { SupportedTokens } from '@sovryn/contracts';
import { Decimal } from '@sovryn/utils';

import { LoanItem } from '../../../../../5_pages/BorrowPage/components/OpenLoansTable/OpenLoansTable.types';
import { RBTC_GAS_FEE_RESERVE } from '../../../../../../constants/general';
import { useAssetBalance } from '../../../../../../hooks/useAssetBalance';
import { decimalic } from '../../../../../../utils/math';
import { useGetInterestRefund } from './useGetInterestRefund';

export const useGetMaxRepayAmount = (loanToken: string, loan: LoanItem) => {
  const { balance: loanTokenBalance } = useAssetBalance(
    loanToken as SupportedTokens,
  );
  const interestRefund = useGetInterestRefund(loan.id);
  const totalDebt = useMemo(() => decimalic(loan.debt.toString()), [loan.debt]);
  const isRbtcLoan = useMemo(
    () => loanToken === SupportedTokens.rbtc,
    [loanToken],
  );
  const gasFeeReserve = useMemo(
    () => (isRbtcLoan ? RBTC_GAS_FEE_RESERVE : 0),
    [isRbtcLoan],
  );

  const maximumRepayAmount: Decimal = useMemo(
    () => totalDebt.sub(interestRefund).sub(gasFeeReserve),
    [gasFeeReserve, interestRefund, totalDebt],
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
