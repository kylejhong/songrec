import { Tabs } from "expo-router";

const RootLayout = () => {
  return <Tabs
    screenOptions={{
        headerStyle: { backgroundColor: 'rgba(0,0,0,0)', },
        headerTintColor: '#000',
        headerTitleStyle: { fontWeight: 'bold', },
        headerTransparent: true,
    }}
  >
    <Tabs.Screen name="index" options={{ headerShown: false }} />
    <Tabs.Screen name="friends" options={{ headerShown: false }} />
  </Tabs>
}

export default RootLayout;