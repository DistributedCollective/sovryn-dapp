import React, { isValidElement, ReactNode } from 'react';

import classNames from 'classnames';

import { Icon, IconNames } from '../../1_atoms';
import { applyDataAttr } from '../../utils';
import { ColumnOptions, RowObject } from '../TableBase';
import styles from './Table.module.css';
import { OrderDirection, OrderOptions } from './Table.types';
import { TableRow } from './components/TableRow/TableRow';
import rowStyles from './components/TableRow/TableRow.module.css';

export type TableProps<RowType extends RowObject> = {
  className?: string;
  columns: (ColumnOptions<RowType> & {
    filter?: ReactNode;
    sortable?: boolean;
  })[];
  rows?: RowType[];
  rowKey?: (row: RowType) => number | string;
  noData?: ReactNode;
  onRowClick?: (row: RowType) => void;
  dataAttribute?: string;
  isClickable?: boolean;
  orderOptions?: OrderOptions;
  setOrderOptions?: (sort: OrderOptions) => void;
  isLoading?: boolean;
};

// No React.FC, since doesn't support Generic PropTypes
export const Table = <RowType extends RowObject>({
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
  return (
    <div className={styles.wrapper}>
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
                    onClick={() => {
                      if (!column.sortable) {
                        return;
                      }

                      if (
                        orderOptions?.orderBy === column.id &&
                        orderOptions?.orderDirection === OrderDirection.Asc
                      ) {
                        setOrderOptions?.({
                          orderBy: undefined,
                          orderDirection: OrderDirection.Asc,
                        });
                      } else {
                        setOrderOptions?.({
                          orderBy: column.id.toString(),
                          orderDirection:
                            orderOptions?.orderDirection === OrderDirection.Asc
                              ? OrderDirection.Desc
                              : OrderDirection.Asc,
                        });
                      }
                    }}
                    className={styles.title}
                  >
                    <>
                      {column.title || column.id}
                      {orderOptions?.orderBy === column.id &&
                        column.sortable && (
                          <>
                            {orderOptions?.orderDirection ===
                            OrderDirection.Asc ? (
                              <Icon
                                icon={IconNames.ARROW_RIGHT}
                                className="-rotate-90 ml-2"
                                size={12}
                              />
                            ) : (
                              <Icon
                                icon={IconNames.ARROW_RIGHT}
                                className="rotate-90 ml-2"
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
    </div>
  );
};
