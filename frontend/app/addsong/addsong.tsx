import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View, TextInput, Animated, Easing } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { Image } from 'expo-image';
import BackgroundGradient from "../../components/BackgroundGradient";
import HeaderBottomBorder from "../../components/HeaderBottomBorder";
import TabBarTopBorder from "../../components/TabBarTopBorder";
import useGlobalStyles from "../../components/useGlobalStyles";
import { BlurView } from 'expo-blur';
import { useHeaderHeight } from '@react-navigation/elements';

const AddSong = () => {
  const GlobalStyles = useGlobalStyles();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const headerHeight = useHeaderHeight();
  const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

  const heightAnim = useRef(new Animated.Value(0)).current;
  const marginAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const animatedHeight = heightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 360], // Adjust this value based on your content height
  });

  const animatedMargin = marginAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 20], // Adjust this value based on your content height
  });

  useEffect(() => {
    if (open) {
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
    <View style={[GlobalStyles.container, styles.centered, { marginTop: -headerHeight + 24 }]}>
        <BackgroundGradient />
        <Text style={[styles.h1, { marginBottom: -16 }]}>What's your 
            <Text style={{color: "#FFE58F"}}> song of the week?</Text>
        </Text>
        <Text style={styles.h2}>Enter a song to view all your friends’ songs</Text>

        <AnimatedBlurView intensity={90} tint="dark" style={[styles.container, { paddingTop: animatedMargin }]} >
            <Animated.View
                style={[StyleSheet.absoluteFillObject, {
                    opacity: opacityAnim,
                    zIndex: -1,
                }]}
            >
                <Image
                    source={{ uri: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Luv%28Sic%29_Hexalogy.jpg' }}
                    style={ styles.blurImage }
                />
                <Image
                    source={{ uri: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Luv%28Sic%29_Hexalogy.jpg' }}
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
                    source={{ uri: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Luv%28Sic%29_Hexalogy.jpg' }}
                    style={ styles.backgroundImage }
                />
                <View style={{ display: 'flex', gap: 4 }}>
                    <Text style={styles.cardTitle}>Luv (sic)</Text>
                    <View style = {{ display: 'flex', flexDirection: 'row', gap: 8, flexWrap: 'wrap', rowGap: 0, }}>
                        <Text style={styles.p}>Nujabes</Text>
                        <Text style={styles.p}>|</Text>
                        <Text style={styles.p}>Luv (sic) Hexalogy</Text>
                        <Text style={styles.p}>|</Text>
                        <Text style={styles.p}>Dec. 2015</Text>
                    </View>
                </View>
            </Animated.View>
        
            
            <View style={{ display: 'flex', flexDirection: 'row', width: '100%', gap: 16 }}>
                <TextInput 
                    placeholder="Paste spotify link here..."
                    autoCapitalize="none" 
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    style={styles.textInput}
                />
                <TouchableOpacity style={styles.pasteButton} onPress={() => setOpen(!open)}>
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
    </View>
  );
}

const styles = StyleSheet.create({
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: 24,
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
        flexShrink: 1,
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