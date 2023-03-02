import { zeroClient } from '../../../../utils/clients';
import { useGetUserOpenTroveQuery } from '../../../../utils/graphql/zero/generated';
import { useAccount } from './../../../../hooks/useAccount';

export const useGetUserOpenTrove = () => {
  const { account } = useAccount();

  const { data, loading } = useGetUserOpenTroveQuery({
    variables: { user: account.toLocaleLowerCase() },
    client: zeroClient,
  });

  return { data, loading };
};
