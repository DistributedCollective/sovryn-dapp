import { useQuery } from '@apollo/client';

import { useMemo } from 'react';

import { useWalletConnect } from '../../../../hooks/useWalletConnect';
import { zeroClient } from '../../../../utils/clients';
import { GetUserOpenTroveDocument } from '../../../../utils/graphql/zero/generated';

export const useGetUserOpenTrove = () => {
  const { account } = useWalletConnect();
  const troveConfig = useMemo(
    () => ({
      user: account,
    }),
    [account],
  );

  const { loading, data } = useQuery(GetUserOpenTroveDocument, {
    variables: troveConfig,
    client: zeroClient,
  });

  return { loading, data };
};
