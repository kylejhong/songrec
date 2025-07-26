import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState, useContext } from 'react';
import { Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import BackgroundGradient from "../../components/BackgroundGradient";
import HeaderBottomBorder from "../../components/HeaderBottomBorder";
import useGlobalStyles from "../../components/useGlobalStyles";
import { OnboardingContext } from '@/contexts/OnboardingContext';

const AuthScreen = () => {
    const GlobalStyles = useGlobalStyles();
    const { login, register } = useAuth();
    const { formData, setFormData } = useContext(OnboardingContext);
    const router = useRouter();
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [username, setUsername] = useState('');
    const [error, setError] = useState<String | null>(null);

    const handleAuth = async () => {
        if (!username.trim()) {
            setError('No username entered');
            return;
        }

        setError(null);
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={[GlobalStyles.container, styles.centered]}>
                <HeaderBottomBorder />
                <BackgroundGradient />
                <Text style={styles.name}>song.rec</Text>
                <View style={styles.headerTextContainer}>
                    <Text style={styles.headerText}>Let's kick things off, what's your username?</Text>
                </View>
                <View style={styles.form}>
                    <TextInput 
                        placeholder="Enter your username..." 
                        autoCapitalize="none" 
                        placeholderTextColor="rgba(255, 255, 255, 0.5)" 
                        style={styles.textInput}
                        value={username}
                        onChangeText={setUsername}
                    />
                </View>

                { error && 
                    <View style={styles.headerTextContainer}>
                        <Ionicons
                            name={'alert-circle-outline'}
                            size={18}
                            color={"rgb(223, 92, 114)"}
                        />
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                }
                
                <TouchableOpacity style={styles.button} onPress={handleAuth}>
                    <Text style={styles.buttonText}>Continue</Text>
                </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
  centered: {
    justifyContent: 'center',
    paddingBottom: 192,
    gap: 32,
  },
  headerText: {
    fontFamily: 'HostGrotesk-Regular',
    fontSize: 16,
    margin: 0,
    color: "#ffffff",
    textAlign: 'center',
  },
  name: {
    fontFamily: 'HostGrotesk-ExtraBold',
    fontSize: 20,
    margin: 0,
    color: "#ffffff",
    textAlign: 'center',
    position: 'absolute',
    top: 50,
  },
  p: {
    fontFamily: 'HostGrotesk-Regular',
    fontSize: 14,
    margin: 0,
    color: "#ffffff",
    textAlign: 'center',
  },
  errorText: {
    fontFamily: 'HostGrotesk-Regular',
    fontSize: 14,
    margin: 0,
    color: "rgb(223, 92, 114)",
    textAlign: 'center',
  },
  link: {
    fontFamily: 'HostGrotesk-SemiBold',
    fontSize: 14,
    margin: 0,
    color: "rgba(105, 197, 215, 1)",
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
    width: '100%',
  },
  bottom: {
    marginTop: 96,
  },
  textInput: {
    borderColor: 'white',
    borderWidth: 1,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    height: 56,
    width: '92%',
    borderRadius: 8,
    fontSize: 14,
    color: '#fff',
    fontFamily: 'HostGrotesk-Regular',
  },
  headerTextContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 6,
    marginBottom: 0,
  },
  button: {
    backgroundColor: 'white',
    display: 'flex',
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

export default AuthScreen;