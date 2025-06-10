import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';

const BackgroundGradient = () => {
    return (
        <LinearGradient
            // Background Linear Gradient
            colors={['rgba(125, 67, 67, 0.8)', 'transparent']}
            style={ styles.background }
        />
    )
}

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});

export default BackgroundGradient;