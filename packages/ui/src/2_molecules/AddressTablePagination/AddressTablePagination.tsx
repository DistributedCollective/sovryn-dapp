import React, { FC } from 'react';

import classNames from 'classnames';

import { Icon, IconNames } from '../../1_atoms';
import { applyDataAttr } from '../../utils';
import styles from './AddressTablePagination.module.css';

type AddressTablePaginationProps = {
  className?: string;
  dataLayoutId?: string;
  pageSize: number;
  pageIndex: number;
  pageCount?: number;
  canNextPage: boolean;
  canPreviousPage: boolean;
  nextPage: () => void;
  previousPage: () => void;
  gotoPage: (page: number) => void;
  length?: number;
};

export const AddressTablePagination: FC<AddressTablePaginationProps> = ({
  className,
  dataLayoutId,
  previousPage,
  nextPage,
  canNextPage,
  canPreviousPage,
  pageIndex,
  pageCount,
  gotoPage,
}) => {
  return (
    <div
      {...applyDataAttr(dataLayoutId)}
      className={classNames(styles.AddressTablePagination, className)}
    >
      {pageCount !== undefined && (
        <button
          className={styles.action}
          type="button"
          disabled={pageIndex === 0}
          onClick={() => gotoPage(0)}
        >
          <Icon icon={IconNames.DOUBLE_LEFT} size={12} />
        </button>
      )}
      <button
        className={styles.action}
        type="button"
        disabled={!canPreviousPage}
        onClick={previousPage}
        {...applyDataAttr(`${dataLayoutId}-previous`)}
      >
        <Icon icon={IconNames.ARROW_BACK} size={12} />
      </button>
      {pageCount !== undefined ? (
        <>
          {new Array(pageCount).fill(0).map((_item, index) => (
            <button
              className={classNames(styles.page, {
                [styles.active]: index === pageIndex,
              })}
              onClick={() => gotoPage(index)}
            >
              {index + 1}
            </button>
          ))}
        </>
      ) : (
        <button className={classNames(styles.page, styles.active)}>
          {pageIndex + 1}
        </button>
      )}
      <button
        className={styles.action}
        type="button"
        disabled={!canNextPage}
        onClick={nextPage}
        {...applyDataAttr(`${dataLayoutId}-next`)}
      >
        <Icon icon={IconNames.ARROW_FORWARD} size={12} />
      </button>

      {pageCount !== undefined && (
        <button
          className={styles.action}
          type="button"
          disabled={pageIndex + 1 === pageCount}
          onClick={() => gotoPage(pageCount - 1)}
        >
          <Icon
            className={styles.doubleRight}
            icon={IconNames.DOUBLE_LEFT}
            size={12}
          />
        </button>
      )}
    </div>
  );
};
