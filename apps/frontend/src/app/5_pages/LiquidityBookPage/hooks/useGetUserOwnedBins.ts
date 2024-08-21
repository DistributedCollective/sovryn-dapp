import { useState, useEffect } from 'react';

import { LBPairV21ABI } from '@sovryn/joe-sdk-v2';

import { useAccount } from '../../../../hooks/useAccount';
import { BINS_RANGE } from '../LiquidityBookPage.constants';
import { LiquidityBookPool } from '../LiquidityBookPage.types';
import { useBlockchainClients } from '../utils/client';

export const useGetUserOwnedBins = (pool: LiquidityBookPool) => {
  const { publicClient } = useBlockchainClients();
  const { account } = useAccount();
  const [userOwnedBins, setUserOwnedBins] = useState<number[]>([]);
  const [nonZeroAmounts, setNonZeroAmounts] = useState<BigInt[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!account || !publicClient) {
      setLoading(false);
      return;
    }

    const fetchBins = async () => {
      try {
        const addressArray = Array.from({ length: 2 * BINS_RANGE + 1 }).fill(
          account,
        );
        const binsArray = Array.from(
          { length: 2 * BINS_RANGE + 1 },
          (_, index) => pool.activeBinId - BINS_RANGE + index,
        );

        const allBins = await publicClient.readContract({
          address: pool.contractAddress,
          abi: LBPairV21ABI,
          functionName: 'balanceOfBatch',
          args: [addressArray, binsArray],
        });

        const ownedBins = binsArray.filter(
          (bin, index) => allBins[index] !== BigInt(0),
        );
        const nonZero = allBins.filter(
          (amount: BigInt) => amount !== BigInt(0),
        );

        setUserOwnedBins(prevBins => {
          const newBinsJson = JSON.stringify(ownedBins);
          const prevBinsJson = JSON.stringify(prevBins);
          return newBinsJson === prevBinsJson ? prevBins : ownedBins;
        });

        setNonZeroAmounts(prevAmounts => {
          const newAmountsJson = JSON.stringify(
            nonZero.map(amount => amount.toString()),
          );
          const prevAmountsJson = JSON.stringify(
            prevAmounts.map(amount => amount.toString()),
          );
          return newAmountsJson === prevAmountsJson ? prevAmounts : nonZero;
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBins();
  }, [pool.activeBinId, pool.contractAddress, account, publicClient]);

  return { userOwnedBins, nonZeroAmounts, loading };
};
