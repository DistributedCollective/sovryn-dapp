import React, { Fragment, ReactNode, useCallback } from 'react';

import classNames from 'classnames';

import { noop, applyDataAttr } from '../../utils';
import { ColumnOptions, RowObject } from '../TableBase';
import styles from './TableRow.module.css';
import { TableRowSize } from './TableRow.types';

type TableRowProps<RowType extends RowObject> = {
  columns: ColumnOptions<RowType>[];
  row: RowType;
  index: number;
  isSelected?: boolean;
  onRowClick?: (row: RowType) => void;
  dataAttribute?: string;
  isClickable?: boolean;
  className?: string;
  size?: TableRowSize;
  expandedContent?: (row: RowType) => ReactNode;
  expandedClassNames?: string;
  preventExpandOnClickClass?: string;
  expandedRow?: boolean;
};

export const TableRow = <RowType extends RowObject>({
  columns,
  row,
  index,
  onRowClick = noop,
  isSelected,
  dataAttribute,
  isClickable,
  className,
  size = TableRowSize.small,
  expandedContent,
  expandedClassNames = '',
  preventExpandOnClickClass,
  expandedRow,
}: TableRowProps<RowType>) => {
  const onClick = useCallback(
    (event: React.MouseEvent<HTMLTableRowElement>) => {
      if (preventExpandOnClickClass) {
        let currentElement: HTMLElement | null = event.target as HTMLElement;

        while (currentElement !== null) {
          if (currentElement.classList.contains(preventExpandOnClickClass)) {
            return;
          }
          currentElement = currentElement.parentElement;
        }
      }
      onRowClick?.(row);
    },
    [onRowClick, row, preventExpandOnClickClass],
  );

  return (
    <Fragment key={index}>
      <tr
        key={index}
        className={classNames(styles.row, className, styles[size], {
          [styles.clickable]: isClickable || expandedContent,
          [styles.active]: isClickable && isSelected,
          [styles.expanded]: expandedRow && expandedContent,
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
      {expandedRow && expandedContent && (
        <tr key={JSON.stringify(row)} className={expandedClassNames}>
          <td colSpan={columns.length}>{expandedContent(row)}</td>
        </tr>
      )}
      <tr className={classNames(styles.spacer, styles[size])}></tr>
    </Fragment>
  );
};
