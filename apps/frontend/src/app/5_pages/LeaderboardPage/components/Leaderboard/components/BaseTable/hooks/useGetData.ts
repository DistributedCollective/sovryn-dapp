import { useCallback, useEffect, useMemo, useState } from 'react';

import { useAccount } from '../../../../../../../../hooks/useAccount';
import { User } from '../../../Leaderboard.types';
import { MAXIMUM_USERS_TO_SHOW } from '../BaseTable.constants';
import { parseBadges } from '../BaseTable.utils';

export const useGetData = (url: string) => {
  const { account } = useAccount();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const response = await fetch(url);

    if (response.ok) {
      const data = await response.json();

      if (data) {
        const result = data?.query_result?.data?.rows;

        if (result?.length > 0) {
          setUsers(
            result.map(item => ({
              rank: item.rank,
              wallet: item.user,
              points: item.points,
              badges: parseBadges(item),
            })),
          );
        }
      }
    }
    setLoading(false);
  }, [url]);

  const connectedWalletRow = useMemo(() => {
    if (account && users.length > 0) {
      const user = users.find(
        item => item.wallet.toLowerCase() === account.toLowerCase(),
      );

      if (user) {
        return [user];
      }
      return [];
    }
    return [];
  }, [account, users]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    loading,
    users: users.slice(0, MAXIMUM_USERS_TO_SHOW),
    connectedWalletRow,
  };
};
