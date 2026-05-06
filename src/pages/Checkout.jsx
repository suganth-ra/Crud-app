import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';

const Checkout = () => {
  const {
    items,
    subtotal,
    discountAmount,
    gst,
    total,
    coupon,
    clearCart,
  } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePlaceOrder = () => {
    // In real app: POST to orders API
    const orderRef = 'ORD-' + Date.now().toString().slice(-6);
    clearCart();
    alert(`Order ${orderRef} placed successfully! Thank you for shopping.`);
    navigate('/');
  };

  if (items.length === 0) {
    return (
      <div className="tw-text-center tw-py-24">
        <p className="tw-text-gray-500 tw-mb-4">No items to checkout.</p>
        <Link to="/" className="tw-bg-blue-600 tw-text-white tw-px-4 tw-py-2 tw-rounded">
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="tw-max-w-3xl tw-mx-auto tw-px-4 tw-py-8">
      <h1 className="tw-text-2xl tw-font-bold tw-text-gray-800 tw-mb-6">Checkout</h1>

      <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-5 tw-gap-6">
        {/* Left: Summary */}
        <div className="md:tw-col-span-3 tw-space-y-4">
          {/* Delivery Info */}
          <div className="tw-bg-white tw-border tw-rounded-lg tw-p-5 tw-shadow-sm">
            <h2 className="tw-font-semibold tw-text-gray-800 tw-mb-3">
              Delivery Information
            </h2>
            <div className="tw-space-y-3">
              <div>
                <label className="tw-block tw-text-xs tw-text-gray-500 tw-mb-1">Name</label>
                <p className="tw-text-sm tw-text-gray-800 tw-font-medium">
                  {user?.name || user?.email?.split('@')[0] || 'Guest'}
                </p>
              </div>
              <div>
                <label className="tw-block tw-text-xs tw-text-gray-500 tw-mb-1">Email</label>
                <p className="tw-text-sm tw-text-gray-800">{user?.email}</p>
              </div>
              <div className="tw-bg-yellow-50 tw-border tw-border-yellow-200 tw-rounded tw-p-3 tw-text-xs tw-text-yellow-700">
                ⚠ Address form not configured. In production, add address fields here.
              </div>
            </div>
          </div>

          {/* Items List */}
          <div className="tw-bg-white tw-border tw-rounded-lg tw-p-5 tw-shadow-sm">
            <h2 className="tw-font-semibold tw-text-gray-800 tw-mb-3">
              Order Items ({items.length})
            </h2>
            <div className="tw-space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="tw-flex tw-items-center tw-gap-3 tw-pb-3 tw-border-b last:tw-border-0 last:tw-pb-0"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="tw-w-12 tw-h-12 tw-object-contain tw-shrink-0"
                  />
                  <div className="tw-flex-1 tw-min-w-0">
                    <p className="tw-text-sm tw-text-gray-800 tw-line-clamp-1">
                      {item.title}
                    </p>
                    <p className="tw-text-xs tw-text-gray-400">
                      Qty: {item.quantity} × Rs. {Number(item.price).toFixed(2)}
                    </p>
                  </div>
                  <p className="tw-text-sm tw-font-semibold tw-text-gray-800 tw-shrink-0">
                    Rs. {(item.quantity * item.price).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Price Summary */}
        <div className="md:tw-col-span-2">
          <div className="tw-bg-white tw-border tw-rounded-lg tw-p-5 tw-shadow-sm tw-sticky tw-top-4">
            <h2 className="tw-font-semibold tw-text-gray-800 tw-mb-4">Price Summary</h2>

            <div className="tw-space-y-2.5 tw-text-sm">
              <div className="tw-flex tw-justify-between tw-text-gray-600">
                <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span>Rs. {subtotal.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="tw-flex tw-justify-between tw-text-green-600">
                  <span>Coupon ({coupon})</span>
                  <span>− Rs. {discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="tw-flex tw-justify-between tw-text-gray-600">
                <span>GST (18%)</span>
                <span>Rs. {gst.toFixed(2)}</span>
              </div>

              <div className="tw-flex tw-justify-between tw-text-gray-600">
                <span>Shipping</span>
                <span className="tw-text-green-600">Free</span>
              </div>

              <div className="tw-border-t tw-pt-3 tw-flex tw-justify-between tw-font-bold tw-text-base tw-text-gray-900">
                <span>Total Payable</span>
                <span>Rs. {total.toFixed(2)}</span>
              </div>
            </div>

            {discountAmount > 0 && (
              <div className="tw-mt-3 tw-bg-green-50 tw-border tw-border-green-200 tw-rounded tw-p-2.5 tw-text-xs tw-text-green-700">
                🎉 You're saving Rs. {discountAmount.toFixed(2)} on this order!
              </div>
            )}

            <button
              onClick={handlePlaceOrder}
              className="tw-mt-5 tw-w-full tw-bg-blue-600 hover:tw-bg-blue-700 tw-text-white tw-py-3 tw-rounded-lg tw-font-semibold tw-transition-colors"
            >
              Place Order — Rs. {total.toFixed(2)}
            </button>

            <p className="tw-text-xs tw-text-gray-400 tw-text-center tw-mt-3">
              🔒 Secure checkout. By placing this order you agree to our terms.
            </p>

            <Link
              to="/cart"
              className="tw-block tw-text-center tw-text-blue-600 hover:tw-underline tw-text-sm tw-mt-3"
            >
              ← Edit Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
