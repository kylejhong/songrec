import { AuthProvider } from '@/contexts/AuthContext';
import { BlurView } from 'expo-blur';
import { useFonts } from 'expo-font';
import { Image } from 'expo-image';
import { Stack } from "expo-router";
import { StyleSheet, TouchableOpacity } from 'react-native';

const Layout = () => {
    const [fonts] = useFonts({
        'HostGrotesk-Light': require("../assets/fonts/HostGrotesk-Light.ttf"),
        'HostGrotesk-Regular': require("../assets/fonts/HostGrotesk-Regular.ttf"),
        'HostGrotesk-Medium': require("../assets/fonts/HostGrotesk-Medium.ttf"),
        'HostGrotesk-SemiBold': require("../assets/fonts/HostGrotesk-SemiBold.ttf"),
        'HostGrotesk-Bold': require("../assets/fonts/HostGrotesk-Bold.ttf"),
        'HostGrotesk-ExtraBold': require("../assets/fonts/HostGrotesk-ExtraBold.ttf"),
    })

    if (!fonts) return null;

    return (
        <AuthProvider>
            <Stack
                screenOptions={{
                    headerStyle: { 
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                    },
                    headerBackground: () => (
                        <BlurView intensity={10} style={{ flex: 1, zIndex: 5 }} tint="default"/>
                    ),
                    headerTintColor: '#ffffff',
                    headerTitleStyle: { fontFamily: 'HostGrotesk-ExtraBold', color: '#ffffff' },
                    contentStyle: { backgroundColor: "#ffffff", },
                    headerTransparent: true,
                }}
            >
                <Stack.Screen name ="(tabs)" options={{ 
                    title: "song.rec",
                    headerRight: () => (
                        <TouchableOpacity>
                            <Image
                                source={{ uri: "https://media.gettyimages.com/id/1165314753/photo/born-and-bred-in-the-city.jpg?s=612x612&w=gi&k=20&c=8jzaquMGVlGaiwivR_hfZY1Wg1qJvujl18alEcvXmuU=" }}
                                style={ styles.image }
                            />
                        </TouchableOpacity>
                    ),
                }}/>
                <Stack.Screen name ="auth" options={{ 
                    title: "song.rec", headerShown: false
                }}/>
            </Stack>
        </AuthProvider>
    );
};

const styles = StyleSheet.create({
    image: {
        width: 24,
        height: 24,
        borderRadius: 100,
    },
});

export default Layout;