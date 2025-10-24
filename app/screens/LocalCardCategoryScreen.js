import { useState, useEffect } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    Linking,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { apiService } from '../config/api';
import API_CONFIG from '../config/api';

export default function LocalCardCategoryScreen({ navigation, route }) {
  const { category } = route.params;

  // Dynamic data states - SubCategories
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dynamic data states - Cards
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [cards, setCards] = useState([]);
  const [cardsLoading, setCardsLoading] = useState(false);
  const [cardsError, setCardsError] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch ONLY subcategories on component mount
  useEffect(() => {
    fetchSubCategories();
  }, []);

  // Fetch subcategories from API
  const fetchSubCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getLocalCardSubcategories(category.categoryId);
      if (response.success && response.data) {
        setSubCategories(response.data);
      } else {
        setError('સબ-કેટેગરી લોડ કરવામાં નિષ્ફળ');
      }
    } catch (err) {
      console.error('Error fetching subcategories:', err);
      setError('સબ-કેટેગરી લોડ કરવામાં ભૂલ થઈ. કૃપા કરીને ફરી પ્રયાસ કરો.');
    } finally {
      setLoading(false);
    }
  };

  // Handle subcategory selection - Show cards for this subcategory
  const handleSubCategorySelect = (subCategory) => {
    setSelectedSubCategory(subCategory);
    fetchCards(subCategory, 1, true);
  };

  // Fetch cards from API
  const fetchCards = async (subCategory, page = 1, replace = false) => {
    if (cardsLoading) return;

    try {
      setCardsLoading(true);
      setCardsError(null);

      const filters = {
        categoryId: category.categoryId,
        subCategoryId: subCategory.subCategoryId,
        pageNumber: page,
        pageSize: 20,
      };

      const response = await apiService.browseLocalCards(filters);

      if (response.success && response.data) {
        const newCards = response.data.data || [];
        setCards(replace ? newCards : [...cards, ...newCards]);
        setPageNumber(page);
        setHasMore(newCards.length === 20);
      } else {
        setCardsError('કાર્ડ લોડ કરવામાં નિષ્ફળ');
      }
    } catch (err) {
      console.error('Error fetching cards:', err);
      setCardsError('કાર્ડ લોડ કરવામાં ભૂલ થઈ. કૃપા કરીને ફરી પ્રયાસ કરો.');
    } finally {
      setCardsLoading(false);
      setRefreshing(false);
    }
  };

  // Handle pull to refresh
  const handleRefresh = () => {
    if (selectedSubCategory) {
      setRefreshing(true);
      fetchCards(selectedSubCategory, 1, true);
    }
  };

  // Handle load more
  const handleLoadMore = () => {
    if (hasMore && !cardsLoading && selectedSubCategory) {
      fetchCards(selectedSubCategory, pageNumber + 1, false);
    }
  };

  // Handle back from cards view
  const handleBackFromCards = () => {
    setSelectedSubCategory(null);
    setCards([]);
    setCardsError(null);
  };

  const handleCall = (phone) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleWhatsApp = (phone) => {
    Linking.openURL(`https://wa.me/91${phone}`);
  };

  const renderSubCategory = ({ item }) => {
    const hasIcon = item.subCategoryIcon && item.subCategoryIcon.trim() !== '';
    const imageUrl = item.subCategoryImage ? `${API_CONFIG.BASE_URL_Image}${item.subCategoryImage}` : null;

    return (
      <TouchableOpacity
        style={styles.subCategoryCard}
        onPress={() => handleSubCategorySelect(item)}
        activeOpacity={0.8}
      >
        {hasIcon ? (
          <Text style={styles.subCategoryIcon}>{item.subCategoryIcon}</Text>
        ) : imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.subCategoryImage}
            resizeMode="cover"
          />
        ) : (
          <Text style={styles.subCategoryIcon}>📋</Text>
        )}
        <Text style={styles.subCategoryName} numberOfLines={2}>
          {item.subCategoryNameGujarati || item.subCategoryNameEnglish}
        </Text>
        <Text style={styles.subCategoryCount}>({item.totalCards || 0})</Text>
      </TouchableOpacity>
    );
  };

  const renderCard = ({ item }) => {
    const profileImageUrl = item.profileImage
      ? `${API_CONFIG.BASE_URL_Image}${item.profileImage}`
      : null;

    const businessName = item.businessNameGujarati || item.businessName;
    const location = `${item.villageNameGujarati || item.villageNameEnglish}, ${item.talukaNameGujarati || item.talukaNameEnglish}`;
    const distance = item.distanceKm ? `${item.distanceKm.toFixed(1)} km` : '';

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('LocalCardDetail', { cardId: item.cardId })}
        activeOpacity={0.9}
      >
        <View style={styles.cardContent}>
          <View style={styles.cardLeft}>
            {profileImageUrl ? (
              <Image
                source={{ uri: profileImageUrl }}
                style={styles.cardImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.cardImagePlaceholder}>
                <Text style={styles.cardImageIcon}>🏪</Text>
              </View>
            )}
          </View>

          <View style={styles.cardMiddle}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardName}>{businessName}</Text>
              {item.isVerified && <Text style={styles.verifiedBadge}>✓</Text>}
            </View>
            <Text style={styles.cardCategory}>
              {item.subCategoryNameGujarati || item.subCategoryNameEnglish}
            </Text>
            <Text style={styles.cardLocation}>
              📍 {location} {distance && `(${distance})`}
            </Text>
            {item.workingHours && (
              <Text style={styles.cardTiming}>⏰ {item.workingHours}</Text>
            )}
          </View>
        </View>

        <View style={styles.cardActions}>
          <Text style={styles.phoneNumber}>
            📞 {item.primaryPhone ? `${item.primaryPhone.substring(0, 5)}-XXXXX` : 'N/A'}
          </Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.callButton}
              onPress={(e) => {
                e.stopPropagation();
                handleCall(item.primaryPhone || item.whatsAppNumber);
              }}
            >
              <Text style={styles.callButtonText}>📞 કોલ</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.whatsappButton}
              onPress={(e) => {
                e.stopPropagation();
                handleWhatsApp(item.whatsAppNumber || item.primaryPhone);
              }}
            >
              <Text style={styles.whatsappButtonText}>💬 WhatsApp</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // If a subcategory is selected, show cards
  if (selectedSubCategory) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackFromCards}
          >
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {selectedSubCategory.subCategoryNameGujarati || selectedSubCategory.subCategoryNameEnglish}
          </Text>
          <View style={styles.headerRight} />
        </View>

        {/* Cards List */}
        {cardsError && !cardsLoading && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{cardsError}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => fetchCards(selectedSubCategory, 1, true)}
            >
              <Text style={styles.retryButtonText}>ફરી પ્રયાસ કરો</Text>
            </TouchableOpacity>
          </View>
        )}

        <FlatList
          data={cards}
          renderItem={renderCard}
          keyExtractor={(item) => item.cardId.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            !cardsLoading && !cardsError ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>કોઈ કાર્ડ ઉપલબ્ધ નથી</Text>
              </View>
            ) : null
          }
          ListFooterComponent={
            cardsLoading && cards.length > 0 ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color="#4CAF50" />
              </View>
            ) : null
          }
        />

        {cardsLoading && cards.length === 0 && (
          <View style={styles.initialLoadingContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.loadingText}>કાર્ડ લોડ થઈ રહ્યા છે...</Text>
          </View>
        )}
      </View>
    );
  }

  // Otherwise, show subcategories
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
        <Text style={styles.headerTitle}>
          {category.categoryNameGujarati || category.categoryNameEnglish || category.name}
        </Text>
        <View style={styles.headerRight} />
      </View>

      {/* SubCategory Section Title */}
      <View style={styles.sectionTitleContainer}>
        <Text style={styles.sectionTitle}>📋 સબ-કેટેગરી પસંદ કરો</Text>
      </View>

      {/* Loading State */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>સબ-કેટેગરી લોડ થઈ રહી છે...</Text>
        </View>
      )}

      {/* Error State */}
      {error && !loading && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchSubCategories}
          >
            <Text style={styles.retryButtonText}>ફરી પ્રયાસ કરો</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Subcategories Grid */}
      {!loading && !error && (
        <FlatList
          data={subCategories}
          renderItem={renderSubCategory}
          keyExtractor={(item) => item.subCategoryId.toString()}
          numColumns={2}
          columnWrapperStyle={styles.subCategoryRow}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>કોઈ સબ-કેટેગરી ઉપલબ્ધ નથી</Text>
            </View>
          }
        />
      )}
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },
  sectionTitleContainer: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  listContainer: {
    padding: 15,
  },
  subCategoryRow: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  subCategoryCard: {
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
  subCategoryIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  subCategoryImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginBottom: 8,
  },
  subCategoryName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  subCategoryCount: {
    fontSize: 13,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 14,
    color: '#E65100',
    textAlign: 'center',
    marginBottom: 20,
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
    padding: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  cardContent: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  cardLeft: {
    marginRight: 12,
  },
  cardImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#F1F8E9',
  },
  cardImagePlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: '#F1F8E9',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardImageIcon: {
    fontSize: 30,
  },
  cardMiddle: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  verifiedBadge: {
    backgroundColor: '#2196F3',
    color: '#FFFFFF',
    borderRadius: 10,
    width: 18,
    height: 18,
    textAlign: 'center',
    lineHeight: 18,
    fontSize: 11,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  cardCategory: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  cardLocation: {
    fontSize: 12,
    color: '#999',
    marginBottom: 3,
  },
  cardTiming: {
    fontSize: 12,
    color: '#999',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  phoneNumber: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  callButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
  },
  callButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  whatsappButton: {
    backgroundColor: '#25D366',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  whatsappButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  initialLoadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});
