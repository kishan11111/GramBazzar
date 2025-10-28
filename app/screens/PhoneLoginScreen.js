import { useState } from 'react';
import {
    Image,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { apiService } from '../config/api';

export default function PhoneLoginScreen({ navigation }) {
  const [phoneNumber, setPhoneNumber] = useState('');

//   const handleSendOTP = () => {
//     // Validation
//     if (phoneNumber.length !== 10) {
//       alert('કૃપા કરીને 10 અંકનો મોબાઇલ નંબર નાખો');
//       return;
//     }

//     // Navigate to OTP screen (backend will be added later)
//     navigation.navigate('OtpVerification', { phone: phoneNumber });
//   };
const [loading, setLoading] = useState(false);

const handleSendOTP = async () => {
  // Validation
  if (phoneNumber.length !== 10) {
    alert('કૃપા કરીને 10 અંકનો મોબાઇલ નંબર નાખો');
    return;
  }

  setLoading(true);

  try {
    const response = await apiService.sendOTP(phoneNumber, 'REGISTER');

    if (response.success) {
      // Success - Navigate to OTP screen
      alert(response.data.message);
      navigation.navigate('OtpVerification', {
        phone: phoneNumber,
        expiryTime: response.data.expiryTime
      });
    } else {
      // API returned error
      alert(response.message || 'OTP મોકલવામાં સમસ્યા આવી');
    }
  } catch (error) {
    // Network or other error
    alert('કનેક્શન સમસ્યા. કૃપા કરીને ફરી પ્રયાસ કરો.');
    console.error('OTP Error:', error);
  } finally {
    setLoading(false);
  }
};

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Image Section */}
      <View style={styles.imageSection}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600' }}
          style={styles.headerImage}
        />
        <View style={styles.imageOverlay}>
          <Text style={styles.overlayText}>🌾</Text>
        </View>
      </View>

      {/* Form Section */}
      <View style={styles.formSection}>
        {/* Title */}
        <Text style={styles.title}>ઓટીપી મેળવો</Text>
        <Text style={styles.subtitle}>
          ઓટીપી મેળવવા માટે તમારો નંબર દાખલ કરો.
        </Text>

        {/* Phone Input */}
        <View style={styles.inputContainer}>
          <View style={styles.countryCode}>
            <Text style={styles.flagEmoji}>🇮🇳</Text>
            <Text style={styles.codeText}>+91</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="ફોન નંબર"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            maxLength={10}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <Text style={styles.infoText}>
            OTP તમારા નંબર પર SMS દ્વારા મોકલવામાં આવશે
          </Text>
        </View>

        {/* Send OTP Button */}
       <TouchableOpacity
  style={[
    styles.button,
    (phoneNumber.length !== 10 || loading) && styles.buttonDisabled,
  ]}
  onPress={handleSendOTP}
  activeOpacity={0.8}
  disabled={phoneNumber.length !== 10 || loading}
>
  <Text style={styles.buttonText}>
    {loading ? 'મોકલી રહ્યા છીએ...' : 'ઓટીપી મોકલો'}
  </Text>
</TouchableOpacity>

        {/* Terms and Conditions */}
        <Text style={styles.termsText}>
          આગળ વધીને, તમે સંમત છો કે{' '}
          <Text style={styles.termsLink}>terms and conditions</Text>
          {'\n'}and <Text style={styles.termsLink}>privacy policy</Text>.
        </Text>

        {/* Farmer Support Message */}
        <View style={styles.supportBox}>
          <Text style={styles.supportText}>
            "ખેડૂતોને સશક્ત બનાવવા માટે{'\n'}સાથે મળીને આગળ વધીએ 🌱"
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
  imageSection: {
    height: 200,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(46, 125, 50, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    fontSize: 60,
  },
  formSection: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingHorizontal: 25,
    paddingTop: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    borderWidth: 1.5,
    borderColor: '#4CAF50',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F8E9',
    paddingHorizontal: 15,
    borderRightWidth: 1,
    borderRightColor: '#4CAF50',
  },
  flagEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  codeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  input: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 15,
    fontSize: 16,
    color: '#333',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 10,
    marginBottom: 25,
    alignItems: 'center',
  },
  infoIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#1565C0',
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
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: '#A5D6A7',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  termsText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  termsLink: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  supportBox: {
    backgroundColor: '#FFF9C4',
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FBC02D',
  },
  supportText: {
    fontSize: 14,
    color: '#F57F17',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 20,
  },
});
