export interface ListQueryParams {
  page: number;
  limit: number;
  sort?: string;
  filters?: Record<string, string>;
}

export interface ListQueryResult<TRow> {
  data?: { data: TRow[]; meta: { total: number } };
  isLoading: boolean;
}
