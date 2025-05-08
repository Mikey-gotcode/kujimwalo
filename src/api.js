import axios from 'axios';

const api = axios.create({
  baseURL: 'http://www.vinscollections.shop/api', // Include the protocol (http/https)
  headers: {
    
    // You can add other default headers here if needed
  },
  withCredentials: true, // If your API requires sending cookies (e.g., for Laravel Sanctum)
});

// Example of a request interceptor (for adding auth tokens)
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('[API REQUEST]', config.method, config.url, '→ headers:', config.headers);
  return config;
});

// Example of a response interceptor (for handling errors or data transformations)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle API errors globally here (e.g., redirect to login on 401)
    console.error('API Error:', error.response ? error.response.data : error.message);
    return Promise.reject(error);
  }
);

export default api;