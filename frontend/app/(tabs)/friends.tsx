import { TouchableOpacity, Text, View, StyleSheet, useWindowDimensions } from "react-native";
import BackgroundGradient from "../../components/BackgroundGradient";
import HeaderBottomBorder from "../../components/HeaderBottomBorder";
import TabBarTopBorder from "../../components/TabBarTopBorder";
import useGlobalStyles from "../../components/useGlobalStyles";
import FriendCard from "../../components/FriendCard";
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useState } from 'react';
 
const Friends = () => {
  const GlobalStyles = useGlobalStyles();
  const layout = useWindowDimensions();

  const scene = SceneMap({
    search: Search,
    incoming: Incoming,
    outgoing: Outgoing,
  });

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "search", title: "Search" },
    { key: "incoming", title: "Incoming" },
    { key: "outgoing", title: "Outgoing" },
  ]);

  function Search() {
    return (
      <View style={styles.screen}>
        <Text style={GlobalStyles.text}>Search for friends here</Text>
        <FriendCard/>
      </View>
    );
  }

  function Incoming() {
    return (
      <View style={styles.screen}>
        <Text style={GlobalStyles.text}>Incoming</Text>
      </View>
    );
  }

  function Outgoing() {
    return (
      <View style={styles.screen}>
        <Text style={GlobalStyles.text}>Outgoing</Text>
      </View>
    );
  }

  return (
    <View style={GlobalStyles.container}>
      <BackgroundGradient />
        <TabView 
          navigationState={{ index, routes }}
          renderScene={scene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          style={{ width: "100%", marginTop: 8 }}
          renderTabBar={(props) => (
          <TabBar
            {...props}
            style={{ 
              backgroundColor: "transparent", 
              height: 32, 
              marginHorizontal: 16, 
              marginBottom: 24,
              borderBottomColor: 'rgba(255,255,255,0.3)',
              borderBottomWidth: 1,
            }}
            indicatorStyle={{ backgroundColor: "white" }}
            position={props.position}
            jumpTo={props.jumpTo}
            renderTabBarItem={({ route, onPress }) => (
              <TouchableOpacity 
                onPress={onPress}
                style={{ 
                  width: (layout.width - 64)/3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  height: 32,
                }}
              >
                <Text style={{ color: "#fff", fontFamily: "HostGrotesk-Medium", textAlign: 'center', fontSize: 13 }}>{route.title}</Text>
              </TouchableOpacity>
            )}
          />
          )}
        />
      <TabBarTopBorder />
    </View>
  );
}

const styles = StyleSheet.create({
    screen: {
      marginHorizontal: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    },
})

export default Friends;