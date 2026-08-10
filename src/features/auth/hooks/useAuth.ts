import { useAppSelector, useAppDispatch } from '@/lib/hooks/redux';
import { setCredentials, logout, setLoading } from '@/store/slices/auth';
import type { User } from '../types';

export const useAuth = () => {
  const auth = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();

  const login = (user: User, token: string) => {
    dispatch(setCredentials({ user, token }));
    // Store in localStorage for persistence
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_data', JSON.stringify(user));
  };

  const handleLogout = () => {
    dispatch(logout());
    // Clear localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    // Clear any other auth-related data
    localStorage.removeItem('remember_me');
  };

  const setAuthLoading = (loading: boolean) => {
    dispatch(setLoading(loading));
  };

  const isAuthenticated = () => {
    const result = !!auth.token && !!auth.user;
    return result;
  };

  const hasRole = (role: 'user' | 'admin') => {
    const result = auth.user?.role === role;
    return result;
  };

  const isVerified = () => {
    const result = auth.user?.isVerified === true;
    return result;
  };

  return {
    ...auth,
    login,
    logout: handleLogout,
    setLoading: setAuthLoading,
    isAuthenticated,
    hasRole,
    isVerified,
  };
};
