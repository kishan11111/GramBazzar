import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    Modal,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { apiService } from '../config/api';

export default function EditProfileScreen({ navigation }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
    locationString: '',
    districtId: '',
    talukaId: '',
    villageId: '',
    profileImage: null,
  });

  const [districts, setDistricts] = useState([]);
  const [talukas, setTalukas] = useState([]);
  const [villages, setVillages] = useState([]);

  // selected objects for display (auto-filled from IDs)
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedTaluka, setSelectedTaluka] = useState(null);
  const [selectedVillage, setSelectedVillage] = useState(null);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalData, setModalData] = useState([]);

  useEffect(() => {
    loadUserData();
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to upload images.');
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setFormData(prev => ({
          ...prev,
          profileImage: result.assets[0].uri
        }));
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  // Load user profile + linked location data
  const loadUserData = async () => {
    try {
      const response = await apiService.getUserProfile();
      if (response.success && response.data) {
        const user = response.data;
        setFormData({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          mobile: user.mobile || '',
          locationString: user.locationString || '',
          districtId: user.districtId || '',
          talukaId: user.talukaId || '',
          villageId: user.villageId || '',
        });

        await loadDistricts(user.districtId, user.talukaId, user.villageId);
      }
    } catch (error) {
      console.error('❌ loadUserData error:', error);
      Alert.alert('ભૂલ', 'પ્રોફાઇલ લોડ કરવામાં સમસ્યા');
    } finally {
      setInitialLoading(false);
    }
  };

  const loadDistricts = async (districtId, talukaId, villageId) => {
    try {
      const data = await apiService.getDistricts();
      if (data.success) {
        setDistricts(data.data || []);
        // auto-select district object if id provided
        if (districtId) {
          const found = (data.data || []).find((d) => String(d.districtId) === String(districtId));
          setSelectedDistrict(found || null);
          await loadTalukas(districtId, talukaId, villageId);
        }
        return data.data || [];
      }
      return [];
    } catch (error) {
      console.error('❌ loadDistricts error:', error);
      return [];
    }
  };

  const loadTalukas = async (districtId, talukaId, villageId) => {
    try {
      const data = await apiService.getTalukas(districtId);
      if (data.success) {
        setTalukas(data.data || []);
        // auto-select taluka object if id provided
        if (talukaId) {
          const found = (data.data || []).find((t) => String(t.talukaId) === String(talukaId));
          setSelectedTaluka(found || null);
          await loadVillages(talukaId, villageId);
        }
        return data.data || [];
      }
      return [];
    } catch (error) {
      console.error('❌ loadTalukas error:', error);
      return [];
    }
  };

  const loadVillages = async (talukaId, villageId) => {
    try {
      const data = await apiService.getVillages(talukaId);
      if (data.success) {
        setVillages(data.data || []);
        if (villageId) {
          const found = (data.data || []).find((v) => String(v.villageId) === String(villageId));
          setSelectedVillage(found || null);
        }
        return data.data || [];
      }
      return [];
    } catch (error) {
      console.error('❌ loadVillages error:', error);
      return [];
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      // Validate required fields
      if (!formData.firstName || !formData.lastName) {
        Alert.alert('ભૂલ', 'કૃપા કરીને પ્રથમ નામ અને છેલ્લું નામ દાખલ કરો');
        return;
      }

      let profileImageUrl = null;
      
      // If there's a new profile image, upload it first
      if (formData.profileImage && formData.profileImage.startsWith('file:')) {
        const imageFormData = new FormData();
        const imageName = formData.profileImage.split('/').pop();
        const imageType = 'image/' + (imageName.split('.').pop() || 'jpeg');
        
        imageFormData.append('profileImage', {
          uri: formData.profileImage,
          name: imageName,
          type: imageType,
        });

        try {
          const imageUploadResponse = await apiService.updateUserProfile(imageFormData);
          if (imageUploadResponse.success && imageUploadResponse.data?.profileImage) {
            profileImageUrl = imageUploadResponse.data.profileImage;
          }
        } catch (imageError) {
          console.error('Image upload error:', imageError);
          // Continue with profile update even if image upload fails
        }
      }

      // Prepare profile data
      const profileData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        districtId: formData.districtId,
        talukaId: formData.talukaId,
        villageId: formData.villageId,
        locationString: formData.locationString,
        profileImage: profileImageUrl || formData.profileImage,
      };

      // Update profile
      const response = await apiService.updateUserProfile(profileData);
      
      if (response.success) {
        // Show success message and wait for user acknowledgment
        await new Promise((resolve) => {
          Alert.alert(
            'સફળતા',
            'પ્રોફાઇલ સફળતાપૂર્વક અપડેટ થયું',
            [
              {
                text: 'ઠીક છે',
                onPress: () => {
                  resolve();
                  // Navigate back and refresh Account screen
                  navigation.navigate('Account', { refresh: Date.now() });
                }
              }
            ],
            { cancelable: false }
          );
        });
      } else {
        Alert.alert('ભૂલ', response.message || 'અપડેટ નિષ્ફળ થયું');
      }
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('ભૂલ', 'પ્રોફાઇલ અપડેટ કરવામાં સમસ્યા');
    } finally {
      setLoading(false);
    }
  };

  const openModal = async (type) => {
    setModalType(type);

    if (type === 'district') {
      // fetch districts if not loaded
      const list = districts.length ? districts : await loadDistricts();
      setModalData(list || []);
      setModalVisible(true);
      return;
    }

    if (type === 'taluka') {
      if (!formData.districtId) {
        Alert.alert('ભૂલ', 'કૃપા કરીને પહેલા જિલ્લો પસંદ કરો');
        return;
      }
      // fetch talukas for selected district if not loaded
      const list = talukas.length ? talukas : await loadTalukas(formData.districtId);
      setModalData(list || []);
      setModalVisible(true);
      return;
    }

    if (type === 'village') {
      if (!formData.talukaId) {
        Alert.alert('ભૂલ', 'કૃપા કરીને પહેલા તાલુકો પસંદ કરો');
        return;
      }
      const list = villages.length ? villages : await loadVillages(formData.talukaId);
      setModalData(list || []);
      setModalVisible(true);
      return;
    }
  };

  const handleSelect = async (item) => {
    if (modalType === 'district') {
      setFormData({ ...formData, districtId: item.districtId, talukaId: '', villageId: '' });
      setTalukas([]);
      setVillages([]);
      setSelectedDistrict(item);
      setSelectedTaluka(null);
      setSelectedVillage(null);
      await loadTalukas(item.districtId);
    } else if (modalType === 'taluka') {
      setFormData({ ...formData, talukaId: item.talukaId, villageId: '' });
      setSelectedTaluka(item);
      setSelectedVillage(null);
      await loadVillages(item.talukaId);
    } else if (modalType === 'village') {
      setFormData({ ...formData, villageId: item.villageId });
      setSelectedVillage(item);
    }
    setModalVisible(false);
  };

  if (initialLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={{ marginTop: 10 }}>પ્રોફાઇલ લોડ થઈ રહ્યું છે...</Text>
      </View>
    );
  }

  const getSelectedName = (list, id, nameKey, idKey) => {
    const item = list.find((x) => String(x[idKey]) === String(id));
    return getItemName(item);
  };

  // Generic helper: pick a display name for an item, preferring Gujarati keys
  const getItemName = (item) => {
    if (!item) return '';
    // prefer keys that contain 'gujar' (Gujarati labels)
    const keys = Object.keys(item);
    for (const k of keys) {
      if (k.toLowerCase().includes('gujar') && typeof item[k] === 'string' && item[k].trim()) {
        return item[k];
      }
    }
    // fallback common keys
    const fallbacks = ['districtName', 'talukaName', 'villageName', 'name', 'displayName', 'title'];
    for (const fk of fallbacks) {
      if (item[fk] && typeof item[fk] === 'string') return item[fk];
    }
    // last resort: return first string field that's not an id
    for (const k of keys) {
      if (k.toLowerCase().includes('id')) continue;
      if (typeof item[k] === 'string' && item[k].trim()) return item[k];
    }
    return '';
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />


      {/* Professional Profile Header */}
      <View style={styles.profileHeaderContainer}>
        <TouchableOpacity onPress={pickImage} style={styles.profileImageWrapper}>
          {formData.profileImage ? (
            <Image source={{ uri: formData.profileImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Text style={styles.profileImageInitial}>
                {formData.firstName ? formData.firstName.charAt(0).toUpperCase() : 'U'}
              </Text>
            </View>
          )}
          <View style={styles.editIconWrapper}>
            <Text style={styles.editIcon}>✏️</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.profileName}>{formData.firstName} {formData.lastName}</Text>
        <Text style={styles.profileMobile}>{formData.mobile}</Text>
      </View>

      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>પ્રોફાઇલ એડિટ કરો</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content}>
        {/* Form fields */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>પ્રથમ નામ</Text>
          <TextInput
            style={styles.input}
            value={formData.firstName}
            onChangeText={(text) => setFormData({ ...formData, firstName: text })}
            placeholder="તમારું પ્રથમ નામ દાખલ કરો"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>છેલ્લું નામ</Text>
          <TextInput
            style={styles.input}
            value={formData.lastName}
            onChangeText={(text) => setFormData({ ...formData, lastName: text })}
            placeholder="તમારું છેલ્લું નામ દાખલ કરો"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>મોબાઇલ નંબર</Text>
          <TextInput style={styles.input} value={formData.mobile} editable={false} />
        </View>

        {/* Dropdowns */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>રાજ્ય</Text>
          <TouchableOpacity style={styles.dropdown} disabled>
            <Text style={styles.dropdownText}>Gujarat</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>જિલ્લો</Text>
          <TouchableOpacity style={styles.dropdown} onPress={() => openModal('district')}>
            <Text style={styles.dropdownText}>
              {getItemName(selectedDistrict) || getSelectedName(districts, formData.districtId, 'districtName', 'districtId') || 'જિલ્લો પસંદ કરો'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>તાલુકો</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => openModal('taluka')}
                disabled={!formData.districtId}
              >
                <Text style={styles.dropdownText}>
                  {getItemName(selectedTaluka) || getSelectedName(talukas, formData.talukaId, 'talukaName', 'talukaId') || 'તાલુકો પસંદ કરો'}
                </Text>
              </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>ગામ</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => openModal('village')}
                disabled={!formData.talukaId}
              >
                <Text style={styles.dropdownText}>
                  {getItemName(selectedVillage) || getSelectedName(villages, formData.villageId, 'villageName', 'villageId') || 'ગામ પસંદ કરો'}
                </Text>
              </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>સરનામું</Text>
          <TextInput
            style={styles.input}
            value={formData.locationString}
            onChangeText={(text) => setFormData({ ...formData, locationString: text })}
            placeholder="તમારું સરનામું દાખલ કરો" editable={false}
          />
        </View>

        {/* Save button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
          <Text style={styles.saveButtonText}>{loading ? 'સાચવી રહ્યું છે...' : 'સાચવો'}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal for dropdown list */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <FlatList
              data={modalData}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={styles.modalItemText}>{getItemName(item)}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalClose}>
              <Text style={styles.modalCloseText}>બંધ કરો</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  profileHeaderContainer: {
    backgroundColor: '#4CAF50',
    padding: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  profileImageWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  profileImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  profileImagePlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageInitial: {
    fontSize: 40,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
    textAlign: 'center',
  },
  profileMobile: {
    fontSize: 16,
    color: '#E8F5E9',
    marginBottom: 10,
  },
  editIconWrapper: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4CAF50',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  editIcon: {
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    paddingHorizontal: 10,
  },
  backButton: { paddingRight: 10 },
  backIcon: { color: '#fff', fontSize: 22 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', flex: 1, textAlign: 'center' },
  headerRight: { width: 25 },
  content: { padding: 15 },
  formGroup: { marginBottom: 15 },
  label: { marginBottom: 5, color: '#333', fontWeight: '500' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  dropdownText: { fontSize: 16, color: '#333' },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 10,
    maxHeight: '70%',
  },
  modalItem: { paddingVertical: 12, paddingHorizontal: 20 },
  modalItemText: { fontSize: 16, color: '#333' },
  modalClose: { paddingVertical: 12, alignItems: 'center', borderTopWidth: 1, borderColor: '#eee' },
  modalCloseText: { fontSize: 16, color: '#4CAF50', fontWeight: 'bold' },
});