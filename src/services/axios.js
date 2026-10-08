
import axios from "axios";

const API = axios.create({
    baseURL: "https://velaura-backend-1.onrender.com/api"
});

API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");

    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
});

API.interceptors.response.use(
    (response) => {
        return response;
    },

    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem("refreshToken");

            if (!refreshToken) {
                return Promise.reject(error);
            }

            try {
                const res = await axios.post(
                    "https://velaura-backend-1.onrender.com/api/auth/refresh",
                    {
                        refreshToken: refreshToken
                    }
                );

                const newToken = res.data.token;

                localStorage.setItem("token", newToken);

                originalRequest.headers.Authorization = `Bearer ${newToken}`;

                return API(originalRequest);

            } catch (refreshError) {
                localStorage.removeItem("token");
                localStorage.removeItem("refreshToken");

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default API;
