import { createContext, useState } from 'react';

type OnboardingContextType = {
    username: string;
    phoneNumber: string;
    setUsername: (value: string) => void;
    setPhoneNumber: (value: string) => void;
}

export const OnboardingContext = createContext<OnboardingContextType>({ 
    username: "", 
    phoneNumber: "",
    setUsername: () => {},
    setPhoneNumber: () => {},
});


export const OnboardingProvider = ({ children }: { children: React.ReactNode }) => {
    const [username, setUsername] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    
    return (
        <OnboardingContext.Provider value={{ 
            username, 
            phoneNumber,
            setUsername,
            setPhoneNumber,
        }}>
            {children}
        </OnboardingContext.Provider>
    );
}