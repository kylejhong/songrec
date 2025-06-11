import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useHeaderHeight } from "@react-navigation/elements";
import { StyleSheet } from "react-native";

const useGlobalStyles = () => {
    const headerHeight = useHeaderHeight();
    const tabBarHeight = useBottomTabBarHeight();

    return StyleSheet.create({
        container: {
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#000000',
            paddingTop: headerHeight + 10,
            paddingBottom: tabBarHeight + 10,
            padding: 16,
            zIndex: -2,
        },
        text: {
            color: '#ffffff',
            fontFamily: 'HostGrotesk-Regular',
        },
    });
}

export default useGlobalStyles;