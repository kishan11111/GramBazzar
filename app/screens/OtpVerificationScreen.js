import { useEffect, useRef, useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import { apiService } from '../config/api';

export default function OtpVerificationScreen({ navigation, route }) {
  const { phone } = route.params;
  const [otp, setOtp] = useState(['', '', '', '']);
  const [countdown, setCountdown] = useState(30); // 120 seconds = 2 minutes
  const [canResend, setCanResend] = useState(false);
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];

  // Countdown timer effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleBackspace = (value, index) => {
    if (!value && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

const [loading, setLoading] = useState(false);

const handleVerifyOtp = async () => {
  const otpCode = otp.join('');

  if (otpCode.length !== 4) {
    alert('કૃપા કરીને 4 અંકનો OTP દાખલ કરો');
    return;
  }

  setLoading(true);

  try {
    // Step 1: Verify OTP
    const verifyResponse = await apiService.verifyOTP(phone, otpCode, 'REGISTER');

    if (!verifyResponse.success) {
      alert(verifyResponse.message || 'અયોગ્ય OTP. કૃપા કરીને ફરી પ્રયાસ કરો.');
      setOtp(['', '', '', '']);
      inputRefs[0].current.focus();
      setLoading(false);
      return;
    }

    // Step 2: OTP verified - Try to login (existing user check)
    // Use silentFail=true to avoid showing errors for new users
    const loginResponse = await apiService.loginUser(phone, 'Test@123', true);

    if (loginResponse.success) {
      // Existing user - login successful
      await AsyncStorage.setItem('authToken', loginResponse.data.accessToken);
      await AsyncStorage.setItem('userData', JSON.stringify(loginResponse.data.user));
      console.log('✅ Existing user logged in successfully');

      // Reset navigation stack to Dashboard (remove all previous screens)
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Dashboard' }],
        })
      );
    } else {
      // New user - needs to complete registration
      console.log('ℹ️ New user, navigating to registration');
      navigation.replace('UserDetails', {
        phone: phone,
        otp: otpCode
      });
    }

  } catch (error) {
    alert('કનેક્શન સમસ્યા. કૃપા કરીને ફરી પ્રયાસ કરો.');
    console.error('Verify OTP Error:', error);
  } finally {
    setLoading(false);
  }
};

  const handleResendOtp = async () => {
    try {
      const response = await apiService.sendOTP(phone, 'REGISTER');
      if (response.success) {
        alert('OTP ફરીથી મોકલ્યો!');
        setCountdown(30);// change by Dev
        setCanResend(false);
        setOtp(['', '', '', '']);
        inputRefs[0].current.focus();
      } else {
        alert('OTP મોકલવામાં સમસ્યા. કૃપા કરીને ફરી પ્રયાસ કરો.');
      }
    } catch (error) {
      console.error('Resend OTP Error:', error);
      alert('કનેક્શન સમસ્યા. કૃપા કરીને ફરી પ્રયાસ કરો.');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Icon */}
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>🔐</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>ઓટીપી દાખલ કરો</Text>
        <Text style={styles.phoneText}>
          +91{phone} નંબર પર મોકલેલ OTP દાખલ કરો
        </Text>

        {/* OTP Input Boxes */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={inputRefs[index]}
              style={[
                styles.otpInput,
                digit && styles.otpInputFilled,
              ]}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === 'Backspace') {
                  handleBackspace(digit, index);
                }
              }}
            />
          ))}
        </View>

        {/* Timer and Resend */}
        <View style={styles.resendContainer}>
          {canResend ? (
            <TouchableOpacity onPress={handleResendOtp}>
              <Text style={styles.resendText}>ઓટીપી કોડ ફરીથી મોકલો</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.timerText}>
              ઓટીપી કોડ ફરીથી મોકલો ({countdown} સેકંડ)
            </Text>
          )}
        </View>

        {/* Verify Button */}
       <TouchableOpacity
  style={[
    styles.button,
    (otp.join('').length !== 4 || loading) && styles.buttonDisabled,
  ]}
  onPress={handleVerifyOtp}
  activeOpacity={0.8}
  disabled={otp.join('').length !== 4 || loading}
>
  <Text style={styles.buttonText}>
    {loading ? 'તપાસી રહ્યા છીએ...' : 'તપાસો'}
  </Text>
</TouchableOpacity>

        {/* Support Info */}
        <View style={styles.supportBox}>
          <Text style={styles.supportIcon}>📞</Text>
          <Text style={styles.supportText}>
            મદદ જોઈએ છે? અમને કૉલ કરો{'\n'}
            <Text style={styles.supportNumber}>7621964168</Text>
          </Text>
        </View>

        {/* App Message */}
        <View style={styles.farmerBox}>
          <Text style={styles.farmerText}>
            🛒 સુરક્ષિત અને સરળ સ્થાનિક વેપાર{' '}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 28,
    color: '#2E7D32',
  },
  content: {
    flex: 1,
    paddingHorizontal: 25,
  },
  iconContainer: {
    alignSelf: 'center',
    width: 100,
    height: 100,
    backgroundColor: '#F1F8E9',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  icon: {
    fontSize: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 10,
    textAlign: 'center',
  },
  phoneText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  otpInput: {
    width: 70,
    height: 70,
    borderWidth: 2,
    borderColor: '#C8E6C9',
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    backgroundColor: '#FAFAFA',
  },
  otpInputFilled: {
    borderColor: '#4CAF50',
    backgroundColor: '#F1F8E9',
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  timerText: {
    fontSize: 14,
    color: '#999',
    fontWeight: '600',
  },
  resendText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginBottom: 25,
  },
  buttonDisabled: {
    backgroundColor: '#A5D6A7',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  supportBox: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  supportIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  supportText: {
    flex: 1,
    fontSize: 13,
    color: '#1565C0',
    lineHeight: 20,
  },
  supportNumber: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  farmerBox: {
    backgroundColor: '#FFF9C4',
    padding: 12,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#FBC02D',
  },
  farmerText: {
    fontSize: 13,
    color: '#F57F17',
    textAlign: 'center',
    fontWeight: '500',
  },
});