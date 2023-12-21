import React, { useContext, useMemo } from 'react';

import { Decimalish } from '@sovryn/utils';

import { BTC_IN_SATOSHIS } from '../../../../../../constants/general';
import { decimalic } from '../../../../../../utils/math';
import { WithdrawBoltzContext } from '../../../contexts/withdraw-boltz-context';
import { Limits } from './Limits';

export type TransferPoliciesProps = {
  amount: Decimalish;
};

export const TransferPolicies: React.FC<TransferPoliciesProps> = ({
  amount,
}) => {
  const { limits, fees } = useContext(WithdrawBoltzContext);

  const conversionRate = useMemo(
    () => decimalic(fees.percentageSwapIn),
    [fees.percentageSwapIn],
  );

  const conversionFee = useMemo(() => {
    const value = decimalic(amount);
    if (value.gt(0)) {
      return value.mul(conversionRate.div(100));
    }
    return decimalic(0);
  }, [amount, conversionRate]);

  return (
    <Limits
      minimumAmount={decimalic(limits.minimal).div(BTC_IN_SATOSHIS)}
      maximumAmount={decimalic(limits.maximal).div(BTC_IN_SATOSHIS)}
      conversionRate={decimalic(fees.percentageSwapIn)}
      conversionFee={conversionFee}
      networkFee={decimalic(fees.minerFees.baseAsset.normal).div(
        BTC_IN_SATOSHIS,
      )}
      className="mt-8"
    />
  );
};
