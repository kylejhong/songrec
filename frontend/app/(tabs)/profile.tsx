import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BackgroundGradient from "../../components/BackgroundGradient";
import HeaderBottomBorder from "../../components/HeaderBottomBorder";
import TabBarTopBorder from "../../components/TabBarTopBorder";
import useGlobalStyles from "../../components/useGlobalStyles";

const Profile = () => {
  const GlobalStyles = useGlobalStyles();
  const { logout } = useAuth();

  return (
    <View style={GlobalStyles.container}>
      <BackgroundGradient />

      <TouchableOpacity style={styles.button} onPress={logout}>
            <Ionicons
                name={'exit-outline'}
                size={24}
                color={'#000'}
            />
          <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
      <TabBarTopBorder />
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    alignItems: 'center',
    height: 56,
    width: '92%',
    borderRadius: 8,
  },
  buttonText: {
    color: '#000',
    fontFamily: 'HostGrotesk-SemiBold',
    fontSize: 14,
  },
});

export default Profile;