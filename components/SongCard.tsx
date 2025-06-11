import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

const SongCard = () => {
    return (
        <View style={styles.full}>
            <Text style={styles.p}>This week, ___ listened to</Text>
            <BlurView style={styles.container} intensity={40} tint='dark'>
                <Image
                    source={{ uri: 'https://m.media-amazon.com/images/I/91BT8rF0inL.jpg' }}
                    style={ styles.backgroundImage }
                />
                <View style={styles.left}>
                    <Text style={styles.h1}>Smokin' Out The Window</Text>
                    <Text style={styles.h2}>Bruno Mars, Anderson .Paak, Silk Sonic</Text>
                </View>
                <View style={styles.right}>
                    <Image 
                        source={ require('../assets/images/record.png') }
                        style={styles.disc}
                    />
                    <LinearGradient
                        colors={['rgba(255, 255, 255, 0)', 'rgba(0, 0, 0, 0.3)']}
                        style={styles.disc}
                    />
                    <Image
                        source={{ uri: 'https://m.media-amazon.com/images/I/91BT8rF0inL.jpg' }}
                        style={ styles.image }
                    />
                </View>
            </BlurView>
        </View>
    )
}

const styles = StyleSheet.create({
    full: {
        width: "95%",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: 8,
        gap: 16,
    },
    container: {
        display: 'flex',
        flexDirection: 'row',
        borderColor: "rgba(255,255,255,0.3)",
        borderWidth: 1,
        backgroundColor: "rgb(47, 52, 58)",
        width: '100%',
        borderRadius: 8,
        overflow: 'hidden',
        padding: 16,
        gap: 8,
    },
    left: {
        flexShrink: 1,
    },
    right: {
        flexShrink: 0,
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    backgroundImage: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        zIndex: -1,
        opacity: 0.5,
        borderRadius: 8,
    },
    h1: {
        fontFamily: 'HostGrotesk-ExtraBold',
        fontSize: 20,
        margin: 0,
        marginTop: -4,
        color: "#ffffff",
    },
    h2: {
        fontFamily: 'HostGrotesk-SemiBold',
        fontSize: 14,
        margin: 0,
        color: "#cccccc",
    },
    p: {
        fontFamily: 'HostGrotesk-Regular',
        fontSize: 14,
        margin: 0,
        color: "#ffffff",
    },
    disc: {
        width: 125,
        height: 125,
        position: 'absolute',
        right: 62.5,
        borderRadius: 100,
    },
    image: {
        width: 125,
        height: 125,
        zIndex: 1,
        marginLeft: 62.5,
    }
});

export default SongCard;