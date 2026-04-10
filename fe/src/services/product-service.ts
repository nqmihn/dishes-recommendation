import apiClient from './api-client';
import type { Product, PaginatedResponse, ListProductParams } from '../types';

const BASE = '/api/v1/products';

export const productService = {
  async list(params: ListProductParams = {}): Promise<PaginatedResponse<Product>> {
    const query: Record<string, string> = {
      page: String(params.page ?? 1),
      limit: String(params.limit ?? 12),
      need_total_count: String(params.need_total_count ?? false),
      only_count: String(params.only_count ?? false),
    };
    if (params.search) query.search = params.search;
    if (params.category_id) query.category_id = params.category_id;
    if (params.is_active !== undefined) query.is_active = String(params.is_active);
    if (params.is_featured !== undefined) query.is_featured = String(params.is_featured);
    if (params.tags) query.tags = params.tags;
    if (params.sort) query.sort = params.sort;
    if (params.dir) query.dir = params.dir;

    const { data } = await apiClient.get(BASE, { params: query });
    return data;
  },

  async get(id: string): Promise<Product> {
    const { data } = await apiClient.get(`${BASE}/${id}`);
    return data;
  },
};
