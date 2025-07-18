import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
    withCredentials: true,
});

export default api;