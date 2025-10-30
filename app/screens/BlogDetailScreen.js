import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { apiService } from '../config/api';
import { Shimmer } from '../components/Shimmer';

const { width } = Dimensions.get('window');

export default function BlogDetailScreen({ navigation, route }) {
  const router = useRouter();
  const routeParams = useLocalSearchParams();
  // Support both navigation methods
  const blogId = route?.params?.blogId || routeParams.blogId;
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showGujarati, setShowGujarati] = useState(true);

  useEffect(() => {
    if (blogId) {
      fetchBlogDetail();
    }
  }, [blogId]);

  const fetchBlogDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getBlogById(blogId);

      if (response.success && response.data) {
        setBlog(response.data);
      } else {
        setError('બ્લોગ લોડ કરવામાં નિષ્ફળ');
      }
    } catch (err) {
      console.error('Error fetching blog:', err);
      setError('બ્લોગ લોડ કરવામાં ભૂલ આવી. કૃપા કરીને ફરી પ્રયાસ કરો.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const navigateToBlog = (relatedBlogId) => {
    // Support both navigation methods
    if (navigation) {
      navigation.push('BlogDetail', { blogId: relatedBlogId });
    } else {
      router.push({
        pathname: '/screens/BlogDetailScreen',
        params: { blogId: relatedBlogId },
      });
    }
  };

  const goBack = () => {
    if (navigation) {
      navigation.goBack();
    } else {
      router.back();
    }
  };

  const renderRelatedBlog = (relatedBlog) => (
    <TouchableOpacity
      key={relatedBlog.blogId}
      style={styles.relatedBlogCard}
      onPress={() => navigateToBlog(relatedBlog.blogId)}
      activeOpacity={0.7}
    >
      <View style={styles.relatedThumbnail}>
        <Text style={styles.relatedThumbnailText}>📄</Text>
      </View>
      <View style={styles.relatedContent}>
        <Text style={styles.relatedTitleGuj} numberOfLines={2}>
          {relatedBlog.titleGujarati}
        </Text>
        <Text style={styles.relatedTitleEng} numberOfLines={1}>
          {relatedBlog.titleEnglish}
        </Text>
        <View style={styles.relatedMeta}>
          <Text style={styles.relatedMetaText}>✍️ {relatedBlog.author}</Text>
          <Text style={styles.relatedMetaText}>👁️ {relatedBlog.viewCount}</Text>
        </View>
      </View>
      {relatedBlog.isFeatured && (
        <View style={styles.relatedFeaturedBadge}>
          <Text style={styles.relatedFeaturedText}>⭐</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Shimmer width="100%" height={200} borderRadius={0} />
          <View style={styles.loadingContent}>
            <Shimmer width="80%" height={30} borderRadius={4} />
            <Shimmer width="60%" height={20} borderRadius={4} style={{ marginTop: 12 }} />
            <Shimmer width="40%" height={16} borderRadius={4} style={{ marginTop: 12 }} />
            <Shimmer width="100%" height={150} borderRadius={8} style={{ marginTop: 20 }} />
          </View>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchBlogDetail}>
            <Text style={styles.retryButtonText}>ફરી પ્રયાસ કરો</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!blog) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>📭</Text>
          <Text style={styles.errorText}>બ્લોગ મળ્યો નથી</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Image Placeholder */}
      <View style={styles.headerImage}>
        <View style={styles.headerImagePlaceholder}>
          <Text style={styles.headerImageIcon}>📰</Text>
        </View>
        <TouchableOpacity
          style={styles.backButton}
          onPress={goBack}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        {blog.isFeatured && (
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredText}>⭐ વિશેષ</Text>
          </View>
        )}
      </View>

      {/* Ad Space - Top */}
      <View style={styles.adContainer}>
        <Text style={styles.adText}>📢 જાહેરાત સ્થળ (AdMob Banner)</Text>
        <Text style={styles.adSubText}>320x50 Banner Ad</Text>
      </View>

      {/* Blog Content */}
      <View style={styles.contentContainer}>
        {/* Language Toggle */}
        <View style={styles.languageToggle}>
          <TouchableOpacity
            style={[styles.languageButton, showGujarati && styles.languageButtonActive]}
            onPress={() => setShowGujarati(true)}
            activeOpacity={0.7}
          >
            <Text style={[styles.languageButtonText, showGujarati && styles.languageButtonTextActive]}>
              ગુજરાતી
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.languageButton, !showGujarati && styles.languageButtonActive]}
            onPress={() => setShowGujarati(false)}
            activeOpacity={0.7}
          >
            <Text style={[styles.languageButtonText, !showGujarati && styles.languageButtonTextActive]}>
              English
            </Text>
          </TouchableOpacity>
        </View>

        {/* Title */}
        <Text style={styles.title}>
          {showGujarati ? blog.titleGujarati : blog.titleEnglish}
        </Text>

        {/* Meta Info */}
        <View style={styles.metaContainer}>
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>✍️ {blog.author}</Text>
            <Text style={styles.metaText}>👁️ {blog.viewCount} વ્યૂઝ</Text>
          </View>
          <Text style={styles.dateText}>
            📅 {formatDate(blog.createdAt)}
          </Text>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Blog Content */}
        <Text style={styles.blogContent}>
          {showGujarati ? blog.contentGujarati : blog.contentEnglish}
        </Text>

        {/* Ad Space - Middle */}
        <View style={styles.adContainer}>
          <Text style={styles.adText}>📢 જાહેરાત સ્થળ (AdMob Large Banner)</Text>
          <Text style={styles.adSubText}>320x100 Large Banner Ad</Text>
        </View>

        {/* Related Blogs Section */}
        {blog.relatedBlogs && blog.relatedBlogs.length > 0 && (
          <View style={styles.relatedSection}>
            <Text style={styles.relatedTitle}>📚 સંબંધિત બ્લોગ</Text>
            <Text style={styles.relatedSubtitle}>Related Blogs</Text>

            {blog.relatedBlogs.map((relatedBlog) => renderRelatedBlog(relatedBlog))}
          </View>
        )}

        {/* Ad Space - Bottom */}
        <View style={styles.adContainer}>
          <Text style={styles.adText}>📢 જાહેરાત સ્થળ (AdMob Banner)</Text>
          <Text style={styles.adSubText}>320x50 Banner Ad</Text>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  headerImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#E0E0E0',
    position: 'relative',
  },
  headerImagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
  },
  headerImageIcon: {
    fontSize: 72,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  featuredBadge: {
    position: 'absolute',
    top: 40,
    right: 16,
    backgroundColor: '#FFA000',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  featuredText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  contentContainer: {
    backgroundColor: '#FFFFFF',
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  languageToggle: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    padding: 4,
    marginBottom: 20,
  },
  languageButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  languageButtonActive: {
    backgroundColor: '#4CAF50',
  },
  languageButtonText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '600',
  },
  languageButtonTextActive: {
    color: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
    lineHeight: 32,
  },
  metaContainer: {
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  metaText: {
    fontSize: 14,
    color: '#666666',
  },
  dateText: {
    fontSize: 13,
    color: '#999999',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 16,
  },
  blogContent: {
    fontSize: 16,
    lineHeight: 26,
    color: '#444444',
    marginBottom: 24,
  },
  relatedSection: {
    marginTop: 24,
    marginBottom: 16,
  },
  relatedTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  relatedSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
  },
  relatedBlogCard: {
    backgroundColor: '#F9F9F9',
    flexDirection: 'row',
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  relatedThumbnail: {
    width: 80,
    height: 90,
    backgroundColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  relatedThumbnailText: {
    fontSize: 32,
  },
  relatedContent: {
    flex: 1,
    padding: 10,
  },
  relatedTitleGuj: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  relatedTitleEng: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 6,
  },
  relatedMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  relatedMetaText: {
    fontSize: 11,
    color: '#888888',
  },
  relatedFeaturedBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#FFA000',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  relatedFeaturedText: {
    fontSize: 12,
  },
  adContainer: {
    backgroundColor: '#FFF9C4',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFD54F',
    borderStyle: 'dashed',
    marginVertical: 16,
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
    flex: 1,
  },
  loadingContent: {
    padding: 20,
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
  bottomSpacing: {
    height: 20,
  },
});
