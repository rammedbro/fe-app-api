/**
 * Represents the direction of sorting.
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Represents options for sorting.
 */
export interface SortOptions {
  /** An array of fields to sort by. */
  sortBy?: string[];
  /** The direction of the sort (ascending or descending). */
  sortDir?: SortDirection;
}
