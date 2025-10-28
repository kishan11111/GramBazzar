import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import BottomNavWrapper from '../DynamicBottomNav';
import { LocalCardHomeShimmer } from '../components/Shimmer';
import API_CONFIG, { apiService } from '../config/api';

export default function LocalCardHomeScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nearbyCards, setNearbyCards] = useState([]);
  const [nearbyLoading, setNearbyLoading] = useState(false);

  // Fetch categories and nearby cards on component mount
  useEffect(() => {
    fetchCategories();
    getUserLocationAndFetchNearby();
  }, []);

  // Get user location and fetch nearby cards
  const getUserLocationAndFetchNearby = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Location permission not granted');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setUserLocation(coords);

      // Fetch nearby cards with user location
      await fetchNearbyCards(coords.latitude, coords.longitude);
    } catch (error) {
      console.error('Error getting location:', error);
      // Optionally fetch with default Gujarat coordinates
      await fetchNearbyCards(22.2587, 71.1924);
    }
  };

  // Fetch nearby cards
  const fetchNearbyCards = async (latitude, longitude) => {
    try {
      setNearbyLoading(true);
      const response = await apiService.getNearbyLocalCards(latitude, longitude, 1, 10);

      if (response.success && response.data && response.data.data) {
        setNearbyCards(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching nearby cards:', error);
    } finally {
      setNearbyLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getLocalCardCategories();

      if (response.success && response.data) {
        setCategories(response.data);
      } else {
        setError('કેટેગરી લોડ કરવામાં નિષ્ફળ');
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('કેટેગરી લોડ કરવામાં ભૂલ થઈ. કૃપા કરીને ફરી પ્રયાસ કરો.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCardBanner = () => {
    navigation.navigate('CreateLocalCard');
  };

  const renderCategory = ({ item }) => {
    // Use icon if available, otherwise use image
    const hasIcon = item.categoryIcon && item.categoryIcon.trim() !== '';
    const imageUrl = item.categoryImage ? `${API_CONFIG.BASE_URL_Image}${item.categoryImage}` : null;

    return (
      <TouchableOpacity
        style={styles.categoryCard}
        onPress={() => navigation.navigate('LocalCardCategory', {
          category: item
        })}
        activeOpacity={0.8}
      >
        {hasIcon ? (
          <Text style={styles.categoryIcon}>{item.categoryIcon}</Text>
        ) : imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.categoryImage}
            resizeMode="cover"
          />
        ) : (
          <Text style={styles.categoryIcon}>📋</Text>
        )}
        <Text style={styles.categoryName}>{item.categoryNameGujarati || item.categoryNameEnglish}</Text>
        <Text style={styles.categoryCount}>({item.totalCards || 0})</Text>
      </TouchableOpacity>
    );
  };

  const renderNearbyCard = ({ item }) => {
    const profileImageUrl = item.profileImage
      ? `${API_CONFIG.BASE_URL_Image}${item.profileImage}`
      : null;
    const businessName = item.businessNameGujarati || item.businessName;
    const category = item.subCategoryNameGujarati || item.categoryNameGujarati;
    const distance = item.distanceKm
      ? `${item.distanceKm.toFixed(1)} km`
      : '';

    return (
      <TouchableOpacity
        style={styles.nearbyCard}
        onPress={() => navigation.navigate('LocalCardDetail', { cardId: item.cardId })}
        activeOpacity={0.8}
      >
        {profileImageUrl ? (
          <Image
            source={{ uri: profileImageUrl }}
            style={styles.nearbyCardImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.nearbyCardImagePlaceholder}>
            <Text style={styles.nearbyCardIcon}>🏪</Text>
          </View>
        )}
        <Text style={styles.nearbyCardName} numberOfLines={2}>{businessName}</Text>
        {item.isVerified && <Text style={styles.verifiedBadge}>✓</Text>}
        <Text style={styles.nearbyCardCategory} numberOfLines={1}>{category}</Text>
        {distance && <Text style={styles.nearbyCardDistance}>📍 {distance}</Text>}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>સ્થાનિક કાર્ડ</Text>
        <TouchableOpacity 
          style={styles.searchButton}
          onPress={() => navigation.navigate('LocalCardSearch')}
        >
          <Text style={styles.searchIcon}>🔍</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Create Card Banner */}
        <TouchableOpacity
          style={styles.createBanner}
          onPress={handleCreateCardBanner}
          activeOpacity={0.9}
        >
          <View style={styles.bannerContent}>
            <Text style={styles.bannerIcon}>💼</Text>
            <View style={styles.bannerTextContainer}>
              <Text style={styles.bannerTitle}>તમારો બિઝનેસ કાર્ડ બનાવો</Text>
              <Text style={styles.bannerSubtitle}>સંપૂર્ણ ફ્રી માં</Text>
            </View>
            <View style={styles.bannerButton}>
              <Text style={styles.bannerButtonText}>હમણાં બનાવો →</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Category Section */}
        {loading ? (
          <LocalCardHomeShimmer />
        ) : (
          <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📋 કેટેગરી પસંદ કરો</Text>
            {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={fetchCategories}
              >
                <Text style={styles.retryButtonText}>ફરી પ્રયાસ કરો</Text>
              </TouchableOpacity>
            </View>
          ) : categories.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>કોઈ કેટેગરી ઉપલબ્ધ નથી</Text>
            </View>
          ) : (
            <FlatList
              data={categories}
              renderItem={renderCategory}
              keyExtractor={(item) => item.categoryId.toString()}
              numColumns={2}
              columnWrapperStyle={styles.categoryRow}
              scrollEnabled={false}
            />
          )}
        </View>

          {/* Nearby Cards Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📍 તમારા નજીકની સેવા</Text>
            {nearbyLoading ? (
              <View style={styles.nearbyLoadingContainer}>
                <ActivityIndicator size="small" color="#4CAF50" />
                <Text style={styles.nearbyLoadingText}>નજીકની સેવાઓ શોધી રહ્યા છીએ...</Text>
              </View>
            ) : nearbyCards.length > 0 ? (
              <FlatList
                data={nearbyCards}
                renderItem={renderNearbyCard}
                keyExtractor={(item) => item.cardId.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.nearbyList}
              />
            ) : (
              <View style={styles.emptyNearbyContainer}>
                <Text style={styles.emptyNearbyText}>તમારા નજીકમાં કોઈ સેવા મળી નથી</Text>
              </View>
            )}
          </View>

          <View style={{ height: 20 }} />
          </>
        )}
      </ScrollView>
      <BottomNavWrapper navigation={navigation} activeTab="home" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#4CAF50',
    paddingTop: 40,
    paddingBottom: 15,
    paddingHorizontal: 15,
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
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  searchButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIcon: {
    fontSize: 20,
  },
  createBanner: {
    margin: 15,
    backgroundColor: 'linear-gradient(135deg, #FF8C42 0%, #FF6B35 100%)',
    backgroundColor: '#FF8C42',
    borderRadius: 12,
    padding: 15,
    elevation: 3,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerIcon: {
    fontSize: 30,
    marginRight: 12,
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.95,
  },
  bannerButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  bannerButtonText: {
    color: '#FF6B35',
    fontWeight: 'bold',
    fontSize: 13,
  },
  section: {
    paddingHorizontal: 15,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  categoryRow: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  categoryCard: {
    flex: 0.48,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  categoryIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  categoryImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 13,
    color: '#666',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  errorContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    marginVertical: 10,
  },
  errorText: {
    fontSize: 14,
    color: '#E65100',
    textAlign: 'center',
    marginBottom: 15,
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  nearbyList: {
    paddingRight: 15,
  },
  nearbyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    width: 140,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  nearbyCardImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  nearbyCardImagePlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: '#F1F8E9',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  nearbyCardIcon: {
    fontSize: 30,
  },
  nearbyCardName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 2,
  },
  verifiedBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#2196F3',
    color: '#FFFFFF',
    borderRadius: 10,
    width: 20,
    height: 20,
    textAlign: 'center',
    lineHeight: 20,
    fontSize: 12,
    fontWeight: 'bold',
  },
  nearbyCardCategory: {
    fontSize: 11,
    color: '#666',
    marginBottom: 4,
  },
  nearbyCardDistance: {
    fontSize: 11,
    color: '#999',
  },
  nearbyLoadingContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nearbyLoadingText: {
    marginTop: 10,
    fontSize: 12,
    color: '#666',
  },
  emptyNearbyContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
  },
  emptyNearbyText: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
  },
});