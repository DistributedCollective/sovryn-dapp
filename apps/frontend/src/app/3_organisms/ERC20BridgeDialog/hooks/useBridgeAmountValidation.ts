import { useMemo } from 'react';

import { ethers } from 'ethers';

import { BridgeParams } from '@sovryn/sdk';

import { useBridgeLimits } from './useBridgeLimits';
import { useTokenBalance } from './useTokenBalance';

export function useBridgeAmountValidation({
  sourceChain,
  targetChain,
  asset,
  amount,
}: Omit<BridgeParams, 'signer' | 'receiver'>) {
  const { data: balance } = useTokenBalance(asset, sourceChain);
  const { data: limits } = useBridgeLimits(sourceChain, targetChain, asset);

  return useMemo(() => {
    if (!balance || !limits || !amount || isNaN(Number(amount))) {
      return false;
    }

    try {
      const amountBN = ethers.BigNumber.from(amount);
      const balanceBN = ethers.BigNumber.from(balance);
      const minBN = ethers.BigNumber.from(limits.minPerToken);
      const maxBN = ethers.BigNumber.from(limits.maxTokensAllowed);

      return (
        amountBN.gt(0) &&
        amountBN.lte(balanceBN) &&
        amountBN.gte(minBN) &&
        amountBN.lte(maxBN)
      );
    } catch (error) {
      console.log('Error in isAmountValid calculation:', error);
      return false;
    }
  }, [balance, limits, amount]);
}
