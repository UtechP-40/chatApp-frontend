import axios from 'axios';

// console.log(import.meta.env);

export const axiosInstance = axios.create({ baseURL: import.meta.env.MODE === "development" ? "http://localhost:80/api" : `${import.meta.env.VITE_BASE_URL}/api`, withCredentials: true });

//`${import.meta.env.VITE_BASE_URL}"/api"`