import { ApolloClient, InMemoryCache, useQuery } from '@apollo/client';

import { useMemo } from 'react';

import { useIsMobile } from '../../../../hooks/useIsMobile';
import { graphZeroUrl } from '../../../../utils/constants';
import {
  GetTrovesAboveDocument,
  GetTrovesBelowDocument,
} from '../../../../utils/graphql/zero/generated';
import { TrovesFilterType } from '../types';

const trovesCount = 10;
const trovesCountMobile = 3;

const zeroClient = new ApolloClient({
  uri: graphZeroUrl,
  cache: new InMemoryCache({
    resultCaching: false,
  }),
});

export const useGetTrovesPositions = (
  userCollateralRatioKey: string,
  filter: TrovesFilterType,
) => {
  const { isMobile } = useIsMobile();
  const trovesCountToFetch = useMemo(
    () => (!isMobile ? trovesCount : trovesCountMobile),
    [isMobile],
  );
  const { loading, data } = useQuery(
    filter === TrovesFilterType.below
      ? GetTrovesBelowDocument
      : GetTrovesAboveDocument,
    {
      variables: {
        first: trovesCountToFetch,
        userCollateralRatioKey: userCollateralRatioKey,
      },
      client: zeroClient,
    },
  );

  return { loading, data };
};
