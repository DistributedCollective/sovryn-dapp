import { useMemo } from 'react';

import { SupportedTokens } from '@sovryn/contracts';

import { useAssetBalance } from '../../../../hooks/useAssetBalance';
import { fromWei } from '../../../../utils/math';

export const useGetSourceTokenBalance = (sourceToken: SupportedTokens) => {
  const { value: weiBalance } = useAssetBalance(sourceToken);

  const balance = useMemo(
    () => String(Number(fromWei(weiBalance))),
    [weiBalance],
  );

  return { weiBalance, balance };
};
