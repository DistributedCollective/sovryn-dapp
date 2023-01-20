import React, { useContext, useMemo } from 'react';

import { btcInSatoshis } from '../../../../../../utils/constants';
import { formatValue, fromWeiFixed } from '../../../../../../utils/math';
import { DYNAMIC_FEE_DIVISOR, FAST_BTC_ASSET } from '../../../constants';
import { WithdrawContext } from '../../../contexts/withdraw-context';
import { Limits } from '../../Limits';

export const TransferPolicies: React.FC = () => {
  const { limits, aggregatorLimits } = useContext(WithdrawContext);

  const minimumAmount = useMemo(() => {
    const min1 = limits.min / btcInSatoshis;
    const min2 = Number(fromWeiFixed(aggregatorLimits.min, 8));

    return `${formatValue(
      Math.max(min1, min2),
      5,
    )} ${FAST_BTC_ASSET.toUpperCase()}`;
  }, [limits.min, aggregatorLimits.min]);

  const maximumAmount = useMemo(
    () =>
      `${formatValue(
        limits.max / btcInSatoshis,
        3,
      )} ${FAST_BTC_ASSET.toUpperCase()}`,
    [limits.max],
  );

  const serviceFee = useMemo(() => {
    const aggregatorFee = Number(fromWeiFixed(aggregatorLimits.fee, 8));
    const baseFee = limits.baseFee / btcInSatoshis;

    if (!limits.dynamicFee) {
      return `${formatValue(baseFee + aggregatorFee, 6)} BTC`;
    }

    if (!limits.baseFee) {
      if (aggregatorFee) {
        return `${formatValue(aggregatorFee, 6)} BTC
            ${formatValue(
              (limits.dynamicFee / DYNAMIC_FEE_DIVISOR) * 100,
              2,
            )} %`;
      }

      return `${formatValue(
        (limits.dynamicFee / DYNAMIC_FEE_DIVISOR) * 100,
        2,
      )} %`;
    }

    return `
          ${formatValue(baseFee + aggregatorFee, 6)} BTC +
          ${formatValue((limits.dynamicFee / DYNAMIC_FEE_DIVISOR) * 100, 2)} %
        `;
  }, [aggregatorLimits.fee, limits.baseFee, limits.dynamicFee]);

  return (
    <Limits
      minimumAmount={minimumAmount}
      maximumAmount={maximumAmount}
      serviceFee={serviceFee}
      className="mt-8"
    />
  );
};
