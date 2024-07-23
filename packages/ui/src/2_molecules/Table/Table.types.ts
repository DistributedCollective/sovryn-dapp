import { FC, PropsWithChildren, ReactNode } from 'react';

import { Align, RowObject } from '../TableBase';

export type ColumnOptions<RowType extends RowObject> = {
  id: keyof RowType | string;
  title?: ReactNode;
  align?: Align;
  className?: string;
  cellRenderer?: (
    row: RowType,
    columnId: ColumnOptions<RowType>['id'],
  ) => ReactNode;
  filter?: ReactNode;
  sortable?: boolean;
  sampleData?: ReactNode;
};

export type TableProps<RowType extends RowObject> = {
  className?: string;
  rowClassName?: string;
  columns: ColumnOptions<RowType>[];
  rows?: RowType[];
  rowComponent?: FC<PropsWithChildren>;
  rowKey?: (row: RowType) => number | string;
  rowTitle?: (row: RowType, isOpen?: boolean) => ReactNode;
  noData?: ReactNode;
  loadingData?: ReactNode;
  onRowClick?: (row: RowType) => void;
  dataAttribute?: string;
  isClickable?: boolean;
  orderOptions?: OrderOptions;
  setOrderOptions?: (sort: OrderOptions) => void;
  isLoading?: boolean;
  expandedContent?: (row: RowType) => ReactNode;
  expandedClassNames?: string;
  preventExpandOnClickClass?: string;
  mobileRenderer?: (row: RowType) => ReactNode;
  hideHeader?: boolean;
  subtitleRenderer?: (row: RowType) => ReactNode;
  expandedIndex?: number;
  flatMode?: boolean;
};

export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc',
}

export type OrderOptions = {
  orderBy?: string;
  orderDirection?: OrderDirection;
};
