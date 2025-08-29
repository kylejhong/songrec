import { Keyboard, TouchableOpacity, Text, View, StyleSheet, useWindowDimensions, TextInput, TouchableWithoutFeedback, RefreshControl, ScrollView } from "react-native";
import BackgroundGradient from "../../components/BackgroundGradient";
import HeaderBottomBorder from "../../components/HeaderBottomBorder";
import TabBarTopBorder from "../../components/TabBarTopBorder";
import useGlobalStyles from "../../components/useGlobalStyles";
import FriendCard from "../../components/FriendCard";
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useState, useEffect, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

type UserData = {
  id: number,
  username: string,
  profile_picture_url: boolean,
}

function Search({ searchQuery, setSearchQuery, searchList, setSearchList, getSearch, refreshInOut }) {
  const GlobalStyles = useGlobalStyles();
  const { user } = useAuth();

  useEffect(() => {
    getSearch();
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
      
      {searchList && searchList.length > 0 ? (
        searchList.map((user: UserData) => (
          <FriendCard 
            state="search"
            key={user.id}
            id={user.id}
            username={user.username}
            image={user.profile_picture_url}
            onRequestSent={refreshInOut}
          />
        ))
      ) : null}
    </View>
  );
}

function Incoming({ incomingList, setIncomingList, getIncoming, refreshInOut, refreshing, onRefresh }) {
  const GlobalStyles = useGlobalStyles();
  const { user } = useAuth();

  useEffect(() => {
    getIncoming();
  }, []);

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }} // makes ScrollView fill the screen
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      scrollEnabled={true}
    >
      <View style={styles.screen}>
        {incomingList && incomingList.length > 0 ? (
          incomingList.map((user: UserData) => (
            <FriendCard 
              state="incoming"
              key={user.id}
              id={user.id}
              username={user.username}
              image={user.profile_picture_url}
              onRequestSent={refreshInOut}
            />
          ))
        ) : (
          <Text style={[GlobalStyles.text, {textAlign: "center"}]}>No incoming requests.</Text>
        )}
      </View>
    </ScrollView>
    
  );
}

function Outgoing({ outgoingList, setOutgoingList, getOutgoing }) {
  const GlobalStyles = useGlobalStyles();
  const { user } = useAuth();

  useEffect(() => {
    getOutgoing();
  }, []);

  return (
    <View style={styles.screen}>
      {outgoingList && outgoingList.length > 0 ? (
        outgoingList.map((user: UserData) => (
          <FriendCard 
            state="outgoing"
            key={user.id}
            id={user.id}
            username={user.username}
            image={user.profile_picture_url}
          />
        ))
      ) : (
        <Text style={[GlobalStyles.text, {textAlign: "center"}]}>No outgoing requests.</Text>
      )}
    </View>
  );
}
 
const Friends = () => {
  const layout = useWindowDimensions();
  const GlobalStyles = useGlobalStyles();
  const { user } = useAuth();

  const [index, setIndex] = useState(0);
  const [searchList, setSearchList] = useState<UserData[]>([]);
  const [incomingList, setIncomingList] = useState<UserData[]>([]);
  const [outgoingList, setOutgoingList] = useState<UserData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

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

        setSearchList(prevList => [...data]);
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

  const getIncoming = async () => {
    try {
      const url = new URL(`${API_URL}/collect_incoming`);
      url.searchParams.append('user_id', `${user.id}`);

      console.log(url);

      const response = await fetch(url);
      const data = await response.json();
      
      console.log(data);

      setIncomingList(prevList => [...data]);
    } catch (error) {
      console.log(error);
    }
  }

  const getOutgoing = async () => {
    try {
      const url = new URL(`${API_URL}/collect_outgoing`);
      url.searchParams.append('user_id', `${user.id}`);

      console.log(url);

      const response = await fetch(url);
      const data = await response.json();
      
      console.log(data);

      setOutgoingList(prevList => [...data]);
    } catch (error) {
      console.log(error);
    }
  }

  const refreshInOut = async () => {
    await getIncoming();
    await getOutgoing();
  }

  const getSearch = async () => {
    try {
      const url = new URL(`${API_URL}/get_recommendations`);
      url.searchParams.append('user_id', `${user.id}`);
      url.searchParams.append('current_hash', 'test');
      url.searchParams.append('input', searchQuery);

      const response = await fetch(url);
      const data = await response.json();

      console.log(url);
      console.log(data);

      setSearchList(prevList => [...data]);
    } catch (error) {
      console.log(error);
    }
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshInOut();  // your function to reload incoming/outgoing
    setRefreshing(false);
  }, []);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'search':
        return <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} searchList={searchList} setSearchList={setSearchList} getSearch={getSearch} refreshInOut={refreshInOut} />;
      case 'incoming':
        return <Incoming incomingList={incomingList} setIncomingList={setIncomingList} getIncoming={getIncoming} refreshInOut={refreshInOut} refreshing={refreshing} onRefresh={onRefresh} />;
      case 'outgoing':
        return <Outgoing outgoingList={outgoingList} setOutgoingList={setOutgoingList} getOutgoing={getOutgoing} />;
      default:
        return null;
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={GlobalStyles.container}>
        <BackgroundGradient />
          <TabView 
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
            swipeEnabled={false}
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
    </TouchableWithoutFeedback>
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