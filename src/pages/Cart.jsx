import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';

// Valid coupon codes (in real app, validated by backend)
const VALID_COUPONS = {
  SAVE10: { discount: 10, minCart: 50, label: '10% off' },
  SAVE20: { discount: 20, minCart: 100, label: '20% off' },
  FLAT5: { discount: 5, minCart: 0, label: '5% off' },
};

const Cart = () => {
  const {
    items,
    subtotal,
    discountAmount,
    gst,
    total,
    coupon,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    clearCoupon,
  } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    setCouponError('');
    setCouponSuccess('');

    if (!code) {
      setCouponError('Please enter a coupon code.');
      return;
    }

    if (!VALID_COUPONS[code]) {
      setCouponError('Invalid coupon code. Try SAVE10, SAVE20, or FLAT5.');
      return;
    }

    const { discount, minCart, label } = VALID_COUPONS[code];
    if (subtotal < minCart) {
      setCouponError(
        `Minimum cart value of Rs. ${minCart} required for this coupon.`
      );
      return;
    }

    applyCoupon(code, discount);
    setCouponSuccess(`Coupon applied: ${label}`);
    setCouponInput('');
  };

  const handleRemoveCoupon = () => {
    clearCoupon();
    setCouponSuccess('');
    setCouponError('');
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
    } else {
      navigate('/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <div className="tw-text-center tw-py-24">
        <div className="tw-text-6xl tw-mb-4">🛒</div>
        <h2 className="tw-text-xl tw-font-semibold tw-text-gray-700 tw-mb-2">
          Your cart is empty
        </h2>
        <p className="tw-text-gray-400 tw-mb-6">
          Add some products to get started.
        </p>
        <Link
          to="/"
          className="tw-bg-blue-600 hover:tw-bg-blue-700 tw-text-white tw-px-6 tw-py-2.5 tw-rounded tw-font-medium tw-transition-colors"
        >
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="tw-max-w-5xl tw-mx-auto tw-px-4 tw-py-8">
      <h1 className="tw-text-2xl tw-font-bold tw-text-gray-800 tw-mb-6">
        Shopping Cart ({items.length} item{items.length !== 1 ? 's' : ''})
      </h1>

      <div className="tw-flex tw-flex-col lg:tw-flex-row tw-gap-6">
        {/* Cart Items */}
        <div className="tw-flex-1 tw-space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="tw-bg-white tw-border tw-rounded-lg tw-p-4 tw-flex tw-items-center tw-gap-4 tw-shadow-sm"
            >
              {/* Image */}
              <Link to={`/product/${item.id}`} className="tw-shrink-0">
                <img
                  src={item.image}
                  alt={item.title}
                  className="tw-w-16 tw-h-16 tw-object-contain"
                />
              </Link>

              {/* Info */}
              <div className="tw-flex-1 tw-min-w-0">
                <Link
                  to={`/product/${item.id}`}
                  className="tw-text-sm tw-font-medium tw-text-gray-800 hover:tw-text-blue-600 tw-line-clamp-2"
                >
                  {item.title}
                </Link>
                <p className="tw-text-xs tw-text-gray-400 tw-mt-0.5 tw-capitalize">
                  {item.category}
                </p>
                <p className="tw-text-blue-600 tw-font-bold tw-mt-1">
                  Rs. {Number(item.price).toFixed(2)}
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="tw-flex tw-items-center tw-border tw-rounded-lg tw-overflow-hidden tw-shrink-0">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="tw-px-3 tw-py-1.5 tw-bg-gray-50 hover:tw-bg-gray-100 disabled:tw-opacity-30 disabled:tw-cursor-not-allowed tw-text-gray-700 tw-font-bold tw-transition-colors"
                >
                  −
                </button>
                <span className="tw-px-3 tw-py-1.5 tw-text-sm tw-font-medium tw-bg-white tw-min-w-[2rem] tw-text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="tw-px-3 tw-py-1.5 tw-bg-gray-50 hover:tw-bg-gray-100 tw-text-gray-700 tw-font-bold tw-transition-colors"
                >
                  +
                </button>
              </div>

              {/* Item Total */}
              <div className="tw-text-right tw-shrink-0 tw-w-20">
                <p className="tw-font-bold tw-text-gray-800">
                  Rs. {(item.price * item.quantity).toFixed(2)}
                </p>
              </div>

              {/* Remove */}
              <button
                onClick={() => removeFromCart(item.id)}
                className="tw-shrink-0 tw-text-gray-300 hover:tw-text-red-500 tw-transition-colors tw-text-lg"
                title="Remove item"
              >
                ✕
              </button>
            </div>
          ))}

          <div className="tw-flex tw-justify-between tw-pt-2">
            <Link
              to="/"
              className="tw-text-blue-600 hover:tw-underline tw-text-sm"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary */}
        <div className="tw-w-full lg:tw-w-80 tw-shrink-0">
          <div className="tw-bg-white tw-border tw-rounded-lg tw-p-5 tw-shadow-sm tw-space-y-4">
            <h2 className="tw-font-bold tw-text-lg tw-text-gray-800">Order Summary</h2>

            {/* Price Breakdown */}
            <div className="tw-space-y-2 tw-text-sm">
              <div className="tw-flex tw-justify-between tw-text-gray-600">
                <span>Subtotal</span>
                <span>Rs. {subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="tw-flex tw-justify-between tw-text-green-600">
                  <span>Discount ({coupon})</span>
                  <span>− Rs. {discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="tw-flex tw-justify-between tw-text-gray-600">
                <span>GST (18%)</span>
                <span>Rs. {gst.toFixed(2)}</span>
              </div>
              <div className="tw-border-t tw-pt-2 tw-flex tw-justify-between tw-font-bold tw-text-base tw-text-gray-900">
                <span>Total Payable</span>
                <span>Rs. {total.toFixed(2)}</span>
              </div>
            </div>

            {/* Coupon Section */}
            <div className="tw-border-t tw-pt-4">
              <p className="tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-2">
                Coupon Code
              </p>
              {coupon ? (
                <div className="tw-flex tw-items-center tw-justify-between tw-bg-green-50 tw-border tw-border-green-200 tw-px-3 tw-py-2 tw-rounded-lg">
                  <div>
                    <p className="tw-text-green-700 tw-text-sm tw-font-medium">
                      ✓ {coupon} applied
                    </p>
                    <p className="tw-text-green-600 tw-text-xs">
                      You saved Rs. {discountAmount.toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="tw-text-red-500 hover:tw-text-red-700 tw-text-xs tw-font-medium"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <>
                  <div className="tw-flex tw-gap-2">
                    <input
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value);
                        setCouponError('');
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                      placeholder="Enter code"
                      className="tw-flex-1 tw-border tw-border-gray-300 tw-px-3 tw-py-2 tw-rounded tw-text-sm focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="tw-bg-gray-800 hover:tw-bg-gray-900 tw-text-white tw-px-3 tw-py-2 tw-rounded tw-text-sm tw-font-medium tw-transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && (
                    <p className="tw-text-red-500 tw-text-xs tw-mt-1.5">{couponError}</p>
                  )}
                  {couponSuccess && (
                    <p className="tw-text-green-600 tw-text-xs tw-mt-1.5">{couponSuccess}</p>
                  )}
                  <p className="tw-text-gray-400 tw-text-xs tw-mt-2">
                    Try: SAVE10, SAVE20, FLAT5
                  </p>
                </>
              )}
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              className="tw-w-full tw-bg-blue-600 hover:tw-bg-blue-700 tw-text-white tw-py-3 tw-rounded-lg tw-font-semibold tw-transition-colors"
            >
              {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
