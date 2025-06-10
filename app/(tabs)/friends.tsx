import { Text, View } from "react-native";
import HeaderBottomBorder from "../../components/HeaderBottomBorder";
import useGlobalStyles from "../../components/useGlobalStyles";

const Friends = () => {
  const GlobalStyles = useGlobalStyles();

  return (
    <View style={GlobalStyles.container}>
      <HeaderBottomBorder />
      <Text style={GlobalStyles.text}>Friends Page.</Text>
    </View>
  );
}

export default Friends;