import { useMemo } from 'react';

import { useMaintenance } from '../../../../hooks/useMaintenance';
import { COMMON_SYMBOLS } from '../../../../utils/asset';

export const useGetBorrowMaintenance = (asset: string) => {
  const { States } = useMaintenance();

  return useMemo(() => {
    switch (asset) {
      case COMMON_SYMBOLS.BTC:
        return {
          NEW_LOANS: States.D2_BORROW_BTC_NEW_LOANS,
          BORROW: States.D2_BORROW_BTC_BORROW,
          REPAY: States.D2_BORROW_BTC_REPAY,
          CLOSE: States.D2_BORROW_BTC_CLOSE,
          EXTEND: States.D2_BORROW_BTC_EXTEND,
          ADD_COLLATERAL: States.D2_BORROW_BTC_ADD_COLLATERAL,
          WITHDRAW_COLLATERAL: States.D2_BORROW_BTC_WITHDRAW_COLLATERAL,
          FULL: States.BORROW_FULL,
        };
      case COMMON_SYMBOLS.DLLR:
        return {
          NEW_LOANS: States.D2_BORROW_DLLR_NEW_LOANS,
          BORROW: States.D2_BORROW_DLLR_BORROW,
          REPAY: States.D2_BORROW_DLLR_REPAY,
          CLOSE: States.D2_BORROW_DLLR_CLOSE,
          EXTEND: States.D2_BORROW_DLLR_EXTEND,
          ADD_COLLATERAL: States.D2_BORROW_DLLR_ADD_COLLATERAL,
          WITHDRAW_COLLATERAL: States.D2_BORROW_DLLR_WITHDRAW_COLLATERAL,
          FULL: States.BORROW_FULL,
        };
      case COMMON_SYMBOLS.XUSD:
        return {
          NEW_LOANS: States.D2_BORROW_XUSD_NEW_LOANS,
          BORROW: States.D2_BORROW_XUSD_BORROW,
          REPAY: States.D2_BORROW_XUSD_REPAY,
          CLOSE: States.D2_BORROW_XUSD_CLOSE,
          EXTEND: States.D2_BORROW_XUSD_EXTEND,
          ADD_COLLATERAL: States.D2_BORROW_XUSD_ADD_COLLATERAL,
          WITHDRAW_COLLATERAL: States.D2_BORROW_XUSD_WITHDRAW_COLLATERAL,
          FULL: States.BORROW_FULL,
        };
      case COMMON_SYMBOLS.DOC:
        return {
          NEW_LOANS: States.D2_BORROW_DOC_NEW_LOANS,
          BORROW: States.D2_BORROW_DOC_BORROW,
          REPAY: States.D2_BORROW_DOC_REPAY,
          CLOSE: States.D2_BORROW_DOC_CLOSE,
          EXTEND: States.D2_BORROW_DOC_EXTEND,
          ADD_COLLATERAL: States.D2_BORROW_DOC_ADD_COLLATERAL,
          WITHDRAW_COLLATERAL: States.D2_BORROW_DOC_WITHDRAW_COLLATERAL,
          FULL: States.BORROW_FULL,
        };
      case COMMON_SYMBOLS.RUSDT:
        return {
          NEW_LOANS: States.D2_BORROW_USDT_NEW_LOANS,
          BORROW: States.D2_BORROW_USDT_BORROW,
          REPAY: States.D2_BORROW_USDT_REPAY,
          CLOSE: States.D2_BORROW_USDT_CLOSE,
          EXTEND: States.D2_BORROW_USDT_EXTEND,
          ADD_COLLATERAL: States.D2_BORROW_USDT_ADD_COLLATERAL,
          WITHDRAW_COLLATERAL: States.D2_BORROW_USDT_WITHDRAW_COLLATERAL,
          FULL: States.BORROW_FULL,
        };
      case COMMON_SYMBOLS.BPRO:
        return {
          NEW_LOANS: States.D2_BORROW_BPRO_NEW_LOANS,
          BORROW: States.D2_BORROW_BPRO_BORROW,
          REPAY: States.D2_BORROW_BPRO_REPAY,
          CLOSE: States.D2_BORROW_BPRO_CLOSE,
          EXTEND: States.D2_BORROW_BPRO_EXTEND,
          ADD_COLLATERAL: States.D2_BORROW_BPRO_ADD_COLLATERAL,
          WITHDRAW_COLLATERAL: States.D2_BORROW_BPRO_WITHDRAW_COLLATERAL,
          FULL: States.BORROW_FULL,
        };
      default:
        return {
          FULL: States.BORROW_FULL,
        };
    }
  }, [States, asset]);
};
