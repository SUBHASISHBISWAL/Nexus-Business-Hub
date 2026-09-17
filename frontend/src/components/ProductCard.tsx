import { Link } from "react-router-dom";
import type { Product } from "../types/product";

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
  return (
    <article className="nx-node-card">
      {/* Product Image */}
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
          onClick={onToggleWishlist}
        >
          <i
            className={`bi ${
              isLiked ? "bi-heart-fill" : "bi-heart"
            }`}
            aria-hidden="true"
          ></i>
        </button>

        {/* Product Image */}
        <div className="nx-device-glyph">
          <img
            src={product.image}
            alt={product.name}
          />
        </div>

        {/* Decorative Lines */}
        <div className="nx-device-lines">
          <i />
          <i />
          <i />
        </div>
      </div>

      {/* Product Details */}
      <div className="nx-node-body">
        <div className="nx-node-meta">
          <span className="nx-rating">
            {product.rating}
            <span className="nx-star">★</span>
            <small>({product.reviews})</small>
          </span>
        </div>

        <h2>{product.name}</h2>
      </div>

      {/* Price & Actions */}
      <div className="nx-node-bottom">
        <div className="nx-node-price">
          <strong>
            ₹{product.price.toLocaleString("en-IN")}
          </strong>

          {product.oldPrice && (
            <del>
              ₹{product.oldPrice.toLocaleString("en-IN")}
            </del>
          )}

          <span>{product.badge}</span>
        </div>

        <div className="nx-node-actions">
          <button
            type="button"
            className="nx-add-button"
            onClick={() => onAddToCart(product)}
          >
            {product.requestOnly && (
              <span className="material-symbols-outlined">
                assignment
              </span>
            )}

            {product.requestOnly
              ? "Request BTO"
              : "Add Cart"}
          </button>

          <Link to={`/products/${product.id}`}>
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;