export interface ListQueryParams {
  page: number;
  limit: number;
  sort?: string;
  filters?: Record<string, string>;
}
