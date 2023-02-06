import { useMemo } from 'react';

import { fromWei } from '../../../../utils/math';
import {
  CRITICAL_COLLATERAL_RATIO,
  MINIMUM_COLLATERAL_RATIO,
} from '../constants';

type UseMaxCreditAmountProps = {
  existingCollateral: string;
  existingDebt: string;
  newCollateral: number;
  newDebt: number;
  maxRbtcWeiBalance: string;
  creditWeiBalance: string;
  rbtcPrice: number;
  isRecoveryMode: boolean;
  liquidationReserve: number;
  originationFee: number;
  isIncreasingDebt: boolean;
};

export const useMaxCreditAmount = (props: UseMaxCreditAmountProps): number =>
  useMemo(() => {
    const isOpeningTrove =
      props.existingCollateral === '0' && props.existingDebt === '0';
    const rbtcBalance = Number(fromWei(props.maxRbtcWeiBalance));
    const rbtcPrice = Number(props.rbtcPrice);

    if (isOpeningTrove) {
      let amount =
        (rbtcBalance * rbtcPrice) /
        (props.isRecoveryMode
          ? CRITICAL_COLLATERAL_RATIO
          : MINIMUM_COLLATERAL_RATIO);

      if (props.newCollateral > 0) {
        amount =
          (props.newCollateral * rbtcPrice) /
          (props.isRecoveryMode
            ? CRITICAL_COLLATERAL_RATIO
            : MINIMUM_COLLATERAL_RATIO);
      }

      const originationFee =
        (amount / (1 + props.originationFee)) * props.originationFee;

      return Math.max(amount - originationFee - props.liquidationReserve, 0);
    }

    return Math.min(
      Number(fromWei(props.creditWeiBalance)),
      Number(props.existingDebt),
    );
  }, [props]);
