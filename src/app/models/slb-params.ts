export class SLBSearchParams {
  params: Map<string, string>;
  searchTerm: string;
  pageNumber: number;
  pageSize: number;
  sort: SortOptions;
  constructor() {
    this.sort = new SortOptions();
  }
}
export class SortOptions {
  active: string;
  direction: string;
}
