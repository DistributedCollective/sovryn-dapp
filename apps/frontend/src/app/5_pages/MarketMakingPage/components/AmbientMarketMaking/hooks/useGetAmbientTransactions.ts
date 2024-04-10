import { useMemo } from 'react';

import { BOB_CHAIN_ID } from '../../../../../../config/chains';

import { BOB } from '../../../../../../constants/infrastructure/bob';
import { useAccount } from '../../../../../../hooks/useAccount';
import { useFetch } from '../../../../../../hooks/useFetch';
import { AmbientTransaction } from '../AmbientMarketMaking.types';

export const useGetAmbientTransactions = (
  base: string,
  quote: string,
  poolIdx: string,
  chainId: string,
) => {
  const { account } = useAccount();
  const { value, loading } = useFetch(
    `${BOB.indexer[BOB_CHAIN_ID]}user_pool_txs?user=${account}&base=${base}&quote=${quote}&poolIdx=${poolIdx}&chainId=${chainId}`,
  );

  const transactions = useMemo(
    () => value?.data as AmbientTransaction[],
    [value?.data],
  );

  return {
    transactions,
    isLoading: loading,
  };
};
