import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

const SmallNameCard = (props: any) => {
    return(
        <View style={styles.container}>
            <Image
                source={{ uri: props.image }}
                style={ styles.image }
            />
            <Text style={ styles.name }>{props.name}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 4,
        paddingBottom: 4,
        paddingLeft: 8,
        paddingRight: 8,
        margin: -8,
        borderColor: "rgba(255,255,255,0.2)",
        borderWidth: 1,
        borderRadius: 8,
        gap: 8,
    },
    name: {
        fontFamily: 'HostGrotesk-Light',
        fontSize: 14,
        margin: 0,
        color: "#ffffff",
        textAlign: 'center',
    },
    image: {
        width: 24,
        height: 24,
        borderRadius: 100,
    },
});

export default SmallNameCard;