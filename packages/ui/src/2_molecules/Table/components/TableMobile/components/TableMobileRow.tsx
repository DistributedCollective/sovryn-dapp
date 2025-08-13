import { ReactNode, useCallback, useMemo, useState } from 'react';

import classNames from 'classnames';

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
  titleRenderer:
    | ((row: RowType, isOpen?: boolean | undefined) => React.ReactNode)
    | undefined;
  expandedContent?: (row: RowType) => ReactNode;
  renderer?: (row: RowType) => ReactNode;
  subtitleRenderer?: (row: RowType) => ReactNode;
  flatMode?: boolean;
  index: number;
};

export const TableMobileRow = <RowType extends RowObject>({
  columns,
  row,
  onRowClick = noop,
  dataAttribute,
  titleRenderer,
  expandedContent,
  renderer,
  subtitleRenderer,
  flatMode,
  index,
}: TableMobileRowProps<RowType>) => {
  const [open, setOpen] = useState(false);

  const onClick = useCallback(() => {
    if (!flatMode) {
      onRowClick?.(row);
    }
  }, [flatMode, onRowClick, row]);

  const title = useMemo(
    () => <>{titleRenderer?.(row, open) || index}</>,
    [index, open, row, titleRenderer],
  );
  return (
    <>
      <Accordion
        open={open}
        onClick={setOpen}
        label={title}
        labelClassName={styles.accordion}
        dataAttribute={dataAttribute}
        style={AccordionStyle.secondary}
        flatMode={flatMode}
      >
        <div onClick={onClick} className={styles.row}>
          {!renderer &&
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
                valueClassName={classNames(column.valueClassName, styles.value)}
                className={classNames(column.className, styles.tableRow)}
              />
            ))}
          {expandedContent && <div>{expandedContent(row)}</div>}
          {renderer && renderer(row)}
        </div>
      </Accordion>
      {!open && subtitleRenderer && subtitleRenderer(row)}
    </>
  );
};
