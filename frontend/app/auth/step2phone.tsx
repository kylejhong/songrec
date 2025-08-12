import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useRef, useState, useContext } from 'react';
import { Alert, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View, KeyboardAvoidingView, Platform } from 'react-native';
import BackgroundGradient from "../../components/BackgroundGradient";
import HeaderBottomBorder from "../../components/HeaderBottomBorder";
import useGlobalStyles from "../../components/useGlobalStyles";
import { OnboardingContext } from '@/contexts/OnboardingContext';
import CountryPicker, { CountryCode } from 'react-native-country-picker-modal';
import { parsePhoneNumberFromString, CountryCode as LibCountryCode } from 'libphonenumber-js';

const Step2Phone = () => {
    const GlobalStyles = useGlobalStyles();
    const router = useRouter();
    const [error, setError] = useState<String | null>(null);
    const [countryCode, setCountryCode] = useState<CountryCode>('US');
    const [callingCode, setCallingCode] = useState('1');
    const [ subscriberNumber, setSubscriberNumber ] = useState('');
    const { phoneNumber, setPhoneNumber } = useContext(OnboardingContext);
    const countryPickerRef = useRef<any>(null);
    const [pickerVisible, setPickerVisible] = useState(false);
    const { signInPhone } = useAuth();
    const [confirm, setConfirm] = useState(null);
    const recaptchaVerifier = useRef(null);

    const submit = async () => {
        if (!subscriberNumber.trim()) {
            setError('No phone number entered');
            return;
        }

        const phoneNumberObj = parsePhoneNumberFromString(subscriberNumber, countryCode as LibCountryCode);
        const cleaned = subscriberNumber.replace(/[\s\-()]/g, '');

        if (!/^\d+$/.test(cleaned)) {
          setError('Phone number contains invalid characters.');
          return;
        }

        if (cleaned.length < 6 || cleaned.length > 15) {
            setError('Phone number seems too short or too long.');
            return;
        }

        if (!recaptchaVerifier.current) {
          console.error("Recaptcha verifier not ready");
          return;
        }

        const fullPhoneNumber = `+${callingCode}${cleaned}`;
        setPhoneNumber(fullPhoneNumber);
        console.log(fullPhoneNumber);
        setError(null);

        try {
            const confirmation = await signInPhone(fullPhoneNumber, recaptchaVerifier.current);
            setConfirm(confirmation);
        } catch (error: any) {
            Alert.alert('Error', error.message);
            return;
        }
    }

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={[GlobalStyles.container, styles.centered]}>
            <HeaderBottomBorder />
            <BackgroundGradient />

            <Text style={styles.name}>week.jam</Text>

            {!confirm ? (
              <>
                <View style={styles.headerTextContainer}>
                    <Text style={styles.headerText}>Great! Now, what's your phone number?</Text>
                </View>
                  
                <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // 'padding' for iOS, 'height' for Android
                keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0} // tweak this to shift higher/lower
                style={[styles.keyboardView]}
                >
                    <View style={styles.phoneContainer}>
                      <TouchableOpacity 
                        style={styles.countryRow}
                        onPress={() => setPickerVisible(true)}
                      >
                          <CountryPicker
                              visible={pickerVisible}
                              onClose={() => setPickerVisible(false)}
                              countryCode={countryCode}
                              withCallingCode
                              withFlag
                              withFilter
                              withEmoji
                              onSelect={(country) => {
                                  setCountryCode(country.cca2);
                                  setCallingCode(country.callingCode[0]);
                              }}
                          />
                          {callingCode && <Text style={styles.p}>+{callingCode}</Text>}
                          <Ionicons
                              name={'caret-down'}
                              size={18}
                              color={"rgb(255, 255, 255)"}
                          />
                      </TouchableOpacity>

                      <TextInput
                          style={[styles.countryRow, styles.phoneInput]}
                          keyboardType="phone-pad"
                          placeholder="Enter your phone number"
                          placeholderTextColor="#999"
                          value={subscriberNumber}
                          onChangeText={setSubscriberNumber}
                      />
                    </View>

                    <View style={styles.headerTextContainer}>
                      {error && 
                        <>
                          <Ionicons
                              name={'alert-circle-outline'}
                              size={18}
                              color={"rgb(223, 92, 114)"}
                          />

                          <Text style={styles.errorText}>{error}</Text>
                        </>
                      }
                    </View>
                    
                    <TouchableOpacity style={styles.button} onPress={submit}>
                        <Text style={styles.buttonText}>Continue</Text>
                    </TouchableOpacity>
                  </KeyboardAvoidingView>
              </>
              ) : (
                <>
                  <Text>
                    EOKROEKEOK
                  </Text>
                </>
              )
            }
            
          </View>
      </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
  keyboardView: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
    gap: 32,
  },
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
  countryRow: {
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
    backgroundColor: "rgba(119, 119, 119, 0.05)",
    borderWidth: 1,
    borderRadius: 8,
    gap: 8,
  },
  phoneContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 24,
  },
  phoneInput: {
    color: 'white',
    paddingLeft: 16,
    paddingRight: 16,
  }
});

export default Step2Phone;