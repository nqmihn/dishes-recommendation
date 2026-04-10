import { useState, useEffect, useCallback } from 'react';
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '../../components/ProductCard/ProductCard';
import { productService } from '../../services/product-service';
import { categoryService } from '../../services/category-service';
import type { Product, Category } from '../../types';
import './HomePage.css';

const POPULAR_TAGS = ['beef', 'noodle', 'hot', 'spicy', 'bestseller', 'vegetarian', 'seafood', 'rice', 'soup'];
const PRODUCTS_PER_PAGE = 12;

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const result = await productService.list({
        page,
        limit: PRODUCTS_PER_PAGE,
        need_total_count: true,
        search: search || undefined,
        category_id: selectedCategory || undefined,
        tags: selectedTags.length > 0 ? selectedTags.join(',') : undefined,
        is_active: true,
      });
      setProducts(result.data);
      setTotalCount(result.total_count);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  }, [page, search, selectedCategory, selectedTags]);

  useEffect(() => {
    categoryService.getTree().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, selectedCategory, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSelectedTags([]);
    setPage(1);
  };

  const hasActiveFilters = search || selectedCategory || selectedTags.length > 0;
  const totalPages = Math.ceil(totalCount / PRODUCTS_PER_PAGE);

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero">
        <h1>🍜 Khám phá ẩm thực Việt</h1>
        <p>Tìm món ăn yêu thích của bạn hoặc hỏi AI để được gợi ý!</p>
      </section>

      {/* Search & Filter Bar */}
      <section className="filter-bar">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm món ăn..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch('')}>
              <X size={16} />
            </button>
          )}
        </div>
        <button className={`filter-toggle ${showFilters ? 'active' : ''}`} onClick={() => setShowFilters(!showFilters)}>
          <SlidersHorizontal size={18} />
          Bộ lọc
          {hasActiveFilters && <span className="filter-count">{(selectedCategory ? 1 : 0) + selectedTags.length}</span>}
        </button>
      </section>

      {/* Expanded Filters */}
      {showFilters && (
        <section className="filters-panel">
          <div className="filter-group">
            <label className="filter-label">Danh mục</label>
            <div className="filter-chips">
              <button
                className={`filter-chip ${selectedCategory === '' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('')}
              >
                Tất cả
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`filter-chip ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-label">Tags</label>
            <div className="filter-chips">
              {POPULAR_TAGS.map((tag) => (
                <button
                  key={tag}
                  className={`filter-chip ${selectedTags.includes(tag) ? 'active' : ''}`}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {hasActiveFilters && (
            <button className="clear-filters-btn" onClick={clearFilters}>
              <X size={14} /> Xóa bộ lọc
            </button>
          )}
        </section>
      )}

      {/* Results info */}
      <div className="results-info">
        {loading ? (
          <span>Đang tải...</span>
        ) : (
          <span>
            {totalCount} món ăn {hasActiveFilters && '(đã lọc)'}
          </span>
        )}
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="product-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="product-skeleton">
              <div className="skeleton-image" />
              <div className="skeleton-body">
                <div className="skeleton-line skeleton-line--title" />
                <div className="skeleton-line skeleton-line--desc" />
                <div className="skeleton-line skeleton-line--price" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <p>😕 Không tìm thấy món ăn nào</p>
          <p>Thử thay đổi bộ lọc hoặc tìm kiếm khác</p>
          {hasActiveFilters && (
            <button className="clear-filters-btn" onClick={clearFilters}>
              Xóa bộ lọc
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft size={18} />
              </button>
              <span className="pagination-info">
                Trang {page} / {totalPages}
              </span>
              <button
                className="pagination-btn"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
