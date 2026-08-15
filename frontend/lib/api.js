import axios from "axios";
import { getRefreshToken, saveTokens, removeToken } from "./auth";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api",

    headers: {
        "Content-Type": "application/json",
    },
});


// ==========================
// REQUEST INTERCEPTOR
// ==========================

api.interceptors.request.use(
    (config) => {

        if (typeof window !== "undefined") {

            const token = localStorage.getItem("access");

            if (token) {

                config.headers = config.headers || {};

                config.headers.Authorization =
                    `Bearer ${token}`;

            }

        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);


// ==========================
// RESPONSE INTERCEPTOR
// ==========================

api.interceptors.response.use(

    (response) => {
        return response;
    },

    (error) => {

        const status = error.response?.status;
        const data = error.response?.data;

        console.error("API ERROR:", status, data);

        // Attempt token refresh on SimpleJWT token_not_valid errors
        if (
            status === 401 &&
            data?.code === "token_not_valid" &&
            typeof window !== "undefined"
        ) {
            const originalRequest = error.config;

            // Prevent infinite retry loop
            if (originalRequest._retry) {
                removeToken();
                return Promise.reject(error);
            }

            const refresh = getRefreshToken();

            if (!refresh) {
                removeToken();
                return Promise.reject(error);
            }

            originalRequest._retry = true;

            // Call refresh endpoint directly with a bare axios instance to avoid interceptor loops
            return axios
                .post(`${api.defaults.baseURL}/token/refresh/`, {
                    refresh,
                })
                .then((resp) => {
                    const access = resp.data?.access;
                    const refreshToken = resp.data?.refresh || refresh;

                    if (access) {
                        // Save tokens and update header
                        saveTokens(access, refreshToken);

                        originalRequest.headers = originalRequest.headers || {};
                        originalRequest.headers.Authorization = `Bearer ${access}`;

                        return api(originalRequest);
                    }

                    removeToken();
                    return Promise.reject(error);
                })
                .catch((refreshErr) => {
                    removeToken();
                    return Promise.reject(refreshErr);
                });
        }

        return Promise.reject(error);
    }

);


export default api;