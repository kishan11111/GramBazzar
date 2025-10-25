import { useState, useEffect } from 'react';
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
import { apiService } from '../config/api';
import API_CONFIG from '../config/api';

export default function LocalCardHomeScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const nearbyCards = [
    { id: 1, name: 'લાલજીભાઈ મિસ્ત્રી', category: 'મિસ્ત્રી કામ', distance: '1.2 km', verified: true },
    { id: 2, name: 'રમેશ ટ્રેક્ટર સેવા', category: 'ટ્રેક્ટર ભાડે', distance: '3.5 km', verified: false },
    { id: 3, name: 'જયેશ ડીજે સાઉન્ડ', category: 'ડીજે સેવા', distance: '2.1 km', verified: true },
  ];

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

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

  const renderNearbyCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.nearbyCard}
      onPress={() => navigation.navigate('LocalCardDetail', { card: item })}
      activeOpacity={0.8}
    >
      <View style={styles.nearbyCardImage}>
        <Text style={styles.nearbyCardIcon}>👤</Text>
      </View>
      <Text style={styles.nearbyCardName}>{item.name}</Text>
      {item.verified && <Text style={styles.verifiedBadge}>✓</Text>}
      <Text style={styles.nearbyCardCategory}>{item.category}</Text>
      <Text style={styles.nearbyCardDistance}>📍 {item.distance}</Text>
    </TouchableOpacity>
  );

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
              <Text style={styles.bannerSubtitle}>માત્ર ₹99/- માં</Text>
            </View>
            <View style={styles.bannerButton}>
              <Text style={styles.bannerButtonText}>હમણાં બનાવો →</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Category Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 કેટેગરી પસંદ કરો</Text>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4CAF50" />
              <Text style={styles.loadingText}>કેટેગરી લોડ થઈ રહી છે...</Text>
            </View>
          ) : error ? (
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

        {/* Nearby Cards Section (Optional) */}
        {nearbyCards.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📍 તમારાથી નજીકના સેવા</Text>
            <FlatList
              data={nearbyCards}
              renderItem={renderNearbyCard}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.nearbyList}
            />
          </View>
        )}

        <View style={{ height: 20 }} />
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
});