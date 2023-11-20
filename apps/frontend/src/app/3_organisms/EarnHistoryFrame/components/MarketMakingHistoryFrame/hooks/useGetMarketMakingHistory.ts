import { useAccount } from '../../../../../../hooks/useAccount';
import { rskClient } from '../../../../../../utils/clients';
import { useGetLiquidityHistoryQuery } from '../../../../../../utils/graphql/rsk/generated';

export const useGetMarketMakingHistory = () => {
  const { account } = useAccount();

  return useGetLiquidityHistoryQuery({
    variables: { user: account },
    client: rskClient,
  });
};
