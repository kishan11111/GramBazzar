import {
    Image,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Top Section - Farmer Image */}
      <View style={styles.topSection}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800' }}
          style={styles.farmerImage}
        />
        <View style={styles.overlay} />
      </View>

      {/* Bottom Section - Content */}
      <View style={styles.bottomSection}>
        {/* App Logo/Icon */}
        <View style={styles.iconContainer}>
          <Text style={styles.iconText}>🤝</Text>
        </View>

        {/* App Name */}
        <Text style={styles.appName}>ખરીદવેચાણ</Text>
        <Text style={styles.appNameEnglish}>kharidVechan</Text>

        {/* Tagline */}
        <Text style={styles.tagline}>
          ખેડૂતો માટે, ખેડૂતો દ્વારા{'\n'}
          <Text style={styles.taglineSmall}>સીધો વેપાર, વધુ નફો</Text>
        </Text>

        {/* Feature Points */}
        <View style={styles.features}>
          <Text style={styles.featureText}>✓ સીધો ખેડૂત સાથે જોડાવ</Text>
          <Text style={styles.featureText}>✓ વાજબી ભાવ મેળવો</Text>
          <Text style={styles.featureText}>✓ તાજી પેદાશ ઘર સુધી</Text>
        </View>

        {/* Get Started Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('PhoneLogin')}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>શરૂ કરો</Text>
        </TouchableOpacity>

        {/* Language Selector */}
        <Text style={styles.languageText}>
          ગુજરાતી | English | हिंदी
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topSection: {
    flex: 0.4,
    position: 'relative',
  },
  farmerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  bottomSection: {
    flex: 0.6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 30,
    paddingTop: 10,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#4CAF50',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  iconText: {
    fontSize: 40,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 5,
  },
  appNameEnglish: {
    fontSize: 18,
    color: '#666',
    marginBottom: 15,
  },
  tagline: {
    fontSize: 18,
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 26,
    fontWeight: '600',
  },
  taglineSmall: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'normal',
  },
  features: {
    alignSelf: 'stretch',
    backgroundColor: '#F1F8E9',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
  },
  featureText: {
    fontSize: 15,
    color: '#2E7D32',
    marginBottom: 8,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  languageText: {
    fontSize: 12,
    color: '#999',
    marginTop: 10,
  },
});