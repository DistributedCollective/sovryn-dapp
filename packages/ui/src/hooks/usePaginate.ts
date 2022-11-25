import { useState } from 'react';

const DEFAULT_ITEMS_PER_PAGE = 5;

export const usePaginate = (
  pageSize = DEFAULT_ITEMS_PER_PAGE,
  listLength?: number,
) => {
  const [activePage, setActivePage] = useState(0);
  const paginate = <T>(arr: T[]) => {
    const startIndex = activePage * pageSize;
    const endIndex =
      arr?.length && startIndex + pageSize > arr?.length
        ? arr?.length
        : startIndex + pageSize;
    return arr?.slice(startIndex, endIndex);
  };

  const pageCount =
    listLength !== undefined ? Math.ceil(listLength / pageSize) : undefined;

  return {
    activePage,
    setActivePage,
    paginate,
    canNextPage: pageCount === undefined || activePage < pageCount - 1,
    canPreviousPage: activePage > 0,
    gotoPage: setActivePage,
    nextPage: () => setActivePage(activePage + 1),
    pageCount,
    pageSize,
    previousPage: () => setActivePage(activePage - 1),
  };
};
