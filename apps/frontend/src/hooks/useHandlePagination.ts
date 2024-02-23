import { useCallback, useMemo, useState } from 'react';

import { DEFAULT_PAGE_SIZE } from '../constants/general';

export const useHandlePagination = <T extends object>(
  items: T[],
  pageSize = DEFAULT_PAGE_SIZE,
) => {
  const [page, setPage] = useState(0);

  const onPageChange = useCallback(
    (value: number) => {
      if (items?.length < pageSize && value > page) {
        return;
      }

      setPage(value);
    },
    [items?.length, pageSize, page],
  );

  const paginatedItems = useMemo(() => {
    if (items) {
      return items.slice(page * pageSize, (page + 1) * pageSize);
    }
    return [];
  }, [items, page, pageSize]);

  const isNextButtonDisabled = useMemo(
    () => items?.length <= pageSize || paginatedItems?.length < pageSize,
    [items?.length, pageSize, paginatedItems?.length],
  );

  return { page, onPageChange, paginatedItems, isNextButtonDisabled };
};
