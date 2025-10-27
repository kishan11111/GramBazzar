import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Location from 'expo-location';

// Weather code mapping to Gujarati
const weatherCodeMap = {
  0: { gujarati: 'સ્વચ્છ આકાશ', english: 'Clear sky', icon: '☀️' },
  1: { gujarati: 'ભાગે વાદળછાયું', english: 'Partly cloudy', icon: '🌤️' },
  2: { gujarati: 'ભાગે વાદળછાયું', english: 'Partly cloudy', icon: '⛅' },
  3: { gujarati: 'ભાગે વાદળછાયું', english: 'Partly cloudy', icon: '☁️' },
  45: { gujarati: 'ધુમ્મસ', english: 'Fog', icon: '🌫️' },
  48: { gujarati: 'ધુમ્મસ', english: 'Fog', icon: '🌫️' },
  51: { gujarati: 'ઝરમર વરસાદ', english: 'Drizzle', icon: '🌦️' },
  53: { gujarati: 'ઝરમર વરસાદ', english: 'Drizzle', icon: '🌦️' },
  55: { gujarati: 'ઝરમર વરસાદ', english: 'Drizzle', icon: '🌦️' },
  56: { gujarati: 'ઝરમર વરસાદ', english: 'Drizzle', icon: '🌦️' },
  57: { gujarati: 'ઝરમર વરસાદ', english: 'Drizzle', icon: '🌦️' },
  61: { gujarati: 'વરસાદ', english: 'Rain', icon: '🌧️' },
  63: { gujarati: 'વરસાદ', english: 'Rain', icon: '🌧️' },
  65: { gujarati: 'વરસાદ', english: 'Rain', icon: '🌧️' },
  66: { gujarati: 'વરસાદ', english: 'Rain', icon: '🌧️' },
  67: { gujarati: 'વરસાદ', english: 'Rain', icon: '🌧️' },
  71: { gujarati: 'હિમવર્ષા', english: 'Snow', icon: '❄️' },
  73: { gujarati: 'હિમવર્ષા', english: 'Snow', icon: '❄️' },
  75: { gujarati: 'હિમવર્ષા', english: 'Snow', icon: '❄️' },
  77: { gujarati: 'હિમવર્ષા', english: 'Snow', icon: '❄️' },
  80: { gujarati: 'વરસાદી ઝાપટાં', english: 'Rain showers', icon: '🌦️' },
  81: { gujarati: 'વરસાદી ઝાપટાં', english: 'Rain showers', icon: '🌦️' },
  82: { gujarati: 'વરસાદી ઝાપટાં', english: 'Rain showers', icon: '🌦️' },
  95: { gujarati: 'વીજળી સાથે વરસાદ', english: 'Thunderstorm', icon: '⛈️' },
  96: { gujarati: 'વીજળી સાથે વરસાદ', english: 'Thunderstorm', icon: '⛈️' },
  99: { gujarati: 'વીજળી સાથે વરસાદ', english: 'Thunderstorm', icon: '⛈️' },
};

