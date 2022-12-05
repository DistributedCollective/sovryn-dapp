import { ReactNode, useState } from 'react';

import { Accordion } from '../../../../../1_atoms';
import { noop } from '../../../../../utils';
import { SimpleTableRow } from '../../../../SimpleTable';
import { ColumnOptions, RowObject } from '../../../../TableBase';
import styles from './TableMobileRow.module.css';

type TableRowProps<RowType extends RowObject> = {
  columns: ColumnOptions<RowType>[];
  row: RowType;
  index: number;
  onRowClick?: (row: RowType) => void;
  dataAttribute?: string;
  isClickable?: boolean;
  title: ReactNode;
};

export const TableMobileRow = <RowType extends RowObject>({
  columns,
  row,
  title,
  index,
  onRowClick = noop,
  dataAttribute,
  isClickable,
}: TableRowProps<RowType>) => {
  const [open, setOpen] = useState(false);

  return (
    <Accordion
      className={styles.wrapper}
      open={open}
      onClick={setOpen}
      label={title}
    >
      <div className={styles.row}>
        {columns.map(column => (
          <SimpleTableRow
            key={column.id.toString()}
            label={column.title}
            value={
              column.cellRenderer
                ? column.cellRenderer(row, column.id)
                : row[column.id]
            }
          />
        ))}
      </div>
    </Accordion>
  );
};
