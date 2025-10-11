import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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

export default function PostListingScreen({ route, navigation }) {
  const { category, categoryId } = route.params || { category: 'બાઇક', categoryId: 1 };
  
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // useEffect(() => {
  //   loadPosts();
  // }, [categoryId]);
useEffect(() => {
    loadPosts();
  }, [categoryId, searchQuery]);
  // const loadPosts = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await apiService.getPostsByCategory(categoryId);
      
  //     if (response.success) {
  //       setPosts(response.data.items);
  //     } else {
  //       Alert.alert('ભૂલ', 'પોસ્ટ લોડ કરવામાં સમસ્યા');
  //     }
  //   } catch (error) {
  //     Alert.alert('ભૂલ', 'કનેક્શન સમસ્યા');
  //     console.error('Load Posts Error:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const loadPosts = async () => {
    try {
      setLoading(true);
      let response;
      
      if (searchQuery) {
        // Search mode
        response = await apiService.searchPosts(searchQuery);
      } else {
        // Category mode
        response = await apiService.getPostsByCategory(categoryId);
      }
      
      if (response.success) {
        setPosts(response.data.items);
      } else {
        Alert.alert('ભૂલ', 'પોસ્ટ લોડ કરવામાં સમસ્યા');
      }
    } catch (error) {
      Alert.alert('ભૂલ', 'કનેક્શન સમસ્યા');
      console.error('Load Posts Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostClick = (post) => {
    navigation.navigate('PostDetail', { post });
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
          style={styles.sortButton}
          onPress={loadPosts}
        >
          <Text style={styles.sortIcon}>🔄</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder={`${category} શોધો...`}
            placeholderTextColor="#999"
          />
        </View>
      </View>

      {/* Posts Grid */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>લોડ થઈ રહ્યું છે...</Text>
        </View>
      ) : posts.length === 0 ? (
        renderEmptyState()
      ) : (
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.postsGrid}>
            {posts.map((post) => (
              <TouchableOpacity
                key={post.postId}
                style={styles.postCard}
                activeOpacity={0.9}
                onPress={() => handlePostClick(post)}
              >
                {/* Post Image */}
                <View style={styles.imageContainer}>
                  {post.mainImageUrl ? (
                    <Image
                      source={{ uri: post.mainImageUrl }}
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
                    <TouchableOpacity style={styles.favoriteButton}>
                      <Text style={styles.favoriteIcon}>🤍</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{post.subCategoryName}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Load More Button */}
          {posts.length > 0 && (
            <TouchableOpacity style={styles.loadMoreButton}>
              <Text style={styles.loadMoreText}>વધુ જુઓ</Text>
            </TouchableOpacity>
          )}

          <View style={{ height: 20 }} />
        </ScrollView>
      )}

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('CreatePost')}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
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
  sortButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sortIcon: {
    fontSize: 20,
  },
  searchSection: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  searchBar: {
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
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
  postsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  postCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    margin: '1%',
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
});