import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
});

// Ajouter le token JWT à chaque requête
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Gérer les erreurs 401 (token expiré)
API.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth';
    }
    return Promise.reject(err);
  }
);

// ── AUTH ──
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');
export const checkUsername = (username) => API.post('/auth/check-username', { username });

// ── PORTFOLIO ──
export const getMyPortfolio = () => API.get('/portfolio/me');
export const updatePortfolio = (data) => API.put('/portfolio/me', data);
export const getPublicPortfolio = (username) => API.get(`/portfolio/${username}`);

export const addProjet = (data) => API.post('/portfolio/projet', data);
export const updateProjet = (id, data) => API.put(`/portfolio/projet/${id}`, data);
export const deleteProjet = (id) => API.delete(`/portfolio/projet/${id}`);

export const addExperience = (data) => API.post('/portfolio/experience', data);
export const deleteExperience = (id) => API.delete(`/portfolio/experience/${id}`);

export const addCompetence = (data) => API.post('/portfolio/competence', data);
export const deleteCompetence = (id) => API.delete(`/portfolio/competence/${id}`);

// ── USER ──
export const updateProfile = (data) => API.put('/user/profile', data);
export const updatePassword = (data) => API.put('/user/password', data);
export const uploadAvatar = (formData) => API.post('/user/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

// ── ANALYTICS ──
export const getMyAnalytics = () => API.get('/analytics/me');
export const getAdminAnalytics = () => API.get('/analytics/admin');

export default API;
