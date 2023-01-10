import { useMemo } from 'react';

import { SupportedTokens } from '@sovryn/contracts';

import { useAssetBalance } from '../../../../hooks/useAssetBalance';
import { fromWei } from '../../../../utils/math';

export const useGetSourceTokenBalance = (sourceToken: SupportedTokens) => {
  const balanceWei = useAssetBalance(sourceToken).value;

  const balance = useMemo(
    () => String(Number(fromWei(balanceWei))),
    [balanceWei],
  );

  return balance;
};
