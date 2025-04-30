/**
 * Represents options for pagination.
 */
export interface PaginationOptions {
  /**
   * The page number to retrieve.
   */
  page?: number;
  /**
   * The number of items per page.
   */
  limit?: number;
}

/**
 * Represents a paginated list of items.
 * @template T The type of items in the list.
 */
export interface PaginatedList<T> extends Required<PaginationOptions> {
  /** The array of items in the current page. */
  items: T[];
  /** The total number of items across all pages. */
  count: number;
}
