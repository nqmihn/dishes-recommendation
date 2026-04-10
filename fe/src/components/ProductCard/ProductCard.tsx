import { Link } from 'react-router-dom';
import { Clock, Flame, Star } from 'lucide-react';
import type { Product } from '../../types';
import { formatCurrency, getProductImageUrl } from '../../utils/format';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link to={`/products/${product.id}`} className="product-card">
      <div className="product-card-image-wrapper">
        <img
          src={getProductImageUrl(product)}
          alt={product.name}
          className="product-card-image"
          loading="lazy"
        />
        {product.is_featured && (
          <span className="product-card-badge">
            <Star size={12} /> Nổi bật
          </span>
        )}
      </div>
      <div className="product-card-body">
        <h3 className="product-card-name">{product.name}</h3>
        {product.short_description && (
          <p className="product-card-desc">{product.short_description}</p>
        )}
        <div className="product-card-meta">
          {product.preparation_time && (
            <span className="product-card-meta-item">
              <Clock size={14} /> {product.preparation_time} phút
            </span>
          )}
          {product.calories && (
            <span className="product-card-meta-item">
              <Flame size={14} /> {product.calories} kcal
            </span>
          )}
        </div>
        {product.tags && product.tags.length > 0 && (
          <div className="product-card-tags">
            {product.tags.map((tag) => (
              <span key={tag} className="product-card-tag">
                {tag}
              </span>
            ))}
          </div>
        )}
        <div className="product-card-price">{formatCurrency(product.base_price)}</div>
      </div>
    </Link>
  );
}
