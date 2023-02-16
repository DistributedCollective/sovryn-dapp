import { useQuery } from '@apollo/client';

import { useMemo } from 'react';

import { useIsMobile } from '../../../../hooks/useIsMobile';
import { zeroClient } from '../../../../utils/clients';
import { GetTrovesDocument } from '../../../../utils/graphql/zero/generated';

const trovesCount = 20;
const trovesCountMobile = 7;

export const useGetTroves = () => {
  const { isMobile } = useIsMobile();
  const trovesCountToFetch = useMemo(
    () => (!isMobile ? trovesCount : trovesCountMobile),
    [isMobile],
  );
  return useQuery(GetTrovesDocument, {
    variables: {
      first: trovesCountToFetch,
    },
    client: zeroClient,
  });
};
