import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchProductById, updateProduct, deleteProduct } from '../services/api';
import { useCart } from '../hooks/useCart';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProductById(id)
      .then((res) => {
        setProduct(res.data);
        setForm(res.data);
      })
      .catch(() => setError('Product not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  const validateForm = () => {
    const errors = {};
    if (!form.title?.trim()) errors.title = 'Title is required';
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0)
      errors.price = 'Valid price required';
    if (!form.description?.trim()) errors.description = 'Description required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSaving(true);
    try {
      await updateProduct(id, { ...form, price: Number(form.price) });
      setProduct({ ...form, price: Number(form.price) });
      setEditing(false);
    } catch {
      alert('Update failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this product permanently?')) return;
    try {
      await deleteProduct(id);
      navigate('/');
    } catch {
      alert('Delete failed.');
    }
  };

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (formErrors[e.target.name])
      setFormErrors({ ...formErrors, [e.target.name]: '' });
  };

  if (loading) {
    return (
      <div className="tw-flex tw-justify-center tw-items-center tw-h-64 tw-text-gray-500">
        Loading product...
      </div>
    );
  }

  if (error) {
    return (
      <div className="tw-text-center tw-mt-20">
        <p className="tw-text-red-500 tw-mb-4">{error}</p>
        <Link to="/" className="tw-bg-blue-600 tw-text-white tw-px-4 tw-py-2 tw-rounded">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="tw-max-w-4xl tw-mx-auto tw-px-4 tw-py-8">
      {/* Breadcrumb */}
      <div className="tw-text-sm tw-text-gray-500 tw-mb-6">
        <Link to="/" className="hover:tw-text-blue-600">
          Products
        </Link>{' '}
        / <span className="tw-text-gray-800">{product?.title?.substring(0, 30)}...</span>
      </div>

      {editing ? (
        /* Edit Form */
        <div className="tw-bg-white tw-border tw-rounded-lg tw-p-6 tw-shadow-sm">
          <h2 className="tw-text-xl tw-font-bold tw-mb-5 tw-text-gray-800">Edit Product</h2>
          <form onSubmit={handleUpdate} className="tw-grid tw-gap-4">
            <div>
              <label className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">Title</label>
              <input
                name="title"
                value={form.title || ''}
                onChange={handleFormChange}
                className={`tw-w-full tw-border tw-p-2.5 tw-rounded focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 ${formErrors.title ? 'tw-border-red-400' : 'tw-border-gray-300'}`}
              />
              {formErrors.title && (
                <p className="tw-text-red-500 tw-text-xs tw-mt-1">{formErrors.title}</p>
              )}
            </div>
            <div className="tw-grid tw-grid-cols-2 tw-gap-4">
              <div>
                <label className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">Price (Rs. )</label>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  value={form.price || ''}
                  onChange={handleFormChange}
                  className={`tw-w-full tw-border tw-p-2.5 tw-rounded focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 ${formErrors.price ? 'tw-border-red-400' : 'tw-border-gray-300'}`}
                />
                {formErrors.price && (
                  <p className="tw-text-red-500 tw-text-xs tw-mt-1">{formErrors.price}</p>
                )}
              </div>
              <div>
                <label className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">Category</label>
                <input
                  name="category"
                  value={form.category || ''}
                  onChange={handleFormChange}
                  className="tw-w-full tw-border tw-border-gray-300 tw-p-2.5 tw-rounded focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">Description</label>
              <textarea
                name="description"
                value={form.description || ''}
                onChange={handleFormChange}
                rows={4}
                className={`tw-w-full tw-border tw-p-2.5 tw-rounded focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 ${formErrors.description ? 'tw-border-red-400' : 'tw-border-gray-300'}`}
              />
              {formErrors.description && (
                <p className="tw-text-red-500 tw-text-xs tw-mt-1">{formErrors.description}</p>
              )}
            </div>
            <div className="tw-flex tw-gap-3">
              <button
                type="submit"
                disabled={saving}
                className="tw-bg-blue-600 hover:tw-bg-blue-700 disabled:tw-bg-blue-400 tw-text-white tw-px-5 tw-py-2 tw-rounded tw-font-medium tw-transition-colors"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => { setEditing(false); setForm(product); setFormErrors({}); }}
                className="tw-bg-gray-200 hover:tw-bg-gray-300 tw-text-gray-700 tw-px-5 tw-py-2 tw-rounded tw-font-medium tw-transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Product View */
        <div className="tw-bg-white tw-border tw-rounded-lg tw-p-6 tw-shadow-sm">
          <div className="tw-flex tw-flex-col md:tw-flex-row tw-gap-8">

            <div className="tw-flex tw-items-center tw-justify-center tw-bg-gray-50 tw-rounded-lg tw-p-6 md:tw-w-64 tw-h-64 tw-shrink-0">
              <img
                src={product.image}
                alt={product.title}
                className="tw-max-h-full tw-object-contain"
              />
            </div>
            <div className="tw-flex-1">
              <p className="tw-text-xs tw-text-gray-400 tw-uppercase tw-tracking-wide tw-mb-2">
                {product.category}
              </p>
              <h1 className="tw-text-2xl tw-font-bold tw-text-gray-900 tw-mb-3">
                {product.title}
              </h1>
              <p className="tw-text-3xl tw-font-bold tw-text-blue-600 tw-mb-4">
                Rs. {Number(product.price).toFixed(2)}
              </p>
              <p className="tw-text-gray-600 tw-text-sm tw-leading-relaxed tw-mb-6">
                {product.description}
              </p>
              <div className="tw-flex tw-items-center tw-gap-2 tw-mb-6">
                <div className="tw-flex tw-text-yellow-400 tw-text-sm">★★★★☆</div>
                <span className="tw-text-sm tw-text-gray-500">4.0 (120 reviews)</span>
              </div>
              <div className="tw-flex tw-flex-wrap tw-gap-3">
                <button
                  onClick={handleAddToCart}
                  className={`tw-px-5 tw-py-2.5 tw-rounded tw-font-medium tw-transition-colors ${added
                      ? 'tw-bg-green-600 tw-text-white'
                      : 'tw-bg-blue-600 hover:tw-bg-blue-700 tw-text-white'
                    }`}
                >
                  {added ? '✓ Added to Cart' : 'Add to Cart'}
                </button>
                <button
                  onClick={() => setEditing(true)}
                  className="tw-bg-yellow-500 hover:tw-bg-yellow-600 tw-text-white tw-px-5 tw-py-2.5 tw-rounded tw-font-medium tw-transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="tw-bg-red-500 hover:tw-bg-red-600 tw-text-white tw-px-5 tw-py-2.5 tw-rounded tw-font-medium tw-transition-colors"
                >
                  Delete
                </button>
                <Link
                  to="/"
                  className="tw-bg-gray-100 hover:tw-bg-gray-200 tw-text-gray-700 tw-px-5 tw-py-2.5 tw-rounded tw-font-medium tw-transition-colors"
                >
                  Back
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