export default function WeatherScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getLocationAndWeather();
  }, []);

  const getLocationAndWeather = async () => {
    try {
      setLoading(true);
      setError(null);

      // Request location permission
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setError('સ્થાન પરવાનગી નકારવામાં આવી છે');
        Alert.alert(
          'પરવાનગી જરૂરી છે',
          'હવામાન માહિતી માટે સ્થાન પરવાનગી જરૂરી છે',
          [
            { text: 'રદ કરો', style: 'cancel' },
            { text: 'સેટિંગ્સ', onPress: () => Location.requestForegroundPermissionsAsync() }
          ]
        );
        setLoading(false);
        return;
      }

      // Get current location
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = currentLocation.coords;
      setLocation({ latitude, longitude });

      // Fetch weather data from Open-Meteo API
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );

      if (!weatherResponse.ok) {
        throw new Error('હવામાન માહિતી મેળવવામાં નિષ્ફળ');
      }

      const data = await weatherResponse.json();
      setWeatherData(data);
    } catch (err) {
      console.error('Error fetching weather:', err);
      setError('હવામાન માહિતી લોડ કરવામાં ભૂલ આવી');
      Alert.alert('ભૂલ', 'હવામાન માહિતી લોડ કરવામાં ભૂલ આવી. ફરી પ્રયાસ કરો.');
    } finally {
      setLoading(false);
    }
  };

  const getWeatherInfo = (weatherCode) => {
    return weatherCodeMap[weatherCode] || {
      gujarati: 'અજ્ઞાત',
      english: 'Unknown',
      icon: '🌡️'
    };
  };

  const formatTime = (timeString) => {
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString('gu-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return timeString;
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>હવામાન</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>હવામાન માહિતી લોડ કરી રહ્યા છીએ...</Text>
        </View>
      </View>
    );
  }

  if (error || !weatherData) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>હવામાન</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>{error || 'કંઈક ખોટું થયું'}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={getLocationAndWeather}
          >
            <Text style={styles.retryButtonText}>ફરી પ્રયાસ કરો</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const currentWeather = weatherData.current_weather;
  const weatherInfo = getWeatherInfo(currentWeather.weathercode);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>હવામાન</Text>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={getLocationAndWeather}
        >
          <Text style={styles.refreshIcon}>🔄</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Main Weather Card */}
        <View style={styles.mainWeatherCard}>
          <Text style={styles.weatherIcon}>{weatherInfo.icon}</Text>
          <Text style={styles.temperature}>{currentWeather.temperature}°C</Text>
          <Text style={styles.weatherDescription}>{weatherInfo.gujarati}</Text>
          <Text style={styles.weatherDescriptionEn}>{weatherInfo.english}</Text>

          <View style={styles.locationContainer}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.locationText}>
              {location?.latitude.toFixed(4)}, {location?.longitude.toFixed(4)}
            </Text>
          </View>
        </View>

        {/* Weather Details Grid */}
        <View style={styles.detailsGrid}>
          {/* Temperature Card */}
          <View style={styles.detailCard}>
            <Text style={styles.detailIcon}>🌡️</Text>
            <Text style={styles.detailLabel}>તાપમાન</Text>
            <Text style={styles.detailValue}>{currentWeather.temperature}°C</Text>
          </View>

          {/* Wind Speed Card */}
          <View style={styles.detailCard}>
            <Text style={styles.detailIcon}>💨</Text>
            <Text style={styles.detailLabel}>પવન</Text>
            <Text style={styles.detailValue}>{currentWeather.windspeed} km/h</Text>
          </View>

          {/* Wind Direction Card */}
          <View style={styles.detailCard}>
            <Text style={styles.detailIcon}>🧭</Text>
            <Text style={styles.detailLabel}>દિશા</Text>
            <Text style={styles.detailValue}>{currentWeather.winddirection}°</Text>
          </View>

          {/* Day/Night Card */}
          <View style={styles.detailCard}>
            <Text style={styles.detailIcon}>{currentWeather.is_day ? '☀️' : '🌙'}</Text>
            <Text style={styles.detailLabel}>સમય</Text>
            <Text style={styles.detailValue}>{currentWeather.is_day ? 'દિવસ' : 'રાત્રિ'}</Text>
          </View>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#4CAF50',
    paddingTop: 40,
    paddingBottom: 15,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  refreshButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshIcon: {
    fontSize: 20,
  },
  placeholder: {
    width: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorIcon: {
    fontSize: 60,
    marginBottom: 15,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  mainWeatherCard: {
    backgroundColor: '#4CAF50',
    margin: 15,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  weatherIcon: {
    fontSize: 80,
    marginBottom: 10,
  },
  temperature: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  weatherDescription: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  weatherDescriptionEn: {
    fontSize: 16,
    color: '#E8F5E9',
    marginBottom: 15,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  locationIcon: {
    fontSize: 16,
    marginRight: 5,
  },
  locationText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    marginTop: 10,
  },
  detailCard: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    margin: '1.5%',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  detailIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    margin: 15,
    borderRadius: 15,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  legendCard: {
    backgroundColor: '#FFFFFF',
    margin: 15,
    marginTop: 5,
    borderRadius: 15,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  legendTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 15,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  legendCode: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
    width: 60,
  },
  legendText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
});
