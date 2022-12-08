import classNames from 'classnames';

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
  noData,
  isLoading,
  className,
}: TableProps<RowType>) => (
  <div className={classNames(styles.wrapper, className)}>
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

    {(!rows || rows.length === 0) && (
      <>
        {isLoading ? (
          Array.from(Array(4).keys()).map(i => (
            <div key={i} className={styles.noData}>
              <span className={styles.loading} />
            </div>
          ))
        ) : (
          <div className={styles.noData}>{noData ? noData : 'No data'}</div>
        )}
      </>
    )}
  </div>
);
