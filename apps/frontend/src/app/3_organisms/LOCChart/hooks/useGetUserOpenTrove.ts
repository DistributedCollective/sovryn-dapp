import { zeroClient } from '../../../../utils/clients';
import { useGetUserOpenTroveQuery } from '../../../../utils/graphql/zero/generated';

export const useGetUserOpenTrove = (account: string) =>
  useGetUserOpenTroveQuery({
    variables: { user: account?.toLowerCase() },
    client: zeroClient,
  });
