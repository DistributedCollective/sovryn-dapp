import { useMemo } from 'react';

import { BOB } from '../../../../../../constants/infrastructure/bob';
import { useAccount } from '../../../../../../hooks/useAccount';
import { useFetch } from '../../../../../../hooks/useFetch';
import { useTokenDetailsByAsset } from '../../../../../../hooks/useTokenDetailsByAsset';
import { Environments } from '../../../../../../types/global';
import { isMainnet } from '../../../../../../utils/helpers';
import { AmbientTransaction } from '../AmbientMarketMaking.types';
import { AmbientLiquidityPool } from '../utils/AmbientLiquidityPool';

export const useGetAmbientTransactions = (pool: AmbientLiquidityPool) => {
  const { account } = useAccount();
  const baseToken = useTokenDetailsByAsset(pool.base, pool.chainId);
  const quoteToken = useTokenDetailsByAsset(pool.quote, pool.chainId);

  const { value, loading } = useFetch(
    `${
      BOB.indexer[isMainnet() ? Environments.Mainnet : Environments.Testnet]
    }/user_pool_txs?user=${account}&base=${baseToken?.address}&quote=${
      quoteToken?.address
    }&poolIdx=${pool.poolIdx}&chainId=${pool.chainId}`,
  );

  const transactions = useMemo(
    () => (value?.data || []) as AmbientTransaction[],
    [value?.data],
  );

  return {
    transactions,
    isLoading: loading,
  };
};
