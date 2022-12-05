import React, { isValidElement } from 'react';

import classNames from 'classnames';

import { Icon, IconNames } from '../../../../1_atoms';
import { applyDataAttr } from '../../../../utils';
import { RowObject } from '../../../TableBase';
import { OrderDirection, TableProps } from '../../Table.types';
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
                  }}
                  className={styles.title}
                >
                  <>
                    {column.title || column.id}
                    {orderOptions?.orderBy === column.id.toString() &&
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
