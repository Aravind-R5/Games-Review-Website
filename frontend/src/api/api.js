// -----------------------------------------------
// API Service — Axios Configuration
// -----------------------------------------------
// Centralized API service for making HTTP requests
// to our Django backend. Handles auth tokens automatically.
// -----------------------------------------------

import axios from 'axios';

// Use environment variable for production, default to /api for local development proxy
let baseURL = import.meta.env.VITE_API_URL || '/api';

// Smart check: If it's a full URL and missing /api suffix, add it automatically
if (baseURL.startsWith('http') && !baseURL.includes('/api')) {
  baseURL = baseURL.replace(/\/$/, '') + '/api';
}

const API = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// -----------------------------------------------
// Request Interceptor — Add auth token to requests
// -----------------------------------------------
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// -----------------------------------------------
// API Functions — Organized by feature
// -----------------------------------------------

// --- Authentication ---
export const loginUser = (data) => API.post('/auth/login/', data);
export const registerUser = (data) => API.post('/auth/register/', data);
export const logoutUser = () => API.post('/auth/logout/');

// --- Games ---
export const getGames = (params) => API.get('/games/', { params });
export const getGameDetail = (id) => API.get(`/games/${id}/`);

// --- Reviews ---
export const getReviews = (params) => API.get('/reviews/', { params });
export const createReview = (data) => API.post('/reviews/', data);
export const updateReview = (id, data) => API.put(`/reviews/${id}/`, data);
export const deleteReview = (id) => API.delete(`/reviews/${id}/`);

// --- Homepage Data ---
export const getFeatured = () => API.get('/featured/');
export const getActivity = () => API.get('/activity/');
export const getTopRated = () => API.get('/top-rated/');

// --- Profile ---
export const getProfile = (id) => API.get(`/profile/${id}/`);

export default API;
