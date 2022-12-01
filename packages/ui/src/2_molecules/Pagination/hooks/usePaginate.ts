import { useCallback, useMemo } from 'react';

export const usePaginate = (
  page: number,
  onChange: (page: number) => void,
  itemsPerPage: number,
  totalItems?: number,
) => {
  const totalPages = useMemo(
    () =>
      totalItems !== undefined
        ? Math.ceil(totalItems / itemsPerPage)
        : undefined,
    [totalItems, itemsPerPage],
  );
  const isNextButtonDisabled = useMemo(
    () => totalPages !== undefined && page >= totalPages - 1,
    [totalPages, page],
  );
  const isPreviousButtonDisabled = useMemo(() => page < 1, [page]);

  const onNextPage = useCallback(() => onChange(page + 1), [page, onChange]);
  const onPreviousPage = useCallback(
    () => onChange(Math.max(page - 1, 0)),
    [page, onChange],
  );

  const onFirstPage = useCallback(() => onChange(0), [onChange]);
  const onLastPage = useCallback(
    () => totalPages !== undefined && onChange(totalPages - 1),
    [totalPages, onChange],
  );

  return {
    isNextButtonDisabled,
    isPreviousButtonDisabled,
    totalPages,
    onPreviousPage,
    onNextPage,
    onFirstPage,
    onLastPage,
  };
};
