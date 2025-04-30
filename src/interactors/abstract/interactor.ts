import type { SortDirection } from '@/entities/sort';

export abstract class AbstractInteractor {
  static readonly PAGINATION_LIMIT: number = 25;
  static readonly SORT_DIRECTION: SortDirection = 'asc';

  static toOffsetPagination(page: number, limit = AbstractInteractor.PAGINATION_LIMIT) {
    return (page > 1 ? page - 1 : 0) * limit;
  }
}
