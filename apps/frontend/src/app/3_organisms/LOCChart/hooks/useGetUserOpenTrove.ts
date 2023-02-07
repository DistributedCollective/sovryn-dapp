import { useQuery } from '@apollo/client';

import { useMemo } from 'react';

import { zeroClient } from '../../../../utils/clients';
import { GetUserOpenTroveDocument } from '../../../../utils/graphql/zero/generated';
import { useAccount } from './../../../../hooks/useAccount';

export const useGetUserOpenTrove = () => {
  const { account } = useAccount();
  const troveConfig = useMemo(
    () => ({
      user: account,
    }),
    [account],
  );

  return useQuery(GetUserOpenTroveDocument, {
    variables: troveConfig,
    client: zeroClient,
  });
};
