import { useQuery } from '@apollo/client';

import { useMemo } from 'react';

import { useIsMobile } from '../../../../hooks/useIsMobile';
import { zeroClient } from '../../../../utils/clients';
import { GetTrovesDocument } from '../../../../utils/graphql/zero/generated';
import { useAccount } from './../../../../hooks/useAccount';

const trovesCount = 20;
const trovesCountMobile = 7;

export const useGetTroves = () => {
  const { isMobile } = useIsMobile();
  const account = useAccount();
  const trovesCountToFetch = useMemo(
    () => (!isMobile ? trovesCount : trovesCountMobile),
    [isMobile],
  );
  const { loading, data } = useQuery(GetTrovesDocument, {
    variables: {
      first: trovesCountToFetch,
      id: account,
    },
    client: zeroClient,
  });

  return { loading, data };
};
