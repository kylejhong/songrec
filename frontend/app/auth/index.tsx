import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState, useContext } from 'react';
import { Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View, KeyboardAvoidingView, Platform } from 'react-native';
import BackgroundGradient from "../../components/BackgroundGradient";
import HeaderBottomBorder from "../../components/HeaderBottomBorder";
import useGlobalStyles from "../../components/useGlobalStyles";
import { OnboardingContext } from '@/contexts/OnboardingContext';

const Welcome = () => {
    const GlobalStyles = useGlobalStyles();
    const router = useRouter();

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={[GlobalStyles.container, styles.centered]}>
                <HeaderBottomBorder />
                <BackgroundGradient />
                
                <View style={styles.headerTextContainer}>
                    <Text style={styles.headerText}>Welcome to</Text>
                    <Text style={{ fontFamily: 'HostGrotesk-ExtraBold', fontSize: 16, fontWeight: 'bold', color: 'white'}}>
                        week
                        <Text style={{color: "#FFE58F"}}>.jam</Text>
                    </Text>
                </View>

                
                <Text style={[GlobalStyles.text, styles.centerText, { marginBottom: 50 }]}>
                  {//The <Text style={styles.underline}>simplest</Text>, <Text style={styles.underline}>lowest-commitment</Text> way to share music with your friends <Text style={styles.bold}>every week</Text>.
                  }
                  Start your week with a brand-new playlist of music curated by your <Text style={styles.bold}>best friends</Text>.
                </Text>

                <View style={styles.form}>
                  <TouchableOpacity style={styles.button} onPress={() => {
                    router.push({
                      pathname: '/auth/login',
                      params: { login: 'true' },
                    });
                  }}>
                      <Text style={styles.buttonText}>Login</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.button2} onPress={() => {
                    router.push({
                      pathname: '/auth/login',
                      params: { login: 'false' },
                    });
                  }}>
                      <Text style={[styles.buttonText, { color: 'white' }]}>Sign Up</Text>
                  </TouchableOpacity>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
  centered: {
    justifyContent: 'center',
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

export default Welcome;