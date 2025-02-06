import type { PaginationOptions, SortDirection } from '@/types';

export abstract class AbstractService {
  static readonly PAGINATION_LIMIT: number = 25;
  static readonly SORT_DIRECTION: SortDirection = 'asc';

  static toOffsetPagination({ page, limit }: PaginationOptions) {
    return (page > 1 ? page - 1 : 0) * limit;
  }
}
