import { useAuth } from '@/contexts/AuthContext';
import React, { useRef } from 'react';
import { Animated, Dimensions, FlatList, StyleSheet, View, Text } from "react-native";
import BackgroundGradient from "../../components/BackgroundGradient";
import HeaderBottomBorder from "../../components/HeaderBottomBorder";
import SongCard from "../../components/SongCard";
import TabBarTopBorder from "../../components/TabBarTopBorder";
import useGlobalStyles from "../../components/useGlobalStyles";

const data = [
  {
    id: 'unique-id-1',  // add a unique id string here
    image: 'https://m.media-amazon.com/images/I/91BT8rF0inL.jpg',
    username: 'Connor',
    name: "Smokin' Out The Window",
    artist: 'Bruno Mars, Anderson .Paak, Silk Sonic'
  },
  {
    id: 'unique-id-2',  // add a unique id string here
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

const SCREEN_WIDTH = Dimensions.get('window').width;
const FLATLIST_WIDTH = SCREEN_WIDTH - 32;
const ITEM_WIDTH = SCREEN_WIDTH * 0.7;
const ITEM_SPACING = (SCREEN_WIDTH - ITEM_WIDTH) / 2;

const Index = () => {
  const { user } = useAuth();
  const uid = user?.uid;
  const GlobalStyles = useGlobalStyles();
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);
  const snapOffsets = data.map((_, index) => index * FLATLIST_WIDTH);

  const inputRange = data.map((_, index) => index * FLATLIST_WIDTH);
  const outputRangeOpacity = data.map((item) => (uid === item.id) ? (1) : (0));
  const index = outputRangeOpacity.indexOf(1);
  const outputRangeOffset = data.map((_, i) => (index - i) * 20);

  const yourSongOpacity = scrollX.interpolate({
    inputRange: inputRange,
    outputRange: outputRangeOpacity,
    extrapolate: 'clamp',
  })

  const yourSongOffset = scrollX.interpolate({
    inputRange: inputRange,
    outputRange: outputRangeOffset,
    extrapolate: 'clamp',
  })

  return (
    <View style={[GlobalStyles.container, styles.centered,]}>
      <BackgroundGradient />
      <Animated.Text style={[styles.text, styles.title, {opacity: yourSongOpacity, transform: [{ translateX: yourSongOffset }]}]}>
        -&gt; Your song this week &lt;-
      </Animated.Text>
      <Animated.FlatList
        contentContainerStyle={styles.flatlist}
        data={data}
        keyExtractor={(item) => item.id}
        horizontal
        snapToOffsets={snapOffsets}
        bounces={true}
        overScrollMode="never"
        snapToAlignment='center'
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 1) * FLATLIST_WIDTH,
            index * FLATLIST_WIDTH,
            (index + 1) * FLATLIST_WIDTH,
          ];

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.9, 1, 0.9],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
              <SongCard username={item.username} name={item.name} artist={item.artist} image={item.image} user={uid === item.id} />
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
    padding: 0,
  },
  title: {
    position: 'absolute',
    top: 120,
  },
  card: {
    width: FLATLIST_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  flatlist: {
    display: 'flex',
    margin: 16,
    paddingRight: 16,
  },
  text: {
      color: '#ffffff',
      fontFamily: 'HostGrotesk-Regular',
  },
});

export default Index;