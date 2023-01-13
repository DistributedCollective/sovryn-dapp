import React, { Fragment, useCallback, useState } from 'react';

import classNames from 'classnames';

import { noop, applyDataAttr } from '../../utils';
import { ColumnOptions, RowObject } from '../TableBase';
import styles from './TableRow.module.css';
import { TableRowSize } from './TableRow.types';

type TableRowProps<RowType extends RowObject> = {
  columns: ColumnOptions<RowType>[];
  row: RowType;
  index: number;
  onRowClick?: (row: RowType) => void;
  dataAttribute?: string;
  isClickable?: boolean;
  className?: string;
  size?: TableRowSize;
};

export const TableRow = <RowType extends RowObject>({
  columns,
  row,
  index,
  onRowClick = noop,
  dataAttribute,
  isClickable,
  className,
  size = TableRowSize.small,
}: TableRowProps<RowType>) => {
  const [isSelected, setIsSelected] = useState(false);
  const onClick = useCallback(() => {
    setIsSelected(prevValue => !prevValue);
    onRowClick?.(row);
  }, [onRowClick, row]);

  return (
    <Fragment key={index}>
      <tr
        key={index}
        className={classNames(styles.row, className, styles[size], {
          [styles.clickable]: isClickable,
          [styles.active]: isClickable && isSelected,
        })}
        onClick={onClick}
        {...applyDataAttr(`${dataAttribute}-row-${index}`)}
      >
        {columns.map(column => (
          <td
            key={column.id.toString()}
            className={classNames(
              column.align && [styles[`text${column.align}`]],
            )}
          >
            {column.cellRenderer
              ? column.cellRenderer(row, column.id)
              : row[column.id]}
          </td>
        ))}
      </tr>
      <tr className={classNames(styles.spacer, styles[size])}></tr>
    </Fragment>
  );
};
