import { View } from "react-native";
import BackgroundGradient from "../../components/BackgroundGradient";
import HeaderBottomBorder from "../../components/HeaderBottomBorder";
import SongCard from "../../components/SongCard";
import TabBarTopBorder from "../../components/TabBarTopBorder";
import useGlobalStyles from "../../components/useGlobalStyles";

const Index = () => {
  const GlobalStyles = useGlobalStyles();

  return (
    <View style={GlobalStyles.container}>
      <HeaderBottomBorder />
      <BackgroundGradient />
      <SongCard />
      <TabBarTopBorder />
    </View>
  );
}

export default Index;