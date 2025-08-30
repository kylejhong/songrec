import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import useGlobalStyles from "./useGlobalStyles";
import { Image } from 'expo-image';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const FriendCard = (props: any) => {
    const GlobalStyles = useGlobalStyles();
    const { user } = useAuth();
    const id = user?.id;

    const [buttonText, setButtonText] = useState("");
    const [clicked, setClicked] = useState(false);

    useEffect(() => {
        switch (props.state) {
            case 'search':
                if (props.friended) {
                    setButtonText("Added");
                    setClicked(true);
                } else if (props.requested) {
                    setButtonText("Requested");
                    setClicked(true);
                } else {
                    setButtonText("Add Friend");
                    setClicked(false);
                }
                break;
            case 'incoming':
                setButtonText("Accept");
                break;
            default:
                setButtonText("Add Friend");
                break;
        }
    }, [props.friended, props.requested])

    const confirmPopup = (title: string, subtitle: string, confirm) => {
        Alert.alert(
        title,
        subtitle,
        [
            {
            text: "Cancel",
            style: "cancel",
            },
            {
            text: "Yes",
            onPress: () => confirm(),
            },
        ],
        { cancelable: true }
        );
    };

    const sendRequest = async () => {
        try {
            //create a new request going from you to them, add this user to the outgoing list in react?
            setButtonText("Pending");
            setClicked(true);

            const url = new URL(`${API_URL}/friend_request`);
            url.searchParams.append('requester', `${id}`);
            url.searchParams.append('accepter', `${props.id}`);

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Server error: ${response.status} ${response.statusText}`);
            }

            props.onRequestSent();

            setButtonText("Requested");
        } catch (error) {
            setButtonText("Add Friend");
            setClicked(false);
            Alert.alert('Error', error.message);
        }
    }

    const acceptRequest = async () => {
        try {
            setButtonText("Pending");
            setClicked(true);

            const url = new URL(`${API_URL}/accept_request`);
            url.searchParams.append('accepter', `${id}`);
            url.searchParams.append('requester', `${props.id}`);

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Server error: ${response.status} ${response.statusText}`);
            }

            props.onRequestSent();
        } catch (error) {
            setButtonText("Accept");
            setClicked(false);
            Alert.alert('Error', error.message);
        }
    }

    const removeFriend = async () => {
        try {
            setButtonText("Pending");
            setClicked(true);

            const url = new URL(`${API_URL}/accept_request`);
            url.searchParams.append('user', `${id}`);
            url.searchParams.append('friend', `${props.id}`);

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Server error: ${response.status} ${response.statusText}`);
            }

            props.onRequestSent();
        } catch (error) {
            setButtonText("Accept");
            setClicked(false);
            Alert.alert('Error', error.message);
        }
    }

    const rejectRequest = async (rescind: boolean = false) => {
        try {
            const url = new URL(`${API_URL}/reject_request`);
            if (rescind) {
                url.searchParams.append('accepter', `${props.id}`);
                url.searchParams.append('requester', `${id}`);
            } else {
                url.searchParams.append('accepter', `${id}`);
                url.searchParams.append('requester', `${props.id}`);
            }

            console.log(url);

            const response = await fetch(url);

            console.log(response + "poobly");

            if (!response.ok) {
                throw new Error(`Server error: ${response.status} ${response.statusText}`);
            }

            props.onRequestSent();
        } catch (error) {
            setButtonText("Accept");
            setClicked(false);
            Alert.alert('Error', error.message);
        }
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
                <TouchableOpacity style={ clicked ? [styles.button, styles.buttonGray] : [styles.button, styles.buttonOrange] } onPress={ props.friended ?  () => {confirmPopup("Remove friend?", "", () => {removeFriend()})} : props.requested ? () => {confirmPopup("Cancel request?", "", () => {rejectRequest(true)})} : sendRequest }>
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
                <TouchableOpacity style={ clicked ? [styles.button, styles.buttonGray] : [styles.button, styles.buttonOrange] } onPress={acceptRequest}>
                    <Text style={ clicked ? [styles.buttonText, styles.white] : [styles.buttonText] }>{buttonText}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={ [styles.button, styles.buttonGray] } onPress={ () => {confirmPopup("Reject friend request?", "", () => {rejectRequest})} }>
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
                <TouchableOpacity style={ [styles.button, styles.buttonGray] } onPress={ () => {confirmPopup("Cancel Request?", "", () => {rejectRequest(true)})} }>
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