import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { apiService } from '../config/api';
import { Shimmer } from '../components/Shimmer';

const { width } = Dimensions.get('window');

export default function BlogListScreen({ navigation }) {
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setError(null);
      const response = await apiService.getFeaturedBlogs(20);

      if (response.success && response.data) {
        setBlogs(response.data);
      } else {
        setError('બ્લોગ લોડ કરવામાં નિષ્ફળ');
      }
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError('બ્લોગ લોડ કરવામાં ભૂલ આવી. કૃપા કરીને ફરી પ્રયાસ કરો.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchBlogs();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const navigateToBlogDetail = (blogId) => {
    // Support both navigation methods
    if (navigation) {
      navigation.navigate('BlogDetail', { blogId });
    } else {
      router.push({
        pathname: '/screens/BlogDetailScreen',
        params: { blogId },
      });
    }
  };

  const renderBlogItem = ({ item, index }) => {
    // Show ad placeholder after every 3 blogs
    const showAd = (index + 1) % 3 === 0;

    return (
      <>
        <TouchableOpacity
          style={styles.blogCard}
          onPress={() => navigateToBlogDetail(item.blogId)}
          activeOpacity={0.7}
        >
          {/* Thumbnail Placeholder */}
          <View style={styles.thumbnailContainer}>
            {item.thumbnailImage ? (
              <View style={styles.thumbnailPlaceholder}>
                <Text style={styles.thumbnailText}>🖼️</Text>
              </View>
            ) : (
              <View style={styles.thumbnailPlaceholder}>
                <Text style={styles.thumbnailText}>📄</Text>
              </View>
            )}
          </View>

          {/* Blog Content */}
          <View style={styles.blogContent}>
            {/* Gujarati Title */}
            <Text style={styles.titleGujarati} numberOfLines={2}>
              {item.titleGujarati}
            </Text>

            {/* English Title */}
            <Text style={styles.titleEnglish} numberOfLines={2}>
              {item.titleEnglish}
            </Text>

            {/* Meta Info */}
            <View style={styles.metaContainer}>
              <View style={styles.metaRow}>
                <Text style={styles.metaText}>✍️ {item.author}</Text>
                <Text style={styles.metaText}>👁️ {item.viewCount}</Text>
              </View>
              <Text style={styles.dateText}>📅 {formatDate(item.createdAt)}</Text>
            </View>

            {/* Featured Badge */}
            {item.isFeatured && (
              <View style={styles.featuredBadge}>
                <Text style={styles.featuredText}>⭐ વિશેષ</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>

        {/* Ad Placeholder */}
        {showAd && (
          <View style={styles.adContainer}>
            <Text style={styles.adText}>📢 જાહેરાત સ્થળ (AdMob Banner)</Text>
            <Text style={styles.adSubText}>320x50 Banner Ad</Text>
          </View>
        )}
      </>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>📚 બ્લોગ</Text>
        <Text style={styles.headerSubtitle}>Blogs</Text>
      </View>
      <Text style={styles.headerDescription}>
        માહિતી અને ટીપ્સ માટે અમારા બ્લોગ વાંચો
      </Text>
    </View>
  );

  const renderFooter = () => {
    if (!loading && blogs.length > 0) {
      return (
        <View style={styles.adContainer}>
          <Text style={styles.adText}>📢 જાહેરાત સ્થળ (AdMob Banner)</Text>
          <Text style={styles.adSubText}>320x50 Banner Ad</Text>
        </View>
      );
    }
    return null;
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📭</Text>
      <Text style={styles.emptyText}>હજુ સુધી કોઈ બ્લોગ ઉપલબ્ધ નથી</Text>
      <Text style={styles.emptySubText}>No blogs available yet</Text>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        {renderHeader()}
        <View style={styles.loadingContainer}>
          {[1, 2, 3, 4].map((i) => (
            <View key={i} style={styles.shimmerCard}>
              <Shimmer width={80} height={80} borderRadius={8} />
              <View style={styles.shimmerContent}>
                <Shimmer width="90%" height={20} borderRadius={4} />
                <Shimmer width="70%" height={16} borderRadius={4} style={{ marginTop: 8 }} />
                <Shimmer width="50%" height={14} borderRadius={4} style={{ marginTop: 8 }} />
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  }

  if (error && !refreshing) {
    return (
      <View style={styles.container}>
        {renderHeader()}
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchBlogs}>
            <Text style={styles.retryButtonText}>ફરી પ્રયાસ કરો</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={blogs}
        renderItem={renderBlogItem}
        keyExtractor={(item) => item.blogId.toString()}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#4CAF50']}
            tintColor="#4CAF50"
          />
        }
        contentContainerStyle={blogs.length === 0 && styles.emptyListContainer}
        showsVerticalScrollIndicator={false}
      />
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
    padding: 20,
    paddingTop: 50,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 8,
  },
  headerSubtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  headerDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  blogCard: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  thumbnailContainer: {
    width: 100,
    height: 120,
    backgroundColor: '#F0F0F0',
  },
  thumbnailPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8E8E8',
  },
  thumbnailText: {
    fontSize: 36,
  },
  blogContent: {
    flex: 1,
    padding: 12,
  },
  titleGujarati: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  titleEnglish: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 8,
  },
  metaContainer: {
    marginTop: 'auto',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  metaText: {
    fontSize: 11,
    color: '#888888',
  },
  dateText: {
    fontSize: 11,
    color: '#888888',
  },
  featuredBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FFA000',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  featuredText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  adContainer: {
    backgroundColor: '#FFF9C4',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFD54F',
    borderStyle: 'dashed',
  },
  adText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#F57C00',
    marginBottom: 4,
  },
  adSubText: {
    fontSize: 12,
    color: '#F57C00',
    opacity: 0.7,
  },
  loadingContainer: {
    padding: 16,
  },
  shimmerCard: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    marginBottom: 12,
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  shimmerContent: {
    flex: 1,
    marginLeft: 12,
  },
  emptyListContainer: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '600',
    marginBottom: 4,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999999',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#D32F2F',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
