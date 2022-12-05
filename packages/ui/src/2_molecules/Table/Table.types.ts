import { ReactNode } from 'react';

import { ColumnOptions, RowObject } from '../TableBase';

export type TableProps<RowType extends RowObject> = {
  className?: string;
  columns: (ColumnOptions<RowType> & {
    filter?: ReactNode;
    sortable?: boolean;
    sample?: ReactNode;
  })[];
  rows?: RowType[];
  rowKey?: (row: RowType) => number | string;
  rowTitle?: (row: RowType) => ReactNode;
  noData?: ReactNode;
  onRowClick?: (row: RowType) => void;
  dataAttribute?: string;
  isClickable?: boolean;
  orderOptions?: OrderOptions;
  setOrderOptions?: (sort: OrderOptions) => void;
  isLoading?: boolean;
};

export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc',
}

export type OrderOptions = {
  orderBy?: string;
  orderDirection?: OrderDirection;
};
