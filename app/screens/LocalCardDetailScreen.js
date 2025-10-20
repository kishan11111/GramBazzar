import { useState } from 'react';
import {
    Dimensions,
    Linking,
    ScrollView,
    Share,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width } = Dimensions.get('window');

export default function LocalCardDetailScreen({ navigation, route }) {
  const { card } = route.params;
  const [activeTab, setActiveTab] = useState('details');
  
  // Extended card data for detail view
  const cardDetails = {
    ...card,
    description: '20 વર્ષનો અનુભવ ધરાવતા નિષ્ણાત સુથાર - ફર્નિચર, રસોડાની સજાવટ, બધા પ્રકારનું લાકડાનું કામ',
    contactPerson: 'લાલજીભાઈ પટેલ',
    alternatePhone: '9825123456',
    whatsapp: '9876543210',
    email: 'laljibhai@example.com',
    address: 'Near Bus Stand, Main Road\nઉંઝા, ધોળકા, અમદાવાદ',
    workingDays: 'સોમવાર થી શનિવાર',
    services: ['ફર્નિચર', 'કિચન કેબિનેટ', 'દરવાજા-બારી', 'મંદિર', 'ઓફિસ ફર્નિચર'],
    photos: ['photo1', 'photo2', 'photo3', 'photo4', 'photo5'],
  };

  const handleCall = (phone) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleWhatsApp = (phone) => {
    const message = `નમસ્તે, મને તમારી સેવા વિશે માહિતી જોઈએ છે.`;
    Linking.openURL(`https://wa.me/91${phone}?text=${encodeURIComponent(message)}`);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${cardDetails.name}\n${cardDetails.category}\n📞 ${cardDetails.phone}\n📍 ${cardDetails.address}\n\nસ્થાનિક કાર્ડ એપ્લિકેશનમાંથી`,
      });
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  const openMap = () => {
    const address = encodeURIComponent(cardDetails.address);
    const url = `https://www.google.com/maps/search/?api=1&query=${address}`;
    Linking.openURL(url);
  };

  const renderDetailsTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.detailSection}>
        <Text style={styles.detailTitle}>📋 બિઝનેસ માહિતી</Text>
        <View style={styles.detailDivider} />
        <Text style={styles.businessName}>{cardDetails.name}</Text>
        <Text style={styles.description}>{cardDetails.description}</Text>
      </View>

      <View style={styles.detailSection}>
        <Text style={styles.detailTitle}>👤 સંપર્ક વ્યક્તિ</Text>
        <View style={styles.detailDivider} />
        <Text style={styles.detailText}>{cardDetails.contactPerson}</Text>
      </View>

      <View style={styles.detailSection}>
        <Text style={styles.detailTitle}>📞 ફોન નંબર</Text>
        <View style={styles.detailDivider} />
        <TouchableOpacity onPress={() => handleCall(cardDetails.phone)}>
          <Text style={styles.phoneLink}>{cardDetails.phone}</Text>
        </TouchableOpacity>
        {cardDetails.alternatePhone && (
          <TouchableOpacity onPress={() => handleCall(cardDetails.alternatePhone)}>
            <Text style={styles.phoneLink}>{cardDetails.alternatePhone} (Secondary)</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.detailSection}>
        <Text style={styles.detailTitle}>💬 WhatsApp</Text>
        <View style={styles.detailDivider} />
        <TouchableOpacity onPress={() => handleWhatsApp(cardDetails.whatsapp)}>
          <Text style={styles.phoneLink}>{cardDetails.whatsapp}</Text>
        </TouchableOpacity>
      </View>

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
        <Text style={styles.detailText}>{cardDetails.address}</Text>
      </View>

      <View style={styles.detailSection}>
        <Text style={styles.detailTitle}>⏰ કામના સમય</Text>
        <View style={styles.detailDivider} />
        <Text style={styles.detailText}>{cardDetails.timing}</Text>
        <Text style={styles.detailText}>{cardDetails.workingDays}</Text>
      </View>

      {cardDetails.services && (
        <View style={styles.detailSection}>
          <Text style={styles.detailTitle}>🛠️ સેવાઓ</Text>
          <View style={styles.detailDivider} />
          {cardDetails.services.map((service, index) => (
            <View key={index} style={styles.serviceItem}>
              <Text style={styles.serviceBullet}>•</Text>
              <Text style={styles.serviceText}>{service}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  const renderPhotosTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.photosGrid}>
        {cardDetails.photos.map((photo, index) => (
          <TouchableOpacity key={index} style={styles.photoItem}>
            <View style={styles.photoPlaceholder}>
              <Text style={styles.photoIcon}>📷</Text>
              <Text style={styles.photoText}>Photo {index + 1}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderLocationTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapIcon}>🗺️</Text>
          <Text style={styles.mapText}>Map View</Text>
        </View>
      </View>
      
      <View style={styles.locationInfo}>
        <Text style={styles.locationIcon}>📍</Text>
        <Text style={styles.locationText}>{cardDetails.address}</Text>
      </View>
      
      <TouchableOpacity style={styles.mapButton} onPress={openMap}>
        <Text style={styles.mapButtonText}>🗺️ Google Maps માં જુઓ</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />
      
      {/* Header with Cover Image */}
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
        
        <View style={styles.profileSection}>
          <View style={styles.profileImage}>
            <Text style={styles.profileIcon}>{cardDetails.image || '👤'}</Text>
          </View>
          <View style={styles.profileInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.profileName}>{cardDetails.name}</Text>
              {cardDetails.verified && <Text style={styles.verifiedBadge}>✓</Text>}
            </View>
            <Text style={styles.profileCategory}>{cardDetails.category}</Text>
          </View>
        </View>
      </View>

      {/* Contact Actions */}
      <View style={styles.contactActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleCall(cardDetails.phone)}
        >
          <Text style={styles.actionIcon}>📞</Text>
          <Text style={styles.actionText}>કોલ કરો</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleWhatsApp(cardDetails.whatsapp)}
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
});