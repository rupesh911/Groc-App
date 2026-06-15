import Axios from 'axios';

const API_BASE = 'http://localhost:9000';
export const registerUser = (payload) => {
  return Axios.post(`${API_BASE}/auth/register`, payload);
};

export const loginUser = (payload) => {
  return Axios.post(`${API_BASE}/auth/login`, payload);
};

export const setAuthToken = (token, email, name) => {
  localStorage.setItem('grocify_token', token);
  localStorage.setItem('grocify_email', email);
  if (name) localStorage.setItem('grocify_name', name);
};

export const removeAuthToken = () => {
  localStorage.removeItem('grocify_token');
  localStorage.removeItem('grocify_email');
  localStorage.removeItem('grocify_name');
};

export const getAuthToken = () => localStorage.getItem('grocify_token');
export const getUserEmail = () => localStorage.getItem('grocify_email');
export const getUserName = () => localStorage.getItem('grocify_name');
export const isAuthenticated = () => Boolean(getAuthToken());

const ADMIN_EMAIL = process.env.REACT_APP_ADMIN_EMAIL || 'owner@example.com';

export const isAdmin = () => {
  const email = getUserEmail();
  return Boolean(
    email && email.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase().trim()
  );
};

export const authHeader = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};