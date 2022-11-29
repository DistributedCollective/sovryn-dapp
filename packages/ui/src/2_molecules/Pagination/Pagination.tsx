import React, { FC } from 'react';

import classNames from 'classnames';

import { IconNames } from '../../1_atoms';
import { applyDataAttr } from '../../utils';
import styles from './Pagination.module.css';
import { PaginationButton } from './components/PaginationButton/PaginationButton';
import { usePaginate } from './hooks/usePaginate';

type PaginationProps = {
  className?: string;
  dataLayoutId?: string;
  pageSize?: number;
  page: number;
  setPage: (page: number) => void;
  totalItems?: number;
  hideLeftArrow?: boolean;
  hideRightArrow?: boolean;
};

const DEFAULT_ITEMS_PER_PAGE = 5;

export const Pagination: FC<PaginationProps> = ({
  className,
  dataLayoutId,
  pageSize = DEFAULT_ITEMS_PER_PAGE,
  page,
  setPage,
  totalItems,
  hideLeftArrow,
  hideRightArrow,
}) => {
  const {
    isNextButtonDisabled,
    isPreviousButtonDisabled,
    onPreviousPage,
    onNextPage,
    totalPages,
  } = usePaginate(page, setPage, pageSize, totalItems);

  if (totalItems === 0) {
    return null;
  }

  return (
    <div
      {...applyDataAttr(dataLayoutId)}
      className={classNames(styles.paginationWrapper, className)}
    >
      {!hideLeftArrow && (
        <PaginationButton
          disabled={page === 0}
          onClick={() => setPage(0)}
          icon={IconNames.DOUBLE_LEFT}
          dataLayoutId={`${dataLayoutId}-first`}
        />
      )}
      <PaginationButton
        disabled={isPreviousButtonDisabled}
        onClick={onPreviousPage}
        icon={IconNames.ARROW_BACK}
        dataLayoutId={`${dataLayoutId}-previous`}
      />
      {totalPages !== undefined ? (
        <>
          {new Array(totalPages).fill(0).map((_item, index) => (
            <button
              key={index}
              className={classNames(styles.page, {
                [styles.active]: index === page,
              })}
              onClick={() => setPage(index)}
            >
              {index + 1}
            </button>
          ))}
        </>
      ) : (
        <button className={classNames(styles.page, styles.active)}>
          {page + 1}
        </button>
      )}
      <PaginationButton
        disabled={isNextButtonDisabled}
        onClick={onNextPage}
        dataLayoutId={`${dataLayoutId}-next`}
        icon={IconNames.ARROW_FORWARD}
      />
      {totalPages !== undefined && !hideRightArrow && (
        <PaginationButton
          disabled={page + 1 === totalPages}
          onClick={() => setPage(totalPages - 1)}
          icon={IconNames.DOUBLE_LEFT}
          iconClassName={styles.doubleRight}
          dataLayoutId={`${dataLayoutId}-last`}
        />
      )}
    </div>
  );
};
