import { useMemo } from 'react';

import { zeroClient } from '../../utils/clients';
import {
  TroveStatus,
  useGetUserOpenTroveQuery,
} from '../../utils/graphql/zero/generated';
import { useWalletConnect } from '../useWalletConnect';

export const useGetOpenTrove = () => {
  const { account } = useWalletConnect();
  const { loading, data } = useGetUserOpenTroveQuery({
    variables: { user: account },
    client: zeroClient,
  });

  const isTroveOpenExists = useMemo(
    () => !loading && data?.trove?.status === TroveStatus.Open,
    [loading, data],
  );

  return isTroveOpenExists;
};
