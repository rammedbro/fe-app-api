import { Controller } from 'tsoa';

export abstract class AbstractController extends Controller {
  setPaginationHeaders(page: number, limit: number, total: number) {
    const hasMore = page * limit < total;

    this.setHeader('x-page', page);
    this.setHeader('x-prev-page', page > 0 ? page - 1 : 0);
    this.setHeader('x-next-page', hasMore ? page + 1 : 0);
    this.setHeader('x-per-page', limit);
    this.setHeader('x-total-count', total);
  }
}
