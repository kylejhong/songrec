import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { Alert, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import BackgroundGradient from "../../components/BackgroundGradient";
import HeaderBottomBorder from "../../components/HeaderBottomBorder";
import useGlobalStyles from "../../components/useGlobalStyles";

const AuthScreen = () => {
    const { login: loginState } = useLocalSearchParams();
    const loginStateBool = loginState === 'true';
    const GlobalStyles = useGlobalStyles();
    const { login, register } = useAuth();
    const router = useRouter();
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<String | null>(null);

    useEffect(() => {
        setIsLoggingIn(loginStateBool);
    }, [])

    const handleAuth = async () => {
        if (!email.trim() || !password.trim()) {
            setError('Email and password are required');
            return;
        }

        try {
            if (isLoggingIn) {
                const user = await login(email, password);
                if (user.email_confirmed_at) {
                    setError('Please confirm your email before logging in.');
                    return;
                }
                setError(null);
                router.replace('/');
            } else {
                const user = await register(email, password);

                if (user.email_confirmed_at) {
                    setError('User already registered.');
                    return;
                }
                
                router.replace('/auth/username');
            }
            
        } catch (error: any) {
            Alert.alert('Error', error.message);
            return;
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={[GlobalStyles.container, styles.centered]}>
                <BackgroundGradient />
                { isLoggingIn ? (
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.headerText}>Login to</Text>
                        <Text style={styles.name}>week.jam</Text>
                    </View>
                ) : (
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.headerText}>Create a new</Text>
                        <Text style={styles.name}>week.jam</Text>
                        <Text style={styles.headerText}>account</Text>
                    </View>
                ) }
                <View style={styles.form}>
                    <TextInput 
                        placeholder="Email" 
                        autoCapitalize="none" 
                        placeholderTextColor="rgba(255, 255, 255, 0.5)" 
                        style={styles.textInput}
                        value={email}
                        onChangeText={setEmail}
                    />
                    <TextInput 
                        placeholder="Password" 
                        autoCapitalize="none" 
                        secureTextEntry={true} 
                        placeholderTextColor="rgba(255,255,255,0.5)" 
                        style={styles.textInput}
                        value={password}
                        onChangeText={setPassword}
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
                
                { isLoggingIn ? (
                    <TouchableOpacity style={styles.button} onPress={handleAuth}>
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.button} onPress={handleAuth}>
                        <Text style={styles.buttonText}>Sign Up</Text>
                    </TouchableOpacity>
                ) }

                { isLoggingIn ? (
                    <View style={[styles.headerTextContainer, styles.bottom]}>
                        <Text style={styles.p}>Don't have an account?</Text>
                        <TouchableOpacity onPress={() => setIsLoggingIn(!isLoggingIn)}>
                            <Text style={styles.link}>Sign Up Now</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                   <View style={[styles.headerTextContainer, styles.bottom]}>
                        <Text style={styles.p}>Already have an account?</Text>
                        <TouchableOpacity onPress={() => setIsLoggingIn(!isLoggingIn)}>
                            <Text style={styles.link}>Login Now</Text>
                        </TouchableOpacity>
                    </View>
                ) }

            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
  centered: {
    justifyContent: 'center',
    gap: 42,
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
    fontSize: 16,
    margin: 0,
    color: "#ffffff",
    textAlign: 'center',
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