import React, { isValidElement, useCallback } from 'react';

import classNames from 'classnames';

import { Icon, IconNames } from '../../../../1_atoms';
import { applyDataAttr } from '../../../../utils';
import { RowObject } from '../../../TableBase';
import { ColumnOptions, OrderDirection, TableProps } from '../../Table.types';
import { TableRow } from '../TableRow/TableRow';
import rowStyles from '../TableRow/TableRow.module.css';
import styles from './TableDesktop.module.css';

// No React.FC, since doesn't support Generic PropTypes
export const TableDesktop = <RowType extends RowObject>({
  className,
  columns,
  rows,
  rowKey,
  noData,
  onRowClick,
  dataAttribute,
  isClickable,
  orderOptions,
  setOrderOptions,
  isLoading,
}: TableProps<RowType>) => {
  const onColumnClick = useCallback(
    (column: ColumnOptions<RowType>) => {
      if (!column.sortable) {
        return;
      }

      setOrderOptions?.({
        orderBy: column.id.toString(),
        orderDirection:
          orderOptions?.orderBy === column.id
            ? orderOptions?.orderDirection === OrderDirection.Asc
              ? OrderDirection.Desc
              : OrderDirection.Asc
            : OrderDirection.Asc,
      });
    },
    [orderOptions?.orderBy, orderOptions?.orderDirection, setOrderOptions],
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
              <span className={styles.headerContent}>
                <span
                  onClick={() => onColumnClick(column)}
                  className={classNames(styles.title, {
                    [styles.sortable]: column.sortable,
                  })}
                >
                  <>
                    {column.title || column.id}
                    {column.sortable && (
                      <>
                        {orderOptions?.orderDirection === OrderDirection.Asc ? (
                          <Icon
                            icon={IconNames.ARROW_RIGHT}
                            className={classNames(styles.icon, styles.up, {
                              [styles.active]:
                                orderOptions?.orderBy === column.id.toString(),
                            })}
                            size={12}
                          />
                        ) : (
                          <Icon
                            icon={IconNames.ARROW_RIGHT}
                            className={classNames(styles.icon, styles.down, {
                              [styles.active]:
                                orderOptions?.orderBy === column.id.toString(),
                            })}
                            size={12}
                          />
                        )}
                      </>
                    )}
                  </>
                </span>

                {isValidElement(column.filter) && column.filter}
              </span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody className={styles.body}>
        {rows &&
          rows.length >= 1 &&
          rows.map((row, index) => (
            <TableRow
              key={rowKey?.(row) || JSON.stringify(row)}
              columns={columns}
              row={row}
              index={index}
              onRowClick={onRowClick}
              dataAttribute={dataAttribute}
              isClickable={isClickable}
            />
          ))}
        {(!rows || rows.length === 0) && (
          <>
            <tr className={rowStyles.sampleRow}>
              {columns.map(column => (
                <td key={column.id.toString()}>
                  <div>{column.sample}</div>
                </td>
              ))}
            </tr>

            {isLoading ? (
              <tr className={rowStyles.row}>
                <td className={styles.noData} colSpan={999}>
                  <span className={styles.loading} />
                </td>
              </tr>
            ) : (
              <tr className={rowStyles.row}>
                <td className={styles.noData} colSpan={999}>
                  {noData ? noData : 'No data'}
                </td>
              </tr>
            )}
          </>
        )}
      </tbody>
    </table>
  );
};
