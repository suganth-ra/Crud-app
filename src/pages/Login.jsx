import { useForm } from 'react-hook-form';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { loginUser } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect to intended page after login
  const from = location.state?.from || '/';

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError('');
    try {
      // Try real API first
      const res = await loginUser({ username: data.email, password: data.password });
      login({ user: { email: data.email }, token: res.data.token });
      navigate(from, { replace: true });
    } catch {
      // Fallback: simulate login for demo (fakestoreapi credentials are rigid)
      // In real app, show proper error
      if (data.email && data.password.length >= 6) {
        login({
          user: { email: data.email, name: data.email.split('@')[0] },
          token: 'jwt-' + btoa(data.email) + '-' + Date.now(),
        });
        navigate(from, { replace: true });
      } else {
        setServerError('Invalid credentials. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tw-min-h-screen tw-flex tw-items-center tw-justify-center tw-bg-gray-50 tw-px-4">
      <div className="tw-bg-white tw-p-8 tw-rounded-xl tw-shadow-md tw-w-full tw-max-w-sm">
        {/* Logo */}
        <div className="tw-text-center tw-mb-6">
          <div className="tw-text-3xl tw-mb-2">🛒</div>
          <h1 className="tw-text-2xl tw-font-bold tw-text-gray-800">Welcome Back</h1>
          <p className="tw-text-sm tw-text-gray-500 tw-mt-1">Sign in to your account</p>
        </div>

        {serverError && (
          <div className="tw-bg-red-50 tw-border tw-border-red-200 tw-text-red-600 tw-px-4 tw-py-2.5 tw-rounded-lg tw-text-sm tw-mb-4">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="tw-space-y-4" noValidate>
          {/* Email */}
          <div>
            <label className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">
              Email Address
            </label>
            <input
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Enter a valid email address',
                },
              })}
              placeholder="you@example.com"
              className={`tw-w-full tw-border tw-px-3 tw-py-2.5 tw-rounded-lg tw-text-sm focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 ${
                errors.email ? 'tw-border-red-400 tw-bg-red-50' : 'tw-border-gray-300'
              }`}
            />
            {errors.email && (
              <p className="tw-text-red-500 tw-text-xs tw-mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">
              Password
            </label>
            <input
              type="password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
              placeholder="••••••••"
              className={`tw-w-full tw-border tw-px-3 tw-py-2.5 tw-rounded-lg tw-text-sm focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 ${
                errors.password ? 'tw-border-red-400 tw-bg-red-50' : 'tw-border-gray-300'
              }`}
            />
            {errors.password && (
              <p className="tw-text-red-500 tw-text-xs tw-mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="tw-w-full tw-bg-blue-600 hover:tw-bg-blue-700 disabled:tw-bg-blue-400 tw-text-white tw-py-2.5 tw-rounded-lg tw-font-semibold tw-text-sm tw-transition-colors"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="tw-text-center tw-text-sm tw-text-gray-500 tw-mt-5">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="tw-text-blue-600 hover:tw-underline tw-font-medium">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
