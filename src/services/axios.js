
import axios from "axios";

const BASE_URL = "https://velaura-backend-3.onrender.com/api";

const API = axios.create({
    baseURL: BASE_URL,
});


const refreshAPI = axios.create({
    baseURL: BASE_URL,
});

// Attach access token to every API request
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Refresh access token when the API returns 401
API.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        if (!originalRequest || error.response?.status !== 401) {
            return Promise.reject(error);
        }

        // Do not retry the same request more than once
        if (originalRequest._retry) {
            return Promise.reject(error);
        }

        // Do not attempt refresh if this is the refresh endpoint itself
        if (originalRequest.url?.includes("/auth/refresh")) {
            return Promise.reject(error);
        }

        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            const response = await refreshAPI.post("/auth/refresh", {
                refreshToken,
            });

            const newToken = response.data.token;

            if (!newToken) {
                throw new Error("New access token was not returned");
            }

            localStorage.setItem("token", newToken);

            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${newToken}`;

            // Retry the original request with the new access token
            return API(originalRequest);

        } catch (refreshError) {
            // Clear the session only when refresh fails
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("role");
            localStorage.removeItem("userName");
            localStorage.removeItem("userId");

            return Promise.reject(refreshError);
        }
    }
);

export default API;

