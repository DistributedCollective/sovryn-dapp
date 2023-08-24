import { useMemo } from 'react';

import { SupportedTokens } from '@sovryn/contracts';

import { useMaintenance } from '../../../../hooks/useMaintenance';

export const useGetBorrowMaintenance = (asset: SupportedTokens) => {
  const { States } = useMaintenance();

  return useMemo(() => {
    switch (asset) {
      case SupportedTokens.rbtc:
        return {
          NEW_LOANS: States.D2_BORROW_BTC_NEW_LOANS,
          BORROW: States.D2_BORROW_BTC_BORROW,
          REPAY: States.D2_BORROW_BTC_REPAY,
          CLOSE: States.D2_BORROW_BTC_CLOSE,
          ADD_COLLATERAL: States.D2_BORROW_BTC_ADD_COLLATERAL,
          WITHDRAW_COLLATERAL: States.D2_BORROW_BTC_WITHDRAW_COLLATERAL,
          FULL: States.BORROW_FULL,
        };
      case SupportedTokens.dllr:
        return {
          NEW_LOANS: States.D2_BORROW_DLLR_NEW_LOANS,
          BORROW: States.D2_BORROW_DLLR_BORROW,
          REPAY: States.D2_BORROW_DLLR_REPAY,
          CLOSE: States.D2_BORROW_DLLR_CLOSE,
          ADD_COLLATERAL: States.D2_BORROW_DLLR_ADD_COLLATERAL,
          WITHDRAW_COLLATERAL: States.D2_BORROW_DLLR_WITHDRAW_COLLATERAL,
          FULL: States.BORROW_FULL,
        };

      case SupportedTokens.xusd:
        return {
          NEW_LOANS: States.D2_BORROW_XUSD_NEW_LOANS,
          BORROW: States.D2_BORROW_XUSD_BORROW,
          REPAY: States.D2_BORROW_XUSD_REPAY,
          CLOSE: States.D2_BORROW_XUSD_CLOSE,
          ADD_COLLATERAL: States.D2_BORROW_XUSD_ADD_COLLATERAL,
          WITHDRAW_COLLATERAL: States.D2_BORROW_XUSD_WITHDRAW_COLLATERAL,
          FULL: States.BORROW_FULL,
        };
      case SupportedTokens.doc:
        return {
          NEW_LOANS: States.D2_BORROW_DOC_NEW_LOANS,
          BORROW: States.D2_BORROW_DOC_BORROW,
          REPAY: States.D2_BORROW_DOC_REPAY,
          CLOSE: States.D2_BORROW_DOC_CLOSE,
          ADD_COLLATERAL: States.D2_BORROW_DOC_ADD_COLLATERAL,
          WITHDRAW_COLLATERAL: States.D2_BORROW_DOC_WITHDRAW_COLLATERAL,
          FULL: States.BORROW_FULL,
        };
      case SupportedTokens.rusdt:
        return {
          NEW_LOANS: States.D2_BORROW_USDT_NEW_LOANS,
          BORROW: States.D2_BORROW_USDT_BORROW,
          REPAY: States.D2_BORROW_USDT_REPAY,
          CLOSE: States.D2_BORROW_USDT_CLOSE,
          ADD_COLLATERAL: States.D2_BORROW_USDT_ADD_COLLATERAL,
          WITHDRAW_COLLATERAL: States.D2_BORROW_USDT_WITHDRAW_COLLATERAL,
          FULL: States.BORROW_FULL,
        };
      case SupportedTokens.bpro:
        return {
          NEW_LOANS: States.D2_BORROW_BPRO_NEW_LOANS,
          BORROW: States.D2_BORROW_BPRO_BORROW,
          REPAY: States.D2_BORROW_BPRO_REPAY,
          CLOSE: States.D2_BORROW_BPRO_CLOSE,
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
