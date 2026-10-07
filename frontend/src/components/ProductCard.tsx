import type { MouseEvent } from "react";
import { Link } from "react-router-dom";
import type { Product } from "../types/product";
import { handleImageError, resolveProductImage } from "../utils/productImage";
import "./ProductCard.css";

type ProductCardProps = {
  product: Product;
  onAddToCart: (product: Product) => void;
  isLiked: boolean;
  onToggleWishlist: () => void;
};

function ProductCard({
  product,
  onAddToCart,
  isLiked,
  onToggleWishlist,
}: ProductCardProps) {
  const isInStock =
    product.isActive !== false &&
    (product.stockQuantity === undefined || product.stockQuantity > 0);

  const resolvedImage = resolveProductImage(product);

  const handleWishlistClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleWishlist();
  };

  const handleAddToCartClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInStock) {
      onAddToCart(product);
    }
  };

  return (
    <article className="nx-node-card">
      {/* Product Visual Area */}
      <div className="nx-node-visual">
        {/* Wishlist Heart */}
        <button
          className={`nx-node-save ${isLiked ? "liked" : ""}`}
          type="button"
          aria-label={
            isLiked
              ? `Remove ${product.name} from favorites`
              : `Save ${product.name}`
          }
          onClick={handleWishlistClick}
        >
          <i
            className={`bi ${isLiked ? "bi-heart-fill" : "bi-heart"}`}
            aria-hidden="true"
          />
        </button>

        {/* Product Image Clickable Link */}
        <Link
          to={`/products/${product.id}`}
          className="nx-device-glyph"
          aria-label={`View details for ${product.name}`}
        >
          <img
            src={resolvedImage}
            alt={product.name}
            loading="lazy"
            decoding="async"
            onError={handleImageError}
          />
        </Link>

        {/* Decorative Lines */}
        <div className="nx-device-lines" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
      </div>

      {/* Product Details */}
      <div className="nx-node-body">
        <div className="nx-node-meta">
          <span className="nx-rating">
            {product.rating ?? "4.8"}
            <span className="nx-star" aria-hidden="true">
              ★
            </span>
            <small>({product.reviews ?? 0})</small>
          </span>

          {product.category && (
            <Link
              to={`/products?category=${encodeURIComponent(product.category)}`}
              className="nx-category-tag"
              onClick={(e) => e.stopPropagation()}
            >
              {product.category}
            </Link>
          )}
        </div>

        <h2>
          <Link to={`/products/${product.id}`}>{product.name}</Link>
        </h2>
      </div>

      {/* Price & Actions */}
      <div className="nx-node-bottom">
        <div className="nx-node-price">
          <strong>
            ₹{(product.price ?? 0).toLocaleString("en-IN")}
          </strong>

          {product.oldPrice && product.oldPrice > product.price && (
            <del>
              ₹{product.oldPrice.toLocaleString("en-IN")}
            </del>
          )}

          {product.badge && <span>{product.badge}</span>}
        </div>

        <div className="nx-node-actions">
          <button
            type="button"
            className={`nx-add-button ${!isInStock ? "out-of-stock" : ""}`}
            onClick={handleAddToCartClick}
            disabled={!isInStock}
            aria-label={
              isInStock
                ? `Add ${product.name} to cart`
                : `${product.name} is out of stock`
            }
          >
            {isInStock ? "Add to Cart" : "Out of Stock"}
          </button>

          <Link
            to={`/products/${product.id}`}
            aria-label={`View details of ${product.name}`}
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;