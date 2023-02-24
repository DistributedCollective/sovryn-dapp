import { useMemo } from 'react';

import { SupportedTokens } from '@sovryn/contracts';

import { useAssetBalance } from '../../../../hooks/useAssetBalance';
import { fromWei } from '../../../../utils/math';

export const useGetSourceTokenBalance = (sourceToken: SupportedTokens) => {
  const { weiBalance } = useAssetBalance(sourceToken);

  const balance = useMemo(() => fromWei(weiBalance).toString(), [weiBalance]);

  return { weiBalance, balance };
};
