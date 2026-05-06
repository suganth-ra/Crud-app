import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { loginSuccess, logout } from '../redux/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated } = useSelector((state) => state.auth);

  const handleLogin = useCallback(
    (userData) => dispatch(loginSuccess(userData)),
    [dispatch]
  );

  const handleLogout = useCallback(() => dispatch(logout()), [dispatch]);

  return {
    user,
    token,
    isAuthenticated,
    login: handleLogin,
    logout: handleLogout,
  };
};
