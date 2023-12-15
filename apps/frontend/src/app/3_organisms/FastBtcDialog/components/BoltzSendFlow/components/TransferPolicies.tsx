import React, { useContext, useMemo } from 'react';

import { BITCOIN } from '../../../../../../constants/currencies';
import { BTC_IN_SATOSHIS } from '../../../../../../constants/general';
import { formatValue } from '../../../../../../utils/math';
import { DYNAMIC_FEE_DIVISOR } from '../../../constants';
import { Limits } from '../../Limits';
import { WithdrawBoltzContext } from '../../../contexts/withdraw-boltz-context';

export const TransferPolicies: React.FC = () => {
  const { limits } = useContext(WithdrawBoltzContext);

  const minimumAmount = useMemo(() => {
    const minimum = limits.min / BTC_IN_SATOSHIS;

    return `${formatValue(minimum, 5)} ${BITCOIN}`;
  }, [limits.min]);

  const maximumAmount = useMemo(
    () => `${formatValue(limits.max / BTC_IN_SATOSHIS, 3)} ${BITCOIN}`,
    [limits.max],
  );

  const serviceFee = useMemo(() => {
    const baseFee = limits.baseFee / BTC_IN_SATOSHIS;

    if (!limits.dynamicFee) {
      return `${formatValue(baseFee, 6)} ${BITCOIN}`;
    }

    if (!limits.baseFee) {
      return `${formatValue(
        (limits.dynamicFee / DYNAMIC_FEE_DIVISOR) * 100,
        2,
      )} %`;
    }

    return `
          ${formatValue(baseFee, 6)} ${BITCOIN} +
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
