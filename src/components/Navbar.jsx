import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="tw-bg-gray-900 tw-text-white tw-px-4 tw-py-3 tw-shadow-md">
      <div className="tw-max-w-6xl tw-mx-auto tw-flex tw-justify-between tw-items-center">
        {/* Logo */}
        <Link to="/" className="tw-text-xl tw-font-bold tw-tracking-wide tw-text-white hover:tw-text-gray-300">
          🛒 ShopApp
        </Link>

        {/* Nav Links */}
        <div className="tw-flex tw-items-center tw-gap-5 tw-text-sm">
          <Link to="/" className="hover:tw-text-gray-300 tw-transition-colors">
            Products
          </Link>

          {/* Cart with badge */}
          <Link to="/cart" className="hover:tw-text-gray-300 tw-transition-colors tw-relative">
            Cart
            {totalItems > 0 && (
              <span className="tw-absolute -tw-top-2.5 -tw-right-4 tw-bg-red-500 tw-text-white tw-text-xs tw-font-bold tw-rounded-full tw-w-5 tw-h-5 tw-flex tw-items-center tw-justify-center">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <>
              <span className="tw-text-gray-400 tw-hidden sm:tw-inline">
                {user?.name || user?.email?.split('@')[0]}
              </span>
              <button
                onClick={handleLogout}
                className="tw-bg-red-600 hover:tw-bg-red-700 tw-text-white tw-px-3 tw-py-1 tw-rounded tw-text-sm tw-transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:tw-text-gray-300 tw-transition-colors">
                Login
              </Link>
              <Link
                to="/signup"
                className="tw-bg-blue-600 hover:tw-bg-blue-700 tw-text-white tw-px-3 tw-py-1 tw-rounded tw-transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
