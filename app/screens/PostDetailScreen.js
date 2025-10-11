import React, { useState } from 'react';
import {
    Image,
    Linking,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function PostDetailScreen({ route, navigation }) {
  const { post } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);

  // Dummy seller phone for now (will be added to API later)
  const sellerPhone = '+919876543210';

  const handleCall = () => {
    Linking.openURL(`tel:${sellerPhone}`);
  };

  const handleWhatsApp = () => {
    const message = `હેલો, હું ${post.title} વિશે પૂછપરછ કરવા માંગું છું. કિંમત: ${post.priceString}`;
    Linking.openURL(`whatsapp://send?phone=${sellerPhone}&text=${encodeURIComponent(message)}`);
  };

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
        <Text style={styles.headerTitle}>વિગતો</Text>
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={() => setIsFavorite(!isFavorite)}
        >
          <Text style={styles.favoriteIcon}>
            {isFavorite ? '❤️' : '🤍'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        <View style={styles.imageGallery}>
          {post.mainImageUrl ? (
            <Image
              source={{ uri: post.mainImageUrl }}
              style={styles.mainImage}
            />
          ) : (
            <View style={styles.noImageContainer}>
              <Text style={styles.noImageIcon}>📷</Text>
              <Text style={styles.noImageText}>ફોટો ઉપલબ્ધ નથી</Text>
            </View>
          )}
          {post.isFeatured && (
            <View style={styles.featuredBadge}>
              <Text style={styles.featuredIcon}>⭐</Text>
              <Text style={styles.featuredText}>ફીચર્ડ</Text>
            </View>
          )}
        </View>

        {/* Price Section */}
        <View style={styles.priceSection}>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{post.priceString}</Text>
            <Text style={styles.priceLabel}>{post.priceType}</Text>
          </View>
          <View style={styles.timeContainer}>
            <Text style={styles.timeIcon}>🕐</Text>
            <Text style={styles.timeText}>{post.timeAgo}</Text>
          </View>
        </View>

        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{post.title}</Text>
          <View style={styles.locationRow}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.location}>{post.locationString}</Text>
          </View>
        </View>

        {/* Quick Info */}
        <View style={styles.quickInfoSection}>
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>📊</Text>
            <Text style={styles.infoLabel}>સ્થિતિ</Text>
            <Text style={styles.infoValue}>{post.condition}</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>👁️</Text>
            <Text style={styles.infoLabel}>Views</Text>
            <Text style={styles.infoValue}>{post.viewCount}</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>❤️</Text>
            <Text style={styles.infoLabel}>Favorites</Text>
            <Text style={styles.infoValue}>{post.favoriteCount}</Text>
          </View>
        </View>

        {/* Category Info */}
        <View style={styles.categorySection}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryLabel}>કેટેગરી:</Text>
            <Text style={styles.categoryValue}>{post.categoryName}</Text>
          </View>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryLabel}>પ્રકાર:</Text>
            <Text style={styles.categoryValue}>{post.subCategoryName}</Text>
          </View>
        </View>

        {/* Post ID for Reference */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 પોસ્ટ માહિતી</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoRowLabel}>પોસ્ટ ID:</Text>
            <Text style={styles.infoRowValue}>#{post.postId}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoRowLabel}>સ્ટેટસ:</Text>
            <Text style={[styles.infoRowValue, styles.statusActive]}>{post.status}</Text>
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>📞 સંપર્ક માહિતી</Text>
          <View style={styles.contactCard}>
            <View style={styles.contactAvatar}>
              <Text style={styles.contactAvatarText}>👤</Text>
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>વિક્રેતા</Text>
              <Text style={styles.contactPhone}>{sellerPhone}</Text>
              <Text style={styles.contactLocation}>📍 {post.locationString}</Text>
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
  favoriteButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteIcon: {
    fontSize: 24,
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
    width: '100%',
    height: '100%',
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
});