import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useHeaderHeight } from "@react-navigation/elements";
import { StyleSheet } from "react-native";

const useGlobalStyles = () => {
    const headerHeight = useHeaderHeight();
    let tabBarHeight = 0;
    try {
        tabBarHeight = useBottomTabBarHeight();
    } catch {
        // no tab bar present, fallback to 0
        tabBarHeight = 0;
    }

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#000000',
            paddingTop: headerHeight + 10,
            paddingBottom: tabBarHeight + 10,
            padding: 16,
            zIndex: -2,
            overflow: 'visible',
        },
        text: {
            color: '#ffffff',
            fontFamily: 'HostGrotesk-Regular',
        },
    });

    return styles;
}

export default useGlobalStyles;