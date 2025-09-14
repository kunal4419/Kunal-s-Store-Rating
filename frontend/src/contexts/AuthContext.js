import React, { createContext, useState, useEffect } from 'react';
import api from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const loadUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
  const res = await api.get('/auth/me');
  setUser(res.data);
  localStorage.setItem('user', JSON.stringify(res.data));
    } catch {
      localStorage.removeItem('token');
  localStorage.removeItem('user');
  setUser(null);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    // Optimistically fetch user and persist
    loadUser();
  };

  const logout = () => {
    localStorage.removeItem('token');
  localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
