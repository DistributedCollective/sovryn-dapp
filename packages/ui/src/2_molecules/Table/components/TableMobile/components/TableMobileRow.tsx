import { ReactNode, useCallback, useState } from 'react';

import { Accordion, AccordionStyle } from '../../../../../1_atoms';
import { noop } from '../../../../../utils';
import { SimpleTableRow } from '../../../../SimpleTable';
import { ColumnOptions, RowObject } from '../../../../TableBase';
import styles from './TableMobileRow.module.css';

type TableMobileRowProps<RowType extends RowObject> = {
  columns: ColumnOptions<RowType>[];
  row: RowType;
  onRowClick?: (row: RowType) => void;
  dataAttribute?: string;
  title: ReactNode;
  expandedContent?: (row: RowType) => ReactNode;
  renderer?: (row: RowType) => ReactNode;
};

export const TableMobileRow = <RowType extends RowObject>({
  columns,
  row,
  onRowClick = noop,
  dataAttribute,
  title,
  expandedContent,
  renderer,
}: TableMobileRowProps<RowType>) => {
  const [open, setOpen] = useState(false);

  const onClick = useCallback(() => {
    onRowClick?.(row);
  }, [onRowClick, row]);

  return (
    <Accordion
      open={open}
      onClick={setOpen}
      label={title}
      labelClassName={styles.accordion}
      dataAttribute={dataAttribute}
      style={AccordionStyle.secondary}
    >
      <div onClick={onClick} className={styles.row}>
        {!expandedContent &&
          !renderer &&
          columns.map(column => (
            <SimpleTableRow
              key={column.id.toString()}
              label={column.title}
              labelClassName={column.labelClassName}
              value={
                column.cellRenderer
                  ? column.cellRenderer(row, column.id)
                  : row[column.id]
              }
              valueClassName={column.valueClassName}
              className={column.className}
            />
          ))}
        {expandedContent && <div>{expandedContent(row)}</div>}
        {renderer && renderer(row)}
      </div>
    </Accordion>
  );
};
