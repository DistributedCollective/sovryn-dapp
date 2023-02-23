import { useMemo } from 'react';

import { SupportedTokens } from '@sovryn/contracts';

import { useAssetBalance } from '../../../../hooks/useAssetBalance';

export const useGetDefaultSourceToken = () => {
  const dllrBalance = useAssetBalance(SupportedTokens.dllr).weiBalance;
  const zusdBalance = useAssetBalance(SupportedTokens.zusd).weiBalance;
  const docBalance = useAssetBalance(SupportedTokens.doc).weiBalance;

  const hasDllr = useMemo(() => dllrBalance !== '0', [dllrBalance]);
  const hasZusd = useMemo(() => zusdBalance !== '0', [zusdBalance]);
  const hasDoc = useMemo(() => docBalance !== '0', [docBalance]);

  if (hasDllr || (!hasDllr && !hasZusd && !hasDoc)) {
    return SupportedTokens.dllr;
  }

  if (!hasDllr && hasZusd) {
    return SupportedTokens.zusd;
  }

  return SupportedTokens.doc;
};
