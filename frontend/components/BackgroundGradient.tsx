import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';

const BackgroundGradient = () => {
    return (
        <>
            <Image
                source={ require('../assets/images/app-gradient.png') }
                style={ styles.image }
            />
            <LinearGradient
                colors={['rgba(82, 108, 97, 0)', 'transparent']}
                style={ styles.background }
            />
        </>
    )
}



const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: -1,
    opacity: 1,
  },
  image: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: -1,
    opacity: 1,
  },
});

export default BackgroundGradient;