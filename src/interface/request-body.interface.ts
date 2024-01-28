export enum SortDirection {
  "DESC",
  "ASC",
}
export interface SortInterface {
  sortColunm: string;
  direction: SortDirection;
}
export interface RequestBodyInterface {
  filterFields: any;
  pageSize: number;
  pageNumber: number;
  sort: SortInterface[];
  search: {
    searchText: string;
    column: string;
  };
}


export interface FilterBodyInterface {
  [filterName: string]: string
}
