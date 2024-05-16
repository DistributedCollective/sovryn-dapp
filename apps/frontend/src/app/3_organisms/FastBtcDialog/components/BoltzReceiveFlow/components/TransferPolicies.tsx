import React, { useContext, useMemo } from 'react';

import { Decimalish } from '@sovryn/utils';

import { BTC_IN_SATOSHIS } from '../../../../../../constants/general';
import { decimalic } from '../../../../../../utils/math';
import { DepositBoltzContext } from '../../../contexts/deposit-boltz-context';
import { Limits } from '../../BoltzSendFlow/components/Limits';

export type TransferPoliciesProps = {
  amount: Decimalish;
};

export const TransferPolicies: React.FC<TransferPoliciesProps> = ({
  amount,
}) => {
  const { limits, fees } = useContext(DepositBoltzContext);

  const conversionRate = useMemo(
    () => decimalic(fees.percentage),
    [fees.percentage],
  );

  const conversionFee = useMemo(() => {
    const value = decimalic(amount);
    if (value.gt(0)) {
      return value.mul(conversionRate.div(100));
    }
    return decimalic(0);
  }, [amount, conversionRate]);

  const maximumAmount = useMemo(() => {
    const amount = decimalic(limits.maximal).div(BTC_IN_SATOSHIS);

    return amount
      .sub(decimalic(fees.percentage / 100).mul(amount))
      .sub(
        decimalic(fees.minerFees.baseAsset.reverse.lockup).div(BTC_IN_SATOSHIS),
      );
  }, [
    fees.minerFees.baseAsset.reverse.lockup,
    fees.percentage,
    limits.maximal,
  ]);

  return (
    <Limits
      minimumAmount={decimalic(limits.minimal).div(BTC_IN_SATOSHIS)}
      maximumAmount={maximumAmount.toString(8)}
      conversionRate={decimalic(fees.percentageSwapIn)}
      conversionFee={conversionFee}
      networkFee={decimalic(fees.minerFees.baseAsset.reverse.lockup).div(
        BTC_IN_SATOSHIS,
      )}
      className="mt-8"
    />
  );
};
