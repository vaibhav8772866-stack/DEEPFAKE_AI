import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 60000,
});

// Inject Authorization header if JWT token exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sentinel_jwt');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Handle 401 Unauthorized globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (localStorage.getItem('sentinel_jwt')) {
        console.warn('Session expired or unauthorized. Clearing credentials.');
        localStorage.removeItem('sentinel_jwt');
        localStorage.removeItem('sentinel_user');
      }
    }
    return Promise.reject(error);
  }
);

// Health Check
export const checkHealth = async () => {
  const res = await api.get('/health');
  return res.data;
};

// Auth Services
export const authLogin = async (usernameOrEmail, password) => {
  const res = await api.post('/auth/login', { usernameOrEmail, password });
  return res.data;
};

export const authRegister = async (username, email, password, fullName) => {
  const res = await api.post('/auth/register', { username, email, password, fullName });
  return res.data;
};

export const getMe = async () => {
  const res = await api.get('/auth/me');
  return res.data;
};

// Detection Services
export const analyzeImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await api.post('/detection/analyze-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};
export const detectImage = analyzeImage;

export const analyzeWebcamFrame = async (base64OrFile) => {
  if (base64OrFile instanceof File || base64OrFile instanceof Blob) {
    const formData = new FormData();
    formData.append('file', base64OrFile);
    const res = await api.post('/detection/analyze-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  } else {
    const res = await api.post('/detection/analyze-webcam-frame', { image: base64OrFile });
    return res.data;
  }
};
export const detectWebcamFrame = analyzeWebcamFrame;

export const analyzeVideo = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await api.post('/detection/analyze-video', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};
export const detectVideo = analyzeVideo;

export const analyzeAudio = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await api.post('/detection/analyze-audio', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};
export const detectAudio = analyzeAudio;

export const getModelStatus = async () => {
  const res = await api.get('/detection/model-status');
  return res.data;
};

export const reloadModel = async () => {
  const res = await api.post('/detection/reload-model');
  return res.data;
};

// History & Record Services
export const getScanHistory = async (page = 0, size = 15) => {
  const res = await api.get(`/detection/history?page=${page}&size=${size}`);
  return res.data;
};

export const getRecordDetail = async (id) => {
  const res = await api.get(`/detection/history/${id}`);
  return res.data;
};

export const deleteRecord = async (id) => {
  const res = await api.delete(`/detection/history/${id}`);
  return res.data;
};
export const deleteScanRecord = deleteRecord;

// Stats Services
export const getDashboardStats = async () => {
  const res = await api.get('/stats/dashboard');
  return res.data;
};

// Admin Services
export const getAdminUsers = async () => {
  const res = await api.get('/admin/users');
  return res.data;
};
export const getAllUsers = getAdminUsers;

export const updateUserRole = async (userId, role) => {
  const res = await api.patch(`/admin/users/${userId}/role`, { role });
  return res.data;
};

export const toggleUserStatus = async (userId) => {
  const res = await api.patch(`/admin/users/${userId}/toggle-status`);
  return res.data;
};

export const getSystemHealth = async () => {
  const res = await api.get('/admin/system-health');
  return res.data;
};

export default api;
