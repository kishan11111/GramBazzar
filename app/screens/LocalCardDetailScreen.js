import { useState, useEffect } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    ImageBackground,
    Linking,
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

const { width } = Dimensions.get('window');

export default function LocalCardDetailScreen({ navigation, route }) {
  const { cardId } = route.params;
  const [activeTab, setActiveTab] = useState('details');
  const [cardDetails, setCardDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch card details on mount
  useEffect(() => {
    fetchCardDetails();
  }, [cardId]);

  const fetchCardDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getLocalCardById(cardId);

      if (response.success && response.data) {
        setCardDetails(response.data);
      } else {
        setError('કાર્ડની માહિતી લોડ કરવામાં નિષ્ફળ');
      }
    } catch (err) {
      console.error('Error fetching card details:', err);
      setError('કાર્ડની માહિતી લોડ કરવામાં ભૂલ થઈ. કૃપા કરીને ફરી પ્રયાસ કરો.');
    } finally {
      setLoading(false);
    }
  };


  const handleCall = (phone) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleWhatsApp = (phone) => {
    const message = `નમસ્તે, મને તમારી સેવા વિશે માહિતી જોઈએ છે.`;
    Linking.openURL(`https://wa.me/91${phone}?text=${encodeURIComponent(message)}`);
  };

  const handleShare = async () => {
    if (!cardDetails) return;
    try {
      const businessName = cardDetails.businessNameGujarati || cardDetails.businessName;
      const category = cardDetails.subCategoryNameGujarati || cardDetails.categoryNameGujarati;
      await Share.share({
        message: `${businessName}\n${category}\n📞 ${cardDetails.primaryPhone}\n📍 ${cardDetails.fullAddress}\n\nસ્થાનિક કાર્ડ એપ્લિકેશનમાંથી`,
      });
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  const openMap = () => {
    if (!cardDetails) return;
    if (cardDetails.latitude && cardDetails.longitude) {
      const url = `https://www.google.com/maps/search/?api=1&query=${cardDetails.latitude},${cardDetails.longitude}`;
      Linking.openURL(url);
    } else {
      const address = encodeURIComponent(cardDetails.fullAddress);
      const url = `https://www.google.com/maps/search/?api=1&query=${address}`;
      Linking.openURL(url);
    }
  };


  const renderDetailsTab = () => {
    if (!cardDetails) return null;

    const businessName = cardDetails.businessNameGujarati || cardDetails.businessName;
    const description = cardDetails.businessDescriptionGujarati || cardDetails.businessDescription;

    return (
      <View style={styles.tabContent}>
        <View style={styles.detailSection}>
          <Text style={styles.detailTitle}>📋 બિઝનેસ માહિતી</Text>
          <View style={styles.detailDivider} />
          <Text style={styles.businessName}>{businessName}</Text>
          {description && <Text style={styles.description}>{description}</Text>}
          <Text style={styles.detailText}>
            કેટેગરી: {cardDetails.categoryNameGujarati || cardDetails.categoryNameEnglish}
          </Text>
          <Text style={styles.detailText}>
            સબ-કેટેગરી: {cardDetails.subCategoryNameGujarati || cardDetails.subCategoryNameEnglish}
          </Text>
        </View>

        {cardDetails.contactPersonName && (
          <View style={styles.detailSection}>
            <Text style={styles.detailTitle}>👤 સંપર્ક વ્યક્તિ</Text>
            <View style={styles.detailDivider} />
            <Text style={styles.detailText}>{cardDetails.contactPersonName}</Text>
          </View>
        )}

        <View style={styles.detailSection}>
          <Text style={styles.detailTitle}>📞 ફોન નંબર</Text>
          <View style={styles.detailDivider} />
          {cardDetails.primaryPhone && (
            <TouchableOpacity onPress={() => handleCall(cardDetails.primaryPhone)}>
              <Text style={styles.phoneLink}>📱 {cardDetails.primaryPhone} (Primary)</Text>
            </TouchableOpacity>
          )}
          {cardDetails.secondaryPhone && (
            <TouchableOpacity onPress={() => handleCall(cardDetails.secondaryPhone)}>
              <Text style={styles.phoneLink}>📱 {cardDetails.secondaryPhone} (Secondary)</Text>
            </TouchableOpacity>
          )}
        </View>

        {cardDetails.whatsAppNumber && (
          <View style={styles.detailSection}>
            <Text style={styles.detailTitle}>💬 WhatsApp</Text>
            <View style={styles.detailDivider} />
            <TouchableOpacity onPress={() => handleWhatsApp(cardDetails.whatsAppNumber)}>
              <Text style={styles.phoneLink}>{cardDetails.whatsAppNumber}</Text>
            </TouchableOpacity>
          </View>
        )}

        {cardDetails.email && (
          <View style={styles.detailSection}>
            <Text style={styles.detailTitle}>📧 Email</Text>
            <View style={styles.detailDivider} />
            <Text style={styles.detailText}>{cardDetails.email}</Text>
          </View>
        )}

        <View style={styles.detailSection}>
          <Text style={styles.detailTitle}>📍 સરનામું</Text>
          <View style={styles.detailDivider} />
          <Text style={styles.detailText}>{cardDetails.fullAddress}</Text>
          <Text style={styles.detailText}>
            {cardDetails.villageNameGujarati || cardDetails.villageNameEnglish},{' '}
            {cardDetails.talukaNameGujarati || cardDetails.talukaNameEnglish}
          </Text>
          <Text style={styles.detailText}>
            {cardDetails.districtNameGujarati || cardDetails.districtNameEnglish}
          </Text>
        </View>

        {(cardDetails.workingHours || cardDetails.workingDays) && (
          <View style={styles.detailSection}>
            <Text style={styles.detailTitle}>⏰ કામના સમય</Text>
            <View style={styles.detailDivider} />
            {cardDetails.workingHours && (
              <Text style={styles.detailText}>🕐 {cardDetails.workingHours}</Text>
            )}
            {cardDetails.workingDays && (
              <Text style={styles.detailText}>📅 {cardDetails.workingDays}</Text>
            )}
            {cardDetails.isOpen24Hours && (
              <Text style={[styles.detailText, { color: '#4CAF50', fontWeight: 'bold' }]}>
                ⏰ 24 કલાક ખુલ્લું
              </Text>
            )}
          </View>
        )}

        {cardDetails.isVerified && (
          <View style={styles.verificationBanner}>
            <Text style={styles.verificationText}>✓ આ કાર્ડ વેરિફાઈડ છે</Text>
          </View>
        )}
      </View>
    );
  };

  const renderPhotosTab = () => {
    if (!cardDetails) return null;

    const images = cardDetails.images || [];
    const allImages = [];

    // Add cover image if available
    if (cardDetails.coverImage) {
      allImages.push({ uri: `${API_CONFIG.BASE_URL_Image}${cardDetails.coverImage}`, type: 'cover' });
    }

    // Add profile image if available
    if (cardDetails.profileImage) {
      allImages.push({ uri: `${API_CONFIG.BASE_URL_Image}${cardDetails.profileImage}`, type: 'profile' });
    }

    // Add additional images
    images.forEach((img, idx) => {
      allImages.push({ uri: `${API_CONFIG.BASE_URL_Image}${img}`, type: 'gallery', index: idx });
    });

    return (
      <View style={styles.tabContent}>
        {allImages.length > 0 ? (
          <View style={styles.photosGrid}>
            {allImages.map((photo, index) => (
              <TouchableOpacity key={index} style={styles.photoItem}>
                <Image
                  source={{ uri: photo.uri }}
                  style={styles.photoImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.noPhotosContainer}>
            <Text style={styles.photoIcon}>📷</Text>
            <Text style={styles.noPhotosText}>કોઈ ફોટા ઉપલબ્ધ નથી</Text>
          </View>
        )}
      </View>
    );
  };

  const renderLocationTab = () => {
    if (!cardDetails) return null;

    return (
      <View style={styles.tabContent}>
        <View style={styles.mapContainer}>
          <View style={styles.mapPlaceholder}>
            <Text style={styles.mapIcon}>🗺️</Text>
            <Text style={styles.mapText}>Map View</Text>
            {cardDetails.latitude && cardDetails.longitude && (
              <Text style={styles.coordinatesText}>
                {cardDetails.latitude.toFixed(4)}, {cardDetails.longitude.toFixed(4)}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.locationInfo}>
          <Text style={styles.locationIcon}>📍</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.locationText}>{cardDetails.fullAddress}</Text>
            <Text style={styles.locationText}>
              {cardDetails.villageNameGujarati || cardDetails.villageNameEnglish},{' '}
              {cardDetails.talukaNameGujarati || cardDetails.talukaNameEnglish}
            </Text>
            <Text style={styles.locationText}>
              {cardDetails.districtNameGujarati || cardDetails.districtNameEnglish}
            </Text>
            {cardDetails.distanceKm && (
              <Text style={styles.distanceText}>📏 {cardDetails.distanceKm.toFixed(1)} km દૂર</Text>
            )}
          </View>
        </View>

        <TouchableOpacity style={styles.mapButton} onPress={openMap}>
          <Text style={styles.mapButtonText}>🗺️ Google Maps માં જુઓ</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Show loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />
        <View style={styles.headerContainer}>
          <View style={styles.coverImage}>
            <View style={styles.coverOverlay} />
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backIcon}>‹</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>કાર્ડની માહિતી લોડ થઈ રહી છે...</Text>
        </View>
      </View>
    );
  }

  // Show error state
  if (error || !cardDetails) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />
        <View style={styles.headerContainer}>
          <View style={styles.coverImage}>
            <View style={styles.coverOverlay} />
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backIcon}>‹</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'કાર્ડની માહિતી મળી નથી'}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchCardDetails}>
            <Text style={styles.retryButtonText}>ફરી પ્રયાસ કરો</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const businessName = cardDetails.businessNameGujarati || cardDetails.businessName;
  const category = cardDetails.subCategoryNameGujarati || cardDetails.categoryNameGujarati;
  const profileImageUrl = cardDetails.profileImage ? `${API_CONFIG.BASE_URL_Image}${cardDetails.profileImage}` : null;
  const coverImageUrl = cardDetails.coverImage ? `${API_CONFIG.BASE_URL_Image}${cardDetails.coverImage}` : null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />

      {/* Header with Cover Image */}
      <View style={styles.headerContainer}>
        {coverImageUrl ? (
          <ImageBackground source={{ uri: coverImageUrl }} style={styles.coverImage} resizeMode="cover">
            <View style={styles.coverOverlay} />
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backIcon}>‹</Text>
            </TouchableOpacity>
          </ImageBackground>
        ) : (
          <View style={styles.coverImage}>
            <View style={styles.coverOverlay} />
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backIcon}>‹</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.profileSection}>
          {profileImageUrl ? (
            <Image
              source={{ uri: profileImageUrl }}
              style={styles.profileImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.profileImage}>
              <Text style={styles.profileIcon}>🏪</Text>
            </View>
          )}
          <View style={styles.profileInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.profileName}>{businessName}</Text>
              {cardDetails.isVerified && <Text style={styles.verifiedBadge}>✓</Text>}
            </View>
            <Text style={styles.profileCategory}>{category}</Text>
          </View>
        </View>
      </View>

      {/* Contact Actions */}
      <View style={styles.contactActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleCall(cardDetails.primaryPhone || cardDetails.whatsAppNumber)}
        >
          <Text style={styles.actionIcon}>📞</Text>
          <Text style={styles.actionText}>કોલ કરો</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleWhatsApp(cardDetails.whatsAppNumber || cardDetails.primaryPhone)}
        >
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionText}>WhatsApp</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleShare}
        >
          <Text style={styles.actionIcon}>📤</Text>
          <Text style={styles.actionText}>શેર</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'details' && styles.tabActive]}
          onPress={() => setActiveTab('details')}
        >
          <Text style={[styles.tabText, activeTab === 'details' && styles.tabTextActive]}>
            વિગતો
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'photos' && styles.tabActive]}
          onPress={() => setActiveTab('photos')}
        >
          <Text style={[styles.tabText, activeTab === 'photos' && styles.tabTextActive]}>
            ફોટા
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'location' && styles.tabActive]}
          onPress={() => setActiveTab('location')}
        >
          <Text style={[styles.tabText, activeTab === 'location' && styles.tabTextActive]}>
            સ્થળ
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {activeTab === 'details' && renderDetailsTab()}
        {activeTab === 'photos' && renderPhotosTab()}
        {activeTab === 'location' && renderLocationTab()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  headerContainer: {
    backgroundColor: '#FFFFFF',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  coverImage: {
    height: 150,
    backgroundColor: '#4CAF50',
    position: 'relative',
  },
  coverOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 15,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
  },
  backIcon: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: -30,
  },
  profileImage: {
    width: 80,
    height: 80,
    backgroundColor: '#FFFFFF',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  profileIcon: {
    fontSize: 40,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 15,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  verifiedBadge: {
    backgroundColor: '#2196F3',
    color: '#FFFFFF',
    borderRadius: 12,
    width: 24,
    height: 24,
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  profileCategory: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  contactActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  actionText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#4CAF50',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  tabContent: {
    padding: 20,
  },
  detailSection: {
    marginBottom: 20,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  detailDivider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginBottom: 10,
  },
  businessName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  detailText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  phoneLink: {
    fontSize: 14,
    color: '#4CAF50',
    lineHeight: 22,
    textDecorationLine: 'underline',
  },
  serviceItem: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  serviceBullet: {
    fontSize: 14,
    color: '#4CAF50',
    marginRight: 8,
  },
  serviceText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },
  photoItem: {
    width: (width - 50) / 3,
    height: (width - 50) / 3,
    margin: 5,
  },
  photoPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  photoIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  photoText: {
    fontSize: 10,
    color: '#999',
  },
  mapContainer: {
    height: 200,
    marginBottom: 20,
  },
  mapPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  mapIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  mapText: {
    fontSize: 14,
    color: '#999',
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  locationIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  locationText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    lineHeight: 20,
  },
  mapButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  mapButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
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
  verificationBanner: {
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
    marginTop: 10,
  },
  verificationText: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  photoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  noPhotosContainer: {
    padding: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noPhotosText: {
    fontSize: 14,
    color: '#999',
    marginTop: 10,
  },
  coordinatesText: {
    fontSize: 10,
    color: '#999',
    marginTop: 5,
  },
  distanceText: {
    fontSize: 13,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginTop: 5,
  },
});