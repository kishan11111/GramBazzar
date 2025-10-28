import * as Sharing from 'expo-sharing';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ViewShot from 'react-native-view-shot';
import API_CONFIG from '../config/api';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 40;
const CARD_HEIGHT = (CARD_WIDTH * 9) / 16; // Standard business card ratio (16:9)

export default function VisitingCardGenerator({ cardDetails }) {
  const viewShotRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateAndShareCard = async () => {
    try {
      setIsGenerating(true);
      console.log('📸 Capturing visiting card...');

      // Capture the view as image
      const uri = await viewShotRef.current.capture();
      console.log('✅ Card captured:', uri);

      // Check if sharing is available
      const isSharingAvailable = await Sharing.isAvailableAsync();

      if (!isSharingAvailable) {
        Alert.alert('ભૂલ', 'આ ઉપકરણ પર શેરિંગ ઉપલબ્ધ નથી');
        return;
      }

      // Share the image
      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: 'વિઝિટિંગ કાર્ડ શેર કરો',
      });

      console.log('✅ Card shared successfully');
    } catch (error) {
      console.error('❌ Error generating card:', error);
      Alert.alert('ભૂલ', 'કાર્ડ બનાવવામાં સમસ્યા આવી');
    } finally {
      setIsGenerating(false);
    }
  };

  const businessName = cardDetails.businessNameGujarati || cardDetails.businessName;
  const category = cardDetails.subCategoryNameGujarati || cardDetails.categoryNameGujarati;
  const profileImageUrl = cardDetails.profileImage
    ? `${API_CONFIG.BASE_URL_Image}${cardDetails.profileImage}`
    : null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>મારું વિઝિટિંગ કાર્ડ</Text>

      {/* The visiting card that will be captured */}
      <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1.0 }}>
        <View style={styles.card}>
          {/* Logo Watermark in Background */}
          <Image
            source={require('../../assets/images/my_logo.jpg')}
            style={styles.logoWatermark}
            resizeMode="contain"
          />

          {/* Left Section - Profile */}
          <View style={styles.leftSection}>
            {profileImageUrl ? (
              <Image
                source={{ uri: profileImageUrl }}
                style={styles.profileImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Text style={styles.profileImageIcon}>🏪</Text>
              </View>
            )}
            <Text style={styles.businessName} numberOfLines={2}>
              {businessName}
            </Text>
            <Text style={styles.category} numberOfLines={1}>
              {category}
            </Text>
          </View>

          {/* Right Section - Contact Details */}
          <View style={styles.rightSection}>
            {/* Phone Number */}
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>📞</Text>
              <View>
                <Text style={styles.infoLabel}>ફોન નંબર</Text>
                <Text style={styles.infoValue}>{cardDetails.primaryPhone}</Text>
                {cardDetails.secondaryPhone && cardDetails.secondaryPhone !== cardDetails.primaryPhone && (
                  <Text style={styles.infoValue}>{cardDetails.secondaryPhone}</Text>
                )}
              </View>
            </View>

            {/* Address */}
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>📍</Text>
              <View style={styles.addressBox}>
                <Text style={styles.infoLabel}>સરનામું</Text>
                <Text style={styles.infoValue}>
                  {cardDetails.villageNameGujarati || cardDetails.villageNameEnglish},{' '}
                  {cardDetails.talukaNameGujarati || cardDetails.talukaNameEnglish}
                </Text>
                <Text style={styles.infoValue}>
                  {cardDetails.districtNameGujarati || cardDetails.districtNameEnglish}
                </Text>
              </View>
            </View>
          </View>

          {/* Footer - App Branding */}
          <View style={styles.footerBrand}>
            <Image
              source={require('../../assets/images/my_logo.jpg')}
              style={styles.footerLogo}
              resizeMode="contain"
            />
            <Text style={styles.footerText}>લોકબજાર એપ્લિકેશન</Text>
          </View>

          {/* Decorative Yellow Corner */}
          <View style={styles.cornerDecoration} />
        </View>
      </ViewShot>

      {/* Generate Button */}
      <TouchableOpacity
        style={styles.generateButton}
        onPress={generateAndShareCard}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <>
            <Text style={styles.generateButtonIcon}>📤</Text>
            <Text style={styles.generateButtonText}>કાર્ડ શેર કરો</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    position: 'relative',
    flexDirection: 'row',
    padding: 20,
  },
  logoWatermark: {
    position: 'absolute',
    width: CARD_WIDTH * 0.5,
    height: CARD_HEIGHT * 0.5,
    top: '50%',
    left: '50%',
    marginTop: -(CARD_HEIGHT * 0.25),
    marginLeft: -(CARD_WIDTH * 0.25),
    opacity: 0.04,
  },
  leftSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 15,
    borderRightWidth: 2,
    borderRightColor: '#E0E0E0',
  },
  rightSection: {
    flex: 1.2,
    justifyContent: 'center',
    paddingLeft: 15,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#4CAF50',
    marginBottom: 10,
  },
  profileImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#4CAF50',
    marginBottom: 10,
  },
  profileImageIcon: {
    fontSize: 36,
  },
  businessName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: 5,
  },
  category: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 10,
    marginTop: 2,
  },
  infoLabel: {
    fontSize: 11,
    color: '#888',
    marginBottom: 3,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 13,
    color: '#333',
    fontWeight: '600',
    marginBottom: 2,
  },
  addressBox: {
    flex: 1,
  },
  footerBrand: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerLogo: {
    width: 20,
    height: 20,
    marginRight: 6,
  },
  footerText: {
    fontSize: 10,
    color: '#999',
    fontWeight: '600',
  },
  cornerDecoration: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 50,
    height: 50,
    backgroundColor: '#FFC107',
    borderBottomLeftRadius: 50,
  },
  generateButton: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  generateButtonIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
