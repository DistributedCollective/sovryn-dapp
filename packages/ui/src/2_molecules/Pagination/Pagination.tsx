import React, { FC } from 'react';

import classNames from 'classnames';

import { IconNames } from '../../1_atoms';
import { applyDataAttr } from '../../utils';
import styles from './Pagination.module.css';
import { PaginationButton } from './components/PaginationButton/PaginationButton';
import { usePaginate } from './hooks/usePaginate';

type PaginationProps = {
  className?: string;
  dataAttribute?: string;
  itemsPerPage?: number;
  page: number;
  onChange: (page: number) => void;
  totalItems?: number;
  hideFirstPageButton?: boolean;
  hideLastPageButton?: boolean;
  isNextButtonDisabled?: boolean;
  pageLimit?: number;
};

const DEFAULT_ITEMS_PER_PAGE = 5;

export const Pagination: FC<PaginationProps> = ({
  className,
  dataAttribute,
  itemsPerPage = DEFAULT_ITEMS_PER_PAGE,
  page,
  onChange,
  totalItems,
  hideFirstPageButton,
  hideLastPageButton,
  isNextButtonDisabled,
  pageLimit,
}) => {
  const {
    isNextButtonDisabled: nextButtonDisabled,
    isPreviousButtonDisabled,
    onPreviousPage,
    onNextPage,
    onFirstPage,
    onLastPage,
    totalPages,
  } = usePaginate(page, onChange, itemsPerPage, totalItems);

  if (totalItems === 0) {
    return null;
  }

  return (
    <div
      {...applyDataAttr(dataAttribute)}
      className={classNames(styles.paginationWrapper, className)}
    >
      {!hideFirstPageButton && (
        <PaginationButton
          disabled={page === 0}
          onClick={onFirstPage}
          icon={IconNames.DOUBLE_LEFT}
          dataAttribute={`${dataAttribute}-first`}
        />
      )}
      <PaginationButton
        disabled={isPreviousButtonDisabled}
        onClick={onPreviousPage}
        icon={IconNames.ARROW_BACK}
        dataAttribute={`${dataAttribute}-previous`}
      />
      {totalPages !== undefined ? (
        <>
          {new Array(
            pageLimit && pageLimit < totalPages ? pageLimit : totalPages,
          )
            .fill(0)
            .map((_item, index) => {
              let start = pageLimit
                ? Math.max(Math.floor(page - pageLimit / 2), 0)
                : 0;

              if (pageLimit && start + pageLimit > totalPages) {
                start = totalPages - pageLimit;
              }
              const pageNumber = index + start;

              return (
                <button
                  key={pageNumber}
                  className={classNames(styles.page, {
                    [styles.active]: pageNumber === page,
                  })}
                  onClick={() => onChange(pageNumber)}
                >
                  {pageNumber + 1}
                </button>
              );
            })}
        </>
      ) : (
        <button className={classNames(styles.page, styles.active)}>
          {page + 1}
        </button>
      )}
      <PaginationButton
        disabled={nextButtonDisabled || !!isNextButtonDisabled}
        onClick={onNextPage}
        dataAttribute={`${dataAttribute}-next`}
        icon={IconNames.ARROW_FORWARD}
      />
      {totalPages !== undefined && !hideLastPageButton && (
        <PaginationButton
          disabled={page + 1 === totalPages}
          onClick={onLastPage}
          icon={IconNames.DOUBLE_LEFT}
          iconClassName={styles.doubleRight}
          dataAttribute={`${dataAttribute}-last`}
        />
      )}
    </div>
  );
};
