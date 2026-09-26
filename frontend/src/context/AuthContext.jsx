import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Initialize auth
  useEffect(() => {
    const initializeAuth = () => {
      try {
        // Check for admin token first
        const adminToken = localStorage.getItem('adminInfo_token');
        const adminInfo = localStorage.getItem('adminInfo_admin');
        
        // Check for user token
        const userToken = localStorage.getItem('userInfo_token');
        const userInfo = localStorage.getItem('userInfo_user');

        if (adminToken && adminInfo) {
          setToken(adminToken);
          setAdmin(JSON.parse(adminInfo));
          axios.defaults.headers.common['Authorization'] = `Bearer ${adminToken}`;
        } else if (userToken && userInfo) {
          setToken(userToken);
          setUser(JSON.parse(userInfo));
          axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
        }
      } catch (err) {
        console.error('Error initializing auth:', err);

        localStorage.removeItem('userInfo_token');
        localStorage.removeItem('userInfo_user');
        localStorage.removeItem('userInfo_admin');
        localStorage.removeItem('adminInfo_token');
        localStorage.removeItem('adminInfo_admin');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Persist auth data
  const persistAuthData = useCallback(
    (userData, authToken, adminData = null) => {
      try {
        const tokenKey = adminData ? 'adminInfo_token' : 'userInfo_token';
        const userKey = adminData ? 'adminInfo_admin' : 'userInfo_user';

        localStorage.setItem(tokenKey, authToken);

        if (userData) {
          localStorage.setItem(userKey, JSON.stringify(userData));
        }

        if (adminData) {
          localStorage.setItem(userKey, JSON.stringify(adminData));
        }

        axios.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${authToken}`;
      } catch (err) {
        console.error('Error persisting auth data:', err);
      }
    },
    []
  );

  // Register
  const register = useCallback(
    async (userData) => {
      setLoading(true);
      setError(null);
      setSuccess(null);

      try {
        const response = await axios.post(
          `${API_BASE_URL}/auth/register`,
          userData
        );

        if (response.data.success) {
          const newUser = response.data.user;
          const responseToken = response.data.token;

          setUser(newUser);
          setToken(responseToken);

          persistAuthData(newUser, responseToken);

          setSuccess('Registration successful!');

          return {
            success: true,
            user: newUser,
          };
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          'Registration failed';

        setError(errorMessage);

        return {
          success: false,
          message: errorMessage,
        };
      } finally {
        setLoading(false);
      }
    },
    [persistAuthData]
  );

  // Login
  const login = useCallback(
    async (credentials) => {
      setLoading(true);
      setError(null);
      setSuccess(null);

      try {
        const response = await axios.post(
          `${API_BASE_URL}/auth/login`,
          credentials
        );

        if (response.data.success) {
          const userData = response.data.user;
          const responseToken = response.data.token;

          setUser(userData);
          setAdmin(null);
          setToken(responseToken);

          persistAuthData(userData, responseToken);

          setSuccess('Login successful!');

          return {
            success: true,
            user: userData,
          };
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          'Login failed';

        setError(errorMessage);

        return {
          success: false,
          message: errorMessage,
        };
      } finally {
        setLoading(false);
      }
    },
    [persistAuthData]
  );

  // Admin Login
  const adminLogin = useCallback(
    async (credentials) => {
      setLoading(true);
      setError(null);
      setSuccess(null);

      try {
        const response = await axios.post(
          `${API_BASE_URL}/admin/login`,
          credentials
        );

        if (response.data.success) {
          const adminData = response.data.admin;
          const responseToken = response.data.token;

          setAdmin(adminData);
          setUser(null);
          setToken(responseToken);

          persistAuthData(null, responseToken, adminData);

          setSuccess('Admin login successful!');

          return {
            success: true,
            admin: adminData,
          };
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          'Admin login failed';

        setError(errorMessage);

        return {
          success: false,
          message: errorMessage,
        };
      } finally {
        setLoading(false);
      }
    },
    [persistAuthData]
  );

  // Logout
  const logout = useCallback(() => {
    setUser(null);
    setAdmin(null);
    setToken(null);
    setError(null);
    setSuccess(null);

    localStorage.removeItem('userInfo_token');
    localStorage.removeItem('userInfo_user');
    localStorage.removeItem('userInfo_admin');
    localStorage.removeItem('adminInfo_token');
    localStorage.removeItem('adminInfo_admin');

    delete axios.defaults.headers.common['Authorization'];
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Clear success
  const clearSuccess = useCallback(() => {
    setSuccess(null);
  }, []);

  // Update profile
  const updateProfile = useCallback(
    (userData) => {
      const updatedUser = { ...user, ...userData };

      setUser(updatedUser);

      persistAuthData(updatedUser, token);
    },
    [user, token, persistAuthData]
  );

  const value = {
    user,
    admin,
    token,
    loading,
    error,
    success,
    register,
    login,
    adminLogin,
    logout,
    clearError,
    clearSuccess,
    updateProfile,
    isAuthenticated: !!token && !!user,
    isAdmin: !!token && !!admin,
    setError,
    setSuccess,
    setAdmin,
    setUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

// Custom Hook
export const useAuth = () => {
  const context = React.useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used within AuthProvider'
    );
  }

  return context;
};