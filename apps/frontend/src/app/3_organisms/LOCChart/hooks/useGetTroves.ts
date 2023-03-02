import { zeroClient } from '../../../../utils/clients';
import { useGetTrovesQuery } from '../../../../utils/graphql/zero/generated';

export const useGetTroves = () => {
  const trovesCount = 1000;

  const { data, loading } = useGetTrovesQuery({
    variables: { first: trovesCount },
    client: zeroClient,
  });

  return { data, loading };
};
