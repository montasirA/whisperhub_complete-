"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";

import {
    saveTokens,
    removeToken,
    getToken,
} from "@/lib/auth";

import {
    loginUser,
    getCurrentUser,
} from "@/services/authService";


interface User {
    id: string;
    email: string;
    username: string;
    display_name: string;
    bio?: string;
    avatar?: string | null;
    emoji_avatar?: string;
    theme_color?: string;
    privacy_level?: string;
    is_verified?: boolean;
    is_online?: boolean;
    status_message?: string;
    date_joined?: string;
}


interface AuthContextType {

    token: string | null;

    user: User | null;

    loading: boolean;

    login: (
        email: string,
        password: string
    ) => Promise<{
        access: string;
        refresh: string;
        user: User;
    }>;

    logout: () => void;

    refreshUser: () => Promise<void>;

}


const AuthContext = createContext<
    AuthContextType | undefined
>(undefined);


export function AuthProvider(
    {
        children,
    }: {
        children: ReactNode;
    }
) {

    const [token, setToken] = useState<string | null>(null);

    const [user, setUser] = useState<User | null>(null);

    const [loading, setLoading] = useState(true);


    // ==========================
    // RESTORE SESSION
    // ==========================

    useEffect(() => {

        const restoreSession = async () => {

            const storedToken = getToken();

            if (!storedToken) {

                setLoading(false);

                return;

            }


            setToken(storedToken);


            try {

                const currentUser =
                    await getCurrentUser();

                setUser(currentUser);

            } catch {

                removeToken();

                setToken(null);

                setUser(null);

            } finally {

                setLoading(false);

            }

        };


        restoreSession();

    }, []);


    // ==========================
    // LOGIN
    // ==========================

    const login = async (
        email: string,
        password: string
    ) => {

        const data = await loginUser(
            email,
            password
        );


        saveTokens(
            data.access,
            data.refresh
        );


        setToken(data.access);

        setUser(data.user);


        return data;

    };


    // ==========================
    // LOGOUT
    // ==========================

    const logout = () => {

        removeToken();

        setToken(null);

        setUser(null);

    };


    // ==========================
    // REFRESH USER
    // ==========================

    const refreshUser = async () => {

        const currentUser =
            await getCurrentUser();

        setUser(currentUser);

    };


    return (

        <AuthContext.Provider
            value={{
                token,
                user,
                loading,
                login,
                logout,
                refreshUser,
            }}
        >

            {children}

        </AuthContext.Provider>

    );

}


export function useAuth() {

    const context = useContext(
        AuthContext
    );


    if (!context) {

        throw new Error(
            "useAuth must be used inside AuthProvider"
        );

    }


    return context;

}