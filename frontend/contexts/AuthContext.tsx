import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signInWithPhoneNumber, signOut, User } from 'firebase/auth';
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { app } from '../firebaseConfig';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';

type AuthContextType ={
    user: User | null,
    loading: boolean,
    signInPhone: (phoneNumber: string, recaptchaVerifier: FirebaseRecaptchaVerifierModal) => Promise<any>;
    login: (email: string, password: string) => Promise<any>;
    register: (email: string, password: string) => Promise<any>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const auth = getAuth(app);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            setLoading(false);
        })

        return unsubscribe;
    }, []);

    const signInPhone = async (phoneNumber: string, recaptchaVerifier: FirebaseRecaptchaVerifierModal) => {
        return signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    };

    const login = async (email: string, password: string) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const register = async (email: string, password: string) => {
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const logout = async () => {
        return signOut(auth);
    };

    return (
        <AuthContext.Provider
        value={{
            user,
            loading,
            signInPhone,
            login,
            register,
            logout,
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