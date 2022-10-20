import React, { ReactNode } from 'react';

import classNames from 'classnames';

import styles from './TableBase.module.css';
import { ColumnOptions, RowObject } from './TableBase.types';
import { TableRow } from './components/TableRow/TableRow';
import rowStyles from './components/TableRow/TableRow.module.css';

export type TableBaseProps<RowType extends RowObject> = {
  className?: string;
  columns: ColumnOptions<RowType>[];
  rows?: RowType[];
  rowKey?: (row: RowType) => number | string;
  noData?: ReactNode;
  onRowClick?: (row: RowType) => void;
  dataAttribute?: string;
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
}: TableBaseProps<RowType>) => {
  return (
    <table
      className={classNames(styles.table, className)}
      data-layout-id={dataAttribute}
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
              onRowClick={onRowClick}
              dataAttribute={dataAttribute}
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
