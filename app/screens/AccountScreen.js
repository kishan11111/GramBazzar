import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  RefreshControl,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import API_CONFIG, { apiService } from '../config/api';
//import API_CONFIG from '../config/api';
import BottomNavWrapper from '../DynamicBottomNav';
import { AccountPageShimmer } from '../components/Shimmer';

export default function AccountScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('posts');
  const [userData, setUserData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);

      // Load profile
      const profileResponse = await apiService.getUserProfile();
      if (profileResponse.success) {
        setUserData(profileResponse.data);
      }

      // Load user posts - first page
      const postsResponse = await apiService.getMyPosts(1, 10);
      if (postsResponse.success) {
        setUserPosts(postsResponse.data.items);
        setCurrentPage(1);
        // Check if there are more posts
        setHasMore(postsResponse.data.items.length === 10);
      }
    } catch (error) {
      if (error.message.includes('લૉગિન')) {
        Alert.alert('સત્ર સમાપ્ત', error.message, [
          {
            text: 'ઠીક છે',
            onPress: () => {
              AsyncStorage.clear();
              navigation.navigate('Welcome');
            }
          }
        ]);
      } else {
        Alert.alert('ભૂલ', 'ડેટા લોડ કરવામાં સમસ્યા');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);

    }
  };

  const loadMorePosts = async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      const nextPage = currentPage + 1;
      console.log(`Loading page ${nextPage}...`);

      const postsResponse = await apiService.getMyPosts(nextPage, 10);

      if (postsResponse.success && postsResponse.data.items.length > 0) {
        setUserPosts(prevPosts => [...prevPosts, ...postsResponse.data.items]);
        setCurrentPage(nextPage);
        // If we got less than 10 items, there are no more posts
        setHasMore(postsResponse.data.items.length === 10);
        console.log(`Loaded ${postsResponse.data.items.length} more posts`);
      } else {
        setHasMore(false);
        console.log('No more posts to load');
      }
    } catch (error) {
      console.error('Error loading more posts:', error);
      Alert.alert('ભૂલ', 'વધુ પોસ્ટ લોડ કરવામાં સમસ્યા');
    } finally {
      setLoadingMore(false);
    }
  };

