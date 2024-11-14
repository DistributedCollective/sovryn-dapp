export type PaginatorQuery = {
  cursor?: string;
  limit?: number;
  [key: string]: any;
};

type PaginatorQueryExtended = PaginatorQuery & {
  [key: string]: any;
};

export type PaginatorResponse<T> = {
  data: T[];
  cursor: string | null;
};

export const makePaginatedUrl = (
  baseUrl: string,
  query: PaginatorQueryExtended = {},
) => {
  const params = new URLSearchParams(query);
  return `${baseUrl}?${params.toString()}`;
};
