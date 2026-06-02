import { createContext, useContext, useEffect, useState } from 'react';

const AdminAuthContext = createContext();

// ⚠️ Single source of truth — must match adminApi.js
export const TOKEN_KEY = 'spa_admin_token';
export const USER_KEY  = 'spa_admin_user';

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    try {
      const stored = localStorage.getItem('spa_admin_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('spa_admin_token');
    if (!token) {
      localStorage.removeItem('spa_admin_user');
      setAdmin(null);
    }
    setLoading(false);
  }, []);

  // login now accepts both token AND admin data
  const login = (token, adminData) => {
    localStorage.setItem('spa_admin_token', token);
    localStorage.setItem('spa_admin_user', JSON.stringify(adminData));
    setAdmin(adminData);
  };

  const logout = () => {
    localStorage.removeItem('spa_admin_token');
    localStorage.removeItem('spa_admin_user');
    setAdmin(null);
  };

  const isAuth = !!admin && !!localStorage.getItem('spa_admin_token');

  return (
    <AdminAuthContext.Provider value={{ admin, isAuth, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);

// http://localhost/admin/login
// http://localhost/admin
// http://localhost/admin/blogs
// http://localhost/admin/courses
// http://localhost/admin/contacts

