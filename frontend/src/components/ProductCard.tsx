
import { Link } from "react-router-dom";

type Product = {
  id: number;
  name: string;
  category: string;
  group: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  icon: string;
  image: string;
  specs: string;
  stock: string;
  badge: string;
  requestOnly?: boolean;
};

type ProductCardProps = {
  product: Product;
  onAddToCart: (product: Product) => void;
};

function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <article className="nx-node-card">
      {/* Product Image */}
      <div className="nx-node-visual">
        <div className="nx-node-status">
          {product.stock === "Built-to-Order"
            ? "Built-to-Order"
            : `In Stock · ${product.stock}`}
        </div>

        <button
          className="nx-node-save"
          type="button"
          aria-label={`Save ${product.name}`}
        >
          <span className="material-symbols-outlined">
            favorite
          </span>
        </button>

        <div className="nx-device-glyph">
          <img
            src={`/products/${product.image}`}
            alt={product.name}
          />
        </div>

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

            {product.requestOnly ? "Request BTO" : "Add Cart"}
          </button>

          <Link to={`/products/${product.id}`}>
            View Node
          </Link>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;

