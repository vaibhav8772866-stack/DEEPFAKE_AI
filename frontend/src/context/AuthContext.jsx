import React, { createContext, useState, useEffect } from 'react';
import { authLogin, authRegister, getMe } from '../services/api';

export const defaultAuth = {
  user: null,
  token: null,
  isAuthenticated: false,
  isAdmin: false,
  loading: false,
  login: async () => {},
  loginUser: async () => {},
  register: async () => {},
  registerUser: async () => {},
  logout: () => {}
};

export const AuthContext = createContext(defaultAuth);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('sentinel_jwt') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('sentinel_jwt');
      const storedUser = localStorage.getItem('sentinel_user');

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          const me = await getMe();
          setUser(me);
          localStorage.setItem('sentinel_user', JSON.stringify(me));
        } catch (e) {
          console.warn('Initial session check failed:', e.message);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (usernameOrEmail, password) => {
    const data = await authLogin(usernameOrEmail, password);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('sentinel_jwt', data.token);
    localStorage.setItem('sentinel_user', JSON.stringify(data.user));
    return data;
  };

  const register = async (username, email, password, fullName) => {
    const data = await authRegister(username, email, password, fullName);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('sentinel_jwt', data.token);
    localStorage.setItem('sentinel_user', JSON.stringify(data.user));
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('sentinel_jwt');
    localStorage.removeItem('sentinel_user');
  };

  const isAdmin = user?.role === 'ROLE_ADMIN';
  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated,
      isAdmin,
      loading,
      login,
      loginUser: login,
      register,
      registerUser: register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  return context || defaultAuth;
};
