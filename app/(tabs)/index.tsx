import React, { useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from "react-native";
import BackgroundGradient from "../../components/BackgroundGradient";
import HeaderBottomBorder from "../../components/HeaderBottomBorder";
import SongCard from "../../components/SongCard";
import TabBarTopBorder from "../../components/TabBarTopBorder";
import useGlobalStyles from "../../components/useGlobalStyles";

const { width } = Dimensions.get('window');
const data = [
  {
    id: 'unique-id-1',  // add a unique id string here
    image: 'https://m.media-amazon.com/images/I/91BT8rF0inL.jpg',
    username: 'Connor',
    name: "Smokin' Out The Window",
    artist: 'Bruno Mars, Anderson .Paak, Silk Sonic'
  },
  {
    id: 'unique-id-5',  // add a unique id string here
    image: 'https://images.genius.com/b164f0023f5a934ffbbd29ac522e0c75.1000x1000x1.png',
    username: 'Kyle',
    name: "GODSTAINED",
    artist: 'Quadeca'
  },
  {
    id: 'unique-id-3',  // add a unique id string here
    image: 'https://i.scdn.co/image/ab67616d0000b273c718e0f746b0f671fd92421e',
    username: 'Dylan',
    name: "BELEZA PULA",
    artist: 'Masayoshi Takanaka'
  },
];

const Index = () => {
  const GlobalStyles = useGlobalStyles();
  const scrollX = useRef(new Animated.Value(0)).current;

  return (
    <View style={[GlobalStyles.container, styles.centered]}>
      <HeaderBottomBorder />
      <BackgroundGradient />
      <Animated.FlatList
        contentContainerStyle={styles.flatlist}
        data={data}
        keyExtractor={(item) => item.id}
        horizontal
        snapToInterval={width}
        snapToAlignment='center'
        snapToEnd={false}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.9, 1, 0.9],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
              <SongCard username={item.username} name={item.name} artist={item.artist} image={item.image} />
            </Animated.View>
          );
        }}
      />

      {/*<SongCard image='https://m.media-amazon.com/images/I/91BT8rF0inL.jpg' username='Connor' name="Smokin' Out The Window" artist="Bruno Mars, Anderson eoirme eion roim eiorn ionre nioreoin rniueo inre neoireno.Paakeeeeeeeeeeeee, Silk Sonic"/>*/}
      <TabBarTopBorder />
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    justifyContent: 'center',
  },
  card: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  flatlist: {
    display: 'flex',
  }
});

export default Index;