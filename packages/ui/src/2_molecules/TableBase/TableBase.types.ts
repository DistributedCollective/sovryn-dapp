import { ReactNode } from 'react';

export type RowObject = { [param: string]: any };

export enum Align {
  left = 'Left',
  center = 'Center',
  right = 'Right',
}

export type ColumnOptions<RowType extends RowObject> = {
  id: keyof RowType | string;
  title?: ReactNode;
  align?: Align;
  className?: string;
  cellRenderer?: (
    row: RowType,
    columnId: ColumnOptions<RowType>['id'],
  ) => ReactNode;
};
