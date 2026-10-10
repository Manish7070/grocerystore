
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authAPI } from '../utils/api';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return { user: action.payload.user, token: action.payload.token, authLoading: false };
    case 'LOGOUT':
      return { user: null, token: null, authLoading: false };
    case 'VALIDATED':
      return { ...state, user: action.payload, authLoading: false };
    case 'READY':
      return { ...state, authLoading: false };
    default:
      return state;
  }
};

const loadAuth = () => {
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      if (token && user) {
        return { user, token, authLoading: true };
      }
    } catch (err) {
      console.error('Error loading auth from localStorage', err);
    }
    return { user: null, token: null, authLoading: false };
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, undefined, loadAuth);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const expired = () => {
      dispatch({ type: 'LOGOUT' });
      const from = `${location.pathname}${location.search}${location.hash}`;
      if (!['/signin', '/signup'].includes(location.pathname)) {
        navigate('/signin', { replace: true, state: { from, sessionExpired: true } });
      }
    };
    window.addEventListener('grocerystore:session-expired', expired);
    window.addEventListener('greenbasket:session-expired', expired);
    return () => {
      window.removeEventListener('grocerystore:session-expired', expired);
      window.removeEventListener('greenbasket:session-expired', expired);
    };
  }, [location, navigate]);

  useEffect(() => {
    if (!state.token) return;
    let active = true;
    authAPI.profile().then(({ data }) => {
      if (active && localStorage.getItem('token') === state.token) {
        localStorage.setItem('user', JSON.stringify(data));
        dispatch({ type: 'VALIDATED', payload: data });
      }
    }).catch(() => {
      if (active) dispatch({ type: 'READY' });
    });
    return () => { active = false; };
  }, [state.token]);

  const login = (authData) => {
    const { token, ...user } = authData;
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
  };

  const updateUser = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token: state.token } });
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
