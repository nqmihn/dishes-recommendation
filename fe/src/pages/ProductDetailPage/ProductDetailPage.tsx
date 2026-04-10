import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Flame, Star, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import { productService } from '../../services/product-service';
import { formatCurrency, getProductImageUrl } from '../../utils/format';
import type { Product } from '../../types';
import './ProductDetailPage.css';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError(null);

    productService
      .get(id)
      .then((data) => {
        setProduct(data);
      })
      .catch(() => {
        setError('Không tìm thấy sản phẩm');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="detail-page">
        <div className="detail-skeleton">
          <div className="detail-skeleton-image" />
          <div className="detail-skeleton-info">
            <div className="skeleton-line" style={{ width: '60%', height: 24 }} />
            <div className="skeleton-line" style={{ width: '40%', height: 16 }} />
            <div className="skeleton-line" style={{ width: '80%', height: 12 }} />
            <div className="skeleton-line" style={{ width: '80%', height: 12 }} />
            <div className="skeleton-line" style={{ width: '30%', height: 20 }} />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="detail-page">
        <div className="detail-error">
          <p>😕 {error || 'Không tìm thấy sản phẩm'}</p>
          <Link to="/" className="back-link">
            <ArrowLeft size={16} /> Quay lại trang chủ
          </Link>
        </div>
      </div>
    );
  }

  const allImages =
    product.images && product.images.length > 0
      ? product.images
      : [{ id: 'thumb', product_id: product.id, image_url: getProductImageUrl(product), alt_text: product.name, sort_order: 0, created_at: '' }];

  return (
    <div className="detail-page">
      <Link to="/" className="back-link">
        <ArrowLeft size={16} /> Quay lại
      </Link>

      <div className="detail-layout">
        {/* Image Gallery */}
        <div className="detail-gallery">
          <div className="detail-main-image-wrapper">
            <img
              src={allImages[selectedImageIndex].image_url}
              alt={allImages[selectedImageIndex].alt_text || product.name}
              className="detail-main-image"
            />
            {allImages.length > 1 && (
              <>
                <button
                  className="gallery-nav gallery-nav--prev"
                  onClick={() => setSelectedImageIndex((i) => (i === 0 ? allImages.length - 1 : i - 1))}
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  className="gallery-nav gallery-nav--next"
                  onClick={() => setSelectedImageIndex((i) => (i === allImages.length - 1 ? 0 : i + 1))}
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
            {product.is_featured && (
              <span className="detail-badge">
                <Star size={14} /> Nổi bật
              </span>
            )}
          </div>
          {allImages.length > 1 && (
            <div className="detail-thumbnails">
              {allImages.map((img, i) => (
                <button
                  key={img.id}
                  className={`detail-thumb ${i === selectedImageIndex ? 'active' : ''}`}
                  onClick={() => setSelectedImageIndex(i)}
                >
                  <img src={img.image_url} alt={img.alt_text || ''} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="detail-info">
          <h1 className="detail-name">{product.name}</h1>

          {product.short_description && (
            <p className="detail-short-desc">{product.short_description}</p>
          )}

          <div className="detail-price">{formatCurrency(product.base_price)}</div>

          {/* Meta */}
          <div className="detail-meta">
            {product.preparation_time && (
              <div className="detail-meta-item">
                <Clock size={16} />
                <span>{product.preparation_time} phút chuẩn bị</span>
              </div>
            )}
            {product.calories && (
              <div className="detail-meta-item">
                <Flame size={16} />
                <span>{product.calories} kcal</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="detail-tags">
              <Tag size={14} />
              {product.tags.map((tag) => (
                <span key={tag} className="detail-tag">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          {product.description && (
            <div className="detail-section">
              <h2 className="detail-section-title">Mô tả</h2>
              <p className="detail-description">{product.description}</p>
            </div>
          )}

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="detail-section">
              <h2 className="detail-section-title">Các phiên bản</h2>
              <div className="detail-variants">
                {product.variants
                  .filter((v) => v.is_active)
                  .map((variant) => (
                    <div key={variant.id} className="detail-variant-card">
                      <div className="detail-variant-name">
                        {variant.name}
                        {variant.is_default && <span className="variant-default-badge">Mặc định</span>}
                      </div>
                      <div className="detail-variant-prices">
                        <span className="detail-variant-price">{formatCurrency(variant.price)}</span>
                        {variant.original_price && variant.original_price > variant.price && (
                          <span className="detail-variant-original">
                            {formatCurrency(variant.original_price)}
                          </span>
                        )}
                      </div>
                      {variant.sku && <div className="detail-variant-sku">SKU: {variant.sku}</div>}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Option Groups */}
          {product.option_groups && product.option_groups.length > 0 && (
            <div className="detail-section">
              <h2 className="detail-section-title">Tùy chọn</h2>
              {product.option_groups.map((group) => (
                <div key={group.id} className="detail-option-group">
                  <div className="detail-option-group-header">
                    <span className="detail-option-group-name">{group.name}</span>
                    {group.is_required && <span className="option-required-badge">Bắt buộc</span>}
                    <span className="option-selections">
                      (Chọn {group.min_selections}–{group.max_selections})
                    </span>
                  </div>
                  <div className="detail-options">
                    {group.options
                      .filter((opt) => opt.is_active)
                      .map((option) => (
                        <div key={option.id} className="detail-option-item">
                          <span className="detail-option-name">
                            {option.name}
                            {option.is_default && <span className="option-default-dot" />}
                          </span>
                          {option.additional_price > 0 && (
                            <span className="detail-option-price">
                              +{formatCurrency(option.additional_price)}
                            </span>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