const handleShare = async (post) => {
  try {
    const shareMessage = `જુઓ આ જાહેરાત 👇\n\n${post.title}\nકિંમત: ${post.priceString}\n\nજુઓ વધુ વિગત અહીં:\n${API_CONFIG.BASE_URL_Image}${post.mainImageUrl}`;
    
    await Share.share({
      message: shareMessage,
    });
  } catch (error) {
    Alert.alert('ભૂલ', 'શેર કરવામાં મુશ્કેલી આવી');
    console.error(error);
  }
};

  const onRefresh = () => {
    setRefreshing(true);
    loadUserData();
  };

  const handleLogout = () => {
    Alert.alert(
      'લૉગઆઉટ',
      'શું તમે ખરેખર લૉગઆઉટ કરવા માંગો છો?',
      [
        { text: 'રદ કરો', style: 'cancel' },
        { 
          text: 'લૉગઆઉટ', 
          onPress: async () => {
            await AsyncStorage.clear();
            navigation.navigate('Welcome');
          },
          style: 'destructive'
          }
      ]
    );
  };

  const handleDeletePost = (postId) => {
  Alert.alert(
    'ડિલીટ', 
    'શું તમે ખરેખર આ જાહેરાત ડિલીટ કરવા માંગો છો?', 
    [
      { text: 'રદ કરો', style: 'cancel' },
      { 
        text: 'ડિલીટ', 
        style: 'destructive', 
        onPress: async () => {
          try {
            // Call API to delete post
            const response = await apiService.deletePost(postId); 
            if (response.success) {
              // Remove the post from local state
              setUserPosts(prevPosts => prevPosts.filter(post => post.postId !== postId));
              Alert.alert('સફળ', 'જાહેરાત સફળતાપૂર્વક ડિલીટ થઈ ગઈ છે');
            } else {
              Alert.alert('ભૂલ', response.message || 'જાહેરાત ડિલીટ કરવામાં સમસ્યા');
            }
          } catch (error) {
            console.error(error);
            Alert.alert('ભૂલ', 'જાહેરાત ડિલીટ કરવામાં સમસ્યા');
          }
        }
      }
    ]
  );
  };

  const handleMarkAsSold = (post) => {
  if (post.status === 'SOLD') {
    Alert.alert('માહિતી', 'આ પોસ્ટ પહેલેથી જ વેચાઈ ગઈ છે.');
    return;
  }

  Alert.alert(
    'પોસ્ટ વેચાઈ ગઈ?',
    'શું તમારી પોસ્ટ વેચાઈ ગઈ છે?',
    [
      { text: 'ના', style: 'cancel' },
      {
        text: 'હા',
        onPress: async () => {
          try {
            const response = await apiService.updatePostStatus(post.postId, 'SOLD');
            if (response.success) {
              Alert.alert('સફળતા', 'પોસ્ટની સ્થિતિ "વેચાઈ ગઈ" તરીકે અપડેટ થઈ ગઈ છે.');
              // Update the post list locally
              setUserPosts(prevPosts =>
                prevPosts.map(p =>
                  p.postId === post.postId ? { ...p, status: 'SOLD' } : p
                )
              );
            } else {
              Alert.alert('ભૂલ', response.message || 'પોસ્ટ અપડેટ કરવામાં સમસ્યા');
            }
          } catch (error) {
            console.error('❌ Update Post Status Error:', error);
            Alert.alert('ભૂલ', 'પોસ્ટ અપડેટ કરવામાં સમસ્યા આવી');
          }
        }
        }
      ]
    );
  };


 const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const handlePostClick = (post) => {
    navigation.navigate('PostDetail', { post });

  };

  const handleEditPost = (postId) => {
    navigation.navigate('EditPost', { postId });
  };

  const handleMaruCard = async () => {
    try {
      console.log('🎴 Maru Card button clicked');

      // Fetch user's local cards
      const response = await apiService.getMyLocalCards(1, 20);

      console.log('📡 My Cards Response:', JSON.stringify(response, null, 2));

      if (response.success && response.data && response.data.data && response.data.data.length > 0) {
        // User has cards, navigate to the first card's detail page
        const firstCard = response.data.data[0];
        console.log('✅ User has cards, navigating to card:', firstCard.cardId);
        navigation.navigate('LocalCardDetail', { cardId: firstCard.cardId });
      } else {
        // No cards found, navigate to create card screen
        console.log('ℹ️ No cards found, navigating to create card screen');
        navigation.navigate('CreateLocalCard');
      }
    } catch (error) {
      console.error('❌ Error fetching local cards:', error);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error stack:', error.stack);

      // Show more specific error message if available
      const errorMessage = error.message || 'કાર્ડની માહિતી લોડ કરવામાં સમસ્યા';
      Alert.alert('ભૂલ', errorMessage);
    }
  };

  // Calculate total views and favorites
  const totalViews = userPosts.reduce((sum, post) => sum + post.viewCount, 0);
  const totalFavorites = userPosts.reduce((sum, post) => sum + post.favoriteCount, 0);

  if (loading) {
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
          <Text style={styles.headerTitle}>મારું એકાઉન્ટ</Text>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={handleLogout}
          >
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>
        <AccountPageShimmer />
        <BottomNavWrapper navigation={navigation} activeTab="Account" />
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>ડેટા લોડ કરવામાં સમસ્યા</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadUserData}>
          <Text style={styles.retryText}>ફરી પ્રયાસ કરો</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Render post item
  const renderPostItem = ({ item: post }) => {
    console.log('Post:', post.postId, 'Image:', post.mainImageUrl);
    return (
      <TouchableOpacity
        key={post.postId}
        style={styles.postCard}
        onPress={() => handlePostClick(post)}
      >
        {post.mainImageUrl ? (
          <Image
            source={{ uri: `${API_CONFIG.BASE_URL_Image}${post.mainImageUrl}` }}
            style={styles.postImage}
          />
        ) : (
          <View style={styles.noImage}>
            <Text style={styles.noImageIcon}>📷</Text>
          </View>
        )}
        <View style={styles.postDetails}>
          <View style={styles.postHeader}>
            <Text style={styles.postTitle} numberOfLines={1}>{post.title}</Text>
            <TouchableOpacity
              style={[
               styles.statusBadge,
               post.status === 'ACTIVE' && styles.statusActive
          ]}
            onPress={() => handleMarkAsSold(post)}
          >
            <Text style={styles.statusText}>
            {post.status === 'ACTIVE' ? 'સક્રિય' : post.status === 'SOLD' ? 'વેચાઈ ગઈ' : post.status}
            </Text>
          </TouchableOpacity>
          </View>
          <Text style={styles.postPrice}>{post.priceString}</Text>

          <View style={styles.postStats}>
            <View style={styles.postStat}>
              <Text style={styles.statIcon}>👁️</Text>
              <Text style={styles.statValue}>{post.viewCount}</Text>
            </View>
            <View style={styles.postStat}>
              <Text style={styles.statIcon}>❤️</Text>
              <Text style={styles.statValue}>{post.favoriteCount}</Text>
            </View>
            <Text style={styles.postTime}>{post.timeAgo}</Text>
          </View>

          <View style={styles.postActions}>
              <TouchableOpacity
                   style={styles.actionButton}
                  onPress={() => handleDeletePost(post.postId)}
                  >
                <Text style={styles.actionButtonText}>🗑️ ડિલીટ</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.shareButton]}
                onPress={() => handleShare(post)}
                >
              <Text style={styles.shareButtonText}>📤 શેર</Text>
             </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
    );
  };

  // Render footer loading indicator
  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#4CAF50" />
        <Text style={styles.footerText}>વધુ લોડ થઈ રહ્યું છે...</Text>
      </View>
    );
  };

  // Render header component for FlatList
  const renderListHeader = () => (
    <>
      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            {userData.profileImage ? (
              <Image source={{ uri: `${API_CONFIG.BASE_URL_Image}${userData.profileImage}` }} style={styles.avatar} />
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {userData.firstName?.charAt(0) || 'U'}
                </Text>
              </View>
            )}
            {userData.isVerified && (
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedIcon}>✓</Text>
              </View>
            )}
            {userData.isPremium && (
              <View style={styles.premiumBadgeSmall}>
                <Text style={styles.premiumIconSmall}>⭐</Text>
              </View>
            )}
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{userData.fullName}</Text>
            <View style={styles.locationRow}>
              <Text style={styles.locationIcon}>📍</Text>
              <Text style={styles.locationText}>{userData.locationString}</Text>
            </View>
            <View style={styles.contactRow}>
              <Text style={styles.contactIcon}>📱</Text>
              <Text style={styles.contactText}>{userData.mobile}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.editButton}
          onPress={handleEditProfile}
        >
          <Text style={styles.editIcon}>✏️</Text>
          <Text style={styles.editText}>એડિટ પ્રોફાઇલ</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{userPosts.length}</Text>
          <Text style={styles.statLabel}>જાહેરાતો</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalViews}</Text>
          <Text style={styles.statLabel}>Views</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalFavorites}</Text>
          <Text style={styles.statLabel}>Favorites</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>ઝડપી ઍક્શન</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('CreatePost')}
          >
            <Text style={styles.actionIcon}>➕</Text>
            <Text style={styles.actionText}>નવી જાહેરાત</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Favorites')}
          >
            <Text style={styles.actionIcon}>❤️</Text>
            <Text style={styles.actionText}>સાચવેલું</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={handleMaruCard}
          >
            <Text style={styles.actionIcon}>🎴</Text>
            <Text style={styles.actionText}>મારું કાર્ડ</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}>⭐</Text>
            <Text style={styles.actionText}>પ્રીમિયમ</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'posts' && styles.tabActive]}
          onPress={() => setActiveTab('posts')}
        >
          <Text style={[styles.tabText, activeTab === 'posts' && styles.tabTextActive]}>
            મારી જાહેરાતો ({userPosts.length})
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );

  // Empty list component
  const renderEmptyList = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>📭</Text>
      <Text style={styles.emptyTitle}>કોઈ જાહેરાત નથી</Text>
      <Text style={styles.emptyText}>તમે હજી કોઈ જાહેરાત પોસ્ટ કરી નથી</Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={() => navigation.navigate('CreatePost')}
      >
        <Text style={styles.emptyButtonText}>જાહેરાત મૂકો</Text>
      </TouchableOpacity>
    </View>
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
        <Text style={styles.headerTitle}>મારું એકાઉન્ટ</Text>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={handleLogout}
        >
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={userPosts}
        renderItem={renderPostItem}
        keyExtractor={(item) => item.postId.toString()}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={renderEmptyList}
        ListFooterComponent={renderFooter}
        onEndReached={loadMorePosts}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#4CAF50']} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
      />
      <BottomNavWrapper navigation={navigation} activeTab="Account" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  settingsButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsIcon: {
    fontSize: 24,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    margin: 15,
    padding: 20,
    borderRadius: 15,
    elevation: 3,
  },
  profileHeader: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 10,
    backgroundColor: '#2196F3',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  verifiedIcon: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  premiumBadgeSmall: {
    position: 'absolute',
    top: 0,
    right: 10,
    backgroundColor: '#FBC02D',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  premiumIconSmall: {
    fontSize: 12,
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationIcon: {
    fontSize: 14,
    marginRight: 5,
  },
  locationText: {
    fontSize: 13,
    color: '#666',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactIcon: {
    fontSize: 14,
    marginRight: 5,
  },
  contactText: {
    fontSize: 13,
    color: '#666',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F5E9',
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  editIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  editText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 15,
    marginBottom: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 15,
    marginHorizontal: 5,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  actionsSection: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  actionCard: {
    width: '23%',
    aspectRatio: 1,
    backgroundColor: '#F1F8E9',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    margin: '1%',
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  actionIcon: {
    fontSize: 28,
    marginBottom: 5,
  },
  actionText: {
    fontSize: 11,
    color: '#2E7D32',
    fontWeight: '600',
    textAlign: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#4CAF50',
  },
  tabText: {
    fontSize: 15,
    color: '#666',
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  postsSection: {
    backgroundColor: '#FFFFFF',
    padding: 10,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 15,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  postCard: {
    flexDirection: 'row',
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    marginBottom: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  postImage: {
    width: 120,
    height: 120,
    resizeMode: 'cover',
  },
  noImage: {
    width: 120,
    height: 120,
    backgroundColor: '#F1F8E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageIcon: {
    fontSize: 40,
  },
  postDetails: {
    flex: 1,
    padding: 12,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  postTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: '#E0E0E0',
  },
  statusActive: {
    backgroundColor: '#C8E6C9',
  },
  statusText: {
    fontSize: 10,
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  postPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  postStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  postStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  statIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  statValue: {
    fontSize: 12,
    color: '#666',
  },
  postTime: {
    fontSize: 11,
    color: '#999',
    marginLeft: 'auto',
  },
  postActions: {
    flexDirection: 'row',
  },
  actionButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#F5F5F5',
    marginRight: 6,
  },
  actionButtonText: {
    fontSize: 11,
    color: '#666',
  },
  shareButton: {
    backgroundColor: '#E8F5E9',
  },
  shareButtonText: {
    color: '#2E7D32',
    fontSize: 11,
    fontWeight: '600',
  },
  premiumBanner: {
    backgroundColor: '#FFF9C4',
    marginHorizontal: 15,
    marginTop: 15,
    padding: 20,
    borderRadius: 15,
    borderLeftWidth: 5,
    borderLeftColor: '#FBC02D',
  },
  premiumContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  premiumIcon: {
    fontSize: 40,
    marginRight: 15,
  },
  premiumText: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F57F17',
    marginBottom: 4,
  },
  premiumSubtitle: {
    fontSize: 13,
    color: '#F57F17',
  },
  premiumButton: {
    backgroundColor: '#FBC02D',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  premiumButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  flatListContent: {
    paddingBottom: 80,
  },
});