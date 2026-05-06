import { useEffect, useState, useCallback } from 'react';
import {
  fetchProducts,
  deleteProduct,
  fetchCategories,
} from '../services/api';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    Promise.all([fetchProducts(), fetchCategories()])
      .then(([productsRes, catRes]) => {
        setProducts(productsRes.data);
        setCategories(['all', ...catRes.data]);
      })
      .catch(() => setError('Failed to load products. Please try again.'))
      .finally(() => setLoading(false));
  }, []);


  const handleDelete = useCallback(async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert('Failed to delete product.');
    }
  }, []);


  // Filter logic
  const filteredProducts = products.filter((p) => {
    const matchCategory =
      selectedCategory === 'all' || p.category === selectedCategory;
    const matchSearch = p.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  if (loading) {
    return (
      <div className="tw-flex tw-justify-center tw-items-center tw-h-64">
        <div className="tw-text-gray-500 tw-text-lg">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tw-text-center tw-mt-20 tw-text-red-500">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="tw-mt-3 tw-bg-blue-600 tw-text-white tw-px-4 tw-py-2 tw-rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="tw-max-w-6xl tw-mx-auto tw-px-4 tw-py-6">
      {/* Header */}
      <div className="tw-flex tw-flex-col sm:tw-flex-row tw-justify-between tw-items-start sm:tw-items-center tw-gap-3 tw-mb-6">
        <h1 className="tw-text-2xl tw-font-bold tw-text-gray-800">All Products</h1>
      </div>


      {/* Filters */}
      <div className="tw-flex tw-flex-col sm:tw-flex-row tw-gap-3 tw-mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="tw-border tw-border-gray-300 tw-px-3 tw-py-2 tw-rounded tw-text-sm focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 tw-flex-1"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="tw-border tw-border-gray-300 tw-px-3 tw-py-2 tw-rounded tw-text-sm focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 tw-capitalize"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat} className="tw-capitalize">
              {cat === 'all' ? 'All Categories' : cat}
            </option>
          ))}
        </select>
      </div>

      {/* Product Count */}
      <p className="tw-text-sm tw-text-gray-500 tw-mb-4">
        {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
      </p>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="tw-text-center tw-py-20 tw-text-gray-400">No products found.</div>
      ) : (
        <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 md:tw-grid-cols-3 lg:tw-grid-cols-4 tw-gap-5">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
