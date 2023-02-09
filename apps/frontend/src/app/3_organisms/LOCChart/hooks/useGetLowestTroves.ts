import { useQuery } from '@apollo/client';

import { zeroClient } from '../../../../utils/clients';
import { GetLowestTrovesDocument } from '../../../../utils/graphql/zero/generated';

const trovesCount = 1000;

export const useGetLowestTroves = (userCollateralRatioKey: string) => {
  const { loading, data } = useQuery(GetLowestTrovesDocument, {
    variables: {
      first: trovesCount,
      userCollateralRatioKey: userCollateralRatioKey,
    },
    client: zeroClient,
  });

  return { loading, data };
};
