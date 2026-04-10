// ===================== CATEGORY =====================

export interface Category {
  id: string;
  parent_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  children?: Category[];
}

// ===================== PRODUCT =====================

export interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  sku: string | null;
  price: number;
  original_price: number | null;
  stock_quantity: number;
  is_default: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  created_at: string;
}

export interface ProductOption {
  id: string;
  option_group_id: string;
  name: string;
  additional_price: number;
  is_default: boolean;
  is_active: boolean;
  sort_order: number;
}

export interface ProductOptionGroup {
  id: string;
  product_id: string;
  name: string;
  is_required: boolean;
  min_selections: number;
  max_selections: number;
  sort_order: number;
  options: ProductOption[];
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  base_price: number;
  thumbnail_url: string | null;
  is_active: boolean;
  is_featured: boolean;
  preparation_time: number | null;
  calories: number | null;
  tags: string[] | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
  variants?: ProductVariant[];
  images?: ProductImage[];
  option_groups?: ProductOptionGroup[];
  ai_metadata?: Record<string, unknown>;
}

// ===================== CHAT =====================

export interface ChatMessage {
  id: string;
  session_id: string;
  role: 'user' | 'assistant';
  content: string;
  metadata: {
    products?: Product[];
  } | null;
  created_at: string;
}

export interface ChatSession {
  session_token: string;
  title: string | null;
  messages: ChatMessage[];
}

export interface ChatSendResponse {
  session_token: string;
  message: string;
  products: Product[];
}

// ===================== PAGINATION =====================

export interface PaginatedResponse<T> {
  page: number;
  total_count: number;
  data: T[];
}

export interface ListProductParams {
  page?: number;
  limit?: number;
  need_total_count?: boolean;
  only_count?: boolean;
  search?: string;
  category_id?: string;
  is_active?: boolean;
  is_featured?: boolean;
  tags?: string;
  sort?: string;
  dir?: string;
}

export interface ListCategoryParams {
  page?: number;
  limit?: number;
  need_total_count?: boolean;
  only_count?: boolean;
  search?: string;
  parent_id?: string;
  is_active?: boolean;
  sort?: string;
  dir?: string;
}
