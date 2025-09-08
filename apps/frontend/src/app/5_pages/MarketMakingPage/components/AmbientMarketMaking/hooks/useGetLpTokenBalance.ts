import { ethers } from 'ethers';

import { getProvider } from '@sovryn/ethers-provider';
import { ERC20_ABI } from '@sovryn/sdex';
import { Pool } from '@sovryn/sdk';

import { useAccount } from '../../../../../../hooks/useAccount';
import { useCurrentChain } from '../../../../../../hooks/useChainStore';
import { useQuery } from '@tanstack/react-query';

export const useGetLpTokenBalance = (pool: Pool) => {
  const chainId = useCurrentChain();
  const { account } = useAccount();
  const { data = '0' } = useQuery({
    queryKey: ['useGetLpTokenBalance', { pool, account }],
    queryFn: () => {
      const lpTokenContract = new ethers.Contract(
        pool.extra.lpToken,
        ERC20_ABI,
        getProvider(chainId),
      );
      return lpTokenContract
        .balanceOf(account)
        .then(balance => balance.toString());
    },
    enabled: !!pool.extra.lpToken && !!account,
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return data;
};
