import axios from "axios";

// Create Axios instance with base URL
const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true, // Use if you're working with cookies (optional)
});

// Add JWT token to every request if it exists
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token"); // JWT stored locally
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default API;
