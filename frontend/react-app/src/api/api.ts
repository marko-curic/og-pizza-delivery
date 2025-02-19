import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { "Content-Type": "application/json" }
});

const simulateDelay = (delay: number) => {
    return new Promise(resolve => setTimeout(resolve, delay));
};

api.interceptors.request.use( async (config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    await simulateDelay(1000);
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            console.warn("Token expired, logging out...");
            localStorage.removeItem("token");
            localStorage.removeItem("tokenExpiration");
            window.location.href = "/";
        }
        return Promise.reject(error);
    }
);

export default api;
