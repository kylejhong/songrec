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
      <SongCard name="Smokin' Out The Window" artist="Bruno Mars, Anderson .Paak, Silk Sonic" image="https://m.media-amazon.com/images/I/91BT8rF0inL.jpg" />
      <TabBarTopBorder />
    </View>
  );
}

export default Index;