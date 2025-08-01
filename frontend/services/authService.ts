import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPhoneNumber, signOut } from 'firebase/auth';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { auth } from '../firebaseConfig';

export const login = (email: string, password: string) => signInWithEmailAndPassword(auth, email, password);
export const register = (email: string, password: string) => createUserWithEmailAndPassword(auth, email, password);
export const signInPhone = (phoneNumber: string, recaptchaVerifier: FirebaseRecaptchaVerifierModal) => signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
export const logout = () => signOut(auth);