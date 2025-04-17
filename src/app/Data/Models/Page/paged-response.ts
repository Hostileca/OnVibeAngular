export interface PagedResponse<TEntities> {
  items: TEntities[];
  currentPage: number;
  pageSize: number;
}
