import { rskClient } from '../../../../../../utils/clients';
import { useGetLendHistoryQuery } from '../../../../../../utils/graphql/rsk/generated';

export const useGetLendingHistory = (account: string) =>
  useGetLendHistoryQuery({
    variables: { user: account?.toLowerCase() },
    client: rskClient,
  });
