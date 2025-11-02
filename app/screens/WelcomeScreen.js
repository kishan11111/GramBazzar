import { useEffect } from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from '../config/api';

export default function WelcomeScreen({ navigation }) {
  useEffect(() => {
    // Check if user is already logged in and session is valid
    const checkAuthStatus = async () => {
      try {
        const authToken = await AsyncStorage.getItem('authToken');

        if (!authToken) {
          // No token found, navigate to PhoneLogin after showing welcome screen
          console.log('ℹ️ No auth token found, navigating to PhoneLogin');
          setTimeout(() => {
            navigation.replace('PhoneLogin');
          }, 2500);
          return;
        }

        // Token exists, verify it's valid by making an API call
        console.log('🔍 Auth token found, verifying session validity...');

        try {
          const profileResponse = await apiService.getUserProfile();

          if (profileResponse.success && profileResponse.data) {
            // Valid session confirmed, navigate to Dashboard
            console.log('✅ Valid session confirmed, navigating to Dashboard');
            setTimeout(() => {
              navigation.replace('Dashboard');
            }, 2500);
          } else {
            // Invalid response, clear storage and go to login
            console.log('⚠️ Invalid session response, clearing storage');
            await AsyncStorage.clear();
            setTimeout(() => {
              navigation.replace('PhoneLogin');
            }, 2500);
          }
        } catch (apiError) {
          // API call failed (token expired, unauthorized, network error, etc.)
          console.log('❌ Session validation failed:', apiError.message);

          // Clear invalid/expired token and navigate to login
          await AsyncStorage.clear();
          setTimeout(() => {
            navigation.replace('PhoneLogin');
          }, 2500);
        }
      } catch (error) {
        console.error('❌ Error checking auth status:', error);
        // On unexpected error, clear storage and navigate to PhoneLogin
        await AsyncStorage.clear();
        setTimeout(() => {
          navigation.replace('PhoneLogin');
        }, 2500);
      }
    };

    checkAuthStatus();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <Image
        source={require('../../assets/images/my_logo.jpg')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '80%',
    height: '40%',
  },
});