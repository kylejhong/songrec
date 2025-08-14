import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState, useContext } from 'react';
import { Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View, KeyboardAvoidingView, Platform } from 'react-native';
import BackgroundGradient from "../../components/BackgroundGradient";
import HeaderBottomBorder from "../../components/HeaderBottomBorder";
import useGlobalStyles from "../../components/useGlobalStyles";
import { OnboardingContext } from '@/contexts/OnboardingContext';

const Username = () => {
    const GlobalStyles = useGlobalStyles();
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [error, setError] = useState<String | null>(null);

    const handleAuth = async () => {
        if (!username.trim()) {
            setError('Username is required');
            return;
        }

        router.replace({
          pathname: '/',
        });
    }

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={[GlobalStyles.container, styles.centered]}>
                <BackgroundGradient />
                
                <View style={[styles.headerTextContainer]}>
                  <Text>
                    <Text style={styles.headerText}>Choose a</Text>
                    <Text style={{ fontFamily: 'HostGrotesk-ExtraBold', fontSize: 16, fontWeight: 'bold', color: 'white'}}>
                        <Text style={{color: "#FFE58F"}}>{` username, `}</Text>
                    </Text>
                    <Text style={styles.headerText}>and upload a profile photo if you want!</Text>
                  </Text>
                </View>

                <View style={[styles.form, { marginBottom: 64 }]}>
                    <TextInput 
                        placeholder="Username" 
                        autoCapitalize="none" 
                        placeholderTextColor="rgba(255, 255, 255, 0.5)" 
                        style={styles.textInput}
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
    alignItems: 'center',
    gap: 32,
  },
  centerText: {
    width: '90%',
    textAlign: 'center',
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 25,
  },
  bold: {
    fontFamily: 'HostGrotesk-SemiBold',
    color: '#FFE58F',
    opacity: 0.9,
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
    width: '100%',
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
  button2: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 56,
    width: '92%',
    borderRadius: 8,
    borderColor: "rgba(255,255,255,1)",
    borderWidth: 1,
  },
  buttonText: {
    color: '#000',
    fontFamily: 'HostGrotesk-SemiBold',
    fontSize: 14,
  },
});

export default Username;