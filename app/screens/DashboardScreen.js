import { useState } from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { apiService } from '../config/api';

export default function DashboardScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  // Categories data - All separate, no subcategories!
//   const categories = [
//     { id: 1, name: 'કાર', icon: '🚗', color: '#FF6B6B' },
//     { id: 2, name: 'બાઇક', icon: '🏍️', color: '#5F27CD' },
//     { id: 3, name: 'સ્કૂટર', icon: '🛵', color: '#48C9B0' },
//     { id: 4, name: 'ટ્રેક્ટર', icon: '🚜', color: '#98D8C8' },
//     { id: 5, name: 'ગાય', icon: '🐄', color: '#4ECDC4' },
//     { id: 6, name: 'ભેંસ', icon: '🐃', color: '#2C3E50' },
//     { id: 7, name: 'બકરી', icon: '🐐', color: '#E67E22' },
//     { id: 8, name: 'ઘોડો', icon: '🐴', color: '#F7B731' },
//     { id: 9, name: 'મરઘી', icon: '🐔', color: '#FFA502' },
//     { id: 10, name: 'ખેત', icon: '🌾', color: '#FFE66D' },
//     { id: 11, name: 'જમીન', icon: '🏞️', color: '#A8D8EA' },
//     { id: 12, name: 'મકાન', icon: '🏠', color: '#F38181' },
//     { id: 13, name: 'મોબાઇલ', icon: '📱', color: '#95E1D3' },
//     { id: 14, name: 'ફર્નિચર', icon: '🪑', color: '#AA96DA' },
//     { id: 15, name: 'નોકરી', icon: '💼', color: '#FFA07A' },
//   ];

const categories = [
    { id: 1, name: 'કાર', icon: '🚗', categoryId: 1 },
    { id: 2, name: 'બાઇક', icon: '🏍️', categoryId: 1 },
    { id: 3, name: 'સ્કૂટર', icon: '🛵', categoryId: 1 },
    { id: 4, name: 'ટ્રેક્ટર', icon: '🚜', categoryId: 1 },
    { id: 5, name: 'ગાય', icon: '🐄', categoryId: 2 },
    { id: 6, name: 'ભેંસ', icon: '🐃', categoryId: 2 },
    { id: 7, name: 'બકરી', icon: '🐐', categoryId: 2 },
    { id: 8, name: 'ઘોડો', icon: '🐴', categoryId: 2 },
    { id: 9, name: 'મરઘી', icon: '🐔', categoryId: 2 },
    { id: 10, name: 'ખેત', icon: '🌾', categoryId: 3 },
    { id: 11, name: 'જમીન', icon: '🏞️', categoryId: 3 },
    { id: 12, name: 'મકાન', icon: '🏠', categoryId: 3 },
    { id: 13, name: 'મોબાઇલ', icon: '📱', categoryId: 4 },
    { id: 14, name: 'ફર્નિચર', icon: '🪑', categoryId: 4 },
    { id: 15, name: 'નોકરી', icon: '💼', categoryId: 5 },
  ];

//   const handleCategoryClick = (category) => {
//     console.log('Category clicked:', category.name);
//     navigation.navigate('PostListing', { category: category.name });
//   };

const handleCategoryClick = (category) => {
    console.log('Category clicked:', category.name);
    navigation.navigate('PostListing', { 
      category: category.name,
      categoryId: category.categoryId
    });
  };
