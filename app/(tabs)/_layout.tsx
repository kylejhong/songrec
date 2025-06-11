import { BlurView } from 'expo-blur';
import { Tabs } from "expo-router";

const RootLayout = () => {
  return <Tabs
    screenOptions={{
        tabBarStyle: { backgroundColor: 'rgba(0,0,0,0)', 
          position: 'absolute',
          elevation: 0,   // for Android
          shadowOffset: {
              width: 0, height: 0 // for iOS
          },
          borderTopColor: "rgba(0,0,0,0)", //Change Like This
          zIndex: 1,
          height: 'auto',
        },
        tabBarItemStyle: {
          margin: 4,
        },
        tabBarBackground: () => (
          <BlurView intensity={10} style={{ flex: 1, zIndex: 5 }} tint="default"/>
        ),
        headerTintColor: '#000',
        headerTitleStyle: { fontWeight: 'bold', },
        headerTransparent: true,
        tabBarLabelStyle: {
          fontFamily: "HostGrotesk-Regular",
          fontSize: 12,
        },
        tabBarInactiveTintColor: '#595959',
        tabBarActiveTintColor: '#ffffff',
    }}
  >
    <Tabs.Screen name="index" options={{ headerShown: false, title: 'feed' }} />
    <Tabs.Screen name="friends" options={{ headerShown: false, title: 'friends' }} />
    
  </Tabs>
}

export default RootLayout;