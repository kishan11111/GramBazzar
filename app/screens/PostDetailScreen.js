import React, { useState, useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Linking,
  Modal,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { apiService } from '../config/api';
import API_CONFIG from '../config/api';
import { PostDetailShimmer } from '../components/Shimmer';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function PostDetailScreen({ route, navigation }) {
  const { post: initialPost } = route.params;

  const [postDetail, setPostDetail] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fullScreenVisible, setFullScreenVisible] = useState(false);
  const [fullScreenImageIndex, setFullScreenImageIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const fullScreenScrollRef = useRef(null);

  useEffect(() => {
    loadPostDetail();
  }, []);

  const loadPostDetail = async () => {
    try {
      setLoading(true);
      const response = await apiService.getPostById(initialPost.postId);

      if (response.success) {
        setPostDetail(response.data);
      } else {
        Alert.alert('ભૂલ', 'પોસ્ટ વિગત લોડ કરવામાં સમસ્યા');
      }
    } catch (error) {
      Alert.alert('ભૂલ', 'કનેક્શન સમસ્યા');
      console.error('Load Post Detail Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCall = () => {
    if (postDetail?.contactPhone) {
      Linking.openURL(`tel:${postDetail.contactPhone}`);
    }
  };

  const handleToggleFavorite = async () => {
    setFavoriteLoading(true);
    try {
      const response = await apiService.toggleFavoritePost(postDetail.postId);
      if (response.success) {
        setIsFavorite(!isFavorite);
        Alert.alert(
          'સફળતા',
          isFavorite ? 'સાચવેલમાંથી દૂર કર્યું' : 'સાચવેલમાં ઉમેર્યું'
        );
      }
    } catch (error) {
      if (error.message.includes('લૉગિન')) {
        Alert.alert('સત્ર સમાપ્ત', error.message, [
          {
            text: 'ઠીક છે',
            onPress: () => navigation.navigate('Welcome')
          }
        ]);
      } else {
        Alert.alert('ભૂલ', 'કનેક્શન સમસ્યા');
      }
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleWhatsApp = () => {
    if (postDetail?.contactPhone && postDetail?.title && postDetail?.priceString) {
      const message = `હેલો, હું ${postDetail.title} વિશે પૂછપરછ કરવા માંગું છું. કિંમત: ${postDetail.priceString}`;
      Linking.openURL(`whatsapp://send?phone=${postDetail.contactPhone}&text=${encodeURIComponent(message)}`);
    }
  };

  const handleShare = async () => {
    try {
      // Generate deep link for the post
      const postUrl = `${API_CONFIG.BASE_URL_Image}post/${postDetail.postId}`;

      // Create share message
      const shareMessage = `જુઓ આ જાહેરાત 👇\n\n${postDetail.title}\nકિંમત: ${postDetail.priceString}\n\n${postDetail.description ? postDetail.description.substring(0, 100) + '...\n\n' : ''}જુઓ વધુ વિગત અહીં:\n${postUrl}`;

      const result = await Share.share({
        message: shareMessage,
        title: postDetail.title,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Shared with activity type of result.activityType
          console.log('Shared via:', result.activityType);
        } else {
          // Shared successfully
          Alert.alert('શેર કર્યું', 'પોસ્ટ સફળતાપૂર્વક શેર કરવામાં આવી');
        }
      } else if (result.action === Share.dismissedAction) {
        // Dismissed
        console.log('Share dismissed');
      }
    } catch (error) {
      console.error('Share error:', error);
      Alert.alert('ભૂલ', 'શેર કરવામાં સમસ્યા');
    }
  };

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / SCREEN_WIDTH);
    setCurrentImageIndex(index);
  };

  const handleFullScreenScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / SCREEN_WIDTH);
    setFullScreenImageIndex(index);
  };

  const openFullScreen = (index) => {
    setFullScreenImageIndex(index);
    setFullScreenVisible(true);
    // Scroll to the selected image after modal opens
    setTimeout(() => {
      fullScreenScrollRef.current?.scrollTo({
        x: index * SCREEN_WIDTH,
        animated: false,
      });
    }, 100);
  };

  const closeFullScreen = () => {
    setFullScreenVisible(false);
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    return `${API_CONFIG.BASE_URL_Image}${imageUrl}`;
  };

  // Get images array from post detail
  const images = postDetail?.images || [];
  const hasImages = images.length > 0;

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>વિગત</Text>
          <View style={styles.favoriteHeaderButton} />
        </View>
        <PostDetailShimmer />
      </View>
    );
  }

  if (!postDetail) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>વિગત</Text>
          <View style={styles.favoriteHeaderButton} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>પોસ્ટ મળી નથી</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadPostDetail}
          >
            <Text style={styles.retryButtonText}>ફરી પ્રયાસ કરો</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

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
        <Text style={styles.headerTitle}>વિગત</Text>
        <TouchableOpacity
          style={styles.favoriteHeaderButton}
          onPress={handleToggleFavorite}
          disabled={favoriteLoading}
        >
          {favoriteLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.favoriteHeaderIcon}>
              {isFavorite ? '❤️' : '🤍'}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        <View style={styles.imageGallery}>
          {hasImages ? (
            <>
              <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
              >
                {images.map((image, index) => (
                  <TouchableOpacity
                    key={image.imageId}
                    activeOpacity={0.9}
                    onPress={() => openFullScreen(index)}
                  >
                    <Image
                      source={{ uri: getImageUrl(image.imageUrl) }}
                      style={styles.mainImage}
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Image Counter */}
              <View style={styles.imageCounter}>
                <Text style={styles.imageCounterText}>
                  {currentImageIndex + 1} / {images.length}
                </Text>
              </View>

              {/* Pagination Dots */}
              {images.length > 1 && (
                <View style={styles.pagination}>
                  {images.map((_, index) => (
                    <View
                      key={index}
                      style={[
                        styles.paginationDot,
                        currentImageIndex === index && styles.paginationDotActive,
                      ]}
                    />
                  ))}
                </View>
              )}
            </>
          ) : (
            <View style={styles.noImageContainer}>
              <Text style={styles.noImageIcon}>📷</Text>
              <Text style={styles.noImageText}>ફોટો ઉપલબ્ધ નથી</Text>
            </View>
          )}
          {postDetail.isFeatured && (
            <View style={styles.featuredBadge}>
              <Text style={styles.featuredIcon}>⭐</Text>
              <Text style={styles.featuredText}>ફીચર્ડ</Text>
            </View>
          )}
        </View>

        {/* Price Section */}
        <View style={styles.priceSection}>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{postDetail.priceString}</Text>
            <Text style={styles.priceLabel}>{postDetail.priceType}</Text>
          </View>
          <View style={styles.timeContainer}>
            <Text style={styles.timeIcon}>🕐</Text>
            <Text style={styles.timeText}>
              {postDetail.daysOld === 0 ? 'આજે' : `${postDetail.daysOld} દિવસ પહેલાં`}
            </Text>
          </View>
        </View>

        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{postDetail.title}</Text>
          <View style={styles.locationRow}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.location}>{postDetail.locationString}</Text>
          </View>
        </View>

        {/* Description */}
        {postDetail.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📝 વર્ણન</Text>
            <Text style={styles.description}>{postDetail.description}</Text>
          </View>
        )}

        {/* Quick Info */}
        <View style={styles.quickInfoSection}>
          <TouchableOpacity style={styles.infoCard} onPress={handleShare} activeOpacity={0.7}>
            <Text style={styles.infoIcon}>📤</Text>
            <Text style={styles.infoLabel}>શેર કરો</Text>
            <Text style={styles.infoValue}>Share</Text>
          </TouchableOpacity>
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>👁️</Text>
            <Text style={styles.infoLabel}>Views</Text>
            <Text style={styles.infoValue}>{postDetail.viewCount}</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>❤️</Text>
            <Text style={styles.infoLabel}>Favorites</Text>
            <Text style={styles.infoValue}>{postDetail.favoriteCount}</Text>
          </View>
        </View>

        {/* Category Info */}
        <View style={styles.categorySection}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryLabel}>કેટેગરી:</Text>
            <Text style={styles.categoryValue}>{postDetail.categoryName}</Text>
          </View>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryLabel}>પ્રકાર:</Text>
            <Text style={styles.categoryValue}>{postDetail.subCategoryName}</Text>
          </View>
        </View>

        {/* Post ID for Reference */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 પોસ્ટ માહિતી</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoRowLabel}>પોસ્ટ ID:</Text>
            <Text style={styles.infoRowValue}>#{postDetail.postId}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoRowLabel}>સ્ટેટસ:</Text>
            <Text style={[styles.infoRowValue, styles.statusActive]}>{postDetail.status}</Text>
          </View>
          {postDetail.address && (
            <View style={styles.infoRow}>
              <Text style={styles.infoRowLabel}>સરનામું:</Text>
              <Text style={styles.infoRowValue}>{postDetail.address}</Text>
            </View>
          )}
        </View>

        {/* Contact Information */}
        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>📞 સંપર્ક માહિતી</Text>
          <View style={styles.contactCard}>
            <View style={styles.contactAvatar}>
              <Text style={styles.contactAvatarText}>👤</Text>
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>{postDetail.userName}</Text>
              <Text style={styles.contactPhone}>
                {postDetail.contactPhone || postDetail.userMobile}
                {postDetail.userVerified && ' ✓'}
              </Text>
              <Text style={styles.contactLocation}>📍 {postDetail.locationString}</Text>
            </View>
          </View>
        </View>

        {/* Safety Tips */}
        <View style={styles.safetySection}>
          <Text style={styles.safetyTitle}>🛡️ સલામતી ટિપ્સ</Text>
          <View style={styles.safetyTip}>
            <Text style={styles.safetyIcon}>•</Text>
            <Text style={styles.safetyText}>ખરીદતા પહેલા વસ્તુનું સારી રીતે નિરીક્ષણ કરો</Text>
          </View>
          <View style={styles.safetyTip}>
            <Text style={styles.safetyIcon}>•</Text>
            <Text style={styles.safetyText}>સાર્વજનિક જગ્યાએ મળો અને પૈસા અગાઉથી ના આપો</Text>
          </View>
          <View style={styles.safetyTip}>
            <Text style={styles.safetyIcon}>•</Text>
            <Text style={styles.safetyText}>શંકાસ્પદ જાહેરાત હોય તો રિપોર્ટ કરો</Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.callButton}
          onPress={handleCall}
        >
          <Text style={styles.callIcon}>📞</Text>
          <Text style={styles.callText}>કૉલ કરો</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.whatsappButton}
          onPress={handleWhatsApp}
        >
          <Text style={styles.whatsappIcon}>💬</Text>
          <Text style={styles.whatsappText}>WhatsApp</Text>
        </TouchableOpacity>
      </View>

      {/* Full Screen Image Modal */}
      <Modal
        visible={fullScreenVisible}
        transparent={false}
        animationType="fade"
        onRequestClose={closeFullScreen}
      >
        <View style={styles.fullScreenContainer}>
          <StatusBar barStyle="light-content" backgroundColor="#000000" />

          {/* Full Screen Header */}
          <View style={styles.fullScreenHeader}>
            <TouchableOpacity
              style={styles.fullScreenBackButton}
              onPress={closeFullScreen}
            >
              <Text style={styles.fullScreenBackIcon}>←</Text>
            </TouchableOpacity>
            <Text style={styles.fullScreenTitle}>
              {fullScreenImageIndex + 1} / {images.length}
            </Text>
            <View style={styles.fullScreenPlaceholder} />
          </View>

          {/* Full Screen Image Gallery */}
          <ScrollView
            ref={fullScreenScrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleFullScreenScroll}
            scrollEventThrottle={16}
            style={styles.fullScreenScrollView}
          >
            {images.map((image) => (
              <View key={image.imageId} style={styles.fullScreenImageContainer}>
                <Image
                  source={{ uri: getImageUrl(image.imageUrl) }}
                  style={styles.fullScreenImage}
                  resizeMode="contain"
                />
              </View>
            ))}
          </ScrollView>
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
    fontSize: 28,
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
  favoriteHeaderButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteHeaderIcon: {
    fontSize: 28,
  },
  content: {
    flex: 1,
  },
  imageGallery: {
    position: 'relative',
    width: '100%',
    height: 300,
    backgroundColor: '#E0E0E0',
  },
  mainImage: {
    width: SCREEN_WIDTH,
    height: 300,
    resizeMode: 'cover',
  },
  noImageContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F8E9',
  },
  noImageIcon: {
    fontSize: 80,
    marginBottom: 10,
  },
  noImageText: {
    fontSize: 16,
    color: '#666',
  },
  imageCounter: {
    position: 'absolute',
    top: 15,
    left: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  imageCounterText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  pagination: {
    position: 'absolute',
    bottom: 15,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#FFFFFF',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  featuredBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#FBC02D',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  featuredIcon: {
    fontSize: 16,
    marginRight: 5,
  },
  featuredText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  priceContainer: {
    flex: 1,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 2,
  },
  priceLabel: {
    fontSize: 12,
    color: '#666',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  timeIcon: {
    fontSize: 14,
    marginRight: 5,
  },
  timeText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  titleSection: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    fontSize: 16,
    marginRight: 5,
  },
  location: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  quickInfoSection: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 15,
    marginTop: 10,
  },
  infoCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#F1F8E9',
    borderRadius: 12,
    marginHorizontal: 5,
  },
  infoIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  infoLabel: {
    fontSize: 11,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  categorySection: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 15,
    marginTop: 10,
  },
  categoryBadge: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  categoryLabel: {
    fontSize: 12,
    color: '#666',
    marginRight: 5,
  },
  categoryValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoRowLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoRowValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  statusActive: {
    color: '#4CAF50',
  },
  contactSection: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    marginTop: 10,
  },
  contactCard: {
    flexDirection: 'row',
    backgroundColor: '#F1F8E9',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  contactAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  contactAvatarText: {
    fontSize: 30,
  },
  contactInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  contactPhone: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  contactLocation: {
    fontSize: 12,
    color: '#666',
  },
  safetySection: {
    backgroundColor: '#FFF9C4',
    padding: 15,
    marginTop: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#FBC02D',
  },
  safetyTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#F57F17',
    marginBottom: 10,
  },
  safetyTip: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  safetyIcon: {
    fontSize: 14,
    color: '#F57F17',
    marginRight: 8,
    fontWeight: 'bold',
  },
  safetyText: {
    fontSize: 13,
    color: '#F57F17',
    flex: 1,
    lineHeight: 20,
  },
  bottomBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  callButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 12,
    marginRight: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  callIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  callText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  whatsappButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#25D366',
    paddingVertical: 14,
    borderRadius: 12,
    marginLeft: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  whatsappIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  whatsappText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Full Screen Image Viewer Styles
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  fullScreenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingTop: 40,
    paddingBottom: 15,
    paddingHorizontal: 15,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  fullScreenBackButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenBackIcon: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  fullScreenTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  fullScreenPlaceholder: {
    width: 40,
    height: 40,
  },
  fullScreenScrollView: {
    flex: 1,
  },
  fullScreenImageContainer: {
    width: SCREEN_WIDTH,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: SCREEN_WIDTH,
    height: '100%',
  },
});
