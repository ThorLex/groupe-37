import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

// Intercepteur client uniquement
if (typeof window !== 'undefined') {
  instance.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
}

instance.interceptors.response.use(
  response => response,
  error => {
    console.error('Axios Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default instance;