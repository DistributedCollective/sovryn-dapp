import { useCallback, useMemo } from 'react';

export const usePaginate = (
  pageIndex: number,
  setPageIndex: (page: number) => void,
  itemsPerPage: number,
  listLength?: number,
) => {
  const totalPages = useMemo(
    () =>
      listLength !== undefined
        ? Math.ceil(listLength / itemsPerPage)
        : undefined,
    [listLength, itemsPerPage],
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

  const onFirstPage = useCallback(() => setPageIndex(0), [setPageIndex]);
  const onLastPage = useCallback(
    () => totalPages !== undefined && setPageIndex(totalPages - 1),
    [totalPages, setPageIndex],
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
