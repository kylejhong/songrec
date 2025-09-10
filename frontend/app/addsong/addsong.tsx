import { useAuth } from '@/contexts/AuthContext';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View, TextInput, Animated, Easing, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { Image } from 'expo-image';
import BackgroundGradient from "../../components/BackgroundGradient";
import HeaderBottomBorder from "../../components/HeaderBottomBorder";
import TabBarTopBorder from "../../components/TabBarTopBorder";
import useGlobalStyles from "../../components/useGlobalStyles";
import { BlurView } from 'expo-blur';
import { useHeaderHeight } from '@react-navigation/elements';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

type Song = {
  song_name: string;
  album_name: string;
  artist_name: string;
  cover_art_url: string;
  preview_url: string | null;
  spotify_song_id: string;
  deezer_song_id: number;
};

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

async function pasteFromClipboard(setSearchQuery) {
  const text = await Clipboard.getStringAsync();
  if (text) {
    setSearchQuery(text);
    Keyboard.dismiss();
  }
}

const AddSong = () => {
  const GlobalStyles = useGlobalStyles();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [song, setSong] = useState<Song | null>(null);
  const headerHeight = useHeaderHeight();

  const [searchQuery, setSearchQuery] = useState("");
  const [contentHeight, setContentHeight] = useState(0);

  const contentKey = `${song?.song_name}-${song?.artist_name}-${song?.album_name}`;
  const lastContentKey = useRef('');

    const handleContentLayout = (event) => {
        const { height } = event.nativeEvent.layout;
        if (height > 0 && height !== contentHeight && contentKey !== lastContentKey.current) {
            setContentHeight(height);
            lastContentKey.current = contentKey;
            console.log(contentKey);
        }
    };

  const getSong = async () => {
    try {
        setOpen(false);
        if (!searchQuery.includes("track") || !searchQuery.includes("spotify")) {
            setSong(null);
            return;
        }

        const url = new URL(`${API_URL}/get_song`);
        url.searchParams.append('song_url', `${searchQuery}`);

        console.log(url);

        const response = await fetch(url);
        const data = await response.json();

        setSong(data as Song);
        setOpen(true);
        Keyboard.dismiss();
    } catch (error) {
        console.log(error);
        setSong(null);
        setOpen(false);
    }
  }

  useEffect(() => {
    getSong();
  }, [searchQuery]);

  const heightAnim = useRef(new Animated.Value(0)).current;
  const marginAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const animatedHeight = heightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, Math.max(contentHeight, 360)], // Adjust this value based on your content height
  });

  const animatedMargin = marginAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 20], // Adjust this value based on your content height
  });

  useEffect(() => {
    if (open && contentHeight > 0) {
      // Animate to expanded state
      Animated.parallel([
        Animated.timing(heightAnim, {
          toValue: 1,
          duration: 700,
          easing: Easing.bezier(0, 0.5, 0.1, 1),
          useNativeDriver: false,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 700,
          easing: Easing.bezier(0, 0.5, 0.1, 1),
          useNativeDriver: false,
        }),
        Animated.timing(marginAnim, {
          toValue: 1,
          duration: 100,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      // Animate to collapsed state
      Animated.parallel([
        Animated.timing(heightAnim, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
        Animated.timing(marginAnim, {
          toValue: 0,
          duration: 100,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [open]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        
            <View style={[GlobalStyles.container, styles.centered, { marginTop: -headerHeight + 24 }]}>
                <BackgroundGradient />
                <Text style={[styles.h1, { marginBottom: -16 }]}>What's your 
                    <Text style={{color: "#FFE58F"}}> song of the week?</Text>
                </Text>
                <Text style={styles.h2}>Enter a song to view all your friends’ songs</Text>

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // 'padding' for iOS, 'height' for Android
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0} // tweak this to shift higher/lower
                    style={[styles.keyboard, { alignItems: 'center', gap: 24 }]}
                >
                    <AnimatedBlurView intensity={90} tint="dark" style={[styles.container, { paddingTop: animatedMargin }]} >
                        <View
                            style={{
                            position: 'absolute',
                            opacity: 0,
                            zIndex: -999,
                            }}
                            onLayout={handleContentLayout}
                        >
                            <View style={{ gap: 24 }}>
                            <Image 
                                source={{ uri: song?.cover_art_url }} 
                                style={styles.backgroundImage} 
                            />
                            <View style={{ gap: 4 }}>
                                <Text style={styles.cardTitle}>{song?.song_name}</Text>
                                <View style={{
                                flexDirection: 'row',
                                gap: 8,
                                flexWrap: 'wrap',
                                rowGap: 0,
                                }}>
                                <Text style={styles.p}>{song?.artist_name}</Text>
                                <Text style={styles.p}>|</Text>
                                <Text style={styles.p}>{song?.album_name}</Text>
                                </View>
                            </View>
                            </View>
                        </View>


                        
                        <Animated.View
                            style={[StyleSheet.absoluteFillObject, {
                                opacity: opacityAnim,
                                zIndex: -1,
                            }]}
                        >
                            <Image
                                source={{ uri: song?.cover_art_url }}
                                style={ styles.blurImage }
                            />
                            <Image
                                source={{ uri: song?.cover_art_url }}
                                style={ [styles.blurImage, { top: -20, left: -20, right: -20, bottom: -20, opacity: 0.1 }] }
                            />
                        </Animated.View>

                        <Animated.View
                            style={{
                                maxHeight: animatedHeight,
                                opacity: opacityAnim,
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 24,
                            }}
                        >
                            <Image
                                source={{ uri: song?.cover_art_url }}
                                style={ styles.backgroundImage }
                            />
                            <View style={{ display: 'flex', gap: 4 }}>
                                <Text style={styles.cardTitle}>{ song?.song_name }</Text>
                                <View style = {{ display: 'flex', flexDirection: 'row', gap: 8, flexWrap: 'wrap', rowGap: 0, }}>
                                    <Text style={styles.p}>{ song?.artist_name }</Text>
                                    <Text style={styles.p}>|</Text>
                                    <Text style={styles.p}>{ song?.album_name }</Text>
                                    {/*<Text style={styles.p}>|</Text>
                                    <Text style={styles.p}>Dec. 2015</Text>*/}
                                </View>
                            </View>
                        </Animated.View>
                    
                        
                        <View style={{ display: 'flex', flexDirection: 'row', width: '100%', gap: 16 }}>
                            <TextInput 
                                placeholder="Paste spotify link here..."
                                autoCapitalize="none" 
                                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                                style={styles.textInput}
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                            <TouchableOpacity style={styles.pasteButton} onPress={() => pasteFromClipboard(setSearchQuery)}>
                                <Ionicons
                                    name={'clipboard-outline'}
                                    size={20}
                                    color={'#000'}
                                />
                            </TouchableOpacity>
                        </View>
                    </AnimatedBlurView>

                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Continue</Text>
                        <Ionicons
                            name={'arrow-forward-outline'}
                            size={20}
                            color={'#000'}
                        />
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: 24,
    },
    keyboard: {
        width: '100%'
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        zIndex: -1,
        borderRadius: 8,
        overflow: 'hidden',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        width: '95%',
        padding: 20,
    },
    button: {
        backgroundColor: "#FFE58F",
        display: 'flex',
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'center',
        alignItems: 'center',
        height: 48,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    pasteButton: {
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
        borderRadius: 8,
        flexGrow: 0,
        flexShrink: 0,
    },
    buttonText: {
        color: '#000',
        fontFamily: 'HostGrotesk-SemiBold',
        fontSize: 14,
    },
    nameCard: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        rowGap: 4,
        width: "100%",
        lineHeight: 0,
    },
    cardTitle: {
        fontFamily: 'HostGrotesk-ExtraBold',
        fontSize: 24,
        color: "#ffffff",
        lineHeight: 24,
    },
    h1: {
        fontFamily: 'HostGrotesk-ExtraBold',
        fontSize: 16,
        margin: 0,
        marginTop: -4,
        color: "#ffffff",
        textAlign: 'center',
    },
    h2: {
        fontFamily: 'HostGrotesk-Medium',
        fontSize: 14,
        margin: 0,
        color: "#cccccc",
        textAlign: 'center',
    },
    p: {
        fontFamily: 'HostGrotesk-Light',
        fontSize: 14,
        margin: 0,
        color: "#ffffff",
        textAlign: 'center',
    },
    textInput: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderColor: 'rgba(255, 255, 255, 0.5)',
        borderWidth: 1,
        borderRadius: 8,
        fontSize: 14,
        color: '#fff',
        fontFamily: 'HostGrotesk-Regular',
        flexGrow: 1,
        flexShrink: 1,
    },
    blurImage: {
        position: 'absolute',
        left: 20,
        right: 20,
        top: 20,
        aspectRatio: 1,
        opacity: 1,
        borderRadius: 8,
        zIndex: -1,
    },
    backgroundImage: {
        width: '100%',
        aspectRatio: 1,
        opacity: 1,
        borderRadius: 8,
    },
});

export default AddSong;