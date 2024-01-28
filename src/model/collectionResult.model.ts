import { RequestBodyInterface } from "../interface";

interface FetchCountAllInterface<T> {
  count: number;
  rows: T[];
}

export class CollectionResultModel<T> {
  content: T[];
  elementTotal: number;
  elementCount: number;
  pageNumber: number;
  pageSize: number;
  sorted: boolean;
  totalPages: number;

  constructor(
    list: FetchCountAllInterface<T> = { count: 0, rows: [] },
    requet: Partial<RequestBodyInterface>
  ) {
    this.content = list.rows || [];
    this.elementTotal = list.count;
    this.elementCount = list.rows.length;
    this.totalPages = this.getTotalPage(requet.pageSize, list.count);
    this.pageSize = requet.pageSize;
    this.pageNumber = requet.pageNumber;
  }

  private getTotalPage(pageSize = 0, total = 0): number {
    let totalPage = 0;
    if (pageSize && total) {
      totalPage = Math.round(total / pageSize);
    }
    return totalPage;
  }
}
