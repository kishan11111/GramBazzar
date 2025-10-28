import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    KeyboardAvoidingView,
    Linking,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { apiService } from '../config/api';
import API_CONFIG from '../config/api';

export default function LocalCardSearchScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState([
    'મિસ્ત્રી',
    'ટ્રેક્ટર ભાડે',
    'ડીજે',
  ]);
  const [popularSearches] = useState([
    'વેલ્ડીંગ',
    'પાણીનો ટેન્કર',
    'કેટરિંગ',
    'ઇલેક્ટ્રીશિયન',
    'પ્લમ્બર',
  ]);

  // Search with debounce
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchQuery.length > 2) {
        performSearch(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  // Perform API search
  const performSearch = async (query) => {
    try {
      setSearching(true);
      const response = await apiService.searchLocalCards(query);

      if (response.success && response.data && response.data.data) {
        setSearchResults(response.data.data);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    // Add to recent searches if it's a new search
    if (query && !recentSearches.includes(query)) {
      setRecentSearches([query, ...recentSearches.slice(0, 4)]);
    }
  };

  const handleRecentSearch = (search) => {
    setSearchQuery(search);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleCall = (phone) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleWhatsApp = (phone) => {
    Linking.openURL(`https://wa.me/91${phone}`);
  };

  const renderSearchResult = ({ item }) => {
    const profileImageUrl = item.profileImage
      ? `${API_CONFIG.BASE_URL_Image}${item.profileImage}`
      : null;
    const businessName = item.businessNameGujarati || item.businessName;
    const category = item.subCategoryNameGujarati || item.categoryNameGujarati;
    const location = `${item.villageNameGujarati || item.villageNameEnglish}, ${item.talukaNameGujarati || item.talukaNameEnglish}`;
    const distance = item.distanceKm ? `${item.distanceKm.toFixed(1)} km` : '';

    return (
      <TouchableOpacity
        style={styles.resultCard}
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
              <Text style={styles.cardName} numberOfLines={2}>{businessName}</Text>
              {item.isVerified && <Text style={styles.verifiedBadge}>✓</Text>}
            </View>
            <Text style={styles.cardCategory} numberOfLines={1}>{category}</Text>
            <Text style={styles.cardLocation} numberOfLines={1}>
              📍 {location} {distance && `(${distance})`}
            </Text>
            {item.workingHours && (
              <Text style={styles.cardTiming} numberOfLines={1}>⏰ {item.workingHours}</Text>
            )}
          </View>
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.callButton}
            onPress={() => handleCall(item.primaryPhone)}
          >
            <Text style={styles.callButtonText}>📞 કોલ</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.whatsappButton}
            onPress={() => handleWhatsApp(item.whatsAppNumber || item.primaryPhone)}
          >
            <Text style={styles.whatsappButtonText}>💬 WhatsApp</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />
      
      {/* Search Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="શું શોધી રહ્યા છો..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={handleSearch}
            autoFocus={true}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Content */}
      {searchQuery.length === 0 ? (
        <View style={styles.suggestionsContainer}>
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>તાજેતરની શોધ</Text>
              <View style={styles.sectionDivider} />
              {recentSearches.map((search, index) => (
                <TouchableOpacity 
                  key={index}
                  style={styles.suggestionItem}
                  onPress={() => handleRecentSearch(search)}
                >
                  <Text style={styles.suggestionIcon}>🔍</Text>
                  <Text style={styles.suggestionText}>{search}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Popular Searches */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>લોકપ્રિય શોધ</Text>
            <View style={styles.sectionDivider} />
            {popularSearches.map((search, index) => (
              <TouchableOpacity 
                key={index}
                style={styles.suggestionItem}
                onPress={() => handleRecentSearch(search)}
              >
                <Text style={styles.suggestionIcon}>🔥</Text>
                <Text style={styles.suggestionText}>{search}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : searching ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>શોધી રહ્યા છીએ...</Text>
        </View>
      ) : (
        <FlatList
          data={searchResults}
          renderItem={renderSearchResult}
          keyExtractor={(item) => item.cardId.toString()}
          contentContainerStyle={styles.resultsContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            searchQuery.length > 0 ? (
              <View style={styles.noResults}>
                <Text style={styles.noResultsIcon}>🔍</Text>
                <Text style={styles.noResultsText}>
                  "{searchQuery}" માટે કોઈ પરિણામ મળ્યું નથી
                </Text>
                <Text style={styles.noResultsSubtext}>
                  અલગ શબ્દો સાથે પ્રયાસ કરો
                </Text>
              </View>
            ) : null
          }
        />
      )}
    </KeyboardAvoidingView>
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
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginLeft: 10,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    paddingVertical: 10,
  },
  clearIcon: {
    fontSize: 18,
    color: '#999',
    padding: 5,
  },
  suggestionsContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginBottom: 10,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  suggestionIcon: {
    fontSize: 16,
    marginRight: 15,
  },
  suggestionText: {
    fontSize: 15,
    color: '#333',
  },
  resultsContainer: {
    padding: 15,
  },
  resultCard: {
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
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  cardImagePlaceholder: {
    width: 50,
    height: 50,
    backgroundColor: '#F1F8E9',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardImageIcon: {
    fontSize: 24,
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
    fontSize: 15,
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
    marginBottom: 3,
  },
  cardLocation: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  cardTiming: {
    fontSize: 12,
    color: '#999',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
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
  noResults: {
    alignItems: 'center',
    paddingTop: 80,
  },
  noResultsIcon: {
    fontSize: 48,
    marginBottom: 15,
    opacity: 0.3,
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#999',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 14,
    color: '#666',
  },
});