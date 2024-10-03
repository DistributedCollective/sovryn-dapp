import { useState, useEffect } from 'react';

import { ERC20_ABI } from '@sovryn/sdex';

import { useAccount } from '../../../../../../hooks/useAccount';
import { fromWei } from '../../../../../../utils/math';
import { useBlockchainClients } from '../../../utils/client';

export const useGetBalance = (tokenAddress?: string) => {
  const { account } = useAccount();
  const { publicClient } = useBlockchainClients();
  const [balance, setBalance] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!account || !publicClient) {
      setLoading(false);
      return;
    }

    const fetchBalance = async () => {
      try {
        let balance;
        if (tokenAddress) {
          balance = await publicClient.readContract({
            address: tokenAddress as `0x${string}`,
            abi: ERC20_ABI,
            functionName: 'balanceOf',
            args: [account as `0x${string}`],
          });
        } else {
          balance = await publicClient.getBalance({
            address: account as `0x${string}`,
          });
        }

        setBalance(fromWei(balance));
      } catch (error) {
        console.error('Error fetching balance:', error);
        setBalance('Error fetching balance');
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [account, publicClient, tokenAddress]);

  return { balance, loading };
};
