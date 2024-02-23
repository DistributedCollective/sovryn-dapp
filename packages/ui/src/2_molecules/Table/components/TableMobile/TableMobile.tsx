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
  loadingData,
  isLoading,
  className,
  expandedContent,
  mobileRenderer,
  subtitleRenderer,
  flatMode,
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
          expandedContent={expandedContent}
          renderer={mobileRenderer}
          subtitleRenderer={subtitleRenderer}
          flatMode={flatMode}
        />
      ))}

    {(!rows || rows.length === 0) && (
      <div className={isLoading ? styles.loading : styles.noData}>
        {isLoading ? loadingData || 'Loading data…' : noData || 'No data'}
      </div>
    )}
  </div>
);
