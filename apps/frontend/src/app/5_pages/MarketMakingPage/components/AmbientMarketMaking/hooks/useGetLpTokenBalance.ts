import { useState, useEffect } from 'react';

import { ethers } from 'ethers';

import { getProvider } from '@sovryn/ethers-provider';
import { ERC20_ABI } from '@sovryn/sdex';

import { useAccount } from '../../../../../../hooks/useAccount';
import { useCurrentChain } from '../../../../../../hooks/useChainStore';
import { AmbientLiquidityPool } from '../utils/AmbientLiquidityPool';

export const useGetLpTokenBalance = (pool: AmbientLiquidityPool) => {
  const chainId = useCurrentChain();
  const [lpTokenBalance, setLpTokenBalance] = useState('0');
  const { account } = useAccount();
  const { lpTokenAddress } = pool;

  useEffect(() => {
    if (!lpTokenAddress || !account) {
      return;
    }

    const fetchLpTokenBalance = async () => {
      try {
        const lpTokenContract = new ethers.Contract(
          lpTokenAddress,
          ERC20_ABI,
          getProvider(chainId),
        );
        const balance = await lpTokenContract.balanceOf(account);
        setLpTokenBalance(balance.toString());
      } catch (error) {
        console.error('Error fetching LP token balance:', error);
      }
    };

    fetchLpTokenBalance();
  }, [lpTokenAddress, account, chainId]);

  return lpTokenBalance;
};
