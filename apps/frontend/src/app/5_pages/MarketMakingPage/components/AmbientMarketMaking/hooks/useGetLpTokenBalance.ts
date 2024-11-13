import { useState, useEffect } from 'react';

import { ethers } from 'ethers';

import { getProvider } from '@sovryn/ethers-provider';
import { ERC20_ABI } from '@sovryn/sdex';
import { Pool } from '@sovryn/sdk';

import { useAccount } from '../../../../../../hooks/useAccount';
import { useCurrentChain } from '../../../../../../hooks/useChainStore';

export const useGetLpTokenBalance = (pool: Pool) => {
  const chainId = useCurrentChain();
  const [lpTokenBalance, setLpTokenBalance] = useState('0');
  const { account } = useAccount();
  const { lpToken: lpTokenAddress } = pool.extra;

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
