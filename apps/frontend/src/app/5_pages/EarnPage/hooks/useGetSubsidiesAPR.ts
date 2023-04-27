import { useCallback, useEffect, useMemo, useState } from 'react';

import { useLoadContract } from '../../../../hooks/useLoadContract';

export const useGetSubsidiesAPR = () => {
  const [apr, setAPR] = useState(0);

  const communityIssuance = useLoadContract('communityIssuance', 'zero');

  const updateAPR = useCallback(async () => {
    const APR = await communityIssuance?.APR();
    setAPR(Number(APR.toString()) / 100);
  }, [communityIssuance]);

  const apy = useMemo(
    () => (Math.pow(1 + apr / 36525, 365.25) - 1) * 100,
    [apr],
  );

  useEffect(() => {
    updateAPR();
  }, [updateAPR]);

  return {
    apr,
    apy,
    updateAPR,
  };
};
