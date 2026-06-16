import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('fintrack_token');
    const storedUser = localStorage.getItem('fintrack_user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      
      // Set default Authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }

    setLoading(false);
  }, []);

  const signup = async (email, username, password) => {
  try {
    await axios.post('http://localhost:8000/auth/signup', {
      email,
      username,
      password
    });

    return { success: true };
  } catch (error) {
    const errorMessage =
      error.response?.data?.detail || 'Signup failed';

    return {
      success: false,
      error: errorMessage
    };
  }
};

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:8000/auth/login', {
        email,
        password
      });

      const { access_token, user: userData } = response.data;
      
      setToken(access_token);
      setUser(userData);
      localStorage.setItem('fintrack_token', access_token);
      localStorage.setItem('fintrack_user', JSON.stringify(userData));
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Login failed';
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
  localStorage.removeItem("fintrack_token");
  localStorage.removeItem("fintrack_user");

  delete axios.defaults.headers.common["Authorization"];

  setUser(null);
  setToken(null);
};

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
