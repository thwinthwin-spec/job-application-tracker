import { createContext, useContext, useEffect, useState } from 'react';
import * as authApi from '../api/authApi.js';

const AuthContext = createContext(null);

// Read the user that was saved during an earlier visit.
function readStoredUser() {
  const raw = localStorage.getItem('user');
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
}

export function AuthProvider(props) {
  const [user, setUser] = useState(readStoredUser);
  const [token, setToken] = useState(function () {
    return localStorage.getItem('token');
  });
  const [loading, setLoading] = useState(true);

  // When the app opens, check the saved token with the API.
  useEffect(function () {
    let active = true;
    const savedToken = localStorage.getItem('token');

    if (!savedToken) {
      setLoading(false);
      return function () {
        active = false;
      };
    }

    authApi.fetchMe()
      .then(function (data) {
        if (!active) {
          return;
        }
        const freshUser = data.data.user;
        setUser(freshUser);
        localStorage.setItem('user', JSON.stringify(freshUser));
      })
      .catch(function () {
        if (!active) {
          return;
        }
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setToken(null);
      })
      .finally(function () {
        if (active) {
          setLoading(false);
        }
      });

    return function () {
      active = false;
    };
  }, []);

  // Save the token and user after login or registration.
  function saveSession(newToken, newUser) {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }

  async function login(values) {
    const data = await authApi.loginUser(values);
    saveSession(data.data.token, data.data.user);
    return data.data.user;
  }

  async function register(values) {
    const data = await authApi.registerUser(values);
    saveSession(data.data.token, data.data.user);
    return data.data.user;
  }

  // Logout always clears local data, even if the API call fails.
  async function logout() {
    try {
      await authApi.logoutUser();
    } catch (error) {
      // Ignore the error: the local session is cleared below.
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }

  async function loadMe() {
    const data = await authApi.fetchMe();
    const freshUser = data.data.user;
    setUser(freshUser);
    localStorage.setItem('user', JSON.stringify(freshUser));
    return freshUser;
  }

  const value = {
    user: user,
    token: token,
    loading: loading,
    isAuthenticated: Boolean(token && user),
    login: login,
    register: register,
    logout: logout,
    loadMe: loadMe,
  };

  return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return context;
}
