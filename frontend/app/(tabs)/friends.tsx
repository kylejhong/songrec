import { TouchableOpacity, Text, View, StyleSheet, useWindowDimensions, TextInput } from "react-native";
import BackgroundGradient from "../../components/BackgroundGradient";
import HeaderBottomBorder from "../../components/HeaderBottomBorder";
import TabBarTopBorder from "../../components/TabBarTopBorder";
import useGlobalStyles from "../../components/useGlobalStyles";
import FriendCard from "../../components/FriendCard";
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

type UserData = {
  id: number,
  username: string,
  profile_picture_url: boolean,
}

function Search({ searchQuery, setSearchQuery, userList, setUserList }) {
  const GlobalStyles = useGlobalStyles();

  useEffect(() => {
    const getData = async () => {
      try {
        const url = new URL(`${API_URL}/get_recommendations`);
        url.searchParams.append('user_id', '1');
        url.searchParams.append('current_hash', 'test');
        url.searchParams.append('input', searchQuery);

        const response = await fetch(url);
        const data = await response.json();

        console.log(url);
        console.log(data);

        setUserList(prevList => [...data]);
      } catch (error) {
        console.log(error);
      }
    }
    getData();
  }, [searchQuery]);

  return (
    <View style={styles.screen}>
      <View style={styles.inputWrapper}>
        <TextInput 
          placeholder="Search for a friend..." 
          autoCapitalize="none" 
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          style={styles.textInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Ionicons
          name={'search'}
          size={16}
          color='rgba(255,255,255,0.5)'
          style={styles.icon}
        />
      </View>
      
      <FriendCard state="search" username="Luca Palinka" image="https://media.gettyimages.com/id/1165314753/photo/born-and-bred-in-the-city.jpg?s=612x612&w=gi&k=20&c=8jzaquMGVlGaiwivR_hfZY1Wg1qJvujl18alEcvXmuU="/>
      {userList && userList.length > 0 ? (
        userList.map((user: UserData) => (
          <FriendCard 
            state="search"
            key={user.id}
            username={user.username}
            image={user.profile_picture_url}
          />
        ))
      ) : null}
    </View>
  );
}

function Incoming() {
  return (
    <View style={styles.screen}>
      <FriendCard state="incoming" username="Luca Palinka" image="https://media.gettyimages.com/id/1165314753/photo/born-and-bred-in-the-city.jpg?s=612x612&w=gi&k=20&c=8jzaquMGVlGaiwivR_hfZY1Wg1qJvujl18alEcvXmuU="/>
    </View>
  );
}

function Outgoing() {
  return (
    <View style={styles.screen}>
      <FriendCard state="outgoing" username="Luca Palinka" image="https://media.gettyimages.com/id/1165314753/photo/born-and-bred-in-the-city.jpg?s=612x612&w=gi&k=20&c=8jzaquMGVlGaiwivR_hfZY1Wg1qJvujl18alEcvXmuU="/>
    </View>
  );
}
 
const Friends = () => {
  const layout = useWindowDimensions();
  const GlobalStyles = useGlobalStyles();

  const [index, setIndex] = useState(0);
  const [userList, setUserList] = useState<UserData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'search':
        return <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} userList={userList} setUserList={setUserList} />;
      case 'incoming':
        return <Incoming />;
      case 'outgoing':
        return <Outgoing />;
      default:
        return null;
    }
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const url = new URL(`${API_URL}/get_recommendations`);
        url.searchParams.append('user_id', '1');
        url.searchParams.append('current_hash', 'test');
        url.searchParams.append('input', '');

        const response = await fetch(url);
        const data = await response.json();

        console.log(url);
        console.log(data);

        setUserList(prevList => [...data]);
      } catch (error) {
        console.log(error);
      }
    }
    getData();
  }, []);

  const [routes] = useState([
    { key: "search", title: "Search" },
    { key: "incoming", title: "Incoming" },
    { key: "outgoing", title: "Outgoing" },
  ]);

  return (
    <View style={GlobalStyles.container}>
      <BackgroundGradient />
        <TabView 
          navigationState={{ index, routes }}
          renderScene={renderScene}
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
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  gap: 8,
                  height: 32,
                }}
              >
                {route.title == "Search" ? (
                  <Ionicons
                    name={'search'}
                    size={16}
                    color="white"
                  />
                ) : (
                  route.title == "Incoming" ? (
                    <Ionicons
                      name={'archive-sharp'}
                      size={16}
                      color="white"
                    />
                  ) : (
                    <Ionicons
                      name={'paper-plane-sharp'}
                      size={16}
                      color="white"
                    />
                  )
                )}
                <Text style={{ color: "#fff", fontFamily: "HostGrotesk-Medium", textAlign: 'center', fontSize: 13 }}>{route.title}</Text>
              </TouchableOpacity>
            )}
          />
          )}
          lazy={false}
          removeClippedSubviews={false}
        />
      <TabBarTopBorder />
    </View>
  );
}

const styles = StyleSheet.create({
    screen: {
      marginHorizontal: 8,
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    },
    textInput: {
      paddingTop: 8,
      paddingBottom: 8,
      paddingLeft: 16,
      flex: 1,
      fontSize: 14,
      color: '#fff',
      fontFamily: 'HostGrotesk-Regular',
    },
    inputWrapper: {
      borderColor: 'rgba(255,255,255,0.5)',
      borderWidth: 1,
      borderRadius: 8,
      paddingRight: 16,
      gap: 16,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    icon: {
      flexGrow: 0,
    }
})

export default Friends;