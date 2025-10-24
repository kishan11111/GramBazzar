import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { apiService } from '../config/api';
import API_CONFIG from '../config/api';

export default function SearchScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const searchInputRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // Auto-focus on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Debounced search - triggers after user stops typing for 500ms
  useEffect(() => {
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Don't search if query is empty or less than 3 characters
    if (searchQuery.trim().length < 3) {
      setPosts([]);
      setNoResults(false);
      setHasSearched(false);
      return;
    }

    // Set searching state immediately
    setSearching(true);
    setNoResults(false);

    // Set new timeout to search after 500ms
    searchTimeoutRef.current = setTimeout(() => {
      performSearch(searchQuery.trim());
    }, 500);

    // Cleanup
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const performSearch = async (query) => {
    try {
      setLoading(true);
      setHasSearched(true);
      console.log('Searching for:', query);

      const response = await apiService.searchPosts(query, 1, 20, 'NEWEST');

      if (response.success) {
        const results = response.data?.items || [];
        setPosts(results);
        setNoResults(results.length === 0);
        console.log('Search results:', results.length);
      } else {
        setPosts([]);
        setNoResults(true);
      }
    } catch (error) {
      console.error('Search Error:', error);
      setPosts([]);
      setNoResults(true);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  const handlePostClick = (post) => {
    navigation.navigate('PostDetail', { post });
  };

  const clearSearch = () => {
    setSearchQuery('');
    setPosts([]);
    setNoResults(false);
    setHasSearched(false);
    searchInputRef.current?.focus();
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

        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{post.categoryName}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => {
    if (!hasSearched) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={styles.emptyTitle}>શોધો</Text>
          <Text style={styles.emptyText}>તમે જે શોધી રહ્યા છો તે ટાઇપ કરો</Text>
          <Text style={styles.hintText}>ઓછામાં ઓછા 3 અક્ષરો દાખલ કરો</Text>
        </View>
      );
    }

    if (noResults) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>😕</Text>
          <Text style={styles.emptyTitle}>કોઈ પરિણામ મળ્યું નથી</Text>
          <Text style={styles.emptyText}>
            "{searchQuery}" માટે કોઈ જાહેરાત મળી નથી
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={clearSearch}
          >
            <Text style={styles.emptyButtonText}>ફરી પ્રયાસ કરો</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />

      {/* Header with Search Bar */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            ref={searchInputRef}
            style={styles.searchInput}
            placeholder="શોધો..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={clearSearch}
            >
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Search Status */}
      {searching && (
        <View style={styles.searchingContainer}>
          <ActivityIndicator size="small" color="#4CAF50" />
          <Text style={styles.searchingText}>શોધી રહ્યું છે...</Text>
        </View>
      )}

      {/* Results Count */}
      {posts.length > 0 && (
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsText}>
            {posts.length} પરિણામો મળ્યાં
          </Text>
        </View>
      )}

      {/* Posts Grid */}
      {loading && !searching ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>લોડ થઈ રહ્યું છે...</Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          renderItem={renderPostItem}
          keyExtractor={(item) => item.postId.toString()}
          numColumns={2}
          columnWrapperStyle={posts.length > 0 ? styles.postsRow : null}
          contentContainerStyle={styles.postsContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
          keyboardShouldPersistTaps="handled"
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
    marginRight: 10,
  },
  backIcon: {
    fontSize: 28,
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
  clearButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
  },
  clearIcon: {
    fontSize: 14,
    color: '#666',
  },
  searchingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  searchingText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#666',
  },
  resultsHeader: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  resultsText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  postsContainer: {
    padding: 8,
    flexGrow: 1,
  },
  postsRow: {
    justifyContent: 'space-between',
    paddingHorizontal: 4,
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
    marginBottom: 10,
  },
  hintText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  emptyButton: {
    marginTop: 20,
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
});
