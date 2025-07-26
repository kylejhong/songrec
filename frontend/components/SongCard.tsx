import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import SmallNameCard from './SmallNameCard';

const SongCard = (props : any) => {
    return (
        <View style={[styles.full, props.user && styles.glow]}>
            <View style={styles.nameCard}>
                <Text style={styles.p}>This week,</Text>
                <SmallNameCard name={props.username} image="https://media.gettyimages.com/id/1165314753/photo/born-and-bred-in-the-city.jpg?s=612x612&w=gi&k=20&c=8jzaquMGVlGaiwivR_hfZY1Wg1qJvujl18alEcvXmuU="/>
                <Text style={styles.p}>listened to...</Text>
            </View>
            
            <Image
                source={{ uri: props.image }}
                style={ styles.blurImage }
            />
            <Image
                source={{ uri: props.image }}
                style={ [styles.blurImage, { top: -20, left: -20, right: -20, bottom: -20, opacity: 0.1 }] }
            />
            <View style={styles.blur}>
                <BlurView intensity={90} tint="dark" style={StyleSheet.absoluteFill}/>
            </View>
            <View style={styles.container}>
                <Image
                    source={{ uri: props.image }}
                    style={ styles.backgroundImage }
                />
            </View>
            <View style={styles.title}>
                <Text style={styles.h1}>{props.name}</Text>
                <Text style={styles.h2}>{props.artist}</Text>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button}>
                    <Ionicons name="link" size={20} color="black" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <Ionicons name="play" size={20} color="black" />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    full: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: "70%",
        margin: 8,
        gap: 16,
    },
    glow: {
        shadowColor: 'rgba(255, 232, 164, 0.4)',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 20,
        elevation: 10,
    },
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        borderColor: "rgba(255,255,255,0.5)",
        borderWidth: 1,
        backgroundColor: "rgb(47, 52, 58)",
        width: '90%',
        aspectRatio: 1,
        borderRadius: 8,
        marginVertical: 16,
        gap: 8,
    },
    title: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
    },
    backgroundImage: {
        position: 'absolute',
        left: -1,
        right: -1,
        top: -1,
        bottom: -1,
        opacity: 1,
        borderRadius: 8,
    },
    h1: {
        fontFamily: 'HostGrotesk-ExtraBold',
        fontSize: 20,
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
    buttonContainer: {
        display: 'flex',
        flexDirection: 'row',
        gap: 16,
    },
    button: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        paddingTop: 8,
        paddingBottom: 8,
        paddingRight: 8,
        paddingLeft: 8,
        borderRadius: 100,
    },
    buttonText: {
        fontFamily: 'HostGrotesk-Bold',
        fontSize: 14,
        margin: 0,
        color: "#000000",
        textAlign: 'center',
    },
    blur: {
        position: 'absolute',
        top: -32,
        bottom: -32,
        left: -32,
        right: -32,
        zIndex: -1,
        borderRadius: 8,
        overflow: 'hidden',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
    },
    blurImage: {
        position: 'absolute',
        left: -4,
        right: -4,
        top: 36,
        aspectRatio: 1,
        opacity: 1,
        borderRadius: 8,
        zIndex: -1,
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
});

export default SongCard;