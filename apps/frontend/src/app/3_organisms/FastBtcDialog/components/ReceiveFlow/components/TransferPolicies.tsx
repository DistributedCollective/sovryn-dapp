import React, { useContext, useMemo } from 'react';

import { BITCOIN } from '../../../../../../constants/currencies';
import { BTC_IN_SATOSHIS } from '../../../../../../constants/general';
import { formatValue } from '../../../../../../utils/math';
import { DYNAMIC_FEE_DIVISOR } from '../../../constants';
import { DepositContext } from '../../../contexts/deposit-context';
import { Limits } from '../../Limits';

export const TransferPolicies: React.FC = () => {
  const { limits } = useContext(DepositContext);

  const minimumAmount = useMemo(
    () => `${formatValue(limits.min, 5)} ${BITCOIN}`,
    [limits.min],
  );

  const maximumAmount = useMemo(
    () => `${formatValue(limits.max, 5)} ${BITCOIN}`,
    [limits.max],
  );

  const serviceFee = useMemo(
    () =>
      `${formatValue(
        limits.baseFee / BTC_IN_SATOSHIS,
        8,
      )} ${BITCOIN} + ${formatValue(
        (limits.dynamicFee / DYNAMIC_FEE_DIVISOR) * 100,
        2,
      )} %`,
    [limits.baseFee, limits.dynamicFee],
  );

  return (
    <Limits
      minimumAmount={minimumAmount}
      maximumAmount={maximumAmount}
      serviceFee={serviceFee}
      className="mb-6"
    />
  );
};
