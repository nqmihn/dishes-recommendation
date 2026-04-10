import apiClient from './api-client';
import type { Category, PaginatedResponse, ListCategoryParams } from '../types';

const BASE = '/api/v1/categories';

export const categoryService = {
  async list(params: ListCategoryParams = {}): Promise<PaginatedResponse<Category>> {
    const query: Record<string, string> = {
      page: String(params.page ?? 1),
      limit: String(params.limit ?? 50),
      need_total_count: String(params.need_total_count ?? false),
      only_count: String(params.only_count ?? false),
    };
    if (params.search) query.search = params.search;
    if (params.parent_id) query.parent_id = params.parent_id;
    if (params.is_active !== undefined) query.is_active = String(params.is_active);
    if (params.sort) query.sort = params.sort;
    if (params.dir) query.dir = params.dir;

    const { data } = await apiClient.get(BASE, { params: query });
    return data;
  },

  async getTree(): Promise<Category[]> {
    const { data } = await apiClient.get(`${BASE}/tree/all`);
    return data;
  },
};
