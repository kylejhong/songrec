import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

interface MyComponentProps {
  name: string;
  artist: string;
  image: string;
}

const SongCard = (props: MyComponentProps) => {
    return (
        <View style={styles.full}>
            <Text style={styles.p}>This week, ___ listened to</Text>
            <BlurView style={styles.container} intensity={40} tint='dark'>
                <Image
                    source={{ uri: props.image }}
                    style={ styles.backgroundImage }
                />
                <Text style={styles.h1}>{props.name}</Text>
                <Text style={styles.h2}>{props.artist}</Text>
                <View style={styles.imageGroup}>
                    <Image 
                        source={ require('../assets/images/record.png') }
                        style={styles.disc}
                    />
                    <LinearGradient
                        colors={['rgba(255, 255, 255, 0)', 'rgba(0, 0, 0, 0.3)']}
                        style={styles.disc}
                    />
                    <Image
                        source={{ uri: props.image }}
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
        flexDirection: 'column',
        boxShadow: '5px black inset',
        borderColor: "rgba(255,255,255,0.3)",
        borderWidth: 1,
        backgroundColor: "rgba(0, 0, 0, 1)",
        width: '100%',
        borderRadius: 8,
        overflow: 'hidden',
        padding: 16,
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
        opacity: 0.3,
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
        marginBottom: 16,
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
        right: 31.25,
        borderRadius: 100,
    },
    image: {
        width: 125,
        height: 125,
        zIndex: 1,
    },
    imageGroup: {
        width: 125,
        height: 125,
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingLeft: 31.25,
    },
});

export default SongCard;