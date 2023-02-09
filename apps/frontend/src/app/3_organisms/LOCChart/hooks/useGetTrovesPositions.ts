import { useQuery } from '@apollo/client';

import { useMemo } from 'react';

import { useIsMobile } from '../../../../hooks/useIsMobile';
import { zeroClient } from '../../../../utils/clients';
import {
  GetTrovesAboveDocument,
  GetTrovesBelowDocument,
} from '../../../../utils/graphql/zero/generated';
import { TrovesFilterType } from '../types';

const trovesCount = 10;
const trovesCountMobile = 3;

export const useGetTrovesPositions = (
  userCollateralRatioKey: string,
  filter: TrovesFilterType,
) => {
  const { isMobile } = useIsMobile();
  const trovesCountToFetch = useMemo(
    () => (!isMobile ? trovesCount : trovesCountMobile),
    [isMobile],
  );
  return useQuery(
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
};
