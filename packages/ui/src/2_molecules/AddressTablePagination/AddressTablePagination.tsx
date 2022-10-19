import React, { FC, useCallback, useMemo, useState } from 'react';

import classnames from 'classnames';

import { Icon } from '../../1_atoms';
import styles from './AddressTablePagination.module.css';

type AddressTablePaginationProps = {
  onPageChange: (value: number) => void;
  className?: string;
  dataLayoutId?: string;
  itemsPerPage?: number;
};

const DEFAULT_ITEMS_PER_PAGE = 5;

export const AddressTablePagination: FC<AddressTablePaginationProps> = ({
  onPageChange,
  className,
  dataLayoutId,
  itemsPerPage = DEFAULT_ITEMS_PER_PAGE,
}) => {
  const [offset, setOffset] = useState(0);
  console.log(offset);

  const handleClickNext = useCallback(() => {
    setOffset(offset + itemsPerPage);
    onPageChange(offset + itemsPerPage);
  }, [setOffset, offset, itemsPerPage, onPageChange]);

  const handleClickPrevious = useCallback(() => {
    setOffset(offset - itemsPerPage);
    onPageChange(offset - itemsPerPage);
  }, [setOffset, offset, itemsPerPage, onPageChange]);

  const isDisabled = useMemo(() => offset <= 0, [offset]);

  return (
    <div
      data-layout-id={dataLayoutId}
      className={classnames(styles.AddressTablePagination, className)}
    >
      <button type="button" disabled={isDisabled} onClick={handleClickPrevious}>
        <Icon icon="arrow-back" size={12} />
      </button>
      <button type="button" onClick={handleClickNext}>
        <Icon icon="arrow-forward" size={12} />
      </button>
    </div>
  );
};
