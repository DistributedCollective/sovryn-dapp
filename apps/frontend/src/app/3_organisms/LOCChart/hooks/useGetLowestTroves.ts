import { useQuery } from '@apollo/client';

import { zeroClient } from '../../../../utils/clients';
import { GetLowestTrovesDocument } from '../../../../utils/graphql/zero/generated';

const trovesCount = 100;

export const useGetLowestTroves = (userCollateralRatioKey: string) =>
  useQuery(GetLowestTrovesDocument, {
    variables: {
      first: trovesCount,
      userCollateralRatioKey: userCollateralRatioKey,
    },
    client: zeroClient,
  });
