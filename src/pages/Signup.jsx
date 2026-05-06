import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Signup = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();

  const password = watch('password');

  const onSubmit = (data) => {
    login({
      user: { email: data.email, name: data.name },
      token: 'jwt-' + btoa(data.email) + '-' + Date.now(),
    });
    navigate('/');
  };

  return (
    <div className="tw-min-h-screen tw-flex tw-items-center tw-justify-center tw-bg-gray-50 tw-px-4">
      <div className="tw-bg-white tw-p-8 tw-rounded-xl tw-shadow-md tw-w-full tw-max-w-sm">
        <div className="tw-text-center tw-mb-6">
          <div className="tw-text-3xl tw-mb-2">🛒</div>
          <h1 className="tw-text-2xl tw-font-bold tw-text-gray-800">Create Account</h1>
          <p className="tw-text-sm tw-text-gray-500 tw-mt-1">
            Join us and start shopping
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="tw-space-y-4" noValidate>
          <div>
            <label className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">
              Full Name
            </label>
            <input
              type="text"
              {...register('name', {
                required: 'Full name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters',
                },
              })}
              placeholder="John Doe"
              className={`tw-w-full tw-border tw-px-3 tw-py-2.5 tw-rounded-lg tw-text-sm focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 ${errors.name ? 'tw-border-red-400 tw-bg-red-50' : 'tw-border-gray-300'
                }`}
            />
            {errors.name && (
              <p className="tw-text-red-500 tw-text-xs tw-mt-1">{errors.name.message}</p>
            )}
          </div>

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
              className={`tw-w-full tw-border tw-px-3 tw-py-2.5 tw-rounded-lg tw-text-sm focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 ${errors.email ? 'tw-border-red-400 tw-bg-red-50' : 'tw-border-gray-300'
                }`}
            />
            {errors.email && (
              <p className="tw-text-red-500 tw-text-xs tw-mt-1">{errors.email.message}</p>
            )}
          </div>

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
                pattern: {
                  value: /^(?=.*[0-9])/,
                  message: 'Password must contain at least one number',
                },
              })}
              placeholder="••••••••"
              className={`tw-w-full tw-border tw-px-3 tw-py-2.5 tw-rounded-lg tw-text-sm focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 ${errors.password ? 'tw-border-red-400 tw-bg-red-50' : 'tw-border-gray-300'
                }`}
            />
            {errors.password && (
              <p className="tw-text-red-500 tw-text-xs tw-mt-1">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) =>
                  value === password || 'Passwords do not match',
              })}
              placeholder="••••••••"
              className={`tw-w-full tw-border tw-px-3 tw-py-2.5 tw-rounded-lg tw-text-sm focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 ${errors.confirmPassword
                  ? 'tw-border-red-400 tw-bg-red-50'
                  : 'tw-border-gray-300'
                }`}
            />
            {errors.confirmPassword && (
              <p className="tw-text-red-500 tw-text-xs tw-mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="tw-w-full tw-bg-blue-600 hover:tw-bg-blue-700 tw-text-white tw-py-2.5 tw-rounded-lg tw-font-semibold tw-text-sm tw-transition-colors"
          >
            Create Account
          </button>
        </form>

        <p className="tw-text-center tw-text-sm tw-text-gray-500 tw-mt-5">
          Already have an account?{' '}
          <Link to="/login" className="tw-text-blue-600 hover:tw-underline tw-font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
