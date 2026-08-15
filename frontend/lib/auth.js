export const saveTokens = (accessToken, refreshToken) => {
    if (typeof window === "undefined") return;

    if (accessToken) {
        localStorage.setItem("access", accessToken);
    }

    if (refreshToken) {
        localStorage.setItem("refresh", refreshToken);
    }
};

export const saveToken = (token) => {
    if (typeof window === "undefined") return;

    localStorage.setItem("access", token);
};

export const getToken = () => {
    if (typeof window === "undefined") return null;

    return localStorage.getItem("access");
};

export const getRefreshToken = () => {
    if (typeof window === "undefined") return null;

    return localStorage.getItem("refresh");
};

export const removeToken = () => {
    if (typeof window === "undefined") return;

    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
};

export const isAuthenticated = () => {
    return !!getToken();
};

