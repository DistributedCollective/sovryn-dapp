import { RowObject } from '../../../TableBase';
import { TableProps } from '../../Table.types';
import styles from './TableMobile.module.css';
import { TableMobileRow } from './components/TableMobileRow';

// No React.FC, since doesn't support Generic PropTypes
export const TableMobile = <RowType extends RowObject>({
  columns,
  rows,
  rowKey,
  rowTitle,
  onRowClick,
  dataAttribute,
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
            onRowClick={onRowClick}
            dataAttribute={dataAttribute}
          />
        ))}
    </div>
  );
};
