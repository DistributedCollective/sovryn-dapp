import React, { useCallback, useState } from 'react';

import classNames from 'classnames';

import { noop, applyDataAttr } from '../../../../utils';
import { RowObject, ColumnOptions } from '../../TableBase.types';
import styles from './TableRow.module.css';

type TableRowProps<RowType extends RowObject> = {
  columns: ColumnOptions<RowType>[];
  row: RowType;
  index: number;
  onRowClick?: (row: RowType) => void;
  dataAttribute?: string;
  isClickable?: boolean;
};

export const TableRow = <RowType extends RowObject>({
  columns,
  row,
  index,
  onRowClick = noop,
  dataAttribute,
  isClickable,
}: TableRowProps<RowType>) => {
  const [isSelected, setIsSelected] = useState(false);
  const onClick = useCallback(() => {
    setIsSelected(prevValue => !prevValue);
    onRowClick?.(row);
  }, [onRowClick, row]);

  return (
    <>
      <tr
        key={index}
        className={classNames(styles.row, {
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
      <tr className={styles.spacer}></tr>
    </>
  );
};
