import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import BackgroundGradient from "../../components/BackgroundGradient";
import HeaderBottomBorder from "../../components/HeaderBottomBorder";
import useGlobalStyles from "../../components/useGlobalStyles";

const AuthScreen = () => {
    const GlobalStyles = useGlobalStyles();
    const { login, register } = useAuth();
    const [mode, setMode] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={[GlobalStyles.container, styles.centered]}>
                <HeaderBottomBorder />
                <BackgroundGradient />
                { mode ? (
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.headerText}>Login to</Text>
                        <Text style={styles.name}>song.rec</Text>
                    </View>
                ) : (
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.headerText}>Create a new</Text>
                        <Text style={styles.name}>song.rec</Text>
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
                
                { mode ? (
                    <TouchableOpacity style={styles.button} onPress={login(email, password)}>
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.button} onPress={register(email, password)}>
                        <Text style={styles.buttonText}>Register</Text>
                    </TouchableOpacity>
                ) }

                { mode ? (
                    <View style={[styles.headerTextContainer, styles.bottom]}>
                        <Text style={styles.p}>Don't have an account?</Text>
                        <TouchableOpacity onPress={() => setMode(!mode)}>
                            <Text style={styles.link}>Register Now</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                   <View style={[styles.headerTextContainer, styles.bottom]}>
                        <Text style={styles.p}>Already have an account?</Text>
                        <TouchableOpacity onPress={() => setMode(!mode)}>
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
    marginBottom: 16,
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