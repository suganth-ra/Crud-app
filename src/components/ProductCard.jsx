import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';

const ProductCard = ({ product, onDelete }) => {
  const { addToCart } = useCart();

  return (
    <div className="tw-border tw-rounded-lg tw-bg-white tw-shadow-sm tw-flex tw-flex-col hover:tw-shadow-md tw-transition-shadow">
      {/* Image */}
      <Link to={`/product/${product.id}`} className="tw-p-4 tw-flex tw-items-center tw-justify-center tw-h-44">
        <img
          src={product.image}
          alt={product.title}
          className="tw-h-full tw-object-contain"
        />
      </Link>

      {/* Info */}
      <div className="tw-px-4 tw-pb-4 tw-flex tw-flex-col tw-flex-1">
        <Link to={`/product/${product.id}`}>
          <p className="tw-text-xs tw-text-gray-400 tw-uppercase tw-mb-1">{product.category}</p>
          <h3 className="tw-text-sm tw-font-medium tw-text-gray-800 tw-line-clamp-2 tw-mb-2 hover:tw-text-blue-600">
            {product.title}
          </h3>
        </Link>
        <p className="tw-text-lg tw-font-bold tw-text-gray-900 tw-mb-3">
          Rs. {Number(product.price).toFixed(2)}
        </p>

        {/* Buttons */}
        <div className="tw-flex tw-gap-2 tw-mt-auto">
          <button
            onClick={() => addToCart(product)}
            className="tw-flex-1 tw-bg-blue-600 hover:tw-bg-blue-700 tw-text-white tw-text-sm tw-py-1.5 tw-rounded tw-transition-colors"
          >
            Add to Cart
          </button>
          <Link
            to={`/product/${product.id}`}
            className="tw-bg-gray-100 hover:tw-bg-gray-200 tw-text-gray-700 tw-text-sm tw-px-2.5 tw-py-1.5 tw-rounded tw-transition-colors"
          >
            View
          </Link>
          {onDelete && (
            <button
              onClick={() => onDelete(product.id)}
              className="tw-bg-red-50 hover:tw-bg-red-100 tw-text-red-600 tw-text-sm tw-px-2.5 tw-py-1.5 tw-rounded tw-transition-colors"
              title="Delete"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
