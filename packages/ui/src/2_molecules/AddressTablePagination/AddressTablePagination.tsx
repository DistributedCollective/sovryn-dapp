import React, { FC, useCallback, useMemo, useState } from 'react';

import classnames from 'classnames';

import { Icon } from '../../1_atoms';
import styles from './AddressTablePagination.module.css';

type AddressTablePaginationProps = {
  onPageChange: (value: number) => void;
  className?: string;
  dataLayoutId?: string;
  limit?: number;
};

const DEFAULT_LIMIT = 5;

export const AddressTablePagination: FC<AddressTablePaginationProps> = ({
  onPageChange,
  className,
  dataLayoutId,
  limit = DEFAULT_LIMIT,
}) => {
  const [offset, setOffset] = useState(0);

  const handleMoveRight = useCallback(() => {
    setOffset(offset + limit);
    onPageChange(offset);
  }, [setOffset, offset, limit, onPageChange]);

  const handleMoveLeft = useCallback(() => {
    setOffset(offset - limit);
    onPageChange(offset);
  }, [setOffset, offset, limit, onPageChange]);

  const isDisabled = useMemo(() => offset <= 0, [offset]);

  return (
    <div
      data-layout-id={dataLayoutId}
      className={classnames(styles.AddressTablePagination, className)}
    >
      <button type="button" disabled={isDisabled} onClick={handleMoveLeft}>
        <Icon icon="arrow-back" size={12} />
      </button>
      <button type="button" onClick={handleMoveRight}>
        <Icon icon="arrow-forward" size={12} />
      </button>
    </div>
  );
};
