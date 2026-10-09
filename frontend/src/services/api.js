import axios from 'axios';

const api = axios.create({
    baseURL: ' https://creamer-startling-vitally.ngrok-free.dev/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['ngrok-skip-browser-warning'] = true;
    return config;
});

export default api;
