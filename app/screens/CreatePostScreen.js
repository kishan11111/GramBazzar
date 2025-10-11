
// import { useState } from 'react';
// import {
//   Alert,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View
// } from 'react-native';
// import { apiService } from '../config/api';

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { apiService } from '../config/api';



export default function CreatePostScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [images, setImages] = useState([]);
  
  // Dynamic fields
  const [year, setYear] = useState('');
  const [kilometers, setKilometers] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');

  // All categories
  const categories = [
    { id: 1, name: 'કાર', icon: '🚗', needsVehicleInfo: true },
    { id: 2, name: 'બાઇક', icon: '🏍️', needsVehicleInfo: true },
    { id: 3, name: 'સ્કૂટર', icon: '🛵', needsVehicleInfo: true },
    { id: 4, name: 'ટ્રેક્ટર', icon: '🚜', needsVehicleInfo: true },
    { id: 5, name: 'ગાય', icon: '🐄', needsAnimalInfo: true },
    { id: 6, name: 'ભેંસ', icon: '🐃', needsAnimalInfo: true },
    { id: 7, name: 'બકરી', icon: '🐐', needsAnimalInfo: true },
    { id: 8, name: 'ઘોડો', icon: '🐴', needsAnimalInfo: true },
    { id: 9, name: 'મરઘી', icon: '🐔', needsAnimalInfo: true },
    { id: 10, name: 'ખેત', icon: '🌾', needsLandInfo: true },
    { id: 11, name: 'જમીન', icon: '🏞️', needsLandInfo: true },
    { id: 12, name: 'મકાન', icon: '🏠', needsPropertyInfo: true },
    { id: 13, name: 'મોબાઇલ', icon: '📱', needsBasicInfo: true },
    { id: 14, name: 'ફર્નિચર', icon: '🪑', needsBasicInfo: true },
    { id: 15, name: 'નોકરી', icon: '💼', needsJobInfo: true },
  ];

  const selectedCategoryData = categories.find(c => c.name === selectedCategory);

  const handleImagePick = () => {
    // Will implement image picker later
    Alert.alert('ફોટો', 'ફોટો પસંદ કરવાની સુવિધા ટૂંક સમયમાં ઉપલબ્ધ થશે');
  };

  const handleSubmit = async () => {
  // Validation
  if (!selectedCategory) {
    Alert.alert('ભૂલ', 'કૃપા કરીને કેટેગરી પસંદ કરો');
    return;
  }
  if (!title) {
    Alert.alert('ભ૚ל', 'કૃપા કરીને શીર્ષક દાખલ કરો');
    return;
  }
  if (!price) {
    Alert.alert('ભૂલ', 'કૃપા કરીને કિંમત દાખલ કરો');
    return;
  }
  if (!location) {
    Alert.alert('ભૂલ', 'કૃપા કરીને સ્થળ દાખલ કરો');
    return;
  }

  setLoading(true);

  try {
    // Get user data from storage
    const userDataString = await AsyncStorage.getItem('userData');
    const userData = JSON.parse(userDataString);

    if (!userData) {
      Alert.alert('ભૂલ', 'કૃપા કરીને ફરી લૉગિન કરો');
      navigation.navigate('Welcome');
      return;
    }

    // Prepare post data
    const postData = {
      title: title,
      description: description || 'વધુ માહિતી માટે સંપર્ક કરો',
      price: parseFloat(price),
      priceType: 'NEGOTIABLE',
      condition: 'GOOD',
      categoryId: 1, // Static for now
      subCategoryId: selectedCategoryData?.id || 1, // Using category id
      districtId: userData.districtId,
      talukaId: userData.talukaId,
      villageId: userData.villageId,
      address: location,
      contactMethod: 'BOTH',
      contactPhone: userData.mobile,
    };

    // Add dynamic fields based on category
    if (selectedCategoryData?.needsVehicleInfo) {
      // Add vehicle specific data if needed
      postData.description = `${description}\nવર્ષ: ${year}, કિ.મી.: ${kilometers}`;
    } else if (selectedCategoryData?.needsAnimalInfo) {
      // Add animal specific data if needed
      postData.description = `${description}\nજાતિ: ${breed}, ઉંમર: ${age}`;
    }

    const response = await apiService.createPost(postData);

    if (response.success) {
      Alert.alert(
        'સફળતા!',
        'તમારી જાહેરાત પોસ્ટ થઈ ગઈ છે!',
        [
          {
            text: 'ઠીક છે',
            onPress: () => navigation.navigate('Account')
          }
        ]
      );
    } else {
      Alert.alert('ભૂલ', response.message || 'જાહેરાત પોસ્ટ કરવામાં સમસ્યા');
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
      Alert.alert('ભૂલ', 'કનેક્શન સમસ્યા. કૃપા કરીને ફરી પ્રયાસ કરો.');
    }
    console.error('Create Post Error:', error);
  } finally {
    setLoading(false);
  }
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
          <Text style={styles.backIcon}>×</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>જાહેરાત મૂકો</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Category Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>કેટેગરી પસંદ કરો *</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScroll}
          >
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryChip,
                  selectedCategory === cat.name && styles.categoryChipActive
                ]}
                onPress={() => setSelectedCategory(cat.name)}
              >
                <Text style={styles.categoryIcon}>{cat.icon}</Text>
                <Text style={[
                  styles.categoryText,
                  selectedCategory === cat.name && styles.categoryTextActive
                ]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Image Upload */}
        <View style={styles.section}>
          <Text style={styles.label}>ફોટો ઉમેરો *</Text>
          <TouchableOpacity 
            style={styles.imageUploadBox}
            onPress={handleImagePick}
          >
            <Text style={styles.uploadIcon}>📸</Text>
            <Text style={styles.uploadText}>ફોટો પસંદ કરો</Text>
            <Text style={styles.uploadSubtext}>મહત્તમ 5 ફોટો</Text>
          </TouchableOpacity>
        </View>

        {/* Title */}
        <View style={styles.section}>
          <Text style={styles.label}>શીર્ષક *</Text>
          <TextInput
            style={styles.input}
            placeholder="દા.ત. Bajaj Pulsar 150 અથવા દેશી ગાય"
            placeholderTextColor="#999"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.label}>વર્ણન</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="તમારી વસ્તુ વિશે વિગતવાર માહિતી આપો..."
            placeholderTextColor="#999"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Dynamic Fields - Vehicle Info */}
        {selectedCategoryData?.needsVehicleInfo && (
          <>
            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={styles.label}>વર્ષ *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="2020"
                  placeholderTextColor="#999"
                  value={year}
                  onChangeText={setYear}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.halfInput}>
                <Text style={styles.label}>કિલોમીટર *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="15000"
                  placeholderTextColor="#999"
                  value={kilometers}
                  onChangeText={setKilometers}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </>
        )}

        {/* Dynamic Fields - Animal Info */}
        {selectedCategoryData?.needsAnimalInfo && (
          <>
            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={styles.label}>જાતિ</Text>
                <TextInput
                  style={styles.input}
                  placeholder="દા.ત. ગીર, મુર્રાહ"
                  placeholderTextColor="#999"
                  value={breed}
                  onChangeText={setBreed}
                />
              </View>
              <View style={styles.halfInput}>
                <Text style={styles.label}>ઉંમર</Text>
                <TextInput
                  style={styles.input}
                  placeholder="દા.ત. 3 વર્ષ"
                  placeholderTextColor="#999"
                  value={age}
                  onChangeText={setAge}
                />
              </View>
            </View>
          </>
        )}

        {/* Price */}
        <View style={styles.section}>
          <Text style={styles.label}>કિંમત (₹) *</Text>
          <TextInput
            style={styles.input}
            placeholder="દા.ત. 45000"
            placeholderTextColor="#999"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.label}>સ્થળ *</Text>
          <TextInput
            style={styles.input}
            placeholder="દા.ત. અમદાવાદ"
            placeholderTextColor="#999"
            value={location}
            onChangeText={setLocation}
          />
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <Text style={styles.infoText}>
            તમારી જાહેરાત ચકાસણી પછી 24 કલાકમાં લાઇવ થશે
          </Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <Text style={styles.submitText}>જાહેરાત પોસ્ટ કરો</Text>
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
    fontSize: 36,
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
  section: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    marginTop: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  categoryScroll: {
    marginTop: 10,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  categoryChipActive: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
  categoryIcon: {
    fontSize: 20,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  imageUploadBox: {
    borderWidth: 2,
    borderColor: '#C8E6C9',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    backgroundColor: '#F1F8E9',
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
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    paddingTop: 15,
    marginTop: 10,
  },
  halfInput: {
    flex: 1,
    marginHorizontal: 5,
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
  submitText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});