import { createContext, useState } from 'react';

export const OnboardingContext = createContext<{
    username: string;
    phoneNumber: string;
}>({ username: "", phoneNumber: "" });


export const OnboardingProvider = ({ children }: { children: React.ReactNode }) => {
    const [username, setUsername] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    
    return (
        <OnboardingContext.Provider value={{ username, phoneNumber }}>
            {children}
        </OnboardingContext.Provider>
    );
}