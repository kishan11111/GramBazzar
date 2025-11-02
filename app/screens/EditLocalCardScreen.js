import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Switch
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { apiService } from '../config/api';
import API_CONFIG from '../config/api';

// Generate light unique colors for categories
const generateLightColor = (index) => {
  const colors = [
    '#FFE5E5', '#E5F5FF', '#FFF5E5', '#E5FFE5', '#F5E5FF',
    '#FFE5F5', '#E5FFFF', '#FFFFE5', '#F5FFE5', '#E5F5F5',
    '#FFE5EE', '#EEE5FF', '#E5FFEE', '#FFEEEE', '#EEF5FF',
    '#FFF5EE', '#F5FFEE', '#EEE5F5', '#E5EEFF', '#F5E5EE',
  ];
  return colors[index % colors.length];
};

export default function EditLocalCardScreen({ navigation, route }) {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Get params from either route (React Navigation) or useLocalSearchParams (Expo Router)
  const cardId = route?.params?.cardId || params?.cardId;
  const cardDataParam = route?.params?.cardData || params?.cardData;

  // Parse cardData if it's a string (from URL params)
  let cardData;
  try {
    cardData = typeof cardDataParam === 'string' ? JSON.parse(cardDataParam) : cardDataParam;
  } catch (e) {
    cardData = cardDataParam;
  }

  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  // Store fetched or passed card data for auto-selection
  const [fetchedCardData, setFetchedCardData] = useState(cardData || null);

  // Category & Subcategory
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  const [showSubcategorySelector, setShowSubcategorySelector] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [subcategoriesLoading, setSubcategoriesLoading] = useState(false);

  // Location
  const [districts, setDistricts] = useState([]);
  const [talukas, setTalukas] = useState([]);
  const [villages, setVillages] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedTaluka, setSelectedTaluka] = useState(null);
  const [selectedVillage, setSelectedVillage] = useState(null);
  const [showDistrictSelector, setShowDistrictSelector] = useState(false);
  const [showTalukaSelector, setShowTalukaSelector] = useState(false);
  const [showVillageSelector, setShowVillageSelector] = useState(false);
  const [districtsLoading, setDistrictsLoading] = useState(false);
  const [talukasLoading, setTalukasLoading] = useState(false);
  const [villagesLoading, setVillagesLoading] = useState(false);

  // Business Info
  const [businessNameGujarati, setBusinessNameGujarati] = useState('');
  const [businessDescriptionGujarati, setBusinessDescriptionGujarati] = useState('');

  // Contact Info
  const [contactPersonName, setContactPersonName] = useState('');
  const [primaryPhone, setPrimaryPhone] = useState('');
  const [secondaryPhone, setSecondaryPhone] = useState('');
  const [whatsAppNumber, setWhatsAppNumber] = useState('');
  const [email, setEmail] = useState('');

  // Address
  const [fullAddress, setFullAddress] = useState('');

  // Working Hours
  const [workingHours, setWorkingHours] = useState('');
  const [workingDays, setWorkingDays] = useState('');
  const [isOpen24Hours, setIsOpen24Hours] = useState(false);

  // Images - store both new uploads and existing URLs
  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [existingProfileImageUrl, setExistingProfileImageUrl] = useState('');
  const [existingCoverImageUrl, setExistingCoverImageUrl] = useState('');
  const [existingAdditionalImagesUrls, setExistingAdditionalImagesUrls] = useState([]);

  useEffect(() => {
    fetchCategories();
    fetchDistricts();

    // If cardData is available, prefill
    if (cardData) {
      prefillFormData();
    } else if (cardId) {
      // If only cardId is available, fetch the card data
      fetchCardData();
    }
  }, []);

  // Fetch card data if only cardId is provided
  const fetchCardData = async () => {
    if (!cardId) return;

    try {
      setLoading(true);
      console.log('📥 Fetching card data for editing...', cardId);
      const response = await apiService.getLocalCardById(cardId);

      if (response.success && response.data) {
        // Use the fetched data to prefill the form
        const fetchedCardData = response.data;

        // Business info
        setBusinessNameGujarati(fetchedCardData.businessNameGujarati || fetchedCardData.businessName || '');
        setBusinessDescriptionGujarati(fetchedCardData.businessDescriptionGujarati || fetchedCardData.businessDescription || '');

        // Contact info
        setContactPersonName(fetchedCardData.contactPersonName || '');
        setPrimaryPhone(fetchedCardData.primaryPhone || '');
        setSecondaryPhone(fetchedCardData.secondaryPhone || '');
        setWhatsAppNumber(fetchedCardData.whatsAppNumber || '');
        setEmail(fetchedCardData.email || '');

        // Address
        setFullAddress(fetchedCardData.fullAddress || '');

        // Working hours
        setWorkingHours(fetchedCardData.workingHours || '');
        setWorkingDays(fetchedCardData.workingDays || '');
        setIsOpen24Hours(fetchedCardData.isOpen24Hours || false);

        // Store existing image URLs
        setExistingProfileImageUrl(fetchedCardData.profileImage || '');
        setExistingCoverImageUrl(fetchedCardData.coverImage || '');

        // Handle additional images
        if (fetchedCardData.images && Array.isArray(fetchedCardData.images)) {
          const imageUrls = fetchedCardData.images.map(img => {
            if (typeof img === 'string') return img;
            return img.imageUrl || img.url || '';
          }).filter(url => url !== '');
          setExistingAdditionalImagesUrls(imageUrls);
        }

        // Store the fetched data for auto-selection
        setFetchedCardData(fetchedCardData);
      }
    } catch (error) {
      console.error('❌ Error fetching card data:', error);
      Alert.alert('ભૂલ', 'કાર્ડની માહિતી લોડ કરવામાં નિષ્ફળ. કૃપા કરીને ફરી પ્રયાસ કરો.');
    } finally {
      setLoading(false);
    }
  };

  // Prefill form with existing card data
  const prefillFormData = async () => {
    if (!cardData) return;

    console.log('📝 Prefilling form with existing card data...');

    // Business info
    setBusinessNameGujarati(cardData.businessNameGujarati || cardData.businessName || '');
    setBusinessDescriptionGujarati(cardData.businessDescriptionGujarati || cardData.businessDescription || '');

    // Contact info
    setContactPersonName(cardData.contactPersonName || '');
    setPrimaryPhone(cardData.primaryPhone || '');
    setSecondaryPhone(cardData.secondaryPhone || '');
    setWhatsAppNumber(cardData.whatsAppNumber || '');
    setEmail(cardData.email || '');

    // Address
    setFullAddress(cardData.fullAddress || '');

    // Working hours
    setWorkingHours(cardData.workingHours || '');
    setWorkingDays(cardData.workingDays || '');
    setIsOpen24Hours(cardData.isOpen24Hours || false);

    // Store existing image URLs
    setExistingProfileImageUrl(cardData.profileImage || '');
    setExistingCoverImageUrl(cardData.coverImage || '');

    // Handle additional images - could be array of strings or array of objects
    if (cardData.images && Array.isArray(cardData.images)) {
      const imageUrls = cardData.images.map(img => {
        if (typeof img === 'string') return img;
        return img.imageUrl || img.url || '';
      }).filter(url => url !== '');
      setExistingAdditionalImagesUrls(imageUrls);
    }
  };

  // Auto-select category and location when data is loaded
  useEffect(() => {
    if (categories.length > 0 && fetchedCardData && fetchedCardData.categoryId) {
      const category = categories.find(c => c.categoryId === fetchedCardData.categoryId);
      if (category) {
        setSelectedCategory(category);
        fetchSubcategories(category.categoryId);
      }
    }
  }, [categories, fetchedCardData]);

  useEffect(() => {
    if (subcategories.length > 0 && fetchedCardData && fetchedCardData.subCategoryId) {
      const subcategory = subcategories.find(sc => sc.subCategoryId === fetchedCardData.subCategoryId);
      if (subcategory) {
        setSelectedSubcategory(subcategory);
      }
    }
  }, [subcategories, fetchedCardData]);

  useEffect(() => {
    if (districts.length > 0 && fetchedCardData && fetchedCardData.districtId) {
      const district = districts.find(d => d.districtId === fetchedCardData.districtId);
      if (district) {
        setSelectedDistrict(district);
        fetchTalukas(district.districtId);
      }
    }
  }, [districts, fetchedCardData]);

  useEffect(() => {
    if (talukas.length > 0 && fetchedCardData && fetchedCardData.talukaId) {
      const taluka = talukas.find(t => t.talukaId === fetchedCardData.talukaId);
      if (taluka) {
        setSelectedTaluka(taluka);
        fetchVillages(taluka.talukaId);
      }
    }
  }, [talukas, fetchedCardData]);

  useEffect(() => {
    if (villages.length > 0 && fetchedCardData && fetchedCardData.villageId) {
      const village = villages.find(v => v.villageId === fetchedCardData.villageId);
      if (village) {
        setSelectedVillage(village);
      }
    }
  }, [villages, fetchedCardData]);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await apiService.getLocalCardCategories();

      if (response.success && response.data) {
        const formattedCategories = response.data.map((cat, index) => ({
          id: cat.categoryId,
          name: cat.categoryNameGujarati,
          nameEnglish: cat.categoryNameEnglish,
          icon: cat.categoryIcon || '📦',
          categoryId: cat.categoryId,
          color: generateLightColor(index),
        }));
        setCategories(formattedCategories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      Alert.alert('ભૂલ', 'કેટેગરી લોડ કરવામાં નિષ્ફળ. કૃપા કરીને ફરી પ્રયાસ કરો.');
    } finally {
      setCategoriesLoading(false);
    }
  };

  // Fetch subcategories when category is selected
  const fetchSubcategories = async (categoryId) => {
    try {
      setSubcategoriesLoading(true);
      const response = await apiService.getLocalCardSubcategories(categoryId);

      if (response.success && response.data) {
        const formattedSubcategories = response.data.map((subcat, index) => ({
          id: subcat.subCategoryId,
          name: subcat.subCategoryNameGujarati,
          nameEnglish: subcat.subCategoryNameEnglish,
          icon: subcat.subCategoryIcon || '📋',
          subCategoryId: subcat.subCategoryId,
          color: generateLightColor(index),
        }));
        setSubcategories(formattedSubcategories);
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    } finally {
      setSubcategoriesLoading(false);
    }
  };

  // Fetch districts
  const fetchDistricts = async () => {
    try {
      setDistrictsLoading(true);
      const response = await apiService.getDistricts();

      if (response.success && response.data) {
        const formattedDistricts = response.data.map((dist, index) => ({
          id: dist.districtId,
          name: dist.districtNameGujarati || dist.districtNameEnglish,
          nameEnglish: dist.districtNameEnglish,
          districtId: dist.districtId,
          color: generateLightColor(index),
        }));
        setDistricts(formattedDistricts);
      }
    } catch (error) {
      console.error('Error fetching districts:', error);
    } finally {
      setDistrictsLoading(false);
    }
  };

  // Fetch talukas when district is selected
  const fetchTalukas = async (districtId) => {
    try {
      setTalukasLoading(true);
      const response = await apiService.getTalukas(districtId);

      if (response.success && response.data) {
        const formattedTalukas = response.data.map((taluka, index) => ({
          id: taluka.talukaId,
          name: taluka.talukaNameGujarati || taluka.talukaNameEnglish,
          nameEnglish: taluka.talukaNameEnglish,
          talukaId: taluka.talukaId,
          color: generateLightColor(index),
        }));
        setTalukas(formattedTalukas);
      }
    } catch (error) {
      console.error('Error fetching talukas:', error);
    } finally {
      setTalukasLoading(false);
    }
  };

  // Fetch villages when taluka is selected
  const fetchVillages = async (talukaId) => {
    try {
      setVillagesLoading(true);
      const response = await apiService.getVillages(talukaId);

      if (response.success && response.data) {
        const formattedVillages = response.data.map((village, index) => ({
          id: village.villageId,
          name: village.villageNameGujarati || village.villageNameEnglish,
          nameEnglish: village.villageNameEnglish,
          villageId: village.villageId,
          color: generateLightColor(index),
        }));
        setVillages(formattedVillages);
      }
    } catch (error) {
      console.error('Error fetching villages:', error);
    } finally {
      setVillagesLoading(false);
    }
  };

  // Handle category selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategory(null);
    setSubcategories([]);
    setShowCategorySelector(false);
    fetchSubcategories(category.categoryId);
  };

  // Handle district selection
  const handleDistrictSelect = (district) => {
    setSelectedDistrict(district);
    setSelectedTaluka(null);
    setSelectedVillage(null);
    setTalukas([]);
    setVillages([]);
    setShowDistrictSelector(false);
    fetchTalukas(district.districtId);
  };

  // Handle taluka selection
  const handleTalukaSelect = (taluka) => {
    setSelectedTaluka(taluka);
    setSelectedVillage(null);
    setVillages([]);
    setShowTalukaSelector(false);
    fetchVillages(taluka.talukaId);
  };

  // Image picker functions
  const handleProfileImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('પરવાનગી જરૂરી', 'કૃપા કરીને ફોટો લાઇબ્રેરી એક્સેસ કરવાની પરવાનગી આપો');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: false,
      quality: 0.7,
      aspect: [1, 1],
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      setProfileImage({
        uri: asset.uri,
        fileName: asset.fileName || `profile_${Date.now()}.jpg`,
      });
    }
  };

  const handleCoverImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('પરવાનગી જરૂરી', 'કૃપા કરીને ફોટો લાઇબ્રેરી એક્સેસ કરવાની પરવાનગી આપો');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: false,
      quality: 0.7,
      aspect: [16, 9],
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      setCoverImage({
        uri: asset.uri,
        fileName: asset.fileName || `cover_${Date.now()}.jpg`,
      });
    }
  };

  const handleAdditionalImagePick = async () => {
    const totalImages = additionalImages.length + existingAdditionalImagesUrls.length;
    if (totalImages >= 5) {
      Alert.alert('મર્યાદા પૂર્ણ', 'તમે મહત્તમ 5 વધારાના ફોટો પસંદ કરી શકો છો');
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('પરવાનગી જરૂરી', 'કૃપા કરીને ફોટો લાઇબ્રેરી એક્સેસ કરવાની પરવાનગી આપો');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: false,
      quality: 0.7,
      aspect: [4, 3],
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      const newImage = {
        uri: asset.uri,
        fileName: asset.fileName || `image_${Date.now()}.jpg`,
      };
      setAdditionalImages([...additionalImages, newImage]);
    }
  };

  const handleRemoveAdditionalImage = (index) => {
    const newImages = additionalImages.filter((_, i) => i !== index);
    setAdditionalImages(newImages);
  };

  const handleRemoveExistingImage = (index) => {
    const newImages = existingAdditionalImagesUrls.filter((_, i) => i !== index);
    setExistingAdditionalImagesUrls(newImages);
  };

  // Form validation and submission
  const handleSubmit = async () => {
    // Validation
    if (!businessNameGujarati) {
      Alert.alert('ભૂલ', 'કૃપા કરીને બિઝનેસનું નામ દાખલ કરો');
      return;
    }
    if (!selectedCategory) {
      Alert.alert('ભૂલ', 'કૃપા કરીને કેટેગરી પસંદ કરો');
      return;
    }
    if (!selectedSubcategory) {
      Alert.alert('ભૂલ', 'કૃપા કરીને સબ-કેટેગરી પસંદ કરો');
      return;
    }
    if (!contactPersonName) {
      Alert.alert('ભૂલ', 'કૃપા કરીને સંપર્ક વ્યક્તિનું નામ દાખલ કરો');
      return;
    }
    if (!primaryPhone || primaryPhone.length !== 10) {
      Alert.alert('ભૂલ', 'કૃપા કરીને માન્ય પ્રાથમિક ફોન નંબર દાખલ કરો');
      return;
    }
    if (!selectedDistrict || !selectedTaluka || !selectedVillage) {
      Alert.alert('ભૂલ', 'કૃપા કરીને સંપૂર્ણ સ્થાન પસંદ કરો (જિલ્લો, તાલુકો, ગામ)');
      return;
    }
    if (!fullAddress) {
      Alert.alert('ભૂલ', 'કૃપા કરીને સંપૂર્ણ સરનામું દાખલ કરો');
      return;
    }

    setLoading(true);
    setUploadingImages(true);

    try {
      console.log('=================================');
      console.log('🔄 STARTING LOCAL CARD UPDATE');
      console.log('=================================');

      // Step 1: Upload new images if selected
      let profileImageUrl = existingProfileImageUrl;
      let coverImageUrl = existingCoverImageUrl;
      let additionalImagesUrls = [...existingAdditionalImagesUrls];

      // Upload profile image only if a new one is selected
      if (profileImage && profileImage.uri) {
        console.log('📤 Uploading new profile image...');
        const profileResponse = await apiService.uploadLocalCardProfileImage(profileImage);
        if (profileResponse.success) {
          profileImageUrl = profileResponse.data.imageUrl;
          console.log('✅ New profile image URL:', profileImageUrl);
        }
      }

      // Upload cover image only if a new one is selected
      if (coverImage && coverImage.uri) {
        console.log('📤 Uploading new cover image...');
        const coverResponse = await apiService.uploadLocalCardCoverImage(coverImage);
        if (coverResponse.success) {
          coverImageUrl = coverResponse.data.imageUrl;
          console.log('✅ New cover image URL:', coverImageUrl);
        }
      }

      // Upload additional images only if new ones are selected
      if (additionalImages.length > 0) {
        console.log(`📤 Uploading ${additionalImages.length} new additional images...`);
        const additionalResponse = await apiService.uploadLocalCardAdditionalImages(additionalImages);
        if (additionalResponse.success && additionalResponse.data) {
          const newUrls = additionalResponse.data.map(item =>
            item.data?.uploadedImages?.[0]?.imageUrl || item.data?.imageUrl || ''
          ).filter(url => url !== '');
          additionalImagesUrls = [...additionalImagesUrls, ...newUrls];
          console.log('✅ New additional images URLs:', newUrls);
        }
      }

      console.log('=================================');
      console.log('✅ ALL IMAGES PROCESSED');
      console.log('Profile:', profileImageUrl);
      console.log('Cover:', coverImageUrl);
      console.log('Additional:', additionalImagesUrls);
      console.log('=================================');

      // Step 2: Prepare update data
      const updateData = {
        businessName: businessNameGujarati,
        businessNameGujarati: businessNameGujarati,
        businessDescription: businessDescriptionGujarati || '',
        businessDescriptionGujarati: businessDescriptionGujarati || '',
        categoryId: selectedCategory.categoryId,
        subCategoryId: selectedSubcategory.subCategoryId,
        contactPersonName: contactPersonName,
        primaryPhone: primaryPhone,
        secondaryPhone: secondaryPhone || '',
        whatsAppNumber: whatsAppNumber || primaryPhone,
        email: email || 'lokbazzar9999@gmail.com',
        districtId: selectedDistrict.districtId,
        talukaId: selectedTaluka.talukaId,
        villageId: selectedVillage.villageId,
        fullAddress: fullAddress,
        latitude: fetchedCardData?.latitude || 0,
        longitude: fetchedCardData?.longitude || 0,
        workingHours: workingHours || '9:00 AM - 6:00 PM',
        workingDays: workingDays || 'Monday to Saturday',
        isOpen24Hours: isOpen24Hours,
        profileImage: profileImageUrl,
        coverImage: coverImageUrl,
        additionalImages: additionalImagesUrls,
      };

      console.log('=================================');
      console.log('📋 UPDATING LOCAL CARD - PAYLOAD');
      console.log('=================================');
      console.log(JSON.stringify(updateData, null, 2));
      console.log('=================================');

      // Step 3: Update the card
      console.log('⏳ Calling API to update local card...');
      const response = await apiService.updateLocalCard(cardId, updateData);
      console.log('✅ Card update response received:', JSON.stringify(response, null, 2));

      if (response.success) {
        console.log('✅ Card updated successfully');
        console.log('🎉 All operations completed successfully!');

        Alert.alert(
          'સફળતા!',
          'તમારું લોકલ કાર્ડ સફળતાપૂર્વક અપડેટ થયું!',
          [
            {
              text: 'ઠીક છે',
              onPress: () => {
                goBack();
              }
            }
          ]
        );
      } else {
        console.error('❌ Card update failed - Response:', response);
        Alert.alert('ભૂલ', response.message || 'કાર્ડ અપડેટ કરવામાં સમસ્યા');
      }
    } catch (error) {
      console.error('❌ FATAL ERROR in handleSubmit:', error);
      console.error('❌ Error Message:', error.message);
      console.error('❌ Error Stack:', error.stack);

      if (error.message.includes('લૉગિન') || error.message.includes('સત્ર સમાપ્ત')) {
        Alert.alert('સત્ર સમાપ્ત', error.message, [
          {
            text: 'ઠીક છે',
            onPress: () => navigation.navigate('Welcome')
          }
        ]);
      } else {
        const errorMessage = error.message || 'કનેક્શન સમસ્યા. કૃપા કરીને ફરી પ્રયાસ કરો.';
        Alert.alert('ભૂલ', errorMessage);
      }
    } finally {
      setLoading(false);
      setUploadingImages(false);
    }
  };

  // Navigation helper
  const goBack = () => {
    if (router && router.back) {
      router.back();
    } else if (navigation && navigation.goBack) {
      navigation.goBack();
    }
  };

  // Selector Modal Component
  const SelectorModal = ({ title, data, onSelect, onClose, isLoading, selectedItem }) => (
    <View style={styles.modalContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={styles.placeholder} />
      </View>

      {/* List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>લોડ થઈ રહ્યું છે...</Text>
        </View>
      ) : (
        <FlatList
          data={data}
          numColumns={1}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.listItem,
                selectedItem?.id === item.id && styles.listItemSelected
              ]}
              onPress={() => onSelect(item)}
              activeOpacity={0.7}
            >
              {item.icon ? (
                <View style={[styles.iconBox, { backgroundColor: item.color || '#E5F5FF' }]}>
                  <Text style={styles.listIcon}>{item.icon}</Text>
                </View>
              ) : (
                <View style={[styles.iconBox, { backgroundColor: item.color || '#E5F5FF' }]}>
                  <Text style={styles.listIcon}>📍</Text>
                </View>
              )}
              <Text style={styles.listName}>{item.name}</Text>
              {selectedItem?.id === item.id && (
                <Text style={styles.checkIcon}>✓</Text>
              )}
              <Text style={styles.arrowIcon}>›</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );

  // If any selector is shown, display the modal
  if (showCategorySelector) {
    return (
      <SelectorModal
        title="કેટેગરી પસંદ કરો"
        data={categories}
        onSelect={handleCategorySelect}
        onClose={() => setShowCategorySelector(false)}
        isLoading={categoriesLoading}
        selectedItem={selectedCategory}
      />
    );
  }

  if (showSubcategorySelector) {
    return (
      <SelectorModal
        title="સબ-કેટેગરી પસંદ કરો"
        data={subcategories}
        onSelect={(item) => {
          setSelectedSubcategory(item);
          setShowSubcategorySelector(false);
        }}
        onClose={() => setShowSubcategorySelector(false)}
        isLoading={subcategoriesLoading}
        selectedItem={selectedSubcategory}
      />
    );
  }

  if (showDistrictSelector) {
    return (
      <SelectorModal
        title="જિલ્લો પસંદ કરો"
        data={districts}
        onSelect={handleDistrictSelect}
        onClose={() => setShowDistrictSelector(false)}
        isLoading={districtsLoading}
        selectedItem={selectedDistrict}
      />
    );
  }

  if (showTalukaSelector) {
    return (
      <SelectorModal
        title="તાલુકો પસંદ કરો"
        data={talukas}
        onSelect={handleTalukaSelect}
        onClose={() => setShowTalukaSelector(false)}
        isLoading={talukasLoading}
        selectedItem={selectedTaluka}
      />
    );
  }

  if (showVillageSelector) {
    return (
      <SelectorModal
        title="ગામ પસંદ કરો"
        data={villages}
        onSelect={(item) => {
          setSelectedVillage(item);
          setShowVillageSelector(false);
        }}
        onClose={() => setShowVillageSelector(false)}
        isLoading={villagesLoading}
        selectedItem={selectedVillage}
      />
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>લોકલ કાર્ડ એડિટ કરો</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Business Information Section */}
        <Text style={styles.sectionHeader}>📋 બિઝનેસ માહિતી</Text>

        <View style={styles.section}>
          <Text style={styles.label}>બિઝનેસનું નામ *</Text>
          <TextInput
            style={styles.input}
            placeholder="દા.ત. શ્રી ઇલેક્ટ્રોનિક્સ"
            placeholderTextColor="#999"
            value={businessNameGujarati}
            onChangeText={setBusinessNameGujarati}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>બિઝનેસ વર્ણન</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="બિઝનેસ વિશે વિગતવાર માહિતી આપો..."
            placeholderTextColor="#999"
            value={businessDescriptionGujarati}
            onChangeText={setBusinessDescriptionGujarati}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Category Section */}
        <Text style={styles.sectionHeader}>🏷️ કેટેગરી</Text>

        <View style={styles.section}>
          <Text style={styles.label}>કેટેગરી પસંદ કરો *</Text>
          <TouchableOpacity
            style={styles.selectorButton}
            onPress={() => setShowCategorySelector(true)}
          >
            {selectedCategory ? (
              <>
                <View style={[styles.selectedIconBox, { backgroundColor: selectedCategory.color }]}>
                  <Text style={styles.selectedIcon}>{selectedCategory.icon}</Text>
                </View>
                <Text style={styles.selectedName}>{selectedCategory.name}</Text>
                <Text style={styles.arrowIcon}>›</Text>
              </>
            ) : (
              <>
                <Text style={styles.placeholderIcon}>📦</Text>
                <Text style={styles.placeholderText}>કેટેગરી પસંદ કરો</Text>
                <Text style={styles.arrowIcon}>›</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {selectedCategory && (
          <View style={styles.section}>
            <Text style={styles.label}>સબ-કેટેગરી પસંદ કરો *</Text>
            <TouchableOpacity
              style={styles.selectorButton}
              onPress={() => setShowSubcategorySelector(true)}
              disabled={subcategories.length === 0}
            >
              {selectedSubcategory ? (
                <>
                  <View style={[styles.selectedIconBox, { backgroundColor: selectedSubcategory.color }]}>
                    <Text style={styles.selectedIcon}>{selectedSubcategory.icon}</Text>
                  </View>
                  <Text style={styles.selectedName}>{selectedSubcategory.name}</Text>
                  <Text style={styles.arrowIcon}>›</Text>
                </>
              ) : (
                <>
                  <Text style={styles.placeholderIcon}>📋</Text>
                  <Text style={styles.placeholderText}>સબ-કેટેગરી પસંદ કરો</Text>
                  <Text style={styles.arrowIcon}>›</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Contact Information Section */}
        <Text style={styles.sectionHeader}>📞 સંપર્ક માહિતી</Text>

        <View style={styles.section}>
          <Text style={styles.label}>સંપર્ક વ્યક્તિનું નામ *</Text>
          <TextInput
            style={styles.input}
            placeholder="દા.ત. રમેશભાઈ પટેલ"
            placeholderTextColor="#999"
            value={contactPersonName}
            onChangeText={setContactPersonName}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>પ્રાથમિક ફોન નંબર *</Text>
          <TextInput
            style={styles.input}
            placeholder="દા.ત. 9876543210"
            placeholderTextColor="#999"
            value={primaryPhone}
            onChangeText={setPrimaryPhone}
            keyboardType="phone-pad"
            maxLength={10}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>ગૌણ ફોન નંબર</Text>
          <TextInput
            style={styles.input}
            placeholder="દા.ત. 9876543211"
            placeholderTextColor="#999"
            value={secondaryPhone}
            onChangeText={setSecondaryPhone}
            keyboardType="phone-pad"
            maxLength={10}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>વોટ્સએપ નંબર</Text>
          <TextInput
            style={styles.input}
            placeholder="દા.ત. 9876543210"
            placeholderTextColor="#999"
            value={whatsAppNumber}
            onChangeText={setWhatsAppNumber}
            keyboardType="phone-pad"
            maxLength={10}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>ઇમેઇલ</Text>
          <TextInput
            style={styles.input}
            placeholder="દા.ત. business@example.com"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Location Section */}
        <Text style={styles.sectionHeader}>📍 સ્થાન</Text>

        <View style={styles.section}>
          <Text style={styles.label}>જિલ્લો પસંદ કરો *</Text>
          <TouchableOpacity
            style={styles.selectorButton}
            onPress={() => setShowDistrictSelector(true)}
          >
            {selectedDistrict ? (
              <>
                <View style={[styles.selectedIconBox, { backgroundColor: selectedDistrict.color }]}>
                  <Text style={styles.selectedIcon}>📍</Text>
                </View>
                <Text style={styles.selectedName}>{selectedDistrict.name}</Text>
                <Text style={styles.arrowIcon}>›</Text>
              </>
            ) : (
              <>
                <Text style={styles.placeholderIcon}>📍</Text>
                <Text style={styles.placeholderText}>જિલ્લો પસંદ કરો</Text>
                <Text style={styles.arrowIcon}>›</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {selectedDistrict && (
          <View style={styles.section}>
            <Text style={styles.label}>તાલુકો પસંદ કરો *</Text>
            <TouchableOpacity
              style={styles.selectorButton}
              onPress={() => setShowTalukaSelector(true)}
              disabled={talukas.length === 0}
            >
              {selectedTaluka ? (
                <>
                  <View style={[styles.selectedIconBox, { backgroundColor: selectedTaluka.color }]}>
                    <Text style={styles.selectedIcon}>📍</Text>
                  </View>
                  <Text style={styles.selectedName}>{selectedTaluka.name}</Text>
                  <Text style={styles.arrowIcon}>›</Text>
                </>
              ) : (
                <>
                  <Text style={styles.placeholderIcon}>📍</Text>
                  <Text style={styles.placeholderText}>તાલુકો પસંદ કરો</Text>
                  <Text style={styles.arrowIcon}>›</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        {selectedTaluka && (
          <View style={styles.section}>
            <Text style={styles.label}>ગામ પસંદ કરો *</Text>
            <TouchableOpacity
              style={styles.selectorButton}
              onPress={() => setShowVillageSelector(true)}
              disabled={villages.length === 0}
            >
              {selectedVillage ? (
                <>
                  <View style={[styles.selectedIconBox, { backgroundColor: selectedVillage.color }]}>
                    <Text style={styles.selectedIcon}>📍</Text>
                  </View>
                  <Text style={styles.selectedName}>{selectedVillage.name}</Text>
                  <Text style={styles.arrowIcon}>›</Text>
                </>
              ) : (
                <>
                  <Text style={styles.placeholderIcon}>📍</Text>
                  <Text style={styles.placeholderText}>ગામ પસંદ કરો</Text>
                  <Text style={styles.arrowIcon}>›</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.label}>સંપૂર્ણ સરનામું *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="સંપૂર્ણ સરનામું લખો..."
            placeholderTextColor="#999"
            value={fullAddress}
            onChangeText={setFullAddress}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Working Hours Section */}
        <Text style={styles.sectionHeader}>⏰ કામના સમય</Text>

        <View style={styles.section}>
          <Text style={styles.label}>કામના કલાકો</Text>
          <TextInput
            style={styles.input}
            placeholder="દા.ત. 9:00 AM - 6:00 PM"
            placeholderTextColor="#999"
            value={workingHours}
            onChangeText={setWorkingHours}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>કામના દિવસો</Text>
          <TextInput
            style={styles.input}
            placeholder="દા.ત. Monday to Saturday"
            placeholderTextColor="#999"
            value={workingDays}
            onChangeText={setWorkingDays}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.switchRow}>
            <Text style={styles.label}>24 કલાક ખુલ્લું</Text>
            <Switch
              value={isOpen24Hours}
              onValueChange={setIsOpen24Hours}
              trackColor={{ false: '#D0D0D0', true: '#4CAF50' }}
              thumbColor={isOpen24Hours ? '#FFFFFF' : '#F4F4F4'}
            />
          </View>
        </View>

        {/* Images Section */}
        <Text style={styles.sectionHeader}>📸 ફોટા</Text>

        {/* Profile Image */}
        <View style={styles.section}>
          <Text style={styles.label}>પ્રોફાઇલ ફોટો</Text>
          <TouchableOpacity
            style={styles.imagePicker}
            onPress={handleProfileImagePick}
          >
            {profileImage ? (
              <Image source={{ uri: profileImage.uri }} style={styles.imagePreview} />
            ) : existingProfileImageUrl ? (
              <Image
                source={{ uri: `${API_CONFIG.BASE_URL_Image}${existingProfileImageUrl}` }}
                style={styles.imagePreview}
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imagePlaceholderIcon}>📷</Text>
                <Text style={styles.imagePlaceholderText}>પ્રોફાઇલ ફોટો પસંદ કરો</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Cover Image */}
        <View style={styles.section}>
          <Text style={styles.label}>કવર ફોટો</Text>
          <TouchableOpacity
            style={styles.coverImagePicker}
            onPress={handleCoverImagePick}
          >
            {coverImage ? (
              <Image source={{ uri: coverImage.uri }} style={styles.coverImagePreview} />
            ) : existingCoverImageUrl ? (
              <Image
                source={{ uri: `${API_CONFIG.BASE_URL_Image}${existingCoverImageUrl}` }}
                style={styles.coverImagePreview}
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imagePlaceholderIcon}>📷</Text>
                <Text style={styles.imagePlaceholderText}>કવર ફોટો પસંદ કરો</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Additional Images */}
        <View style={styles.section}>
          <Text style={styles.label}>વધારાના ફોટા (મહત્તમ 5)</Text>

          {/* Show existing images */}
          {existingAdditionalImagesUrls.length > 0 && (
            <View style={styles.additionalImagesContainer}>
              <Text style={styles.imagesSectionLabel}>હાલના ફોટા:</Text>
              <View style={styles.imagesGrid}>
                {existingAdditionalImagesUrls.map((imageUrl, index) => (
                  <View key={`existing-${index}`} style={styles.additionalImageItem}>
                    <Image
                      source={{ uri: `${API_CONFIG.BASE_URL_Image}${imageUrl}` }}
                      style={styles.additionalImagePreview}
                    />
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => handleRemoveExistingImage(index)}
                    >
                      <Text style={styles.removeImageText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Show new images */}
          {additionalImages.length > 0 && (
            <View style={styles.additionalImagesContainer}>
              <Text style={styles.imagesSectionLabel}>નવા ફોટા:</Text>
              <View style={styles.imagesGrid}>
                {additionalImages.map((image, index) => (
                  <View key={`new-${index}`} style={styles.additionalImageItem}>
                    <Image
                      source={{ uri: image.uri }}
                      style={styles.additionalImagePreview}
                    />
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => handleRemoveAdditionalImage(index)}
                    >
                      <Text style={styles.removeImageText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          )}

          {(additionalImages.length + existingAdditionalImagesUrls.length) < 5 && (
            <TouchableOpacity
              style={styles.addImageButton}
              onPress={handleAdditionalImagePick}
            >
              <Text style={styles.addImageIcon}>＋</Text>
              <Text style={styles.addImageText}>વધારાના ફોટો ઉમેરો</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <>
              <ActivityIndicator size="small" color="#FFFFFF" style={styles.buttonLoader} />
              <Text style={styles.submitButtonText}>
                {uploadingImages ? 'ફોટા અપલોડ થઈ રહ્યા છે...' : 'અપડેટ થઈ રહ્યું છે...'}
              </Text>
            </>
          ) : (
            <Text style={styles.submitButtonText}>કાર્ડ અપડેટ કરો</Text>
          )}
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
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
    paddingHorizontal: 15,
    paddingVertical: 15,
    paddingTop: 40,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  backButton: {
    padding: 5,
  },
  backIcon: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 28,
  },
  content: {
    flex: 1,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#F5F5F5',
  },
  section: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 14,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  selectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  selectedIcon: {
    fontSize: 18,
  },
  selectedName: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    fontWeight: '500',
  },
  placeholderIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  placeholderText: {
    fontSize: 14,
    color: '#999',
    flex: 1,
  },
  arrowIcon: {
    fontSize: 20,
    color: '#999',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  imagePicker: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  coverImagePicker: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  coverImagePreview: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
  },
  imagePlaceholderIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  imagePlaceholderText: {
    fontSize: 12,
    color: '#999',
  },
  additionalImagesContainer: {
    marginTop: 10,
  },
  imagesSectionLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  additionalImageItem: {
    position: 'relative',
    width: 90,
    height: 90,
    borderRadius: 8,
    overflow: 'hidden',
  },
  additionalImagePreview: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(244, 67, 54, 0.9)',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  addImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    paddingVertical: 15,
    marginTop: 10,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  addImageIcon: {
    fontSize: 20,
    color: '#4CAF50',
    marginRight: 8,
  },
  addImageText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 15,
    marginHorizontal: 20,
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  submitButtonDisabled: {
    backgroundColor: '#A5D6A7',
  },
  buttonLoader: {
    marginRight: 10,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  listContainer: {
    padding: 15,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  listItemSelected: {
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  listIcon: {
    fontSize: 20,
  },
  listName: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    fontWeight: '500',
  },
  checkIcon: {
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginRight: 8,
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
  },
});
