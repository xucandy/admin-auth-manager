export default class Page {
  currentPage: number;
  total: number;
  pageSize: number;
  totalPage: number;
  list?: Array<any>;
  constructor(total: number, currentPage = 1, pageSize = 10) {
    currentPage =
      typeof currentPage === 'string' ? Number.parseInt(currentPage) : 1;
    pageSize = typeof pageSize === 'string' ? Number.parseInt(pageSize) : 10;
    if (Number.isNaN(currentPage)) {
      currentPage = 1;
    }
    if (Number.isNaN(pageSize)) {
      pageSize = 10;
    }
    this.currentPage = currentPage;
    this.pageSize = pageSize;
    this.total = total;
    this.totalPage = Math.floor(
      (this.total + this.pageSize - 1) / this.pageSize,
    );
  }
  get startIndex() {
    return (this.currentPage - 1) * this.pageSize;
  }
}
