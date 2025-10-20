import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Modal,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import { apiService } from '../config/api';

export default function UserDetailsScreen({ navigation, route }) {
  const { phone } = route.params;
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  
  const [districts, setDistricts] = useState([]);
  const [talukas, setTalukas] = useState([]);
  const [villages, setVillages] = useState([]);
  
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedTaluka, setSelectedTaluka] = useState(null);
  const [selectedVillage, setSelectedVillage] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(true);
  const [loadingTalukas, setLoadingTalukas] = useState(false);
  const [loadingVillages, setLoadingVillages] = useState(false);

  // Modal states
  const [districtModalVisible, setDistrictModalVisible] = useState(false);
  const [talukaModalVisible, setTalukaModalVisible] = useState(false);
  const [villageModalVisible, setVillageModalVisible] = useState(false);

  // Load districts on mount
  useEffect(() => {
    loadDistricts();
  }, []);

  const loadDistricts = async () => {
    try {
      const response = await apiService.getDistricts();
      if (response.success) {
        setDistricts(response.data);
      }
    } catch (error) {
      Alert.alert('ભૂલ', 'જીલ્લા લોડ કરવામાં સમસ્યા');
    } finally {
      setLoadingDistricts(false);
    }
  };

  const loadTalukas = async (districtId) => {
    setLoadingTalukas(true);
    setTalukas([]);
    setVillages([]);
    setSelectedTaluka(null);
    setSelectedVillage(null);
    
    try {
      const response = await apiService.getTalukas(districtId);
      if (response.success) {
        setTalukas(response.data);
      }
    } catch (error) {
      Alert.alert('ભૂલ', 'તાલુકા લોડ કરવામાં સમસ્યા');
    } finally {
      setLoadingTalukas(false);
    }
  };

  const loadVillages = async (talukaId) => {
    setLoadingVillages(true);
    setVillages([]);
    setSelectedVillage(null);
    
    try {
      const response = await apiService.getVillages(talukaId);
      if (response.success) {
        setVillages(response.data);
      }
    } catch (error) {
      Alert.alert('ભૂલ', 'ગામ લોડ કરવામાં સમસ્યા');
    } finally {
      setLoadingVillages(false);
    }
  };

  const handleDistrictSelect = (district) => {
    setSelectedDistrict(district);
    setDistrictModalVisible(false);
    loadTalukas(district.districtId);
  };

  const handleTalukaSelect = (taluka) => {
    setSelectedTaluka(taluka);
    setTalukaModalVisible(false);
    loadVillages(taluka.talukaId);
  };

  const handleVillageSelect = (village) => {
    setSelectedVillage(village);
    setVillageModalVisible(false);
  };

  const handleSubmit = async () => {
    // Validation
    if (!firstName || !lastName) {
      Alert.alert('ભૂલ', 'કૃપા કરીને નામ દાખલ કરો');
      return;
    }
    if (!gender) {
      Alert.alert('ભૂલ', 'કૃપા કરીને લિંગ પસંદ કરો');
      return;
    }
    if (!selectedDistrict || !selectedTaluka || !selectedVillage) {
      Alert.alert('ભૂલ', 'કૃપા કરીને સ્થળ પસંદ કરો');
      return;
    }

    setLoading(true);

    const userData = {
      mobile: phone,
      firstName: firstName,
      lastName: lastName,
      email: 'kharidvechan@gmail.com', // Static email
      password: 'Test@123', // Static password
      districtId: selectedDistrict.districtId,
      talukaId: selectedTaluka.talukaId,
      villageId: selectedVillage.villageId,
      dateOfBirth: '1990-01-01T00:00:00Z', // Default date
      gender: gender,
    };

    try {
      const response = await apiService.registerUser(userData);

      if (response.success) {
        // After successful registration, try to login and store credentials
        try {
          const loginResponse = await apiService.loginUser(phone, 'Test@123');
          if (loginResponse.success) {
            await AsyncStorage.setItem('authToken', loginResponse.data.accessToken);
            await AsyncStorage.setItem('userData', JSON.stringify(loginResponse.data.user));
          }
        } catch (loginError) {
          console.error('Auto-login failed:', loginError);
        }

        Alert.alert(
          'સફળતા!',
          'તમારું એકાઉન્ટ બની ગયું છે!',
          [
            {
              text: 'ઠીક છે',
              onPress: () => {
                // Reset navigation stack to Dashboard (remove all previous screens)
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Dashboard' }],
                  })
                );
              }
            }
          ]
        );
      } else {
        Alert.alert('ભૂલ', response.message || 'રજિસ્ટ્રેશનમાં સમસ્યા');
      }
    } catch (error) {
      Alert.alert('ભૂલ', 'કનેક્શન સમસ્યા. કૃપા કરીને ફરી પ્રયાસ કરો.');
      console.error('Registration Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Dropdown Modal Component
  const DropdownModal = ({ visible, onClose, data, onSelect, title, loading, labelKey }) => (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          {loading ? (
            <View style={styles.modalLoading}>
              <ActivityIndicator size="large" color="#4CAF50" />
            </View>
          ) : (
            <FlatList
              data={data}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => onSelect(item)}
                >
                  <Text style={styles.modalItemText}>{item[labelKey]}</Text>
                </TouchableOpacity>
              )}
              style={styles.modalList}
            />
          )}
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerIcon}>👤</Text>
          <Text style={styles.title}>તમારી માહિતી</Text>
          <Text style={styles.subtitle}>રજિસ્ટ્રેશન પૂર્ણ કરો</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Name Section */}
          <View style={styles.nameRow}>
            <View style={styles.halfInput}>
              <Text style={styles.label}>પ્રથમ નામ *</Text>
              <TextInput
                style={styles.input}
                placeholder="રાજુ"
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>
            
            <View style={styles.halfInput}>
              <Text style={styles.label}>અટક *</Text>
              <TextInput
                style={styles.input}
                placeholder="ગરેજા"
                value={lastName}
                onChangeText={setLastName}
              />
            </View>
          </View>

          {/* Gender */}
          <Text style={styles.label}>લિંગ *</Text>
          <View style={styles.genderContainer}>
            <TouchableOpacity
              style={[
                styles.genderButton,
                gender === 'M' && styles.genderButtonActive,
              ]}
              onPress={() => setGender('M')}
            >
              <Text style={[
                styles.genderText,
                gender === 'M' && styles.genderTextActive,
              ]}>
                પુરુષ
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.genderButton,
                gender === 'F' && styles.genderButtonActive,
              ]}
              onPress={() => setGender('F')}
            >
              <Text style={[
                styles.genderText,
                gender === 'F' && styles.genderTextActive,
              ]}>
                સ્ત્રી
              </Text>
            </TouchableOpacity>
          </View>

          {/* District Dropdown */}
          <Text style={styles.label}>જીલ્લો *</Text>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setDistrictModalVisible(true)}
            disabled={loadingDistricts}
          >
            <Text style={[
              styles.dropdownButtonText,
              !selectedDistrict && styles.dropdownPlaceholder
            ]}>
              {selectedDistrict ? selectedDistrict.districtNameGujarati : 'જીલ્લો પસંદ કરો'}
            </Text>
            <Text style={styles.dropdownIcon}>▼</Text>
          </TouchableOpacity>

          {/* Taluka Dropdown */}
          {selectedDistrict && (
            <>
              <Text style={styles.label}>તાલુકો *</Text>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setTalukaModalVisible(true)}
                disabled={loadingTalukas}
              >
                <Text style={[
                  styles.dropdownButtonText,
                  !selectedTaluka && styles.dropdownPlaceholder
                ]}>
                  {selectedTaluka ? selectedTaluka.talukaNameGujarati : 'તાલુકો પસંદ કરો'}
                </Text>
                <Text style={styles.dropdownIcon}>▼</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Village Dropdown */}
          {selectedTaluka && (
            <>
              <Text style={styles.label}>ગામ *</Text>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setVillageModalVisible(true)}
                disabled={loadingVillages}
              >
                <Text style={[
                  styles.dropdownButtonText,
                  !selectedVillage && styles.dropdownPlaceholder
                ]}>
                  {selectedVillage ? selectedVillage.villageNameGujarati : 'ગામ પસંદ કરો'}
                </Text>
                <Text style={styles.dropdownIcon}>▼</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Info Box */}
          <View style={styles.infoBox}>
            <Text style={styles.infoIcon}>🌾</Text>
            <Text style={styles.infoText}>
              તમારી માહિતી સુરક્ષિત રાખવામાં આવશે અને ખેતી સંબંધિત સેવાઓ પૂરી પાડવા માટે જ ઉપયોગ થશે.
            </Text>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'રજિસ્ટર થઈ રહ્યું છે...' : 'આગળ'}
            </Text>
          </TouchableOpacity>

          {/* Farmer Support */}
          <View style={styles.supportBox}>
            <Text style={styles.supportEmoji}>🤝</Text>
            <Text style={styles.supportText}>
              ખેડૂતો અને ખરીદદારોને જોડતું પ્લેટફોર્મ{'\n'}
              <Text style={styles.supportSubtext}>સીધો સંપર્ક, વધુ લાભ</Text>
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Dropdown Modals */}
      <DropdownModal
        visible={districtModalVisible}
        onClose={() => setDistrictModalVisible(false)}
        data={districts}
        onSelect={handleDistrictSelect}
        title="જીલ્લો પસંદ કરો"
        loading={loadingDistricts}
        labelKey="districtNameGujarati"
      />

      <DropdownModal
        visible={talukaModalVisible}
        onClose={() => setTalukaModalVisible(false)}
        data={talukas}
        onSelect={handleTalukaSelect}
        title="તાલુકો પસંદ કરો"
        loading={loadingTalukas}
        labelKey="talukaNameGujarati"
      />

      <DropdownModal
        visible={villageModalVisible}
        onClose={() => setVillageModalVisible(false)}
        data={villages}
        onSelect={handleVillageSelect}
        title="ગામ પસંદ કરો"
        loading={loadingVillages}
        labelKey="villageNameGujarati"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 25,
    paddingTop: 50,
    paddingBottom: 20,
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 60,
    marginBottom: 15,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  form: {
    paddingHorizontal: 25,
    paddingBottom: 30,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  halfInput: {
    flex: 1,
    marginRight: 10,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 10,
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
  genderContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: '#C8E6C9',
    borderRadius: 10,
    marginRight: 10,
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  genderButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  genderText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  genderTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#C8E6C9',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#FAFAFA',
    marginBottom: 15,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownPlaceholder: {
    color: '#999',
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#666',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF9C4',
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FBC02D',
  },
  infoIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#F57F17',
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: '#A5D6A7',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  supportBox: {
    flexDirection: 'row',
    backgroundColor: '#E8F5E9',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  supportEmoji: {
    fontSize: 32,
    marginRight: 15,
  },
  supportText: {
    flex: 1,
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '600',
    lineHeight: 20,
  },
  supportSubtext: {
    fontSize: 12,
    color: '#66BB6A',
    fontWeight: 'normal',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666',
  },
  modalLoading: {
    padding: 40,
    alignItems: 'center',
  },
  modalList: {
    paddingHorizontal: 10,
  },
  modalItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
  },
});