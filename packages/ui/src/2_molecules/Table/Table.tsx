import React, { ReactNode } from 'react';

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
  columns: ColumnOptions<RowType>[];
  rows?: RowType[];
  rowKey?: (row: RowType) => number | string;
  noData?: ReactNode;
  onRowClick?: (row: RowType) => void;
  dataAttribute?: string;
  isClickable?: boolean;

  orderOptions?: OrderOptions;
  setOrderOptions?: (sort: OrderOptions) => void;
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
}: TableProps<RowType>) => {
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
                  onClick={() => {
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
                    {orderOptions?.orderBy === column.id && (
                      <>
                        {orderOptions?.orderDirection === OrderDirection.Asc ? (
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

                <button className={styles.filters}>
                  <Icon icon={IconNames.FUNNEL} size={12} viewBox="0 0 12 8" />
                </button>
              </span>
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
              isClickable={isClickable}
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
