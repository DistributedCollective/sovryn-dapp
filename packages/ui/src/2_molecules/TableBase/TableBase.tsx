import React, { ReactNode, useCallback, useEffect, useState } from 'react';

import classNames from 'classnames';

import { applyDataAttr } from '../../utils';
import { TableRow } from '../TableRow';
import rowStyles from '../TableRow/TableRow.module.css';
import styles from './TableBase.module.css';
import { ColumnOptions, RowObject } from './TableBase.types';

export type TableBaseProps<RowType extends RowObject> = {
  className?: string;
  columns: ColumnOptions<RowType>[];
  rows?: RowType[];
  rowKey?: (row: RowType) => number | string;
  noData?: ReactNode;
  onRowClick?: (row: RowType) => void;
  dataAttribute?: string;
  isClickable?: boolean;
};

// No React.FC, since doesn't support Generic PropTypes
export const TableBase = <RowType extends RowObject>({
  className,
  columns,
  rows,
  rowKey,
  noData,
  onRowClick,
  dataAttribute,
  isClickable,
}: TableBaseProps<RowType>) => {
  const [selectedIndex, setSelectedIndex] = useState<number>();
  useEffect(() => {
    // Reset selected index when rows change
    setSelectedIndex(undefined);
  }, [rows]);

  const handleRowClick = useCallback(
    (row: RowType) => {
      onRowClick?.(row);
      const index = rows?.indexOf(row);
      setSelectedIndex(index === selectedIndex ? undefined : index);
    },
    [onRowClick, rows, selectedIndex],
  );

  return (
    <table
      className={classNames(styles.table, className)}
      {...applyDataAttr(dataAttribute)}
    >
      <thead>
        <tr>
          {columns.map(column => (
            <th
              key={column.id.toString()}
              className={classNames(
                styles.header,
                column.align && [styles[`text${column.align}`]],
                column.className,
              )}
            >
              <>{column.title || column.id}</>
            </th>
          ))}
        </tr>
      </thead>
      <tbody className={styles.body}>
        {rows && rows.length >= 1 ? (
          rows.map((row, index) => (
            <TableRow
              key={rowKey?.(row) || JSON.stringify(row)}
              columns={columns}
              row={row}
              index={index}
              onRowClick={handleRowClick}
              isSelected={selectedIndex === index}
              dataAttribute={dataAttribute}
              isClickable={isClickable}
              className={styles.row}
            />
          ))
        ) : (
          <tr className={rowStyles.row}>
            <td className={styles.noData} colSpan={999}>
              {noData ? noData : 'No data'}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};
