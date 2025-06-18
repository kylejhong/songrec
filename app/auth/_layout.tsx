import { useAuth } from '@/contexts/AuthContext';
import { BlurView } from 'expo-blur';
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

const Layout = () => {
    const { user, loading } = useAuth();
    const router = useRouter();
    const segments = useSegments();

    useEffect(() => {
        const inAuth = segments[0] === 'auth';

        if (!loading) {
            if (user && inAuth) {
                //router.replace('/');
            }
        }
    }, [user, loading, segments]);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size='large' color='#007bff' />
            </View>
        )
    }

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
            <Stack.Screen name ="index" options={{ 
                headerShown: false
            }}/>
        </Stack>
    );
};

export default Layout;