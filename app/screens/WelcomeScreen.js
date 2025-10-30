import { useEffect } from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function WelcomeScreen({ navigation }) {
  useEffect(() => {
    // Check if user is already logged in
    const checkAuthStatus = async () => {
      try {
        const authToken = await AsyncStorage.getItem('authToken');

        // Wait 2.5 seconds to show the welcome screen
        setTimeout(() => {
          if (authToken) {
            // User is logged in, navigate to Dashboard
            console.log('✅ User already logged in, navigating to Dashboard');
            navigation.replace('Dashboard');
          } else {
            // User is not logged in, navigate to PhoneLogin
            console.log('ℹ️ No auth token found, navigating to PhoneLogin');
            navigation.replace('PhoneLogin');
          }
        }, 2500);
      } catch (error) {
        console.error('Error checking auth status:', error);
        // On error, navigate to PhoneLogin as fallback
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