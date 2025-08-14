import { supabase } from "../supabaseConfig";

// Email/password login
export const login = (email: string, password: string) => {
  return supabase.auth.signInWithPassword({ email, password });
};

// Email/password registration
export const register = (email: string, password: string) => {
  return supabase.auth.signUp({ email, password });
};

// Phone login (OTP)
export const signInPhone = (phoneNumber: string) => {
  return supabase.auth.signInWithOtp({ phone: phoneNumber });
};

// Logout
export const logout = () => supabase.auth.signOut();