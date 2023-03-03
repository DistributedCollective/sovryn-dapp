import { zeroClient } from '../../../../utils/clients';
import { useGetTrovesQuery } from '../../../../utils/graphql/zero/generated';

export const useGetTroves = () => {
  const trovesCount = 1000;
  return useGetTrovesQuery({
    variables: { first: trovesCount },
    client: zeroClient,
  });
};