const handleSearch = async (text) => {
    setSearchQuery(text);
    
    if (text.length < 2) {
      setShowSearchResults(false);
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    setShowSearchResults(true);

    try {
      const response = await apiService.searchPosts(text, 1, 5); // Get only 5 for quick preview
      if (response.success) {
        setSearchResults(response.data.items);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  const handlePostClick = (post) => {
    setShowSearchResults(false);
    setSearchQuery('');
    navigation.navigate('PostDetail', { post });
  };

  const handleViewAllResults = () => {
    setShowSearchResults(false);
    navigation.navigate('PostListing', { 
      category: 'શોધ પરિણામ',
      searchQuery: searchQuery
    });
  };
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.menuButton}>
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>ખરીદવેચાણ</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <Text style={styles.iconText}>🔔</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Text style={styles.iconText}>▶️</Text>
            </TouchableOpacity>
          </View>
        </View>

      
        {/* <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="શોધો..."
            placeholderTextColor="#999"
          />
        </View> */}
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="શોધો..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={handleSearch}
            onFocus={() => searchQuery.length >= 2 && setShowSearchResults(true)}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => {
              setSearchQuery('');
              setShowSearchResults(false);
              setSearchResults([]);
            }}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Search Results Dropdown */}
        {showSearchResults && (
          <View style={styles.searchResultsContainer}>
            {searchLoading ? (
              <View style={styles.searchLoading}>
                <Text style={styles.searchLoadingText}>શોધી રહ્યા છીએ...</Text>
              </View>
            ) : searchResults.length === 0 ? (
              <View style={styles.noResults}>
                <Text style={styles.noResultsText}>કોઈ પરિણામ મળ્યું નથી</Text>
              </View>
            ) : (
              <>
                {searchResults.map((post) => (
                  <TouchableOpacity
                    key={post.postId}
                    style={styles.searchResultItem}
                    onPress={() => handlePostClick(post)}
                  >
                    {post.mainImageUrl ? (
                      <Image source={{ uri: post.mainImageUrl }} style={styles.resultImage} />
                    ) : (
                      <View style={styles.resultNoImage}>
                        <Text style={styles.resultNoImageIcon}>📷</Text>
                      </View>
                    )}
                    <View style={styles.resultInfo}>
                      <Text style={styles.resultTitle} numberOfLines={1}>{post.title}</Text>
                      <Text style={styles.resultPrice}>{post.priceString}</Text>
                      <Text style={styles.resultLocation}>{post.locationString}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
                {searchResults.length >= 5 && (
                  <TouchableOpacity 
                    style={styles.viewAllButton}
                    onPress={handleViewAllResults}
                  >
                    <Text style={styles.viewAllText}>બધા પરિણામો જુઓ →</Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        )}
      </View>

      {/* Main Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Welcome Banner */}
        <View style={styles.banner}>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerText}>🌾 ખેડૂત મિત્રો!</Text>
            <Text style={styles.bannerSubtext}>
              તમારી જરૂરિયાત, અમારી સેવા
            </Text>
          </View>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=200' }}
            style={styles.bannerImage}
          />
        </View>

        {/* Categories Title */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>વિભાગ પસંદ કરો</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>બધા જુઓ →</Text>
          </TouchableOpacity>
        </View>

        {/* Categories Grid */}
        <View style={styles.categoriesGrid}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[styles.categoryCard, { backgroundColor: category.color }]}
              activeOpacity={0.8}
              onPress={() => handleCategoryClick(category)}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={styles.categoryName}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>ઝડપથી</Text>
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionCard}>
              <Text style={styles.actionIcon}>📝</Text>
              <Text style={styles.actionText}>જાહેરાત મૂકો</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Text style={styles.actionIcon}>💰</Text>
              <Text style={styles.actionText}>ભાવ જાણો</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Text style={styles.actionIcon}>🌤️</Text>
              <Text style={styles.actionText}>હવામાન</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Featured Section */}
        <View style={styles.featuredSection}>
          <Text style={styles.sectionTitle}>વૈયાર્ગયું</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[1, 2, 3, 4].map((item) => (
              <View key={item} style={styles.featuredCard}>
                <View style={styles.featuredImage}>
                  <Text style={styles.featuredIcon}>🚜</Text>
                </View>
                <Text style={styles.featuredTitle}>ટ્રેક્ટર</Text>
                <Text style={styles.featuredPrice}>₹ 5,50,000</Text>
                <Text style={styles.featuredLocation}>📍 અમદાવાદ</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Bottom Padding */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('home')}
        >
          <Text style={[styles.navIcon, activeTab === 'home' && styles.navIconActive]}>
            🏠
          </Text>
          <Text style={[styles.navText, activeTab === 'home' && styles.navTextActive]}>
            હોમ
          </Text>
        </TouchableOpacity>

       <TouchableOpacity
  style={styles.navItem}
  onPress={() => navigation.navigate('CreatePost')}
>
          <View style={styles.addButton}>
            <Text style={styles.addIcon}>+</Text>
          </View>
          <Text style={styles.navText}>જાહેરાત કરો</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('favorites')}
        >
          <Text style={[styles.navIcon, activeTab === 'favorites' && styles.navIconActive]}>
            ❤️
          </Text>
          <Text style={[styles.navText, activeTab === 'favorites' && styles.navTextActive]}>
            સાચવેલું
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
  style={styles.navItem}
  onPress={() => navigation.navigate('Account')}
>
  <Text style={[styles.navIcon, activeTab === 'account' && styles.navIconActive]}>
    👤
  </Text>
  <Text style={[styles.navText, activeTab === 'account' && styles.navTextActive]}>
    એકાઉન્ટ
  </Text>
</TouchableOpacity>
      </View>
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
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 15,
  },
  iconText: {
    fontSize: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  content: {
    flex: 1,
  },
  banner: {
    flexDirection: 'row',
    backgroundColor: '#FFF9C4',
    margin: 15,
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    borderLeftWidth: 5,
    borderLeftColor: '#FBC02D',
  },
  bannerContent: {
    flex: 1,
  },
  bannerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F57F17',
    marginBottom: 5,
  },
  bannerSubtext: {
    fontSize: 14,
    color: '#F57F17',
  },
  bannerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  viewAll: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
  },
  categoryCard: {
    width: '31%',
    aspectRatio: 1,
    margin: '1%',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  categoryIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  quickActions: {
    paddingHorizontal: 15,
    marginTop: 20,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
  },
  actionIcon: {
    fontSize: 30,
    marginBottom: 5,
  },
  actionText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
    textAlign: 'center',
  },
  featuredSection: {
    marginTop: 20,
    paddingLeft: 15,
  },
  featuredCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginRight: 15,
    width: 150,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
  },
  featuredImage: {
    width: '100%',
    height: 100,
    backgroundColor: '#F1F8E9',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  featuredIcon: {
    fontSize: 50,
  },
  featuredTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  featuredPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  featuredLocation: {
    fontSize: 12,
    color: '#666',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIcon: {
    fontSize: 24,
    marginBottom: 4,
    opacity: 0.6,
  },
  navIconActive: {
    opacity: 1,
    transform: [{ scale: 1.1 }],
  },
  navText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
  navTextActive: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  addButton: {
    width: 50,
    height: 50,
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  addIcon: {
    fontSize: 30,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  clearIcon: {
    fontSize: 18,
    color: '#999',
    padding: 5,
  },
  searchResultsContainer: {
    position: 'absolute',
    top: 165,
    left: 15,
    right: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    maxHeight: 400,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    zIndex: 1000,
  },
  searchLoading: {
    padding: 20,
    alignItems: 'center',
  },
  searchLoadingText: {
    fontSize: 14,
    color: '#666',
  },
  noResults: {
    padding: 20,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 14,
    color: '#666',
  },
  searchResultItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  resultImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  resultNoImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#F1F8E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  resultNoImageIcon: {
    fontSize: 24,
  },
  resultInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  resultTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  resultPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 2,
  },
  resultLocation: {
    fontSize: 11,
    color: '#666',
  },
  viewAllButton: {
    padding: 15,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#F1F8E9',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
});