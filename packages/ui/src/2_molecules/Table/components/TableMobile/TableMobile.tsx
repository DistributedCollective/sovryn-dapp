import { RowObject } from '../../../TableBase';
import { TableProps } from '../../Table.types';
import styles from './TableMobile.module.css';
import { TableMobileRow } from './components/TableMobileRow';

// No React.FC, since doesn't support Generic PropTypes
export const TableMobile = <RowType extends RowObject>({
  className,
  columns,
  rows,
  rowKey,
  rowTitle,
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
      {rows &&
        rows.length >= 1 &&
        rows.map((row, index) => (
          <TableMobileRow
            key={rowKey?.(row) || JSON.stringify(row)}
            title={rowTitle?.(row) || index}
            columns={columns}
            row={row}
            index={index}
            onRowClick={onRowClick}
            dataAttribute={dataAttribute}
            isClickable={isClickable}
          />
        ))}
    </div>
  );
};
