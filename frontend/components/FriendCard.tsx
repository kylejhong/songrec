import { useEffect, useState } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import useGlobalStyles from "./useGlobalStyles";
import { Image } from 'expo-image';

const FriendCard = (props: any) => {
    const GlobalStyles = useGlobalStyles();
    

    return (
        <View style={ styles.card }>
            <Image
                source={{ uri: props.image }}
                style={ styles.image }
            />
            <Text style={[GlobalStyles.text, styles.text]}>
                <Text style={styles.boldText}>{`${props.username} `}</Text>
                requested to follow you.</Text>
            <View style={styles.buttonHolder}>
                <TouchableOpacity style={ [styles.button, styles.buttonOrange] }>
                    <Text style={ styles.buttonText }>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity style={ [styles.button, styles.buttonGray] }>
                    <Text style={ [styles.buttonText, styles.white] }>Reject</Text>
                </TouchableOpacity>
            </View>
            
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: "100%",
        margin: 8,
        gap: 16,
    },
    text: {
        flexShrink: 1,
        flexWrap: 'wrap',
    },
    boldText: {
        flexShrink: 1,
        flexWrap: 'wrap',
        fontFamily: 'HostGrotesk-Bold',
    },
    image: {
        height: 48,
        aspectRatio: 1,
        borderRadius: 100,
    },
    buttonHolder: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    button: {
        flexShrink: 0,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    buttonOrange: {
        backgroundColor: "#ffb13dff",
    },
    buttonGray: {
        backgroundColor: "rgba(255,255,255,0.15)",
    },
    buttonText: {
        color: 'black',
        fontFamily: 'HostGrotesk-SemiBold',
    },
    white: {
        color: 'white',
    }
})

export default FriendCard;