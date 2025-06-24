import { Text, View } from "react-native";
import BackgroundGradient from "../../components/BackgroundGradient";
import HeaderBottomBorder from "../../components/HeaderBottomBorder";
import TabBarTopBorder from "../../components/TabBarTopBorder";
import useGlobalStyles from "../../components/useGlobalStyles";

const Profile = () => {
  const GlobalStyles = useGlobalStyles();

  return (
    <View style={GlobalStyles.container}>
      <HeaderBottomBorder />
      <BackgroundGradient />
      <Text style={GlobalStyles.text}>Profile Page.</Text>
      <TabBarTopBorder />
    </View>
  );
}

export default Profile;