export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc',
}

export type OrderOptions = {
  orderBy?: string;
  orderDirection?: OrderDirection;
};
