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
import { apiService } from '../config/api';

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

export default function CreateLocalCardScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

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

  // Images
  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);

  useEffect(() => {
    fetchCategories();
    fetchDistricts();
  }, []);

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
      } else {
        Alert.alert('ભૂલ', 'કેટેગરી લોડ કરવામાં નિષ્ફળ');
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
      } else {
        Alert.alert('ભૂલ', 'સબ-કેટેગરી લોડ કરવામાં નિષ્ફળ');
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      Alert.alert('ભૂલ', 'સબ-કેટેગરી લોડ કરવામાં નિષ્ફળ. કૃપા કરીને ફરી પ્રયાસ કરો.');
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
      } else {
        Alert.alert('ભૂલ', 'જિલ્લા લોડ કરવામાં નિષ્ફળ');
      }
    } catch (error) {
      console.error('Error fetching districts:', error);
      Alert.alert('ભૂલ', 'જિલ્લા લોડ કરવામાં નિષ્ફળ. કૃપા કરીને ફરી પ્રયાસ કરો.');
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
      } else {
        Alert.alert('ભૂલ', 'તાલુકા લોડ કરવામાં નિષ્ફળ');
      }
    } catch (error) {
      console.error('Error fetching talukas:', error);
      Alert.alert('ભૂલ', 'તાલુકા લોડ કરવામાં નિષ્ફળ. કૃપા કરીને ફરી પ્રયાસ કરો.');
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
      } else {
        Alert.alert('ભૂલ', 'ગામ લોડ કરવામાં નિષ્ફળ');
      }
    } catch (error) {
      console.error('Error fetching villages:', error);
      Alert.alert('ભૂલ', 'ગામ લોડ કરવામાં નિષ્ફળ. કૃપા કરીને ફરી પ્રયાસ કરો.');
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
    if (additionalImages.length >= 5) {
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
      setAdditionalImages([...additionalImages, newImage].slice(0, 5));
    }
  };

  const handleRemoveAdditionalImage = (index) => {
    const newImages = additionalImages.filter((_, i) => i !== index);
    setAdditionalImages(newImages);
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
    if (!profileImage) {
      Alert.alert('ભૂલ', 'કૃપા કરીને પ્રોફાઇલ ફોટો પસંદ કરો');
      return;
    }

    setLoading(true);
    setUploadingImages(true);

    try {
      console.log('=================================');
      console.log('🚀 STARTING LOCAL CARD CREATION');
      console.log('=================================');

      // Step 1: Upload images FIRST to get URLs
      let profileImageUrl = '';
      let coverImageUrl = '';
      let additionalImagesUrls = [];

      // Upload profile image
      if (profileImage) {
        console.log('📤 Step 1a: Uploading profile image...');
        const profileResponse = await apiService.uploadLocalCardProfileImage(profileImage);
        if (profileResponse.success) {
          profileImageUrl = profileResponse.data.imageUrl;
          console.log('✅ Profile image URL:', profileImageUrl);
        }
      }

      // Upload cover image
      if (coverImage) {
        console.log('📤 Step 1b: Uploading cover image...');
        const coverResponse = await apiService.uploadLocalCardCoverImage(coverImage);
        if (coverResponse.success) {
          coverImageUrl = coverResponse.data.imageUrl;
          console.log('✅ Cover image URL:', coverImageUrl);
        }
      }

      // Upload additional images
      if (additionalImages.length > 0) {
        console.log(`📤 Step 1c: Uploading ${additionalImages.length} additional images...`);
        const additionalResponse = await apiService.uploadLocalCardAdditionalImages(additionalImages);
        if (additionalResponse.success && additionalResponse.data) {
          additionalImagesUrls = additionalResponse.data.map(item =>
            item.data?.uploadedImages?.[0]?.imageUrl || item.data?.imageUrl || ''
          ).filter(url => url !== '');
          console.log('✅ Additional images URLs:', additionalImagesUrls);
        }
      }

      console.log('=================================');
      console.log('✅ ALL IMAGES UPLOADED');
      console.log('Profile:', profileImageUrl);
      console.log('Cover:', coverImageUrl);
      console.log('Additional:', additionalImagesUrls);
      console.log('=================================');

      // Step 2: Prepare card data with image URLs
      const cardData = {
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
        email: email || '',
        districtId: selectedDistrict.districtId,
        talukaId: selectedTaluka.talukaId,
        villageId: selectedVillage.villageId,
        fullAddress: fullAddress,
        latitude: null,
        longitude: null,
        workingHours: workingHours || '9:00 AM - 6:00 PM',
        workingDays: workingDays || 'Monday to Saturday',
        isOpen24Hours: isOpen24Hours,
        // Pass the image URLs we got from upload
        profileImage: profileImageUrl,
        coverImage: coverImageUrl,
        additionalImages: additionalImagesUrls,
      };

      console.log('=================================');
      console.log('📋 CREATING LOCAL CARD - PAYLOAD');
      console.log('=================================');
      console.log(JSON.stringify(cardData, null, 2));
      console.log('=================================');

      // Step 3: Create the card with image URLs
      console.log('⏳ Step 2: Calling API to create local card...');
      const response = await apiService.createLocalCard(cardData);
      console.log('✅ Card creation response received:', JSON.stringify(response, null, 2));

      if (response.success) {
        const cardId = response.data.cardId;
        console.log('✅ Card created successfully with ID:', cardId);
        console.log('🎉 All operations completed successfully!');

        Alert.alert(
          'સફળતા!',
          'તમારું લોકલ કાર્ડ સફળતાપૂર્વક બનાવાયું!',
          [
            {
              text: 'ઠીક છે',
              onPress: () => {
                navigation.goBack();
              }
            }
          ]
        );
      } else {
        console.error('❌ Card creation failed - Response:', response);
        Alert.alert('ભૂલ', response.message || 'કાર્ડ બનાવવામાં સમસ્યા');
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
        // Show detailed error message
        const errorMessage = error.message || 'કનેક્શન સમસ્યા. કૃપા કરીને ફરી પ્રયાસ કરો.';
        Alert.alert('ભૂલ', errorMessage);
      }
    } finally {
      setLoading(false);
      setUploadingImages(false);
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
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>લોકલ કાર્ડ બનાવો</Text>
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
            placeholder="દા.ત. મુખ્ય બજાર પાસે, બસ સ્ટેન્ડ નજીક"
            placeholderTextColor="#999"
            value={fullAddress}
            onChangeText={setFullAddress}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Working Hours Section */}
        <Text style={styles.sectionHeader}>🕐 કામકાજના કલાકો</Text>

        <View style={styles.section}>
          <Text style={styles.label}>કામકાજના કલાકો</Text>
          <TextInput
            style={styles.input}
            placeholder="દા.ત. 9:00 AM - 9:00 PM"
            placeholderTextColor="#999"
            value={workingHours}
            onChangeText={setWorkingHours}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>કામકાજના દિવસો</Text>
          <TextInput
            style={styles.input}
            placeholder="દા.ત. સોમવારથી શનિવાર"
            placeholderTextColor="#999"
            value={workingDays}
            onChangeText={setWorkingDays}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.switchRow}>
            <Text style={styles.label}>24 કલાક ખુલ્લું છે?</Text>
            <Switch
              value={isOpen24Hours}
              onValueChange={setIsOpen24Hours}
              trackColor={{ false: '#CCC', true: '#81C784' }}
              thumbColor={isOpen24Hours ? '#4CAF50' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Images Section */}
        <Text style={styles.sectionHeader}>📸 ફોટા</Text>

        {/* Profile Image */}
        <View style={styles.section}>
          <Text style={styles.label}>પ્રોફાઇલ ફોટો *</Text>
          {profileImage ? (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: profileImage.uri }} style={styles.profileImagePreview} />
              <TouchableOpacity
                style={styles.changeImageButton}
                onPress={handleProfileImagePick}
              >
                <Text style={styles.changeImageText}>ફોટો બદલો</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.imageUploadBox}
              onPress={handleProfileImagePick}
            >
              <Text style={styles.uploadIcon}>📸</Text>
              <Text style={styles.uploadText}>પ્રોફાઇલ ફોટો પસંદ કરો</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Cover Image */}
        <View style={styles.section}>
          <Text style={styles.label}>કવર ફોટો</Text>
          {coverImage ? (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: coverImage.uri }} style={styles.coverImagePreview} />
              <TouchableOpacity
                style={styles.changeImageButton}
                onPress={handleCoverImagePick}
              >
                <Text style={styles.changeImageText}>ફોટો બદલો</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.imageUploadBox}
              onPress={handleCoverImagePick}
            >
              <Text style={styles.uploadIcon}>📸</Text>
              <Text style={styles.uploadText}>કવર ફોટો પસંદ કરો</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Additional Images */}
        <View style={styles.section}>
          <Text style={styles.label}>વધારાના ફોટા ({additionalImages.length}/5)</Text>

          {additionalImages.length > 0 && (
            <View style={styles.imageGrid}>
              {additionalImages.map((image, index) => (
                <View key={index} style={styles.imageContainer}>
                  <Image source={{ uri: image.uri }} style={styles.thumbnail} />
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveAdditionalImage(index)}
                  >
                    <Text style={styles.removeButtonText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {additionalImages.length < 5 && (
            <TouchableOpacity
              style={styles.imageUploadBox}
              onPress={handleAdditionalImagePick}
            >
              <Text style={styles.uploadIcon}>📸</Text>
              <Text style={styles.uploadText}>વધારાના ફોટા પસંદ કરો</Text>
              <Text style={styles.uploadSubtext}>મહત્તમ 5 ફોટા</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>🎉</Text>
          <Text style={styles.infoText}>
            હવે સંપૂર્ણ ફ્રી માં તમારું લોકલ કાર્ડ બનાવો! તમારું લોકલ કાર્ડ ચકાસણી પછી 24 કલાકમાં લાઇવ થશે
          </Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, (loading || uploadingImages) && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading || uploadingImages}
        >
          {loading || uploadingImages ? (
            <View style={styles.loadingButtonContainer}>
              <ActivityIndicator color="#FFFFFF" />
              <Text style={styles.submitText}>
                {uploadingImages ? 'ફોટો અપલોડ થઈ રહ્યા છે...' : 'કાર્ડ બની રહ્યું છે...'}
              </Text>
            </View>
          ) : (
            <Text style={styles.submitText}>લોકલ કાર્ડ બનાવો</Text>
          )}
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  modalContainer: {
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
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 15,
    marginBottom: 5,
    marginHorizontal: 15,
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    marginTop: 5,
    marginHorizontal: 10,
    borderRadius: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#C8E6C9',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#FAFAFA',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 15,
    marginTop: 5,
    marginHorizontal: 10,
    borderRadius: 8,
    gap: 10,
  },
  halfInput: {
    flex: 1,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderWidth: 1.5,
    borderColor: '#C8E6C9',
    borderRadius: 10,
    padding: 15,
  },
  selectedIconBox: {
    width: 50,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  selectedIcon: {
    fontSize: 28,
  },
  selectedName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  placeholderIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  placeholderText: {
    flex: 1,
    fontSize: 16,
    color: '#999',
  },
  arrowIcon: {
    fontSize: 28,
    color: '#999',
  },
  checkIcon: {
    fontSize: 20,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginRight: 5,
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
  listContainer: {
    padding: 10,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 12,
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
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  listIcon: {
    fontSize: 32,
  },
  listName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  imageUploadBox: {
    borderWidth: 2,
    borderColor: '#C8E6C9',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    backgroundColor: '#F1F8E9',
    marginTop: 10,
  },
  uploadIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  uploadText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 4,
  },
  uploadSubtext: {
    fontSize: 12,
    color: '#666',
  },
  imagePreviewContainer: {
    marginTop: 10,
  },
  profileImagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 10,
  },
  coverImagePreview: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    marginBottom: 10,
  },
  changeImageButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  changeImageText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
    gap: 10,
  },
  imageContainer: {
    position: 'relative',
    width: '48%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  removeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(244, 67, 54, 0.9)',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    padding: 15,
    marginHorizontal: 15,
    marginTop: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#1565C0',
    lineHeight: 20,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    marginHorizontal: 15,
    marginTop: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
  },
  submitButtonDisabled: {
    backgroundColor: '#A5D6A7',
  },
  loadingButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
