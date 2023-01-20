import React, { useContext, useMemo } from 'react';

import { btcInSatoshis } from '../../../../../../utils/constants';
import { formatValue } from '../../../../../../utils/math';
import { DYNAMIC_FEE_DIVISOR, FAST_BTC_ASSET } from '../../../constants';
import { WithdrawContext } from '../../../contexts/withdraw-context';
import { Limits } from '../../Limits';

export const TransferPolicies: React.FC = () => {
  const { limits } = useContext(WithdrawContext);

  const minimumAmount = useMemo(() => {
    const minimum = limits.min / btcInSatoshis;

    return `${formatValue(minimum, 5)} ${FAST_BTC_ASSET.toUpperCase()}`;
  }, [limits.min]);

  const maximumAmount = useMemo(
    () =>
      `${formatValue(
        limits.max / btcInSatoshis,
        3,
      )} ${FAST_BTC_ASSET.toUpperCase()}`,
    [limits.max],
  );

  const serviceFee = useMemo(() => {
    const baseFee = limits.baseFee / btcInSatoshis;

    if (!limits.dynamicFee) {
      return `${formatValue(baseFee, 6)} BTC`;
    }

    if (!limits.baseFee) {
      return `${formatValue(
        (limits.dynamicFee / DYNAMIC_FEE_DIVISOR) * 100,
        2,
      )} %`;
    }

    return `
          ${formatValue(baseFee, 6)} BTC +
          ${formatValue((limits.dynamicFee / DYNAMIC_FEE_DIVISOR) * 100, 2)} %
        `;
  }, [limits.baseFee, limits.dynamicFee]);

  return (
    <Limits
      minimumAmount={minimumAmount}
      maximumAmount={maximumAmount}
      serviceFee={serviceFee}
      className="mt-8"
    />
  );
};
