import { Keyboard, TouchableOpacity, Text, View, StyleSheet, useWindowDimensions, TextInput, TouchableWithoutFeedback, RefreshControl, ScrollView } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
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
  profile_picture_url: string,
  incoming_requests: string[],
  friends: string[],
  requested: boolean,
  friended: boolean,
}

function Search({ searchQuery, setSearchQuery, searchList, setSearchList, getSearch, refreshAll, refreshing, onRefresh, isKeyboardVisible }) {
  const GlobalStyles = useGlobalStyles();
  const { user } = useAuth();

  useEffect(() => {
    getSearch();
  }, [searchQuery]);

  return (
    <View style={[styles.screen, { flex: 1 }]}>
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
      
      <ScrollView
        contentContainerStyle={{ 
          flexGrow: 1,
          gap: 24,
          paddingHorizontal: 8,
        }}
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        scrollEnabled={!isKeyboardVisible}
        nestedScrollEnabled={true}
        alwaysBounceVertical={true}
        bounces={true}
      >
        {searchList && searchList.length > 0 ? (
          searchList.map((u: UserData) => (
            <FriendCard 
              state="search"
              key={u.id}
              id={u.id}
              username={u.username}
              image={u.profile_picture_url}
              onRequestSent={refreshAll}
              friended={u.friended}
              requested={u.requested}
            />
          ))
        ) : null}
      </ScrollView>
    </View>
  );
}

function Incoming({ incomingList, setIncomingList, getIncoming, refreshing, onRefresh, refreshAll }) {
  const GlobalStyles = useGlobalStyles();
  const { user } = useAuth();

  useEffect(() => {
    getIncoming();
  }, []);

  return (
    <ScrollView
      contentContainerStyle={{ 
        flexGrow: 1,
        paddingBottom: 1,
      }} // makes ScrollView fill the screen
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      scrollEnabled={true}
      nestedScrollEnabled={true}
      alwaysBounceVertical={true}
      bounces={true}
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
              onRequestSent={refreshAll}
            />
          ))
        ) : (
          <Text style={[GlobalStyles.text, {textAlign: "center"}]}>No incoming requests.</Text>
        )}
      </View>
    </ScrollView>
  );
}

function Outgoing({ outgoingList, setOutgoingList, getOutgoing, refreshing, onRefresh, refreshAll }) {
  const GlobalStyles = useGlobalStyles();
  const { user } = useAuth();

  useEffect(() => {
    getOutgoing();
  }, []);

  return (
    <ScrollView
      contentContainerStyle={{ 
        flexGrow: 1,
        paddingBottom: 1,
      }} // makes ScrollView fill the screen
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      scrollEnabled={true}
      nestedScrollEnabled={true}
      alwaysBounceVertical={true}
      bounces={true}
    >
      <View style={styles.screen}>
        {outgoingList && outgoingList.length > 0 ? (
          outgoingList.map((user: UserData) => (
            <FriendCard 
              state="outgoing"
              key={user.id}
              id={user.id}
              username={user.username}
              image={user.profile_picture_url}
              onRequestSent={refreshAll}
            />
          ))
        ) : (
          <Text style={[GlobalStyles.text, {textAlign: "center"}]}>No outgoing requests.</Text>
        )}
      </View>
    </ScrollView>
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

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener?.remove();
      keyboardDidShowListener?.remove();
    };
  }, []);

  useEffect(() => {
    getSearch();
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

      const response = await fetch(url);
      const data = await response.json();

      setIncomingList(prevList => [...data]);
    } catch (error) {
      console.log(error);
    }
  }

  const getOutgoing = async () => {
    try {
      const url = new URL(`${API_URL}/collect_outgoing`);
      url.searchParams.append('user_id', `${user.id}`);

      const response = await fetch(url);
      const data = await response.json();

      setOutgoingList(prevList => [...data]);
    } catch (error) {
      console.log(error);
    }
  }

  const refreshInOut = async () => {
    await getIncoming();
    await getOutgoing();
  }

  const refreshAll = async () => {
    setSearchQuery('');
    await getSearch();
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

      const newData = data.map((u: any) => ({
        ...u,
        requested: u.incoming_requests?.includes(user.id) ?? false,
        friended: u.friends?.includes(user.id) ?? false,
      }));

      console.log(url);

      setSearchList(newData);
    } catch (error) {
      console.log(error);
    }
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshAll();
    setRefreshing(false);
  }, []);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'search':
        return <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} searchList={searchList} setSearchList={setSearchList} getSearch={getSearch} refreshAll={refreshAll} refreshing={refreshing} onRefresh={onRefresh} isKeyboardVisible={isKeyboardVisible} />;
      case 'incoming':
        return <Incoming incomingList={incomingList} setIncomingList={setIncomingList} getIncoming={getIncoming} refreshing={refreshing} onRefresh={onRefresh} refreshAll={refreshAll} />;
      case 'outgoing':
        return <Outgoing outgoingList={outgoingList} setOutgoingList={setOutgoingList} getOutgoing={getOutgoing} refreshing={refreshing} onRefresh={onRefresh} refreshAll={refreshAll} />;
      default:
        return null;
    }
  };

  const mainContent = (
    <View style={GlobalStyles.container}>
      <BackgroundGradient />
        <TabView 
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          swipeEnabled={true}
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

  return (
    <>
      {isKeyboardVisible && (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>
      )}
      {mainContent}
    </>
  )
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
      paddingLeft: 12,
      flex: 1,
      fontSize: 14,
      color: '#fff',
      fontFamily: 'HostGrotesk-Regular',
    },
    inputWrapper: {
      borderColor: 'rgba(255,255,255,0.5)',
      borderWidth: 1,
      borderRadius: 8,
      paddingRight: 12,
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