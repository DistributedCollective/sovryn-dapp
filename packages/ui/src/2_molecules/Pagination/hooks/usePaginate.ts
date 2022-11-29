import { useCallback, useMemo } from 'react';

export const usePaginate = (
  pageIndex: number,
  setPageIndex: (page: number) => void,
  pageSize: number,
  listLength?: number,
) => {
  const totalPages = useMemo(
    () =>
      listLength !== undefined ? Math.ceil(listLength / pageSize) : undefined,
    [listLength, pageSize],
  );
  const isNextButtonDisabled = useMemo(
    () => totalPages !== undefined && pageIndex >= totalPages - 1,
    [totalPages, pageIndex],
  );
  const isPreviousButtonDisabled = useMemo(() => pageIndex < 1, [pageIndex]);

  const onNextPage = useCallback(
    () => setPageIndex(pageIndex + 1),
    [pageIndex, setPageIndex],
  );
  const onPreviousPage = useCallback(
    () => setPageIndex(Math.max(pageIndex - 1, 0)),
    [pageIndex, setPageIndex],
  );

  return {
    isNextButtonDisabled,
    isPreviousButtonDisabled,
    onPreviousPage,
    onNextPage,
    totalPages,
  };
};
