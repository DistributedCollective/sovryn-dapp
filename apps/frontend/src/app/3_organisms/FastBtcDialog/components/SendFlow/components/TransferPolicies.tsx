import React, { useContext, useMemo } from 'react';

import { btcInSatoshis } from '../../../../../../utils/constants';
import { formatValue } from '../../../../../../utils/math';
import { Bitcoin, DYNAMIC_FEE_DIVISOR } from '../../../constants';
import { WithdrawContext } from '../../../contexts/withdraw-context';
import { Limits } from '../../Limits';

export const TransferPolicies: React.FC = () => {
  const { limits } = useContext(WithdrawContext);

  const minimumAmount = useMemo(() => {
    const minimum = limits.min / btcInSatoshis;

    return `${formatValue(minimum, 5)} ${Bitcoin}`;
  }, [limits.min]);

  const maximumAmount = useMemo(
    () => `${formatValue(limits.max / btcInSatoshis, 3)} ${Bitcoin}`,
    [limits.max],
  );

  const serviceFee = useMemo(() => {
    const baseFee = limits.baseFee / btcInSatoshis;

    if (!limits.dynamicFee) {
      return `${formatValue(baseFee, 6)} ${Bitcoin}`;
    }

    if (!limits.baseFee) {
      return `${formatValue(
        (limits.dynamicFee / DYNAMIC_FEE_DIVISOR) * 100,
        2,
      )} %`;
    }

    return `
          ${formatValue(baseFee, 6)} ${Bitcoin} +
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
