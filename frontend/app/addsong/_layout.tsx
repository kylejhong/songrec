import { useAuth } from '@/contexts/AuthContext';
import { OnboardingProvider } from '@/contexts/OnboardingContext';
import { BlurView } from 'expo-blur';
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from 'react';
import { ActivityIndicator, View, Text } from 'react-native';

const Layout = () => {
    const { user, loading } = useAuth();
    const router = useRouter();
    const segments = useSegments();

    return (
        <Stack
            screenOptions={{
                headerStyle: { 
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                },
                headerBackground: () => (
                    <BlurView intensity={10} style={{ flex: 1, zIndex: 5 }} tint="default"/>
                ),
                headerTintColor: '#000000',
                headerTitleStyle: { fontFamily: 'HostGrotesk-ExtraBold', color: '#ffffff' },
                contentStyle: { backgroundColor: "#000000", },
                headerTransparent: true,
            }}
        >
            <Stack.Screen name ="addsong" options={{ 
                headerShown: false
            }}/>
        </Stack>
    );
};

export default Layout;