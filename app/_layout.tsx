import { BlurView } from 'expo-blur';
import { useFonts } from 'expo-font';
import { Stack } from "expo-router";

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
            <Stack.Screen name ="(tabs)" options={{ title: "song.rec"}}/>
        </Stack>
    );
};

export default Layout;