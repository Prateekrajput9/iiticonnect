import React, { createContext, useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      return { token, ...decoded };
    } catch {
      return null;
    }
  });

  const login = (data) => {
    localStorage.setItem('token', data.token);
    setUser({ token: data.token, id: data._id, username: data.username, email: data.email });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};