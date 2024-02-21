import { useCallback, useMemo, useState } from 'react';

import { User } from '../../../Leaderboard.types';
import { PAGE_SIZE } from '../StakingLeaderboard.constants';

export const useHandlePagination = (users: User[]) => {
  const [page, setPage] = useState(0);

  const onPageChange = useCallback(
    (value: number) => {
      if (users?.length < PAGE_SIZE && value > page) {
        return;
      }

      setPage(value);
    },
    [page, users?.length],
  );

  const paginatedUsers = useMemo(() => {
    if (users) {
      return users.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
    }
    return [];
  }, [page, users]);

  const isNextButtonDisabled = useMemo(
    () => users?.length <= PAGE_SIZE || paginatedUsers?.length < PAGE_SIZE,
    [paginatedUsers?.length, users?.length],
  );

  return { page, onPageChange, paginatedUsers, isNextButtonDisabled };
};
