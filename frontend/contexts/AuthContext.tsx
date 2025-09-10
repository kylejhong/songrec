import { Session, User } from "@supabase/supabase-js";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { supabase } from '../supabaseConfig';

type AuthContextType ={
    user: User | null;
    token: string | null;
    loading: boolean;
    signInPhone: (phoneNumber: string) => Promise<any>;
    login: (email: string, password: string) => Promise<any>;
    register: (email: string, password: string) => Promise<any>;
    logout: () => Promise<void>;
    authFetch: (url: string | URL, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const session = supabase.auth.getSession().then(({ data }) => {
            setUser(data.session?.user ?? null);
            setToken(data.session?.access_token ?? null);
            setLoading(false);
        });

        const { data:authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setToken(session?.access_token ?? null);
            setLoading(false);
        });

        return () => {
            authListener.subscription.unsubscribe();
        }
    }, []);

    const authFetch = async (url: string | URL, options: RequestInit = {}) => {
        const headers = {
            ...options.headers,
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        const response = await fetch(url, { ...options, headers });
        return response;
    };

    const signInPhone = async (phoneNumber: string) => {
        return supabase.auth.signInWithOtp({ phone: phoneNumber });
    };

    const login = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            throw error;
        }

        setUser(data.user ?? null);

        return data;
    };

    const register = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signUp({ email, password });

        if (error) throw error;

        if (data.session) setUser(data.session.user);

        return data;
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    return (
        <AuthContext.Provider
        value={{
            user,
            token,
            loading,
            signInPhone,
            login,
            register,
            logout,
            authFetch,
        }}
        >
        {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};