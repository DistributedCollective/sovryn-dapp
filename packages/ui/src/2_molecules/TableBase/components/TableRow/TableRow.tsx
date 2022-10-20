import React, { useCallback } from 'react';

import classNames from 'classnames';

import { noop } from '../../../../utils';
import { RowObject, ColumnOptions } from '../../TableBase.types';
import styles from './TableRow.module.css';

type TableRowProps<RowType extends RowObject> = {
  columns: ColumnOptions<RowType>[];
  row: RowType;
  index: number;
  onRowClick?: (row: RowType) => void;
  dataAttribute?: string;
};

export const TableRow = <RowType extends RowObject>({
  columns,
  row,
  index,
  onRowClick = noop,
  dataAttribute,
}: TableRowProps<RowType>) => {
  const onClick = useCallback(() => onRowClick?.(row), [onRowClick, row]);

  return (
    <>
      <tr
        key={index}
        className={styles.row}
        onClick={onClick}
        data-layout-id={`${dataAttribute}-row-${index}`}
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
      <tr className={styles.spacer}></tr>
    </>
  );
};
