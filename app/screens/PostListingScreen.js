import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
  Dimensions,
  FlatList,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { PostsGridShimmer } from '../components/Shimmer';
import { apiService } from '../config/api';
import API_CONFIG from '../config/api';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function PostListingScreen({ route, navigation }) {
  const { category, categoryId } = route.params || { category: 'બાઇક', categoryId: 1 };

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Filter states
  const [filterVisible, setFilterVisible] = useState(false);
  const [slideAnim] = useState(new Animated.Value(SCREEN_HEIGHT));

  // Filter values
  const [districts, setDistricts] = useState([]);
  const [talukas, setTalukas] = useState([]);
  const [villages, setVillages] = useState([]);

  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedTaluka, setSelectedTaluka] = useState(null);
  const [selectedVillage, setSelectedVillage] = useState(null);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('NEWEST');

  // Dropdown states
  const [districtDropdownOpen, setDistrictDropdownOpen] = useState(false);
  const [talukaDropdownOpen, setTalukaDropdownOpen] = useState(false);
  const [villageDropdownOpen, setVillageDropdownOpen] = useState(false);

  useEffect(() => {
    console.log('🚀 INITIAL LOAD - Category changed:', categoryId);
    loadPosts();
    loadDistricts();
  }, [categoryId]);

  const loadDistricts = async () => {
    try {
      const response = await apiService.getDistricts();
      if (response.success) {
        setDistricts(response.data);
      }
    } catch (error) {
      console.error('Load Districts Error:', error);
    }
  };

  const loadTalukas = async (districtId) => {
    try {
      const response = await apiService.getTalukas(districtId);
      if (response.success) {
        setTalukas(response.data);
      }
    } catch (error) {
      console.error('Load Talukas Error:', error);
    }
  };

  const loadVillages = async (talukaId) => {
    try {
      const response = await apiService.getVillages(talukaId);
      if (response.success) {
        setVillages(response.data);
      }
    } catch (error) {
      console.error('Load Villages Error:', error);
    }
  };

  const loadPosts = async (filters = {}, pageNumber = 1, append = false) => {
    try {
      console.log('========================================');
      console.log('📡 API CALL - Loading Posts');
      console.log('Page Number:', pageNumber);
      console.log('Page Size:', 10);
      console.log('Append Mode:', append ? 'Yes (Loading More)' : 'No (Fresh Load)');
      console.log('Category ID:', categoryId);
      console.log('Filters:', filters);
      console.log('========================================');

      if (!append) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      // Use filtered API if filters are applied, otherwise use category API
      const hasFilters = filters.districtId || filters.talukaId || filters.villageId ||
                         filters.minPrice || filters.maxPrice;

      let response;
      if (hasFilters) {
        console.log('🔍 Using Filtered API');
        response = await apiService.getPostsWithFilters({
          categoryId,
          ...filters,
          pageNumber,
          pageSize: 10 // Load 10 posts at a time
        });
      } else {
        console.log('📂 Using Category API');
        response = await apiService.getPostsByCategory(
          categoryId,
          pageNumber,
          10, // Load 10 posts at a time
          sortBy
        );
      }

      console.log('✅ API Response Received');
      console.log('Success:', response.success);
      console.log('Items Received:', response.data?.items?.length || 0);
      console.log('Total Posts in State:', append ? posts.length + (response.data?.items?.length || 0) : response.data?.items?.length || 0);

      if (response.success) {
        const newPosts = response.data.items || [];

        if (append) {
          setPosts(prevPosts => {
            console.log('📝 Appending posts. Previous:', prevPosts.length, 'New:', newPosts.length, 'Total:', prevPosts.length + newPosts.length);
            return [...prevPosts, ...newPosts];
          });
        } else {
          setPosts(newPosts);
          console.log('📝 Setting fresh posts:', newPosts.length);
        }

        // Check if there are more posts to load
        const hasMorePosts = newPosts.length === 10;
        setHasMore(hasMorePosts);
        setCurrentPage(pageNumber);
        console.log('Has More Posts:', hasMorePosts);
        console.log('========================================\n');
      } else {
        console.error('❌ API Error:', response.message || 'Unknown error');
        Alert.alert('ભૂલ', 'પોસ્ટ લોડ કરવામાં સમસ્યા');
      }
    } catch (error) {
      console.error('❌ Exception in loadPosts:', error);
      Alert.alert('ભૂલ', 'કનેક્શન સમસ્યા');
      console.error('Load Posts Error:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMorePosts = async () => {
    if (loadingMore || !hasMore || loading) {
      console.log('⏸️ Load More Blocked - loadingMore:', loadingMore, 'hasMore:', hasMore, 'loading:', loading);
      return;
    }

    const nextPage = currentPage + 1;
    console.log('⬇️ LOAD MORE TRIGGERED - Loading page', nextPage);
    await loadPosts({}, nextPage, true);
  };

  const handleRefresh = async () => {
    console.log('🔄 REFRESH TRIGGERED - Reloading page 1');
    setRefreshing(true);
    setCurrentPage(1);
    setHasMore(true);
    await loadPosts({}, 1, false);
    setRefreshing(false);
  };

  const handlePostClick = (post) => {
    navigation.navigate('PostDetail', { post });
  };

  const openFilterModal = () => {
    setFilterVisible(true);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
    }).start();
  };

  const closeFilterModal = () => {
    Animated.timing(slideAnim, {
      toValue: SCREEN_HEIGHT,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setFilterVisible(false);
    });
  };

  const handleDistrictSelect = (district) => {
    setSelectedDistrict(district);
    setSelectedTaluka(null);
    setSelectedVillage(null);
    setTalukas([]);
    setVillages([]);
    loadTalukas(district.districtId);
    setDistrictDropdownOpen(false);
  };

  const handleTalukaSelect = (taluka) => {
    setSelectedTaluka(taluka);
    setSelectedVillage(null);
    setVillages([]);
    loadVillages(taluka.talukaId);
    setTalukaDropdownOpen(false);
  };

  const handleVillageSelect = (village) => {
    setSelectedVillage(village);
    setVillageDropdownOpen(false);
  };

  const applyFilters = () => {
    const filters = {
      districtId: selectedDistrict?.districtId,
      talukaId: selectedTaluka?.talukaId,
      villageId: selectedVillage?.villageId,
      minPrice: minPrice ? parseInt(minPrice) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
      sortBy: sortBy,
    };

    console.log('🔧 FILTERS APPLIED - Resetting to Page 1');
    console.log('Applied Filters:', filters);

    // Reset pagination when applying filters
    setCurrentPage(1);
    setHasMore(true);
    loadPosts(filters, 1, false);
    closeFilterModal();
  };

  const resetFilters = () => {
    console.log('🔄 FILTERS RESET - Resetting to Page 1');

    setSelectedDistrict(null);
    setSelectedTaluka(null);
    setSelectedVillage(null);
    setTalukas([]);
    setVillages([]);
    setMinPrice('');
    setMaxPrice('');
    setSortBy('NEWEST');

    // Reset pagination when resetting filters
    setCurrentPage(1);
    setHasMore(true);
    loadPosts({}, 1, false);
    closeFilterModal();
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>📭</Text>
      <Text style={styles.emptyTitle}>કોઈ જાહેરાત નથી</Text>
      <Text style={styles.emptyText}>આ કેટેગરીમાં હજી કોઈ જાહેરાત નથી</Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={() => navigation.navigate('CreatePost')}
      >
        <Text style={styles.emptyButtonText}>પ્રથમ જાહેરાત મૂકો</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#4CAF50" />
        <Text style={styles.footerText}>વધુ લોડ થઈ રહ્યું છે...</Text>
      </View>
    );
  };

  const renderPostItem = ({ item: post }) => (
    <TouchableOpacity
      style={styles.postCard}
      activeOpacity={0.9}
      onPress={() => handlePostClick(post)}
    >
      {/* Post Image */}
      <View style={styles.imageContainer}>
        {post.mainImageUrl ? (
          <Image
            source={{ uri: `${API_CONFIG.BASE_URL_Image}${post.mainImageUrl}` }}
            style={styles.postImage}
          />
        ) : (
          <View style={styles.noImage}>
            <Text style={styles.noImageIcon}>📷</Text>
            <Text style={styles.noImageText}>ફોટો નથી</Text>
          </View>
        )}
        {post.isFeatured && (
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredIcon}>⭐</Text>
          </View>
        )}
        <View style={styles.timeBadge}>
          <Text style={styles.timeText}>{post.timeAgo}</Text>
        </View>
      </View>

      {/* Post Details */}
      <View style={styles.postDetails}>
        <Text style={styles.postTitle} numberOfLines={1}>
          {post.title}
        </Text>
        <Text style={styles.postPrice}>{post.priceString}</Text>

        <View style={styles.postInfo}>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>📍</Text>
            <Text style={styles.infoText} numberOfLines={1}>
              {post.locationString}
            </Text>
          </View>
        </View>

        <View style={styles.postFooter}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>👁️</Text>
              <Text style={styles.statText}>{post.viewCount}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>❤️</Text>
              <Text style={styles.statText}>{post.favoriteCount}</Text>
            </View>
          </View>
        </View>
      </View>
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
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{category}</Text>
          <Text style={styles.headerSubtitle}>{posts.length} જાહેરાતો</Text>
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={openFilterModal}
        >
          <Text style={styles.filterIcon}>⚙</Text>
          <Text style={styles.filterText}>ફિલ્ટર</Text>
        </TouchableOpacity>
      </View>

      {/* Posts Grid */}
      {loading ? (
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <PostsGridShimmer />
          <PostsGridShimmer />
        </ScrollView>
      ) : (
        <FlatList
          data={posts}
          renderItem={renderPostItem}
          keyExtractor={(item) => item.postId.toString()}
          numColumns={2}
          columnWrapperStyle={styles.postsRow}
          contentContainerStyle={styles.postsContainer}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMorePosts}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#4CAF50']}
              tintColor="#4CAF50"
            />
          }
        />
      )}

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreatePost')}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      {/* Filter Bottom Sheet Modal */}
      <Modal
        visible={filterVisible}
        transparent={true}
        animationType="none"
        onRequestClose={closeFilterModal}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackground}
            activeOpacity={1}
            onPress={closeFilterModal}
          />
          <Animated.View
            style={[
              styles.filterBottomSheet,
              { transform: [{ translateY: slideAnim }] }
            ]}
          >
            {/* Filter Header */}
            <View style={styles.filterHeader}>
              <TouchableOpacity onPress={closeFilterModal} style={styles.closeButton}>
                <Text style={styles.closeIcon}>←</Text>
              </TouchableOpacity>
              <Text style={styles.filterHeaderTitle}>ફિલ્ટર</Text>
              <TouchableOpacity onPress={resetFilters} style={styles.resetHeaderButton}>
                <Text style={styles.resetHeaderText}>રીસેટ કરો</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.filterContent}
              contentContainerStyle={styles.filterContentContainer}
              showsVerticalScrollIndicator={false}
            >
              {/* Price Range Section */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>કિંમત રેન્જ</Text>
                <View style={styles.priceInputRow}>
                  <View style={styles.priceInputContainer}>
                    <Text style={styles.priceInputLabel}>ન્યૂનતમ કિંમત</Text>
                    <TextInput
                      style={styles.priceInput}
                      placeholder="₹ 0"
                      placeholderTextColor="#999"
                      keyboardType="numeric"
                      value={minPrice}
                      onChangeText={setMinPrice}
                    />
                  </View>
                  <View style={styles.priceInputContainer}>
                    <Text style={styles.priceInputLabel}>મહત્તમ કિંમત</Text>
                    <TextInput
                      style={styles.priceInput}
                      placeholder="₹ મહત્તમ"
                      placeholderTextColor="#999"
                      keyboardType="numeric"
                      value={maxPrice}
                      onChangeText={setMaxPrice}
                    />
                  </View>
                </View>
              </View>

              {/* Location Section */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>સ્થળ</Text>

                {/* Gujarat State - Static */}
                <TouchableOpacity style={styles.locationItem}>
                  <Text style={styles.locationItemText}>ગુજરાત</Text>
                  <Text style={styles.locationItemIcon}>›</Text>
                </TouchableOpacity>

                {/* District Dropdown */}
                <TouchableOpacity
                  style={styles.locationItem}
                  onPress={() => setDistrictDropdownOpen(!districtDropdownOpen)}
                >
                  <Text style={[styles.locationItemText, !selectedDistrict && styles.placeholderText]}>
                    {selectedDistrict ? (selectedDistrict.districtNameGujarati || selectedDistrict.districtNameEnglish) : 'બધા જિલ્લા'}
                  </Text>
                  <Text style={styles.locationItemIcon}>›</Text>
                </TouchableOpacity>
                {districtDropdownOpen && (
                  <View style={styles.dropdownList}>
                    <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
                      {districts && districts.length > 0 ? (
                        districts.map((district, index) => (
                          <TouchableOpacity
                            key={`district-${district.districtId || index}`}
                            style={styles.dropdownItem}
                            onPress={() => handleDistrictSelect(district)}
                          >
                            <Text style={styles.dropdownItemText}>
                              {district.districtNameGujarati || district.districtNameEnglish || district.districtName || 'Unknown'}
                            </Text>
                          </TouchableOpacity>
                        ))
                      ) : (
                        <View style={styles.dropdownItem}>
                          <Text style={styles.dropdownItemText}>લોડ થઈ રહ્યું છે...</Text>
                        </View>
                      )}
                    </ScrollView>
                  </View>
                )}

                {/* Taluka Dropdown */}
                {selectedDistrict && (
                  <TouchableOpacity
                    style={styles.locationItem}
                    onPress={() => setTalukaDropdownOpen(!talukaDropdownOpen)}
                  >
                    <Text style={[styles.locationItemText, !selectedTaluka && styles.placeholderText]}>
                      {selectedTaluka ? (selectedTaluka.talukaNameGujarati || selectedTaluka.talukaNameEnglish) : 'બધા તાલુકા'}
                    </Text>
                    <Text style={styles.locationItemIcon}>›</Text>
                  </TouchableOpacity>
                )}
                {talukaDropdownOpen && (
                  <View style={styles.dropdownList}>
                    <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
                      {talukas && talukas.length > 0 ? (
                        talukas.map((taluka, index) => (
                          <TouchableOpacity
                            key={`taluka-${taluka.talukaId || index}`}
                            style={styles.dropdownItem}
                            onPress={() => handleTalukaSelect(taluka)}
                          >
                            <Text style={styles.dropdownItemText}>
                              {taluka.talukaNameGujarati || taluka.talukaNameEnglish || taluka.talukaName || 'Unknown'}
                            </Text>
                          </TouchableOpacity>
                        ))
                      ) : (
                        <View style={styles.dropdownItem}>
                          <Text style={styles.dropdownItemText}>લોડ થઈ રહ્યું છે...</Text>
                        </View>
                      )}
                    </ScrollView>
                  </View>
                )}

                {/* Village Dropdown */}
                {selectedTaluka && (
                  <TouchableOpacity
                    style={styles.locationItem}
                    onPress={() => setVillageDropdownOpen(!villageDropdownOpen)}
                  >
                    <Text style={[styles.locationItemText, !selectedVillage && styles.placeholderText]}>
                      {selectedVillage ? (selectedVillage.villageNameGujarati || selectedVillage.villageNameEnglish) : 'બધા ગામો'}
                    </Text>
                    <Text style={styles.locationItemIcon}>›</Text>
                  </TouchableOpacity>
                )}
                {villageDropdownOpen && (
                  <View style={styles.dropdownList}>
                    <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
                      {villages && villages.length > 0 ? (
                        villages.map((village, index) => (
                          <TouchableOpacity
                            key={`village-${village.villageId || index}`}
                            style={styles.dropdownItem}
                            onPress={() => handleVillageSelect(village)}
                          >
                            <Text style={styles.dropdownItemText}>
                              {village.villageNameGujarati || village.villageNameEnglish || village.villageName || 'Unknown'}
                            </Text>
                          </TouchableOpacity>
                        ))
                      ) : (
                        <View style={styles.dropdownItem}>
                          <Text style={styles.dropdownItemText}>લોડ થઈ રહ્યું છે...</Text>
                        </View>
                      )}
                    </ScrollView>
                  </View>
                )}
              </View>

              <View style={{ height: 100 }} />
            </ScrollView>

            {/* Apply Button */}
            <View style={styles.filterFooter}>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={applyFilters}
              >
                <Text style={styles.applyButtonText}>ફિલ્ટર કરો</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
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
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  headerCenter: {
    flex: 1,
    marginLeft: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#E8F5E9',
    marginTop: 2,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
  filterIcon: {
    fontSize: 16,
    color: '#FFFFFF',
    marginRight: 4,
  },
  filterText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  emptyButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  postsContainer: {
    padding: 8,
    paddingBottom: 80,
  },
  postsRow: {
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  postsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  postCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    margin: 4,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 180,
  },
  postImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  noImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F1F8E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageIcon: {
    fontSize: 50,
    marginBottom: 8,
  },
  noImageText: {
    fontSize: 14,
    color: '#666',
  },
  featuredBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FBC02D',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredIcon: {
    fontSize: 14,
  },
  timeBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  timeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  postDetails: {
    padding: 10,
  },
  postTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  postPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  postInfo: {
    marginBottom: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  infoText: {
    fontSize: 11,
    color: '#666',
    flex: 1,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  statIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  statText: {
    fontSize: 11,
    color: '#666',
  },
  favoriteButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteIcon: {
    fontSize: 18,
  },
  categoryBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 10,
    color: '#2E7D32',
    fontWeight: '600',
  },
  loadMoreButton: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 15,
    marginTop: 15,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  loadMoreText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  fabIcon: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  // Filter Bottom Sheet Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  filterBottomSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: SCREEN_HEIGHT * 0.75,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  closeButton: {
    padding: 4,
  },
  closeIcon: {
    fontSize: 24,
    color: '#333',
  },
  filterHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  resetHeaderButton: {
    paddingHorizontal: 8,
  },
  resetHeaderText: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '600',
  },
  filterContent: {
    flex: 1,
  },
  filterContentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  priceInputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceInputContainer: {
    flex: 1,
    marginHorizontal: 6,
  },
  priceInputLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  priceInput: {
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#FAFAFA',
  },
  locationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
  },
  locationItemText: {
    fontSize: 15,
    color: '#333',
  },
  placeholderText: {
    color: '#999',
  },
  locationItemIcon: {
    fontSize: 20,
    color: '#999',
  },
  dropdownList: {
    backgroundColor: '#F9F9F9',
    maxHeight: 200,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  dropdownScroll: {
    maxHeight: 200,
  },
  dropdownItem: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#333',
  },
  filterFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  applyButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
