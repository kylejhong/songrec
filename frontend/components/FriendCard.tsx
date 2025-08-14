import { useEffect, useState } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import useGlobalStyles from "./useGlobalStyles";
import { Image } from 'expo-image';

const FriendCard = (props: any) => {
    const GlobalStyles = useGlobalStyles();

    const [buttonText, setButtonText] = useState("");
    const [clicked, setClicked] = useState(false);

    useEffect(() => {
        switch (props.state) {
            case 'search':
                setButtonText("Add Friend");
        }
    }, [])

    const addFriend = () => {
        setButtonText("Pending");
        setClicked(true);
        //create a new request going from you to them, add this user to the outgoing list in react?
        setButtonText("Requested");
    }

    function Search() {
        return (
            <View style={ styles.card }>
                <Image
                    source={{ uri: props.image }}
                    style={ styles.image }
                />
                <Text style={[GlobalStyles.text, styles.text]}>
                    <Text style={styles.boldText}>{` ${props.username}`}</Text>
                </Text>
                <TouchableOpacity style={ clicked ? [styles.button, styles.buttonGray] : [styles.button, styles.buttonOrange] } onPress={addFriend}>
                    <Text style={ clicked ? [styles.buttonText, styles.white] : [styles.buttonText] }>{buttonText}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    function Incoming() {
        return (
            <View style={ styles.card }>
                <Image
                    source={{ uri: props.image }}
                    style={ styles.image }
                />
                <Text style={[GlobalStyles.text, styles.text]}>
                    <Text style={styles.boldText}>{`${props.username} `}</Text>
                    requested to follow you.</Text>
                <TouchableOpacity style={ [styles.button, styles.buttonOrange] }>
                    <Text style={ styles.buttonText }>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity style={ [styles.button, styles.buttonGray] }>
                    <Text style={ [styles.buttonText, styles.white] }>Reject</Text>
                </TouchableOpacity>
            </View>
        );
    }

    function Outgoing() {
        return (
            <View style={ styles.card }>
                <Image
                    source={{ uri: props.image }}
                    style={ styles.image }
                />
                <Text style={[GlobalStyles.text, styles.text]}>
                    <Text style={styles.boldText}>{` ${props.username}`}</Text>
                </Text>
                <TouchableOpacity style={ [styles.button, styles.buttonGray] }>
                    <Text style={ [styles.buttonText, styles.white] }>Requested</Text>
                </TouchableOpacity>
            </View>
        );
    }

    switch (props.state) {
        case 'search':
            return Search();
        case 'incoming':
            return Incoming();
        case 'outgoing':
            return Outgoing();
        default:
            return Incoming(); // or some default behavior
    }
}

const styles = StyleSheet.create({
    card: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: "100%",
        gap: 8,
    },
    text: {
        flexShrink: 1,
        flexGrow: 1,
        flexWrap: 'wrap',
        fontSize: 14,
    },
    boldText: {
        flexShrink: 1,
        flexWrap: 'wrap',
        fontFamily: 'HostGrotesk-Bold',
        fontSize: 14,
    },
    image: {
        height: 40,
        aspectRatio: 1,
        borderRadius: 100,
    },
    button: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 4,
    },
    buttonOrange: {
        backgroundColor: "#FFE58F",
    },
    buttonGray: {
        backgroundColor: "rgba(255,255,255,0.15)",
    },
    buttonText: {
        flexShrink: 0,
        color: 'black',
        fontFamily: 'HostGrotesk-Medium',
    },
    white: {
        color: 'white',
    }
})

export default FriendCard;