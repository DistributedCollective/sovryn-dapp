import React, {
  Fragment,
  isValidElement,
  useCallback,
  useEffect,
  useState,
} from 'react';

import classNames from 'classnames';

import { applyDataAttr } from '../../../../utils';
import { RowObject } from '../../../TableBase';
import { TableRow } from '../../../TableRow';
import rowStyles from '../../../TableRow/TableRow.module.css';
import { TableRowSize } from '../../../TableRow/TableRow.types';
import { ColumnOptions, OrderDirection, TableProps } from '../../Table.types';
import styles from './TableDesktop.module.css';
import { OrderDirectionIcon } from './components/OrderDirectionIcon/OrderDirectionIcon';

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
  expandedContent,
  preventExpandOnClickClass,
}: TableProps<RowType>) => {
  const [selectedIndex, setSelectedIndex] = useState<number>();
  useEffect(() => {
    // Reset selected index when rows change
    setSelectedIndex(undefined);
  }, [rows]);

  const onHeaderClick = useCallback(
    (column: ColumnOptions<RowType>) => {
      if (!column.sortable) {
        return;
      }

      let orderDirection = OrderDirection.Asc;

      if (
        orderOptions?.orderBy === column.id &&
        orderOptions?.orderDirection === OrderDirection.Asc
      ) {
        orderDirection = OrderDirection.Desc;
      }

      setOrderOptions?.({
        orderBy: column.id.toString(),
        orderDirection,
      });
    },
    [orderOptions?.orderBy, orderOptions?.orderDirection, setOrderOptions],
  );

  const handleRowClick = useCallback(
    (row: RowType) => {
      onRowClick?.(row);
      setSelectedIndex(rows?.indexOf(row));
    },
    [onRowClick, rows],
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
                  onClick={() => onHeaderClick(column)}
                  className={classNames(styles.title, {
                    [styles.sortable]: column.sortable,
                  })}
                >
                  <>
                    {column.title || column.id}
                    {column.sortable && (
                      <OrderDirectionIcon
                        orderBy={orderOptions?.orderBy}
                        orderDirection={orderOptions?.orderDirection}
                        id={column.id.toString()}
                        className={styles.icon}
                      />
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
              onRowClick={handleRowClick}
              isSelected={index === selectedIndex}
              dataAttribute={dataAttribute}
              isClickable={isClickable}
              className={styles.row}
              size={TableRowSize.large}
              expandedContent={expandedContent}
              preventExpandOnClickClass={preventExpandOnClickClass}
            />
          ))}
        {(!rows || rows.length === 0) && (
          <>
            <tr className={styles.sampleRow}>
              {columns.map(column => (
                <td key={column.id.toString()}>
                  <div className={styles.content}>{column.sampleData}</div>
                </td>
              ))}
            </tr>

            {isLoading ? (
              Array.from(Array(4).keys()).map(i => (
                <Fragment key={i}>
                  <tr className={rowStyles.row}>
                    <td className={styles.noData} colSpan={999}>
                      <span className={styles.loading} />
                    </td>
                  </tr>
                  <tr className={styles.spacer}></tr>
                </Fragment>
              ))
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
