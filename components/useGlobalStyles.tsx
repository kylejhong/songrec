import { useHeaderHeight } from "@react-navigation/elements";
import { StyleSheet } from "react-native";

const useGlobalStyles = () => {
    const headerHeight = useHeaderHeight();

    return StyleSheet.create({
        container: {
            flex: 1,
            alignItems: 'center',
            backgroundColor: '#000000',
            paddingTop: headerHeight + 10,
            padding: 16,
        },
        text: {
            color: '#ffffff',
        },
    });
}

export default useGlobalStyles;