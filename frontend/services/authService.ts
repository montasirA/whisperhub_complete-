import api from "@/lib/api";


// ==========================
// LOGIN
// ==========================

export const loginUser = async (
    email: string,
    password: string
) => {

    const response = await api.post(
        "/accounts/login/",
        {
            email,
            password,
        }
    );

    return response.data;
};


// ==========================
// REGISTER
// ==========================

export const registerUser = async (
    data: {
        email: string;
        username: string;
        display_name: string;
        password: string;
    }
) => {

    const response = await api.post(
        "/accounts/register/",
        data
    );

    return response.data;
};


// ==========================
// CURRENT USER
// ==========================

export const getCurrentUser = async () => {

    const response = await api.get(
        "/accounts/me/"
    );

    return response.data;
};


// ==========================
// UPDATE PROFILE
// ==========================

export const updateProfile = async (
    data: FormData | Record<string, unknown>
) => {

    const response = await api.put(
        "/accounts/profile/update/",
        data,
        // Let the browser/axios set Content-Type for FormData so boundary is included
        data instanceof FormData ? undefined : undefined
    );

    return response.data;
};


// ==========================
// USERNAME CHECK
// ==========================

export const checkUsername = async (
    username: string
) => {

    const response = await api.get(
        "/accounts/username/",
        {
            params: {
                username,
            },
        }
    );

    return response.data;
};