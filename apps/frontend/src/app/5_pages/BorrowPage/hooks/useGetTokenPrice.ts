import { rskClient } from '../../../../utils/clients';
import { useGetTokenQuery } from '../../../../utils/graphql/rsk/generated';

export const useGetTokenPrice = (tokenAddress: string) => {
  return useGetTokenQuery({
    variables: { id: tokenAddress },
    client: rskClient,
  });
};
